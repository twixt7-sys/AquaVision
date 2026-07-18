// Provenance badge — 6 types, colors verbatim from brand-identity.json.
// The illustrative_synthetic variant is deliberately loud (it must be impossible
// to mistake sample data for real data).
const META = {
  verified_external: { icon: '✓', label: 'Sourced', color: 'var(--av-ok)' },
  derived_calculation: { icon: '∑', label: 'Calculated', color: 'var(--av-current)' },
  modeled_projection: { icon: '↗', label: 'Projection', color: 'var(--av-advisory)' },
  design_target: { icon: '◎', label: 'Target', color: 'var(--av-target-purple)' },
  illustrative_synthetic: { icon: '⚠', label: 'SAMPLE DATA — NOT REAL', color: 'var(--av-critical)' },
  assumption: { icon: '~', label: 'Assumption', color: 'var(--av-unknown)' },
};

export default function ProvenanceBadge({ type, size = 'sm' }) {
  const m = META[type] || META.assumption;
  const loud = type === 'illustrative_synthetic';
  return (
    <span
      className="pill"
      title={`Provenance: ${type}`}
      style={{
        color: m.color,
        background: `color-mix(in srgb, ${m.color} 15%, transparent)`,
        border: loud ? `1px solid ${m.color}` : '1px solid transparent',
        fontSize: size === 'lg' ? 'var(--fs-sm)' : 'var(--fs-xs)',
        padding: loud ? '5px 12px' : '4px 10px',
        letterSpacing: loud ? '.02em' : 0,
      }}
    >
      <span aria-hidden="true">{m.icon}</span>
      {m.label}
    </span>
  );
}

export const PROVENANCE_META = META;
