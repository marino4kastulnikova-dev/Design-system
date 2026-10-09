// BaaS design system — CountBadge. Source: Figma page "count-badge", component "CountBadge" (523:5083). No documentation in Figma.
// Portal implementation, pending developer validation.
export interface CountBadgeProps { count: number | string }
export function CountBadge({ count }: CountBadgeProps) {
  return <span className="baas-count-badge">{count}</span>;
}
