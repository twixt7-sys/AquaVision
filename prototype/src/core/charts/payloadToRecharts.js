/**
 * Convert an AquaVision chart_payload into recharts data + ChartConfig.
 * Series map onto --chart-1..5 tokens (Theria ChartContainer technique).
 */

const TOKEN_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

/** Chart types safe to render with recharts (honesty-critical types stay on custom SVG). */
export const RECHARTS_TYPES = new Set(['line', 'bar', 'grouped_bar', 'stacked_bar', 'pie', 'donut']);

export function canUseRecharts(doc) {
  if (!doc?.chart_type) return false;
  // Depth profiles, funnels, waterfalls, PondTwin stay on custom SVG.
  if (doc.axes?.y?.reverse || doc.axes?.y?.direction === 'down') return false;
  if (String(doc.id || '').includes('depth') || String(doc.title || '').toLowerCase().includes('depth')) {
    return false;
  }
  return RECHARTS_TYPES.has(doc.chart_type);
}

function seriesKey(s, i) {
  return String(s.key || s.id || s.name || `series_${i}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || `series_${i}`;
}

export function payloadToRecharts(doc) {
  const series = doc.series || [];
  const config = {};
  const keys = series.map((s, i) => {
    const key = seriesKey(s, i);
    config[key] = {
      label: s.name || key,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
    };
    return key;
  });

  // Build a union of x categories / values. Keep null y so connectNulls={false}
  // renders gaps as gaps (never interpolate across missing readings).
  const xMap = new Map();
  series.forEach((s, si) => {
    const key = keys[si];
    for (const d of s.data || []) {
      let x;
      let y;
      if (Array.isArray(d)) {
        [x, y] = d;
      } else if (d && typeof d === 'object') {
        x = d.x;
        y = d.y;
      } else continue;
      const xKey = String(x);
      if (!xMap.has(xKey)) xMap.set(xKey, { x, label: String(x) });
      const num = typeof y === 'number' && !Number.isNaN(y) ? y : null;
      xMap.get(xKey)[key] = num;
    }
  });

  const data = Array.from(xMap.values());

  const hlines = (doc.annotations || [])
    .filter((a) => a.type === 'hline' || a.kind === 'hline')
    .map((a) => ({
      y: a.y ?? a.value,
      label: a.label || a.text || '',
      color: a.severity === 'critical' ? 'var(--status-critical)' : a.severity === 'warning' ? 'var(--status-warning)' : 'var(--muted-foreground)',
    }));

  return {
    data,
    config,
    keys,
    chartType: doc.chart_type,
    hlines,
  };
}
