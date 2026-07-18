import { useState } from 'react';
import TopDownMap from './pondtwin/TopDownMap.jsx';

// Map view — the calibrated concentration field with its calibration quality made
// visible ON the map (n and R² printed, and honestly labelled as illustrative).
// Uncertainty layer toggle defaults on.
export default function MapView() {
  const [hour] = useState(6);
  const [showConfidence, setShowConfidence] = useState(false);
  const layers = { measured: true, interpolated: true, confidence: showConfidence, operator: false };

  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="row wrap" style={{ justifyContent: 'space-between', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Map</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowConfidence((v) => !v)}>
          {showConfidence ? 'Show concentration' : 'Show confidence'}
        </button>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--av-advisory)' }}>
        <div className="row wrap" style={{ gap: 16, fontSize: 'var(--fs-sm)' }}>
          <span><b>Calibration quality</b></span>
          <span className="num">n = 3 stations</span>
          <span className="num">R² = 0.71 (illustrative)</span>
          <span className="muted">The optical field is calibrated by the probe. With only 3 in-situ points, confidence away from them is low — and we show it.</span>
        </div>
      </div>

      <TopDownMap hour={hour} layers={layers} selectedCage={null} onSelectCage={() => {}} />
    </div>
  );
}
