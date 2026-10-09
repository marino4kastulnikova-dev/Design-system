// BaaS design system — NavigationItem. Source: Figma page "navigation-item", set "NavigationItem" (362:905). Dark sidebar only.
// Portal implementation, pending developer validation.
import type { MouseEventHandler, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export interface NavigationItemProps {
  icon?: IconName; children: ReactNode; href?: string;
  /** Sets aria-current="page". */ selected?: boolean; disabled?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Figma SidebarCollapsed: icon only; the label becomes the accessible name. */ collapsed?: boolean;
  /** Preview only. */ forceState?: 'hover' | 'pressed' | 'focus-visible';
}
export function NavigationItem({ icon = 'house', children, href = '#', selected = false, disabled = false, onClick, collapsed = false, forceState }: NavigationItemProps) {
  return (
    <a
      className={`baas-nav-item${collapsed ? ' baas-nav-item--collapsed' : ''}`} href={disabled ? undefined : href} aria-current={selected ? 'page' : undefined}
      aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined} data-force={forceState}
      aria-label={collapsed && typeof children === 'string' ? children : undefined}
      onClick={(e) => { if (disabled) { e.preventDefault(); return; } onClick?.(e); }}
    >
      <Icon name={icon} size="md" />
      {!collapsed && <span>{children}</span>}
    </a>
  );
}
