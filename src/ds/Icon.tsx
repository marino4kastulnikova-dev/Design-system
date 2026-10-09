// BaaS design system — Icon.
// Portal implementation, pending developer validation. Source: Figma page "icons", component "Icon" (292:885).
import { customGlyphs } from './customGlyphs';
import { glyphNames, lucideGlyphs } from './glyphs.generated';

/** All 101 variants of the Figma set "Lucide icons" (212:1410). */
export type IconName = (typeof glyphNames)[number];
export const iconNames: readonly IconName[] = glyphNames;
export type IconSize = 'sm' | 'md' | 'lg';
export type IconColor =
  | 'default' | 'muted' | 'strong' | 'primary' | 'accent' | 'inverse' | 'inverse-muted'
  | 'positive' | 'warning' | 'danger' | 'info' | 'success';

export interface IconProps {
  name: IconName;
  /** sm 16, md 20, lg 24 (size/icon/*). */
  size?: IconSize;
  /** Maps to the icon/* colour tokens. Omit to inherit the parent's colour. */
  color?: IconColor;
  /** Preview aid for the few places where Figma resizes an Icon instance off the size scale (px). */
  boxSize?: number;
}

export function Icon({ name, size = 'sm', color, boxSize }: IconProps) {
  const Lucide = (lucideGlyphs as Record<string, (typeof lucideGlyphs)[keyof typeof lucideGlyphs]>)[name];
  // Figma: stroke weight = size / 24. Lucide draws on a 24 grid, so strokeWidth 1 scales to exactly that.
  return (
    <span className={`baas-icon baas-icon--${size}${color ? ` baas-icon--${color}` : ''}`} style={boxSize ? { width: boxSize, height: boxSize } : undefined} aria-hidden="true">
      {Lucide ? <Lucide size="100%" strokeWidth={1} /> : customGlyphs[name]?.()}
    </span>
  );
}
