import { navigate } from '../../router.js';
import { MessageCircle, Stethoscope, Users, Droplets, Waves, GraduationCap } from 'lucide-react';
import { Pad, ScreenHead, AppCard, SoftPanel } from './_kit.jsx';
import StatusBadge from '../../shared/components/StatusBadge.jsx';
import StalenessTag from '../../shared/components/StalenessTag.jsx';
import EnvironmentStrip from '../../shared/components/EnvironmentStrip.jsx';
import PondCarousel from '../../shared/components/PondCarousel.jsx';
import { Button } from '../../shared/components/ui/button.jsx';
import { PondBuddy } from '../../shared/components/PondBuddy.jsx';
import { AviToggle } from '../../shared/components/AviToggle.jsx';
import { useAvi } from '../../core/state/AviContext.jsx';
import { feedingSchedule, lastLoggedDaysAgo, ponds } from '../../data/demoFixtures.js';

export default function Home() {
  const { aviVisible, setAviVisible } = useAvi();
  const nextFeed = feedingSchedule.find((f) => f.status !== 'done');
  const speciesCount = new Set(ponds.map((p) => p.species)).size;

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
        <ScreenHead title="Good morning" sub={`${ponds.length} ponds · ${speciesCount} species`} />
        <AviToggle className="absolute right-0 top-0" />
      </div>

      {aviVisible && (
        <SoftPanel className="p-2">
          <PondBuddy
            lines={buddyLines}
            mood={buddyMood}
            onDismiss={() => setAviVisible(false)}
          />
        </SoftPanel>
      )}

      <EnvironmentStrip />

      <PondCarousel ponds={ponds} onSelect={(pond) => navigate(`/demo/free/pond/${pond.id}`)} />

      <AppCard accent="var(--status-nodata)">
        <div className="mb-1 flex items-center justify-between gap-2">
          <b className="text-xs">Pond A · tilapia</b>
          <StatusBadge status="no_data" />
        </div>
        <p className="m-0 text-xs text-muted-foreground">
          We can&apos;t tell you how this pond is doing: nothing has been logged recently.
        </p>
        <div className="mt-1">
          <StalenessTag minutes={lastLoggedDaysAgo * 24 * 60} verb="last logged" staleAfterMin={60} />
        </div>
        <Button size="sm" className="mt-2 h-8 text-xs" onClick={() => navigate('/demo/free/water')}>
          <Droplets className="size-3.5" /> Log a reading now
        </Button>
      </AppCard>

      <AppCard>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--status-advisory)]/15 text-[var(--status-advisory)]">
            <Waves className="size-3.5" />
          </span>
          <b className="text-xs">Next feeding</b>
        </div>
        {nextFeed && (
          <div className="mt-1 flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5">
            <span className="text-xs">
              {nextFeed.time} · {nextFeed.pond}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{nextFeed.amount}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" className="mt-1.5 h-8 text-xs" onClick={() => navigate('/demo/free/feeding')}>
          Open feeding schedule
        </Button>
      </AppCard>

      <AppCard
        accent="var(--accent)"
        onClick={() => navigate('/demo/free/assistant')}
        className="hover:bg-muted/30"
      >
        <div className="flex items-start gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <MessageCircle className="size-3.5" aria-hidden />
          </span>
          <div>
            <b className="text-xs">Ask the AI assistant</b>
            <p className="m-0 mt-0.5 text-xs text-muted-foreground">
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
        <div className="flex items-start gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <GraduationCap className="size-3.5" aria-hidden />
          </span>
          <div>
            <b className="text-xs">Farmer education</b>
            <p className="m-0 mt-0.5 text-xs text-muted-foreground">
              Interactive units with quizzes and a live progress track.
            </p>
          </div>
        </div>
      </AppCard>

      <div className="flex flex-wrap gap-1.5">
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate('/demo/free/disease')}>
          <Stethoscope className="size-3.5" /> Identify a disease
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate('/demo/free/forum')}>
          <Users className="size-3.5" /> Community
        </Button>
      </div>
    </Pad>
  );
}
