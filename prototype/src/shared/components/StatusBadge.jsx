// Status badge — the five states from dashboard-spec.json.
// Rules honoured: status is NEVER colour-only (always icon + text label); "No Data"
// is styled as an absence (hollow, dashed) and must never read as "safe"/green.
const STATES = {
  nominal: { icon: '✓', label: 'Nominal', color: 'var(--av-ok)', hollow: false },
  advisory: { icon: '!', label: 'Advisory', color: 'var(--av-advisory)', hollow: false },
  warning: { icon: '▲', label: 'Warning', color: 'var(--av-warning)', hollow: false },
  critical: { icon: '⚠', label: 'Critical', color: 'var(--av-critical)', hollow: false },
  no_data: { icon: '⌀', label: 'No Data', color: 'var(--av-unknown)', hollow: true },
};

// accept a few aliases used in the data files
const ALIAS = { ok: 'nominal', unknown: 'no_data', 'no-data': 'no_data', nodata: 'no_data' };

export function normalizeStatus(s) {
  const k = String(s || '').toLowerCase().replace(/\s+/g, '_');
  return STATES[k] ? k : ALIAS[k] || 'no_data';
}

export default function StatusBadge({ status, size = 'sm', label }) {
  const key = normalizeStatus(status);
  const s = STATES[key];
  return (
    <span
      className="pill"
      style={{
        color: s.color,
        background: s.hollow ? 'transparent' : `color-mix(in srgb, ${s.color} 16%, transparent)`,
        border: s.hollow ? `1px dashed ${s.color}` : `1px solid color-mix(in srgb, ${s.color} 30%, transparent)`,
        fontSize: size === 'lg' ? 'var(--fs-sm)' : 'var(--fs-xs)',
        padding: size === 'lg' ? '5px 12px' : '4px 10px',
      }}
    >
      <span aria-hidden="true">{s.icon}</span>
      {label || s.label}
    </span>
  );
}

export const STATUS_STATES = STATES;
