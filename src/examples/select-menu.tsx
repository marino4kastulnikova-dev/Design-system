import { SelectMenu, SelectOption, selectMenuOptions } from '../ds';
import { sel, type ComponentExample } from './types';

type Kind = keyof typeof selectMenuOptions;
const current = (kind: Kind, value: unknown) => ((selectMenuOptions[kind] as readonly string[]).includes(String(value)) ? String(value) : selectMenuOptions[kind][0]);

export const selectMenuExample: ComponentExample = {
  slug: 'select-menu',
  defaults: { kind: 'status', value: 'All Statuses' },
  controls: [sel('kind', ['status', 'kyc']), sel('value', [...selectMenuOptions.status, ...selectMenuOptions.kyc.filter((o) => o !== 'Pending')], { label: 'selected option', note: 'Click an option in the preview, or use the arrow keys and Enter.' })],
  surfaces: ['surface/canvas', 'surface/raised'],
  hint: 'Click an option to select it. Arrow keys, Home and End move focus; Enter or Space selects.',
  render: (a, set) => <SelectMenu kind={a.kind as Kind} value={current(a.kind as Kind, a.value)} onChange={(value) => set({ value })} aria-label={a.kind === 'kyc' ? 'KYC status' : 'Status'} />,
  code: (a) => `const [value, setValue] = useState('${current(a.kind as Kind, a.value)}');\n\n<SelectMenu kind="${a.kind}" value={value} onChange={setValue} aria-label="${a.kind === 'kyc' ? 'KYC status' : 'Status'}" />`,
  matrix: () => [
    { title: 'SelectOption · state', surface: 'surface/raised', columns: ['default', 'hover', 'selected'], rows: [{ label: 'SelectOption', cells: [
      <div style={{ width: 180 }}><SelectOption label="All Statuses" /></div>,
      <div style={{ width: 180 }}><SelectOption label="All Statuses" forceState="hover" /></div>,
      <div style={{ width: 180 }}><SelectOption label="All Statuses" selected /></div>] }] },
    { title: 'SelectMenu · kind', surface: 'surface/canvas', columns: ['status', 'kyc'], rows: [{ label: 'SelectMenu', cells: [
      <SelectMenu kind="status" value="All Statuses" aria-label="Status" />, <SelectMenu kind="kyc" value="All KYC" aria-label="KYC status" />] }] },
  ],
};
