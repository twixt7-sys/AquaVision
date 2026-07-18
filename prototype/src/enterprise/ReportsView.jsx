import ProvenanceBadge from '../shared/components/ProvenanceBadge.jsx';
import { telemetry } from '../data/index.js';

// Reports — an export preview that KEEPS the QC flags, source_type, and provenance
// columns intact (dashboard-spec.json: manual readings must never be styled like
// sensor readings; QC and provenance travel with the data).
const snap = telemetry.synthetic_multichannel_snapshot.reading;

const rows = [
  { param: 'Dissolved oxygen', value: snap.do_mgl, unit: 'mg/L', source: 'sensor_probe', qc: 'pass' },
  { param: 'Temperature', value: snap.temp_c, unit: '°C', source: 'sensor_probe', qc: 'pass' },
  { param: 'pH', value: snap.ph, unit: '', source: 'sensor_probe', qc: 'pass' },
  { param: 'Turbidity', value: snap.turbidity_ntu, unit: 'NTU', source: 'sensor_probe', qc: 'suspect' },
  { param: 'Chlorophyll-a', value: snap.chla_ugl, unit: 'µg/L', source: 'derived_index', qc: 'pass' },
  { param: 'Un-ionised ammonia', value: snap.nh3_un_ionised_mgl, unit: 'mg/L', source: 'derived_index', qc: 'pass' },
];

const qcColor = { pass: 'var(--av-ok)', suspect: 'var(--av-advisory)', fail: 'var(--av-critical)' };

export default function ReportsView() {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="row wrap" style={{ justifyContent: 'space-between', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Reports</h2>
        <button className="btn btn-ghost btn-sm">⤓ Export CSV</button>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
        Every value carries its source and QC flag. A suspect reading is never quietly dropped or smoothed into a clean number.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Parameter</th><th className="num">Value</th><th>Source</th><th>QC</th><th>Provenance</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.param}>
                <td>{r.param}</td>
                <td className="num">{r.value} {r.unit}</td>
                <td><span className="tag-mono">{r.source}</span></td>
                <td><span style={{ color: qcColor[r.qc], fontWeight: 600 }}>{r.qc}</span></td>
                <td><ProvenanceBadge type="illustrative_synthetic" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
