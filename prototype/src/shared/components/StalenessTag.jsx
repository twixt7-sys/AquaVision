// Staleness tag — every status carries its measurement age (dashboard-spec.json:
// "Nominal, measured 14 min ago" vs "logged 9 days ago"). Visual decay past
// thresholds so old data reads as old. Never hidden — freshness is a safety fact.
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
  const color = veryStale ? 'var(--av-unknown)' : stale ? 'var(--av-advisory)' : 'var(--text-2)';
  return (
    <span
      className="tag-mono"
      title={minutes != null ? `${Math.round(minutes)} minutes old` : 'no timestamp'}
      style={{ color, opacity: veryStale ? 0.85 : 1 }}
    >
      {verb} {text}
      {veryStale && ' — stale'}
    </span>
  );
}
