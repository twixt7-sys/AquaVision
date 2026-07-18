// Layer toggles. The simulated layer is present but deliberately empty — in v1
// PondTwin has no simulation core, and that honesty is itself a talking point.
const LAYERS = [
  { key: 'measured', label: 'Measured stations', hint: 'solid, sharp' },
  { key: 'interpolated', label: 'Interpolated field', hint: 'fades with distance' },
  { key: 'confidence', label: 'Confidence field', hint: 'show the uncertainty directly' },
  { key: 'operator', label: 'Operator-supplied', hint: 'testimony, not measurement' },
];

export default function LayerToggles({ layers, setLayers }) {
  const toggle = (k) => setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
  return (
    <div className="card" style={{ padding: '12px 14px' }}>
      <div className="section-title">Layers</div>
      <div className="stack" style={{ gap: 8 }}>
        {LAYERS.map((l) => (
          <label key={l.key} className="row" style={{ gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!layers[l.key]} onChange={() => toggle(l.key)} style={{ accentColor: 'var(--av-current)' }} />
            <span style={{ fontSize: 'var(--fs-sm)' }}>{l.label}</span>
            <span className="grow" />
            <span className="tag-mono" style={{ fontSize: 10 }}>{l.hint}</span>
          </label>
        ))}
        {/* simulated — disabled on purpose */}
        <label className="row" style={{ gap: 8, opacity: 0.6 }}>
          <input type="checkbox" disabled />
          <span style={{ fontSize: 'var(--fs-sm)' }}>Simulated</span>
          <span className="grow" />
          <span className="tag-mono" style={{ fontSize: 10, color: 'var(--av-unknown)' }}>does not exist yet</span>
        </label>
      </div>
      <p className="muted" style={{ margin: '8px 0 0', fontSize: 'var(--fs-xs)' }}>
        The simulation layer is empty by design. When it exists it will render in a visually distinct channel, never blended with measured data.
      </p>
    </div>
  );
}
