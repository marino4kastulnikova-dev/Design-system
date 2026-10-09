// Synthetic sample data for previews. Values follow the shape of the Figma sample content; merchant names, people,
// e-mail addresses, wallet addresses and hashes are invented and do not refer to real accounts.
import type { Detail, ExternalDestination, GridTransaction, IbanAccount, MoneyMovement, Transaction, User, Wallet } from '../ds';

export const wallets: Wallet[] = [
  { id: 'usdt', coin: 'USDT', title: 'USDT · TRC20', subtitle: 'Tether', amount: '10,860.00', group: 'Crypto', code: 'USDT', network: 'TRC20' },
  { id: 'usdc', coin: 'USDC', title: 'USDC · ETH-20', subtitle: 'USD Coin', amount: '3,420.00', group: 'Crypto', code: 'USDC', network: 'ETH-20' },
  { id: 'iban', coin: 'EUR', title: 'EUR — IBAN', subtitle: '•••• 1234', amount: '25,567.40', group: 'IBAN', code: 'EUR' },
  { id: 'wallet-1', coin: 'EUR', title: 'EUR — Wallet-1', subtitle: '2 cards', amount: '18,204.60', group: 'Wallets', code: 'EUR' },
];
export const external: ExternalDestination[] = [
  { id: 'ext-crypto', icon: 'wallet', title: 'Crypto wallet address', subtitle: 'Send to any external wallet' },
  { id: 'ext-iban', icon: 'credit-card', title: 'IBAN transfer', subtitle: 'Send to an external bank account' },
];

const done = { appearance: 'positive', label: 'Completed' } as const, pending = { appearance: 'warning', label: 'Pending' } as const;
export const transactions: Transaction[] = [
  { date: '07 Sep, 09:14', user: 'Anna K.', type: 'Purchase', merchant: 'Sample Electronics', card: '•••• 4021', amount: '-84.90 EUR', fee: '0.00 EUR', status: done },
  { date: '06 Sep, 22:41', user: 'Sara A.', type: 'Purchase', merchant: 'Sample Stays', card: '•••• 5563', amount: '-212.40 EUR', fee: '1.10 EUR', status: done },
  { date: '06 Sep, 11:20', user: 'Marek N.', type: 'Purchase', merchant: 'Sample Rides', card: '•••• 7788', amount: '-11.20 EUR', fee: '0.00 EUR', status: pending },
  { date: '05 Sep, 19:02', user: 'Tom B.', type: 'Purchase', merchant: 'Sample Coffee', card: '•••• 9042', amount: '-6.50 EUR', fee: '0.00 EUR', status: done },
  { date: '07 Sep, 11:02', user: 'Lukas B.', type: 'Convert', merchant: 'USDT → USDC', card: 'Wallet', amount: '-10,860.00 USDT', fee: '0.00 USDT', status: done },
];
export const moreTransactions: Transaction[] = [
  { date: '04 Sep, 16:30', user: 'Ines R.', type: 'Purchase', merchant: 'Sample Books', card: '•••• 3310', amount: '-23.00 EUR', fee: '0.00 EUR', status: done },
  { date: '04 Sep, 08:12', user: 'Anna K.', type: 'Top up', merchant: 'IBAN transfer', card: 'IBAN', amount: '+500.00 EUR', fee: '0.00 EUR', status: done },
  { date: '03 Sep, 21:47', user: 'Tom B.', type: 'Purchase', merchant: 'Sample Market', card: '•••• 9042', amount: '-48.15 EUR', fee: '0.00 EUR', status: pending },
];

export const gridRows: GridTransaction[] = [
  { id: '1', date: 'Sep 25, 14:44', counterparty: 'acc••••457', account: '•••• 5941', reference: 'af1c9…b90', method: 'Card', type: 'Payin', amount: '41.53 EUR', fee: '0.25 EUR', status: { appearance: 'processing', label: 'Processing' } },
  { id: '2', date: 'Sep 25, 13:02', counterparty: 'acc••••118', account: '•••• 2207', reference: 'c07e2…41d', method: 'Card', type: 'Payin', amount: '120.00 EUR', fee: '0.72 EUR', status: { appearance: 'positive', label: 'Completed' } },
  { id: '3', date: 'Sep 24, 18:20', counterparty: 'acc••••903', account: '•••• 7716', reference: '9b3d5…e02', method: 'IBAN', type: 'Payout', amount: '300.00 EUR', fee: '1.00 EUR', status: { appearance: 'awaiting', label: 'Awaiting' } },
];

export const users: User[] = [
  { name: 'Olena Kravchenko', role: 'Sub-user · active', email: 'olena.kravchenko@example.com', status: { appearance: 'positive', label: 'Active' }, kyc: { appearance: 'info', label: 'Inherited' }, accounts: '1', cards: '1', created: 'Sep 12, 2026' },
  { name: 'Marek Nowak', role: 'Sub-user · active', email: 'marek.nowak@example.com', status: { appearance: 'positive', label: 'Active' }, kyc: { appearance: 'info', label: 'Inherited' }, accounts: '2', cards: '3', created: 'Sep 10, 2026' },
];

export const ibanAccounts: IbanAccount[] = [
  { name: 'Personal', iban: 'AA743400000000000000', owner: 'Lorem ipsum', currency: 'EUR', balance: '€2.00', status: { appearance: 'positive', label: 'Active' } },
  { name: 'Payroll', iban: 'AA743400000000000001', owner: 'Lorem ipsum', currency: 'EUR', balance: '€17,704.60', status: { appearance: 'positive', label: 'Active' } },
];

const ADDRESS = 'TSampleAddressForPreviewOnly0000000', HASH = '0000sample…previewhash0000';
/** Text of the Figma ConfirmPaymentModal variants, per type. */
export const confirmContent: Record<MoneyMovement, { title: string; subtitle: string; expiredSubtitle?: string; amount: string; details: Detail[] }> = {
  conversion: { title: 'Confirm conversion', subtitle: 'Check the details before you confirm.', expiredSubtitle: 'Update the rate to see the new amount. No funds were moved.', amount: '9,240.00 USDT',
    details: [{ label: 'From', value: 'USDT · TRC20' }, { label: 'To', value: 'USDC · ETH-20' }, { label: 'Rate', value: '1 USDT = 0.992 USDC' }, { label: 'Fee', value: 'No fees' }, { label: 'You receive', value: '9,166.08 USDC' }] },
  transfer: { title: 'Confirm transfer', subtitle: 'Check the details before you confirm.', amount: '500.00 EUR',
    details: [{ label: 'From', value: 'Wallet-1' }, { label: 'To', value: 'Payroll' }, { label: 'Fee', value: 'No fees' }, { label: 'Wallet-1 balance after', value: '17,704.60 EUR' }] },
  withdrawal: { title: 'Confirm withdrawal', subtitle: "Check the address and network. This transfer can't be reversed.", amount: '9,240.00 USDT',
    details: [{ label: 'From', value: 'USDT · TRC20' }, { label: 'To', value: ADDRESS, field: true }, { label: 'Network', value: 'TRON (TRC20)' }, { label: 'Network fee', value: '1.00 USDT' }, { label: 'Recipient gets', value: '9,239.00 USDT' }] },
};
/** Text of the Figma ConvertModal variants, per type and state. */
export const resultContent: Record<MoneyMovement, Record<'processing' | 'success' | 'failed', { title: string; subtitle?: string; details?: Detail[] }>> = {
  conversion: {
    processing: { title: 'Processing your conversion…', subtitle: "This usually takes a few seconds. Please don't close this window." },
    success: { title: 'Converted 9,166.08 USDC', details: [{ label: 'Converted', value: '10,860.00 USDT → 9,166.08 USDC' }, { label: 'Rate', value: '1 USDT = 0.992 USDC' }, { label: 'Fees', value: 'No fees' }] },
    failed: { title: 'Conversion failed', subtitle: "This conversion couldn't be completed. Your balance hasn't changed — please try again." } },
  transfer: {
    processing: { title: 'Processing your transfer…', subtitle: "This usually takes a few seconds. Please don't close this window." },
    success: { title: 'Transferred 500.00 EUR', details: [{ label: 'From', value: 'Wallet-1' }, { label: 'To', value: 'Payroll' }, { label: 'Fee', value: 'No fees' }, { label: 'Wallet-1 balance', value: '17,704.60 EUR' }] },
    failed: { title: 'Transfer failed', subtitle: "This transfer couldn't be completed. Your balance hasn't changed — please try again." } },
  withdrawal: {
    processing: { title: 'Sending your withdrawal…', subtitle: "This usually takes a few seconds. Please don't close this window." },
    success: { title: 'Withdrawal sent', subtitle: 'It can take a few minutes to arrive, depending on the network.',
      details: [{ label: 'Recipient gets', value: '9,239.00 USDT' }, { label: 'To', value: ADDRESS, field: true }, { label: 'Network', value: 'TRON (TRC20)' }, { label: 'Network fee', value: '1.00 USDT' }, { label: 'Transaction hash', value: HASH, field: true, copy: true }] },
    failed: { title: 'Withdrawal failed', subtitle: "This withdrawal couldn't be sent. Your balance hasn't changed — please try again." } },
};
