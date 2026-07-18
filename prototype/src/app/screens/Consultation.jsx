import { Stethoscope, Sparkles } from 'lucide-react';
import { Pad, ScreenHead, PremiumPanel } from './_kit.jsx';
import { consultationThread } from '../../data/demoFixtures.js';
import { cn } from '../../shared/components/ui/utils.js';

export default function Consultation() {
  const { expert, booked, messages } = consultationThread;
  return (
    <Pad>
      <div className="flex items-start justify-between gap-2">
        <ScreenHead title="Expert consultation" sub="A human in the loop, by design" />
        <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-[#8A6BC4]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#6B5B95]">
          <Sparkles className="size-3" aria-hidden />
          Premium
        </span>
      </div>

      <PremiumPanel>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#8A6BC4]/15 text-[#8A6BC4]">
              <Stethoscope className="size-4" aria-hidden />
            </span>
            <div>
              <b className="text-sm">{expert}</b>
              <p className="m-0 mt-0.5 font-mono text-[10px] text-muted-foreground">{booked}</p>
            </div>
          </div>
          <span className="rounded-md bg-[var(--status-ok)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--status-ok)]">
            Booked
          </span>
        </div>
      </PremiumPanel>

      <div className="flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-snug shadow-sm',
                m.from === 'user'
                  ? 'rounded-br-md bg-gradient-to-br from-[#2A3F7A] to-[#4A3A8A] text-white'
                  : 'rounded-bl-md border border-[#8A6BC4]/20 bg-white text-foreground',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </Pad>
  );
}
