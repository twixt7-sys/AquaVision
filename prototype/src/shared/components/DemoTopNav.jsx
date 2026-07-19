import { ArrowLeft, Minus, Plus } from 'lucide-react';
import TierSwitcher from '../../app/TierSwitcher.jsx';
import FrameModeToggle from './FrameModeToggle.jsx';
import { useUiDensity } from '../../core/state/UiDensityContext.jsx';
import { navigate } from '../../router.js';
import { Button } from './ui/button.jsx';
import { cn } from './ui/utils.js';

/**
 * Demo chrome above the pitch frame: tier, phone/desktop, and in-frame UI scale.
 */
export default function DemoTopNav({
  frameSize,
  showFrameControls = true,
  className,
}) {
  const { density, canZoomIn, canZoomOut, zoomIn, zoomOut } = useUiDensity();
  const pct = Math.round(density * 100);

  return (
    <header
      className={cn(
        'relative z-50 w-full border-b border-border/70 bg-card/90 shadow-sm backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Demo controls
          </p>
          {showFrameControls && frameSize ? (
            <p className="font-mono text-[10px] text-muted-foreground">
              {frameSize.w}×{frameSize.h} · drag corner to resize
            </p>
          ) : (
            <p className="font-mono text-[10px] text-muted-foreground">
              Full canvas · frame applies to Free / Premium
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:justify-center">
          <TierSwitcher tone="onLight" />
          <FrameModeToggle tone="onLight" />
          <div
            className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/60 p-0.5"
            role="group"
            aria-label="Component size inside frame"
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={!canZoomOut}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-35"
              title="Smaller components"
              aria-label="Smaller components"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            <span className="min-w-[2.5rem] text-center font-mono text-[10px] font-semibold tabular-nums text-foreground">
              {pct}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={!canZoomIn}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-35"
              title="Larger components"
              aria-label="Larger components"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={14} /> Exit
        </Button>
      </div>
    </header>
  );
}
