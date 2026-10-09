import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { foundations } from '../../registry/foundations';
import { tokens, type Token } from '../../tokens/generated/tokens';
import { Callout, CopyChip, semanticUsers, StatusBadge, tokenHref } from '../ui';
import { slugify, tokenAnchor } from '../slug';
import { NotFound } from './NotFound';
import { IconsFoundationPage } from './IconsFoundation';

const natural = (a: Token, b: Token) => a.name.localeCompare(b.name, 'en', { numeric: true });
const groupOf = (t: Token) => (t.name.includes('/') ? t.name.split('/')[0] : t.name);

function Swatch({ value }: { value: string }) {
  // The checkerboard shows through translucent colours.
  return <span className="p-swatch" aria-hidden="true"><span style={{ background: value }} /></span>;
}

function TokenRowView({ t }: { t: Token }) {
  const users = t.kind === 'primitive' ? semanticUsers(t.name) : [];
  return (
    <tr id={tokenAnchor(t.name)}>
      <td><Swatch value={t.resolved} /></td>
      <td>
        <CopyChip value={t.name} />
        {t.description && <p className="p-tokendesc">{t.description}</p>}
      </td>
      <td>
        {t.alias ? <><span className="p-muted">→ </span><Link to={{ hash: tokenAnchor(t.alias) }}><code>{t.alias}</code></Link><div className="p-muted">{t.resolved}</div></> : <code>{t.resolved}</code>}
        {users.length > 0 && <div className="p-usedby">Used by {users.map((u, i) => <span key={u}>{i > 0 && ', '}<Link to={{ hash: tokenAnchor(u) }}>{u}</Link></span>)}</div>}
      </td>
      <td><CopyChip value={`var(${t.cssVar})`} label={`CSS variable for ${t.name}`}>{t.cssVar}</CopyChip></td>
    </tr>
  );
}

function ColourSection({ collection, filter }: { collection: string; filter: string }) {
  const groups = useMemo(() => {
    const list = tokens.filter((t) => t.collection === collection && (!filter || `${t.name} ${t.alias ?? ''} ${t.resolved} ${t.description ?? ''}`.toLowerCase().includes(filter)));
    const map = new Map<string, Token[]>();
    for (const t of list) map.set(groupOf(t), [...(map.get(groupOf(t)) ?? []), t]);
    return [...map].map(([name, items]) => ({ name, items: items.sort(natural) }));
  }, [collection, filter]);
  if (!groups.length) return <p className="p-muted" role="status">No token in {collection} matches the filter.</p>;
  return (
    <>
      {groups.map((g) => (
        <section key={g.name}>
          <h3 id={slugify(`${collection}-${g.name}`)}>{g.name}</h3>
          <div className="p-tablewrap"><table className="p-table p-table--tokens">
            <thead><tr><th><span className="p-visually-hidden">Sample</span></th><th>Name</th><th>Value</th><th>CSS variable</th></tr></thead>
            <tbody>{g.items.map((t) => <TokenRowView key={t.name} t={t} />)}</tbody>
          </table></div>
        </section>
      ))}
    </>
  );
}

function ColourPage() {
  const [filter, setFilter] = useState('');
  const f = filter.trim().toLowerCase();
  const prim = tokens.filter((t) => t.collection === 'Colour Primitives').length;
  const sem = tokens.filter((t) => t.collection === 'Colour Semantic').length;
  return (
    <article className="p-article p-article--wide">
      <header className="p-title">
        <p className="p-eyebrow">Foundations</p>
        <h1>Colour</h1>
        <p className="p-lede">{prim} primitive colours hold the raw values. {sem} semantic colours give them a purpose and are what components consume: each one is an alias of a primitive.</p>
        <dl className="p-meta">
          <div><dt>Source</dt><dd>Figma variable collections <code>Colour Primitives</code> and <code>Colour Semantic</code></dd></div>
          <div><dt>Modes</dt><dd>One (<code>Mode 1</code>). No dark mode is defined.</dd></div>
        </dl>
      </header>

      <h2 id="how-colours-are-structured">How colours are structured</h2>
      <p>A component never uses a hex value or a primitive directly. It binds to a semantic token such as <Link to={{ hash: tokenAnchor('surface/control') }}><code>surface/control</code></Link>, which points to the primitive <Link to={{ hash: tokenAnchor('neutral/200') }}><code>neutral/200</code></Link>. Each primitive row below lists the semantic tokens that use it; each semantic row links to its target.</p>
      <Callout title="Counts differ from the Figma documentation frames">
        <p>The frames on the <code>foundations</code> page state 38 primitives and 55 semantic colours. The variable collections contain {prim} and {sem}. This page reads the collections.</p>
      </Callout>

      <h2 id="export">Export</h2>
      <p>Both files are generated from the same Figma extract as this page.</p>
      <ul className="p-downloads">
        <li><a href="/tokens/tokens.css" download>tokens.css</a><span className="p-muted"> CSS custom properties; aliases are kept as <code>var()</code> references.</span></li>
        <li><a href="/tokens/tokens.json" download>tokens.json</a><span className="p-muted"> Design Tokens format; aliases are kept as <code>{'{collection.path}'}</code> references. Schema: <code>docs/token-schema.md</code> in the project.</span></li>
      </ul>

      <div className="p-filters p-filters--sticky">
        <div className="p-field"><label htmlFor="colour-filter">Filter colours</label><input id="colour-filter" type="search" placeholder="Name, alias or hex" value={filter} onChange={(e) => setFilter(e.target.value)} /></div>
      </div>

      <h2 id="semantic-colours">Semantic colours</h2>
      <ColourSection collection="Colour Semantic" filter={f} />
      <h2 id="primitive-colours">Primitive colours</h2>
      <ColourSection collection="Colour Primitives" filter={f} />
    </article>
  );
}

export function FoundationPage() {
  const { slug = '' } = useParams();
  const entry = foundations.find((f) => f.slug === slug);
  if (!entry) return <NotFound />;
  if (slug === 'colour') return <ColourPage />;
  if (slug === 'icons') return <IconsFoundationPage />;
  // Planned sections still expose their tokens so links from component pages resolve.
  const list = tokens.filter((t) => tokenHref(t).startsWith(`/foundations/${slug}#`));
  return (
    <article className="p-article">
      <header className="p-title">
        <p className="p-eyebrow">Foundations</p>
        <h1>{entry.title}</h1>
        <p className="p-lede">{entry.summary}</p>
        <dl className="p-meta"><div><dt>Source</dt><dd>{entry.sources.join(', ')}</dd></div><div><dt>Page</dt><dd><StatusBadge status="Planned" /></dd></div></dl>
      </header>
      <Callout title="Planned for Stage 3"><p>The designed version of this page follows the approved <Link to="/foundations/colour">Colour</Link> page. {list.length > 0 && 'The verified values are listed below in the meantime.'}</p></Callout>
      {list.length > 0 && (
        <>
          <h2 id="tokens">Tokens</h2>
          <div className="p-tablewrap"><table className="p-table">
            <thead><tr><th>Name</th><th>Value</th><th>CSS variable</th></tr></thead>
            <tbody>{list.map((t) => (
              <tr key={t.name} id={tokenAnchor(t.name)}>
                <td><CopyChip value={t.name} />{t.description && <p className="p-tokendesc">{t.description}</p>}</td>
                <td>{t.alias ? <><span className="p-muted">→ </span><Link to={{ hash: tokenAnchor(t.alias) }}><code>{t.alias}</code></Link> <span className="p-muted">{t.resolved}</span></> : <code>{t.resolved}</code>}</td>
                <td><CopyChip value={`var(${t.cssVar})`}>{t.cssVar}</CopyChip></td>
              </tr>
            ))}</tbody>
          </table></div>
        </>
      )}
    </article>
  );
}
