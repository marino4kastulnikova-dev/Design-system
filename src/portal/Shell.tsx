import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { components } from '../registry/components';
import { foundations } from '../registry/foundations';
import { categories, FIGMA_FILE } from '../registry/types';
import { Search } from './Search';

/** Scrolls to the hash target after navigation, or to the top. Keeps deep links and back/forward working. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) { el.scrollIntoView(); el.classList.add('is-target'); const t = setTimeout(() => el.classList.remove('is-target'), 1800); return () => clearTimeout(t); }
    } else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Right-hand outline. Built from the h2 headings actually rendered, so it cannot drift from the page. */
function Outline() {
  const { pathname } = useLocation();
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState('');
  useEffect(() => {
    const heads = [...document.querySelectorAll<HTMLElement>('main h2[id]')];
    setItems(heads.map((h) => ({ id: h.id, text: h.textContent ?? '' })));
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-72px 0px -60% 0px' });
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [pathname]);
  if (items.length < 2) return <div className="p-outline" />;
  return (
    <nav className="p-outline" aria-label="On this page">
      <p>On this page</p>
      <ul>{items.map((i) => <li key={i.id}><Link to={{ hash: i.id }} aria-current={active === i.id ? 'location' : undefined}>{i.text}</Link></li>)}</ul>
    </nav>
  );
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const [filter, setFilter] = useState('');
  const f = filter.trim().toLowerCase();
  const match = (...s: string[]) => !f || s.some((x) => x.toLowerCase().includes(f));
  const item = (to: string, label: string, built: boolean) => (
    <li key={to}><NavLink to={to} onClick={onNavigate} end>{label}{!built && <span className="p-nav__planned" title="Verified in Figma. Page planned for Stage 3.">Planned</span>}</NavLink></li>
  );
  const groups = categories.map((c) => ({ ...c, items: components.filter((x) => x.category === c.id && match(x.title, x.slug)) })).filter((g) => g.items.length);
  const found = foundations.filter((x) => match(x.title));
  return (
    <nav className="p-nav" aria-label="Sections">
      <div className="p-nav__filter">
        <label className="p-visually-hidden" htmlFor="nav-filter">Filter navigation</label>
        <input id="nav-filter" type="search" placeholder="Filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      {!f && <ul>{item('/', 'Overview', true)}{item('/components', 'All components', true)}</ul>}
      {found.length > 0 && <><h2>Foundations</h2><ul>{found.map((x) => item(`/foundations/${x.slug}`, x.title, x.built))}</ul></>}
      {groups.map((g) => <div key={g.id}><h2>{g.label}</h2><ul>{g.items.map((x) => item(`/components/${x.slug}`, x.title, x.built))}</ul></div>)}
      {f && !found.length && !groups.length && <p className="p-nav__empty" role="status">Nothing matches “{filter}”.</p>}
    </nav>
  );
}

export function Shell() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <div className="p-shell" data-nav-open={open || undefined}>
      <a className="p-skip" href="#main">Skip to content</a>
      <header className="p-header">
        <button type="button" className="p-menubtn" aria-expanded={open} aria-controls="p-sidebar" onClick={() => setOpen((o) => !o)}>
          <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M3 5.5h12M3 9h12M3 12.5h12" /></svg>
          <span className="p-visually-hidden">Navigation</span>
        </button>
        <Link to="/" className="p-wordmark">BaaS <span>Web Design System</span></Link>
        <Search />
        <a className="p-header__link" href={FIGMA_FILE} target="_blank" rel="noreferrer">Figma file ↗</a>
      </header>
      <aside className="p-sidebar" id="p-sidebar"><Sidebar onNavigate={() => setOpen(false)} /></aside>
      <div className="p-scrim" onClick={() => setOpen(false)} />
      <main id="main" className="p-main" tabIndex={-1}><Outlet /></main>
      <Outline />
      <ScrollManager />
    </div>
  );
}
