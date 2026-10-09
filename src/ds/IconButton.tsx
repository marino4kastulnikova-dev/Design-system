// BaaS design system — IconButton. Source: Figma page "icon-button", set "IconButton" (333:906).
// Portal implementation, pending developer validation.
import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconColor, type IconName } from './Icon';

export type IconButtonAppearance = 'ghost' | 'tonal' | 'glass' | 'soft';
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  appearance?: IconButtonAppearance;
  icon?: IconName;
  /** Required: the button has no text. */ 'aria-label': string;
  /** Preview only. */ forceState?: 'hover' | 'pressed' | 'focus-visible';
}
const iconColor: Record<IconButtonAppearance, IconColor> = { ghost: 'default', tonal: 'strong', glass: 'muted', soft: 'default' };
const defaultIcon: Record<IconButtonAppearance, IconName> = { ghost: 'chevron-right', tonal: 'send', glass: 'arrow-down', soft: 'x' };
export function IconButton({ appearance = 'ghost', icon, forceState, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button {...rest} type={type} data-force={forceState} className={['baas-icon-button', `baas-icon-button--${appearance}`, className].filter(Boolean).join(' ')}>
      <Icon name={icon ?? defaultIcon[appearance]} size="sm" color={iconColor[appearance]} />
    </button>
  );
}
