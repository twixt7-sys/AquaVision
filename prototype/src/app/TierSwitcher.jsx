import { Crown, Building2 } from 'lucide-react';
import { useTier, TIERS, goToTier } from './TierContext.jsx';
import { Tabs, TabsList, TabsTrigger } from '../shared/components/ui/tabs.jsx';
import { cn } from '../shared/components/ui/utils.js';

const TIER_STYLE_DARK = {
  free: {
    active:
      'data-[state=active]:!bg-white/20 data-[state=active]:!text-white data-[state=active]:shadow-none',
    idle: 'text-white/55 hover:text-white/80',
  },
  premium: {
    active:
      'data-[state=active]:!bg-gradient-to-r data-[state=active]:from-[#8A6BC4] data-[state=active]:to-[#44A7D2] data-[state=active]:!text-white data-[state=active]:shadow-[0_0_0_1px_rgba(138,107,196,0.45),0_4px_14px_rgba(138,107,196,0.35)]',
    idle: 'text-[#C4B0E8]/80 hover:text-[#E4D8F7]',
  },
  enterprise: {
    active:
      'data-[state=active]:!bg-gradient-to-r data-[state=active]:from-[#052A40] data-[state=active]:via-[#0B608F] data-[state=active]:to-[#1C507A] data-[state=active]:!text-accent data-[state=active]:shadow-[0_0_0_1px_rgba(68,167,210,0.5),0_6px_18px_rgba(4,59,102,0.45)] data-[state=active]:ring-1 data-[state=active]:ring-accent/40',
    idle: 'text-accent/70 hover:text-accent',
  },
};

const TIER_STYLE_LIGHT = {
  free: {
    active:
      'data-[state=active]:!bg-[#1C507A] data-[state=active]:!text-white data-[state=active]:shadow-sm',
    idle: 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
  },
  premium: {
    active:
      'data-[state=active]:!bg-gradient-to-r data-[state=active]:from-[#8A6BC4] data-[state=active]:to-[#6B8AD4] data-[state=active]:!text-white data-[state=active]:shadow-sm',
    idle: 'text-[#6B5B95] hover:bg-[#8A6BC4]/10 hover:text-[#5A4A85]',
  },
  enterprise: {
    active:
      'data-[state=active]:!bg-gradient-to-r data-[state=active]:from-[#052A40] data-[state=active]:to-[#0B608F] data-[state=active]:!text-accent data-[state=active]:shadow-sm',
    idle: 'text-[#0B608F] hover:bg-accent/10 hover:text-[#043B66]',
  },
};

export default function TierSwitcher({ tone = 'onDark', className }) {
  const { tier } = useTier();
  const onLight = tone === 'onLight';
  const styles = onLight ? TIER_STYLE_LIGHT : TIER_STYLE_DARK;

  return (
    <Tabs value={tier} onValueChange={goToTier}>
      <TabsList
        className={cn(
          'h-9 gap-0.5 border p-0.5',
          onLight
            ? 'border-border bg-muted/70 text-muted-foreground'
            : tier === 'enterprise'
              ? 'border-accent/30 bg-[#031820]/55 text-white/70'
              : tier === 'premium'
                ? 'border-[#8A6BC4]/35 bg-[#1a1030]/45 text-white/70'
                : 'border-white/15 bg-black/25 text-white/70',
          className,
        )}
        aria-label="Product tier"
      >
        {Object.keys(TIERS).map((k) => {
          const style = styles[k];
          return (
            <TabsTrigger
              key={k}
              value={k}
              className={cn(
                'gap-1 px-2.5 text-xs font-semibold transition-all sm:px-3',
                style.idle,
                style.active,
              )}
            >
              {k === 'premium' && <Crown className="size-3 opacity-90" aria-hidden />}
              {k === 'enterprise' && <Building2 className="size-3 opacity-90" aria-hidden />}
              {TIERS[k].label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
