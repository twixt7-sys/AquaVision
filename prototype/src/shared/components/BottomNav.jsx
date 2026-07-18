import { motion } from 'motion/react';
import { Fish, Droplets, UtensilsCrossed, Stethoscope, Sparkles, BarChart3, Home, GraduationCap } from 'lucide-react';
import { navigate } from '../../router.js';
import { AquaVisionLogoMark } from './AquaVisionBrandLogo.jsx';
import { cn } from './ui/utils.js';

const FREE_NAV = [
  { id: 'water', icon: Droplets, label: 'Water', color: 'sky' },
  { id: 'feeding', icon: UtensilsCrossed, label: 'Feed', color: 'amber' },
  { id: 'home', icon: Home, label: 'Home', color: 'primary', center: true },
  { id: 'learning', icon: GraduationCap, label: 'Learn', color: 'teal' },
  { id: 'records', icon: Fish, label: 'Records', color: 'sky' },
];

const PREMIUM_NAV = [
  { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'sky' },
  { id: 'predictive', icon: Sparkles, label: 'Health', color: 'violet' },
  { id: 'recommendations', icon: Home, label: 'Home', color: 'primary', center: true },
  { id: 'marketplace', icon: Fish, label: 'Market', color: 'teal' },
  { id: 'consultation', icon: Stethoscope, label: 'Consult', color: 'rose' },
];

const COLORS = {
  sky: 'text-accent bg-accent/15',
  amber: 'text-[var(--status-advisory)] bg-[var(--status-advisory)]/15',
  rose: 'text-[var(--status-critical)] bg-[var(--status-critical)]/15',
  teal: 'text-[var(--status-ok)] bg-[var(--status-ok)]/15',
  violet: 'text-[var(--prov-target)] bg-[var(--prov-target)]/15',
  primary: 'text-accent bg-accent/15',
};

function WingButton({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-1 rounded-xl p-2 transition-all',
        isActive ? COLORS[item.color] || 'text-accent bg-accent/15' : 'text-white/55 hover:text-white',
      )}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[10px] font-medium leading-none">{item.label}</span>
      {isActive && (
        <motion.div layoutId="nav-dot" className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-current" />
      )}
    </button>
  );
}

export default function BottomNav({ tier, screen, wide = false }) {
  const items = tier === 'premium' ? PREMIUM_NAV : FREE_NAV;
  const isPremium = tier === 'premium';
  const center = items.find((i) => i.center) || items[2];
  const left = items.filter((i) => !i.center).slice(0, 2);
  const right = items.filter((i) => !i.center).slice(2);
  const go = (id) => navigate(`/demo/${tier}/${id}`);

  return (
    <div
      data-slot="bottom-nav"
      className={cn(
        'relative z-50 border-t shadow-[0_-10px_24px_-10px_rgba(0,0,0,0.3)]',
        isPremium
          ? 'border-[#8A6BC4]/30 bg-gradient-to-r from-[#1C507A] via-[#2A3F7A] to-[#4A3A8A]'
          : 'border-white/10 av-nav-chrome',
      )}
    >
      {isPremium && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#8A6BC4] to-transparent" />
      )}
      <div className={cn('relative mx-auto px-2 pb-safe pt-2', wide ? 'max-w-5xl' : 'max-w-lg')}>
        <div className="flex items-end justify-between">
          <div className="mb-2 flex max-w-md flex-1 items-center justify-around">
            {left.map((item) => (
              <WingButton key={item.id} item={item} isActive={screen === item.id} onClick={() => go(item.id)} />
            ))}
          </div>

          <div
            className="relative flex shrink-0 flex-col items-center px-3 transition-all duration-300 ease-out"
            style={{
              transform: screen === center.id ? 'translateY(-1.6rem) scale(1.12)' : 'translateY(0)',
            }}
          >
            <button
              type="button"
              onClick={() => go(center.id)}
              className={cn(
                'group relative flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300',
                isPremium
                  ? 'border-[#8A6BC4]/50 bg-gradient-to-br from-[#2A3F7A] to-[#4A3A8A]'
                  : 'border-white/20 bg-[#1C507A]',
                screen === center.id
                  ? isPremium
                    ? 'scale-110 border-[#C4B0E8]/70 shadow-[0_0_0_3px_rgba(138,107,196,0.35)]'
                    : 'scale-110 border-accent/60 shadow-[0_0_0_3px_rgba(68,167,210,0.25)]'
                  : 'text-white/70 hover:scale-105',
              )}
              aria-label={center.label}
            >
              {screen === center.id && <span className="droplet-ripple rounded-2xl" />}
              {center.id === 'home' || center.id === 'recommendations' ? (
                <AquaVisionLogoMark size="sm" className="relative z-10 h-10 w-10" />
              ) : (
                <center.icon size={18} strokeWidth={2.25} className="relative z-10" />
              )}
            </button>
            {screen === center.id && (
              <div
                className={cn(
                  'absolute -bottom-2 h-4 w-12 animate-pulse rounded-full blur-lg',
                  isPremium ? 'bg-[#8A6BC4]/40' : 'bg-accent/30',
                )}
              />
            )}
          </div>

          <div className="mb-2 flex max-w-md flex-1 items-center justify-around">
            {right.map((item) => (
              <WingButton key={item.id} item={item} isActive={screen === item.id} onClick={() => go(item.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
