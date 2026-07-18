import { FlaskConical } from 'lucide-react';
import { cn } from './ui/utils.js';

export default function SampleDataBanner({ compact = false }) {
  return (
    <div
      role="note"
      data-slot="sample-data-banner"
      className={cn(
        'flex items-center gap-2.5 rounded-md border-l-4 border-[var(--status-critical)]',
        'bg-[color-mix(in_srgb,var(--status-critical)_12%,var(--card))] text-foreground',
        compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2.5 text-sm',
      )}
    >
      <span className="inline-flex items-center gap-1.5 font-bold tracking-wide text-[var(--status-critical)] whitespace-nowrap">
        <FlaskConical className="size-3.5 shrink-0" aria-hidden />
        SAMPLE DATA · NOT REAL
      </span>
      {!compact && (
        <span className="text-muted-foreground">
          Every number shown here is fabricated to demonstrate the interface. It describes no real pond, fish, or sortie.
        </span>
      )}
    </div>
  );
}
