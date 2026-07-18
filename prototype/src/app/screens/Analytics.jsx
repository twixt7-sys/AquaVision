import { Pad, ScreenHead } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import ChartFigure from '../../shared/charts/ChartFigure.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { farmerWaterLog } from '../../data/demoFixtures.js';

// Premium analytics. Every trend states the data-completeness it is based on, and
// sparse data yields an honest "not enough data yet" state rather than a
// confident-looking chart over gaps.
export default function Analytics() {
  return (
    <Pad>
      <ScreenHead title="Analytics" sub="Trends from your own logged history" />
      <SampleDataBanner compact />

      <div className="card" style={{ padding: '12px 14px' }}>
        <b style={{ fontSize: 'var(--fs-sm)' }}>Dissolved oxygen trend</b>
        <p className="muted" style={{ margin: '2px 0 8px', fontSize: 'var(--fs-xs)' }}>
          Based on 4 readings over 14 days. Gaps are shown, not filled.
        </p>
        <ChartFigure doc={farmerWaterLog} showHeader={false} bare />
      </div>

      <EmptyState icon="◷" title="Feed-conversion trend" tone="no_data">
        Not enough data yet — we need at least a full feeding cycle with weights logged before an FCR trend means anything.
        We won't draw a line that isn't earned.
      </EmptyState>
    </Pad>
  );
}
