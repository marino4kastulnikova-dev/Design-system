// BaaS design system — ModalOverlay, AccountDetailsModal, ConfirmPaymentModal, ConvertModal.
// Portal implementation, pending developer validation.
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from './Button';
import { Divider } from './Divider';
import { IconButton } from './IconButton';
import { IconTile } from './IconTile';
import { Input } from './Input';
import { DetailRow } from './misc';
import { Spinner } from './Spinner';
import { StatusBadge } from './StatusBadge';

export type MoneyMovement = 'conversion' | 'transfer' | 'withdrawal';
export interface Detail { label: string; value: string; /** Rendered as a read-only field instead of a row. */ field?: boolean; copy?: boolean }

/**
 * Source: Figma page "modal-overlay", component "ModalOverlay" (461:5132). A scrim with one modal centred both ways.
 * Dialog behaviour is "an implementation decision" in Figma. Proposed — needs review: focus moves into the dialog and
 * is trapped, Escape and a click on the scrim close it, focus returns to the opener.
 */
export function ModalOverlay({ open, onClose, children, labelledBy }: { open: boolean; onClose?: () => void; children: ReactNode; labelledBy?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () => [...(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])];
    (focusables()[0] ?? ref.current)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose?.(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables(); if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); opener?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="baas-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} className="baas-modal-overlay__slot">{children}</div>
    </div>
  );
}

function Shell({ children, className = '', titleId }: { children: ReactNode; className?: string; titleId?: string }) {
  return <div className={`baas-modal ${className}`} aria-labelledby={titleId}>{children}</div>;
}
function Details({ items, gap = 16, amount, amountMuted }: { items: Detail[]; gap?: number; amount?: string; amountMuted?: boolean }) {
  return (
    <div className="baas-modal__card" style={{ gap }}>
      {amount && <><p className={`ts-display baas-modal__amount${amountMuted ? ' baas-modal__amount--muted' : ''}`}>{amount}</p><Divider /></>}
      <dl style={{ gap }}>
        {items.map((d) => d.field
          ? <div key={d.label} className="baas-modal__field"><dt>{d.label}</dt><dd><Input readOnly value={d.value} onChange={() => {}} trailingIcon={d.copy ? 'copy' : undefined} aria-label={d.label} className={d.copy ? '' : 'baas-input--tight'} style={{ width: '100%' }} /></dd></div>
          : <DetailRow key={d.label} label={d.label} value={d.value} />)}
      </dl>
    </div>
  );
}

/** Source: Figma page "account-details-modal", component "AccountDetailsModal" (493:6224). */
export interface AccountDetailsModalProps { title: string; subtitle?: string; amount: string; ibanLabel?: string; iban: string; details: Detail[]; primaryLabel?: string; secondaryLabel?: string; onPrimary?: () => void; onSecondary?: () => void; onClose?: () => void; titleId?: string }
export function AccountDetailsModal({ title, subtitle, amount, ibanLabel = 'IBAN number', iban, details, primaryLabel = 'Top up', secondaryLabel, onPrimary, onSecondary, onClose, titleId }: AccountDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const fid = useId();
  return (
    <Shell className="baas-modal--left" titleId={titleId}>
      <div className="baas-modal__heading"><h2 id={titleId} className="ts-heading-h3">{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      <div className="baas-modal__card" style={{ gap: 16 }}>
        <p className="ts-display baas-modal__amount">{amount}</p>
        <Divider />
        <label htmlFor={fid} className="baas-modal__label">{ibanLabel}</label>
        {/* Copy behaviour is NEEDS CONFIRMATION in Figma ("only the icon is shown"). Proposed: the whole field copies on click. */}
        <span className="baas-modal__copyfield" onClick={() => { void navigator.clipboard?.writeText(iban); setCopied(true); setTimeout(() => setCopied(false), 1600); }}>
          <Input id={fid} readOnly value={iban} onChange={() => {}} trailingIcon={copied ? 'check' : 'copy'} style={{ width: '100%' }} />
          <span className="baas-sr-only" aria-live="polite">{copied ? 'IBAN copied' : ''}</span>
        </span>
        <dl style={{ gap: 16 }}>{details.map((d) => <DetailRow key={d.label} label={d.label} value={d.value} />)}</dl>
      </div>
      <div className="baas-modal__buttons baas-modal__buttons--stack">
        <Button appearance="primary" className="baas-button--fill" onClick={onPrimary}>{primaryLabel}</Button>
        {secondaryLabel && <Button appearance="secondary" className="baas-button--fill" onClick={onSecondary}>{secondaryLabel}</Button>}
      </div>
      <span className="baas-modal__close"><IconButton appearance="soft" icon="x" aria-label="Close" onClick={onClose} /></span>
    </Shell>
  );
}

/** Source: Figma page "confirm-payment-modal", set "ConfirmPaymentModal" (394:2109). */
export interface ConfirmPaymentModalProps {
  type?: MoneyMovement; /** expired exists for conversion only. */ state?: 'active' | 'expired';
  title: string; subtitle: string; amount: string; details: Detail[];
  /** conversion only: the pill above the card ("Rate valid for 04:47", "Rate expired"). */ badge?: string;
  confirmLabel?: string; onConfirm?: () => void; onCancel?: () => void; titleId?: string;
}
export function ConfirmPaymentModal({ type = 'conversion', state = 'active', title, subtitle, amount, details, badge, confirmLabel, onConfirm, onCancel, titleId }: ConfirmPaymentModalProps) {
  const expired = type === 'conversion' && state === 'expired';
  return (
    <Shell titleId={titleId}>
      <div className="baas-modal__heading"><h2 id={titleId} className="ts-heading-h3">{title}</h2><p>{subtitle}</p></div>
      {type === 'conversion' && badge && <span role="status"><StatusBadge appearance={expired ? 'warning' : 'accent'} size="sm">{badge}</StatusBadge></span>}
      <Details items={details} amount={amount} amountMuted={expired} />
      <div className="baas-modal__buttons">
        <Button appearance="secondary" className="baas-button--fill" onClick={onCancel}>Cancel</Button>
        <Button appearance="primary" className="baas-button--fill" onClick={onConfirm}>{confirmLabel ?? (expired ? 'Update rate' : 'Confirm')}</Button>
      </div>
    </Shell>
  );
}

/** Source: Figma page "convert-modal", set "ConvertModal" (394:2113). */
export interface ConvertModalProps {
  type?: MoneyMovement; state?: 'processing' | 'success' | 'failed';
  title: string; subtitle?: string; details?: Detail[];
  onDone?: () => void; onRetry?: () => void; onCancel?: () => void; titleId?: string;
}
export function ConvertModal({ state = 'processing', title, subtitle, details = [], onDone, onRetry, onCancel, titleId }: ConvertModalProps) {
  return (
    <Shell className={state === 'processing' ? 'baas-modal--processing' : ''} titleId={titleId}>
      {state === 'processing' ? <Spinner size="lg" label={title} animated /> : <IconTile appearance={state === 'success' ? 'positive' : 'danger'} size="lg" />}
      <div className="baas-modal__heading baas-modal__heading--gap20" role={state === 'processing' ? undefined : 'status'}><h2 id={titleId} className="ts-heading-h3">{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      {state === 'success' && details.length > 0 && <Details items={details} gap={14} />}
      {state === 'success' && <Button appearance="primary" className="baas-button--fill" onClick={onDone}>Done</Button>}
      {state === 'failed' && <div className="baas-modal__buttons"><Button appearance="secondary" className="baas-button--fill" onClick={onCancel}>Cancel</Button><Button appearance="primary" className="baas-button--fill" onClick={onRetry}>Try again</Button></div>}
    </Shell>
  );
}
