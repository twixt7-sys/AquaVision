import { useState } from 'react';
import TopDownMap from './TopDownMap.jsx';
import SliceView from './SliceView.jsx';
import TimeScrub from './TimeScrub.jsx';
import LayerToggles from './LayerToggles.jsx';
import StalenessTag from '../../shared/components/StalenessTag.jsx';
import ProvenanceBadge from '../../shared/components/ProvenanceBadge.jsx';
import { stationStateAt, lastSortieHour, formatHour } from '../../data/twinData.js';

// PondTwin: "3D visualisation with a twin roadmap" (the simulation core does not
// exist yet; REQ-TWIN-006). Leaflet top-down map + vertical slice + time scrub,
// with confidence-based uncertainty rendering as the core honesty feature.
export default function PondTwin() {
  const [hour, setHour] = useState(6);
  const [playing, setPlaying] = useState(false);
  const [selectedCage, setSelectedCage] = useState('SYNTH-C4'); // the warning cage
  const [layers, setLayers] = useState({ measured: true, interpolated: true, confidence: false, operator: false });

  const sortie = lastSortieHour(hour);
  const ageMinutes = Math.round((hour - sortie) * 60);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row wrap" style={{ justifyContent: 'space-between', gap: 8 }}>
        <div>
          <h2 style={{ margin: 0 }}>PondTwin</h2>
          <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
            Leaflet twin map with a roadmap for full 3D. The simulation core does not exist yet.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <ProvenanceBadge type="illustrative_synthetic" />
          <StalenessTag minutes={ageMinutes} verb={`last sortie ${formatHour(((sortie % 24) + 24) % 24)},`} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
        <div className="stack" style={{ gap: 10 }}>
          <div className="section-title">Top-down · surface field (Leaflet)</div>
          <TopDownMap hour={hour} layers={layers} selectedCage={selectedCage} onSelectCage={setSelectedCage} />
        </div>
        <div className="stack" style={{ gap: 10 }}>
          <div className="section-title">Vertical slice · {selectedCage.replace('SYNTH-', '')}</div>
          <div className="card" style={{ padding: 12 }}>
            <SliceView hour={hour} selectedCage={selectedCage} />
          </div>
        </div>
      </div>

      <TimeScrub hour={hour} setHour={setHour} playing={playing} setPlaying={setPlaying} />
      <LayerToggles layers={layers} setLayers={setLayers} />

      <div className="card" style={{ borderLeft: '3px solid var(--av-current)' }}>
        <div className="section-title">Why the far corner looks uncertain</div>
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
          The volume between stations is interpolated. Its opacity falls and its texture roughens as you move away from a
          measured point. The corner with no nearby station (confidence ~0.20) is left almost transparent. A smooth,
          confident gradient over unmeasured water is the most persuasive lie this product could tell, so we refuse to draw one.
          Toggle <b>Confidence field</b> to see the uncertainty directly.
        </p>
      </div>
    </div>
  );
}
