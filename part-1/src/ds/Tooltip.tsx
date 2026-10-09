// BaaS design system — Tooltip. Source: Figma page "tooltip", component "Tooltip" (592:5083).
// Portal implementation, pending developer validation.
import { cloneElement, useEffect, useId, useState, type ReactElement } from 'react';

export interface TooltipProps { label: string; id?: string }
/** The tooltip bubble itself. */
export function Tooltip({ label, id }: TooltipProps) {
  return <span className="baas-tooltip" role="tooltip" id={id}>{label}</span>;
}

/**
 * Shows a Tooltip for its child on hover and keyboard focus, 8 px away and centred, and hides it on Escape,
 * as the Figma usage notes describe. Flipping to the other side when there is no room is not implemented.
 */
export function WithTooltip({ label, side = 'top', children }: { label: string; side?: 'top' | 'bottom' | 'right'; children: ReactElement<Record<string, unknown>> }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <span className={`baas-tooltip-anchor baas-tooltip-anchor--${side}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {cloneElement(children, { 'aria-describedby': open ? id : undefined })}
      {open && <Tooltip label={label} id={id} />}
    </span>
  );
}
