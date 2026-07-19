import { motion } from 'motion/react';
import { Fish, CircleDot } from 'lucide-react';
import { Pad, ScreenHead, AppCard } from './_kit.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import { Button } from '../../shared/components/ui/button.jsx';
import { feedingSchedule } from '../../data/demoFixtures.js';
import { cn } from '../../shared/components/ui/utils.js';

const STATUS = {
  done: { label: 'Done', s: 'nominal' },
  due: { label: 'Due now', s: 'advisory' },
  upcoming: { label: 'Upcoming', s: 'no_data' },
};

export default function Feeding() {
  return (
    <Pad>
      <ScreenHead title="Feeding schedule" sub="One-tap confirm, skip, or adjust" />

      {/* Visual day strip */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-[#043B66] via-[#0B608F] to-[#44A7D2] p-3 text-white">
        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/70">
          <span>Today&apos;s rhythm</span>
          <span className="inline-flex items-center gap-1"><Fish size={12} /> 3 events</span>
        </div>
        <div className="relative mx-1 mt-4 mb-1 h-2 rounded-full bg-white/20">
          {feedingSchedule.map((f, i) => {
            const left = `${12 + i * 36}%`;
            const active = f.status === 'due';
            return (
              <motion.span
                key={f.time}
                className={cn(
                  'absolute top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2',
                  f.status === 'done' && 'border-[var(--status-ok)] bg-[var(--status-ok)]',
                  f.status === 'due' && 'border-[var(--status-advisory)] bg-[var(--status-advisory)]',
                  f.status === 'upcoming' && 'border-white/50 bg-white/30',
                )}
                style={{ left }}
                animate={active ? { scale: [1, 1.2, 1] } : undefined}
                transition={active ? { repeat: Infinity, duration: 1.4 } : undefined}
              >
                <CircleDot size={10} className="text-white" />
              </motion.span>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between px-1 font-mono text-[10px] text-white/80">
          {feedingSchedule.map((f) => (
            <span key={f.time}>{f.time}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {feedingSchedule.map((f) => (
          <AppCard key={f.time} accent={f.status === 'due' ? 'var(--status-advisory)' : undefined}>
            <div className="flex items-center justify-between gap-2">
              <b className="num text-lg" data-telemetry>
                {f.time}
              </b>
              <StatusBadge status={STATUS[f.status].s} label={STATUS[f.status].label} />
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{f.pond}</span>
              <span className="font-mono text-xs text-muted-foreground">{f.amount}</span>
            </div>
            {f.status === 'due' && (
              <div className="mt-2.5 flex gap-2">
                <Button size="sm" className="flex-1">
                  Confirm fed
                </Button>
                <Button variant="outline" size="sm">
                  Skip
                </Button>
                <Button variant="outline" size="sm">
                  Adjust
                </Button>
              </div>
            )}
          </AppCard>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Overfeeding fouls the water, which worsens conversion. The schedule nudges you toward less waste.
      </p>
    </Pad>
  );
}
