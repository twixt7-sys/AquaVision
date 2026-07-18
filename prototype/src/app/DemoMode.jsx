import { useState, useEffect } from 'react';
import { Menu, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TierContext, TIERS, tierOf, goToTier } from './TierContext.jsx';
import { navigate } from '../router.js';
import TierSwitcher from './TierSwitcher.jsx';
import EnterpriseShell from '../enterprise/EnterpriseShell.jsx';
import AppPageBackground from '../shared/components/AppPageBackground.jsx';
import BottomNav from '../shared/components/BottomNav.jsx';
import FloatingActionButton from '../shared/components/FloatingActionButton.jsx';
import Sidebar from '../shared/components/Sidebar.jsx';
import UpgradeTeaser from '../shared/components/UpgradeTeaser.jsx';
import FrameModeToggle from '../shared/components/FrameModeToggle.jsx';
import PhoneFrame, { DesktopFrame, useFrameSize } from '../shared/components/PhoneFrame.jsx';
import { useFrameMode } from '../core/state/FrameModeContext.jsx';
import { AquaVisionBrandLogo } from '../shared/components/AquaVisionBrandLogo.jsx';
import { Button } from '../shared/components/ui/button.jsx';
import { Pad } from './screens/_kit.jsx';
import { cn } from '../shared/components/ui/utils.js';

import Home from './screens/Home.jsx';
import AssistantChat from './screens/AssistantChat.jsx';
import SetupWizard from './screens/SetupWizard.jsx';
import WaterLog from './screens/WaterLog.jsx';
import Feeding from './screens/Feeding.jsx';
import DiseaseId from './screens/DiseaseId.jsx';
import Forum from './screens/Forum.jsx';
import Learning from './screens/Learning.jsx';
import Records from './screens/Records.jsx';
import Analytics from './screens/Analytics.jsx';
import PredictiveHealth from './screens/PredictiveHealth.jsx';
import Recommendations from './screens/Recommendations.jsx';
import Marketplace from './screens/Marketplace.jsx';
import Consultation from './screens/Consultation.jsx';

const SCREENS = {
  free: {
    home: Home,
    assistant: AssistantChat,
    setup: SetupWizard,
    water: WaterLog,
    feeding: Feeding,
    disease: DiseaseId,
    forum: Forum,
    learning: Learning,
    records: Records,
  },
  premium: {
    analytics: Analytics,
    predictive: PredictiveHealth,
    recommendations: Recommendations,
    marketplace: Marketplace,
    consultation: Consultation,
  },
};

function DemoChrome({ tier, screen, pageTitle, setSidebarOpen, children, fab, sidebar }) {
  const { frameMode } = useFrameMode();
  const isPhone = frameMode === 'phone';
  const isPremium = tier === 'premium';
  const Frame = isPhone ? PhoneFrame : DesktopFrame;
  const [frameSize, setFrameSize] = useFrameSize(frameMode);

  const shell = (
    <div
      className={cn(
        'relative flex h-full min-h-0 flex-col',
        isPremium && 'bg-gradient-to-b from-[#F5F0FB]/80 via-background to-background',
      )}
    >
      <header
        className={cn(
          'sticky top-0 z-40 shrink-0 border-b pt-safe shadow-md',
          isPremium
            ? 'border-[#8A6BC4]/35 bg-gradient-to-r from-[#1C507A] via-[#2A3F7A] to-[#4A3A8A] text-white'
            : 'border-white/10 av-nav-chrome',
        )}
      >
        {isPremium && (
          <div className="h-0.5 w-full bg-gradient-to-r from-[#8A6BC4] via-[#44A7D2] to-[#8A6BC4]" />
        )}
        <div className={cn('mx-auto flex items-center gap-2 px-3 py-1.5', isPhone ? 'max-w-lg' : 'max-w-5xl')}>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl p-1 text-left outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent"
            title="Menu"
          >
            <AquaVisionBrandLogo size="md" className="-m-1" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[9px] font-bold tracking-wide text-white">
                  Aqua<span className="text-accent">Vision</span>
                </p>
                {isPremium && (
                  <span className="inline-flex items-center gap-0.5 rounded-sm bg-[#8A6BC4]/90 px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-white">
                    <Sparkles className="size-2.5" aria-hidden />
                    Premium
                  </span>
                )}
              </div>
              <p className="truncate text-[10px] text-white/65">{pageTitle}</p>
            </div>
          </button>

          <TierSwitcher />

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-white hover:bg-white/10 hover:text-white sm:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden shrink-0 text-white hover:bg-white/10 hover:text-white sm:inline-flex"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={14} /> Exit
          </Button>
        </div>
      </header>

      <main className={cn('hide-scroll min-h-0 flex-1 overflow-y-auto', isPhone ? 'max-w-lg' : 'max-w-5xl', 'mx-auto w-full')}>
        {children}
      </main>

      <div className="relative shrink-0">
        <BottomNav tier={tier} screen={screen} wide={!isPhone} />
      </div>

      {fab}
      {sidebar}
    </div>
  );

  return (
    <div className="relative flex min-h-dvh flex-col items-center gap-3 px-3 py-4 sm:px-6 sm:py-6">
      <AppPageBackground />
      <div
        className="relative z-10 flex w-full max-w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/85 px-3 py-2 shadow-sm backdrop-blur-sm"
        style={{ width: frameSize.w }}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Pitch frame
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {frameSize.w}×{frameSize.h} · drag corner to resize
          </p>
        </div>
        <FrameModeToggle tone="onLight" />
      </div>
      <Frame className="relative z-10" size={frameSize} onResize={setFrameSize}>
        {shell}
      </Frame>
    </div>
  );
}

export default function DemoMode({ parts }) {
  const tier = TIERS[parts[1]] ? parts[1] : 'free';
  const t = tierOf(tier);
  const screen = parts[2] || t.screens[0].id;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const ctx = { tier, screen, setTier: goToTier };

  useEffect(() => {
    setFabOpen(false);
  }, [screen, tier]);

  if (tier === 'enterprise') {
    return (
      <TierContext.Provider value={ctx}>
        <EnterpriseShell screen={screen} />
      </TierContext.Provider>
    );
  }

  const isPremiumScreen = Object.keys(SCREENS.premium).includes(screen);
  const Screen =
    tier === 'free' && isPremiumScreen
      ? () => (
          <Pad>
            <UpgradeTeaser tier="Premium">
              This is a Premium feature. It becomes available when a farm outgrows manual logging. The upgrade is
              need-triggered, not pushed.
            </UpgradeTeaser>
          </Pad>
        )
      : SCREENS[tier]?.[screen] || SCREENS[tier]?.[t.screens[0].id];

  const pageTitle = t.screens.find((s) => s.id === screen)?.label || t.label;

  return (
    <TierContext.Provider value={ctx}>
      <DemoChrome
        tier={tier}
        screen={screen}
        pageTitle={pageTitle}
        setSidebarOpen={setSidebarOpen}
        fab={
          tier === 'free' ? (
            <FloatingActionButton isOpen={fabOpen} onToggle={() => setFabOpen((v) => !v)} />
          ) : null
        }
        sidebar={
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} tier={tier} screen={screen} />
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tier}-${screen}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </DemoChrome>
    </TierContext.Provider>
  );
}
