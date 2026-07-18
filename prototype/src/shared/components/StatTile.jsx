import StatusBadge from './StatusBadge.jsx';
import StalenessTag from './StalenessTag.jsx';
import ProvenanceBadge from './ProvenanceBadge.jsx';

// KPI / reading tile. Value in tabular mono. Status is icon+label. Staleness is
// always shown when present. Provenance badge optional.
export default function StatTile({
  label,
  value,
  unit,
  status,
  ageMinutes,
  ageVerb = 'measured',
  provenance,
  awaiting = false,
  footnote,
}) {
  return (
    <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--heading)', fontSize: 'var(--fs-sm)' }}>
          {label}
        </span>
        {status && <StatusBadge status={status} />}
      </div>
      <div>
        {awaiting ? (
          <span className="tag-mono" style={{ color: 'var(--av-unknown)', fontSize: 'var(--fs-base)' }}>
            awaiting data
          </span>
        ) : (
          <span className="num" style={{ fontSize: 'var(--fs-2xl)', color: 'var(--av-current)' }}>
            {value}
            {unit && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-2)', marginLeft: 4 }}>{unit}</span>}
          </span>
        )}
      </div>
      <div className="row wrap" style={{ gap: 8 }}>
        {ageMinutes != null && <StalenessTag minutes={ageMinutes} verb={ageVerb} />}
        {provenance && <ProvenanceBadge type={provenance} />}
      </div>
      {footnote && <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-xs)' }}>{footnote}</p>}
    </div>
  );
}
