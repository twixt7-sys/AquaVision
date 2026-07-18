import ChartFigure from '../shared/charts/ChartFigure.jsx';
import { telemetry } from '../data/index.js';

// History — a time series with event pins (sorties, alerts, feeding). Built from
// the synthetic diel DO series with vline annotations for events.
const diel = telemetry.synthetic_diel_do_profile;

const historyChart = {
  id: 'history-do',
  chart_type: 'line',
  title: 'Surface DO — last 24 hours, with events',
  provenance: 'illustrative_synthetic',
  axes: {
    x: { label: 'Hour of day', unit: 'h', type: 'linear', min: 0, max: 23 },
    y: { label: 'Dissolved oxygen', unit: 'mg/L', type: 'linear', min: 0, max: 13 },
  },
  series: [
    {
      name: 'Surface DO (0.5 m) — SYNTHETIC',
      unit: 'mg/L',
      provenance: 'illustrative_synthetic',
      data: diel.series.map((d) => [d.hour, d.do_mgl]),
    },
  ],
  annotations: [
    { kind: 'vline', value: 5, label: 'Sortie', severity: 'info' },
    { kind: 'vline', value: 11, label: 'Sortie', severity: 'info' },
    { kind: 'vline', value: 17, label: 'Sortie', severity: 'info' },
    { kind: 'hline', value: 3.0, label: 'Sub-lethal stress (indicative)', severity: 'warning' },
    { kind: 'point_label', value: [5, 2.8], label: 'Pre-dawn minimum + alert raised', severity: 'critical' },
  ],
};

const events = [
  { time: '04:52', kind: 'Alert', text: 'Cage 4 bottom anoxic (0.2 mg/L at 6 m).', sev: 'critical' },
  { time: '05:00', kind: 'Sortie', text: 'Pre-dawn profile + surface scan completed.', sev: 'info' },
  { time: '06:30', kind: 'Feeding', text: 'Pond A morning feed confirmed.', sev: 'info' },
  { time: '11:00', kind: 'Sortie', text: 'Midday multispectral scan; calibration panel checked.', sev: 'info' },
];

export default function HistoryView() {
  return (
    <div className="stack" style={{ gap: 16 }}>
      <h2 style={{ margin: 0 }}>History</h2>
      <ChartFigure doc={historyChart} showHeader={false} />
      <div>
        <div className="section-title">Event log</div>
        <div className="stack" style={{ gap: 8 }}>
          {events.map((e, i) => (
            <div key={i} className="row" style={{ gap: 12, borderLeft: `3px solid ${e.sev === 'critical' ? 'var(--av-critical)' : 'var(--av-shallow)'}`, paddingLeft: 12 }}>
              <span className="num" style={{ minWidth: 48 }}>{e.time}</span>
              <span className="pill" style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}>{e.kind}</span>
              <span style={{ fontSize: 'var(--fs-sm)' }}>{e.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
