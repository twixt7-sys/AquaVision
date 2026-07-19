import { useState } from 'react';
import ChartFigure from '../shared/charts/ChartFigure.jsx';
import Tabs from '../shared/components/Tabs.jsx';
import StalenessTag from '../shared/components/StalenessTag.jsx';
import { depthProfileChart, measuredStations, stationStateAt } from '../data/twinData.js';

// Vertical profile  -  depth axis runs DOWNWARD (never inverted). Shows the loaded
// gun: a survivable surface hiding anoxic bottom water. One tab is the published
// ST-04 profile; the others are derived from station summaries (labelled).
const TIMES = [
  { value: 5, label: 'Pre-dawn (05:00)' },
  { value: 14, label: 'Afternoon (14:00)' },
];

export default function ProfileView() {
  const [stationId, setStationId] = useState('SYNTH-ST-04');
  const [hour, setHour] = useState(5);
  const doc = depthProfileChart(stationId, hour);
  const st = stationStateAt(hour).find((s) => s.station_id === stationId);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <h2 style={{ margin: 0 }}>Profile view</h2>
      <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
        Depth increases downward  -  we never invert the axis to make a chart look conventional. Below the thermocline the
        water can be anoxic while the surface still reads survivable.
      </p>

      <div className="row wrap" style={{ gap: 12 }}>
        <Tabs
          tabs={measuredStations.map((m) => ({ value: m.station_id, label: m.station_id.replace('SYNTH-', '') }))}
          active={stationId}
          onChange={setStationId}
          size="sm"
        />
        <Tabs tabs={TIMES} active={hour} onChange={setHour} size="sm" />
      </div>

      {st && (
        <div className="row wrap" style={{ gap: 12 }}>
          <StalenessTag minutes={st.ageMinutes} verb="profiled" />
          {stationId !== 'SYNTH-ST-04' && (
            <span className="tag-mono" style={{ color: 'var(--av-advisory)' }}>
              derived profile  -  reconstructed from surface/bottom/thermocline summary
            </span>
          )}
        </div>
      )}

      <ChartFigure doc={doc} showHeader={false} />
    </div>
  );
}
