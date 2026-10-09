// BaaS design system — Checkbox.
// Portal implementation, pending developer validation. Source: Figma page "checkbox", component set "Checkbox" (522:5090).
// Figma defines three states only: unchecked, checked, indeterminate. Hover, disabled, error and a text label
// are not documented, so they are not implemented here.
import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';

export type CheckboxState = 'unchecked' | 'checked' | 'indeterminate';

export interface CheckboxProps {
  state?: CheckboxState;
  /** Called with the next state. indeterminate and unchecked go to checked; checked goes to unchecked. */
  onChange?: (next: CheckboxState) => void;
  /** The component has no visible label in Figma, so an accessible name is required. */
  'aria-label': string;
  id?: string;
  name?: string;
}

export function Checkbox({ state = 'unchecked', onChange, id, name, ...aria }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = state === 'indeterminate'; }, [state]);
  return (
    <span className={`baas-checkbox baas-checkbox--${state}`}>
      <input
        ref={ref}
        id={id}
        name={name}
        type="checkbox"
        className="baas-checkbox__input"
        checked={state === 'checked'}
        onChange={() => onChange?.(state === 'checked' ? 'unchecked' : 'checked')}
        aria-label={aria['aria-label']}
      />
      <span className="baas-checkbox__box" aria-hidden="true">
        {/* Figma: Lucide glyph 14 × 14, 1 px stroke (absolute), text/inverse. */}
        {state === 'checked' && <Check size={14} strokeWidth={1} absoluteStrokeWidth />}
        {state === 'indeterminate' && <Minus size={14} strokeWidth={1} absoluteStrokeWidth />}
      </span>
    </span>
  );
}
