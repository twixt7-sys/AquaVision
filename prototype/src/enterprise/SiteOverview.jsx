import { navigate } from '../router.js';
import StatTile from '../shared/components/StatTile.jsx';
import AlertCard from '../shared/components/AlertCard.jsx';
import { cageStatuses, stationStateAt, illustrativeAlert, SORTIE_HOURS, formatHour, geometry } from '../data/twinData.js';

// Match a cage to the station sharing its location (only some cages have a station).
function stationIdForCage(cage) {
  const st = geometry.stations.find((s) => s.x === cage.x && s.y === cage.y);
  return st ? st.station_id : null;
}

// The five-second answer (dashboard-spec.json): status per unit, staleness, active
// alert, next sortie. Answerable on a phone, in sunlight, half awake.
const AS_OF_HOUR = 6; // just after the pre-dawn sortie

export default function SiteOverview() {
  const cages = cageStatuses();
  const stations = stationStateAt(AS_OF_HOUR);
  const stAge = stations[0]?.ageMinutes;
  const nextSortie = SORTIE_HOURS.find((h) => h > AS_OF_HOUR) ?? SORTIE_HOURS[0];

  const alert = {
    ...illustrativeAlert,
    message: illustrativeAlert.message_example,
    whats_unknown: 'We measured this at 04:52. We cannot fly in tonight’s forecast rain, so the next reading is scheduled, not continuous.',
    action: 'Consider running aerators at cages 3–5 this evening.',
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Site overview</h2>
        <span className="tag-mono">As of {formatHour(AS_OF_HOUR)} · next sortie {formatHour(nextSortie)}</span>
      </div>

      {/* cage status grid  -  one is No-Data to prove grey never reads as green */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {cages.map((c) => {
          const stId = stationIdForCage(c);
          const st = stId ? stations.find((s) => s.station_id === stId) : null;
          const surface = st ? st.surface_do_mgl : null;
          return (
            <StatTile
              key={c.unit_id}
              label={`${c.unit_id} · ${c.species}`}
              value={c.status === 'no_data' ? '-' : surface != null ? surface : '-'}
              unit={c.status === 'no_data' ? '' : 'mg/L surface'}
              status={c.status}
              ageMinutes={c.status === 'no_data' ? null : stAge}
              awaiting={c.status === 'no_data'}
              provenance="illustrative_synthetic"
              footnote={c.status === 'no_data' ? 'Sensor missing/stale: this is NOT “safe”.' : undefined}
            />
          );
        })}
      </div>

      {/* active alert in plain-sentence format */}
      <div>
        <div className="section-title">Active alert</div>
        <AlertCard alert={alert} />
      </div>

      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-sm" onClick={() => navigate('/demo/enterprise/pondtwin')}>Open PondTwin →</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/demo/enterprise/profile')}>See the depth profile →</button>
      </div>
    </div>
  );
}
