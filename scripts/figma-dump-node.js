// Read-only Figma Plugin API script used while implementing components: prints a compact spec tree of nodes
// (layout, sizes, fills/strokes with variable names, styles, text, instances). Set PAGE, IDS, START before running.
const page = await figma.getNodeByIdAsync(PAGE); await page.loadAsync();
const STOP = new Set(STOPS);
const vc = {}, sc = {};
const vn = async (id) => { if (!(id in vc)) { const v = await figma.variables.getVariableByIdAsync(id); vc[id] = v ? v.name : id; } return vc[id]; };
const sn = async (id) => { if (!id || typeof id !== 'string') return ''; if (!(id in sc)) { const s = await figma.getStyleByIdAsync(id); sc[id] = s ? s.name : '?'; } return sc[id]; };
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const r2 = (x) => Math.round(x * 100) / 100;
const paints = async (arr, styleId) => {
  if (styleId && typeof styleId === 'string') return 'S:' + await sn(styleId);
  if (!Array.isArray(arr)) return 'mixed';
  const o = [];
  for (const p of arr) { if (p.visible === false) continue;
    if (p.type === 'SOLID') { const b = p.boundVariables && p.boundVariables.color; o.push((b ? await vn(b.id) : hex(p.color)) + (p.opacity !== undefined && p.opacity < 1 ? '@' + r2(p.opacity) : '')); }
    else o.push(p.type.replace('GRADIENT_', 'G_') + (p.opacity < 1 ? '@' + r2(p.opacity) : '')); }
  return o.join('+');
};
const out = [];
const walk = async (n, d, top) => {
  let s = '  '.repeat(d) + n.type.slice(0, 4) + ' "' + n.name + '" ' + r2(n.width) + 'x' + r2(n.height);
  if (n.visible === false) { out.push(s + ' HIDDEN'); return; }
  const par = n.parent;
  if (par && 'layoutMode' in par && par.layoutMode !== 'NONE' && n.layoutPositioning !== 'ABSOLUTE') { if ('layoutSizingHorizontal' in n) s += ' sz:' + n.layoutSizingHorizontal[0] + n.layoutSizingVertical[0]; if (n.layoutGrow) s += ' grow'; }
  else if (!top) s += ' @' + r2(n.x) + ',' + r2(n.y);
  if (n.layoutMode && n.layoutMode !== 'NONE') s += ' ' + n.layoutMode[0] + (n.layoutWrap === 'WRAP' ? 'wrap' : '') + ' gap' + n.itemSpacing + ' pad' + [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].join('/') + ' ' + n.primaryAxisAlignItems.slice(0, 3) + '/' + n.counterAxisAlignItems.slice(0, 3);
  if ('fills' in n) { const f = await paints(n.fills, n.fillStyleId); if (f) s += ' fill=' + f; }
  if ('strokes' in n && n.strokes.length) s += ' stroke=' + await paints(n.strokes, n.strokeStyleId) + ' w' + (typeof n.strokeWeight === 'number' ? r2(n.strokeWeight) : [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight].join('/')) + ' ' + n.strokeAlign.slice(0, 3);
  if ('effects' in n && n.effects.length) s += ' fx=' + ((await sn(n.effectStyleId)) || n.effects.map((e) => e.type).join(','));
  if ('opacity' in n && n.opacity < 1) s += ' op=' + r2(n.opacity);
  if ('cornerRadius' in n) { if (typeof n.cornerRadius === 'number') { if (n.cornerRadius) s += ' r=' + n.cornerRadius; } else s += ' r=' + [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius].join('/'); }
  if (n.clipsContent && n.type === 'FRAME') s += ' clip';
  if (n.rotation) s += ' rot=' + r2(n.rotation);
  if (n.boundVariables) { const bv = []; for (const k of Object.keys(n.boundVariables)) { const b = n.boundVariables[k]; if (b && b.id && !/Radius|stroke.*Weight/.test(k)) bv.push(k.replace('padding', 'p').replace('itemSpacing', 'gap') + ':' + await vn(b.id)); else if (b && b.id && (k === 'topLeftRadius' || k === 'strokeTopWeight')) bv.push(k.replace('topLeft', '').replace('strokeTop', 'stroke') + ':' + await vn(b.id)); } if (bv.length) s += ' bv[' + bv.join(',') + ']'; }
  if (n.type === 'TEXT') { const ts = await sn(n.textStyleId); s += ' ts=' + (ts || (typeof n.fontName === 'object' && n.fontName.family ? n.fontName.family + ' ' + n.fontName.style + ' ' + String(n.fontSize) + '/' + (n.lineHeight.unit === 'AUTO' ? 'auto' : r2(n.lineHeight.value)) : 'mixed')) + ' ' + n.textAlignHorizontal.slice(0, 1) + (n.textAutoResize === 'WIDTH_AND_HEIGHT' ? '' : ' ' + n.textAutoResize) + (n.textTruncation === 'ENDING' ? ' trunc' : '') + ' "' + n.characters.replace(/\n/g, '⏎').slice(0, 90) + '"'; }
  let stop = false;
  if (n.type === 'INSTANCE') { const mc = await n.getMainComponentAsync(); const setName = mc ? (mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name) : '?'; s += ' <' + setName + (mc && mc.parent && mc.parent.type === 'COMPONENT_SET' ? ' ' + mc.name : '') + '>'; const cp = n.componentProperties; const pr = []; for (const k in cp) if (cp[k].type !== 'VARIANT') pr.push(k.split('#')[0] + '=' + String(cp[k].value).slice(0, 40)); if (pr.length) s += ' props{' + pr.join('; ') + '}'; stop = !top && STOP.has(setName.split(' ')[0]); }
  out.push(s);
  if (!stop && 'children' in n && d < 9) for (const c of n.children) await walk(c, d + 1, false);
};
for (const id of IDS) { const n = await figma.getNodeByIdAsync(id); if (n) await walk(n, 0, true); out.push(''); }
const text = out.join('\n');
return { len: text.length, text: text.slice(START, START + 19000) };
