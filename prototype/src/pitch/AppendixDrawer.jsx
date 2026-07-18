import { useMemo, useState } from 'react';
import { faq, pitchOutline } from '../data/index.js';

// Appendix / FAQ drawer (key A). Turns faq-objections.json into a live, filterable
// Q&A weapon for the judges' round, plus the reserved appendix topics.
const PHASES = [
  { value: 'all', label: 'All' },
  { value: 'phase1-2', label: 'Phase 1/2 (software)' },
  { value: 'phase3', label: 'Phase 3 (hardware)' },
  { value: 'cross-phase', label: 'Cross-phase' },
];

export default function AppendixDrawer({ onClose }) {
  const [phase, setPhase] = useState('all');
  const [open, setOpen] = useState(null);

  const objections = useMemo(
    () => faq.objections.filter((o) => phase === 'all' || o.phase === phase),
    [phase]
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }} onClick={onClose} />
      <aside
        className="hide-scroll"
        style={{
          position: 'relative', width: 560, maxWidth: '100%', height: '100%', overflowY: 'auto',
          background: 'var(--surface)', borderLeft: '1px solid var(--border)', padding: '20px 24px',
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Objections &amp; hard questions</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close (A)</button>
        </div>
        <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
          Honest answers to the questions we know are coming. A defended overclaim is worse than a conceded weakness.
        </p>

        <div className="row wrap" style={{ gap: 6, margin: '10px 0 16px' }}>
          {PHASES.map((p) => (
            <button
              key={p.value}
              className="pill"
              onClick={() => setPhase(p.value)}
              style={{
                cursor: 'pointer', border: '1px solid var(--border)',
                background: phase === p.value ? 'var(--av-ocean)' : 'transparent',
                color: phase === p.value ? 'var(--av-white)' : 'var(--text-2)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="stack" style={{ gap: 8 }}>
          {objections.map((o, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card" style={{ padding: '12px 14px' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ background: 'none', border: 'none', color: 'var(--heading)', textAlign: 'left', cursor: 'pointer', width: '100%', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-base)' }}
                >
                  {isOpen ? '▾ ' : '▸ '}{o.q}
                </button>
                {isOpen && (
                  <div style={{ marginTop: 8 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 'var(--fs-sm)' }}>{o.honest_answer}</p>
                    {o.what_not_to_do && (
                      <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--av-advisory)' }}>
                        <b>What not to do:</b> {o.what_not_to_do}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: 16, borderColor: 'var(--av-current)' }}>
          <div className="section-title">The meta-objection</div>
          <p style={{ margin: '0 0 6px', fontSize: 'var(--fs-sm)' }}><b>{faq.the_meta_objection.q}</b></p>
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>{faq.the_meta_objection.answer}</p>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="section-title">Reserved appendix slides</div>
          <ul style={{ fontSize: 'var(--fs-sm)' }}>
            {pitchOutline.the_appendix_slides.slides.map((s, i) => (
              <li key={i}><b>{s.topic}</b> — <span className="muted">{s.for}</span></li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
