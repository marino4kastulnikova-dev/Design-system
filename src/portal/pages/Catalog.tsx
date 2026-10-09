import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { components } from '../../registry/components';
import { categories, type SourceStatus } from '../../registry/types';
import { Thumb } from '../Playground';
import { StatusBadge } from '../ui';

const statuses: SourceStatus[] = ['Draft', 'Not documented'];

export function Catalog() {
  // Filters live in the URL so a filtered view can be linked and survives refresh and back/forward.
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({ q: params.get('q') ?? '', category: params.get('category') ?? '', status: params.get('status') ?? '' });
  const { q, category, status } = filters;
  const set = (key: keyof typeof filters, value: string) => setFilters((f) => ({ ...f, [key]: value }));
  useEffect(() => {
    setParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)), { replace: true });
  }, [filters, setParams]);
  const list = useMemo(() => components.filter((c) =>
    (!category || c.category === category) && (!status || c.status === status) &&
    (!q.trim() || [c.title, c.slug, c.purpose ?? '', ...c.components.map((x) => x.name)].join(' ').toLowerCase().includes(q.trim().toLowerCase()))), [q, category, status]);
  const total = components.reduce((n, c) => n + c.components.length, 0);

  return (
    <article className="p-article p-article--wide">
      <header className="p-title">
        <p className="p-eyebrow">Components</p>
        <h1>All components</h1>
        <p className="p-lede">{components.length} Figma pages holding {total} components and component sets, verified in Figma on 7 October 2026. Names are the source names; the categories are the portal’s grouping.</p>
      </header>

      <form className="p-filters" role="search" aria-label="Filter components" onSubmit={(e) => e.preventDefault()}>
        <div className="p-field"><label htmlFor="cat-q">Name</label><input id="cat-q" type="search" value={q} placeholder="Filter by name" onChange={(e) => set('q', e.target.value)} /></div>
        <div className="p-field"><label htmlFor="cat-c">Category</label><select id="cat-c" value={category} onChange={(e) => set('category', e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
        <div className="p-field"><label htmlFor="cat-s">Source status</label><select id="cat-s" value={status} onChange={(e) => set('status', e.target.value)}><option value="">Any status</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
        <p className="p-filters__count" role="status">{list.length} of {components.length}</p>
      </form>

      {list.length === 0 ? (
        <div className="p-empty"><p>No component matches these filters.</p><button type="button" className="p-btn" onClick={() => setFilters({ q: '', category: '', status: '' })}>Clear filters</button></div>
      ) : (
        <ul className="p-grid">
          {list.map((c) => (
            <li key={c.slug}>
              <Link to={`/components/${c.slug}`} className="p-card">
                <div className="p-card__stage">{c.built ? <Thumb slug={c.slug} /> : <span>Preview planned for Stage 3</span>}</div>
                <div className="p-card__body">
                  <h2>{c.title}</h2>
                  <p>{c.purpose ?? 'Purpose not documented in Figma.'}</p>
                  <div className="p-card__meta"><StatusBadge status={c.status} />{!c.built && <StatusBadge status="Planned" />}<span>{categories.find((x) => x.id === c.category)!.label}</span></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
