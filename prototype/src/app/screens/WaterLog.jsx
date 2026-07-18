import { Pad, ScreenHead } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import ChartFigure from '../../shared/charts/ChartFigure.jsx';
import { farmerWaterLog } from '../../data/demoFixtures.js';

// Manual water-quality logging + the farmer's own logged history. The chart renders
// GAPS AS GAPS — the nine days nobody logged are not bridged with a line. Manual,
// farmer-entered data is styled distinctly from sensor data (dashed, labelled).
export default function WaterLog() {
  return (
    <Pad>
      <ScreenHead title="Water log" sub="Your own readings, entered by hand" />
      <SampleDataBanner compact />

      <div className="card" style={{ padding: '12px 14px' }}>
        <b style={{ fontSize: 'var(--fs-sm)' }}>New reading</b>
        <div className="stack" style={{ gap: 8, marginTop: 8 }}>
          {['Dissolved oxygen (mg/L)', 'Temperature (°C)', 'pH'].map((f) => (
            <div key={f} className="row" style={{ justifyContent: 'space-between', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '8px 12px' }}>
              <span className="tag-mono">{f}</span>
              <span className="muted">—</span>
            </div>
          ))}
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-sm grow">Save reading</button>
            <button className="btn btn-ghost btn-sm">📷 Photo strip</button>
          </div>
        </div>
      </div>

      <div>
        <b style={{ fontSize: 'var(--fs-sm)' }}>Your last two weeks</b>
        <p className="muted" style={{ margin: '2px 0 8px', fontSize: 'var(--fs-xs)' }}>
          Gaps are the days nobody logged. We never draw a line across missing readings.
        </p>
        <ChartFigure doc={farmerWaterLog} showHeader={false} bare />
      </div>
    </Pad>
  );
}
