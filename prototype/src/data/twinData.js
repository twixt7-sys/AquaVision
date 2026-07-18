// Derives a 24-hour sequence of PondTwin states from the synthetic sample files,
// so the time-scrub demonstrates (a) the diel cycle and (b) staleness accruing
// between sorties. All values remain illustrative_synthetic.
import twinState from '@data/12_datasets/sample-pond-twin-state.json';
import telemetry from '@data/12_datasets/sample-telemetry.json';

export const geometry = twinState.synthetic_twin.geometry;
export const measuredStations = twinState.synthetic_twin.state_layers.measured.points;
export const interpolatedSamples = twinState.synthetic_twin.state_layers.interpolated.sample_grid_points;
export const operatorSupplied = twinState.synthetic_twin.state_layers.operator_supplied.cages;
export const illustrativeAlert = twinState.synthetic_twin.illustrative_alert;
export const depthProfileST04 = telemetry.synthetic_depth_profile;

const dielSeries = telemetry.synthetic_diel_do_profile.series; // [{hour, do_mgl}]
export function dielAt(hour) {
  const h = ((hour % 24) + 24) % 24;
  const lo = Math.floor(h), hi = (lo + 1) % 24, f = h - lo;
  const a = dielSeries[lo].do_mgl, b = dielSeries[hi].do_mgl;
  return a + (b - a) * f;
}

// Sorties run pre-dawn, midday, dusk (dock schedules around the diel + glint window).
export const SORTIE_HOURS = [5, 11, 17];
export function lastSortieHour(hour) {
  const past = SORTIE_HOURS.filter((s) => s <= hour);
  return past.length ? past[past.length - 1] : SORTIE_HOURS[SORTIE_HOURS.length - 1] - 24; // previous evening
}

// A station's surface DO measured at a given sortie hour: the file's base value
// scaled by the diel shape (reference = hour 5, when the base values were captured).
const dielRef = dielAt(5);
export function stationStateAt(hour) {
  const sortie = lastSortieHour(hour);
  const ageMinutes = Math.round((hour - sortie) * 60);
  const factor = dielAt(((sortie % 24) + 24) % 24) / dielRef;
  return measuredStations.map((m) => ({
    station_id: m.station_id,
    surface_do_mgl: Math.round(m.surface_do_mgl * factor * 10) / 10,
    // bottom water is stratified — far weaker diel response
    bottom_do_mgl: Math.round(m.bottom_do_mgl * (1 + (factor - 1) * 0.15) * 10) / 10,
    thermocline_depth_m: m.thermocline_depth_m,
    ageMinutes,
  }));
}

// Map a cage's illustrative status to a five-state status; one cage is forced to
// No-Data to demonstrate that grey never reads as green.
export function cageStatuses() {
  return geometry.cages.map((c, i) => ({
    ...c,
    status: i === 1 ? 'no_data' : c.status_illustrative, // SYNTH-C2 has a missing/stale sensor
  }));
}

// Construct a plausible vertical profile for a station from its surface DO,
// bottom DO, and thermocline depth. ST-04 uses the full published profile.
export function depthProfileFor(stationId, hour) {
  if (stationId === 'SYNTH-ST-04') {
    return depthProfileST04.samples.map((s) => ({ depth_m: s.depth_m, do_mgl: s.do_mgl, temp_c: s.temp_c }));
  }
  const st = stationStateAt(hour).find((s) => s.station_id === stationId);
  if (!st) return [];
  const depths = [0.5, 1, 2, 3, 4, 5, 6];
  const { surface_do_mgl: top, bottom_do_mgl: bot, thermocline_depth_m: tc } = st;
  return depths.map((d) => {
    // above thermocline: near-surface value; below: decays toward bottom value
    let do_mgl;
    if (d <= tc) {
      do_mgl = top - (top - (top + bot) / 2) * (d / tc) * 0.5;
    } else {
      const f = Math.min(1, (d - tc) / (6 - tc || 1));
      do_mgl = ((top + bot) / 2) + ((bot - (top + bot) / 2) * f);
    }
    const temp_c = 30 - (d <= tc ? d * 0.3 : 30 * 0 + tc * 0.3 + (d - tc) * 1.6);
    return { depth_m: d, do_mgl: Math.round(do_mgl * 10) / 10, temp_c: Math.round(temp_c * 10) / 10, derived: true };
  });
}

// Build a depth-profile chart_payload for the enterprise Profile view.
export function depthProfileChart(stationId, hour) {
  const rows = depthProfileFor(stationId, hour);
  return {
    id: `profile-${stationId}`,
    chart_type: 'line',
    title: `Vertical profile — ${stationId}`,
    provenance: 'illustrative_synthetic',
    axes: {
      x: { label: 'Dissolved oxygen', unit: 'mg/L', type: 'linear' },
      y: { label: 'Depth', unit: 'm', type: 'linear', min: 0, max: 6.5 },
    },
    series: [
      {
        name: `DO by depth — ${stationId} — SYNTHETIC`,
        unit: 'mg/L',
        provenance: 'illustrative_synthetic',
        data: rows.map((r) => [r.do_mgl, r.depth_m]),
      },
      {
        name: 'Temperature — SYNTHETIC',
        unit: '°C',
        provenance: 'illustrative_synthetic',
        data: rows.map((r) => [r.temp_c, r.depth_m]),
      },
    ],
    annotations: [
      { kind: 'band', value: [3, 4], label: 'Thermocline', severity: 'advisory' },
    ],
  };
}

export function formatHour(hour) {
  const h = Math.floor(((hour % 24) + 24) % 24);
  const mm = Math.round((hour - Math.floor(hour)) * 60);
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
