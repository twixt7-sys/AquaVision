import { Pad, ScreenHead, AppCard } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import ChartFigure from '../../shared/charts/ChartFigure.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { farmerWaterLog } from '../../data/demoFixtures.js';

export default function Analytics() {
  return (
    <Pad>
      <ScreenHead title="Analytics" sub="Trends from your own logged history" />
      <SampleDataBanner compact />

      <AppCard>
        <b className="text-sm">Dissolved oxygen trend</b>
        <p className="mb-2 mt-0.5 text-xs text-muted-foreground">
          Based on 4 readings over 14 days. Gaps are shown, not filled.
        </p>
        <ChartFigure doc={farmerWaterLog} showHeader={false} bare />
      </AppCard>

      <EmptyState icon="CircleDashed" title="Feed-conversion trend" tone="no_data">
        Not enough data yet  -  we need at least a full feeding cycle with weights logged before an FCR trend means
        anything. We won&apos;t draw a line that isn&apos;t earned.
      </EmptyState>
    </Pad>
  );
}
