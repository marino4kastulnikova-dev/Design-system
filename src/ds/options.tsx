// BaaS design system — WalletOption, ExternalOption, DropdownPanel.
// Portal implementation, pending developer validation.
import { useRef, type KeyboardEvent } from 'react';
import { Coin, type CoinName } from './Coin';
import { Divider } from './Divider';
import { Icon, type IconName } from './Icon';

/** Source: Figma page "wallet-option", set "WalletOption" (396:1894). */
export interface WalletOptionProps {
  coin?: CoinName; title: string; subtitle: string; amount: string;
  selected?: boolean; /** Figma showCheck. Off in every drawn panel. */ showCheck?: boolean;
  onSelect?: () => void; tabIndex?: number; /** Preview only. */ forceState?: 'hover';
}
export function WalletOption({ coin = 'USDT', title, subtitle, amount, selected = false, showCheck = false, onSelect, tabIndex = -1, forceState }: WalletOptionProps) {
  return (
    <div className="baas-wallet-option" role="option" aria-selected={selected} tabIndex={tabIndex} data-force={forceState} onClick={onSelect}>
      <Coin name={coin} />
      <span className="baas-wallet-option__text"><span>{title}</span><span>{subtitle}</span></span>
      <span className="baas-wallet-option__amount">{amount}</span>
      {showCheck && selected && <Icon name="check" size="sm" color="positive" />}
    </div>
  );
}

/** Source: Figma page "wallet-option", component "ExternalOption" (396:1895). */
export function ExternalOption({ icon = 'wallet', title, subtitle, onSelect, tabIndex = -1 }: { icon?: IconName; title: string; subtitle: string; onSelect?: () => void; tabIndex?: number }) {
  return (
    <div className="baas-wallet-option" role="option" aria-selected={false} tabIndex={tabIndex} onClick={onSelect}>
      <Icon name={icon} size="lg" color="strong" />
      <span className="baas-wallet-option__text"><span>{title}</span><span>{subtitle}</span></span>
    </div>
  );
}

export interface Wallet { id: string; coin: CoinName; title: string; subtitle: string; amount: string; group: string; /** Short label for selectors. */ code: string; network?: string }
export interface ExternalDestination { id: string; icon: IconName; title: string; subtitle: string }

/** Source: Figma page "dropdown-panel", set "DropdownPanel" (396:3158). kind = to adds the External group. */
export interface DropdownPanelProps {
  kind?: 'from' | 'to'; wallets: Wallet[]; external?: ExternalDestination[];
  value?: string; onChange?: (id: string) => void; 'aria-label': string;
}
export function DropdownPanel({ kind = 'from', wallets, external = [], value, onChange, ...aria }: DropdownPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const groups = [...new Set(wallets.map((w) => w.group))];
  // Listbox keys as in the Figma accessibility note ("role=listbox with aria-selected on the chosen option; keyboard arrows").
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(ref.current?.querySelectorAll<HTMLElement>('[role=option]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => { e.preventDefault(); items[Math.max(0, Math.min(items.length - 1, n))]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1); else if (e.key === 'ArrowUp') go(i - 1); else if (e.key === 'Home') go(0); else if (e.key === 'End') go(items.length - 1);
    else if ((e.key === 'Enter' || e.key === ' ') && i >= 0) { e.preventDefault(); items[i].click(); }
  };
  const first = value ?? wallets[0]?.id;
  return (
    <div className="baas-dropdown-panel" role="listbox" aria-label={aria['aria-label']} ref={ref} onKeyDown={onKeyDown}>
      {groups.map((g) => (
        <div key={g} role="group" aria-label={g} className="baas-dropdown-panel__group">
          <div className="baas-dropdown-panel__header">{g}</div>
          {wallets.filter((w) => w.group === g).map((w) => <WalletOption key={w.id} {...w} selected={w.id === value} tabIndex={w.id === first ? 0 : -1} onSelect={() => onChange?.(w.id)} />)}
        </div>
      ))}
      {kind === 'to' && external.length > 0 && (
        <>
          <div className="baas-dropdown-panel__divider"><Divider /></div>
          <div role="group" aria-label="External" className="baas-dropdown-panel__group">
            <div className="baas-dropdown-panel__header">External</div>
            {external.map((x) => <ExternalOption key={x.id} {...x} onSelect={() => onChange?.(x.id)} />)}
          </div>
        </>
      )}
    </div>
  );
}
