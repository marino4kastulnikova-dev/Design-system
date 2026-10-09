// BaaS design system — Input. Source: Figma page "input", set "Input" (357:969).
// Portal implementation, pending developer validation.
import type { InputHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leadingIcon?: IconName;
  /** A select trigger uses chevron-down; the read-only field uses copy. */ trailingIcon?: IconName;
  /** Figma state = error. Pair it with an error message: the red outline alone is not enough. */ error?: boolean;
  /** Preview only. */ forceState?: 'hover' | 'focus';
}
export function Input({ leadingIcon, trailingIcon, error = false, forceState, className, style, disabled, ...rest }: InputProps) {
  return (
    <span className={['baas-input', error && 'baas-input--error', disabled && 'baas-input--disabled', className].filter(Boolean).join(' ')} data-force={forceState} style={style}>
      {leadingIcon && <Icon name={leadingIcon} size="lg" color="muted" />}
      <input {...rest} disabled={disabled} aria-invalid={error || undefined} className="baas-input__field" />
      {trailingIcon && <Icon name={trailingIcon} size="lg" color="muted" />}
    </span>
  );
}
