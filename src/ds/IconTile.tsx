// BaaS design system — IconTile. Source: Figma page "icon-tile", set "IconTile" (348:905). Static, not a button.
// Portal implementation, pending developer validation.
import { Icon, type IconColor, type IconName } from './Icon';

export type IconTileAppearance = 'neutral' | 'positive' | 'danger';
export interface IconTileProps { appearance?: IconTileAppearance; /** md 32, lg 64 (size/tile/*). */ size?: 'md' | 'lg'; icon?: IconName }
const color: Record<IconTileAppearance, IconColor> = { neutral: 'default', positive: 'success', danger: 'danger' };
const defaultIcon: Record<IconTileAppearance, IconName> = { neutral: 'users', positive: 'check', danger: 'x' };
export function IconTile({ appearance = 'neutral', size = 'md', icon }: IconTileProps) {
  // Figma: md tiles hold a 16 px icon. The neutral lg tile holds a 24 px icon; positive and danger lg tiles hold an
  // Icon instance resized to 32 px (the documentation says 24). Reproduced as drawn.
  const big = size === 'lg';
  return (
    <span className={`baas-icon-tile baas-icon-tile--${appearance} baas-icon-tile--${size}`} aria-hidden="true">
      <Icon name={icon ?? defaultIcon[appearance]} size={big ? 'lg' : 'sm'} color={color[appearance]} boxSize={big && appearance !== 'neutral' ? 32 : undefined} />
    </span>
  );
}
