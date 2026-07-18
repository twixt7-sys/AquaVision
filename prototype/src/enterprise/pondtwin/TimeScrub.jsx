import useTicker from '../../shared/hooks/useTicker.js';
import { SORTIE_HOURS, formatHour } from '../../data/twinData.js';

// 24-hour time scrub with sortie tick marks and a play button. Between sorties the
// measured state ages  -  the parent shows the staleness accruing. Playing animates
// the diel cycle.
export default function TimeScrub({ hour, setHour, playing, setPlaying }) {
  useTicker(playing, 220, () => setHour((h) => (h + 0.5 > 23.5 ? 0 : Math.round((h + 0.5) * 2) / 2)));

  return (
    <div className="card" style={{ padding: '12px 16px' }}>
      <div className="row" style={{ gap: 12 }}>
        <button className="btn btn-sm" onClick={() => setPlaying((p) => !p)}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <span className="num" style={{ fontSize: 'var(--fs-lg)', color: 'var(--av-current)' }}>{formatHour(hour)}</span>
        <div className="grow" style={{ position: 'relative' }}>
          <input
            type="range"
            min="0"
            max="23.5"
            step="0.5"
            value={hour}
            onChange={(e) => { setPlaying(false); setHour(parseFloat(e.target.value)); }}
            style={{ width: '100%', accentColor: 'var(--av-current)' }}
          />
          {/* sortie ticks */}
          <div style={{ position: 'relative', height: 14, marginTop: 2 }}>
            {SORTIE_HOURS.map((s) => (
              <span
                key={s}
                title={`Sortie ${formatHour(s)}`}
                style={{ position: 'absolute', left: `${(s / 23.5) * 100}%`, transform: 'translateX(-50%)', fontSize: 9, color: 'var(--av-shallow)' }}
              >
                ▲{formatHour(s)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="muted" style={{ margin: '6px 0 0', fontSize: 'var(--fs-xs)' }}>
        Sorties run pre-dawn, midday, and dusk (▲). Between them the last measurement ages  -  freshness is always shown, never assumed.
      </p>
    </div>
  );
}
