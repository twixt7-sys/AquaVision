import { BarChart3, Sparkles } from 'lucide-react';
import { Pad, ScreenHead, PremiumPanel } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import ChartFigure from '../../shared/charts/ChartFigure.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { farmerWaterLog } from '../../data/demoFixtures.js';

export default function Analytics() {
  return (
    <Pad>
      <div className="flex items-start justify-between gap-2">
        <ScreenHead title="Analytics" sub="Trends from your own logged history" />
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-[#8A6BC4]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#6B5B95]">
          <Sparkles className="size-3" aria-hidden />
          Premium
        </span>
      </div>
      <SampleDataBanner compact />

      <PremiumPanel eyebrow="Dissolved oxygen">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[#8A6BC4]/15 text-[#8A6BC4]">
            <BarChart3 className="size-4" aria-hidden />
          </span>
          <div>
            <b className="text-sm">DO trend</b>
            <p className="m-0 text-[11px] text-muted-foreground">
              4 readings over 14 days · gaps shown, not filled
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#8A6BC4]/15 bg-white/70 p-1">
          <ChartFigure doc={farmerWaterLog} showHeader={false} bare />
        </div>
      </PremiumPanel>

      <EmptyState icon="CircleDashed" title="Feed-conversion trend" tone="no_data">
        Not enough data yet — we need at least a full feeding cycle with weights logged before an FCR trend means
        anything. We won&apos;t draw a line that isn&apos;t earned.
      </EmptyState>
    </Pad>
  );
}
