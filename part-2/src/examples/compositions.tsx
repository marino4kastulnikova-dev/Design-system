// Examples for compositions, tables, overlays and widgets. One export per Figma page.
import { useEffect, useState, type ReactNode } from 'react';
import {
  AccountCard, AccountDetailsModal, AiAssistant, Button, ConfirmPaymentModal, ConvertModal, ConvertWidget, DashboardLayout, DropdownPanel, ExternalOption,
  IbanHeader, IbanRow, MetricCard, ModalOverlay, PageHeader, Pagination, SectionHeader, Sidebar, Table, TransactionRow, TransactionsGridHeader, TransactionsGridRow,
  TransactionsHeader, TransactionsPanel, UserRow, UsersHeader, WalletOption, iconNames,
  type CheckboxState, type CoinName, type IconName, type MoneyMovement, type Theme,
} from '../ds';
import { confirmContent, external, gridRows, ibanAccounts, moreTransactions, resultContent, transactions, users, wallets } from './data';
import { attrs, bool, GLASS, LIGHT, sel, txt, type Args, type ComponentExample } from './types';

const CANVAS: ComponentExample['surfaces'] = ['surface/canvas', 'surface/raised'];
const W = ({ w, children }: { w: number | string; children: ReactNode }) => <div style={{ width: w, maxWidth: 'none' }}>{children}</div>;
const types: MoneyMovement[] = ['conversion', 'transfer', 'withdrawal'];

// ---- metric-card -------------------------------------------------------------------------------------------
export const metricCardExample: ComponentExample = {
  slug: 'metric-card', defaults: { title: 'Team members', value: '128', icon: 'users', showDelta: true, delta: '+18%', trend: 'up' },
  controls: [txt('title'), txt('value'), sel('icon', iconNames), bool('showDelta'), txt('delta', { when: (a) => a.showDelta === true }), sel('trend', ['up', 'down'], { when: (a) => a.showDelta === true })],
  surfaces: GLASS,
  render: (a) => <W w={366}><MetricCard title={String(a.title)} value={String(a.value)} icon={a.icon as IconName} delta={a.showDelta ? { value: String(a.delta), trend: a.trend as 'up' | 'down' } : undefined} /></W>,
  code: (a) => `<MetricCard title="${a.title}" value="${a.value}" icon="${a.icon}"${a.showDelta ? ` delta={{ value: '${a.delta}', trend: '${a.trend}' }}` : ''} />`,
  matrix: () => [{ title: 'showDelta · content from the dashboard (values are synthetic)', surface: 'surface/canvas', columns: ['showDelta = false (as drawn)', 'showDelta = true'], rows: [
    { label: '', cells: [<W w={366}><MetricCard title="Title" value="0" /></W>, <W w={366}><MetricCard title="Team members" value="128" delta={{ value: '+18%', trend: 'up' }} /></W>] },
    { label: '', cells: [<W w={366}><MetricCard title="API Calls Today" value="24,310" icon="arrow-left-right" /></W>, <W w={366}><MetricCard title="Success rate API" value="99.2%" icon="check" delta={{ value: '+12%', trend: 'up', appearance: 'warning' }} /></W>] }] }],
};

// ---- account-card ------------------------------------------------------------------------------------------
const cards = {
  iban: { name: 'IBAN', balance: '25,567.40', currency: 'EUR', limit: '10,000.00 EUR', spent: '4,450.00 EUR', progress: (145 / 326) * 100 },
  wallet: { name: 'Wallet-1', balance: '18,204.60', currency: 'EUR', limit: '15,000.00 EUR', spent: '5,180.00 EUR', progress: (145 / 326) * 100, members: ['AK', 'SA', 'MN'], membersLabel: '125 users' },
};
export const accountCardExample: ComponentExample = {
  slug: 'account-card', defaults: { appearance: 'iban' }, controls: [sel('appearance', ['iban', 'wallet'])], surfaces: CANVAS,
  render: (a) => <AccountCard appearance={a.appearance as 'iban' | 'wallet'} {...cards[a.appearance as 'iban' | 'wallet']} />,
  code: (a) => { const c = cards[a.appearance as 'iban' | 'wallet']; return `<AccountCard appearance="${a.appearance}" name="${c.name}" balance="${c.balance}" currency="${c.currency}"\n  limit="${c.limit}" spent="${c.spent}" progress={${Math.round(c.progress)}}${a.appearance === 'wallet' ? `\n  members={['AK', 'SA', 'MN']} membersLabel="125 users"` : ''} />`; },
  matrix: () => [{ title: 'appearance', surface: 'surface/canvas', columns: ['iban', 'wallet'], rows: [{ label: '', cells: [<AccountCard appearance="iban" {...cards.iban} />, <AccountCard appearance="wallet" {...cards.wallet} />] }] }],
};

// ---- page-header -------------------------------------------------------------------------------------------
function PageHeaderDemo({ title }: { title: string }) { const [theme, setTheme] = useState<Theme>('light'); return <PageHeader title={title} theme={theme} onThemeChange={setTheme} />; }
export const pageHeaderExample: ComponentExample = {
  slug: 'page-header', defaults: { title: 'Welcome, Emily Gibson!' }, controls: [txt('title')], surfaces: LIGHT, naturalWidth: 1000,
  render: (a) => <PageHeaderDemo title={String(a.title)} />,
  code: (a) => `<PageHeader title="${a.title}" liveLabel="Live · Updated 2 min ago" theme={theme} onThemeChange={setTheme} />`,
  matrix: () => [{ title: 'single component', surface: 'surface/raised', columns: ['default'], rows: [{ label: '', cells: [<W w={900}><PageHeader title="Welcome, Emily Gibson!" /></W>] }] }],
};

// ---- wallet-option -----------------------------------------------------------------------------------------
export const walletOptionExample: ComponentExample = {
  slug: 'wallet-option', defaults: { coin: 'USDT', title: 'USDT (TRC20)', subtitle: 'Crypto wallet', amount: '10,860.00', selected: false, showCheck: false },
  controls: [sel('coin', ['USDT', 'USDC', 'EUR'], { note: 'Coins are instances of the external icon-transactions component.' }), txt('title'), txt('subtitle'), txt('amount'), bool('selected', { label: 'state: selected' }), bool('showCheck', { when: (a) => a.selected === true })],
  surfaces: LIGHT, hint: 'Click the row to select it.',
  render: (a, set) => <div role="listbox" aria-label="Wallet" style={{ width: 284 }}><WalletOption coin={a.coin as CoinName} title={String(a.title)} subtitle={String(a.subtitle)} amount={String(a.amount)} selected={a.selected === true} showCheck={a.showCheck === true} tabIndex={0} onSelect={() => set({ selected: !a.selected })} /></div>,
  code: (a) => `<WalletOption coin="${a.coin}" title="${a.title}" subtitle="${a.subtitle}" amount="${a.amount}"${attrs([['selected', a.selected === true], ['showCheck', a.showCheck === true]])} />`,
  matrix: () => [
    { title: 'WalletOption · state', surface: 'surface/raised', columns: ['default', 'hover', 'selected'], rows: [{ label: 'showCheck = false', cells: [
      <W w={284}><WalletOption title="USDT (TRC20)" subtitle="Crypto wallet" amount="10,860.00" /></W>, <W w={284}><WalletOption title="USDT (TRC20)" subtitle="Crypto wallet" amount="10,860.00" forceState="hover" /></W>, <W w={284}><WalletOption title="USDT (TRC20)" subtitle="Crypto wallet" amount="10,860.00" selected /></W>] },
    { label: 'showCheck = true', cells: [null, null, <W w={284}><WalletOption title="USDT (TRC20)" subtitle="Crypto wallet" amount="10,860.00" selected showCheck /></W>] }] },
    { title: 'ExternalOption', surface: 'surface/raised', columns: ['wallet', 'credit-card'], rows: [{ label: '', cells: [<W w={284}><ExternalOption {...external[0]} /></W>, <W w={284}><ExternalOption {...external[1]} /></W>] }] },
  ],
};

// ---- dropdown-panel ----------------------------------------------------------------------------------------
export const dropdownPanelExample: ComponentExample = {
  slug: 'dropdown-panel', defaults: { kind: 'from', value: 'usdt' },
  controls: [sel('kind', ['from', 'to']), sel('value', wallets.map((w) => w.id), { label: 'selected wallet' })], surfaces: CANVAS,
  hint: 'Click a wallet to select it. Arrow keys, Home and End move focus; Enter or Space selects.',
  render: (a, set) => <DropdownPanel kind={a.kind as 'from' | 'to'} wallets={wallets} external={external} value={String(a.value)} onChange={(id) => { if (wallets.some((w) => w.id === id)) set({ value: id }); }} aria-label={a.kind === 'from' ? 'From wallet' : 'To wallet'} />,
  code: (a) => `<DropdownPanel kind="${a.kind}" wallets={wallets}${a.kind === 'to' ? ' external={external}' : ''} value={walletId} onChange={setWalletId} aria-label="${a.kind === 'from' ? 'From' : 'To'} wallet" />`,
  matrix: () => [{ title: 'kind', surface: 'surface/canvas', columns: ['from', 'to'], rows: [{ label: '', cells: [<DropdownPanel kind="from" wallets={wallets} value="usdt" aria-label="From wallet" />, <DropdownPanel kind="to" wallets={wallets} external={external} value="usdc" aria-label="To wallet" />] }] }],
};

// ---- sidebar -----------------------------------------------------------------------------------------------
export const sidebarExample: ComponentExample = {
  slug: 'sidebar', defaults: { collapsed: false, selected: 'home', userName: 'Emily Gibson', userRole: 'Admin' },
  controls: [bool('collapsed', { label: 'SidebarCollapsed' }), sel('selected', ['home', 'users', 'transactions', 'iban', 'wallets', 'cards', 'crypto', 'fee-plans', 'tariff', 'billing', 'docs', 'logs'], { label: 'selected item' }), txt('userName'), txt('userRole')],
  surfaces: CANVAS, hint: 'Click an item to select it. The panel button collapses the menu; when collapsed, item names show in a tooltip on hover or focus.',
  render: (a, set) => <div style={{ height: 1040 }}><Sidebar collapsed={a.collapsed === true} selected={String(a.selected)} userName={String(a.userName)} userRole={String(a.userRole)} initials={String(a.userName).split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()} onSelect={(id) => set({ selected: id })} onToggle={() => set({ collapsed: !a.collapsed })} /></div>,
  code: (a) => `<Sidebar${attrs([['collapsed', a.collapsed === true]])} selected="${a.selected}" onSelect={setSelected} onToggle={toggle} userName="${a.userName}" userRole="${a.userRole}" />`,
  matrix: () => [{ title: 'Sidebar · SidebarCollapsed (shown at 60%)', surface: 'surface/canvas', columns: ['Sidebar', 'SidebarCollapsed'], zoom: 0.6, rows: [{ label: '', cells: [<div style={{ height: 1040 }}><Sidebar /></div>, <div style={{ height: 1040 }}><Sidebar collapsed /></div>] }] }],
};

// ---- transaction-row ---------------------------------------------------------------------------------------
function PaginationDemo() { const [page, setPage] = useState(1); return <Pagination page={page} pages={20} onChange={setPage} />; }
export const transactionRowExample: ComponentExample = {
  slug: 'transaction-row', defaults: { ...transactions[0], status: 'positive', statusLabel: 'Completed' } as unknown as Args,
  controls: [txt('date'), txt('user'), txt('type'), txt('merchant'), txt('card'), txt('amount'), txt('fee'), sel('status', ['positive', 'warning', 'danger'], { label: 'status appearance' }), txt('statusLabel', { label: 'status label' })],
  surfaces: GLASS, naturalWidth: 1083, hint: 'The header row and the pagination bar are separate components on the same Figma page. Use the arrows to change the page.',
  render: (a) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Table label="Transactions"><TransactionsHeader /><TransactionRow date={String(a.date)} user={String(a.user)} type={String(a.type)} merchant={String(a.merchant)} card={String(a.card)} amount={String(a.amount)} fee={String(a.fee)} status={{ appearance: a.status as 'positive', label: String(a.statusLabel) }} /></Table>
      <PaginationDemo />
    </div>
  ),
  code: (a) => `<Table label="Transactions">\n  <TransactionsHeader />\n  <TransactionRow date="${a.date}" user="${a.user}" type="${a.type}" merchant="${a.merchant}" card="${a.card}"\n    amount="${a.amount}" fee="${a.fee}" status={{ appearance: '${a.status}', label: '${a.statusLabel}' }} />\n</Table>\n<Pagination page={page} pages={20} onChange={setPage} />`,
  matrix: () => [{ title: 'TransactionsHeader · TransactionRow · Pagination (shown at 80%)', surface: 'surface/canvas', columns: [''], zoom: 0.8, rows: [
    { label: 'TransactionsHeader', cells: [<W w={1083}><Table label="Header"><TransactionsHeader /></Table></W>] },
    { label: 'TransactionRow', cells: [<W w={1083}><Table label="Row"><TransactionRow {...transactions[0]} /></Table></W>] },
    { label: 'Pagination', cells: [<W w={1083}><Pagination page={1} pages={20} /></W>] }] }],
};

// ---- transactions-panel ------------------------------------------------------------------------------------
function PanelDemo() { const [page, setPage] = useState(1); return <TransactionsPanel rows={page % 2 ? transactions : moreTransactions} page={page} pages={20} onPageChange={setPage} />; }
export const transactionsPanelExample: ComponentExample = {
  slug: 'transactions-panel', defaults: {}, controls: [], surfaces: CANVAS, naturalWidth: 1131, hint: 'Use the pagination arrows: the rows change (local mock data).',
  render: () => <PanelDemo />,
  code: () => `<TransactionsPanel rows={rows} page={page} pages={20} onPageChange={setPage} />`,
  matrix: () => [{ title: 'single component (shown at 75%)', surface: 'surface/canvas', columns: [''], zoom: 0.75, rows: [{ label: '', cells: [<W w={1131}><TransactionsPanel rows={transactions} page={1} pages={20} /></W>] }] }],
};

// ---- transactions-grid -------------------------------------------------------------------------------------
function GridDemo() {
  const [sel, setSel] = useState<string[]>(['2']);
  const all: CheckboxState = sel.length === 0 ? 'unchecked' : sel.length === gridRows.length ? 'checked' : 'indeterminate';
  return (
    <Table label="Transactions">
      <TransactionsGridHeader selection={all} onSelectAll={(n) => setSel(n === 'checked' ? gridRows.map((r) => r.id) : [])} />
      {gridRows.map((r) => <TransactionsGridRow key={r.id} row={r} selected={sel.includes(r.id)} onSelect={(on) => setSel((s) => (on ? [...s, r.id] : s.filter((x) => x !== r.id)))} onCopy={(ref) => void navigator.clipboard?.writeText(ref)} />)}
    </Table>
  );
}
export const transactionsGridExample: ComponentExample = {
  slug: 'transactions-grid', defaults: {}, controls: [], surfaces: GLASS, naturalWidth: 1513,
  hint: 'Tick a row or "select all": the header checkbox shows the mixed state. Hover a row to reveal its copy button.',
  render: () => <GridDemo />,
  code: () => `<Table label="Transactions">\n  <TransactionsGridHeader selection={selection} onSelectAll={selectAll} />\n  {rows.map((row) => (\n    <TransactionsGridRow key={row.id} row={row} selected={selected.includes(row.id)} onSelect={(on) => toggle(row.id, on)} />\n  ))}\n</Table>`,
  matrix: () => [{ title: 'TransactionsGridHeader · TransactionsGridRow state (shown at 60%)', surface: 'surface/canvas', columns: [''], zoom: 0.6, rows: [
    { label: 'header', cells: [<W w={1513}><Table label="Header"><TransactionsGridHeader /></Table></W>] },
    { label: 'default', cells: [<W w={1513}><Table label="Row"><TransactionsGridRow row={gridRows[0]} /></Table></W>] },
    { label: 'selected', cells: [<W w={1513}><Table label="Row"><TransactionsGridRow row={gridRows[0]} selected /></Table></W>] },
    { label: 'hover', cells: [<W w={1513}><Table label="Row"><TransactionsGridRow row={gridRows[0]} forceState="hover" /></Table></W>] }] }],
};

// ---- user-row ----------------------------------------------------------------------------------------------
export const userRowExample: ComponentExample = {
  slug: 'user-row', defaults: { name: users[0].name, email: users[0].email, accounts: '1', cards: '1', created: users[0].created },
  controls: [txt('name'), txt('email'), txt('accounts'), txt('cards'), txt('created')], surfaces: GLASS, naturalWidth: 1517,
  render: (a) => <Table label="Users"><UsersHeader /><UserRow user={{ ...users[0], name: String(a.name), email: String(a.email), accounts: String(a.accounts), cards: String(a.cards), created: String(a.created) }} />{users.slice(1).map((u) => <UserRow key={u.email} user={u} />)}</Table>,
  code: () => `<Table label="Users">\n  <UsersHeader />\n  {users.map((user) => <UserRow key={user.email} user={user} onCards={() => openCards(user)} />)}\n</Table>`,
  matrix: () => [{ title: 'UsersHeader · UserRow (shown at 60%)', surface: 'surface/canvas', columns: [''], zoom: 0.6, rows: [
    { label: 'UsersHeader', cells: [<W w={1517}><Table label="Header"><UsersHeader /></Table></W>] }, { label: 'UserRow', cells: [<W w={1517}><Table label="Row"><UserRow user={users[0]} /></Table></W>] }] }],
};

// ---- iban-table --------------------------------------------------------------------------------------------
export const ibanTableExample: ComponentExample = {
  slug: 'iban-table', defaults: { name: 'Personal', owner: 'Lorem ipsum', currency: 'EUR', balance: '€2.00', iban: 'AA743400000000000000' },
  controls: [txt('name'), txt('iban'), txt('owner'), txt('currency'), txt('balance')], surfaces: GLASS, naturalWidth: 1517,
  hint: 'Hover a row (or focus inside it) to reveal the copy button; click it to copy the IBAN.',
  render: (a) => <Table label="IBAN accounts"><IbanHeader /><IbanRow account={{ ...ibanAccounts[0], name: String(a.name), iban: String(a.iban), owner: String(a.owner), currency: String(a.currency), balance: String(a.balance) }} /><IbanRow account={ibanAccounts[1]} /></Table>,
  code: () => `<Table label="IBAN accounts">\n  <IbanHeader />\n  {accounts.map((account) => (\n    <IbanRow key={account.iban} account={account} onOpen={() => openDetails(account)} onTopUp={() => topUp(account)} />\n  ))}\n</Table>`,
  matrix: () => [{ title: 'IbanHeader · IbanRow state (shown at 60%)', surface: 'surface/canvas', columns: [''], zoom: 0.6, rows: [
    { label: 'IbanHeader', cells: [<W w={1517}><Table label="Header"><IbanHeader /></Table></W>] }, { label: 'default', cells: [<W w={1517}><Table label="Row"><IbanRow account={ibanAccounts[0]} /></Table></W>] },
    { label: 'hover', cells: [<W w={1517}><Table label="Row"><IbanRow account={ibanAccounts[0]} forceState="hover" /></Table></W>] }] }],
};

// ---- convert-widget ----------------------------------------------------------------------------------------
function ConvertDemo({ initial, onPair }: { initial: { from: string; to: string }; onPair?: (p: { from: string; to: string }) => void }) {
  const [pair, setPair] = useState(initial);
  useEffect(() => setPair(initial), [initial.from, initial.to]); // eslint-disable-line react-hooks/exhaustive-deps
  const [sent, setSent] = useState(false);
  const code = (id: string) => wallets.find((w) => w.id === id)!.code;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <ConvertWidget wallets={wallets} external={external} from={pair.from} to={pair.to} onChange={(p) => { setPair(p); onPair?.(p); setSent(false); }} amount="9,240" fiat="9,240.00 USD" receive="9,166.08" rate={`1 ${code(pair.from)} = 0.992 ${code(pair.to)}`} onContinue={() => setSent(true)} />
      <p role="status" style={{ margin: 0, minHeight: 16, font: '12px system-ui', color: '#6e6e73' }}>{sent ? 'onContinue fired. In the product this opens the confirmation modal.' : ''}</p>
    </div>
  );
}
export const convertWidgetExample: ComponentExample = {
  slug: 'convert-widget', defaults: { from: 'usdt', to: 'usdc' },
  controls: [sel('from', wallets.map((w) => w.id)), sel('to', wallets.map((w) => w.id))], surfaces: CANVAS, naturalWidth: 749,
  hint: 'Open a currency selector to pick a wallet from the dropdown, or press the swap button. Amounts are fixed sample strings: the widget does no arithmetic.',
  render: (a, set) => <ConvertDemo initial={{ from: String(a.from), to: String(a.to) }} onPair={(p) => set(p)} />,
  code: (a) => `<ConvertWidget wallets={wallets} external={external} from="${a.from}" to="${a.to}" onChange={setPair}\n  amount="9,240" fiat="9,240.00 USD" receive="9,166.08" rate="1 USDT = 0.992 USDC" onContinue={openConfirmation} />`,
  matrix: () => [{ title: 'single component', surface: 'surface/canvas', columns: [''], rows: [{ label: '', cells: [<W w={749}><ConvertWidget wallets={wallets} from="usdt" to="usdc" amount="9,240" fiat="9,240.00 USD" receive="9,166.08" rate="1 USDT = 0.992 USDC" /></W>] }] }],
};

// ---- ai-assistant ------------------------------------------------------------------------------------------
function AiDemo({ name }: { name: string }) {
  const [last, setLast] = useState('');
  return <div style={{ display: 'grid', gap: 8 }}><AiAssistant name={name} onSend={setLast} /><p role="status" style={{ margin: 0, minHeight: 16, width: 366, font: '12px system-ui', color: '#6e6e73' }}>{last ? `onSend fired with “${last}”. No assistant is connected: this is a local mock.` : ''}</p></div>;
}
export const aiAssistantExample: ComponentExample = {
  slug: 'ai-assistant', defaults: { name: 'Emily' }, controls: [txt('name')], surfaces: CANVAS,
  hint: 'Click a suggestion to put it in the composer, type to see the counter, press Send or Enter.',
  render: (a) => <AiDemo name={String(a.name)} />,
  code: (a) => `<AiAssistant name="${a.name}" onSend={(message) => ask(message)} />`,
  matrix: () => [{ title: 'single component', surface: 'surface/canvas', columns: [''], rows: [{ label: '', cells: [<AiAssistant />] }] }],
};

// ---- modals ------------------------------------------------------------------------------------------------
const accountDetails = { title: 'Personal account details', subtitle: 'Lorem ipsum.', amount: '€2 000 000.00', iban: 'DE89 3704 0044 0532 0130 00', details: [{ label: 'Owner', value: 'Lorem ipsum' }, { label: 'Currency', value: 'EUR' }, { label: 'Status', value: 'Active' }], secondaryLabel: 'Close Personal account?' };
export const accountDetailsModalExample: ComponentExample = {
  slug: 'account-details-modal', defaults: { title: accountDetails.title, subtitle: accountDetails.subtitle, amount: accountDetails.amount, ibanLabel: 'IBAN number' },
  controls: [txt('title'), txt('subtitle'), txt('amount'), txt('ibanLabel')], surfaces: CANVAS, hint: 'Click the IBAN field to copy it. To see the modal over a scrim with focus handling, open the ModalOverlay page.',
  render: (a) => <AccountDetailsModal {...accountDetails} title={String(a.title)} subtitle={String(a.subtitle)} amount={String(a.amount)} ibanLabel={String(a.ibanLabel)} />,
  code: (a) => `<ModalOverlay open={open} onClose={close} labelledBy="account-title">\n  <AccountDetailsModal titleId="account-title" title="${a.title}" subtitle="${a.subtitle}" amount="${a.amount}"\n    ibanLabel="${a.ibanLabel}" iban={account.iban} details={details} secondaryLabel="Close Personal account?" onClose={close} />\n</ModalOverlay>`,
  matrix: () => [{ title: 'single component', surface: 'surface/canvas', columns: [''], rows: [{ label: '', cells: [<AccountDetailsModal {...accountDetails} />] }] }],
};

const confirmProps = (type: MoneyMovement, state: 'active' | 'expired') => { const c = confirmContent[type]; const expired = type === 'conversion' && state === 'expired'; return { type, state, title: c.title, subtitle: expired ? c.expiredSubtitle! : c.subtitle, amount: c.amount, details: c.details, badge: type === 'conversion' ? (expired ? 'Rate expired' : 'Rate valid for 04:47') : undefined }; };
export const confirmPaymentModalExample: ComponentExample = {
  slug: 'confirm-payment-modal', defaults: { type: 'conversion', state: 'active' },
  controls: [sel('type', types), sel('state', ['active', 'expired'], { when: (a) => a.type === 'conversion', note: 'expired is drawn for conversion only.' })], surfaces: CANVAS,
  hint: 'Static here. The ModalOverlay page runs it as a flow with a live countdown.',
  render: (a) => <ConfirmPaymentModal {...confirmProps(a.type as MoneyMovement, a.state as 'active' | 'expired')} />,
  code: (a) => { const p = confirmProps(a.type as MoneyMovement, a.state as 'active' | 'expired'); return `<ConfirmPaymentModal type="${p.type}"${a.type === 'conversion' ? ` state="${p.state}" badge="${p.badge}"` : ''}\n  title="${p.title}" subtitle="${p.subtitle}"\n  amount="${p.amount}" details={details} onConfirm={confirm} onCancel={close} />`; },
  matrix: () => [{ title: 'type × state (shown at 70%)', surface: 'surface/canvas', columns: ['active', 'expired'], zoom: 0.7, rows: types.map((t) => ({ label: t, cells: [<ConfirmPaymentModal {...confirmProps(t, 'active')} />, t === 'conversion' ? <ConfirmPaymentModal {...confirmProps(t, 'expired')} /> : <span style={{ font: '14px system-ui', color: '#6e6e73' }}>Not drawn in Figma</span>] })) }],
};

const states = ['processing', 'success', 'failed'] as const;
export const convertModalExample: ComponentExample = {
  slug: 'convert-modal', defaults: { type: 'conversion', state: 'processing' }, controls: [sel('type', types), sel('state', states)], surfaces: CANVAS,
  hint: 'The spinner rotates here (proposed). The ModalOverlay page shows the modal as part of a flow.',
  render: (a) => <ConvertModal type={a.type as MoneyMovement} state={a.state as 'processing'} {...resultContent[a.type as MoneyMovement][a.state as 'processing']} />,
  code: (a) => { const c = resultContent[a.type as MoneyMovement][a.state as 'processing']; return `<ConvertModal type="${a.type}" state="${a.state}" title="${c.title}"${c.subtitle ? `\n  subtitle="${c.subtitle}"` : ''}${c.details ? '\n  details={details}' : ''}${a.state === 'success' ? ' onDone={close}' : a.state === 'failed' ? ' onRetry={retry} onCancel={close}' : ''} />`; },
  matrix: () => [{ title: 'type × state (shown at 60%)', surface: 'surface/canvas', columns: [...states], zoom: 0.6, rows: types.map((t) => ({ label: t, cells: states.map((s) => <ConvertModal type={t} state={s} {...resultContent[t][s]} />) })) }],
};

/** The documented flow: confirm → processing → result. Timers and outcomes are local mocks. */
function OverlayFlow({ type, outcome, seconds }: { type: MoneyMovement; outcome: 'success' | 'failed'; seconds: number }) {
  const [step, setStep] = useState<'closed' | 'confirm' | 'processing' | 'result' | 'account'>('closed');
  const [left, setLeft] = useState(seconds);
  useEffect(() => { if (step !== 'confirm' || type !== 'conversion' || left <= 0) return; const t = setTimeout(() => setLeft((n) => n - 1), 1000); return () => clearTimeout(t); }, [step, left, type]);
  useEffect(() => { if (step !== 'processing') return; const t = setTimeout(() => setStep('result'), 1800); return () => clearTimeout(t); }, [step]);
  const close = () => setStep('closed');
  const expired = type === 'conversion' && left <= 0;
  const c = confirmContent[type];
  const mmss = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button appearance="primary" onClick={() => { setLeft(seconds); setStep('confirm'); }}>Open confirmation</Button>
      <Button appearance="secondary" onClick={() => setStep('account')}>Open account details</Button>
      <ModalOverlay open={step !== 'closed'} onClose={step === 'processing' ? undefined : close} labelledBy="overlay-title">
        {step === 'confirm' && <ConfirmPaymentModal titleId="overlay-title" type={type} state={expired ? 'expired' : 'active'} title={c.title} subtitle={expired ? c.expiredSubtitle! : c.subtitle} amount={c.amount} details={c.details} badge={type === 'conversion' ? (expired ? 'Rate expired' : `Rate valid for ${mmss}`) : undefined} onCancel={close} onConfirm={() => (expired ? setLeft(seconds) : setStep('processing'))} />}
        {step === 'processing' && <ConvertModal titleId="overlay-title" type={type} state="processing" {...resultContent[type].processing} />}
        {step === 'result' && <ConvertModal titleId="overlay-title" type={type} state={outcome} {...resultContent[type][outcome]} onDone={close} onCancel={close} onRetry={() => setStep('processing')} />}
        {step === 'account' && <AccountDetailsModal titleId="overlay-title" {...accountDetails} onClose={close} onPrimary={close} onSecondary={close} />}
      </ModalOverlay>
    </div>
  );
}
export const modalOverlayExample: ComponentExample = {
  slug: 'modal-overlay', defaults: { type: 'conversion', outcome: 'success', seconds: '10' },
  controls: [sel('type', types, { label: 'modal: type' }), sel('outcome', ['success', 'failed'], { label: 'mock outcome' }), txt('seconds', { label: 'rate valid for (s)', when: (a) => a.type === 'conversion', note: 'Short on purpose, so the expired state can be seen.' })],
  surfaces: CANVAS,
  hint: 'Open a modal: focus moves into it and is trapped; Escape or a click on the scrim closes it and focus returns. The overlay stays inside this preview frame.',
  render: (a) => <div style={{ minHeight: 640, display: 'flex', alignItems: 'flex-start', paddingTop: 24 }}><OverlayFlow type={a.type as MoneyMovement} outcome={a.outcome as 'success' | 'failed'} seconds={Math.max(3, Number(a.seconds) || 10)} /></div>,
  code: () => `<ModalOverlay open={open} onClose={close} labelledBy="confirm-title">\n  <ConfirmPaymentModal titleId="confirm-title" type="conversion" state="active" … onConfirm={confirm} onCancel={close} />\n</ModalOverlay>`,
  matrix: () => [{ title: 'scrim with one centred modal (static, shown at 45%)', surface: 'surface/raised', columns: [''], zoom: 0.45, rows: [{ label: '', cells: [
    <div style={{ width: 1920, height: 1080, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-scrim)' }}><ConfirmPaymentModal {...confirmProps('conversion', 'active')} /></div>] }] }],
};

// ---- dashboard-layout --------------------------------------------------------------------------------------
function Dashboard({ filled }: { filled: boolean }) {
  const [selected, setSelected] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const [pair, setPair] = useState({ from: 'usdt', to: 'usdc' });
  const sidebar = <Sidebar selected={selected} onSelect={setSelected} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />;
  if (!filled) return <DashboardLayout sidebar={sidebar} />;
  const row = { display: 'flex', gap: 16, alignItems: 'stretch' } as const;
  return (
    <DashboardLayout sidebar={sidebar} header={<PageHeader title="Welcome, Emily Gibson!" />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={row}><MetricCard title="Team members" value="128" delta={{ value: '+18%', trend: 'up' }} /><MetricCard title="API Calls Today" value="24,310" icon="arrow-left-right" /><MetricCard title="Success rate API" value="99.2%" icon="check" /><MetricCard title="Volume Today" value="84,120 EUR" icon="euro" delta={{ value: '+12%', trend: 'up', appearance: 'warning' }} /></div>
        <SectionHeader title="Accounts" />
        <div style={row}><AccountCard appearance="iban" {...cards.iban} /><AccountCard appearance="wallet" {...cards.wallet} /><ConvertWidget wallets={wallets} external={external} from={pair.from} to={pair.to} onChange={setPair} amount="9,240" fiat="9,240.00 USD" receive="9,166.08" rate="1 USDT = 0.992 USDC" /></div>
        <div style={row}><TransactionsPanel rows={transactions} page={1} pages={20} /><AiAssistant /></div>
      </div>
    </DashboardLayout>
  );
}
export const dashboardLayoutExample: ComponentExample = {
  slug: 'dashboard-layout', defaults: { content: 'empty slots' },
  controls: [sel('content', ['empty slots', 'dashboard example'], { note: 'The example fills the slots following the usage notes of each component. Spacing between its blocks is not specified in the component docs.' })],
  surfaces: ['surface/canvas'], naturalWidth: 1920, hint: 'The sidebar is live: select an item or collapse it.',
  render: (a) => <Dashboard filled={a.content === 'dashboard example'} />,
  code: (a) => (a.content === 'empty slots' ? `<DashboardLayout sidebar={<Sidebar selected="home" />} />` : `<DashboardLayout sidebar={<Sidebar selected="home" />} header={<PageHeader title="Welcome, Emily Gibson!" />}>\n  {/* metric cards, SectionHeader, account cards + ConvertWidget, TransactionsPanel + AiAssistant */}\n</DashboardLayout>`),
  matrix: () => [
    { title: 'template with empty slots, 1920 × 1080 (shown at 45%)', surface: 'surface/raised', columns: [''], zoom: 0.45, rows: [{ label: '', cells: [<W w={1920}><DashboardLayout sidebar={<Sidebar />} /></W>] }] },
    { title: 'contextual example: dashboard assembled from the components (shown at 45%)', surface: 'surface/raised', columns: [''], zoom: 0.45, rows: [{ label: '', cells: [<W w={1920}><Dashboard filled /></W>] }] },
  ],
};
