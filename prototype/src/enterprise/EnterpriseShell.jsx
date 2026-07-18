import { useState } from 'react';
import { Menu, Building2, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigate } from '../router.js';
import { TIERS } from '../app/TierContext.jsx';
import TierSwitcher from '../app/TierSwitcher.jsx';
import SampleDataBanner from '../shared/components/SampleDataBanner.jsx';
import AppPageBackground from '../shared/components/AppPageBackground.jsx';
import Sidebar from '../shared/components/Sidebar.jsx';
import { AquaVisionBrandLogo } from '../shared/components/AquaVisionBrandLogo.jsx';
import { Button } from '../shared/components/ui/button.jsx';
import { cn } from '../shared/components/ui/utils.js';

import SiteOverview from './SiteOverview.jsx';
import ProfileView from './ProfileView.jsx';
import MapView from './MapView.jsx';
import HistoryView from './HistoryView.jsx';
import ReportsView from './ReportsView.jsx';
import FleetHealth from './FleetHealth.jsx';
import PondTwin from './pondtwin/PondTwin.jsx';

const VIEWS = {
  overview: SiteOverview,
  profile: ProfileView,
  pondtwin: PondTwin,
  map: MapView,
  history: HistoryView,
  reports: ReportsView,
  fleet: FleetHealth,
};

export default function EnterpriseShell({ screen }) {
  const View = VIEWS[screen] || SiteOverview;
  const screens = TIERS.enterprise.screens;
  const [mobileNav, setMobileNav] = useState(false);
  const activeLabel = screens.find((s) => s.id === screen)?.label || 'Overview';

  return (
    <div className="relative flex min-h-dvh">
      <AppPageBackground />

      <aside className="relative hidden w-[240px] shrink-0 flex-col border-r border-accent/20 bg-gradient-to-b from-[#052A40] via-[#043B66] to-[#031820] md:flex">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/15 to-transparent" />
        <div className="relative border-b border-accent/20 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <AquaVisionBrandLogo size="md" className="-m-1" />
            <div className="min-w-0">
              <div className="text-xs font-bold tracking-[0.16em] text-white">
                AQUA<span className="text-accent">VISION</span>
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1 rounded-sm bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                <Building2 className="size-2.5" aria-hidden />
                Enterprise
              </div>
            </div>
          </div>
          <p className="mt-2 truncate font-mono text-[10px] text-white/45">SYNTH-LAKE-01 · live ops</p>
        </div>
        <nav className="hide-scroll relative flex-1 overflow-y-auto p-2.5">
          <p className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
            Command views
          </p>
          {screens.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => navigate(`/demo/enterprise/${s.id}`)}
              className={cn(
                'mb-0.5 block w-full rounded-md px-3 py-2.5 text-left text-sm transition-all',
                s.id === screen
                  ? 'border-l-2 border-accent bg-gradient-to-r from-accent/20 to-transparent font-semibold text-accent shadow-[inset_0_0_20px_rgba(68,167,210,0.08)]'
                  : 'border-l-2 border-transparent text-white/60 hover:bg-white/5 hover:text-white',
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="relative border-t border-accent/15 p-2.5">
          <div className="mb-2 flex items-center gap-1.5 px-1 font-mono text-[10px] text-accent/80">
            <Radio className="size-3 animate-pulse" aria-hidden />
            Fleet link nominal
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-accent/30 bg-transparent text-white hover:bg-accent/10 hover:text-accent"
            onClick={() => navigate('/')}
          >
            ← Exit demo
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-accent/20 bg-gradient-to-r from-[#043B66] via-[#0B608F] to-[#1C507A] pt-safe shadow-[0_8px_28px_rgba(4,59,102,0.35)]">
          <div className="h-0.5 w-full bg-gradient-to-r from-accent via-white/40 to-accent" />
          <div className="flex items-center gap-3 px-4 py-2.5">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white md:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </Button>
            <div className="min-w-0 md:hidden">
              <AquaVisionBrandLogo size="sm" />
            </div>
            <TierSwitcher />
            <div className="grow" />
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent/90">{activeLabel}</p>
              <p className="font-mono text-[11px] text-white/55">Phase 3 · Smart Aquaculture</p>
            </div>
          </div>
        </header>

        <div className="overflow-y-auto bg-gradient-to-br from-[#E8F4FA] via-background to-[#F0F7FB] px-4 py-4 pb-10 sm:px-6">
          <div className="mb-3.5">
            <SampleDataBanner />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <View />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Sidebar isOpen={mobileNav} onClose={() => setMobileNav(false)} tier="enterprise" screen={screen} />
    </div>
  );
}
