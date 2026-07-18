# AquaVision OmniDrone — Knowledge Repository

**Fisheries • Aquaculture • Technology**

This repository is the single source of truth for the **OmniDrone** concept: a pitch kit, a thesis kit, an engineering specification, a research corpus, and a set of chart-ready datasets — all as structured JSON, designed to be read by a custom HTML webpage.

---

## What the OmniDrone is

An autonomous multirotor that flies over aquaculture sites and:

1. **Profiles** the water column at depth with a winch-deployed multiparameter sonde (dissolved oxygen, temperature, pH, ammonia, turbidity, chlorophyll, ORP, conductivity).
2. **Scans** the surface for mortalities, distressed fish, pollution, and blooms.
3. **Dispenses** feed, lime, conditioners, or treatments via a metered carriage system.
4. **Transmits** everything to the AquaVision platform, which fuses point profiles with aerial imagery, runs AI/ML, and drives a live **digital twin** of the pond.

The defensible idea at the centre: **the probe and the camera are one instrument** — the drone carries its own ground truth, so it calibrates its own aerial imagery in a single sortie. That closes the calibration gap the UAV water-quality literature keeps identifying.

---

## Start here

1. **`manifest.json`** — the machine-readable index. A webpage should fetch this first, then lazy-load sections from `index.files[]` by `id`.
2. **`data/00_meta/schema-registry.json`** — the shape of every recurring object.
3. **`data/00_meta/glossary.json`** — the controlled vocabulary.

## The 14 sections

| # | Section | What's in it |
|---|---------|--------------|
| 00 | Meta | Schema, glossary, data dictionary, changelog |
| 01 | Company | Profile, brand system, team, roadmap |
| 02 | Problem | Statement, taxonomy (62 problems), stakeholders, incidents, cost model |
| 03 | Market | FAO statistics, TAM/SAM/SOM method, competitors, personas, SWOT/Porter/PESTEL |
| 04 | Solution | Overview, value proposition, use cases, mission profiles, ConOps |
| 05 | Hardware | Airframe, winch, sensors, dispensing, power budget, dock, BOM |
| 06 | Software | Architecture, pipeline, model cards, digital twin, telemetry, API, dashboard |
| 07 | Research | Literature review, bibliography, 8 thematic study collections, gaps, framework, methodology |
| 08 | Operations | Deployment playbook, maintenance, risk register (FMEA), training |
| 09 | Compliance | Aviation/fisheries law, water quality standards, biosecurity, ethics & privacy |
| 10 | Business | Model canvas, pricing, unit economics, financials, funding ask, GTM, traction |
| 11 | Impact | SDG alignment, environmental, social & economic |
| 12 | Datasets | KPI definitions, sample telemetry, sample twin state, 9 chart payloads |
| 13 | Pitch | Deck outline, elevator pitches, FAQ/objections, thesis outline |

---

## ⚠️ The one thing every reader must understand: **provenance**

Every quantitative field carries a `provenance` tag. **Never cite a figure without checking it.**

| Tag | Meaning |
|-----|---------|
| `verified_external` | From a named third-party source (FAO, World Bank, journal). Safe to cite *with attribution*. |
| `derived_calculation` | Computed by AquaVision from verified inputs. Safe if you state the assumptions. |
| `modeled_projection` | A forward-looking model. Present as *"we project"*, never *"studies show"*. |
| `design_target` | An engineering goal not yet measured. A target, not an achievement. |
| `illustrative_synthetic` | **Fabricated sample data.** Describes no real pond. Exists only so the webpage renders. **Never use as evidence.** |
| `assumption` | A stated planning assumption awaiting validation. |

The webpage **must render a visible badge** for anything that isn't `verified_external`, and an unmissable warning for `illustrative_synthetic`. The badge palette is in `data/01_company/brand-identity.json`.

---

## What this repository deliberately does NOT contain

This is a **TRL 3** concept: **nothing has flown.** In keeping with that, the repository refuses to fabricate:

- **No invented traction.** `data/10_business/traction.json` is honestly empty.
- **No fabricated field results.** The results chapter and sample-data files are labelled synthetic.
- **No fabricated market size.** `market-sizing` gives the *method* and names the missing inputs.
- **No hockey-stick.** `financial-projections` is a milestone-gated spend plan, not a revenue forecast.

The wager throughout: **rigorous honesty is more fundable — and more defensible in a thesis — than polished optimism.** Files carry `honest_note`, `caveat`, and `the_hard_truth` fields; those usually hold the important part. Don't hide them in the UI.

---

## Highest-priority gaps to fill before external use

1. **BFAR Philippine Fisheries Profile** — operator counts. Blocks all market sizing.
2. **Verify every bibliography entry** — zero sources have been opened; details came from search summaries.
3. **Species-specific water quality thresholds** — current values are indicative placeholders that drive alert logic.
4. **Confirm the CAAP BVLOS/night-ops pathway and the 7 kg bracket** directly — the business model and airframe depend on it.
5. **Real BOM quotes, starting with the sonde** — blocks the unit economics.

See `data/00_meta/changelog.json` for the full known-gaps list and `data/07_research/references-bibliography.json` for the citation verification queue.

---

## Assets

`photo_2026-07-17_13-51-55.jpg` (full logo), `photo_2026-07-17_13-52-22.jpg` (mark), `photo_2026-07-17_13-52-27.jpg` (product render). A production site should move these to `assets/images/`.

*This repository was drafted with AI assistance from the founding concept. Every `verified_external` claim still needs its source opened; every `assumption` still needs testing. It is a rigorous starting scaffold, not a finished record.*
