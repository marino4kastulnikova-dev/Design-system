// BaaS design system — Chip. Source: Figma page "chip", set "Chip" (344:951). Needs a coloured or dark surface behind it.
// Portal implementation, pending developer validation.
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** md 36 (size/control/chip), sm 28 (size/control/toolbar). */ size?: 'md' | 'sm';
  /** Figma layout = icon-only. Requires aria-label. */ iconOnly?: boolean;
  icon?: IconName;
  children?: ReactNode;
  /** Preview only. */ forceState?: 'hover' | 'pressed' | 'focus-visible';
}
export function Chip({ size = 'md', iconOnly = false, icon, children, forceState, className, type = 'button', ...rest }: ChipProps) {
  const glyph = icon ?? (iconOnly ? 'mic' : undefined);
  return (
    <button {...rest} type={type} data-force={forceState} className={['baas-chip', `baas-chip--${size}`, iconOnly && 'baas-chip--icon-only', className].filter(Boolean).join(' ')}>
      {glyph && <Icon name={glyph} size="sm" color="strong" />}
      {!iconOnly && <span>{children}</span>}
    </button>
  );
}
