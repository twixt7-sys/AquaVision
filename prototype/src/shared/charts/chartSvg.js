// chart_payload -> inline SVG string. Ported near-verbatim from
// site-generator/lib/charts.mjs (the proven renderer). Brand rules honoured:
// gaps rendered as gaps (no interpolation), depth axes increase downward,
// series colours in brand order, thresholds dashed + labelled, funnels honest-empty.
// Differences from the original: no html.mjs dependency (esc inlined), and the
// provenance badge is rendered by the React <ProvenanceBadge> in ChartFigure,
// so these functions return only the chart body markup.

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const escAttr = esc;

const SERIES_COLORS = ['var(--av-current)', 'var(--av-ocean)', 'var(--av-shallow)', 'var(--av-mist)', 'var(--av-slate)'];
const SEVERITY = {
  info: 'var(--av-slate)',
  advisory: 'var(--av-advisory)',
  warning: 'var(--av-warning)',
  critical: 'var(--av-critical)',
};

const fmt = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const r = Math.round(n * 100) / 100;
  return Math.abs(r) >= 1000 ? r.toLocaleString('en-US') : String(r);
};

function niceTicks(min, max, count = 5) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) || 10 * mag;
  const ticks = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) ticks.push(Math.round(t * 1e6) / 1e6);
  return ticks;
}

function wrapText(s, maxChars) {
  const words = String(s).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

function tspans(lines, x, y, lh = 12) {
  return lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(l)}</tspan>`).join('');
}

function parsePoints(data) {
  const points = [];
  let categorical = false;
  for (const d of data || []) {
    if (Array.isArray(d)) points.push({ x: d[0], y: d[1] });
    else if (d && typeof d === 'object' && 'x' in d) {
      if (typeof d.x !== 'number') categorical = true;
      points.push({ x: d.x, y: d.y, meta: d.meta });
    }
  }
  return { points, categorical };
}

function extent(vals, pad = 0) {
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (!Number.isFinite(lo)) { lo = 0; hi = 1; }
  const p = (hi - lo || 1) * pad;
  return [lo - p, hi + p];
}

function legend(seriesNames) {
  return `<ul class="chart-legend">${seriesNames
    .map((n, i) => `<li><span class="swatch" style="background:${SERIES_COLORS[i % SERIES_COLORS.length]}"></span>${esc(n)}</li>`)
    .join('')}</ul>`;
}

function annotationList(annos) {
  if (!annos?.length) return '';
  return `<ul class="anno-list">${annos
    .map((a) => {
      const sev = a.severity || 'info';
      return `<li class="anno anno-${sev}"><span>${sev === 'critical' ? '⚠' : sev === 'warning' ? '!' : 'ℹ'}</span>${esc(a.label || '')}</li>`;
    })
    .join('')}</ul>`;
}

function axisLabel(ax) {
  if (!ax) return '';
  return ax.unit ? `${ax.label} (${ax.unit})` : ax.label || '';
}

function pathWithGaps(points, X, Y, color) {
  let out = '';
  let seg = [];
  const flush = () => {
    if (seg.length > 1) out += `<polyline points="${seg.map(([a, b]) => `${a},${b}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>`;
    else if (seg.length === 1) out += `<circle cx="${seg[0][0]}" cy="${seg[0][1]}" r="3" fill="${color}"/>`;
    seg = [];
  };
  for (const p of points) {
    if (p.y === null || p.y === undefined) flush();
    else seg.push([Math.round(X(p.x) * 10) / 10, Math.round(Y(p.y) * 10) / 10]);
  }
  flush();
  for (const p of points) {
    if (p.y !== null && p.y !== undefined) out += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="2.4" fill="${color}"/>`;
  }
  return out;
}

function svgWrap(W, H, inner) {
  return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img">${inner}</svg>`;
}

/* ---------------- line (numeric x) ---------------- */
function lineChart(doc) {
  const seriesList = doc.series.map((s) => ({ ...s, ...parsePoints(s.data) }));
  if (seriesList.some((s) => s.categorical)) return categoricalLine(doc, seriesList);

  const yDown = /depth/i.test(doc.axes?.y?.label || '');
  const units = [...new Set(seriesList.map((s) => s.unit))];
  if (yDown && (units.length > 1 || seriesList.length > 1)) return depthPanels(doc, seriesList);

  const W = 760, H = 400, m = { t: 16, r: 24, b: 44, l: 56 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const allX = seriesList.flatMap((s) => s.points.map((p) => p.x));
  const allY = seriesList.flatMap((s) => s.points.map((p) => p.y)).filter((v) => v !== null && v !== undefined);
  const [xmin, xmax] = [doc.axes?.x?.min ?? extent(allX)[0], doc.axes?.x?.max ?? extent(allX)[1]];
  const [ymin, ymax] = [doc.axes?.y?.min ?? extent(allY, 0.05)[0], doc.axes?.y?.max ?? extent(allY, 0.05)[1]];
  const X = (v) => m.l + ((v - xmin) / (xmax - xmin)) * iw;
  const Y = (v) => (yDown ? m.t + ((v - ymin) / (ymax - ymin)) * ih : m.t + ih - ((v - ymin) / (ymax - ymin)) * ih);

  let out = '';
  for (const a of doc.annotations || []) {
    if (a.kind === 'band' && Array.isArray(a.value)) {
      const [b0, b1] = a.value;
      out += `<rect x="${X(b0)}" y="${m.t}" width="${X(b1) - X(b0)}" height="${ih}" fill="${SEVERITY[a.severity] || SEVERITY.info}" opacity="0.10"><title>${escAttr(a.label || '')}</title></rect>`;
      out += `<text class="anno-text" x="${(X(b0) + X(b1)) / 2}" y="${m.t + 12}" text-anchor="middle" fill="${SEVERITY[a.severity] || SEVERITY.info}">${tspans(wrapText(a.label || '', 22), (X(b0) + X(b1)) / 2)}</text>`;
    }
  }
  const yticks = niceTicks(ymin, ymax, 6);
  for (const t of yticks) {
    out += `<line class="grid" x1="${m.l}" y1="${Y(t)}" x2="${m.l + iw}" y2="${Y(t)}"/>`;
    out += `<text class="tick" x="${m.l - 8}" y="${Y(t) + 4}" text-anchor="end">${fmt(t)}</text>`;
  }
  const xticks = niceTicks(xmin, xmax, 8);
  for (const t of xticks) {
    out += `<text class="tick" x="${X(t)}" y="${m.t + ih + 18}" text-anchor="middle">${fmt(t)}</text>`;
  }
  out += `<line class="axis" x1="${m.l}" y1="${m.t + ih}" x2="${m.l + iw}" y2="${m.t + ih}"/>`;
  out += `<line class="axis" x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ih}"/>`;
  out += `<text class="axis-label" x="${m.l + iw / 2}" y="${H - 6}" text-anchor="middle">${esc(axisLabel(doc.axes?.x))}</text>`;
  out += `<text class="axis-label" transform="rotate(-90)" x="${-(m.t + ih / 2)}" y="14" text-anchor="middle">${esc(axisLabel(doc.axes?.y))}</text>`;

  for (const a of doc.annotations || []) {
    if (a.kind === 'hline') {
      const c = SEVERITY[a.severity] || SEVERITY.warning;
      out += `<line x1="${m.l}" y1="${Y(a.value)}" x2="${m.l + iw}" y2="${Y(a.value)}" stroke="${c}" stroke-dasharray="6 4" stroke-width="1.5"/>`;
      out += `<text class="anno-text" x="${m.l + iw - 4}" y="${Y(a.value) - 5}" text-anchor="end" fill="${c}">${esc(`${a.label || ''} (${fmt(a.value)})`)}</text>`;
    }
    if (a.kind === 'vline') {
      const c = SEVERITY[a.severity] || SEVERITY.warning;
      out += `<line x1="${X(a.value)}" y1="${m.t}" x2="${X(a.value)}" y2="${m.t + ih}" stroke="${c}" stroke-dasharray="6 4" stroke-width="1.5"/>`;
      out += `<text class="anno-text" x="${X(a.value) + 4}" y="${m.t + 12}" fill="${c}">${esc(a.label || '')}</text>`;
    }
  }

  seriesList.forEach((s, i) => {
    const color = SERIES_COLORS[i % SERIES_COLORS.length];
    out += pathWithGaps(s.points, X, Y, color);
  });

  for (const a of doc.annotations || []) {
    if (a.kind === 'point_label' && Array.isArray(a.value)) {
      const [px, py] = a.value;
      const c = SEVERITY[a.severity] || SEVERITY.info;
      const cx = X(px), cy = Y(py);
      const left = cx > m.l + iw * 0.55;
      const lines = wrapText(a.label || '', 26);
      const tx = left ? cx - 12 : cx + 12;
      let ty = cy - (lines.length - 1) * 6;
      ty = Math.max(m.t + 14, Math.min(ty, m.t + ih - lines.length * 12));
      out += `<circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="${c}" stroke-width="2"/>`;
      out += `<text class="anno-text" x="${tx}" y="${ty}" text-anchor="${left ? 'end' : 'start'}" fill="${c}">${tspans(lines, tx)}</text>`;
    }
  }

  return svgWrap(W, H, out) + legend(seriesList.map((s) => s.name));
}

/* ------------- depth small multiples ------------- */
function depthPanels(doc, seriesList) {
  const n = seriesList.length;
  const H = 380, m = { t: 40, b: 40 };
  const gutter = 46, gap = 18, panelW = Math.floor((760 - gutter - gap * n) / n);
  const W = gutter + n * (panelW + gap);
  const ih = H - m.t - m.b;
  const dvals = seriesList.flatMap((s) => s.points.map((p) => p.y));
  const dmin = doc.axes?.y?.min ?? extent(dvals)[0];
  const dmax = doc.axes?.y?.max ?? extent(dvals)[1];
  const Yd = (v) => m.t + ((v - dmin) / (dmax - dmin)) * ih;

  let out = '';
  const dticks = niceTicks(dmin, dmax, 6);
  for (const t of dticks) {
    out += `<text class="tick" x="${gutter - 8}" y="${Yd(t) + 4}" text-anchor="end">${fmt(t)}</text>`;
  }
  out += `<text class="axis-label" transform="rotate(-90)" x="${-(m.t + ih / 2)}" y="12" text-anchor="middle">${esc(axisLabel(doc.axes?.y))} ↓</text>`;

  seriesList.forEach((s, i) => {
    const x0 = gutter + i * (panelW + gap);
    const color = SERIES_COLORS[i % SERIES_COLORS.length];
    const vals = s.points.map((p) => p.x).filter((v) => v !== null && v !== undefined);
    const [vmin, vmax] = extent(vals, 0.12);
    const Xv = (v) => x0 + ((v - vmin) / (vmax - vmin)) * panelW;

    for (const a of doc.annotations || []) {
      if (a.kind === 'band' && Array.isArray(a.value)) {
        out += `<rect x="${x0}" y="${Yd(a.value[0])}" width="${panelW}" height="${Yd(a.value[1]) - Yd(a.value[0])}" fill="${SEVERITY[a.severity] || SEVERITY.info}" opacity="0.10"><title>${escAttr(a.label || '')}</title></rect>`;
      }
    }
    for (const t of dticks) out += `<line class="grid" x1="${x0}" y1="${Yd(t)}" x2="${x0 + panelW}" y2="${Yd(t)}"/>`;
    out += `<rect x="${x0}" y="${m.t}" width="${panelW}" height="${ih}" class="panel-frame" fill="none"/>`;

    const name = String(s.name).replace(/\s*—\s*SYNTHETIC\s*$/i, '');
    out += `<text class="panel-title" x="${x0 + panelW / 2}" y="${m.t - 22}" text-anchor="middle" fill="${color}">${tspans(wrapText(name, 26).slice(0, 2), x0 + panelW / 2, 0, 12)}<title>${escAttr(s.name)}</title></text>`;

    const vticks = niceTicks(vmin, vmax, 3);
    for (const t of vticks) {
      out += `<text class="tick" x="${Xv(t)}" y="${m.t + ih + 16}" text-anchor="middle">${fmt(t)}</text>`;
    }
    if (s.unit) out += `<text class="axis-label" x="${x0 + panelW / 2}" y="${H - 6}" text-anchor="middle">${esc(s.unit)}</text>`;

    out += pathWithGaps(s.points.map((p) => ({ x: p.x, y: p.y })), Xv, Yd, color);

    for (const a of doc.annotations || []) {
      if (a.kind === 'point_label' && Array.isArray(a.value)) {
        const [v, d] = a.value;
        const hit = s.points.some((p) => Math.abs(p.x - v) < 1e-9 && Math.abs(p.y - d) < 1e-9);
        if (!hit) continue;
        const c = SEVERITY[a.severity] || SEVERITY.info;
        const cx = Xv(v), cy = Yd(d);
        const left = cx > x0 + panelW * 0.5;
        const lines = wrapText(a.label || '', 20);
        const tx = left ? cx - 10 : cx + 10;
        let ty = Math.max(m.t + 12, Math.min(cy - (lines.length - 1) * 6, m.t + ih - lines.length * 11));
        out += `<circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="${c}" stroke-width="2"/>`;
        out += `<text class="anno-text" x="${tx}" y="${ty}" text-anchor="${left ? 'end' : 'start'}" fill="${c}">${tspans(lines, tx, 0, 11)}</text>`;
      }
    }
  });

  const bandAnnos = (doc.annotations || []).filter((a) => a.kind === 'band');
  return svgWrap(W, H, out) + legend(seriesList.map((s) => s.name)) + annotationList(bandAnnos);
}

/* ---------------- categorical line ---------------- */
function categoricalLine(doc, seriesList) {
  const cats = seriesList[0].points.map((p) => String(p.x));
  const W = 760, H = 380, m = { t: 24, r: 24, b: 64, l: 46 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const allY = seriesList.flatMap((s) => s.points.map((p) => p.y)).filter((v) => v != null);
  const ymin = doc.axes?.y?.min ?? Math.min(0, ...allY);
  const ymax = doc.axes?.y?.max ?? extent(allY, 0.1)[1];
  const X = (i) => m.l + (cats.length === 1 ? iw / 2 : (i / (cats.length - 1)) * iw);
  const Y = (v) => m.t + ih - ((v - ymin) / (ymax - ymin)) * ih;

  let out = '';
  const yticks = niceTicks(ymin, ymax, 6);
  for (const t of yticks) {
    out += `<line class="grid" x1="${m.l}" y1="${Y(t)}" x2="${m.l + iw}" y2="${Y(t)}"/>`;
    out += `<text class="tick" x="${m.l - 8}" y="${Y(t) + 4}" text-anchor="end">${fmt(t)}</text>`;
  }
  out += `<line class="axis" x1="${m.l}" y1="${m.t + ih}" x2="${m.l + iw}" y2="${m.t + ih}"/>`;
  cats.forEach((c, i) => {
    out += `<text class="tick" x="${X(i)}" y="${m.t + ih + 16}" text-anchor="middle">${tspans(wrapText(c, 14).slice(0, 2), X(i), 0, 11)}</text>`;
  });

  seriesList.forEach((s, si) => {
    const color = SERIES_COLORS[si % SERIES_COLORS.length];
    out += pathWithGaps(s.points.map((p, i) => ({ x: i, y: p.y })), X, Y, color);
    s.points.forEach((p, i) => {
      if (p.y == null) return;
      out += `<circle cx="${X(i)}" cy="${Y(p.y)}" r="4" fill="${color}">${p.meta ? `<title>${escAttr(p.meta)}</title>` : ''}</circle>`;
      out += `<text class="tick" x="${X(i)}" y="${Y(p.y) - 10}" text-anchor="middle">${fmt(p.y)}</text>`;
    });
  });

  for (const a of doc.annotations || []) {
    if (a.kind !== 'point_label' || typeof a.value !== 'string') continue;
    const i = cats.findIndex((c) => c === a.value || c.startsWith(a.value));
    if (i < 0) continue;
    const c = SEVERITY[a.severity] || SEVERITY.info;
    out += `<line x1="${X(i)}" y1="${m.t}" x2="${X(i)}" y2="${m.t + ih}" stroke="${c}" stroke-dasharray="3 4" opacity="0.6"/>`;
  }

  return svgWrap(W, H, out) + legend(seriesList.map((s) => s.name)) + annotationList((doc.annotations || []).filter((a) => typeof a.value === 'string'));
}

/* ---------------- grouped bar ---------------- */
function barChart(doc) {
  const seriesList = doc.series.map((s) => ({ ...s, ...parsePoints(s.data) }));
  const cats = [...new Set(seriesList.flatMap((s) => s.points.map((p) => String(p.x))))];
  const W = 760, H = 380, m = { t: 24, r: 24, b: 60, l: 56 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const allY = seriesList.flatMap((s) => s.points.map((p) => p.y)).filter((v) => v != null);
  const ymin = Math.min(0, ...allY);
  const ymax = doc.axes?.y?.max ?? extent(allY, 0.1)[1];
  const Y = (v) => m.t + ih - ((v - ymin) / (ymax - ymin)) * ih;
  const slot = iw / cats.length;
  const barW = Math.min(64, (slot * 0.7) / seriesList.length);

  let out = '';
  const yticks = niceTicks(ymin, ymax, 6);
  for (const t of yticks) {
    out += `<line class="grid" x1="${m.l}" y1="${Y(t)}" x2="${m.l + iw}" y2="${Y(t)}"/>`;
    out += `<text class="tick" x="${m.l - 8}" y="${Y(t) + 4}" text-anchor="end">${fmt(t)}</text>`;
  }
  out += `<line class="axis" x1="${m.l}" y1="${Y(0)}" x2="${m.l + iw}" y2="${Y(0)}"/>`;
  if (doc.axes?.y) out += `<text class="axis-label" transform="rotate(-90)" x="${-(m.t + ih / 2)}" y="14" text-anchor="middle">${esc(axisLabel(doc.axes.y))}</text>`;

  cats.forEach((c, ci) => {
    const cx = m.l + slot * ci + slot / 2;
    out += `<text class="tick" x="${cx}" y="${m.t + ih + 18}" text-anchor="middle">${tspans(wrapText(c, 16).slice(0, 2), cx, 0, 11)}</text>`;
    seriesList.forEach((s, si) => {
      const p = s.points.find((q) => String(q.x) === c);
      if (!p || p.y == null) return;
      const color = SERIES_COLORS[si % SERIES_COLORS.length];
      const groupW = barW * seriesList.length;
      const bx = cx - groupW / 2 + si * barW;
      out += `<rect x="${bx}" y="${Math.min(Y(p.y), Y(0))}" width="${barW - 3}" height="${Math.abs(Y(p.y) - Y(0))}" fill="${color}" rx="2">${p.meta ? `<title>${escAttr(p.meta)}</title>` : ''}</rect>`;
      out += `<text class="tick" x="${bx + (barW - 3) / 2}" y="${Y(Math.max(p.y, 0)) - 6}" text-anchor="middle">${fmt(p.y)}</text>`;
    });
  });

  return svgWrap(W, H, out) + legend(seriesList.map((s) => s.name));
}

/* ---------------- donut ---------------- */
function donutSvg(points, title) {
  const R = 92, r = 54, C = 110;
  const total = points.reduce((a, p) => a + (p.y || 0), 0);
  let angle = -Math.PI / 2;
  let out = '';
  points.forEach((p, i) => {
    const frac = (p.y || 0) / total;
    const a2 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const [x1, y1] = [C + R * Math.cos(angle), C + R * Math.sin(angle)];
    const [x2, y2] = [C + R * Math.cos(a2), C + R * Math.sin(a2)];
    const [x3, y3] = [C + r * Math.cos(a2), C + r * Math.sin(a2)];
    const [x4, y4] = [C + r * Math.cos(angle), C + r * Math.sin(angle)];
    const color = SERIES_COLORS[i % SERIES_COLORS.length];
    out += `<path d="M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 ${large} 0 ${x4},${y4} Z" fill="${color}" stroke="var(--surface)" stroke-width="1.5"><title>${escAttr(`${p.x}: ${fmt(p.y)}`)}</title></path>`;
    angle = a2;
  });
  const legendItems = points
    .map((p, i) => `<li><span class="swatch" style="background:${SERIES_COLORS[i % SERIES_COLORS.length]}"></span>${esc(String(p.x))} <b class="num">${fmt(p.y)}%</b></li>`)
    .join('');
  return `<div class="donut">
<svg viewBox="0 0 220 220" role="img" aria-label="${escAttr(title)}">${out}</svg>
<div><h4>${esc(title)}</h4><ul class="chart-legend chart-legend-col">${legendItems}</ul></div>
</div>`;
}

function donutChart(doc) {
  let out = '<div class="donut-row">';
  for (const s of doc.series) {
    out += donutSvg(parsePoints(s.data).points, s.name);
  }
  if (doc.secondary_series?.data) {
    out += donutSvg(parsePoints(doc.secondary_series.data).points, doc.secondary_series.name);
  }
  out += '</div>';
  if (doc.secondary_series?.note) out += `<p class="muted">${esc(doc.secondary_series.note)}</p>`;
  return out;
}

/* ---------------- radar ---------------- */
function radarChart(doc) {
  const dims = doc.axes_dimensions || [...new Set(doc.series.flatMap((s) => s.data.map((d) => d.axis)))];
  const N = dims.length;
  const W = 620, H = 470, C = { x: 300, y: 235 }, R = 150;
  const maxV = Math.max(...doc.series.flatMap((s) => s.data.map((d) => d.value)), 5);
  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const pt = (i, v) => [C.x + (R * v / maxV) * Math.cos(angle(i)), C.y + (R * v / maxV) * Math.sin(angle(i))];

  let out = '';
  for (let ring = 1; ring <= maxV; ring++) {
    const pts = dims.map((_, i) => pt(i, ring).join(',')).join(' ');
    out += `<polygon points="${pts}" fill="none" class="grid"/>`;
  }
  dims.forEach((d, i) => {
    const [x, y] = pt(i, maxV);
    out += `<line class="grid" x1="${C.x}" y1="${C.y}" x2="${x}" y2="${y}"/>`;
    const [lx, ly] = pt(i, maxV * 1.22);
    const anchor = Math.abs(Math.cos(angle(i))) < 0.3 ? 'middle' : Math.cos(angle(i)) > 0 ? 'start' : 'end';
    const lines = wrapText(d, 14);
    out += `<text class="tick" x="${lx}" y="${ly - (lines.length - 1) * 6}" text-anchor="${anchor}">${tspans(lines, lx, 0, 12)}</text>`;
  });
  doc.series.forEach((s, si) => {
    const color = SERIES_COLORS[si % SERIES_COLORS.length];
    const byAxis = new Map(s.data.map((d) => [d.axis, d.value]));
    const pts = dims.map((d, i) => pt(i, byAxis.get(d) ?? 0));
    out += `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${color}" fill-opacity="0.09" stroke="${color}" stroke-width="2"/>`;
    for (const p of pts) out += `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${color}"/>`;
  });

  return svgWrap(W, H, out) + legend(doc.series.map((s) => s.name)) +
    `<p class="muted">Scored 1–${maxV} (authors' qualitative judgement).</p>`;
}

/* ---------------- qualitative waterfall ---------------- */
const ENVELOPE = { low: 1, 'low-medium': 1.5, medium: 2, 'medium-high': 2.5, high: 3 };

function waterfallChart(doc) {
  const data = doc.series[0]?.data || [];
  const W = 760, H = 360, m = { t: 40, r: 24, b: 76, l: 40 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const slot = iw / data.length;
  const maxL = 3;

  let out = '';
  out += `<text class="axis-label" transform="rotate(-90)" x="${-(m.t + ih / 2)}" y="14" text-anchor="middle">${esc(axisLabel(doc.axes?.y) || 'Relative spend')}</text>`;
  data.forEach((d, i) => {
    const level = ENVELOPE[String(d.envelope).toLowerCase()] ?? 1;
    const h = (level / maxL) * ih;
    const bw = Math.min(78, slot * 0.62);
    const x = m.l + slot * i + (slot - bw) / 2;
    const y = m.t + ih - h;
    const color = SERIES_COLORS[Math.min(i, SERIES_COLORS.length - 1)];
    const kill = d.kill_gate;
    out += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="3" fill="${color}"${kill ? ` stroke="${SEVERITY.critical}" stroke-width="2.5" stroke-dasharray="5 3"` : ''}><title>${escAttr(d.unlocks || '')}</title></rect>`;
    out += `<text class="tick" x="${x + bw / 2}" y="${y - 8}" text-anchor="middle">${esc(String(d.envelope))}${kill ? ' · KILL GATE' : ''}</text>`;
    const label = String(d.phase || d.x || '');
    out += `<text class="tick" x="${x + bw / 2}" y="${m.t + ih + 16}" text-anchor="middle">${tspans(wrapText(label, 14).slice(0, 3), x + bw / 2, 0, 11)}</text>`;
  });
  out += `<line class="axis" x1="${m.l}" y1="${m.t + ih}" x2="${m.l + iw}" y2="${m.t + ih}"/>`;

  const unlocks = `<details class="chart-data" open><summary>What each phase unlocks</summary><div class="table-scroll"><table><thead><tr><th>Phase</th><th>Envelope</th><th>Unlocks</th></tr></thead><tbody>${data
    .map((d) => `<tr><td>${esc(String(d.phase || ''))}${d.kill_gate ? ' — ⚠ Kill gate' : ''}</td><td>${esc(String(d.envelope || ''))}</td><td>${esc(String(d.unlocks || ''))}</td></tr>`)
    .join('')}</tbody></table></div></details>`;

  return svgWrap(W, H, out) + annotationList(doc.annotations) + unlocks;
}

/* ---------------- funnel (honest empty stages) ---------------- */
function funnelChart(doc) {
  const cols = doc.series.map((s) => {
    const data = s.data || [];
    const rows = data
      .map((d, i) => {
        const width = 100 - i * 16;
        const value =
          d.value == null
            ? `<span class="funnel-empty">⌀ ${esc(d.status || 'not computed')}</span>`
            : `<b class="num">${fmt(d.value)}</b> ${esc(d.unit || '')}`;
        return `<div class="funnel-stage">
<div class="funnel-bar" style="width:${width}%"><span>${esc(d.stage)}</span></div>
<div class="funnel-meta">
<div>${value}</div>
${d.required_input ? `<div class="muted"><b>Requires:</b> ${esc(d.required_input)}</div>` : ''}
${d.note ? `<div class="muted">${esc(d.note)}</div>` : ''}
</div>
</div>`;
      })
      .join('');
    return `<div class="funnel-col"><h4>${esc(s.name)}</h4><div class="funnel">${rows}</div></div>`;
  }).join('');
  let out = `<div class="funnel-cols">${cols}</div>`;
  if (doc.the_blocking_inputs?.inputs) {
    out += `<div class="blocking-inputs"><h4>The blocking inputs — the missing data is the content</h4><div class="table-scroll"><table><thead><tr><th>Input</th><th>Source</th><th>Status</th></tr></thead><tbody>${doc.the_blocking_inputs.inputs
      .map((r) => `<tr><td>${esc(r.input)}</td><td>${esc(r.source)}</td><td>${esc(r.status)}</td></tr>`)
      .join('')}</tbody></table></div></div>`;
  }
  return out;
}

/* ---------------- table (structured matrix) ---------------- */
function tableChart(doc) {
  if (!doc.rows) return '';
  const cols = doc.columns || Object.keys(doc.rows[0] || {});
  const head = `<tr>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>`;
  const body = doc.rows.map((r) => {
    const cells = [r.category, r.visibility, r.addressable, r.provenance];
    return `<tr>${cells.map((c) => `<td>${esc(c ?? '')}</td>`).join('')}${r.note ? '' : ''}</tr>${r.note ? `<tr><td colspan="${cols.length}" class="muted" style="font-size:var(--fs-sm)">${esc(r.note)}</td></tr>` : ''}`;
  }).join('');
  return `<div class="table-scroll"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}

/* ---------------- generic data table ---------------- */
export function chartDataTable(doc) {
  const tables = (doc.series || [])
    .map((s) => {
      const { points } = parsePoints(s.data || []);
      if (!points.length) return '';
      const rows = points.map((p) => `<tr><td class="num">${esc(String(p.x))}</td><td class="num">${fmt(typeof p.y === 'number' ? p.y : null)}</td>${p.meta ? `<td>${esc(p.meta)}</td>` : ''}</tr>`).join('');
      return `<h4>${esc(s.name || 'Series')}</h4><div class="table-scroll"><table><thead><tr><th>x</th><th>y${s.unit ? ` (${esc(s.unit)})` : ''}</th>${points.some((p) => p.meta) ? '<th>Detail</th>' : ''}</tr></thead><tbody>${rows}</tbody></table></div>`;
    })
    .join('');
  if (!tables) return '';
  return `<details class="chart-data"><summary>Data table</summary>${tables}</details>`;
}

/* ---------------- entry point ---------------- */
export function renderChartBody(doc) {
  try {
    let body = null;
    let includeTable = true;
    switch (doc.chart_type) {
      case 'line': body = lineChart(doc); break;
      case 'bar':
      case 'grouped_bar':
      case 'stacked_bar': body = barChart(doc); break;
      case 'pie':
      case 'donut': body = donutChart(doc); includeTable = false; break;
      case 'radar': body = radarChart(doc); includeTable = false; break;
      case 'waterfall': body = waterfallChart(doc); includeTable = false; break;
      case 'funnel': body = funnelChart(doc); includeTable = false; break;
      case 'table': body = tableChart(doc); includeTable = false; break;
      default: body = null;
    }
    if (!body) return null;
    return body + (includeTable ? chartDataTable(doc) : '');
  } catch (e) {
    return `<p class="muted">Chart could not be rendered: ${esc(e.message)}</p>`;
  }
}

/* Tiny sparkline. */
export function sparklineSvg(doc, stroke = 'var(--av-current)') {
  try {
    if (!doc?.series?.length) return '';
    const { points, categorical } = parsePoints(doc.series[0].data);
    const ys = points.map((p) => p.y).filter((v) => typeof v === 'number');
    if (ys.length < 3) return '';
    const xs = categorical ? points.map((_, i) => i) : points.map((p) => p.x);
    const [xmin, xmax] = extent(xs);
    const [ymin, ymax] = extent(ys, 0.1);
    const pts = points
      .map((p, i) => {
        if (typeof p.y !== 'number') return null;
        const x = 4 + (((categorical ? i : p.x) - xmin) / (xmax - xmin || 1)) * 112;
        const y = 26 - ((p.y - ymin) / (ymax - ymin || 1)) * 22;
        return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
      })
      .filter(Boolean)
      .join(' ');
    return `<svg class="sparkline" viewBox="0 0 120 30" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="1.6"/></svg>`;
  } catch {
    return '';
  }
}
