import { Button, type ButtonAppearance, type ButtonForcedState, type ButtonLayout, type ButtonSize, type IconName } from '../ds';
import type { ComponentExample, MatrixGroup } from './types';

const appearances: ButtonAppearance[] = ['primary', 'secondary', 'tonal', 'inverse'];
const states = ['default', 'hover', 'pressed', 'focus-visible', 'disabled', 'loading'] as const;
const icons: IconName[] = ['plus', 'user-round-plus', 'credit-card', 'list-filter'];

const cell = (appearance: ButtonAppearance, state: (typeof states)[number], size: ButtonSize, layout: ButtonLayout) => (
  <Button
    appearance={appearance} size={size} layout={layout} leadingIcon="plus" tabIndex={-1}
    aria-label={layout === 'icon-only' ? 'Button' : undefined}
    disabled={state === 'disabled'} loading={state === 'loading'}
    forceState={(['hover', 'pressed', 'focus-visible'] as string[]).includes(state) ? (state as ButtonForcedState) : undefined}
  >Button</Button>
);

const group = (title: string, size: ButtonSize, layout: ButtonLayout, dark: boolean): MatrixGroup => ({
  title, surface: dark ? 'surface/sidebar' : 'surface/raised', columns: [...states],
  rows: appearances.filter((a) => (a === 'inverse') === dark).map((a) => ({ label: a, cells: states.map((s) => cell(a, s, size, layout)) })),
});

export const buttonExample: ComponentExample = {
  slug: 'button',
  defaults: { appearance: 'primary', size: 'md', layout: 'default', showIcon: true, icon: 'plus', label: 'Button', disabled: false, loading: false },
  controls: [
    { name: 'appearance', label: 'appearance', type: 'select', options: appearances },
    { name: 'size', label: 'size', type: 'select', options: ['md', 'sm'] },
    { name: 'layout', label: 'layout', type: 'select', options: ['default', 'icon-only'] },
    { name: 'label', label: 'label', type: 'text', when: (a) => a.layout === 'default' },
    { name: 'showIcon', label: 'showIcon', type: 'boolean', when: (a) => a.layout === 'default' },
    { name: 'icon', label: 'icon', type: 'select', options: icons, when: (a) => a.layout === 'icon-only' || a.showIcon === true, note: 'Four of the 101 Figma glyphs are wired up in this sample.' },
    { name: 'disabled', label: 'state: disabled', type: 'boolean' },
    { name: 'loading', label: 'state: loading', type: 'boolean' },
  ],
  surfaces: ['surface/raised', 'surface/canvas', 'surface/sidebar'],
  surfaceFor: (a) => (a.appearance === 'inverse' ? 'surface/sidebar' : undefined),
  render: (a) => (
    <Button
      appearance={a.appearance as ButtonAppearance} size={a.size as ButtonSize} layout={a.layout as ButtonLayout}
      leadingIcon={a.layout === 'icon-only' || a.showIcon ? (a.icon as IconName) : undefined}
      disabled={a.disabled === true} loading={a.loading === true}
      aria-label={a.layout === 'icon-only' ? String(a.label) : undefined}
    >{String(a.label)}</Button>
  ),
  code: (a) => {
    const p: string[] = [];
    if (a.appearance !== 'primary') p.push(`appearance="${a.appearance}"`);
    if (a.size !== 'md') p.push(`size="${a.size}"`);
    if (a.layout === 'icon-only') p.push('layout="icon-only"');
    if (a.layout === 'icon-only' || a.showIcon) p.push(`leadingIcon="${a.icon}"`);
    if (a.disabled) p.push('disabled');
    if (a.loading) p.push('loading');
    const attrs = p.length ? ' ' + p.join(' ') : '';
    return a.layout === 'icon-only'
      ? `<Button${attrs} aria-label="${a.label}" />`
      : `<Button${attrs}>${a.label}</Button>`;
  },
  matrix: () => [
    group('size md · layout default', 'md', 'default', false),
    group('size md · layout default · inverse', 'md', 'default', true),
    group('size sm · layout default', 'sm', 'default', false),
    group('size sm · layout default · inverse', 'sm', 'default', true),
    group('size md · layout icon-only', 'md', 'icon-only', false),
    group('size md · layout icon-only · inverse', 'md', 'icon-only', true),
    group('size sm · layout icon-only', 'sm', 'icon-only', false),
    group('size sm · layout icon-only · inverse', 'sm', 'icon-only', true),
  ],
};
