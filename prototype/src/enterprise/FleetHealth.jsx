import StatusBadge from '../shared/components/StatusBadge.jsx';
import StalenessTag from '../shared/components/StalenessTag.jsx';

// Fleet health — aircraft / dock / sonde status, calibration due dates, and the
// per-site sonde assignment (biosecurity: the drone travels, the probe doesn't).
const fleet = [
  { id: 'OmniDrone A-01', kind: 'Aircraft', status: 'nominal', note: 'Charged, ready for the 11:00 sortie.', age: 66 },
  { id: 'OmniDock D-01', kind: 'Dock', status: 'nominal', note: 'Rinse + decontamination cycle complete.', age: 66 },
  { id: 'Sonde S-01', kind: 'Sonde', status: 'advisory', note: 'Calibration due in 2 days. Dedicated to SYNTH-LAKE-01.', age: 66 },
  { id: 'Sonde S-02', kind: 'Sonde', status: 'no_data', note: 'Not reporting since last swap — treat as unknown, not idle.', age: null },
];

export default function FleetHealth() {
  return (
    <div className="stack" style={{ gap: 16 }}>
      <h2 style={{ margin: 0 }}>Fleet health</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, alignItems: 'start' }}>
        <img src="/assets/drone-render.jpg" alt="OmniDrone" style={{ width: '100%', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }} />
        <div className="stack" style={{ gap: 10 }}>
          {fleet.map((f) => (
            <div key={f.id} className="card" style={{ padding: '12px 14px' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  <b style={{ fontSize: 'var(--fs-sm)' }}>{f.id}</b>
                  <span className="tag-mono" style={{ marginLeft: 8 }}>{f.kind}</span>
                </div>
                <StatusBadge status={f.status} />
              </div>
              <p className="muted" style={{ margin: '4px 0 4px', fontSize: 'var(--fs-sm)' }}>{f.note}</p>
              {f.age != null ? <StalenessTag minutes={f.age} verb="reported" /> : <span className="tag-mono" style={{ color: 'var(--av-unknown)' }}>no report</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--av-current)' }}>
        <div className="section-title">Biosecurity</div>
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
          Each site gets its own dedicated sonde — the drone travels, the probe does not. The dock decontaminates the sonde
          and the full tether length between sorties, and every sonde's movement is logged so an outbreak can be traced.
        </p>
      </div>
    </div>
  );
}
