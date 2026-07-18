# AquaVision — Knowledge Repository

**Fisheries • Aquaculture • Technology**

This repository is the single source of truth for **AquaVision**: a pitch kit, a thesis kit, an engineering specification, a research corpus, and a set of chart-ready datasets — all as structured JSON, designed to be read by a custom HTML webpage.

---

## What AquaVision is

AquaVision is an AI-powered aquaculture management platform for fish farmers at every stage of their journey, built as three phases that layer on top of one another:

1. **Phase 1 — Foundation (free / low-cost app).** AI-assisted fish farming guide, farm setup assistant, water quality logging, feeding schedules, disease identification, community discussions, learning modules, record keeping. This is the acquisition engine: it attracts smallholder and beginner farmers because it's free or inexpensive, and it builds the data and trust that the later phases depend on.
2. **Phase 2 — Monetization (premium tier).** Premium analytics, predictive health monitoring, smart recommendations, a marketplace, and expert consultations. This is where subscription revenue, marketplace take-rate, and consultation fees turn the free base into a business.
3. **Phase 3 — Smart Aquaculture (hardware upgrade).** IoT sensors, water probes, **Omni Drone integration**, a live digital twin (**PondTwin**), and an enterprise dashboard. This is the automated, real-time monitoring layer for commercial and enterprise farms that have outgrown manual logging — hardware sold as an upgrade to an existing platform relationship, not as the product itself.

The deep engineering content in this repository — the OmniDrone's reeled probe, multispectral scan, dispensing system, and the "probe and camera are one instrument" self-calibration argument — lives entirely inside **Phase 3**. It is still the most defensible, most technically rigorous part of the story; it is just no longer the whole story.

---

## Start here

1. **`manifest.json`** — the machine-readable index. A webpage should fetch this first, then lazy-load sections from `index.files[]` by `id`.
2. **`data/00_meta/schema-registry.json`** — the shape of every recurring object.
3. **`data/00_meta/glossary.json`** — the controlled vocabulary, including the Phase 1/2/3 product terms.

## The 14 sections

| # | Section | What's in it |
|---|---------|--------------|
| 00 | Meta | Schema, glossary, data dictionary, changelog |
| 01 | Company | Profile, brand system, team, three-phase roadmap |
| 02 | Problem | Statement and taxonomy spanning all three phases: the guidance gap (Phase 1), the scaling gap (Phase 2), the coverage gap (Phase 3) |
| 03 | Market | FAO statistics, layered software+hardware TAM/SAM/SOM, competitors (software and hardware), personas, SWOT/Porter/PESTEL |
| 04 | Solution | Platform overview across all three phases, value proposition, use cases, and — nested under Phase 3 — the OmniDrone ConOps |
| 05 | Hardware (Phase 3) | Airframe, winch, sensors, dispensing, power budget, dock, BOM |
| 06 | Software | App/platform architecture spanning Phase 1-2 (assistant, community, marketplace) and Phase 3 (telemetry, digital twin, dashboard) |
| 07 | Research | Literature review, thematic study collections mapped to the phase(s) they ground, gaps, framework, methodology |
| 08 | Operations | Deployment, maintenance, risk register (FMEA, now including software risks), training — across all three phases |
| 09 | Compliance | Aviation/fisheries law (Phase 3), data privacy (all phases), water quality standards, biosecurity |
| 10 | Business | Model canvas, freemium/subscription/marketplace pricing, unit economics, financials, funding ask, GTM |
| 11 | Impact | SDG alignment, environmental, social & economic impact per phase |
| 12 | Datasets | KPI definitions (SaaS + hardware), sample telemetry, sample twin state, chart payloads |
| 13 | Pitch | Deck outline, elevator pitches, FAQ/objections, thesis outline — all built around the three-phase narrative |

---

## ⚠️ The one thing every reader must understand: **provenance**

Every quantitative field carries a `provenance` tag. **Never cite a figure without checking it.**

| Tag | Meaning |
|-----|---------|
| `verified_external` | From a named third-party source (FAO, World Bank, journal). Safe to cite *with attribution*. |
| `derived_calculation` | Computed by AquaVision from verified inputs. Safe if you state the assumptions. |
| `modeled_projection` | A forward-looking model. Present as *"we project"*, never *"studies show"*. |
| `design_target` | An engineering or product goal not yet measured. A target, not an achievement. |
| `illustrative_synthetic` | **Fabricated sample data.** Describes no real pond or farmer. Exists only so the webpage renders. **Never use as evidence.** |
| `assumption` | A stated planning assumption awaiting validation. |

The webpage **must render a visible badge** for anything that isn't `verified_external`, and an unmissable warning for `illustrative_synthetic`. The badge palette is in `data/01_company/brand-identity.json`.

---

## What this repository deliberately does NOT contain

Phase 1/2 has no built app and no users yet; Phase 3 is a **TRL 3** hardware concept — **nothing has flown, and nothing has shipped.** In keeping with that, the repository refuses to fabricate:

- **No invented users, installs, or traction.** `data/10_business/traction.json` is honestly empty across all three phases.
- **No fabricated field results.** The results chapter and sample-data files are labelled synthetic.
- **No fabricated market size.** `market-sizing` gives the *method* and names the missing inputs, for both the software and hardware layers.
- **No hockey-stick.** `financial-projections` is a milestone-gated spend plan across the three phases, not a revenue forecast.
- **No unearned conversion assumptions.** Free-to-paid conversion, activation, and churn rates are tagged `assumption`/`modeled_projection` and flagged as unmeasured, exactly like the hardware performance targets always were.

The wager throughout: **rigorous honesty is more fundable — and more defensible in a thesis — than polished optimism.** Files carry `honest_note`, `caveat`, and `the_hard_truth` fields; those usually hold the important part. Don't hide them in the UI.

---

## Highest-priority gaps to fill before external use

1. **BFAR Philippine Fisheries Profile** — operator counts. Blocks all market sizing.
2. **Real freemium-agtech benchmarks** (activation, free-to-paid conversion, churn) — the Phase 1/2 business model has no comparable-market anchor yet.
3. **Verify every bibliography entry** — zero sources have been opened; details came from search summaries.
4. **Species-specific water quality thresholds** — current values are indicative placeholders that drive Phase 3 alert logic.
5. **Confirm the CAAP BVLOS/night-ops pathway and the 7 kg bracket** directly — the Phase 3 business model and airframe depend on it.
6. **Real BOM quotes, starting with the sonde** — blocks Phase 3 unit economics.

See `data/00_meta/changelog.json` for the full known-gaps list and `data/07_research/references-bibliography.json` for the citation verification queue.

---

## Assets

`photo_2026-07-17_13-51-55.jpg` (full logo), `photo_2026-07-17_13-52-22.jpg` (mark), `photo_2026-07-17_13-52-27.jpg` (product render, Phase 3 hardware). A production site should move these to `assets/images/`.

*This repository was drafted with AI assistance from the founding concept. Every `verified_external` claim still needs its source opened; every `assumption` still needs testing. It is a rigorous starting scaffold, not a finished record.*
