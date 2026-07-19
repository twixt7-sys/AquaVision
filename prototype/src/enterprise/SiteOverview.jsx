import { navigate } from '../router.js';
import { ArrowRight, Building2, Layers3, Radio } from 'lucide-react';
import StatTile from '../shared/components/StatTile.jsx';
import AlertCard from '../shared/components/AlertCard.jsx';
import { Button } from '../shared/components/ui/button.jsx';
import { cageStatuses, stationStateAt, illustrativeAlert, SORTIE_HOURS, formatHour, geometry } from '../data/twinData.js';

function stationIdForCage(cage) {
  const st = geometry.stations.find((s) => s.x === cage.x && s.y === cage.y);
  return st ? st.station_id : null;
}

const AS_OF_HOUR = 6;

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
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#0B608F]/20 bg-gradient-to-br from-[#031820] via-[#043B66] to-[#0B608F] px-4 py-4 text-white shadow-[0_16px_40px_-16px_rgba(3,24,32,0.55)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent via-white/50 to-accent" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="m-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
              <Building2 className="size-3" aria-hidden />
              Enterprise command
            </p>
            <h2 className="m-0 mt-1 text-xl font-semibold tracking-tight">Site overview</h2>
            <p className="m-0 mt-1 font-mono text-[11px] text-white/60">
              As of {formatHour(AS_OF_HOUR)} · next sortie {formatHour(nextSortie)}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-black/25 px-2.5 py-1 font-mono text-[10px] text-accent">
            <Radio className="size-3 animate-pulse" aria-hidden />
            Live ops deck
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <Layers3 className="size-3.5 text-[#0B608F]" aria-hidden />
          <p className="m-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0B608F]">
            Cage status grid
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
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
      </div>

      <div className="rounded-2xl border border-[#0B608F]/15 bg-white/80 p-3.5 shadow-[0_10px_28px_-16px_rgba(4,59,102,0.35)]">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0B608F]">
          Active alert
        </p>
        <AlertCard alert={alert} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => navigate('/demo/enterprise/pondtwin')}>
          Open PondTwin <ArrowRight className="size-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/demo/enterprise/profile')}>
          See the depth profile
        </Button>
      </div>
    </div>
  );
}
