// Generates every token artefact from the Figma source dumps in tokens/source/.
// Nothing downstream holds a hand-copied token value.
//
//   tokens/source/figma-variables.txt  ->  src/tokens/generated/tokens.css   (CSS variables used by previews)
//   tokens/source/figma-styles.json    ->  src/tokens/generated/tokens.ts    (typed data for the portal)
//                                          public/tokens/tokens.css          (export)
//                                          public/tokens/tokens.json         (export, schema in docs/token-schema.md)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const write = (p, s) => { mkdirSync(dirname(resolve(root, p)), { recursive: true }); writeFileSync(resolve(root, p), s); };

const SEMANTIC = new Set(['Colour Semantic', 'Size Semantic']);
const PX = new Set(['Dimension Primitives', 'Size Semantic', 'Border Width', 'Radius Primitives']);
const WEIGHTS = { Regular: 400, Medium: 500, SemiBold: 600 };
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
export const cssVarName = (name) => '--' + name.replace(/[\/\s]+/g, '-');

// ---- parse variables ------------------------------------------------------
const tokens = [];
let collection = null;
for (const raw of read('tokens/source/figma-variables.txt').split('\n')) {
  const line = raw.trim();
  if (!line) continue;
  if (line.startsWith('## ')) { collection = line.slice(3).trim(); continue; }
  if (line.startsWith('#')) continue;
  const m = line.match(/^(\S+) = (.*?)(?: \/\/ (.*))?$/);
  if (!m || !collection) throw new Error('Cannot parse line: ' + line);
  const [, name, value, description] = m;
  const t = { name, collection, kind: SEMANTIC.has(collection) ? 'semantic' : 'primitive', cssVar: cssVarName(name) };
  if (description) t.description = decode(description);
  if (value.startsWith('-> ')) t.alias = value.slice(3).trim();
  else if (value.startsWith('#')) {
    const [hex, a] = value.split(' a=');
    t.type = 'color'; t.hex = hex; t.alpha = a === undefined ? 1 : Number(a);
  } else if (!Number.isNaN(Number(value))) { t.type = 'number'; t.raw = Number(value); }
  else { t.type = 'string'; t.raw = value; }
  tokens.push(t);
}
const byName = new Map();
for (const t of tokens) {
  if (byName.has(t.name)) throw new Error('Duplicate variable name: ' + t.name);
  byName.set(t.name, t);
}
const rootOf = (t, seen = []) => {
  if (!t.alias) return t;
  if (seen.includes(t.name)) throw new Error('Alias cycle at ' + t.name);
  const target = byName.get(t.alias);
  if (!target) throw new Error(`Alias target not found: ${t.name} -> ${t.alias}`);
  return rootOf(target, [...seen, t.name]);
};
const colorCss = (t) => {
  if (t.alpha === 1) return t.hex;
  const n = parseInt(t.hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${t.alpha})`;
};
const literalCss = (t, forCollection) => {
  if (t.type === 'color') return colorCss(t);
  if (t.type === 'number') {
    if (PX.has(forCollection)) return t.raw + 'px';
    if (/^font\/(lineHeight|letterSpacing)\//.test(t.name)) return t.raw + 'px';
    return String(t.raw);
  }
  if (/^font\/family\//.test(t.name)) return `"${t.raw}"`;
  if (/^font\/weight\//.test(t.name)) return String(WEIGHTS[t.raw] ?? t.raw);
  return `"${t.raw}"`;
};
for (const t of tokens) {
  const r = rootOf(t);
  t.type = r.type;
  t.resolved = literalCss(r, r.collection);          // final CSS value
  t.figmaValue = t.alias ? null : (r.type === 'color' ? colorCss(r) : r.raw);
}

// ---- styles ---------------------------------------------------------------
const styles = JSON.parse(read('tokens/source/figma-styles.json'));
const inv = ([[a, c, e], [b, d, f]]) => { const det = a * d - b * c; return (x, y) => [(d * (x - e) - c * (y - f)) / det, (-b * (x - e) + a * (y - f)) / det]; };
const r4 = (n) => Math.round(n * 10000) / 10000;
// A Figma gradient lives in the node's normalised box. An SVG with objectBoundingBox units and
// preserveAspectRatio="none" stretches the same way, so this reproduces the paint at any size.
const gradientSvg = (g) => {
  let defs = '', body = '';
  g.paints.forEach((p, i) => {
    const op = p.opacity === undefined ? '' : ` opacity='${p.opacity}'`;
    if (p.type === 'SOLID') { body += `<rect width='1' height='1' fill='${p.color}'${op}/>`; return; }
    const at = inv(p.transform);
    const stops = p.stops.map((s) => `<stop offset='${s.position}' stop-color='${s.color}'${s.a === undefined ? '' : ` stop-opacity='${s.a}'`}/>`).join('');
    if (p.type === 'GRADIENT_LINEAR') {
      const [x1, y1] = at(0, 0.5), [x2, y2] = at(1, 0.5);
      defs += `<linearGradient id='g${i}' x1='${r4(x1)}' y1='${r4(y1)}' x2='${r4(x2)}' y2='${r4(y2)}'>${stops}</linearGradient>`;
    } else {
      // Radial: unit circle centred at (0.5, 0.5) with radius 0.5 in gradient space, mapped back to the box.
      const [[a, c, e], [b, d, f]] = p.transform;
      const det = a * d - b * c;
      const m = [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det].map(r4).join(' ');
      defs += `<radialGradient id='g${i}' cx='0.5' cy='0.5' r='0.5' gradientTransform='matrix(${m})'>${stops}</radialGradient>`;
    }
    body += `<rect width='1' height='1' fill='url(%23g${i})'${op}/>`;
  });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' preserveAspectRatio='none'><defs>${defs}</defs>${body}</svg>`;
  return `url("data:image/svg+xml,${svg.replace(/#(?=[0-9a-fA-F]{6})/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
};
const rgba = ([r, g, b, a]) => `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
const gradients = styles.gradients.map((g) => ({ ...g, cssVar: cssVarName(g.name), css: gradientSvg(g) }));
const effects = styles.effects.map((e) => {
  const shadows = e.layers.filter((l) => l.type === 'DROP_SHADOW');
  return { ...e, cssVar: cssVarName(e.name), css: shadows.length ? shadows.map((l) => `${l.x}px ${l.y}px ${l.radius}px ${l.spread}px ${rgba(l.color)}`).join(', ') : null };
});
const textStyles = styles.textStyles.map((s) => ({ ...s, cssClass: 'ts-' + s.name.replace(/^typography\//, '').replace(/\//g, '-') }));

// ---- tokens.css -----------------------------------------------------------
const collections = [...new Set(tokens.map((t) => t.collection))];
let css = '/* GENERATED by scripts/build-tokens.mjs from tokens/source/. Do not edit. */\n:root {\n';
for (const c of collections) {
  css += `\n  /* ${c} */\n`;
  for (const t of tokens.filter((x) => x.collection === c)) css += `  ${t.cssVar}: ${t.alias ? `var(${cssVarName(t.alias)})` : t.resolved};\n`;
}
css += '\n  /* Paint styles (gradients). Use as background-image with background-size: 100% 100%. */\n';
for (const g of gradients) css += `  ${g.cssVar}: ${g.css};\n`;
css += '\n  /* Effect styles (drop shadows). glass/default has no CSS equivalent and is not exported. */\n';
for (const e of effects) if (e.css) css += `  ${e.cssVar}: ${e.css};\n`;
css += '}\n\n/* Text styles */\n';
for (const s of textStyles) {
  css += `.${s.cssClass} { font-family: "${s.family}", sans-serif; font-weight: ${WEIGHTS[s.style]}; font-size: ${s.size}px; line-height: ${s.lineHeight === 'auto' ? 'normal' : s.lineHeight + 'px'}; letter-spacing: ${s.letterSpacing.endsWith('%') ? parseFloat(s.letterSpacing) / 100 + 'em' : s.letterSpacing}; }\n`;
}
write('src/tokens/generated/tokens.css', css);
write('public/tokens/tokens.css', css);

// ---- tokens.json (W3C Design Tokens format, see docs/token-schema.md) -------
const json = { $description: 'BaaS Web Design System tokens. Generated from Figma file AfiYjkdFU2Flc69Qgpw7yv. See docs/token-schema.md.' };
const setPath = (obj, path, leaf) => { let o = obj; path.slice(0, -1).forEach((k) => { o = o[k] ??= {}; }); o[path.at(-1)] = leaf; };
for (const t of tokens) {
  const leaf = { $type: t.type === 'color' ? 'color' : t.type === 'number' ? 'number' : 'string' };
  leaf.$value = t.alias ? `{${byName.get(t.alias).collection}.${t.alias.split('/').join('.')}}` : t.figmaValue;
  if (t.description) leaf.$description = t.description;
  leaf.$extensions = { 'com.figma': { collection: t.collection, variable: t.name, kind: t.kind }, 'baas.portal': { cssVar: t.cssVar, resolved: t.resolved } };
  setPath(json, [t.collection, ...t.name.split('/')], leaf);
}
json['Paint Styles'] = Object.fromEntries(styles.gradients.map((g) => [g.name, { $type: 'gradient', $value: g.paints, ...(g.description ? { $description: g.description } : {}), $extensions: { 'com.figma': { style: g.name } } }]));
json['Effect Styles'] = Object.fromEntries(styles.effects.map((e) => [e.name, { $type: 'shadow', $value: e.layers, ...(e.description ? { $description: e.description } : {}), $extensions: { 'com.figma': { style: e.name } } }]));
json['Text Styles'] = Object.fromEntries(styles.textStyles.map((s) => [s.name, { $type: 'typography', $value: { fontFamily: s.family, fontStyle: s.style, fontSize: s.size, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing }, $extensions: { 'com.figma': { style: s.name } } }]));
write('public/tokens/tokens.json', JSON.stringify(json, null, 2) + '\n');

// ---- tokens.ts ------------------------------------------------------------
const ts = `// GENERATED by scripts/build-tokens.mjs from tokens/source/. Do not edit.
export type TokenKind = 'primitive' | 'semantic';
export type TokenType = 'color' | 'number' | 'string';
export interface Token {
  /** Exact Figma variable name. */ name: string;
  /** Figma collection. */ collection: string;
  kind: TokenKind;
  type: TokenType;
  cssVar: string;
  /** Name of the variable this one aliases, if any. */ alias?: string;
  /** Final CSS value after following aliases. */ resolved: string;
  /** Value stored in Figma for a non-alias variable. */ figmaValue: string | number | null;
  description?: string;
}
export interface GradientStyle { name: string; cssVar: string; css: string; description?: string; paints: unknown[] }
export interface EffectStyle { name: string; cssVar: string; css: string | null; description?: string; layers: unknown[] }
export interface TextStyle { name: string; cssClass: string; family: string; style: string; size: number; lineHeight: number | 'auto'; letterSpacing: string }

export const collections: string[] = ${JSON.stringify(collections)};
export const tokens: Token[] = ${JSON.stringify(tokens.map(({ name, collection, kind, type, cssVar, alias, resolved, figmaValue, description }) => ({ name, collection, kind, type, cssVar, alias, resolved, figmaValue, description })), null, 1)};
export const gradients: GradientStyle[] = ${JSON.stringify(gradients, null, 1)};
export const effects: EffectStyle[] = ${JSON.stringify(effects, null, 1)};
export const textStyles: TextStyle[] = ${JSON.stringify(textStyles, null, 1)};
export const tokenByName: Record<string, Token> = Object.fromEntries(tokens.map((t) => [t.name, t]));
`;
write('src/tokens/generated/tokens.ts', ts);

const counts = collections.map((c) => `${c}: ${tokens.filter((t) => t.collection === c).length}`).join(', ');
console.log(`tokens: ${tokens.length} variables (${counts}); ${gradients.length} gradients, ${effects.length} effects, ${textStyles.length} text styles`);
