import { Pad, ScreenHead } from './_kit.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import { feedingSchedule } from '../../data/demoFixtures.js';

const STATUS = { done: { label: 'Done', s: 'nominal' }, due: { label: 'Due now', s: 'advisory' }, upcoming: { label: 'Upcoming', s: 'no_data' } };

export default function Feeding() {
  return (
    <Pad>
      <ScreenHead title="Feeding schedule" sub="One-tap confirm, skip, or adjust" />
      <div className="stack" style={{ gap: 10 }}>
        {feedingSchedule.map((f) => (
          <div key={f.time} className="card" style={{ padding: '12px 14px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <b className="num" style={{ fontSize: 'var(--fs-lg)' }}>{f.time}</b>
              <StatusBadge status={STATUS[f.status].s} label={STATUS[f.status].label} />
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
              <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>{f.pond}</span>
              <span className="tag-mono">{f.amount}</span>
            </div>
            {f.status === 'due' && (
              <div className="row" style={{ gap: 8, marginTop: 10 }}>
                <button className="btn btn-sm grow">Confirm fed</button>
                <button className="btn btn-ghost btn-sm">Skip</button>
                <button className="btn btn-ghost btn-sm">Adjust</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 'var(--fs-xs)' }}>
        Overfeeding fouls the water, which worsens conversion — the schedule nudges you toward less waste.
      </p>
    </Pad>
  );
}
