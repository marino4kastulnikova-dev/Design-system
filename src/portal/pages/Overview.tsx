import { Link } from 'react-router-dom';
import { components } from '../../registry/components';
import { foundations } from '../../registry/foundations';
import { FIGMA_FILE } from '../../registry/types';
import { collections, effects, gradients, textStyles, tokens } from '../../tokens/generated/tokens';
import { Callout } from '../ui';

export function Overview() {
  const total = components.reduce((n, c) => n + c.components.length, 0);
  const draft = components.filter((c) => c.status === 'Draft').length;
  const built = components.filter((c) => c.built);
  return (
    <article className="p-article">
      <header className="p-title">
        <p className="p-eyebrow">Overview</p>
        <h1>BaaS Web Design System</h1>
        <p className="p-lede">Foundations, components and documentation of the BaaS web app design system, generated from its <a href={FIGMA_FILE} target="_blank" rel="noreferrer">Figma file ↗</a>. Every number on this page is counted from that file.</p>
      </header>

      <div className="p-entry">
        <Link to="/foundations/colour" className="p-entry__card"><h2>Foundations</h2><p>{tokens.length} variables in {collections.length} collections, {textStyles.length} text styles, {gradients.length} gradients and {effects.length} effect styles.</p><span>Start with Colour →</span></Link>
        <Link to="/components" className="p-entry__card"><h2>Components</h2><p>{components.length} pages with {total} components and component sets, from Button to full modals and tables.</p><span>Browse the catalog →</span></Link>
      </div>

      <h2 id="state-of-the-system">State of the system</h2>
      <ul className="p-facts">
        <li><strong>Everything is a draft.</strong> {draft} of {components.length} component pages carry a DRAFT status in Figma; the other {components.length - draft} have no status written. No component is marked approved for production.</li>
        <li><strong>No production code exists.</strong> Components shown here are a portal implementation built from the Figma specification. Their API is pending developer validation.</li>
        <li><strong>One mode.</strong> Each variable collection has a single mode, so the portal offers no dark preview. Previews can be placed on different surface tokens instead.</li>
        <li><strong>Semantic colours alias primitives.</strong> None of the {tokens.filter((t) => t.collection === 'Colour Semantic').length} semantic colours holds a raw value.</li>
      </ul>

      <h2 id="how-to-read-the-labels">How to read the labels</h2>
      <div className="p-tablewrap"><table className="p-table"><tbody>
        <tr><td><span className="p-badge" data-kind="Draft">Draft</span></td><td>Status written in the Figma documentation. Shown unchanged.</td></tr>
        <tr><td><span className="p-badge" data-kind="Not documented">Not documented</span></td><td>The source says nothing about this. The portal does not fill the gap.</td></tr>
        <tr><td><span className="p-badge" data-kind="Proposed — needs review">Proposed — needs review</span></td><td>A recommendation added by the portal, waiting for a decision.</td></tr>
        <tr><td><span className="p-badge" data-kind="Portal implementation">Portal implementation</span></td><td>Code written for this site from the Figma specification, not an existing production contract.</td></tr>
        <tr><td><span className="p-badge" data-kind="Planned">Planned</span></td><td>Verified in the inventory; its portal page is not built yet.</td></tr>
      </tbody></table></div>

      <h2 id="coverage">Coverage</h2>
      <Callout title="Stage 3 in progress">
        <p>Every component page of the verified inventory has a live preview, a state matrix and its documentation. The foundation pages other than Colour still list their verified values in a plain table; their designed pages are next.</p>
      </Callout>
      <div className="p-tablewrap"><table className="p-table">
        <thead><tr><th>Area</th><th>Built</th><th>Planned</th></tr></thead>
        <tbody>
          <tr><td>Foundations</td><td>{foundations.filter((f) => f.built).map((f) => <Link key={f.slug} to={`/foundations/${f.slug}`}>{f.title}</Link>)}</td><td>{foundations.filter((f) => !f.built).map((f) => f.title).join(', ')}</td></tr>
          <tr><td>Components</td><td>{built.map((c, i) => <span key={c.slug}>{i > 0 && ', '}<Link to={`/components/${c.slug}`}>{c.title}</Link></span>)}</td><td>{components.length - built.length === 0 ? 'None' : <>{components.length - built.length} pages, see the <Link to="/components">catalog</Link></>}</td></tr>
        </tbody>
      </table></div>
    </article>
  );
}
