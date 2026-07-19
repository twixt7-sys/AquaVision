import { Monitor, Smartphone } from 'lucide-react';
import { useFrameMode } from '../../core/state/FrameModeContext.jsx';
import { cn } from './ui/utils.js';

/** Pitch toggle: show the demo in a phone bezel or a desktop canvas. */
export default function FrameModeToggle({ className, compact = false, tone = 'onDark' }) {
  const { frameMode, setFrameMode } = useFrameMode();
  const onDark = tone === 'onDark';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg border p-0.5',
        onDark ? 'border-white/15 bg-black/20' : 'border-border bg-muted/60',
        className,
      )}
      role="group"
      aria-label="View frame"
    >
      <button
        type="button"
        onClick={() => setFrameMode('phone')}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors',
          frameMode === 'phone'
            ? 'bg-accent text-accent-foreground'
            : onDark
              ? 'text-white/70 hover:bg-white/10 hover:text-white'
              : 'text-muted-foreground hover:bg-background hover:text-foreground',
        )}
        title="Phone frame"
      >
        <Smartphone size={12} />
        {!compact && 'Phone'}
      </button>
      <button
        type="button"
        onClick={() => setFrameMode('desktop')}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors',
          frameMode === 'desktop'
            ? 'bg-accent text-accent-foreground'
            : onDark
              ? 'text-white/70 hover:bg-white/10 hover:text-white'
              : 'text-muted-foreground hover:bg-background hover:text-foreground',
        )}
        title="Desktop frame"
      >
        <Monitor size={12} />
        {!compact && 'Desktop'}
      </button>
    </div>
  );
}
