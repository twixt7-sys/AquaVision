import { Store, Sparkles } from 'lucide-react';
import { Pad, ScreenHead, PremiumPanel } from './_kit.jsx';
import { marketplaceListings } from '../../data/demoFixtures.js';

export default function Marketplace() {
  return (
    <Pad>
      <div className="flex items-start justify-between gap-2">
        <ScreenHead title="Marketplace" sub="Feed, equipment, livestock, and buyers" />
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-[#8A6BC4]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#6B5B95]">
          <Sparkles className="size-3" aria-hidden />
          Premium
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {marketplaceListings.map((l, i) => (
          <PremiumPanel key={i}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#8A6BC4]/15 text-[#8A6BC4]">
                  <Store className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <b className="text-sm">{l.item}</b>
                  <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">{l.seller}</p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-sm font-semibold text-[#0B608F]">{l.price}</span>
            </div>
            <div className="mt-2 flex justify-end">
              <span className="rounded-md bg-[var(--status-advisory)]/12 px-2 py-0.5 text-[10px] font-semibold text-[var(--status-advisory)]">
                {l.takeRatePct}% platform fee
              </span>
            </div>
          </PremiumPanel>
        ))}
      </div>
      <p className="m-0 text-[11px] text-muted-foreground">
        The platform fee is shown on every listing. It&apos;s how the marketplace pays for itself.
      </p>
    </Pad>
  );
}
