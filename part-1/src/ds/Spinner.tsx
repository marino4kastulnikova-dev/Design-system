// BaaS design system — Spinner. Source: Figma page "spinner", set "Spinner" (348:961).
// Portal implementation, pending developer validation.
export interface SpinnerProps {
  /** lg 64, md 20 (size/spinner/*). */ size?: 'lg' | 'md';
  /** Accessible status text. */ label?: string;
  /** Proposed — needs review: motion is not designed in Figma, the arc is static there. */ animated?: boolean;
}
export function Spinner({ size = 'lg', label = 'Loading', animated = false }: SpinnerProps) {
  return <span className={`baas-spinner baas-spinner--${size}${animated ? ' baas-spinner--animated' : ''}`} role="status" aria-label={label} />;
}
