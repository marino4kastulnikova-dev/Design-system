// BaaS design system — small molecules: LiveIndicator, MessageBanner, DetailRow, ThemeToggle, SectionHeader.
// Portal implementation, pending developer validation.
import type { ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

/** Source: Figma page "live-indicator", component "LiveIndicator" (381:1344). */
export function LiveIndicator({ label = 'Live · Updated 2 min ago', live = false }: { label?: string; /** Set when the text updates on its own. */ live?: boolean }) {
  return <span className="baas-live" aria-live={live ? 'polite' : undefined}><Icon name="clock" size="sm" color="default" />{label}</span>;
}

/** Source: Figma page "message-banner", component "MessageBanner" (393:1960). Only the danger appearance exists. */
export function MessageBanner({ message }: { message: string }) {
  return <span className="baas-banner" role="alert"><Icon name="circle-alert" size="md" color="danger" />{message}</span>;
}

/** Source: Figma page "detail-row", component "DetailRow" (393:1890). Place rows inside a <dl>. */
export function DetailRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return <div className="baas-detail-row"><dt>{label}</dt><dd>{value}</dd></div>;
}

export type Theme = 'light' | 'dark';
/**
 * Source: Figma page "theme-toggle", component "ThemeToggle" (381:1330). Figma draws one state only (sun active = light).
 * Proposed — needs review: the dark state mirrors it by moving the thumb to the moon. No dark theme exists in the system.
 */
export function ThemeToggle({ theme = 'light', onChange }: { theme?: Theme; onChange?: (t: Theme) => void }) {
  const seg = (t: Theme, icon: 'moon' | 'sun', label: string) => (
    <button type="button" role="radio" aria-checked={theme === t} aria-label={label} className="baas-theme-toggle__seg" onClick={() => onChange?.(t)}>
      <Icon name={icon} size="sm" color="default" />
    </button>
  );
  return <div className="baas-theme-toggle" role="radiogroup" aria-label="Colour theme">{seg('dark', 'moon', 'Dark')}{seg('light', 'sun', 'Light')}</div>;
}

/** Source: Figma page "section-header", component "SectionHeader" (419:6055). The two actions are exposed Button instances. */
export function SectionHeader({ title, actions }: { title: ReactNode; actions?: ReactNode }) {
  return (
    <div className="baas-section-header">
      <h2 className="ts-heading-lg">{title}</h2>
      <div className="baas-section-header__actions">
        {actions ?? <><Button appearance="secondary" leadingIcon="user-round-plus">Add user</Button><Button appearance="primary" leadingIcon="plus">Issue card</Button></>}
      </div>
    </div>
  );
}
