export const FIGMA_FILE = 'https://www.figma.com/design/AfiYjkdFU2Flc69Qgpw7yv/Baas-Web-Design-System';
export const figmaNodeUrl = (nodeId: string) => `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}`;
export const AUDIT_DATE = '2026-10-07';

/** Status as written in the Figma documentation frame. "Not documented" = no status text in the source. */
export type SourceStatus = 'Draft' | 'Not documented';

export type CategoryId = 'actions' | 'forms' | 'status' | 'display' | 'navigation' | 'tables' | 'overlays' | 'widgets';

/** Proposed — needs review: the grouping is the portal's; source page and component names are unchanged. */
export const categories: { id: CategoryId; label: string }[] = [
  { id: 'actions', label: 'Actions' },
  { id: 'forms', label: 'Forms and selection' },
  { id: 'status', label: 'Status and feedback' },
  { id: 'display', label: 'Display' },
  { id: 'navigation', label: 'Navigation and layout' },
  { id: 'tables', label: 'Tables and data' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'widgets', label: 'Widgets' },
];

export interface FigmaComponentRef {
  /** Component or component-set name in Figma. */ name: string;
  nodeId: string;
  /** Number of variants; 1 for a single component. */ variants: number;
  /** Figma component properties, exactly as defined. */ properties: FigmaProperty[];
}
export interface FigmaProperty { name: string; type: 'Variant' | 'Boolean' | 'Text' | 'Instance swap'; values: string; default?: string }

export type DocCoverage = 'Full specification' | 'Composition specification' | 'Partial' | 'None';

export interface ComponentEntry {
  /** Figma page name; also the URL slug. Never renamed. */ slug: string;
  /** Display title: the main Figma component name. */ title: string;
  category: CategoryId;
  status: SourceStatus;
  /** Status sentence copied from Figma. */ statusNote?: string;
  /** Purpose sentence from the Figma Overview table. */ purpose?: string;
  docs: DocCoverage;
  components: FigmaComponentRef[];
  /** True when the portal page (preview, docs) is implemented. */ built: boolean;
  related?: string[];
  /** Translucent variables are bound in Figma with a paint opacity of 100%, so Figma draws them opaque. */ opacityNote?: boolean;
}
