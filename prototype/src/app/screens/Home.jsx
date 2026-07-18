import { navigate } from '../../router.js';
import { Pad, ScreenHead, AppCard } from './_kit.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import StalenessTag from '../../shared/components/StalenessTag.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { feedingSchedule, lastLoggedDaysAgo } from '../../data/demoFixtures.js';

// The five-second answer for a free-tier farmer. The key honesty beat: the pond's
// status is "No Data" because nothing has been logged in 9 days — and No Data is
// styled as an absence (grey, hollow), never as "safe".
export default function Home() {
  return (
    <Pad>
      <ScreenHead title="Good morning" sub="Pond A · Pond B" />
      <SampleDataBanner compact />

      <AppCard accent="var(--av-unknown)">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
          <b>Pond A — tilapia</b>
          <StatusBadge status="no_data" />
        </div>
        <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
          We can't tell you how this pond is doing — nothing has been logged recently.
        </p>
        <div style={{ marginTop: 6 }}>
          <StalenessTag minutes={lastLoggedDaysAgo * 24 * 60} verb="last logged" staleAfterMin={60} />
        </div>
        <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={() => navigate('/demo/free/water')}>
          Log a reading now
        </button>
      </AppCard>

      <AppCard>
        <b style={{ fontSize: 'var(--fs-sm)' }}>Next feeding</b>
        {feedingSchedule
          .filter((f) => f.status !== 'done')
          .slice(0, 1)
          .map((f) => (
            <div key={f.time} className="row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
              <span>{f.time} · {f.pond}</span>
              <span className="tag-mono">{f.amount}</span>
            </div>
          ))}
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => navigate('/demo/free/feeding')}>
          Open feeding schedule
        </button>
      </AppCard>

      <AppCard accent="var(--av-current)" onClick={() => navigate('/demo/free/assistant')}>
        <b>Ask the AI assistant</b>
        <p className="muted" style={{ margin: '4px 0 0', fontSize: 'var(--fs-sm)' }}>
          “My fish are gasping at the surface early in the morning…”
        </p>
      </AppCard>

      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/demo/free/disease')}>Identify a disease</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/demo/free/forum')}>Community</button>
      </div>
    </Pad>
  );
}
