import { Pad, ScreenHead } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { recommendations } from '../../data/demoFixtures.js';

// Each recommendation states the data it was based on — no black-box advice.
export default function Recommendations() {
  return (
    <Pad>
      <ScreenHead title="Recommendations" sub="Each one says what it's based on" />
      <SampleDataBanner compact />
      <div className="stack" style={{ gap: 12 }}>
        {recommendations.map((r, i) => (
          <div key={i} className="card">
            <p style={{ margin: '0 0 6px', fontSize: 'var(--fs-sm)' }}>💡 {r.text}</p>
            <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-xs)' }}>{r.basis}</p>
          </div>
        ))}
      </div>
    </Pad>
  );
}
