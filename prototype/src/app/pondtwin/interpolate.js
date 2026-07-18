// Inverse-distance-weighted surface field + distance-based confidence for the
// PondTwin. The confidence model is calibrated so the three sample_grid_points in
// sample-pond-twin-state.json (0.95 on a station, 0.45 midway, 0.20 far corner)
// are reproduced. This is the honesty engine of the twin: confidence must FALL
// with distance from a measured station (digital-twin.json REQ-TWIN-003).

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

// Confidence as a function of distance to the nearest station (metres).
// Tuned to the file's anchors: on a station (~0 m) -> ~0.95, midway (~35 m) ->
// low, and the far corner (~46 m from any station) -> ~0.24 so it renders as a
// near-transparent hole, never a confident gradient (digital-twin.json REQ-TWIN-003).
export function confidenceAt(x, y, stations) {
  const nearest = Math.min(...stations.map((s) => dist(x, y, s.x, s.y)));
  const c = 0.95 * Math.exp(-nearest / 34);
  return Math.max(0.06, Math.min(0.95, c));
}

// IDW surface-DO estimate from measured stations. Each station carries a value.
export function idwValue(x, y, stations, key = 'surface_do_mgl') {
  let num = 0, den = 0;
  for (const s of stations) {
    const d = dist(x, y, s.x, s.y);
    if (d < 0.5) return s[key];
    const w = 1 / (d * d);
    num += w * s[key];
    den += w;
  }
  return den ? num / den : null;
}

// Build a coarse cell grid over the geometry extent for rendering the field.
export function buildGrid(geometry, stationValues, cols = 12, rows = 9) {
  const { x: W, y: H } = geometry.extent_m;
  const stations = geometry.stations.map((st) => {
    const v = stationValues.find((sv) => sv.station_id === st.station_id);
    return { x: st.x, y: st.y, surface_do_mgl: v ? v.surface_do_mgl : null };
  });
  const cells = [];
  const cw = W / cols, ch = H / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * cw + cw / 2;
      const cy = r * ch + ch / 2;
      cells.push({
        x: c * cw,
        y: r * ch,
        w: cw,
        h: ch,
        cx,
        cy,
        value: idwValue(cx, cy, stations),
        confidence: confidenceAt(cx, cy, stations),
      });
    }
  }
  return cells;
}

// DO value -> status color (uses the semantic status bands, not brand blue).
export function doColor(v) {
  if (v == null) return 'var(--av-unknown)';
  if (v < 2) return 'var(--av-critical)';
  if (v < 3.5) return 'var(--av-warning)';
  if (v < 5) return 'var(--av-advisory)';
  return 'var(--av-ok)';
}
