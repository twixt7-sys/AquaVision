import { navigate } from '../../router.js';
import { MessageCircle, Stethoscope, Users, Droplets, Waves, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { Pad, ScreenHead, AppCard, SoftPanel } from './_kit.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import StalenessTag from '../../shared/components/StalenessTag.jsx';
import SampleDataBanner from '../../shared/components/SampleDataBanner.jsx';
import { Button } from '../../shared/components/ui/button.jsx';
import { PondBuddy } from '../../shared/components/PondBuddy.jsx';
import { AviToggle } from '../../shared/components/AviToggle.jsx';
import { useAvi } from '../../core/state/AviContext.jsx';
import { feedingSchedule, lastLoggedDaysAgo } from '../../data/demoFixtures.js';

function PondVisual({ label, status }) {
  const tone =
    status === 'no_data'
      ? 'from-[#8A97A0]/40 to-[#3D5F83]/50'
      : status === 'warning'
        ? 'from-[#E2721F]/35 to-[#0B608F]/55'
        : 'from-[#44A7D2]/40 to-[#0B608F]/60';

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tone} p-3 text-white shadow-sm`}>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-10 bg-white/15"
        animate={{ x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        style={{
          clipPath:
            'polygon(0 45%, 15% 25%, 32% 50%, 50% 20%, 68% 48%, 84% 28%, 100% 42%, 100% 100%, 0 100%)',
        }}
      />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute size-2 rounded-full bg-white/50"
          style={{ left: `${22 + i * 24}%`, bottom: 18 }}
          animate={{ y: [0, -14 - i * 4, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.2 + i * 0.3, delay: i * 0.2 }}
        />
      ))}
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Pond</p>
          <p className="text-sm font-semibold">{label}</p>
        </div>
        <Waves className="size-5 text-white/70" />
      </div>
    </div>
  );
}

export default function Home() {
  const { aviVisible, setAviVisible } = useAvi();
  const nextFeed = feedingSchedule.find((f) => f.status !== 'done');

  const buddyMood = lastLoggedDaysAgo > 3 ? 'concerned' : 'neutral';
  const buddyLines = [
    `Pond A has **No Data**: nothing logged in **${lastLoggedDaysAgo} days**. Grey isn't safe; it just means we don't know yet.`,
    nextFeed
      ? `Next feeding is **${nextFeed.time}** at **${nextFeed.pond}** (${nextFeed.amount}). Tap Feed when you're done.`
      : 'Feeding schedule looks clear for now.',
    'Tip: one honest reading beats a week of guesses. Log DO, temp, or pH when you can.',
    "I never invent pond health. If I don't have a reading, I'll say so.",
  ];

  return (
    <Pad>
      <div className="relative">
        <ScreenHead title="Good morning" sub="Pond A · Pond B" />
        <AviToggle className="absolute right-0 top-0" />
      </div>

      <SampleDataBanner compact />

      <div className="grid grid-cols-2 gap-2.5">
        <PondVisual label="A · tilapia" status="no_data" />
        <PondVisual label="B · milkfish" status="ok" />
      </div>

      {aviVisible && (
        <SoftPanel className="p-3 sm:p-3.5">
          <PondBuddy
            lines={buddyLines}
            mood={buddyMood}
            onDismiss={() => setAviVisible(false)}
          />
        </SoftPanel>
      )}

      <AppCard accent="var(--status-nodata)">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <b className="text-sm">Pond A · tilapia</b>
          <StatusBadge status="no_data" />
        </div>
        <p className="m-0 text-sm text-muted-foreground">
          We can&apos;t tell you how this pond is doing: nothing has been logged recently.
        </p>
        <div className="mt-1.5">
          <StalenessTag minutes={lastLoggedDaysAgo * 24 * 60} verb="last logged" staleAfterMin={60} />
        </div>
        <Button size="sm" className="mt-2.5" onClick={() => navigate('/demo/free/water')}>
          <Droplets className="size-3.5" /> Log a reading now
        </Button>
      </AppCard>

      <AppCard>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--status-advisory)]/15 text-[var(--status-advisory)]">
            <Waves className="size-4" />
          </span>
          <b className="text-sm">Next feeding</b>
        </div>
        {nextFeed && (
          <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2">
            <span className="text-sm">
              {nextFeed.time} · {nextFeed.pond}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{nextFeed.amount}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" className="mt-2.5" onClick={() => navigate('/demo/free/feeding')}>
          Open feeding schedule
        </Button>
      </AppCard>

      <AppCard
        accent="var(--accent)"
        onClick={() => navigate('/demo/free/assistant')}
        className="hover:bg-muted/30"
      >
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <MessageCircle className="size-4" aria-hidden />
          </span>
          <div>
            <b className="text-sm">Ask the AI assistant</b>
            <p className="m-0 mt-1 text-sm text-muted-foreground">
              “My fish are gasping at the surface early in the morning…”
            </p>
          </div>
        </div>
      </AppCard>

      <AppCard
        accent="#0B608F"
        onClick={() => navigate('/demo/free/learning')}
        className="hover:bg-muted/30"
      >
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <GraduationCap className="size-4" aria-hidden />
          </span>
          <div>
            <b className="text-sm">Farmer education</b>
            <p className="m-0 mt-1 text-sm text-muted-foreground">
              Interactive units with quizzes and a live progress track.
            </p>
          </div>
        </div>
      </AppCard>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/demo/free/disease')}>
          <Stethoscope /> Identify a disease
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/demo/free/forum')}>
          <Users /> Community
        </Button>
      </div>
    </Pad>
  );
}
