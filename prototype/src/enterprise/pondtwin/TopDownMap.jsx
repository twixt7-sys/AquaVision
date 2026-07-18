import { buildGrid, doColor } from '../../app/pondtwin/interpolate.js';
import { geometry, stationStateAt, cageStatuses } from '../../data/twinData.js';
import StatusBadge, { normalizeStatus } from '../../shared/components/StatusBadge.jsx';

// Top-down farm map in world coordinates (200 x 150 m). The interpolated surface-DO
// field is drawn as a coarse cell grid whose OPACITY falls and NOISE rises with
// distance from a station — so the far corner (confidence 0.20) reads as an honest
// hole, never a smooth confident gradient (digital-twin.json REQ-TWIN-003).
const PAD = 16;
const SCALE = 2.6; // px per metre

export default function TopDownMap({ hour, layers, selectedCage, onSelectCage }) {
  const { extent_m: ext, cages, dock, stations } = geometry;
  const W = ext.x * SCALE + PAD * 2;
  const H = ext.y * SCALE + PAD * 2;
  const px = (mx) => PAD + mx * SCALE;
  const py = (my) => PAD + my * SCALE;

  const stationValues = stationStateAt(hour);
  const grid = buildGrid(geometry, stationValues);
  const cageStatus = cageStatuses();

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <defs>
          <filter id="uncertain" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.9" intercept="0" /></feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* water body */}
        <rect x={px(0)} y={py(0)} width={ext.x * SCALE} height={ext.y * SCALE} fill="color-mix(in srgb, var(--av-deep) 55%, black)" rx="8" />

        {/* interpolated confidence field */}
        {(layers.interpolated || layers.confidence) &&
          grid.map((c, i) => {
            const showConf = layers.confidence;
            const base = showConf ? 'var(--av-current)' : doColor(c.value);
            // opacity proportional to confidence; low-confidence cells fade toward transparent
            const op = layers.interpolated ? 0.16 + c.confidence * 0.5 : 0;
            const confOp = showConf ? 0.12 + c.confidence * 0.7 : 0;
            return (
              <g key={i}>
                {layers.interpolated && (
                  <rect x={px(c.x)} y={py(c.y)} width={c.w * SCALE} height={c.h * SCALE} fill={base} opacity={op} />
                )}
                {/* noise/hatch grows as confidence drops — the honest-hole cue */}
                {layers.interpolated && c.confidence < 0.5 && (
                  <rect x={px(c.x)} y={py(c.y)} width={c.w * SCALE} height={c.h * SCALE} fill="var(--bg)" opacity={(0.5 - c.confidence) * 1.3} filter="url(#uncertain)" />
                )}
                {showConf && (
                  <>
                    <rect x={px(c.x)} y={py(c.y)} width={c.w * SCALE} height={c.h * SCALE} fill={base} opacity={confOp} />
                    <text x={px(c.cx)} y={py(c.cy)} textAnchor="middle" fontSize="9" fill="var(--text)" opacity="0.8">
                      {c.confidence.toFixed(2)}
                    </text>
                  </>
                )}
              </g>
            );
          })}

        {/* dock */}
        <g>
          <rect x={px(dock.x) - 8} y={py(dock.y) - 8} width="16" height="16" rx="3" fill="var(--av-mist)" />
          <text x={px(dock.x)} y={py(dock.y) - 12} textAnchor="middle" fontSize="9" fill="var(--text-2)">dock</text>
        </g>

        {/* stations — measured points render solid and sharp */}
        {layers.measured &&
          stations.map((s) => (
            <g key={s.station_id}>
              <circle cx={px(s.x)} cy={py(s.y)} r="4.5" fill="var(--av-white)" stroke="var(--av-deep)" strokeWidth="1.5" />
              <text x={px(s.x) + 7} y={py(s.y) - 6} fontSize="8.5" fill="var(--text-2)">{s.station_id.replace('SYNTH-', '')}</text>
            </g>
          ))}

        {/* cages */}
        {cages.map((c) => {
          const status = cageStatus.find((cs) => cs.unit_id === c.unit_id)?.status || c.status_illustrative;
          const key = normalizeStatus(status);
          const color = key === 'no_data' ? 'var(--av-unknown)' : `var(--av-${key === 'nominal' ? 'ok' : key})`;
          const sel = selectedCage === c.unit_id;
          return (
            <g key={c.unit_id} style={{ cursor: 'pointer' }} onClick={() => onSelectCage(c.unit_id)}>
              <circle
                cx={px(c.x)} cy={py(c.y)} r={c.radius_m * SCALE}
                fill={`color-mix(in srgb, ${color} 22%, transparent)`}
                stroke={color} strokeWidth={sel ? 3 : 1.6}
                strokeDasharray={key === 'no_data' ? '4 3' : undefined}
              />
              <text x={px(c.x)} y={py(c.y) + 3} textAnchor="middle" fontSize="9" fill="var(--text)">{c.unit_id.replace('SYNTH-', '')}</text>
            </g>
          );
        })}

        {/* operator-supplied biomass — testimony, not measurement; badged distinctly */}
        {layers.operator &&
          cages.map((c) => (
            <text key={`op-${c.unit_id}`} x={px(c.x)} y={py(c.y) + c.radius_m * SCALE + 11} textAnchor="middle" fontSize="8" fill="var(--av-advisory)">
              ~operator est.
            </text>
          ))}
      </svg>

      {/* legend */}
      <div className="row wrap" style={{ gap: 12, marginTop: 8, fontSize: 'var(--fs-xs)', color: 'var(--text-2)' }}>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--av-white)', border: '1px solid var(--av-deep)', marginRight: 5 }} />measured station (sharp)</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--av-current)', opacity: 0.4, marginRight: 5 }} />interpolated (fades + noises with distance)</span>
        {selectedCage && <span>Selected: <b>{selectedCage.replace('SYNTH-', '')}</b> — see the slice →</span>}
      </div>
    </div>
  );
}
