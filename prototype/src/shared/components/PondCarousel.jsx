import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import SpeciesIcon, { SPECIES_META } from './SpeciesIcon.jsx';
import { cn } from './ui/utils.js';

const CARD_GAP = 10;

/** Swipeable/scrollable pond overview  -  big species icon per card so the fish type
 * reads at a glance before the status badge does. Cards open a detail page via onSelect. */
export default function PondCarousel({ ponds, onSelect, className }) {
  const trackRef = useRef(null);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-pond-card]');
    const step = (card?.offsetWidth || 128) + CARD_GAP;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (!ponds?.length) return null;

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ponds.map((pond) => {
          const meta = SPECIES_META[pond.species] || SPECIES_META.tilapia;
          return (
            <button
              key={pond.id}
              type="button"
              data-pond-card
              onClick={() => onSelect?.(pond)}
              className="flex w-[124px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card px-2 py-3 text-center shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
            >
              <span
                className="flex size-12 items-center justify-center rounded-full"
                style={{ background: `color-mix(in srgb, ${meta.color} 16%, transparent)` }}
              >
                <SpeciesIcon species={pond.species} size={28} />
              </span>
              <div className="min-w-0">
                <p className="m-0 truncate text-xs font-semibold leading-tight">{pond.label}</p>
                <p className="m-0 truncate text-[10px] text-muted-foreground">{pond.speciesLabel || meta.label}</p>
              </div>
              <StatusBadge status={pond.status} />
              {pond.caption && (
                <p className="m-0 truncate text-[9px] text-muted-foreground">{pond.caption}</p>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Scroll to previous pond"
        onClick={() => scrollByCard(-1)}
        className="absolute left-0.5 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card/95 p-1 text-foreground shadow-sm sm:flex"
      >
        <ChevronLeft className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Scroll to next pond"
        onClick={() => scrollByCard(1)}
        className="absolute right-0.5 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card/95 p-1 text-foreground shadow-sm sm:flex"
      >
        <ChevronRight className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
