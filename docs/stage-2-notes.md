# Stage 2 — first working sample: verification notes

Built 2026-10-07. Direction B (Gallery), custom portal without Storybook, Checkbox built exactly as it exists in Figma.

## What is in the sample

- Portal shell: header with search (`/` or Ctrl/Cmd+K), filterable sidebar generated from the registry, right-hand outline, mobile drawer.
- Overview, catalog of all 39 verified pages (filters by name, category, source status), Colour foundation page.
- Button and Checkbox pages: live preview in an isolated frame, controls, synchronized code, full variant matrix,
  documentation from Figma, tokens linked to the Colour page, portal implementation API, accessibility, source discrepancies.
- Token exports: `/tokens/tokens.css`, `/tokens/tokens.json`.

## Checked against Figma

| Check | Result |
| --- | --- |
| Variable count | 187 generated = 187 in Figma (44 / 63 / 18 / 25 / 1 / 16 / 9 / 11 per collection) |
| Aliases | Every alias resolves; the generator fails on a missing target |
| Button geometry, all 96 variants | Heights 40 / 32; icon-only 40, 42 (outlined md), 32. Default md width 116.6 px rendered vs 117 in Figma (Figma rounds the 44.6 px label to 45) |
| Button fills, outlines, icon colours, shadow, focus ring, disabled opacity | Bound to the same tokens and styles as each Figma variant |
| Label font | DM Sans variable, weight 500, 14 px, optical size auto; label box 18 px high as in Figma |
| Icon stroke | size ÷ 24 (0.833 px at 20, 0.667 px at 16), as in Figma |
| Checkbox | 24 × 24, radius 4, 14 px glyph with 1 px stroke; visually compared with a Figma render of the set |
| Visual spot check | Figma renders of Button primary/default, tonal/pressed and the Checkbox set compared with the portal matrix |

Automated browser run (27 checks, dev and production build): checkbox click and Space update the controls and code; controls
update the frame; reset; copy code and copy token with feedback; inverse switches to the dark surface; viewport widths;
focus-visible ring; deep link to a section; refresh on a nested route; back/forward; alias links; token filter empty state;
search with keyboard and empty state; Escape closes search; catalog filters from the URL; planned page; not-found page;
alias preserved in `tokens.json`. `tsc --noEmit` and `vite build` pass with no console errors.

## Deviations and things to know

1. **Gradients** are exported as stretched SVG images so they match Figma at any size; they are not plain CSS `linear-gradient` values.
2. **Loading** is the static `refresh-ccw` glyph, as drawn. No animation was added.
3. **Checkbox focus ring** is not in Figma. The portal draws a 1 px `border/focus` ring so keyboard focus is visible. Proposed — needs review.
4. **Checkbox behaviour** (what a click does from indeterminate) is not documented; the native convention is used. Proposed — needs review.
5. **Button `loading` ignores clicks** and **icon-only needs `aria-label`**. Proposed — needs review.
6. **Icons:** 7 of the 101 Figma glyphs are wired up (plus, refresh-ccw, check, minus, user-round-plus, credit-card, list-filter).
   The set's unnamed property `Property 1` distinguishes glyph origin: lucide, google, apple, svgrepo. Four glyphs
   (`google`, `apple`, `cursor`, `star-filled`) and possibly `astroid` are not in the Lucide package and will need exported SVGs in Stage 3.
7. **Orbitron** is not loaded yet; neither sample component uses it.
8. **Portal is light only.** Preview surfaces (`surface/raised`, `surface/canvas`, `surface/sidebar`) are real tokens, not themes.
9. **Not tested:** screen readers, Safari and Firefox, touch devices. Checks ran in Chromium.

## Decisions needed before Stage 3

- Approve or change the visual direction and the component page template.
- Checkbox: confirm or replace the proposed focus ring; say whether hover, disabled and a label should be designed first.
- Button: the older documentation text contradicts the live set in seven places (listed on the Button page). Should the portal
  keep showing the discrepancy table, or will the Figma text be updated?
- Category grouping in the sidebar is proposed; rename or regroup as needed.
