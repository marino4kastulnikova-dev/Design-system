# Figma extraction scripts

Read-only Plugin API scripts used to produce `tokens/source/`. Run them against the Figma file (through the Figma
connector's script tool or a plugin console). They do not modify the file. Results over 20 KB must be split, for
example by collection.

## Variables → `tokens/source/figma-variables.txt`

Write one `## <collection name>` heading per collection, then the returned lines.

```js
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = {}; for (const v of vars) byId[v.id] = v;
const fmt = (val) => {
  if (val && val.type === 'VARIABLE_ALIAS') { const t = byId[val.id]; return '-> ' + (t ? t.name : val.id); }
  if (val && typeof val === 'object' && 'r' in val) {
    const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
    return '#' + h(val.r) + h(val.g) + h(val.b) + (val.a < 1 ? ' a=' + Math.round(val.a * 1000) / 1000 : '');
  }
  return typeof val === 'number' ? Math.round(val * 1000) / 1000 : val;
};
return cols.map((c) => ({
  collection: c.name, modes: c.modes.map((m) => m.name),
  vars: c.variableIds.map((id) => { const v = byId[id];
    return v.name + ' = ' + c.modes.map((m) => fmt(v.valuesByMode[m.modeId])).join(' | ') + (v.description ? ' // ' + v.description : ''); }),
}));
```

If a collection gains a second mode, the `a | b` output no longer fits the single-mode format: extend
`scripts/build-tokens.mjs` before importing it.

## Styles → `tokens/source/figma-styles.json`

```js
const r = (x) => Math.round(x * 1000) / 1000;
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const paints = (await figma.getLocalPaintStylesAsync()).map((s) => ({ name: s.name, description: s.description || undefined,
  paints: s.paints.map((p) => p.type === 'SOLID'
    ? { type: p.type, color: hex(p.color), opacity: p.opacity }
    : { type: p.type, opacity: p.opacity < 1 ? r(p.opacity) : undefined, transform: p.gradientTransform.map((row) => row.map(r)),
        stops: p.gradientStops.map((g) => ({ color: hex(g.color), a: g.color.a < 1 ? r(g.color.a) : undefined, position: r(g.position) })) }) }));
const effects = (await figma.getLocalEffectStylesAsync()).map((s) => ({ name: s.name, description: s.description || undefined, layers: s.effects }));
const text = (await figma.getLocalTextStylesAsync()).map((s) => ({ name: s.name, family: s.fontName.family, style: s.fontName.style,
  size: s.fontSize, lineHeight: s.lineHeight.unit === 'AUTO' ? 'auto' : s.lineHeight.value,
  letterSpacing: s.letterSpacing.value + (s.letterSpacing.unit === 'PERCENT' ? '%' : 'px') }));
return { paints, effects, text };
```

Map the result to the keys `gradients`, `effects` (layers as `{type, x, y, radius, spread, color: [r, g, b, a]}`)
and `textStyles` used in the JSON file.
