import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import docsIndex from 'virtual:docs-index';
import { components } from '../registry/components';
import { foundations } from '../registry/foundations';
import { tokens } from '../tokens/generated/tokens';
import { tokenHref } from './ui';

interface Entry { group: 'Components' | 'Foundations' | 'Tokens' | 'Documentation'; title: string; detail: string; href: string; haystack: string }

const index: Entry[] = [
  ...components.map((c): Entry => ({
    group: 'Components', title: c.title, detail: c.purpose ?? `Figma page ${c.slug}`, href: `/components/${c.slug}`,
    haystack: [c.title, c.slug, c.purpose, ...c.components.map((x) => x.name)].join(' ').toLowerCase(),
  })),
  ...foundations.map((f): Entry => ({ group: 'Foundations', title: f.title, detail: f.summary, href: `/foundations/${f.slug}`, haystack: `${f.title} ${f.summary} ${f.sources.join(' ')}`.toLowerCase() })),
  ...tokens.map((t): Entry => ({
    group: 'Tokens', title: t.name, detail: `${t.collection} · ${t.alias ? `→ ${t.alias} · ` : ''}${t.resolved}`, href: tokenHref(t),
    haystack: `${t.name} ${t.cssVar} ${t.alias ?? ''} ${t.resolved} ${t.description ?? ''}`.toLowerCase(),
  })),
  ...docsIndex.flatMap((d) => d.sections.map((s): Entry => {
    const c = components.find((x) => x.slug === d.slug);
    return { group: 'Documentation', title: `${c?.title ?? d.slug} — ${s.title}`, detail: s.text.slice(0, 110), href: `/components/${d.slug}#${s.id}`, haystack: `${s.title} ${s.text}`.toLowerCase() };
  })),
];

const LIMIT = { Components: 6, Foundations: 4, Tokens: 8, Documentation: 6 } as const;

function search(q: string): Entry[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored = index.filter((e) => terms.every((t) => e.haystack.includes(t)))
    .map((e) => ({ e, score: (e.title.toLowerCase().startsWith(terms[0]) ? 0 : e.title.toLowerCase().includes(terms[0]) ? 1 : 2) }))
    .sort((a, b) => a.score - b.score);
  const out: Entry[] = [];
  for (const g of ['Components', 'Foundations', 'Tokens', 'Documentation'] as const) out.push(...scored.filter((s) => s.e.group === g).slice(0, LIMIT[g]).map((s) => s.e));
  return out;
}

export function Search() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const results = useMemo(() => search(q), [q]);

  const open = () => { if (!dialog.current?.open) { dialog.current?.showModal(); input.current?.select(); } };
  const close = () => dialog.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => setActive(0), [q]);
  useEffect(() => { document.getElementById(`search-opt-${active}`)?.scrollIntoView({ block: 'nearest' }); }, [active]);

  const go = (e: Entry) => { close(); navigate(e.href); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]); }
    // A search field swallows the first Escape to clear its text; close the dialog directly instead.
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  return (
    <>
      <button type="button" className="p-searchbtn" onClick={open} aria-keyshortcuts="/ Meta+K Control+K">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3.5 3.5" strokeLinecap="round" /></svg>
        <span>Search</span><kbd>/</kbd>
      </button>
      {/* The native dialog provides the focus trap, Escape to close and focus return. */}
      <dialog ref={dialog} className="p-search" aria-label="Search" onClick={(e) => { if (e.target === dialog.current) close(); }} onClose={() => setQ('')}>
        <div className="p-search__box">
          <input
            ref={input} type="search" placeholder="Search components, tokens and documentation" value={q}
            onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown}
            role="combobox" aria-expanded={results.length > 0} aria-controls="search-list" aria-activedescendant={results[active] ? `search-opt-${active}` : undefined} aria-autocomplete="list"
          />
          <button type="button" className="p-btn" onClick={close}>Close</button>
        </div>
        <ul id="search-list" role="listbox" aria-label="Results" className="p-search__list">
          {results.map((r, i) => (
            <li key={r.group + r.href + r.title} role="presentation">
              {(i === 0 || results[i - 1].group !== r.group) && <p className="p-search__group" role="presentation">{r.group}</p>}
              <div id={`search-opt-${i}`} role="option" aria-selected={i === active} className="p-search__opt" onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                <span className="p-search__title">{r.title}</span>
                <span className="p-search__detail">{r.detail}</span>
              </div>
            </li>
          ))}
        </ul>
        {q.trim() && results.length === 0 && <p className="p-search__empty" role="status">No results for “{q.trim()}”. Try a component name, a token such as <code>surface/control</code>, or a hex value.</p>}
        {!q.trim() && <p className="p-search__empty">Type to search {components.length} components, {tokens.length} tokens and the written documentation. Use ↑ ↓ and Enter.</p>}
      </dialog>
    </>
  );
}
