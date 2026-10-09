// Small building blocks of the portal shell. These are portal components, not design system components.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { tokenByName, tokens, type Token } from '../tokens/generated/tokens';
import type { SourceStatus } from '../registry/types';
import { tokenAnchor } from './slug';

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      // Fallback for contexts without the async clipboard API.
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };
  return { copied, copy };
}

/** Text button that copies a value and confirms it, also to assistive technology. */
export function CopyChip({ value, children, label }: { value: string; children?: ReactNode; label?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button type="button" className="p-copychip" onClick={() => copy(value)} aria-label={`Copy ${label ?? value}`} data-copied={copied || undefined}>
      <code>{children ?? value}</code>
      <span className="p-copychip__state" aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const { copied, copy } = useCopy();
  return <button type="button" className="p-btn" onClick={() => copy(value)}><span aria-live="polite">{copied ? 'Copied' : label}</span></button>;
}

export function StatusBadge({ status }: { status: SourceStatus | 'Planned' | 'Portal implementation' | 'Proposed — needs review' | 'Verified' }) {
  return <span className="p-badge" data-kind={status}>{status}</span>;
}

/** Inline label for content that is not taken from the source. */
export const Proposed = () => <span className="p-badge" data-kind="Proposed — needs review">Proposed — needs review</span>;
export const NotDocumented = () => <span className="p-badge" data-kind="Not documented">Not documented</span>;

export function Callout({ title, kind = 'note', children }: { title?: string; kind?: 'note' | 'warning'; children: ReactNode }) {
  return <aside className="p-callout" data-kind={kind}>{title && <p className="p-callout__title">{title}</p>}{children}</aside>;
}

const foundationFor = (t: Token) =>
  t.collection.startsWith('Colour') ? 'colour'
    : t.collection === 'Radius Primitives' ? 'radius'
    : t.collection === 'Typography Primitives' ? 'typography'
    : t.collection === 'Border Width' || t.collection === 'Opacity' ? 'borders-opacity' : 'dimensions';
export const tokenHref = (t: Token) => `/foundations/${foundationFor(t)}#${tokenAnchor(t.name)}`;

/** A token name linked to its foundation entry, with a swatch for colours. Unknown names are flagged, never guessed. */
export function TokenRef({ name }: { name: string }) {
  const t = tokenByName[name];
  if (!t) return <code className="p-token p-token--unknown" title="Not a variable in the source file">{name}</code>;
  return (
    <Link className="p-token" to={tokenHref(t)} title={`${t.resolved}${t.alias ? ` — alias of ${t.alias}` : ''}`}>
      {t.type === 'color' && <span className="p-swatch p-swatch--xs" aria-hidden="true"><span style={{ background: t.resolved }} /></span>}
      <code>{name}</code>
    </Link>
  );
}

export interface TokenRow { part: string; tokens?: string[]; style?: string; note?: string }
/** "Tokens used" table. Values are looked up from the generated tokens, not typed by hand. */
export function TokenTable({ rows }: { rows: TokenRow[] }) {
  return (
    <div className="p-tablewrap">
      <table className="p-table">
        <thead><tr><th>Part</th><th>Token or style</th><th>Resolves to</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.part}>
              <td>{r.part}</td>
              <td>
                {r.tokens?.map((n) => <div key={n}><TokenRef name={n} /></div>)}
                {r.style && <div><code>{r.style}</code> <span className="p-muted">style</span></div>}
              </td>
              <td>
                {r.tokens?.map((n) => { const t = tokenByName[n]; return <div key={n} className="p-muted">{t ? `${t.alias ? t.alias + ' · ' : ''}${t.resolved}` : 'unknown'}</div>; })}
                {r.note && <div className="p-muted">{r.note}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const semanticUsers = (primitive: string) => tokens.filter((t) => t.alias === primitive).map((t) => t.name);
