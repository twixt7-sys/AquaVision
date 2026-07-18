import { cn } from './ui/utils.js';

function humanizeMinutes(mins) {
  if (mins == null) return 'no timestamp';
  if (mins < 1) return 'just now';
  if (mins < 60) return `${Math.round(mins)} min ago`;
  const hrs = mins / 60;
  if (hrs < 24) return `${Math.round(hrs)} h ago`;
  const days = hrs / 24;
  return `${Math.round(days)} day${Math.round(days) === 1 ? '' : 's'} ago`;
}

export default function StalenessTag({ minutes, verb = 'measured', staleAfterMin = 120 }) {
  const text = humanizeMinutes(minutes);
  const stale = minutes != null && minutes > staleAfterMin;
  const veryStale = minutes != null && minutes > staleAfterMin * 12;
  return (
    <span
      data-slot="staleness-tag"
      title={minutes != null ? `${Math.round(minutes)} minutes old` : 'no timestamp'}
      className={cn(
        'font-mono text-xs tracking-wide',
        veryStale && 'text-[var(--status-nodata)] opacity-85',
        stale && !veryStale && 'text-[var(--status-advisory)]',
        !stale && 'text-muted-foreground',
      )}
    >
      {verb} {text}
      {veryStale && ', stale'}
    </span>
  );
}
