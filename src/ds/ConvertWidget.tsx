// BaaS design system — ConvertWidget. Source: Figma page "convert-widget", component "ConvertWidget" (381:1429).
// Portal implementation, pending developer validation. The currency selector and the amount display are plain frames
// in Figma ("TokenSelect and AmountField molecules are not extracted yet"), so they are private parts here.
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Coin } from './Coin';
import { Divider } from './Divider';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { DropdownPanel, type ExternalDestination, type Wallet } from './options';
import { WithTooltip } from './Tooltip';

export interface ConvertWidgetProps {
  wallets: Wallet[]; external?: ExternalDestination[];
  from: string; to: string; onChange?: (next: { from: string; to: string }) => void;
  /** Display strings: the widget does no arithmetic. */ amount: string; fiat: string; receive: string; rate: string; note?: string;
  onContinue?: () => void;
}

function TokenSelect({ side, wallet, wallets, external, onPick }: { side: 'from' | 'to'; wallet: Wallet; wallets: Wallet[]; external?: ExternalDestination[]; onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => { if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) { setOpen(false); if (e instanceof KeyboardEvent) ref.current?.querySelector('button')?.focus(); } };
    document.addEventListener('mousedown', close); document.addEventListener('keydown', close);
    ref.current?.querySelector<HTMLElement>('[role=option][tabindex="0"]')?.focus();
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [open]);
  return (
    <div className="baas-token-select" ref={ref}>
      <button type="button" className="baas-token-select__trigger" aria-haspopup="listbox" aria-expanded={open} aria-label={`${side === 'from' ? 'From' : 'To'}: ${wallet.title}`} onClick={() => setOpen((o) => !o)}>
        <Coin name={wallet.coin} /><span className="baas-token-select__code">{wallet.code}</span>{wallet.network && <span className="baas-token-select__net">({wallet.network})</span>}
        <Icon name="chevron-down" size="md" color="muted" />
      </button>
      {/* Figma usage note: the panel opens under the From or To selector. */}
      {open && <div className="baas-token-select__panel"><DropdownPanel kind={side} wallets={wallets} external={external} value={wallet.id} onChange={(id) => { onPick(id); setOpen(false); }} aria-label={side === 'from' ? 'From wallet' : 'To wallet'} /></div>}
    </div>
  );
}

export function ConvertWidget({ wallets, external, from, to, onChange, amount, fiat, receive, rate, note = 'Live market rate — no additional fees', onContinue }: ConvertWidgetProps) {
  const w = (id: string) => wallets.find((x) => x.id === id) ?? wallets[0];
  const a = w(from), b = w(to);
  return (
    <section className="baas-convert" aria-label="Convert">
      <div className="baas-convert__form">
        <h2 className="ts-heading-sm">Convert</h2>
        <div className="baas-convert__boxes">
          <div className="baas-convert__side">
            <div className="baas-convert__meta"><span>From:</span><span>{a.amount} {a.code}</span></div>
            <div className="baas-convert__line"><TokenSelect side="from" wallet={a} wallets={wallets} onPick={(id) => onChange?.({ from: id, to: id === to ? from : to })} />
              <div className="baas-convert__amount"><span>≈{fiat}</span><strong>{amount}</strong></div></div>
          </div>
          <div className="baas-convert__side">
            <div className="baas-convert__meta"><span>To:</span><span>{b.amount} {b.code}</span></div>
            <div className="baas-convert__line"><TokenSelect side="to" wallet={b} wallets={wallets} external={external} onPick={(id) => { if (wallets.some((x) => x.id === id)) onChange?.({ from: id === from ? to : from, to: id }); }} />
              <div className="baas-convert__amount baas-convert__amount--to"><strong>{receive}</strong></div></div>
          </div>
          <span className="baas-convert__glow" />
          <span className="baas-convert__swap"><WithTooltip label="Swap"><IconButton appearance="glass" icon="arrow-down-up" aria-label="Swap" onClick={() => onChange?.({ from: to, to: from })} /></WithTooltip></span>
        </div>
      </div>
      <div className="baas-convert__summary">
        <div className="baas-convert__rate">
          <div><p>Exchange rate</p><p className="ts-heading-sm">{rate}</p></div>
          <Divider />
          <p>{note}</p>
        </div>
        <Button appearance="primary" onClick={onContinue} className="baas-button--fill">Continue</Button>
      </div>
    </section>
  );
}
