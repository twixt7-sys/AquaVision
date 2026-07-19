import { Pad, ScreenHead } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { farmerWaterLog, feedingSchedule } from '../../data/demoFixtures.js';

// Records  -  everything the farmer logged, exportable. Data ownership is explicit
// from the first screen (faq: "your data is yours, exportable").
export default function Records() {
  const readings = farmerWaterLog.series[0].data.filter(([, v]) => v != null);
  return (
    <Pad>
      <ScreenHead title="Records" sub="Your data  -  yours, and exportable" />
      <SampleDataBanner compact />

      <div className="row" style={{ gap: 8 }}>
        <button className="btn btn-ghost btn-sm">⤓ Export CSV</button>
        <span className="muted" style={{ fontSize: 'var(--fs-xs)', alignSelf: 'center' }}>Nothing is held hostage to keep you subscribed.</span>
      </div>

      <div>
        <b style={{ fontSize: 'var(--fs-sm)' }}>Water readings</b>
        <div className="stack" style={{ gap: 6, marginTop: 6 }}>
          {readings.map(([d, v]) => (
            <div key={d} className="row" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>
              <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>Day {d}</span>
              <span className="num">{v} mg/L</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <b style={{ fontSize: 'var(--fs-sm)' }}>Feeding log</b>
        <div className="stack" style={{ gap: 6, marginTop: 6 }}>
          {feedingSchedule.map((f) => (
            <div key={f.time} className="row" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>
              <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>{f.time} · {f.pond}</span>
              <span className="num">{f.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </Pad>
  );
}
