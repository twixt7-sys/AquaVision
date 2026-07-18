import { Pad, ScreenHead } from './_kit.jsx';
import { consultationThread } from '../../data/demoFixtures.js';

// Paid expert consultation  -  booking + a message thread with a real human. The
// disease-ID and assistant flows route here when confidence is low.
export default function Consultation() {
  const { expert, booked, messages } = consultationThread;
  return (
    <Pad>
      <ScreenHead title="Expert consultation" sub="A human in the loop, by design" />
      <div className="card" style={{ borderColor: 'var(--av-current)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <b style={{ fontSize: 'var(--fs-sm)' }}>{expert}</b>
          <span className="pill" style={{ background: 'color-mix(in srgb, var(--av-ok) 14%, transparent)', color: 'var(--av-ok)' }}>Booked</span>
        </div>
        <span className="tag-mono">{booked}</span>
      </div>
      <div className="stack" style={{ gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '85%', background: m.from === 'user' ? 'var(--av-ocean)' : 'var(--surface-2)', color: m.from === 'user' ? 'var(--av-white)' : 'var(--text)', borderRadius: 14, padding: '10px 13px', fontSize: 'var(--fs-sm)' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </Pad>
  );
}
