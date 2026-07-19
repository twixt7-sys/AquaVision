import {
  Home,
  MessageCircle,
  Droplets,
  UtensilsCrossed,
  Stethoscope,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  Sparkles,
  ShoppingBag,
  Phone,
  Waves,
  Radar,
  Map,
  History,
  FileText,
  Send,
  X,
} from 'lucide-react';
import { navigate } from '../../router.js';
import { TIERS } from '../../app/TierContext.jsx';
import { AquaVisionBrandLogo } from './AquaVisionBrandLogo.jsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet.jsx';
import { cn } from './ui/utils.js';

const ICONS = {
  home: Home,
  assistant: MessageCircle,
  setup: ClipboardList,
  water: Droplets,
  feeding: UtensilsCrossed,
  disease: Stethoscope,
  forum: Users,
  learning: BookOpen,
  records: ClipboardList,
  analytics: BarChart3,
  predictive: Sparkles,
  recommendations: Sparkles,
  marketplace: ShoppingBag,
  consultation: Phone,
  overview: Radar,
  profile: Waves,
  pondtwin: Waves,
  map: Map,
  history: History,
  reports: FileText,
  fleet: Send,
};

export default function Sidebar({ isOpen, onClose, tier, screen }) {
  const t = TIERS[tier] || TIERS.free;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[280px] gap-0 p-0 sm:max-w-[280px]">
        <SheetHeader className="border-b border-border/50 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <AquaVisionBrandLogo size="md" className="-m-1" />
            <div>
              <SheetTitle className="text-sm tracking-[0.16em] text-foreground">
                AQUA<span className="text-accent">VISION</span>
              </SheetTitle>
              <SheetDescription className="font-mono text-[11px]">{t.label} · demo</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-2.5">
          <p className="section-title px-2 pt-1">{t.label} screens</p>
          {t.screens.map((s) => {
            const Icon = ICONS[s.id] || Home;
            const active = s.id === screen;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  navigate(`/demo/${tier}/${s.id}`);
                  onClose();
                }}
                className={cn(
                  'mb-0.5 flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors',
                  active
                    ? 'border-l-2 border-accent bg-muted text-accent'
                    : 'border-l-2 border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                <Icon size={16} strokeWidth={active ? 2.4 : 2} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-2.5">
          <button
            type="button"
            className="btn btn-ghost btn-sm w-full justify-center"
            onClick={() => {
              navigate('/');
              onClose();
            }}
          >
            <X size={14} /> Exit demo
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
