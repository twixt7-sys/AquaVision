import { navigate } from '../../router.js';
import { getChart } from '../../data/charts.js';
import ChartFigure from '../../shared/charts/ChartFigure.jsx';
import StatTile from '../../shared/components/StatTile.jsx';
import ProvenanceBadge from '../../shared/components/ProvenanceBadge.jsx';
import KeyHint from '../../shared/components/KeyHint.jsx';

// ---- small slide helpers ----
const Lead = ({ children }) => (
  <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text)', maxWidth: 780 }}>{children}</p>
);
const Cols = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, margin: '16px 0' }}>{children}</div>
);
const MiniCard = ({ title, children, accent }) => (
  <div className="card" style={{ borderTop: `3px solid ${accent || 'var(--av-current)'}` }}>
    <h4 style={{ marginBottom: 6 }}>{title}</h4>
    <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>{children}</p>
  </div>
);
const Chart = ({ id }) => <ChartFigure doc={getChart(id)} showHeader={false} />;
const DemoJump = ({ to, label }) => (
  <div className="row" style={{ gap: 10, marginTop: 12 }}>
    <button className="btn btn-sm" onClick={() => navigate(to)}>▤ {label}</button>
    <KeyHint keys="D" label="jump to live demo" />
  </div>
);

// ---- the 16 slides ----
function S01() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 20 }}>
      <img src="/assets/logo-mark.jpg" alt="AquaVision mark" style={{ width: 150, borderRadius: 18, marginBottom: 16 }} />
      <p style={{ fontSize: 'var(--fs-2xl)', fontFamily: 'var(--font-display)', color: 'var(--heading)', maxWidth: 760, margin: '0 auto' }}>
        “We meet fish farmers where they are — from their first pond to their first drone.”
      </p>
      <p className="muted" style={{ letterSpacing: '.24em', textTransform: 'uppercase', fontSize: 'var(--fs-sm)', marginTop: 14 }}>
        Fisheries · Aquaculture · Technology
      </p>
    </div>
  );
}

function S02() {
  return (
    <>
      <Lead>
        In 2022, aquaculture passed capture fisheries for the first time — <b>51% of the world's aquatic animal
        production</b>. The centre of the industry is now a farmed, instrumentable system, and almost none of it is
        digitally recorded at any price point.
      </Lead>
      <Chart id="chart-global-production" />
    </>
  );
}

function S03() {
  return (
    <>
      <Lead>Every farmer is underserved — differently, by stage. Leading with a $20k drone answers only the last one, for a customer who already trusts you. That's backwards for a company with no customers yet.</Lead>
      <Cols>
        <MiniCard title="The beginner" accent="var(--av-ok)">No guidance, keeps bad paper records. Needs help getting started — and can't pay for it.</MiniCard>
        <MiniCard title="The growing farm" accent="var(--av-advisory)">Guesses because it has outgrown a notebook. Wants to know what's coming, not just react.</MiniCard>
        <MiniCard title="The commercial operator" accent="var(--av-warning)">Can't see the 3D chemical environment that kills stock overnight.</MiniCard>
      </Cols>
      <Chart id="chart-do-diel-cycle" />
    </>
  );
}

function S04() {
  return (
    <>
      <Lead>The spine, shown once: a free app widens the top of the funnel, premium monetizes the middle, and hardware deepens revenue at the bottom. Everything after this slide is that spine unpacked.</Lead>
      <Chart id="chart-three-phase-funnel" />
    </>
  );
}

function S05() {
  const features = ['AI farming assistant', 'Guided farm setup', 'Photo disease identification', 'Water-quality logging', 'Feeding schedules', 'Community & learning'];
  return (
    <>
      <Lead>Free or near-free on purpose — the acquisition and data-accumulation engine. Smallholders are the top of the funnel now, not a deferred segment.</Lead>
      <Cols>
        {features.map((f) => <MiniCard key={f} title={f}>Shipped as a real product for a real audience, evaluated on its own honest terms.</MiniCard>)}
      </Cols>
      <DemoJump to="/demo/free/home" label="Open the free app" />
    </>
  );
}

function S06() {
  return (
    <>
      <Lead>Premium turns Phase 1's logged history into revenue: predictive health alerts trained on the farmer's own data, smart recommendations, a marketplace, and paid expert consultations. This is where AquaVision becomes a subscription-plus-take-rate business.</Lead>
      <Chart id="chart-phase-revenue-mix" />
      <DemoJump to="/demo/premium/analytics" label="Open premium analytics" />
    </>
  );
}

function S07() {
  const fns = ['Profile the water column at depth', 'Scan the surface (multispectral + thermal)', 'Dispense feed / lime / treatment', 'Transmit to the platform'];
  return (
    <>
      <Lead>For farms that have outgrown even premium-software tracking: IoT probes, the OmniDrone, and the PondTwin digital twin — sold as an upgrade into a customer the platform already knows.</Lead>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
        <img src="/assets/drone-render.jpg" alt="OmniDrone render" style={{ width: '100%', borderRadius: 14, border: '1px solid var(--border)' }} />
        <ul style={{ fontSize: 'var(--fs-base)' }}>
          {fns.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
      <DemoJump to="/demo/enterprise/pondtwin" label="Open the PondTwin" />
    </>
  );
}

function S08() {
  return (
    <>
      <Lead>Two insights, stacked.</Lead>
      <Cols>
        <MiniCard title="Engineering — one instrument" accent="var(--av-current)">
          The probe and the camera are one instrument. The drone carries its own ground truth and calibrates its own imagery in a single sortie. Nobody else does this. Anyone can fly a camera; calibrated depth chemistry from a hover is genuinely hard.
        </MiniCard>
        <MiniCard title="Business — the moat ships first" accent="var(--av-target-purple)">
          By the time a farm needs the hardware, we already hold years of its own water and production history from Phases 1–2. The digital twin starts calibrated, not cold. The data moat is built before the hardware ships.
        </MiniCard>
      </Cols>
    </>
  );
}

function S09() {
  const steps = [
    { when: 'Free tier', what: 'A beginner logs feedings by phone photo and gets disease-ID suggestions.' },
    { when: 'Premium', what: 'The farm outgrows notebook tracking and wants predictive alerts and a marketplace.' },
    { when: 'Hardware', what: "She's running an estate no one can walk in a day, and adds the OmniDrone + IoT sensors." },
  ];
  return (
    <>
      <Lead>Follow one farmer across the funnel. Note: this is a storyboard, not a testimonial — none of it has happened yet.</Lead>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
        {steps.map((s, i) => (
          <div key={i} className="card">
            <div className="section-title">{i + 1} · {s.when}</div>
            <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>{s.what}</p>
          </div>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 12, fontSize: 'var(--fs-sm)' }}>
        <ProvenanceBadge type="design_target" /> &nbsp;Storyboard — illustrative sequence, not a recorded event.
      </p>
    </>
  );
}

function S10() {
  const rungs = [
    { phase: 'Phase 1', claim: 'No ROI pitch — an activation one. It costs the farmer nothing.' },
    { phase: 'Phase 2', claim: 'Verifiable savings: feed cost via FCR, time saved over manual records.' },
    { phase: 'Phase 3', claim: 'Aeration-electricity savings: metered, budgeted, verifiable in one cycle — without believing our modelling.' },
  ];
  return (
    <>
      <Lead>At no phase do we lead with the least verifiable claim. We lead with what a farmer can check.</Lead>
      <div className="stack" style={{ gap: 10, marginTop: 12 }}>
        {rungs.map((r) => (
          <div key={r.phase} className="card row" style={{ gap: 14 }}>
            <span className="pill" style={{ background: 'var(--av-ocean)', color: 'var(--av-white)' }}>{r.phase}</span>
            <span style={{ fontSize: 'var(--fs-base)' }}>{r.claim}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function S11() {
  return (
    <>
      <Lead>Two markets, stacked — a broad Phase 1/2 software market and a narrower Phase 3 hardware market nested inside it. We show the method and the missing input for both, rather than a fabricated number for either.</Lead>
      <Chart id="chart-market-sizing" />
    </>
  );
}

function S12() {
  return (
    <>
      <Lead>Two competitive sets, honestly. We win on aquaculture-specific depth and an upgrade path; we lose on brand breadth, continuity, weather, and cost. Volunteering both is what wins trust.</Lead>
      <Chart id="chart-manual-vs-omnidrone" />
    </>
  );
}

function S13() {
  return (
    <>
      <Lead>Two honest zeros, not one. Owning both is the credibility move of the whole deck.</Lead>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(200px, 260px))', gap: 16, margin: '10px 0 18px' }}>
        <StatTile label="App users" value="0" status="no_data" provenance="verified_external" footnote="Pre-launch. Nothing built." />
        <StatTile label="Hardware readiness" value="TRL 3" status="advisory" provenance="design_target" footnote="Analytical proof of concept. Nothing flown." />
      </div>
      <Chart id="chart-tech-readiness" />
    </>
  );
}

function S14() {
  const risks = [
    { r: 'Unproven free-to-paid conversion', m: "Phase 1 exists to measure it, cheaply, before any drone is built." },
    { r: 'No track record to trust', m: 'Narrow checkable claims, exportable data, community-led growth.' },
    { r: '“Just another farm app”', m: 'Aquaculture-specific depth + an upgrade path a generic app has no reason to build.' },
    { r: 'BVLOS dependency (Phase 3)', m: 'Engaging CAAP from Phase 0; VLOS fallback economics modelled.' },
    { r: 'Weather grounding (Phase 3)', m: 'We measure the loaded gun in the days before, not during the storm.' },
    { r: 'Unproven unit economics', m: 'Milestone-gated; Phase 3.0 can trigger an honest stop.' },
  ];
  return (
    <>
      <Lead>The risks we're not hiding — each with a mitigation. This slide is the deck's spine.</Lead>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 12 }}>
        {risks.map((x) => (
          <div key={x.r} className="card" style={{ borderLeft: '3px solid var(--av-warning)' }}>
            <b style={{ fontSize: 'var(--fs-sm)' }}>{x.r}</b>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: 'var(--fs-sm)' }}>{x.m}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function S15() {
  return (
    <>
      <Lead>Fund Phase 1 — building and launching the free app is the cheapest way to de-risk the whole thesis. A software funnel is testable in months, and it can honestly trigger a stop before a single drone is built. Phase 3 R&D continues in parallel at low burn. Milestone-gated tranches, not a revenue forecast.</Lead>
      <Chart id="chart-financial-projection" />
    </>
  );
}

function S16() {
  return (
    <>
      <Lead>Real founder credentials + the software and hardware timing converging. Then the mission: every farmer given the same quality of information, not just the ones who can afford a drone.</Lead>
      <div className="card" style={{ borderColor: 'var(--av-critical)', marginTop: 8 }}>
        <div className="section-title" style={{ color: 'var(--av-critical)' }}>Placeholder — do not fabricate</div>
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
          The team slide MUST use real, verifiable biographies written by the founders. Fabricated credentials end raises.
          This prototype deliberately leaves the bios blank rather than invent them.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
        {['Founder', 'Founder', 'Advisor'].map((role, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', color: 'var(--text-2)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-2)', margin: '0 auto 8px' }} />
            <b>{role}</b>
            <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-xs)' }}>Real bio required</p>
          </div>
        ))}
      </div>
    </>
  );
}

// registry: n, title, Component, source (for footnote), demo jump target
export const SLIDES = [
  { n: 1, title: 'Title', Component: S01, source: 'company-profile.json' },
  { n: 2, title: 'The Inflection', Component: S02, source: 'industry-statistics.json' },
  { n: 3, title: "The Problem, and Why Hardware-First Doesn't Solve It", Component: S03, source: ['problem-statement.json', 'customer-personas.json'] },
  { n: 4, title: 'The Platform — Three Phases', Component: S04, source: 'solution-overview.json' },
  { n: 5, title: 'Phase 1 — Foundation (Free App)', Component: S05, source: 'solution-overview.json', demo: '/demo/free/home' },
  { n: 6, title: 'Phase 2 — Monetization (Premium)', Component: S06, source: 'pricing-revenue.json', demo: '/demo/premium/analytics' },
  { n: 7, title: 'Phase 3 — Smart Aquaculture (Hardware)', Component: S07, source: 'solution-overview.json', demo: '/demo/enterprise/pondtwin' },
  { n: 8, title: 'The Insight That Makes It Defensible', Component: S08, source: 'solution-overview.json#/the_architectural_insight' },
  { n: 9, title: "A Day in a Farmer's Life", Component: S09, source: 'concept-of-operations.json#/a_day_in_the_life' },
  { n: 10, title: 'The Checkable Economics At Every Phase', Component: S10, source: 'value-proposition.json#/the_value_hierarchy' },
  { n: 11, title: 'Market & Beachhead', Component: S11, source: ['industry-statistics.json', 'market-sizing-tam-sam-som.json'] },
  { n: 12, title: 'Competition — Honestly', Component: S12, source: 'competitive-landscape.json' },
  { n: 13, title: 'Where We Actually Are', Component: S13, source: ['company-profile.json', 'traction.json'] },
  { n: 14, title: "The Risks We're Not Hiding", Component: S14, source: ['swot-porter.json', 'risk-register-fmea.json'] },
  { n: 15, title: 'The Ask', Component: S15, source: ['funding-ask.json', 'financial-projections.json'] },
  { n: 16, title: 'Why This Team, Why Now', Component: S16, source: ['company-profile.json', 'team-structure.json'] },
];

export const FIVE_MINUTE_NS = [1, 2, 3, 4, 5, 7, 10, 13, 15];
