# AquaVision Site Generator

Turns the `data/` repository into a self-contained, multi-page website you can
navigate in a browser. No server, no dependencies, no build tooling — just Node.

## The process

```bash
node site-generator/build.mjs
```

That regenerates `../site/` from scratch. Then open **`site/index.html`** by
double-clicking it — every link is relative, so it works straight off `file://`.

Re-run the command any time the data changes. The output folder is disposable
and rebuilt on every run.

## What it produces

- `site/index.html` — home dashboard (stats, provenance legend, awaiting-data
  panel, audience-filterable section cards)
- `site/sections/<id>.html` — one page per section (14)
- `site/files/<id>.html` — one page per data file (85)
- `site/assets/` — `style.css`, `app.js`, `search-index.js`, and the logo/render images

Navigation: persistent sidebar, breadcrumbs, prev/next, and a full-text search
overlay (press **Ctrl+K** or **/**). A theme toggle switches light/dark (dark is
the brand default); the choice persists across pages.

## How it works

Driven entirely by `manifest.json` (sections, file list, order, ids) plus the
brand tokens in `data/01_company/brand-identity.json`.

| File | Responsibility |
|------|----------------|
| `build.mjs` | Orchestrator: load → emit pages → assets → link/citation self-check |
| `lib/load.mjs` | Parse manifest + all data files; build lookups and citation index |
| `lib/layout.mjs` | Page shell: sidebar, topbar, breadcrumbs, search overlay, footer |
| `lib/renderers.mjs` | Document → HTML: honesty banners, typed renderers (KPI, risk, study, citation), generic recursive fallback |
| `lib/charts.mjs` | `chart_payload` → inline SVG (line, depth-profile, bar, donut, radar, funnel, waterfall) |
| `lib/search.mjs` | Emits `search-index.js` |
| `lib/html.mjs` | Escaping, provenance/status badges, filename auto-linking |
| `static/` | `style.css` + `app.js`, copied verbatim |

### Design decisions honoured from the data

- **Provenance is visible.** Every file shows its provenance badge; anything
  `illustrative_synthetic` gets a red "SAMPLE DATA — NOT REAL" banner.
- **Honesty fields surface, never hide.** `SYNTHETIC_WARNING`, `integrity_rule`,
  `honest_note`, `status: awaiting_data`, etc. render as banners/callouts at the
  top of the page.
- **Charts follow the brand rules.** Gaps stay gaps (no interpolation), depth
  axes increase downward, thresholds are dashed and labelled, status carries an
  icon + text (never colour alone).
- **Citations resolve.** Every `citation_ids[]` links to its anchor in the
  bibliography page.

## Exact brand fonts (optional)

The CSS uses system fallback stacks so the site works offline. To get the exact
faces, drop `Inter`, `Inter Tight`, and `JetBrains Mono` `.woff2` files into
`site/assets/fonts/` and uncomment the `@font-face` block in `static/style.css`.

## Known data gaps (reported, not bugs)

The build prints warnings for `citation_ids` referenced somewhere but absent
from `references-bibliography.json`. These are real gaps in the source data;
the pages render those links as red "missing citation" chips rather than hiding
the problem.
