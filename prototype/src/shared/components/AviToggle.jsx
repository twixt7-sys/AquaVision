import { BuddyFace } from './PondBuddy.jsx';
import { useAvi } from '../../core/state/AviContext.jsx';
import { cn } from './ui/utils.js';

/** Small fish-face button that shows/hides Avi  -  same pattern as Theria's TerryToggle. */
export function AviToggle({ className }) {
  const { aviVisible, toggleAvi } = useAvi();

  return (
    <button
      type="button"
      onClick={toggleAvi}
      aria-pressed={aviVisible}
      aria-label={aviVisible ? 'Hide Avi' : 'Show Avi'}
      title={aviVisible ? 'Hide Avi' : 'Show Avi'}
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/70 shadow-sm transition-all hover:scale-110 active:scale-95',
        aviVisible ? 'opacity-100' : 'opacity-50 grayscale',
        className,
      )}
    >
      <span className="h-5 w-5">
        <BuddyFace mood="happy" />
      </span>
    </button>
  );
}

export default AviToggle;
