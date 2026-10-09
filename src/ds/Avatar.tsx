// BaaS design system — Avatar. Source: Figma page "avatar", component "Avatar" (348:907). Dark surfaces only.
// Portal implementation, pending developer validation.
export interface AvatarProps { /** 1–2 letters. Decorative next to the user's name. */ initials: string }
export function Avatar({ initials }: AvatarProps) {
  return <span className="baas-avatar" aria-hidden="true">{initials}</span>;
}
