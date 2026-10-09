// Foundation page "Icons": every glyph of the Figma set "Lucide icons" (212:1410), drawn with the same glyph data as
// the Icon component, plus the size and colour tokens the Icon component uses.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { customGlyphs } from '../../ds/customGlyphs';
import { glyphNames, glyphOrigins, lucideGlyphs } from '../../ds/glyphs.generated';
import { tokenByName, tokens } from '../../tokens/generated/tokens';
import { Callout, CopyChip, useCopy } from '../ui';
import { tokenAnchor } from '../slug';

const sizes = [{ id: 'sm', token: 'size/icon/sm' }, { id: 'md', token: 'size/icon/md' }, { id: 'lg', token: 'size/icon/lg' }] as const;
const colours = tokens.filter((t) => t.collection === 'Colour Semantic' && t.name.startsWith('icon/'));
const px = (name: string) => parseFloat(tokenByName[name]?.resolved ?? '24');
const isDark = (name: string) => name.startsWith('icon/inverse');

function Glyph({ name, size }: { name: string; size: number }) {
  const Lucide = (lucideGlyphs as Record<string, (typeof lucideGlyphs)[keyof typeof lucideGlyphs]>)[name];
  // Same rule as the Icon component: stroke weight = size / 24, which is strokeWidth 1 on Lucide's 24 grid.
  return <span className="p-glyph__art" style={{ width: size, height: size }} aria-hidden="true">{Lucide ? <Lucide size="100%" strokeWidth={1} /> : customGlyphs[name]?.()}</span>;
}

function GlyphTile({ name, size }: { name: string; size: number }) {
  const { copied, copy } = useCopy();
  const origin = glyphOrigins[name] ?? 'lucide';
  return (
    <li id={`glyph-${name}`}>
      <button type="button" className="p-glyph" onClick={() => copy(name)} aria-label={`Copy icon name ${name}`}>
        <Glyph name={name} size={size} />
        <code>{name}</code>
        {origin !== 'lucide' && <span className="p-glyph__origin">{origin}</span>}
        <span className="p-glyph__state" aria-live="polite">{copied ? 'Copied' : ''}</span>
      </button>
    </li>
  );
}

export function IconsFoundationPage() {
  const [filter, setFilter] = useState('');
  const [size, setSize] = useState<(typeof sizes)[number]['id']>('lg');
  const [colour, setColour] = useState('icon/default');
  const f = filter.trim().toLowerCase();
  const list = useMemo(() => glyphNames.filter((n) => n.includes(f)), [f]);
  const nonLucide = glyphNames.filter((n) => glyphOrigins[n]);
  const sizePx = px(sizes.find((s) => s.id === size)!.token);
  const colourValue = tokenByName[colour]?.resolved;

  return (
    <article className="p-article p-article--wide">
      <header className="p-title">
        <p className="p-eyebrow">Foundations</p>
        <h1>Icons</h1>
        <p className="p-lede">{glyphNames.length} glyphs of the Figma set “Lucide icons”. Components never place a glyph directly: they use the <Link to="/components/icons">Icon</Link> component, which sets the size and colour through tokens.</p>
        <dl className="p-meta">
          <div><dt>Source</dt><dd>Figma component set <code>Lucide icons</code> (212:1410), {glyphNames.length} variants; component <Link to="/components/icons">Icon</Link> (292:885)</dd></div>
          <div><dt>Origin</dt><dd>{glyphNames.length - nonLucide.length} from Lucide (lucide.dev); {nonLucide.map((n, i) => <span key={n}>{i > 0 && ', '}<code>{n}</code></span>)} from other sources, as marked in Figma (<code>Property 1</code>)</dd></div>
        </dl>
      </header>

      <h2 id="sizes">Sizes</h2>
      <p>The Icon component has three sizes. The stroke weight scales with the size (size / 24), so a 16 px icon has a thinner line than a 24 px one.</p>
      <div className="p-tablewrap"><table className="p-table">
        <thead><tr><th>Icon size</th><th>Token</th><th>Value</th><th>Sample</th></tr></thead>
        <tbody>{sizes.map((s) => (
          <tr key={s.id} id={tokenAnchor(s.token)}>
            <td><code>{s.id}</code></td>
            <td><CopyChip value={s.token} /></td>
            <td><Link to={`/foundations/dimensions#${tokenAnchor(tokenByName[s.token]?.alias ?? '')}`}><code>{tokenByName[s.token]?.alias}</code></Link> <span className="p-muted">{tokenByName[s.token]?.resolved}</span></td>
            <td style={{ color: tokenByName['icon/default']?.resolved }}><Glyph name="house" size={px(s.token)} /></td>
          </tr>
        ))}</tbody>
      </table></div>

      <h2 id="colours">Colours</h2>
      <p>The <code>color</code> property of Icon maps to these semantic tokens. Descriptions are copied from Figma. <code>google</code> and <code>apple</code> keep their own fills.</p>
      <div className="p-tablewrap"><table className="p-table">
        <thead><tr><th>Sample</th><th>Token</th><th>Value</th><th>Purpose in Figma</th></tr></thead>
        <tbody>{colours.map((t) => (
          <tr key={t.name}>
            <td><span className={`p-glyph__chip${isDark(t.name) ? ' p-glyph__chip--dark' : ''}`} style={{ color: t.resolved }}><Glyph name="house" size={20} /></span></td>
            <td><Link to={`/foundations/colour#${tokenAnchor(t.name)}`}><code>{t.name}</code></Link></td>
            <td>{t.alias && <><span className="p-muted">→ </span><code>{t.alias}</code> </>}<span className="p-muted">{t.resolved}</span></td>
            <td className="p-muted">{t.description ?? '—'}</td>
          </tr>
        ))}</tbody>
      </table></div>

      <h2 id="all-glyphs">All glyphs</h2>
      <p>Press a glyph to copy its name, the value of the Icon <code>name</code> property.</p>
      <div className="p-filters p-filters--sticky">
        <div className="p-field"><label htmlFor="glyph-filter">Filter icons</label><input id="glyph-filter" type="search" placeholder="Name, e.g. arrow" value={filter} onChange={(e) => setFilter(e.target.value)} /></div>
        <div className="p-field p-field--auto"><span className="p-field__label" id="glyph-size">Size</span>
          <div className="p-seg" role="group" aria-labelledby="glyph-size">{sizes.map((s) => <button key={s.id} type="button" aria-pressed={size === s.id} onClick={() => setSize(s.id)}>{s.id} · {px(s.token)}</button>)}</div>
        </div>
        <div className="p-field"><label htmlFor="glyph-colour">Colour</label>
          <select id="glyph-colour" value={colour} onChange={(e) => setColour(e.target.value)}>{colours.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}</select>
        </div>
        <p className="p-filters__count" role="status">{list.length} of {glyphNames.length}</p>
      </div>
      {list.length === 0 ? <p className="p-muted">No icon name contains “{filter}”.</p> : (
        <ul className={`p-glyphs${isDark(colour) ? ' p-glyphs--dark' : ''}`} style={{ color: colourValue }}>
          {list.map((n) => <GlyphTile key={n} name={n} size={sizePx} />)}
        </ul>
      )}

      <Callout title="Where the glyphs come from">
        <p>Lucide glyphs are drawn from the <code>lucide-react</code> package by the same names as the Figma variants; the four other glyphs use paths exported from Figma. The list is generated from <code>tokens/source/figma-glyphs.txt</code> by <code>npm run tokens</code>.</p>
      </Callout>
    </article>
  );
}
