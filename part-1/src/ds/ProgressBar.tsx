// BaaS design system — ProgressBar. Source: Figma page "progress-bar", component "ProgressBar" (348:963). Dark surfaces only.
// Portal implementation, pending developer validation.
export interface ProgressBarProps { /** 0–100. In Figma the value is the width of the Fill layer. */ value: number; 'aria-label': string }
export function ProgressBar({ value, ...aria }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="baas-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} aria-label={aria['aria-label']}>
      <div className="baas-progress__fill" style={{ width: `${v}%` }} />
    </div>
  );
}
