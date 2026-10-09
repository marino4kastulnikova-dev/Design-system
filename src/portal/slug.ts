export const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
/** Anchor id of a token row on its foundation page. */
export const tokenAnchor = (name: string) => 'token-' + name.replace(/[^a-zA-Z0-9]+/g, '-');
