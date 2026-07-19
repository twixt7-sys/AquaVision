import { depthProfileFor, geometry, stationStateAt } from '../../data/twinData.js';
import { doColor } from '../../app/pondtwin/interpolate.js';

// Vertical section through the selected cage. Depth runs DOWNWARD 0–7 m. Measured
// station columns render sharp; the water between stations fades/noises with
// distance. The thermocline and the anoxic bottom layer under the cage are drawn,
// so "the loaded gun under the fish" is visible.
const W = 360, H = 300, PAD = { l: 42, r: 14, t: 20, b: 24 };

export default function SliceView({ hour, selectedCage }) {
  const cage = geometry.cages.find((c) => c.unit_id === selectedCage) || geometry.cages[0];
  // nearest station to the cage supplies the profile
  const station = geometry.stations.find((s) => s.x === cage.x && s.y === cage.y) || geometry.stations[0];
  const profile = depthProfileFor(station.station_id, hour);
  const st = stationStateAt(hour).find((s) => s.station_id === station.station_id);
  const maxDepth = geometry.max_depth_m;

  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const Yd = (d) => PAD.t + (d / maxDepth) * ih;
  const doMin = 0, doMax = 8;
  const Xv = (v) => PAD.l + (v / doMax) * iw;

  const hasStation = !!station;
  const isDerived = station.station_id !== 'SYNTH-ST-04';

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* water column background  -  shaded by DO at each depth band */}
        {profile.map((p, i) => {
          const next = profile[i + 1];
          const y0 = Yd(p.depth_m);
          const y1 = next ? Yd(next.depth_m) : PAD.t + ih;
          const uncertainty = isDerived ? 0.5 : 0.85; // derived columns look less certain
          return (
            <rect
              key={i}
              x={PAD.l}
              y={y0}
              width={iw}
              height={Math.max(0, y1 - y0)}
              fill={doColor(p.do_mgl)}
              opacity={0.14 * uncertainty + 0.04}
            />
          );
        })}

        {/* thermocline band */}
        {st && (
          <>
            <line x1={PAD.l} y1={Yd(st.thermocline_depth_m)} x2={PAD.l + iw} y2={Yd(st.thermocline_depth_m)} stroke="var(--av-advisory)" strokeDasharray="5 4" />
            <text x={PAD.l + iw} y={Yd(st.thermocline_depth_m) - 4} textAnchor="end" fontSize="9" fill="var(--av-advisory)">
              thermocline ~{st.thermocline_depth_m} m
            </text>
          </>
        )}

        {/* anoxic zone highlight (DO < 1) */}
        {(() => {
          const anox = profile.filter((p) => p.do_mgl < 1);
          if (!anox.length) return null;
          const top = Yd(anox[0].depth_m);
          return (
            <>
              <rect x={PAD.l} y={top} width={iw} height={PAD.t + ih - top} fill="var(--av-critical)" opacity="0.14" />
              <text x={PAD.l + 6} y={top + 14} fontSize="9" fill="var(--av-critical)">anoxic  -  the loaded gun</text>
            </>
          );
        })()}

        {/* cage silhouette hanging from the surface */}
        <rect x={PAD.l + iw / 2 - 26} y={PAD.t} width="52" height={Yd(3.5) - PAD.t} fill="none" stroke="var(--av-mist)" strokeWidth="1.2" opacity="0.6" />
        <text x={PAD.l + iw / 2} y={PAD.t - 6} textAnchor="middle" fontSize="9" fill="var(--text-2)">{cage.unit_id.replace('SYNTH-', '')} net</text>

        {/* DO profile line */}
        <polyline
          points={profile.map((p) => `${Xv(p.do_mgl)},${Yd(p.depth_m)}`).join(' ')}
          fill="none"
          stroke="var(--av-current)"
          strokeWidth="2.2"
        />
        {profile.map((p, i) => (
          <circle key={i} cx={Xv(p.do_mgl)} cy={Yd(p.depth_m)} r="2.6" fill="var(--av-current)" />
        ))}

        {/* depth axis */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
          <text key={d} x={PAD.l - 6} y={Yd(d) + 3} textAnchor="end" fontSize="9" fill="var(--text-2)">{d}</text>
        ))}
        <text transform={`rotate(-90)`} x={-(PAD.t + ih / 2)} y={12} textAnchor="middle" fontSize="10" fill="var(--text-2)">Depth (m) ↓</text>
        {/* DO axis */}
        {[0, 2, 4, 6, 8].map((v) => (
          <text key={v} x={Xv(v)} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--text-2)">{v}</text>
        ))}
        <text x={PAD.l + iw / 2} y={H - 6} textAnchor="middle" fontSize="0" fill="var(--text-2)" />
      </svg>

      <div className="row wrap" style={{ gap: 10, fontSize: 'var(--fs-xs)', color: 'var(--text-2)', marginTop: 4 }}>
        <span>Dissolved oxygen (mg/L) across depth</span>
        {isDerived && <span style={{ color: 'var(--av-advisory)' }}>derived column  -  less certain than a station</span>}
      </div>
    </div>
  );
}
