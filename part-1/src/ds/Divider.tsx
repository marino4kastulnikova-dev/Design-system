// BaaS design system — Divider. Source: Figma page "divider", set "Divider" (342:844).
// Portal implementation, pending developer validation.
export interface DividerProps { appearance?: 'default' | 'inverse'; /** Set when the line separates real content; otherwise it is decorative. */ semantic?: boolean }
export function Divider({ appearance = 'default', semantic = false }: DividerProps) {
  return <div className={`baas-divider baas-divider--${appearance}`} role={semantic ? 'separator' : 'presentation'} />;
}
