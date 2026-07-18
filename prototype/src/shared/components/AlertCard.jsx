import StatusBadge from './StatusBadge.jsx';
import ProvenanceBadge from './ProvenanceBadge.jsx';

// Alert card — the plain-sentence alert format from dashboard-spec.json.
// An alert must explain itself: what was measured, where, when, which threshold
// (and its source), what we DON'T know, and a concrete action. NEVER a bare score
// ("Risk: 78/100"). The message itself is a full sentence.
export default function AlertCard({ alert }) {
  if (!alert) return null;
  const {
    severity = 'warning',
    unit_id,
    message_example,
    message,
    provenance,
    whats_unknown,
    action,
  } = alert;
  const body = message || message_example;
  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${severity === 'critical' ? 'var(--av-critical)' : 'var(--av-warning)'}`,
      }}
    >
      <div className="row wrap" style={{ gap: 8, marginBottom: 8 }}>
        <StatusBadge status={severity} />
        {unit_id && <span className="tag-mono">{unit_id}</span>}
        {provenance && <ProvenanceBadge type={provenance} />}
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 'var(--fs-base)' }}>{body}</p>
      {whats_unknown && (
        <p className="muted" style={{ margin: '0 0 6px', fontSize: 'var(--fs-sm)' }}>
          <b>What we don't know:</b> {whats_unknown}
        </p>
      )}
      {action && (
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--av-current)' }}>
          <b>Suggested action:</b> {action}
        </p>
      )}
    </div>
  );
}
