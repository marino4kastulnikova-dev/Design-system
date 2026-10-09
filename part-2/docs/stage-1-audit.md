# BaaS Web Design System portal — Stage 1 audit and research

Audited 2026-10-07 from the Figma file `AfiYjkdFU2Flc69Qgpw7yv` (Baas-Web-Design-System), read through the Figma connector. Nothing in the file was modified. No code repository exists; the `DS-site` folder is empty.

Labels used below: **Verified** = read from Figma; **Proposed — needs review** = my suggestion; **Not documented** = absent in the source.

---

## 1. Decisions needed before Stage 2

1. **Visual direction** — A, B or C (section 7). Recommendation: **B — Gallery**.
2. **Architecture** — custom portal, no Storybook for now (section 8). Confirm or object.
3. **Checkbox sample page** — the `checkbox` page has no documentation frame and only three variants (unchecked, checked, indeterminate): no hover, focus, disabled or error, no label. Choose:
   - (a) build it exactly as it exists and mark everything else "Not documented" (my default), or
   - (b) use `input` as the second Stage 2 sample instead, because it has a full 13-section spec.

Not blocking: the screen recording mentioned in the brief was not attached to this session. Figma gave me everything it would have.

---

## 2. File structure (Verified)

45 pages: `cover`, `foundations`, 39 component pages, `draft` (product screens, not components), 3 separators.

- Variables: **8 collections, 187 variables, one mode each ("Mode 1")**.
- Styles: **23 text styles, 14 paint styles (gradients), 4 effect styles**, no grid styles.
- Fonts used by components: **DM Sans** (Regular, Medium) and **Orbitron** (SemiBold, numeric display only). Documentation frames on the `foundations` page use Manrope and Roboto Mono; those are doc-frame fonts, not system fonts.
- Icons: `Lucide icons` set with **101 variants** (the Figma doc states 100) wrapped by an `Icon` component (3 sizes × 12 colours = 36 variants, instance-swap glyph).
- Library status: local, not published ("pending library publish" appears on several pages).

## 3. Component inventory (Verified)

39 pages, 48 components / component sets. **Every documented status is DRAFT.** Nothing is marked approved, pending approval as a separate state, or deprecated.

Doc templates found: **Atom** = 10–14 numbered sections (Overview, Component, Anatomy, Variants, Sizes, States, Properties, Tokens used, Usage, Edge cases, Accessibility, Developer mapping). **Composition** = 9 sections (Overview, Component, Composition, Properties, Token audit, Usage, Edge cases, Accessibility, Developer mapping).

| Page | Component(s) → node | Variants / properties | Docs | Status in Figma |
|---|---|---|---|---|
| account-card | AccountCard `376:1176` | 2 · appearance: iban, wallet | Composition | DRAFT — pending approval |
| account-details-modal | AccountDetailsModal `493:6224` | single · title, subtitle, amount, ibanLabel | Composition | DRAFT — created with approval (variant B); pending library publish |
| ai-assistant | AiAssistant `381:1879` | single · no properties | Composition | DRAFT — pending approval |
| avatar | Avatar `348:907` | single · initials | Atom (12) | DRAFT — pending approval |
| badge | StatusBadge `325:849` | 24 · appearance ×8, size sm/md/lg, showIcon, label | Atom (14) | DRAFT — pending approval |
| button | Button `302:835` | 96 · appearance ×4, layout default/icon-only, size md/sm, state ×6, showIcon, label | Atom (14) + changelog | DRAFT — pending approval |
| checkbox | Checkbox `522:5090` | 3 · state: unchecked, checked, indeterminate | **None** | Not documented |
| chip | Chip `344:951` | 20 · size md/sm, layout default/icon-only, state ×5, showIcon, label | Atom (14) | DRAFT — pending approval |
| confirm-payment-modal | ConfirmPaymentModal `394:2109` | 4 · type ×3, state active/expired | Composition | DRAFT — pending approval |
| convert-modal | ConvertModal `394:2113` | 9 · type ×3, state processing/success/failed | Composition | DRAFT — pending approval |
| convert-widget | ConvertWidget `381:1429` | single · no properties | Composition | DRAFT — pending approval |
| count-badge | CountBadge `523:5083` | single · count | **None** | Not documented |
| dashboard-layout | DashboardLayout `383:1457` | single · 1920×1080 | Composition | DRAFT — pending approval |
| detail-row | DetailRow `393:1890` | single · label, value | Composition | DRAFT — pending approval |
| divider | Divider `342:844` | 2 · appearance default/inverse | Atom (12) | DRAFT — pending approval |
| dropdown-panel | DropdownPanel `396:3158` | 2 · kind from/to | Composition | DRAFT — pending approval |
| iban-table | IbanHeader `496:5131`, IbanRow `500:5175` | IbanRow 2 · state default/hover + 5 text props | Composition | DRAFT — created with approval 2026-09-25; pending library publish |
| icon-button | IconButton `333:906` | 20 · appearance ghost/tonal/glass/soft, state ×5 | Atom (12) | DRAFT — pending approval |
| icon-tile | IconTile `348:905` | 6 · appearance neutral/positive/danger, size md/lg | Atom (12) | DRAFT — pending approval |
| icons | Icon `292:885`, Lucide icons `212:1410` | Icon 36 · size sm/md/lg × 12 colours, instance-swap glyph; Lucide icons 101 | Atom (10) + changelog | DRAFT — pending approval |
| input | Input `357:969` | 11 · content placeholder/value, state ×6, leading/trailing icon, value | Atom (13) | DRAFT — pending approval; Users screen not rebuilt |
| live-indicator | LiveIndicator `381:1344` | single | Composition | DRAFT — pending approval |
| message-banner | MessageBanner `393:1960` | single · message | Composition | DRAFT — pending approval |
| metric-card | MetricCard `365:995` | single · title, value, showDelta | Composition | DRAFT — pending approval |
| modal-overlay | ModalOverlay `461:5132` | single · modal (instance swap) | Composition | DRAFT — created with approval; pending library publish |
| navigation-item | NavigationItem `362:905` | 6 · state ×6, label | Atom (10) | DRAFT — default and selected OBSERVED, other states APPROVED |
| page-header | PageHeader `381:1356` | single | Composition | DRAFT — pending approval |
| progress-bar | ProgressBar `348:963` | single | Atom (12) | DRAFT — pending approval |
| section-header | SectionHeader `419:6055` | single · title | Partial (6 sections) | No status written |
| select-menu | SelectOption `481:5141`, SelectMenu `481:5178` | Option 3 · state default/hover/selected; Menu 2 · kind status/kyc | Composition | DRAFT — created with approval; pending library publish |
| sidebar | Sidebar `364:943`, SidebarCollapsed `645:5029` | single each · userName, userRole | Composition | DRAFT — pending approval |
| spinner | Spinner `348:961` | 2 · size lg/md | Atom (12) | DRAFT — pending approval |
| theme-toggle | ThemeToggle `381:1330` | single | Composition | DRAFT — pending approval |
| tooltip | Tooltip `592:5083` | single · label | Partial (6 sections) | DRAFT — pending approval |
| transaction-row | TransactionRow `380:1209`, TransactionsHeader `380:1232`, Pagination `380:1244` | single each · 7 text props on the row | Composition | DRAFT — pending approval |
| transactions-grid | TransactionsGridHeader `525:5083`, TransactionsGridRow `525:5175` | Row 3 · state default/selected/hover | **None** | Not documented |
| transactions-panel | TransactionsPanel `381:1527` | single | Composition | DRAFT — pending approval |
| user-row | UserRow `388:2403`, UsersHeader `388:2727` | single each · 5 text props on the row | Composition | DRAFT — pending approval |
| wallet-option | WalletOption `396:1894`, ExternalOption `396:1895` | WalletOption 3 · state default/hover/selected, showCheck | Composition | DRAFT — pending approval |

Node links follow the pattern `https://www.figma.com/design/AfiYjkdFU2Flc69Qgpw7yv/Baas-Web-Design-System?node-id=302-835`.

Compared with the list in the brief: every name there exists. The file additionally contains icon-tile, icons, input, live-indicator, message-banner, metric-card, modal-overlay, navigation-item, page-header, progress-bar, section-header, select-menu, sidebar, spinner, theme-toggle, tooltip, transaction-row, transactions-grid, transactions-panel, user-row and wallet-option.

### Navigation categories — Proposed — needs review

Source names are kept; only the grouping is new.

| Category | Pages |
|---|---|
| Actions | button, icon-button, chip |
| Forms and selection | input, checkbox, select-menu, theme-toggle |
| Status and feedback | badge, count-badge, live-indicator, message-banner, progress-bar, spinner, tooltip |
| Display | avatar, icon-tile, icons, divider, detail-row, metric-card |
| Navigation and layout | navigation-item, sidebar, page-header, section-header, dashboard-layout |
| Tables and data | transaction-row, transactions-grid, transactions-panel, user-row, iban-table |
| Overlays | modal-overlay, account-details-modal, confirm-payment-modal, convert-modal, dropdown-panel, wallet-option |
| Widgets | account-card, convert-widget, ai-assistant |

## 4. Foundation inventory (Verified)

| Collection | Count | Kind | Notes |
|---|---|---|---|
| Colour Primitives | 44 | raw hex | neutral, brand, purple, green, amber, blue, red, pink, slate, and an alpha/* scale |
| Colour Semantic | 63 | every value is an alias to a primitive | text/*, icon/*, surface/*, border/*, status/*, brand |
| Dimension Primitives | 18 | raw px | 4 … 64; used directly for padding and gap (no Spacing collection) |
| Size Semantic | 25 | aliases to dimension/* | size/icon, size/control, size/icon-button, size/label, size/tile, size/avatar, size/spinner, font/size/* |
| Border Width | 1 | raw | borderWidth/hairline = 1 |
| Opacity | 16 | raw | fractions, plus opacity/disabled = 40 (percent) |
| Radius Primitives | 9 | raw px | none, xs 4, sm 8, 10, md 12, lg 16, xl 20, 2xl 24, full 9999 |
| Typography Primitives | 11 | strings and numbers | 2 families, 3 weights, 5 line heights, 1 letter spacing |

Styles: 23 text styles (`typography/*`); 14 paint styles (gradient-purple, gradient-dark, gradient-progress, gradient-card-iban, gradient-glow, gradient-purple-subtle, gradient-spinner, gradient-ai-panel and six gradient-ai-orb-*); 4 effect styles (shadow/soft, shadow/dropdown, shadow/modal, glass/default).

Many variables carry written descriptions (purpose, where observed, approval date). These will be shown as the token's semantic purpose.

Planned foundation pages: Colour (primitives, semantic, alias map), Typography, Dimensions and sizes, Radius, Borders and opacity, Gradients, Shadows and glass, Icons. **No Modes page and no dark preview mode**: every collection has a single mode.

## 5. Inconsistencies and gaps found

Recorded as-is. I will not resolve any of these silently.

1. **Button documentation contradicts itself.** The Overview and Variants sections say "one size only: 40 px", "24 variants" and "focus-visible is not designed"; the changelog and the live set show 96 variants, a second size sm (32 px), layout icon-only, and a 1 px focus ring. The token table says the secondary stroke is border/hairline; the changelog says border/default. I will treat the live component set plus the changelog as current and flag the older text.
2. **Foundation counts in the doc frames are stale.** The frames state Colour Primitives 38 and Colour Semantic 55; the collections hold 44 and 63. A heading reads "Radius Primitives (8)"; there are 9.
3. **The `foundations` page mixes historical audit frames with live ones** (marked "HISTORICAL — Phase 3 audit, do not use as the source of truth"). The portal will read the variables and styles, not those frames.
4. **Two parallel text-style naming sets**: `typography/body-sm`, `body-lg`, `caption`, `heading-sm`… and `typography/body/regular`, `emphasis/medium`, `heading/h1`… with duplicates (the file itself notes body-sm = body/regular). Both will be listed; not merged.
5. **size/label/md** aliases dimension/28, while its description says "Label component height 24".
6. **opacity/disabled = 40** is a percent; the rest of the Opacity collection is fractional (the file documents why).
7. **ThemeToggle (light / dark) exists, but there is no dark mode** in any variable collection.
8. **Checkbox, count-badge and transactions-grid have no documentation frames.** Checkbox has no hover, focus-visible, disabled or error state and no label. Section-header has docs but no status; tooltip docs skip sections 03 and 07.
9. **Modal docs vs properties.** ConfirmPaymentModal's purpose describes a 3-D Secure card payment, but its properties are type conversion / transfer / withdrawal × state active / expired with only 4 of 6 combinations built (expired exists for conversion only). ConvertModal's purpose says "currency conversion" while it also has transfer and withdrawal types.
10. **Icon docs are stale in places.** The Component section says 21 variants (3 sizes × 7 colours); the live set has 36 (12 colours), matching the changelog. The doc says the Lucide set has 100 glyphs; the set has 101 variants, and it carries a leftover unnamed variant property ("Property 1", 4 options) next to `icon`.
11. **Page name ≠ component name**: `badge` → StatusBadge; `icons` → Icon + Lucide icons; `transaction-row` also holds TransactionsHeader and Pagination; `user-row` also holds UsersHeader. URLs will use the page names, titles the component names.
12. **DropdownPanel's component description is in Russian** ("На будущее: …"). It will be translated to English without changing its meaning.
13. **glass/default is a Figma glass effect** with no exact CSS equivalent. Previews will approximate it with backdrop-filter and say so on the page.
14. Several docs reference `APPROVALS-NEEDED.md` and "Phase 6" screen rebuilds that are not in the file.

## 6. Access and source gaps

- Figma: full read access confirmed. No gap.
- Code: none. Every component API in the portal will be labelled **"Portal implementation — pending developer validation"**. The "Developer mapping" tables in Figma will be shown as design intent, not as a production contract.
- Fonts: DM Sans and Orbitron are both on Google Fonts; I will self-host them in the project and include their licence files. Icons come from the open-source Lucide set; glyph names will be checked against Figma one by one.
- Automatic sync is not possible on the current Figma plan through the REST variables endpoint, so updates will be a documented manual re-export.

## 7. Research and visual directions

### References and what to take from each

| Reference | Idea to adopt |
|---|---|
| [Apple Developer Documentation — SwiftUI Button](https://developer.apple.com/documentation/swiftui/button) | Page skeleton: small type label above a large title, one-sentence abstract, a code declaration block, Overview, then "Topics" as grouped link lists and "Relationships / See Also". Filterable sidebar tree. Hairlines instead of boxes. |
| [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) | Guidance written as short imperative paragraphs; large quiet illustrations on a soft neutral stage; a card grid as the component index. |
| [Storybook Autodocs](https://storybook.js.org/docs/writing-docs/autodocs) | Primary example linked to a controls table, so changing a control re-renders the preview; the remaining stories listed below; table of contents hidden under 1200 px. |
| [Shopify Polaris — Button](https://polaris-react.shopify.com/components/actions/button) | Variant picker: a list of named examples, each with live preview, a usage note and code. Do / Don't pairs. Related components and a dedicated Accessibility section at the end. |
| [GitHub Primer — Button](https://primer.style/product/components/button/) | Status labels next to the title with direct links to Figma and source; Copy and Reset on every example; sticky "On this page". |
| [IBM Carbon — Button](https://carbondesignsystem.com/components/button/usage/) | Maturity label and last-updated line in the title block; numbered anatomy diagram; specifications kept apart from guidance. |

The two Apple pages render only with JavaScript, so I read the Button page through its Markdown version; the notes on the Apple shell layout come from my prior knowledge of those sites rather than this session's fetch.

### Three directions

**A — Reference.** Closest to Apple Developer Documentation. White, text-first, dense. Type label + large title + abstract; sections divided by hairlines; previews sit in flat bordered panels inline with the text; catalog is a grouped link list. Best for reading and scanning; least visual.

**B — Gallery (recommended).** HIG-like. Catalog is a grid of cards with live thumbnails. Each component page opens with a large preview stage on a soft neutral surface, controls docked beside it and synchronized code below, then one continuous scrolling document (variants matrix, guidance, tokens, API, accessibility) with the right-hand outline. Why: your components rely on translucent glass, gradients and dark surfaces, which need a generous, switchable stage (light canvas / dark sidebar surface) to look right, and a single scrolling page keeps stable anchors and the outline you asked for.

**C — Workbench.** Storybook-leaning. Preview canvas dominates; controls, tokens and code live in a docked panel with tabs; documentation is secondary and sits on a separate tab. Best for developers testing states; weakest for reading guidance, and tabs fragment the outline.

## 8. Recommended architecture

**Custom portal; no Storybook now.** There is no production code for Storybook to document, its shell cannot reach the Apple-style brief without heavy re-theming, and running both would be a dual setup with no present benefit. The example format will stay close to Storybook's (named examples with args), so an embedded or linked Storybook can be added once a real package exists.

- **Stack:** Vite, React, TypeScript, React Router (history routing with a fallback so nested routes survive refresh), MDX for documentation.
- **Layers (separate folders):**
  1. `portal/` — shell UI and its own styles (system-ui, Apple-inspired).
  2. `tokens/` — `tokens.json` generated from Figma, aliases preserved as references; CSS variables and a JSON export generated from it by script. No hand-copied values.
  3. `ds/` — faithful implementations of the BaaS components, styled only through the generated variables, DM Sans / Orbitron, Lucide.
  4. `registry/` — one typed entry per component: source name, page slug, Figma node, status, category, properties, token references, related components. Navigation, catalog, search index and the coverage checklist are generated from it.
  5. `examples/` — preview examples and synthetic sample data.
- **Preview isolation:** each preview renders in an iframe on a `/preview/…` route of the same app. Portal CSS cannot leak in, modals and dropdowns stay inside the frame, viewport controls resize the frame, and controls talk to it by message passing.
- **Token schema:** W3C Design Tokens format (`$type`, `$value`, `$description`, alias as `{neutral.900}`) plus the Figma collection and variable name, documented in the repo.
- **Updates:** manual, documented: re-run the Figma extraction, regenerate tokens, review the diff. No claim of automatic sync.

## 9. Stage 2 scope once approved

Portal shell, Overview, the Colour foundation page, and two component pages: Button plus Checkbox or Input (decision 3). Running locally with screenshots, checked against Figma.
