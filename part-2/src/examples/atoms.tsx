// Examples for the small components. One export per Figma page.
import {
  Avatar, Chip, CountBadge, DetailRow, Divider, IconButton, IconTile, Input, LiveIndicator, MessageBanner, NavigationItem, ProgressBar,
  SectionHeader, Spinner, StatusBadge, ThemeToggle, Tooltip, WithTooltip, iconNames,
  type IconButtonAppearance, type IconName, type IconTileAppearance, type StatusBadgeAppearance, type StatusBadgeSize, type Theme,
} from '../ds';
import { attrs, bool, DARK, GLASS, LIGHT, sel, txt, type ComponentExample } from './types';

const forced = (s: string) => ((['hover', 'pressed', 'focus-visible'] as string[]).includes(s) ? (s as 'hover' | 'pressed' | 'focus-visible') : undefined);

export const dividerExample: ComponentExample = {
  slug: 'divider', defaults: { appearance: 'default' }, controls: [sel('appearance', ['default', 'inverse'])], surfaces: LIGHT,
  surfaceFor: (a) => (a.appearance === 'inverse' ? 'surface/sidebar' : undefined),
  render: (a) => <div style={{ width: 200 }}><Divider appearance={a.appearance as 'default' | 'inverse'} /></div>,
  code: (a) => `<Divider${attrs([['appearance', a.appearance as string, 'default']])} />`,
  matrix: () => [
    { title: 'appearance', surface: 'surface/raised', columns: ['default'], rows: [{ label: 'Divider', cells: [<div style={{ width: 200 }}><Divider /></div>] }] },
    { title: 'appearance · dark surface', surface: 'surface/sidebar', columns: ['inverse'], rows: [{ label: 'Divider', cells: [<div style={{ width: 200 }}><Divider appearance="inverse" /></div>] }] },
  ],
};

export const avatarExample: ComponentExample = {
  slug: 'avatar', defaults: { initials: 'EG' }, controls: [txt('initials', { note: '1–2 letters.' })], surfaces: DARK,
  render: (a) => <Avatar initials={String(a.initials)} />,
  code: (a) => `<Avatar initials="${a.initials}" />`,
  matrix: () => [{ title: 'content', surface: 'surface/sidebar', columns: ['two letters', 'one letter', 'three letters'], rows: [{ label: 'Avatar', cells: [<Avatar initials="EG" />, <Avatar initials="E" />, <Avatar initials="EGB" />] }] }],
};

const badgeAppearances: StatusBadgeAppearance[] = ['positive', 'warning', 'danger', 'info', 'neutral', 'accent', 'awaiting', 'processing'];
const badgeSizes: StatusBadgeSize[] = ['sm', 'md', 'lg'];
export const badgeExample: ComponentExample = {
  slug: 'badge', defaults: { appearance: 'positive', size: 'md', label: 'Status', showIcon: false, icon: 'trending-up' },
  controls: [sel('appearance', badgeAppearances), sel('size', badgeSizes), txt('label'), bool('showIcon'), sel('icon', iconNames, { when: (a) => a.showIcon === true })],
  surfaces: LIGHT,
  render: (a) => <StatusBadge appearance={a.appearance as StatusBadgeAppearance} size={a.size as StatusBadgeSize} icon={a.showIcon ? (a.icon as IconName) : undefined}>{String(a.label)}</StatusBadge>,
  code: (a) => `<StatusBadge${attrs([['appearance', a.appearance as string, 'positive'], ['size', a.size as string, 'md'], ['icon', a.showIcon ? (a.icon as string) : undefined]])}>${a.label}</StatusBadge>`,
  matrix: () => [
    { title: 'appearance × size', surface: 'surface/raised', columns: badgeSizes, rows: badgeAppearances.map((ap) => ({ label: ap, cells: badgeSizes.map((s) => <StatusBadge appearance={ap} size={s}>Status</StatusBadge>) })) },
    { title: 'showIcon = true (default glyph trending-up; danger uses trending-down)', surface: 'surface/raised', columns: badgeSizes, rows: badgeAppearances.map((ap) => ({ label: ap, cells: badgeSizes.map((s) => <StatusBadge appearance={ap} size={s} icon={ap === 'danger' ? 'trending-down' : 'trending-up'}>Status</StatusBadge>) })) },
  ],
};

export const countBadgeExample: ComponentExample = {
  slug: 'count-badge', defaults: { count: '3' }, controls: [txt('count')], surfaces: LIGHT,
  render: (a) => <CountBadge count={String(a.count)} />,
  code: (a) => `<CountBadge count={${Number(a.count) || 0}} />`,
  matrix: () => [{ title: 'content', surface: 'surface/raised', columns: ['1 digit', '2 digits', '3 digits'], rows: [{ label: 'CountBadge', cells: [<CountBadge count={3} />, <CountBadge count={12} />, <CountBadge count={128} />] }] }],
};

const tileAppearances: IconTileAppearance[] = ['neutral', 'positive', 'danger'];
export const iconTileExample: ComponentExample = {
  slug: 'icon-tile', defaults: { appearance: 'neutral', size: 'md', icon: 'users' },
  controls: [sel('appearance', tileAppearances), sel('size', ['md', 'lg']), sel('icon', iconNames)], surfaces: LIGHT,
  render: (a) => <IconTile appearance={a.appearance as IconTileAppearance} size={a.size as 'md' | 'lg'} icon={a.icon as IconName} />,
  code: (a) => `<IconTile${attrs([['appearance', a.appearance as string, 'neutral'], ['size', a.size as string, 'md'], ['icon', a.icon as string]])} />`,
  matrix: () => [{ title: 'appearance × size', surface: 'surface/raised', columns: ['md', 'lg'], rows: tileAppearances.map((ap) => ({ label: ap, cells: [<IconTile appearance={ap} size="md" />, <IconTile appearance={ap} size="lg" />] })) }],
};

export const spinnerExample: ComponentExample = {
  slug: 'spinner', defaults: { size: 'lg', animated: false },
  controls: [sel('size', ['lg', 'md']), bool('animated', { label: 'animated (Proposed)', note: 'Motion is not designed in Figma. Off shows the arc exactly as drawn.' })], surfaces: LIGHT,
  render: (a) => <Spinner size={a.size as 'lg' | 'md'} animated={a.animated === true} label="Processing" />,
  code: (a) => `<Spinner${attrs([['size', a.size as string, 'lg'], ['animated', a.animated === true]])} label="Processing" />`,
  matrix: () => [{ title: 'size', surface: 'surface/raised', columns: ['lg', 'md'], rows: [{ label: 'Spinner', cells: [<Spinner size="lg" />, <Spinner size="md" />] }] }],
};

export const progressBarExample: ComponentExample = {
  slug: 'progress-bar', defaults: { value: '44' }, controls: [txt('value', { label: 'value (0–100)' })], surfaces: DARK,
  render: (a) => <div style={{ width: 326 }}><ProgressBar value={Number(a.value) || 0} aria-label="Transfer limit used" /></div>,
  code: (a) => `<ProgressBar value={${Number(a.value) || 0}} aria-label="Transfer limit used" />`,
  matrix: () => [{ title: 'value', surface: 'surface/sidebar', columns: ['44% (IBAN: 145 of 326)', '35% (Wallet-1: 113 of 326)'], rows: [{ label: 'ProgressBar', cells: [<div style={{ width: 326 }}><ProgressBar value={(145 / 326) * 100} aria-label="44%" /></div>, <div style={{ width: 326 }}><ProgressBar value={(113 / 326) * 100} aria-label="35%" /></div>] }] }],
};

export const tooltipExample: ComponentExample = {
  slug: 'tooltip', defaults: { label: 'Tooltip text', side: 'top' }, controls: [txt('label'), sel('side', ['top', 'bottom', 'right'], { label: 'side (preview)' })], surfaces: LIGHT,
  hint: 'Hover the button or focus it with Tab. Escape hides the tooltip.',
  render: (a) => <WithTooltip label={String(a.label)} side={a.side as 'top' | 'bottom' | 'right'}><IconButton appearance="soft" icon="arrow-down-up" aria-label="Swap wallets" /></WithTooltip>,
  code: (a) => `<WithTooltip label="${a.label}"${attrs([['side', a.side as string, 'top']])}>\n  <IconButton appearance="soft" icon="arrow-down-up" aria-label="Swap wallets" />\n</WithTooltip>`,
  matrix: () => [{ title: 'content', surface: 'surface/canvas', columns: ['default', 'short', 'long'], rows: [{ label: 'Tooltip', cells: [<Tooltip label="Tooltip text" />, <Tooltip label="Swap" />, <Tooltip label="Swap the From and To wallets" />] }] }],
};

const ibAppearances: IconButtonAppearance[] = ['ghost', 'tonal', 'glass', 'soft'];
const ibStates = ['default', 'hover', 'pressed', 'focus-visible', 'disabled'];
export const iconButtonExample: ComponentExample = {
  slug: 'icon-button', defaults: { appearance: 'ghost', icon: 'chevron-right', disabled: false, label: 'Next page' },
  controls: [sel('appearance', ibAppearances), sel('icon', iconNames), txt('label', { label: 'aria-label' }), bool('disabled', { label: 'state: disabled' })],
  surfaces: LIGHT, surfaceFor: (a) => (a.appearance === 'glass' ? 'surface/canvas' : undefined),
  render: (a) => <IconButton appearance={a.appearance as IconButtonAppearance} icon={a.icon as IconName} disabled={a.disabled === true} aria-label={String(a.label)} />,
  code: (a) => `<IconButton${attrs([['appearance', a.appearance as string, 'ghost'], ['icon', a.icon as string], ['disabled', a.disabled === true]])} aria-label="${a.label}" />`,
  matrix: () => [
    { title: 'appearance × state', surface: 'surface/raised', columns: ibStates, rows: (['ghost', 'tonal', 'soft'] as IconButtonAppearance[]).map((ap) => ({ label: ap, cells: ibStates.map((s) => <IconButton appearance={ap} forceState={forced(s)} disabled={s === 'disabled'} tabIndex={-1} aria-label={ap} />) })) },
    { title: 'glass · on a coloured surface', surface: 'surface/canvas', columns: ibStates, rows: [{ label: 'glass', cells: ibStates.map((s) => <IconButton appearance="glass" forceState={forced(s)} disabled={s === 'disabled'} tabIndex={-1} aria-label="glass" />) }] },
  ],
};

const chipStates = ['default', 'hover', 'pressed', 'focus-visible', 'disabled'];
const chipRow = (size: 'md' | 'sm', iconOnly: boolean, icon?: IconName) => chipStates.map((s) => <Chip size={size} iconOnly={iconOnly} icon={icon} forceState={forced(s)} disabled={s === 'disabled'} tabIndex={-1} aria-label={iconOnly ? 'Voice input' : undefined}>Chip</Chip>);
export const chipExample: ComponentExample = {
  slug: 'chip', defaults: { size: 'md', layout: 'default', label: 'Chip', showIcon: false, icon: 'paperclip', disabled: false },
  controls: [sel('size', ['md', 'sm']), sel('layout', ['default', 'icon-only']), txt('label', { when: (a) => a.layout === 'default' }), bool('showIcon', { when: (a) => a.layout === 'default' }),
    sel('icon', iconNames, { when: (a) => a.layout === 'icon-only' || a.showIcon === true }), bool('disabled', { label: 'state: disabled' })],
  surfaces: GLASS,
  render: (a) => <Chip size={a.size as 'md' | 'sm'} iconOnly={a.layout === 'icon-only'} icon={a.layout === 'icon-only' || a.showIcon ? (a.icon as IconName) : undefined} disabled={a.disabled === true} aria-label={a.layout === 'icon-only' ? 'Voice input' : undefined}>{String(a.label)}</Chip>,
  code: (a) => { const p = attrs([['size', a.size as string, 'md'], ['iconOnly', a.layout === 'icon-only'], ['icon', a.layout === 'icon-only' || a.showIcon ? (a.icon as string) : undefined], ['disabled', a.disabled === true]]); return a.layout === 'icon-only' ? `<Chip${p} aria-label="Voice input" />` : `<Chip${p}>${a.label}</Chip>`; },
  matrix: () => [{ title: 'size · layout × state', surface: 'surface/canvas', columns: chipStates, rows: [
    { label: 'md · default', cells: chipRow('md', false) }, { label: 'md · icon-only', cells: chipRow('md', true) },
    { label: 'sm · default', cells: chipRow('sm', false) }, { label: 'sm · with icon', cells: chipRow('sm', false, 'paperclip') }, { label: 'sm · icon-only', cells: chipRow('sm', true) }] }],
};

const inputStates = ['default', 'hover', 'focus', 'error', 'disabled'];
const inputCell = (value: string, s: string) => <Input value={value} placeholder="Value" readOnly={s === 'read-only'} onChange={() => {}} trailingIcon={s === 'read-only' ? 'copy' : 'chevron-down'} error={s === 'error'} disabled={s === 'disabled'} forceState={s === 'hover' || s === 'focus' ? s : undefined} tabIndex={-1} aria-label={s} />;
export const inputExample: ComponentExample = {
  slug: 'input', defaults: { value: '', placeholder: 'Search', leadingIcon: 'search', trailingIcon: 'none', error: false, disabled: false, readOnly: false },
  controls: [txt('value', { note: 'Type in the preview: the control follows.' }), txt('placeholder'), sel('leadingIcon', ['none', 'search']), sel('trailingIcon', ['none', 'chevron-down', 'copy', 'eye-closed']),
    bool('error', { label: 'state: error' }), bool('disabled', { label: 'state: disabled' }), bool('readOnly', { label: 'state: read-only' })],
  surfaces: GLASS,
  render: (a, set) => <Input value={String(a.value)} placeholder={String(a.placeholder)} onChange={(e) => set({ value: e.target.value })} leadingIcon={a.leadingIcon === 'none' ? undefined : (a.leadingIcon as IconName)} trailingIcon={a.trailingIcon === 'none' ? undefined : (a.trailingIcon as IconName)} error={a.error === true} disabled={a.disabled === true} readOnly={a.readOnly === true} aria-label="Search users" />,
  code: (a) => `<Input value={value} onChange={(e) => setValue(e.target.value)}${attrs([['placeholder', a.placeholder as string], ['leadingIcon', a.leadingIcon as string, 'none'], ['trailingIcon', a.trailingIcon as string, 'none'], ['error', a.error === true], ['disabled', a.disabled === true], ['readOnly', a.readOnly === true]])} aria-label="Search users" />`,
  matrix: () => [{ title: 'content × state', surface: 'surface/canvas', columns: [...inputStates, 'read-only'], rows: [
    { label: 'placeholder', cells: inputStates.map((s) => inputCell('', s)) }, { label: 'value', cells: [...inputStates, 'read-only'].map((s) => inputCell('Value', s)) }] }],
};

const navStates = ['default', 'hover', 'pressed', 'selected', 'focus-visible', 'disabled'];
export const navigationItemExample: ComponentExample = {
  slug: 'navigation-item', defaults: { label: 'Home', icon: 'house', selected: false, disabled: false },
  controls: [txt('label'), sel('icon', iconNames), bool('selected', { label: 'state: selected' }), bool('disabled', { label: 'state: disabled' })], surfaces: DARK,
  hint: 'Click the item to select it.',
  render: (a, set) => <div style={{ width: 247 }}><NavigationItem icon={a.icon as IconName} selected={a.selected === true} disabled={a.disabled === true} onClick={(e) => { e.preventDefault(); set({ selected: true }); }}>{String(a.label)}</NavigationItem></div>,
  code: (a) => `<NavigationItem href="/home"${attrs([['icon', a.icon as string], ['selected', a.selected === true], ['disabled', a.disabled === true]])}>${a.label}</NavigationItem>`,
  matrix: () => [{ title: 'state', surface: 'surface/sidebar', columns: ['default', 'hover', 'pressed'], rows: [
    { label: '', cells: navStates.slice(0, 3).map((s) => <div style={{ width: 247 }}><NavigationItem forceState={forced(s)}>Home</NavigationItem></div>) }] },
  { title: 'state', surface: 'surface/sidebar', columns: ['selected', 'focus-visible', 'disabled'], rows: [
    { label: '', cells: navStates.slice(3).map((s) => <div style={{ width: 247 }}><NavigationItem selected={s === 'selected'} disabled={s === 'disabled'} forceState={forced(s)}>Home</NavigationItem></div>) }] }],
};

export const liveIndicatorExample: ComponentExample = {
  slug: 'live-indicator', defaults: { label: 'Live · Updated 2 min ago' }, controls: [txt('label')], surfaces: LIGHT,
  render: (a) => <LiveIndicator label={String(a.label)} />,
  code: (a) => `<LiveIndicator label="${a.label}" />`,
  matrix: () => [{ title: 'single component', surface: 'surface/raised', columns: ['default'], rows: [{ label: 'LiveIndicator', cells: [<LiveIndicator />] }] }],
};

export const messageBannerExample: ComponentExample = {
  slug: 'message-banner', defaults: { message: 'Message' }, controls: [txt('message')], surfaces: LIGHT,
  render: (a) => <MessageBanner message={String(a.message)} />,
  code: (a) => `<MessageBanner message="${a.message}" />`,
  matrix: () => [{ title: 'content', surface: 'surface/raised', columns: ['default', 'as used in the Confirm payment modal'], rows: [{ label: 'MessageBanner', cells: [<MessageBanner message="Message" />, <MessageBanner message="You’re verified through your team’s account." />] }] }],
};

export const detailRowExample: ComponentExample = {
  slug: 'detail-row', defaults: { label: 'Label', value: 'Value' }, controls: [txt('label'), txt('value')], surfaces: LIGHT,
  render: (a) => <dl style={{ width: 316, margin: 0 }}><DetailRow label={String(a.label)} value={String(a.value)} /></dl>,
  code: (a) => `<dl>\n  <DetailRow label="${a.label}" value="${a.value}" />\n</dl>`,
  matrix: () => [{ title: 'content (synthetic sample data)', surface: 'surface/raised', columns: ['default', 'in a list'], rows: [{ label: 'DetailRow', cells: [
    <dl style={{ width: 316, margin: 0 }}><DetailRow label="Label" value="Value" /></dl>,
    <dl style={{ width: 316, margin: 0, display: 'grid', gap: 12 }}><DetailRow label="Merchant" value="Sample Store" /><DetailRow label="Card" value="•••• 0000" /><DetailRow label="Fees" value="0.00 EUR" /></dl>] }] }],
};

export const themeToggleExample: ComponentExample = {
  slug: 'theme-toggle', defaults: { theme: 'light' }, controls: [sel('theme', ['light', 'dark'], { note: 'Only light is drawn in Figma. The dark position is proposed.' })], surfaces: LIGHT,
  hint: 'Click a segment. The control changes only itself: the system has no dark theme.',
  render: (a, set) => <ThemeToggle theme={a.theme as Theme} onChange={(theme) => set({ theme })} />,
  code: () => `const [theme, setTheme] = useState<Theme>('light');\n\n<ThemeToggle theme={theme} onChange={setTheme} />`,
  matrix: () => [{ title: 'theme', surface: 'surface/raised', columns: ['light (as drawn in Figma)', 'dark (Proposed — needs review)'], rows: [{ label: 'ThemeToggle', cells: [<ThemeToggle theme="light" />, <ThemeToggle theme="dark" />] }] }],
};

export const sectionHeaderExample: ComponentExample = {
  slug: 'section-header', defaults: { title: 'Accounts' }, controls: [txt('title')], surfaces: LIGHT,
  render: (a) => <div style={{ width: '100%', minWidth: 420, maxWidth: 760 }}><SectionHeader title={String(a.title)} /></div>,
  code: (a) => `<SectionHeader\n  title="${a.title}"\n  actions={<>\n    <Button appearance="secondary" leadingIcon="user-round-plus">Add user</Button>\n    <Button leadingIcon="plus">Issue card</Button>\n  </>}\n/>`,
  matrix: () => [{ title: 'single component', surface: 'surface/raised', columns: ['default'], rows: [{ label: '', cells: [<div style={{ width: 640 }}><SectionHeader title="Accounts" /></div>] }] }],
};
