# AquaVision — Prototype

An interactive **pitch + product prototype** for AquaVision, built for a live pitching competition. One React app, two modes:

- **Pitch mode** — a keyboard-driven 16-slide guided deck (from `data/13_pitch/pitch-deck-outline.json`) with live, brand-styled charts.
- **Demo mode** — a free-roam product demo: the Phase 1 free app, the Phase 2 premium tier, and the Phase 3 enterprise dashboard including the **PondTwin** 2.5D digital-twin.

The prototype wears the repository's honesty discipline as a feature: zero users, TRL 3, provenance badges on every figure, and an unmistakable **SAMPLE DATA — NOT REAL** badge on anything fed by the synthetic datasets.

## Run it

```bash
cd prototype
npm install
npm run dev        # dev server (http://localhost:5173)
# or, for the venue:
npm run build      # produces a self-contained, offline dist/
npm run preview    # serves dist/
```

Requires Node 18+ (developed on Node 22). No network needed at runtime — fonts, data, and assets are all bundled. The canonical JSON is imported from `../data` via the `@data` Vite alias and bundled into the build, so `dist/` is a portable, offline artifact. To share source, zip `prototype/` **and** `data/` together (they are siblings).

## Keyboard map (pitch mode)

| Key | Action |
| --- | --- |
| `→` / `Space` / `PgDn` | Next slide |
| `←` / `PgUp` | Previous slide |
| `Home` / `End` | First / last slide |
| `F` | Fullscreen |
| `N` | Presenter notes (the outline's *must-accomplish* + caveat, verbatim) |
| `A` | Objections / FAQ drawer (filterable) |
| `5` | Toggle the 5-minute version (slides 1, 2, 3, 4, 5, 7, 10, 13, 15) |
| `D` | On slides 5 / 6 / 7 — jump into the matching live demo |
| `Esc` | Back to landing |

URLs are shareable and refresh-safe: `#/pitch/13`, `#/demo/enterprise/pondtwin`, `#/charts`.

## Presenter run-of-show

1. **Open on the landing page.** One line, two buttons. Start Pitch mode.
2. **Slides 1–4:** the inflection (aquaculture > capture), the three-stage problem, the phased spine. Press `N` any time for the script.
3. **Slide 5 / 6 / 7:** press `D` to drop into the live app / premium analytics / PondTwin, then `Esc`/back to return.
4. **Slide 13:** the two honest zeros. This is the credibility beat — let it land.
5. **Slide 15:** the ask (spend plan, not a forecast; note the kill gate).
6. **Q&A:** press `A` for the objections drawer — 20+ hard questions with honest answers, filterable by phase.
7. Short on time? Press `5` for the 9-slide cut.

## What to show in Demo mode

- **Free → Home:** the pond reads **No Data** because nothing was logged in 9 days — grey, never green.
- **Free → Water log:** the chart leaves the nine unlogged days as **gaps**, never a line across them.
- **Free → Disease ID:** ranked candidates with confidence + a route to a human. A suggestion, never a diagnosis.
- **Premium → Analytics:** an honest "Not enough data yet" state instead of a fabricated trend.
- **Enterprise → Site overview:** the five-second answer; the alert reads as a plain sentence, never a score.
- **Enterprise → Profile:** depth runs **downward**; the surface looks survivable over anoxic bottom water.
- **Enterprise → PondTwin:** scrub time past a sortie and watch staleness accrue; toggle **Confidence field** — the far corner is a near-transparent hole. The **Simulated** layer is empty on purpose.

## The honesty checklist (do not regress)

Authored copy must never contain any of these (from `data/13_pitch/elevator-pitches.json#/the_words_never_to_use`):

- "prevents fish kills" → "detects deteriorating conditions earlier"
- "detects toxins" → "detects pigments correlated with taxa that sometimes produce toxins"
- "diagnoses" (disease from a photo) → "suggests a likely cause, flagged with confidence, for a human to confirm"
- "predicts" (as a claim) → "reveals the mechanism"
- "revolutionary / game-changing / disruptive" → say what it does
- Any user count, download count, subscriber count, or conversion rate that isn't measured
- Synthetic data without the **SAMPLE DATA — NOT REAL** badge

## Structure

```
src/
  App.jsx, router.js, Landing.jsx, ChartsGallery.jsx
  styles/            tokens (palette from assets/color_scheme.png), global, charts
  data/              index.js (@data imports), charts.js, derived/, demoFixtures.js, twinData.js
  shared/
    components/      StatusBadge, ProvenanceBadge, SampleDataBanner, StalenessTag,
                     AlertCard, StatTile, PhoneFrame, EmptyState, Tabs, UpgradeTeaser, KeyHint, Sparkline
    charts/          chartSvg.js (ported from site-generator/lib/charts.mjs), ChartFigure.jsx
    hooks/           useKeyNav, useTicker
  pitch/             PitchMode, SlideLayout, PresenterNotes, AppendixDrawer, slides/
  app/               DemoMode, TierContext, TierSwitcher, screens/, pondtwin/interpolate.js
  enterprise/        EnterpriseShell + SiteOverview, ProfileView, MapView, HistoryView,
                     ReportsView, FleetHealth, pondtwin/ (PondTwin, TopDownMap, SliceView, TimeScrub, LayerToggles)
```

The hidden `#/charts` gallery renders every chart payload and is the regression net for the ported chart engine.
