import { Activity, Sparkles } from 'lucide-react';
import { Pad, ScreenHead, PremiumPanel, Disclaimer } from './_kit.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import { predictiveHealthNotes } from '../../data/demoFixtures.js';

export default function PredictiveHealth() {
  return (
    <Pad>
      <div className="flex items-start justify-between gap-2">
        <ScreenHead
          title="Predictive health"
          sub="What your logs suggest is coming — in plain language"
        />
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-[#8A6BC4]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#6B5B95]">
          <Sparkles className="size-3" aria-hidden />
          Premium
        </span>
      </div>
      <SampleDataBanner compact />

      <div className="flex flex-col gap-2.5">
        {predictiveHealthNotes.map((n, i) => (
          <PremiumPanel key={i}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A6BC4]">
                <Activity className="size-3" aria-hidden />
                Pattern {i + 1}
              </span>
              <StatusBadge status={n.severity} />
            </div>
            <p className="m-0 text-sm leading-snug text-foreground">{n.text}</p>
            <p className="m-0 mt-2 border-t border-[#8A6BC4]/15 pt-2 text-[11px] text-muted-foreground">
              {n.basis}
            </p>
          </PremiumPanel>
        ))}
      </div>

      <Disclaimer>
        We show the mechanism and let you judge. We do not give a risk score, and we never tell you the water is
        safe.
      </Disclaimer>
    </Pad>
  );
}
