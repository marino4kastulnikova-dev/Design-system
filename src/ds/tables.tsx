// BaaS design system — table rows and headers: TransactionRow, TransactionsHeader, Pagination, TransactionsPanel,
// TransactionsGridHeader, TransactionsGridRow, UserRow, UsersHeader, IbanHeader, IbanRow.
// Portal implementation, pending developer validation. Rows are flex layouts with explicit ARIA table roles,
// because the Figma notes ask for table semantics while the columns mix fixed and fill widths.
import { useState, type ReactNode } from 'react';
import { Button } from './Button';
import { Checkbox, type CheckboxState } from './Checkbox';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { StatusBadge, type StatusBadgeAppearance } from './StatusBadge';

const Cell = ({ c, children, header = false }: { c: string; children?: ReactNode; header?: boolean }) => <div role={header ? 'columnheader' : 'cell'} className={`baas-cell baas-cell--${c}`}>{children}</div>;
export function Table({ children, label, className = '' }: { children: ReactNode; label: string; className?: string }) {
  return <div role="table" aria-label={label} className={`baas-table ${className}`}>{children}</div>;
}

// ---- Transactions (dashboard) — Figma page "transaction-row" ----------------------------------------------
export interface Transaction { date: string; user: string; type: string; merchant: string; card: string; amount: string; fee: string; status: { appearance: StatusBadgeAppearance; label: string } }
/** Source: component "TransactionsHeader" (380:1232). */
export function TransactionsHeader() {
  return (
    <div role="row" className="baas-row baas-row--header baas-tx-header">
      {(['date', 'user', 'kind', 'merchant', 'card', 'amount', 'fee', 'status'] as const).map((c, i) => <Cell key={c} c={`tx-${c}`} header>{['Date', 'User', 'Type', 'Merchant', 'Card', 'Amount', 'Fee', 'Status'][i]}</Cell>)}
    </div>
  );
}
/** Source: component "TransactionRow" (380:1209). */
export function TransactionRow({ date, user, type, merchant, card, amount, fee, status }: Transaction) {
  return (
    <div role="row" className="baas-row baas-tx-row">
      <Cell c="tx-date">{date}</Cell><Cell c="tx-user">{user}</Cell><Cell c="tx-kind">{type}</Cell><Cell c="tx-merchant">{merchant}</Cell>
      <Cell c="tx-card">{card}</Cell><Cell c="tx-amount">{amount}</Cell><Cell c="tx-fee">{fee}</Cell>
      <Cell c="tx-status"><StatusBadge appearance={status.appearance} size="md">{status.label}</StatusBadge></Cell>
    </div>
  );
}
/** Source: component "Pagination" (380:1244). */
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange?: (page: number) => void }) {
  return (
    <nav className="baas-pagination" aria-label="Pagination">
      <div className="baas-pagination__controls">
        <IconButton appearance="ghost" icon="chevron-left" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange?.(page - 1)} />
        <IconButton appearance="ghost" icon="chevron-right" aria-label="Next page" disabled={page >= pages} onClick={() => onChange?.(page + 1)} />
      </div>
      <div className="baas-pagination__info" aria-live="polite">Page <span className="baas-pagination__box">{page}</span> of <span>{pages}</span></div>
    </nav>
  );
}
/** Source: Figma page "transactions-panel", component "TransactionsPanel" (381:1527). */
export function TransactionsPanel({ title = 'Transactions', rows, page, pages, onPageChange }: { title?: string; rows: Transaction[]; page: number; pages: number; onPageChange?: (p: number) => void }) {
  return (
    <section className="baas-tx-panel" aria-label={title}>
      <h2 className="ts-heading-sm">{title}</h2>
      <div className="baas-tx-panel__body">
        <Table label={title} className="baas-table--framed"><TransactionsHeader />{rows.map((r, i) => <TransactionRow key={i} {...r} />)}</Table>
        <Pagination page={page} pages={pages} onChange={onPageChange} />
      </div>
    </section>
  );
}

// ---- Transactions grid — Figma page "transactions-grid" (no documentation in Figma) -----------------------
export interface GridTransaction { id: string; date: string; counterparty: string; account: string; reference: string; method: string; type: string; amount: string; fee: string; status: { appearance: StatusBadgeAppearance; label: string } }
/** Source: component "TransactionsGridHeader" (525:5083). */
export function TransactionsGridHeader({ selection = 'unchecked', onSelectAll }: { selection?: CheckboxState; onSelectAll?: (next: CheckboxState) => void }) {
  return (
    <div role="row" className="baas-row baas-row--header baas-grid-row">
      <div className="baas-cell baas-cell--grid-combo" role="columnheader"><span className="baas-cell--grid-check"><Checkbox state={selection} onChange={onSelectAll} aria-label="Select all transactions" /></span><span className="baas-cell--grid-date">Date</span></div>
      <Cell c="grid-counterparty" header>Counterparty</Cell><Cell c="grid-reference" header>User</Cell><Cell c="grid-method" header>Method</Cell>
      <Cell c="grid-type" header>Type <Icon name="arrow-down-up" size="sm" color="default" /></Cell><Cell c="grid-amount" header>Amount</Cell><Cell c="grid-status" header>Status</Cell>
    </div>
  );
}
/** Source: set "TransactionsGridRow" (525:5175). States: default, selected (checkbox checked), hover (copy button appears). */
export function TransactionsGridRow({ row, selected = false, onSelect, onCopy, forceState }: { row: GridTransaction; selected?: boolean; onSelect?: (selected: boolean) => void; onCopy?: (reference: string) => void; forceState?: 'hover' }) {
  return (
    <div role="row" aria-selected={selected} className="baas-row baas-grid-row" data-force={forceState}>
      <div className="baas-cell baas-cell--grid-combo" role="cell"><span className="baas-cell--grid-check"><Checkbox state={selected ? 'checked' : 'unchecked'} onChange={(n) => onSelect?.(n === 'checked')} aria-label={`Select transaction ${row.reference}`} /></span><span className="baas-cell--grid-date">{row.date}</span></div>
      <Cell c="grid-counterparty"><span>{row.counterparty}</span><span>{row.account}</span></Cell>
      <Cell c="grid-reference"><span>{row.reference}</span><span className="baas-row__reveal"><IconButton appearance="ghost" icon="copy" aria-label={`Copy reference ${row.reference}`} onClick={() => onCopy?.(row.reference)} /></span></Cell>
      <Cell c="grid-method">{row.method}</Cell>
      <Cell c="grid-type"><StatusBadge appearance="neutral" size="sm">{row.type}</StatusBadge></Cell>
      <Cell c="grid-amount"><span>{row.amount}</span><span>fee {row.fee}</span></Cell>
      <Cell c="grid-status"><StatusBadge appearance={row.status.appearance} size="md">{row.status.label}</StatusBadge></Cell>
    </div>
  );
}

// ---- Users — Figma page "user-row" -------------------------------------------------------------------------
export interface User { name: string; role: string; email: string; status: { appearance: StatusBadgeAppearance; label: string }; kyc: { appearance: StatusBadgeAppearance; label: string }; accounts: string; cards: string; created: string }
/** Source: component "UsersHeader" (388:2727). */
export function UsersHeader() {
  return (
    <div role="row" className="baas-row baas-row--header baas-wide-row">
      {(['name', 'email', 'status', 'kyc', 'accounts', 'cards', 'created', 'actions'] as const).map((c, i) => <Cell key={c} c={`user-${c}`} header>{['Name', 'Email', 'Status', 'KYC', 'Accounts', 'Cards', 'Created', 'Actions'][i]}</Cell>)}
    </div>
  );
}
/** Source: component "UserRow" (388:2403). */
export function UserRow({ user, onCards }: { user: User; onCards?: () => void }) {
  return (
    <div role="row" className="baas-row baas-wide-row">
      <Cell c="user-name"><span>{user.name}</span><StatusBadge appearance="neutral" size="md">{user.role}</StatusBadge></Cell>
      <Cell c="user-email">{user.email}</Cell>
      <Cell c="user-status"><StatusBadge appearance={user.status.appearance} size="md">{user.status.label}</StatusBadge></Cell>
      <Cell c="user-kyc"><StatusBadge appearance={user.kyc.appearance} size="md">{user.kyc.label}</StatusBadge></Cell>
      <Cell c="user-accounts">{user.accounts}</Cell><Cell c="user-cards">{user.cards}</Cell><Cell c="user-created">{user.created}</Cell>
      <Cell c="user-actions"><Button appearance="secondary" size="sm" leadingIcon="credit-card" aria-label={`Cards of ${user.name}`} onClick={onCards}>Cards</Button></Cell>
    </div>
  );
}

// ---- IBAN accounts — Figma page "iban-table" -----------------------------------------------------------------
export interface IbanAccount { name: string; iban: string; owner: string; currency: string; balance: string; status: { appearance: StatusBadgeAppearance; label: string } }
/** Source: component "IbanHeader" (496:5131). */
export function IbanHeader() {
  return (
    <div role="row" className="baas-row baas-row--header baas-wide-row">
      {(['name', 'iban', 'owner', 'currency', 'balance', 'status', 'actions'] as const).map((c, i) => <Cell key={c} c={`iban-${c}`} header>{['Name', 'IBAN', 'Owner', 'Currency', 'Balance', 'Status', 'Actions'][i]}</Cell>)}
    </div>
  );
}
/** Source: set "IbanRow" (500:5175). state = hover shows the copy button (marked PROPOSED in Figma). */
export function IbanRow({ account, onOpen, onTopUp, forceState }: { account: IbanAccount; onOpen?: () => void; onTopUp?: () => void; forceState?: 'hover' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { void navigator.clipboard?.writeText(account.iban); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <div role="row" className="baas-row baas-wide-row" data-force={forceState}>
      <Cell c="iban-name"><a href="#" onClick={(e) => { e.preventDefault(); onOpen?.(); }}>{account.name}</a></Cell>
      <Cell c="iban-iban"><span>{account.iban}</span><span className="baas-row__reveal"><IconButton appearance="ghost" icon={copied ? 'check' : 'copy'} aria-label={copied ? 'IBAN copied' : 'Copy IBAN'} onClick={copy} /></span></Cell>
      <Cell c="iban-owner">{account.owner}</Cell><Cell c="iban-currency">{account.currency}</Cell><Cell c="iban-balance">{account.balance}</Cell>
      <Cell c="iban-status"><StatusBadge appearance={account.status.appearance} size="md">{account.status.label}</StatusBadge></Cell>
      <Cell c="iban-actions"><Button appearance="secondary" size="sm" leadingIcon="plus" aria-label={`Top up ${account.name}`} onClick={onTopUp}>Top up</Button></Cell>
    </div>
  );
}
