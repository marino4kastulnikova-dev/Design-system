import type { ReactNode } from 'react';

export type Args = Record<string, string | boolean>;

export interface Control {
  name: string;
  label: string;
  type: 'select' | 'boolean' | 'text';
  options?: string[];
  /** Hide the control when it does not apply to the current args. */
  when?: (args: Args) => boolean;
  /** Short note shown under the control. */
  note?: string;
}

/** Preview surfaces are real semantic colour tokens, not themes. */
export type SurfaceId = 'surface/raised' | 'surface/canvas' | 'surface/sidebar';

export interface MatrixCell { label?: string; node: ReactNode }
export interface MatrixGroup { title: string; surface: SurfaceId; columns: string[]; rows: { label: string; cells: ReactNode[] }[]; /** Scale factor for large compositions. */ zoom?: number }

export interface ComponentExample {
  slug: string;
  defaults: Args;
  controls: Control[];
  surfaces: SurfaceId[];
  /** Picks the surface that suits the current args (for example, the dark surface for an inverse button). */
  surfaceFor?: (args: Args) => SurfaceId | undefined;
  render: (args: Args, setArgs: (patch: Args) => void) => ReactNode;
  /** Usage snippet for the portal implementation, kept in sync with the controls. */
  code: (args: Args) => string;
  matrix: () => MatrixGroup[];
  /** Optional free-form block shown under the matrix (for example the glyph gallery). */
  gallery?: () => ReactNode;
  /** One-line hint shown under the preview stage. */
  hint?: string;
  /** Design width in px. Wider than the stage, the preview is scaled down to fit. */
  naturalWidth?: number;
}

// ---- helpers for writing examples -------------------------------------------------
export const sel = (name: string, options: readonly string[], extra: Partial<Control> = {}): Control => ({ name, label: name, type: 'select', options: [...options], ...extra });
export const bool = (name: string, extra: Partial<Control> = {}): Control => ({ name, label: name, type: 'boolean', ...extra });
export const txt = (name: string, extra: Partial<Control> = {}): Control => ({ name, label: name, type: 'text', ...extra });
/** Builds a JSX attribute string, leaving out values equal to their default. */
export const attrs = (pairs: [name: string, value: string | boolean | number | undefined, def?: string | boolean | number][]) =>
  pairs.filter(([, v, d]) => v !== undefined && v !== false && v !== d).map(([n, v]) => (v === true ? ` ${n}` : typeof v === 'number' ? ` ${n}={${v}}` : ` ${n}="${v}"`)).join('');
export const LIGHT: SurfaceId[] = ['surface/raised', 'surface/canvas', 'surface/sidebar'];
export const DARK: SurfaceId[] = ['surface/sidebar', 'surface/canvas', 'surface/raised'];
export const GLASS: SurfaceId[] = ['surface/canvas', 'surface/sidebar', 'surface/raised'];
