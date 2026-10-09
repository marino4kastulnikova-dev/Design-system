import { createContext, useContext, type ComponentType, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { componentBySlug } from '../../registry/components';
import { categories, figmaNodeUrl, type ComponentEntry } from '../../registry/types';
import { examples } from '../../examples';
import { Matrix, Playground } from '../Playground';
import { Callout, NotDocumented, Proposed, StatusBadge, TokenRef, TokenTable } from '../ui';
import { slugify } from '../slug';
import { NotFound } from './NotFound';

// Documentation lives in src/docs/<figma-page>.mdx. A page exists as soon as its file does.
const docs = import.meta.glob<{ default: ComponentType }>('../../docs/*.mdx', { eager: true });
const docFor = (slug: string) => docs[`../../docs/${slug}.mdx`]?.default;

const Entry = createContext<ComponentEntry | null>(null);

const text = (n: ReactNode): string => (typeof n === 'string' || typeof n === 'number' ? String(n) : Array.isArray(n) ? n.map(text).join('') : n && typeof n === 'object' && 'props' in n ? text((n as { props: { children?: ReactNode } }).props.children) : '');
const H2 = ({ children }: { children?: ReactNode }) => <h2 id={slugify(text(children))}>{children}</h2>;
const H3 = ({ children }: { children?: ReactNode }) => <h3 id={slugify(text(children))}>{children}</h3>;
const Table = (p: { children?: ReactNode }) => <div className="p-tablewrap"><table className="p-table">{p.children}</table></div>;

/** Figma component properties, straight from the registry. Kept apart from implementation props. */
export function DesignProperties() {
  const entry = useContext(Entry)!;
  return (
    <>
      {entry.components.map((c) => (
        <div key={c.nodeId}>
          <p className="p-propcaption">
            <strong>{c.name}</strong> · {c.variants === 1 ? 'single component' : `${c.variants} variants`} · <a href={figmaNodeUrl(c.nodeId)} target="_blank" rel="noreferrer">Open in Figma ↗</a>
          </p>
          {c.properties.length === 0 ? <p className="p-muted">No component properties are defined in Figma.</p> : (
            <div className="p-tablewrap"><table className="p-table">
              <thead><tr><th>Property</th><th>Type</th><th>Values</th><th>Default</th></tr></thead>
              <tbody>{c.properties.map((p) => <tr key={p.name}><td><code>{p.name}</code></td><td>{p.type}</td><td>{p.values}</td><td>{p.default ? <code>{p.default}</code> : <span className="p-muted">—</span>}</td></tr>)}</tbody>
            </table></div>
          )}
        </div>
      ))}
    </>
  );
}

const mdxComponents = { h2: H2, h3: H3, table: Table, TokenRef, TokenTable, Callout, Proposed, NotDocumented, DesignProperties, StatusBadge };

function TitleBlock({ entry }: { entry: ComponentEntry }) {
  const category = categories.find((c) => c.id === entry.category)!;
  return (
    <header className="p-title">
      <p className="p-eyebrow"><Link to="/components">Components</Link> · {category.label}</p>
      <h1>{entry.title}</h1>
      <p className="p-lede">{entry.purpose ?? <>Purpose: <NotDocumented /></>}</p>
      <dl className="p-meta">
        <div><dt>Source status</dt><dd><StatusBadge status={entry.status} />{entry.statusNote && <span className="p-muted"> {entry.statusNote}</span>}</dd></div>
        <div><dt>Figma page</dt><dd><code>{entry.slug}</code></dd></div>
        <div><dt>Figma node</dt><dd>{entry.components.map((c, i) => <span key={c.nodeId}>{i > 0 && ', '}<a href={figmaNodeUrl(c.nodeId)} target="_blank" rel="noreferrer">{c.name} ↗</a></span>)}</dd></div>
        <div><dt>Documentation in Figma</dt><dd>{entry.docs}</dd></div>
      </dl>
    </header>
  );
}

export function ComponentPage() {
  const { slug = '' } = useParams();
  const entry = componentBySlug[slug];
  if (!entry) return <NotFound />;
  const Doc = docFor(slug);
  const example = examples[slug];

  return (
    <Entry.Provider value={entry}>
      <article className="p-article">
        <TitleBlock entry={entry} />
        {!entry.built || !Doc || !example ? (
          <>
            <Callout title="Page not built yet">
              <p>This component is verified in the Figma inventory. Its live preview, states and documentation are not built yet.</p>
            </Callout>
            <h2 id="design-properties">Design properties</h2>
            <DesignProperties />
          </>
        ) : (
          <>
            <h2 id="preview">Preview</h2>
            <Playground slug={slug} key={slug} />
            <h2 id="variants-and-states">Variants and states</h2>
            <p>Every variant in the Figma component set, rendered by the portal implementation. Hover, pressed and focus-visible are pinned here for comparison; in the preview above they respond to real input.</p>
            <Matrix slug={slug} key={`m-${slug}`} />
            {entry.opacityNote && (
              <Callout title="Source discrepancy: translucent tokens" kind="warning">
                <p>Some fills or texts of this component are bound to translucent variables (for example <code>alpha/white-20</code> behind <code>surface/card</code>), but the paint opacity in Figma is 100%, so Figma draws them fully opaque. The portal follows the token value, which is the documented intent, so these parts look more transparent here than in the Figma file. <StatusBadge status="Proposed — needs review" /></p>
              </Callout>
            )}
            <MDXProvider components={mdxComponents}><Doc /></MDXProvider>
            {entry.related && (
              <>
                <h2 id="related">Related</h2>
                <ul className="p-related">{entry.related.map((r) => componentBySlug[r] && <li key={r}><Link to={`/components/${r}`}>{componentBySlug[r].title}</Link><span className="p-muted"> {componentBySlug[r].purpose ?? ''}</span></li>)}</ul>
              </>
            )}
          </>
        )}
      </article>
    </Entry.Provider>
  );
}
