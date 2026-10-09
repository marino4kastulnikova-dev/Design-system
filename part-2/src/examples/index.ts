import { buttonExample } from './button';
import { checkboxExample } from './checkbox';
import { iconsExample } from './icons';
import { selectMenuExample } from './select-menu';
import * as atoms from './atoms';
import * as compositions from './compositions';
import type { ComponentExample } from './types';

export * from './types';
const list: ComponentExample[] = [buttonExample, checkboxExample, iconsExample, selectMenuExample, ...Object.values(atoms), ...Object.values(compositions)];
/** Keyed by Figma page name. */
export const examples: Record<string, ComponentExample> = Object.fromEntries(list.map((e) => [e.slug, e]));
