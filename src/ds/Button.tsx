// BaaS design system — Button.
// Portal implementation, pending developer validation. Source: Figma page "button", component set "Button" (302:835).
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconColor, type IconName } from './Icon';

export type ButtonAppearance = 'primary' | 'secondary' | 'tonal' | 'inverse';
export type ButtonSize = 'md' | 'sm';
export type ButtonLayout = 'default' | 'icon-only';
/** Documentation aid only: pins an interaction state so it can be shown side by side. */
export type ButtonForcedState = 'hover' | 'pressed' | 'focus-visible';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  appearance?: ButtonAppearance;
  /** md = 40 px (size/control/md), sm = 32 px (size/control/sm). */
  size?: ButtonSize;
  layout?: ButtonLayout;
  /** Lucide glyph name. Required when layout is "icon-only". */
  leadingIcon?: IconName;
  /** Replaces the leading icon with refresh-ccw, as drawn in Figma. */
  loading?: boolean;
  /** Label. For layout "icon-only" it is not rendered: pass aria-label instead. */
  children?: ReactNode;
  /** Preview only. Not part of the proposed public API. */
  forceState?: ButtonForcedState;
}

// Icon colour per appearance, read from the Figma variants (default state).
const iconColor: Record<ButtonAppearance, IconColor> = { primary: 'inverse', secondary: 'muted', tonal: 'accent', inverse: 'muted' };

export function Button({
  appearance = 'primary', size = 'md', layout = 'default', leadingIcon, loading = false,
  children, forceState, className, disabled, type = 'button', onClick, ...rest
}: ButtonProps) {
  const glyph: IconName | undefined = loading ? 'refresh-ccw' : leadingIcon ?? (layout === 'icon-only' ? 'plus' : undefined);
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      data-force={forceState}
      // Proposed — needs review: clicks are ignored while loading.
      onClick={loading ? undefined : onClick}
      className={['baas-button', `baas-button--${appearance}`, `baas-button--${size}`, layout === 'icon-only' && 'baas-button--icon-only', className].filter(Boolean).join(' ')}
    >
      {glyph && (
        <span className="baas-button__icon">
          <Icon name={glyph} size={size === 'md' ? 'md' : 'sm'} color={iconColor[appearance]} />
        </span>
      )}
      {layout === 'default' && <span className="baas-button__label">{children}</span>}
    </button>
  );
}
