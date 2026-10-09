// BaaS design system — MetricCard, AccountCard, PageHeader.
// Portal implementation, pending developer validation.
import type { ReactNode } from 'react';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { IconTile } from './IconTile';
import { LiveIndicator, ThemeToggle, type Theme } from './misc';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

/** Source: Figma page "metric-card", component "MetricCard" (365:995). */
export interface MetricCardProps {
  title: string; value: string; icon?: IconName;
  /** Figma showDelta. The Figma mapping suggests { value, trend }. */ delta?: { value: string; trend: 'up' | 'down'; appearance?: 'positive' | 'warning' | 'danger' };
}
export function MetricCard({ title, value, icon = 'users', delta }: MetricCardProps) {
  return (
    <section className="baas-metric-card" aria-label={title}>
      <div className="baas-metric-card__header">
        <IconTile appearance="neutral" size="md" icon={icon} />
        <h3 className="baas-metric-card__title">{title}</h3>
        {delta && (
          <StatusBadge appearance={delta.appearance ?? (delta.trend === 'up' ? 'positive' : 'danger')} size="lg" icon={delta.trend === 'up' ? 'trending-up' : 'trending-down'}>
            <span className="baas-sr-only">{delta.trend === 'up' ? 'up ' : 'down '}</span>{delta.value}
          </StatusBadge>
        )}
      </div>
      <p className="baas-metric-card__value">{value}</p>
    </section>
  );
}

/** Source: Figma page "account-card", set "AccountCard" (376:1176). */
export interface AccountCardProps {
  /** iban: purple card, no footer actions. wallet: dark card with members and the Linked card action. */
  appearance?: 'iban' | 'wallet';
  name: string; balance: string; currency: string; limit: string; spent: string;
  /** Share of the transfer limit used, 0–100. */ progress: number;
  /** wallet only: one neutral placeholder circle per entry (max 3) stands in for the member photos of the source; plus the caption. */
  members?: string[]; membersLabel?: string;
  onLinkedCard?: () => void; onToggle?: () => void;
}
export function AccountCard({ appearance = 'iban', name, balance, currency, limit, spent, progress, members = [], membersLabel, onLinkedCard, onToggle }: AccountCardProps) {
  return (
    <section className={`baas-account-card baas-account-card--${appearance}`} aria-label={name}>
      <div className="baas-account-card__card">
        {appearance === 'iban' && <><span className="baas-account-card__glow baas-account-card__glow--back" /><span className="baas-account-card__glow baas-account-card__glow--front" /></>}
        <p className="baas-account-card__name">{name}</p>
        <p className="baas-account-card__balance">{balance}<span> {currency}</span></p>
        <div className="baas-account-card__limit">
          <div className="baas-account-card__limit-row"><span>Transfer limit</span><span>{limit}</span></div>
          <ProgressBar value={progress} aria-label={`Transfer limit used: ${spent} of ${limit}`} />
          <p className="baas-account-card__spent">Spent {spent}</p>
        </div>
        {/* Figma: the iban variant keeps this row at 0% opacity, so it only holds the height. */}
        <div className="baas-account-card__footer" aria-hidden={appearance === 'iban' || undefined}>
          {appearance === 'wallet' && (
            <>
              <div className="baas-account-card__members">
                <div className="baas-account-card__stack">{members.slice(0, 3).map((_, i) => <span key={i} aria-hidden="true" />)}</div>
                {membersLabel && <span>{membersLabel}</span>}
              </div>
              <Button appearance="inverse" leadingIcon="credit-card" onClick={onLinkedCard}>Linked card</Button>
            </>
          )}
        </div>
      </div>
      {/* Figma: "Notch" is a frame with a raw Lucide glyph, not an IconButton. Rendered as a button so it can be operated. */}
      <button type="button" className="baas-account-card__notch" aria-label={`Collapse ${name}`} onClick={onToggle}><Icon name="chevron-up" size="sm" color="primary" /></button>
    </section>
  );
}

/** Source: Figma page "page-header", component "PageHeader" (381:1356). */
export function PageHeader({ title, liveLabel, theme = 'light', onThemeChange, children }: { title: ReactNode; liveLabel?: string; theme?: Theme; onThemeChange?: (t: Theme) => void; children?: ReactNode }) {
  return (
    <header className="baas-page-header">
      <h1 className="ts-display">{title}</h1>
      <div className="baas-page-header__aside">{children ?? <><LiveIndicator label={liveLabel} /><ThemeToggle theme={theme} onChange={onThemeChange} /></>}</div>
    </header>
  );
}
