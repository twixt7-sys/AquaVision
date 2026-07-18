import { useState } from 'react';
import { Pad, ScreenHead } from './_kit.jsx';

// Guided farm setup. Builds farm_profile / pond_profile fields from
// telemetry-schema.json. Four steps; the demo lets you page through them.
const STEPS = [
  {
    title: 'Your farm',
    fields: [
      { label: 'Farm name', value: 'Riverside Fishpond' },
      { label: 'Location', value: 'Taal Lake, Batangas' },
      { label: 'Number of ponds / cages', value: '2' },
    ],
  },
  {
    title: 'Your first pond',
    fields: [
      { label: 'Pond name', value: 'Pond A' },
      { label: 'Species', value: 'Tilapia' },
      { label: 'System type', value: 'Lake cage' },
      { label: 'Approx. surface area', value: '120 m²' },
    ],
  },
  {
    title: 'How you monitor now',
    fields: [
      { label: 'Water testing method', value: 'Test strips' },
      { label: 'Records kept', value: 'Notebook' },
      { label: 'Aeration', value: 'One paddle-wheel' },
    ],
  },
  {
    title: 'You’re set up',
    fields: [],
    done: true,
  },
];

export default function SetupWizard() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  return (
    <Pad>
      <ScreenHead title="Farm setup" sub={`Step ${step + 1} of ${STEPS.length}`} />
      <div className="row" style={{ gap: 4 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? 'var(--av-current)' : 'var(--surface-2)' }} />
        ))}
      </div>
      <h4 style={{ margin: 0 }}>{s.title}</h4>
      {s.done ? (
        <div className="card" style={{ textAlign: 'center', borderColor: 'var(--av-ok)' }}>
          <div style={{ fontSize: 30, color: 'var(--av-ok)' }}>✓</div>
          <p style={{ margin: '6px 0 0', fontSize: 'var(--fs-sm)' }}>
            Your farm and first pond are ready. You can start logging readings and feeding right away — for free.
          </p>
        </div>
      ) : (
        <div className="stack" style={{ gap: 10 }}>
          {s.fields.map((f) => (
            <label key={f.label} className="stack" style={{ gap: 4 }}>
              <span className="tag-mono">{f.label}</span>
              <div className="card" style={{ padding: '10px 12px', background: 'var(--surface-2)' }}>{f.value}</div>
            </label>
          ))}
        </div>
      )}
      <div className="row" style={{ gap: 8, marginTop: 'auto' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setStep((v) => Math.max(0, v - 1))} disabled={step === 0}>Back</button>
        <div className="grow" />
        <button className="btn btn-sm" onClick={() => setStep((v) => Math.min(STEPS.length - 1, v + 1))} disabled={step === STEPS.length - 1}>
          {step === STEPS.length - 2 ? 'Finish' : 'Next'}
        </button>
      </div>
    </Pad>
  );
}
