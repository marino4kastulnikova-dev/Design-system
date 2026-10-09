// Foundation sections, derived from the Figma variable collections and local styles.
export interface FoundationEntry { slug: string; title: string; summary: string; sources: string[]; built: boolean }

export const foundations: FoundationEntry[] = [
  { slug: 'colour', title: 'Colour', summary: 'Primitive palette and the semantic colours that alias it.', sources: ['Colour Primitives', 'Colour Semantic'], built: true },
  { slug: 'typography', title: 'Typography', summary: 'Font families, weights, line heights and the 23 text styles.', sources: ['Typography Primitives', 'Text styles'], built: false },
  { slug: 'dimensions', title: 'Dimensions and sizes', summary: 'Raw dimension scale and purpose-named sizes. Padding and gap bind to dimension/* directly.', sources: ['Dimension Primitives', 'Size Semantic'], built: false },
  { slug: 'radius', title: 'Radius', summary: 'Corner radius scale.', sources: ['Radius Primitives'], built: false },
  { slug: 'borders-opacity', title: 'Borders and opacity', summary: 'Border width and opacity values.', sources: ['Border Width', 'Opacity'], built: false },
  { slug: 'gradients', title: 'Gradients', summary: '14 paint styles.', sources: ['Paint styles'], built: false },
  { slug: 'elevation', title: 'Shadows and glass', summary: 'Three shadow styles and the glass effect.', sources: ['Effect styles'], built: false },
  { slug: 'icons', title: 'Icons', summary: 'The Lucide glyph set and the Icon component.', sources: ['Lucide icons (212:1410)'], built: true },
];
