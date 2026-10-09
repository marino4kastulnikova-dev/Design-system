// BaaS design system — StatusBadge. Source: Figma page "badge", set "StatusBadge" (325:849).
// Portal implementation, pending developer validation.
import type { ReactNode } from 'react';
import { Icon, type IconColor, type IconName } from './Icon';

export type StatusBadgeAppearance = 'positive' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent' | 'awaiting' | 'processing';
export type StatusBadgeSize = 'sm' | 'md' | 'lg';
export interface StatusBadgeProps {
  appearance?: StatusBadgeAppearance;
  /** sm 24, md 28, lg 32 (size/label/*). */ size?: StatusBadgeSize;
  /** Optional trailing icon (Figma showIcon + TrailingIcon). */ icon?: IconName;
  children: ReactNode;
}
// Icon colour variant per appearance, read from the hidden Icon instance of each Figma variant.
const iconColor: Record<StatusBadgeAppearance, IconColor> = { positive: 'positive', warning: 'warning', danger: 'danger', info: 'info', neutral: 'default', accent: 'accent', awaiting: 'info', processing: 'warning' };
export function StatusBadge({ appearance = 'positive', size = 'md', icon, children }: StatusBadgeProps) {
  return (
    <span className={`baas-badge baas-badge--${appearance} baas-badge--${size}`}>
      <span className="baas-badge__label">{children}</span>
      {icon && <Icon name={icon} size="sm" color={iconColor[appearance]} />}
    </span>
  );
}
