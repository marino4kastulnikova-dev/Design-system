# Stage 3 notes — component catalog

Status on 2026-10-07: all 39 component pages of the verified inventory are built (live preview, controls,
variant and state matrix, documentation, tokens, portal API, accessibility). Foundation pages other than
Colour are still plain token lists.

## Coverage checklist

| Figma page | Page built | Documentation in Figma |
| --- | --- | --- |
| account-card | Yes | Composition specification |
| account-details-modal | Yes | Composition specification |
| ai-assistant | Yes | Composition specification |
| avatar | Yes | Full specification |
| badge | Yes | Full specification |
| button | Yes | Full specification |
| checkbox | Yes | None |
| chip | Yes | Full specification |
| confirm-payment-modal | Yes | Composition specification |
| convert-modal | Yes | Composition specification |
| convert-widget | Yes | Composition specification |
| count-badge | Yes | None |
| dashboard-layout | Yes | Composition specification |
| detail-row | Yes | Composition specification |
| divider | Yes | Full specification |
| dropdown-panel | Yes | Composition specification |
| iban-table | Yes | Composition specification |
| icon-button | Yes | Full specification |
| icon-tile | Yes | Full specification |
| icons | Yes | Full specification |
| input | Yes | Full specification |
| live-indicator | Yes | Composition specification |
| message-banner | Yes | Composition specification |
| metric-card | Yes | Composition specification |
| modal-overlay | Yes | Composition specification |
| navigation-item | Yes | Full specification |
| page-header | Yes | Composition specification |
| progress-bar | Yes | Full specification |
| section-header | Yes | Partial |
| select-menu | Yes | Composition specification |
| sidebar | Yes | Composition specification |
| spinner | Yes | Full specification |
| theme-toggle | Yes | Composition specification |
| tooltip | Yes | Partial |
| transaction-row | Yes | Composition specification |
| transactions-grid | Yes | None |
| transactions-panel | Yes | Composition specification |
| user-row | Yes | Composition specification |
| wallet-option | Yes | Composition specification |

## Source discrepancies recorded on the pages

Each item is shown on the affected component page. None was resolved silently.

| Where | Finding | Portal follows |
| --- | --- | --- |
| metric-card, transactions-panel, dashboard-layout, chip, input, navigation-item, transaction-row, account-card, avatar, icon-button, divider | Translucent variables are bound with a paint opacity of 100%, so Figma draws them opaque. | The token value (documented intent). Needs review. |
| account-card | Documentation lists two actions (Linked card, Buy euro); the iban footer row has 0% opacity and no tonal Buy euro button exists. | Live component |
| user-row | Documentation says Status and KYC badges are lg; live component uses md. | Live component |
| iban-table | Documentation says IconButton tonal for copy; live component uses ghost. Developer mapping lists `message`, a leftover. | Live component |
| confirm-payment-modal | Documentation frame describes a 3-D Secure card payment with `state` only; the component was reworked 2026-10-02 (types conversion / transfer / withdrawal, no 3-D Secure). | Component description |
| convert-modal | Documentation frame covers conversion only; component extended 2026-10-02 to 9 variants. | Component description |
| modal-overlay | Documentation says 228 px top offset; description (2026-10-02) says centred both ways. | Component description |
| dropdown-panel | Description is in Russian (translated on the page); panel fill binds the primitive `neutral/0`. | As is |
| wallet-option | Documentation shows a check on the selected row; `showCheck` defaults to false and the panels do not use it. | Live component |
| modals | Live fills bind `neutral/0` / `neutral/50` where the documentation names `surface/raised` / `surface/muted`; shadows are not linked to `shadow/modal` but equal it. | Semantic tokens named in the documentation |
| transaction-row | TransactionsHeader contains a 700 px Divider that looks like a leftover. | Not reproduced |
| transactions-grid | No documentation, status or description in Figma. | Read from the components only |

## Portal decisions that need review

- Sample data (names, merchants, e-mail addresses, IBANs, wallet addresses, hashes) is synthetic; the texts of the Figma file are not copied.
- Member photos on AccountCard are replaced by neutral placeholder circles; coin icons are redrawn (external library instances in Figma).
- The AI orb is a CSS approximation built from the `gradient-ai-orb-*` styles.
- Behaviour that Figma leaves to the implementation (dropdown opening, swap, pagination, row selection, copy feedback, dialog focus management, spinner rotation) is implemented and labelled "Proposed — needs review" on each page.
- All component APIs are a portal implementation, pending developer validation.

## Still open in Stage 3

- Foundation pages: Typography, Dimensions and sizes, Radius, Borders and opacity, Gradients, Shadows and glass. (Icons is built: all 101 glyphs with filter, size and colour controls, copy name, and the size/colour tokens.)
- Open questions from Stage 2 (checkbox focus ring, button discrepancy table, navigation categories).
