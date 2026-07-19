import { Lightbulb, Sparkles } from 'lucide-react';
import { Pad, ScreenHead, PremiumPanel } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { recommendations } from '../../data/demoFixtures.js';

export default function Recommendations() {
  return (
    <Pad>
      <div className="flex items-start justify-between gap-2">
        <ScreenHead title="Recommendations" sub="Each one says what it's based on" />
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-[#8A6BC4]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#6B5B95]">
          <Sparkles className="size-3" aria-hidden />
          Premium
        </span>
      </div>
      <SampleDataBanner compact />

      <div className="flex flex-col gap-2.5">
        {recommendations.map((r, i) => (
          <PremiumPanel key={i} eyebrow={`Insight ${i + 1}`}>
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#8A6BC4]/15 text-[#8A6BC4]">
                <Lightbulb className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="m-0 text-sm font-medium leading-snug text-foreground">{r.text}</p>
                <p className="m-0 mt-1.5 text-[11px] leading-snug text-muted-foreground">{r.basis}</p>
              </div>
            </div>
          </PremiumPanel>
        ))}
      </div>
    </Pad>
  );
}
