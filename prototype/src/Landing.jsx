import { ArrowRight, FlaskConical, Monitor, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { navigate } from './router.js';
import { oneLiner } from './data/index.js';
import AppPageBackground from './shared/components/AppPageBackground.jsx';
import { AquaVisionLogoLockup } from './shared/components/AquaVisionBrandLogo.jsx';
import FrameModeToggle from './shared/components/FrameModeToggle.jsx';
import { Button } from './shared/components/ui/button.jsx';
import { Card, CardContent } from './shared/components/ui/card.jsx';
import { PondBuddy } from './shared/components/PondBuddy.jsx';

export default function Landing() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-5 py-10">
      <AppPageBackground />
      <motion.div
        className="w-full max-w-xl text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <AquaVisionLogoLockup width={320} className="mb-3" />

        <p className="mb-6 mt-1 text-[11px] uppercase tracking-[0.28em] text-accent">
          AI-powered aquaculture management
        </p>

        <p className="mx-auto mb-2 max-w-xl text-lg leading-snug text-foreground">
          “We meet fish farmers where they are: from their first pond to their first drone.”
        </p>
        <p className="mx-auto mb-6 max-w-lg text-sm text-muted-foreground">{oneLiner}</p>

        <div className="mx-auto mb-6 flex max-w-md flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/80 px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Pitch frame
          </p>
          <FrameModeToggle tone="onLight" />
          <p className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Smartphone size={12} /> Phone</span>
            <span className="inline-flex items-center gap-1"><Monitor size={12} /> Desktop</span>
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-md rounded-3xl border border-border/50 bg-card/80 p-3 shadow-sm text-left">
          <PondBuddy
            lines={[
              "Hi. I'm **Avi**, your pond buddy. I'll keep you honest about what we know and what we don't.",
              'Tap **Open the product** to walk the Free, Premium, and Enterprise demos.',
              'Every figure carries a provenance badge. Sample data stays loud on purpose.',
            ]}
            mood="happy"
          />
        </div>

        <Button size="lg" className="h-12 px-7 text-base" onClick={() => navigate('/demo/free/home')}>
          Open the product
          <ArrowRight className="size-4" />
        </Button>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">Free · Premium · Enterprise</p>

        <Card className="mt-10 border-[color-mix(in_srgb,var(--status-critical)_28%,var(--border))] text-left">
          <CardContent className="px-5 py-4">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--status-critical)]">
              <FlaskConical className="size-3.5" /> A note on honesty
            </div>
            <p className="m-0 text-sm text-foreground">
              This is a concept prototype. The app has <b>zero users</b> and the hardware is{' '}
              <b>TRL 3: nothing flown</b>. Every data figure carries a provenance badge, and anything marked{' '}
              <span className="font-semibold text-[var(--status-critical)]">SAMPLE DATA · NOT REAL</span> is fabricated
              to demonstrate the interface. That discipline is the point, not a disclaimer.
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          <a href="#/charts">Chart gallery ↗</a> · Works fully offline
        </p>
      </motion.div>
    </div>
  );
}
