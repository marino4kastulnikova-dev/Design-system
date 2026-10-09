// BaaS design system — SelectOption and SelectMenu. Source: Figma page "select-menu", sets 481:5141 and 481:5178.
// Portal implementation, pending developer validation.
import { useRef, type KeyboardEvent } from 'react';
import { Icon } from './Icon';

export interface SelectOptionProps { label: string; selected?: boolean; onSelect?: () => void; tabIndex?: number; /** Preview only. */ forceState?: 'hover' }
export function SelectOption({ label, selected = false, onSelect, tabIndex = -1, forceState }: SelectOptionProps) {
  return (
    <div className="baas-select-option" role="option" aria-selected={selected} tabIndex={tabIndex} data-force={forceState} onClick={onSelect}>
      <span>{label}</span>
      {selected && <Icon name="check" size="sm" color="positive" />}
    </div>
  );
}

/** Option lists drawn in Figma for the two kinds (content supplied by Mary 2026-09-25). */
export const selectMenuOptions = {
  status: ['All Statuses', 'Active', 'Inactive', 'Blocked', 'Pending', 'Suspended'],
  kyc: ['All KYC', 'Not Started', 'Started', 'Pending', 'Approved', 'Verified', 'Rejected', 'Inherited'],
} as const;

export interface SelectMenuProps {
  /** Figma kind: picks one of the two documented lists. */ kind?: keyof typeof selectMenuOptions;
  /** Custom list. Overrides kind. */ options?: readonly string[];
  value: string; onChange?: (value: string) => void; 'aria-label': string;
}
/**
 * Single-choice listbox. Selection semantics and keyboard behaviour are marked NEEDS CONFIRMATION in Figma;
 * this follows the standard listbox pattern (arrows, Home, End move focus; Enter or Space selects). Proposed — needs review.
 */
export function SelectMenu({ kind = 'status', options, value, onChange, ...aria }: SelectMenuProps) {
  const list = options ?? selectMenuOptions[kind];
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(ref.current?.querySelectorAll<HTMLElement>('[role=option]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => { e.preventDefault(); items[Math.max(0, Math.min(items.length - 1, n))]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if ((e.key === 'Enter' || e.key === ' ') && i >= 0) { e.preventDefault(); onChange?.(list[i]); }
  };
  return (
    <div className="baas-select-menu" role="listbox" aria-label={aria['aria-label']} ref={ref} onKeyDown={onKeyDown}>
      {list.map((o) => <SelectOption key={o} label={o} selected={o === value} tabIndex={o === value || (!list.includes(value) && o === list[0]) ? 0 : -1} onSelect={() => onChange?.(o)} />)}
    </div>
  );
}
