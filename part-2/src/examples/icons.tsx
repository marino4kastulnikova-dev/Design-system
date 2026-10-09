import { Icon, iconNames, type IconColor, type IconName, type IconSize } from '../ds';
import { attrs, sel, type ComponentExample } from './types';

const sizes: IconSize[] = ['sm', 'md', 'lg'];
const light: IconColor[] = ['default', 'muted', 'strong', 'primary', 'accent', 'positive', 'warning', 'danger', 'info', 'success'];
const dark: IconColor[] = ['inverse', 'inverse-muted'];

export const iconsExample: ComponentExample = {
  slug: 'icons',
  defaults: { name: 'house', size: 'sm', color: 'default' },
  controls: [sel('name', iconNames, { label: 'icon' }), sel('size', sizes), sel('color', [...light, ...dark])],
  surfaces: ['surface/raised', 'surface/canvas', 'surface/sidebar'],
  surfaceFor: (a) => (String(a.color).startsWith('inverse') ? 'surface/sidebar' : undefined),
  render: (a) => <Icon name={a.name as IconName} size={a.size as IconSize} color={a.color as IconColor} />,
  code: (a) => `<Icon name="${a.name}"${attrs([['size', a.size as string, 'sm'], ['color', a.color as string]])} />`,
  matrix: () => [
    { title: 'size × color', surface: 'surface/raised', columns: light, rows: sizes.map((s) => ({ label: s, cells: light.map((c) => <Icon name="house" size={s} color={c} />) })) },
    { title: 'size × color · dark surfaces', surface: 'surface/sidebar', columns: dark, rows: sizes.map((s) => ({ label: s, cells: dark.map((c) => <Icon name="house" size={s} color={c} />) })) },
  ],
  gallery: () => (
    <section className="pv-group">
      <p className="pv-caption">All {iconNames.length} glyphs of the Figma set “Lucide icons”, size lg, color default</p>
      <ul className="pv-glyphs">{iconNames.map((n) => <li key={n}><span className="baas-root"><Icon name={n} size="lg" color="default" /></span><code>{n}</code></li>)}</ul>
    </section>
  ),
};
