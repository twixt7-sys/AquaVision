import { Pad, ScreenHead } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import { predictiveHealthNotes } from '../../data/demoFixtures.js';

// Predictive health  -  the mechanism in plain sentences ("you logged low DO twice
// and haven't logged since"), never a bare score. It reveals the mechanism; it
// does not "predict" (banned word) and never says the water is "safe".
export default function PredictiveHealth() {
  return (
    <Pad>
      <ScreenHead title="Predictive health" sub="What your logs suggest is coming  -  in plain language" />
      <SampleDataBanner compact />
      <div className="stack" style={{ gap: 12 }}>
        {predictiveHealthNotes.map((n, i) => (
          <div key={i} className="card" style={{ borderLeft: `3px solid ${n.severity === 'advisory' ? 'var(--av-advisory)' : 'var(--av-ok)'}` }}>
            <StatusBadge status={n.severity} />
            <p style={{ margin: '8px 0 6px', fontSize: 'var(--fs-sm)' }}>{n.text}</p>
            <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-xs)' }}>{n.basis}</p>
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 'var(--fs-xs)' }}>
        We show the mechanism and let you judge. We do not give a risk score, and we never tell you the water is safe.
      </p>
    </Pad>
  );
}
