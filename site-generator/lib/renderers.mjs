// Renders one loaded JSON document into a page body.
// The generic recursive renderer is the workhorse; typed renderers
// (kpi / risk / study / citation) upgrade recognisable shapes.
import { esc, escAttr, humanize, isShoutingKey, text, provenanceBadge, statusChip, confidenceChip } from './html.mjs';
import { renderChartFigure, chartDataTable } from './charts.mjs';

const SKIP_TOP = new Set(['id', 'title', 'version', 'last_updated', 'provenance', 'confidence', '$schema']);
const CHART_HANDLED = new Set(['chart_type', 'subtitle', 'description', 'axes', 'series', 'annotations', 'secondary_series', 'axes_dimensions', 'citation_ids', 'axis_rendering_rule']);
const CALLOUT_KEYS = new Set(['honest_note', 'caveat', 'the_hard_truth', 'integrity_rule', 'the_rule', 'warning', 'verification_notice', 'accessibility_requirement']);
const BANNER_EXTRA = new Set(['integrity_rule', 'verification_notice']);

function isPrimitive(v) {
  return v === null || ['string', 'number', 'boolean'].includes(typeof v);
}

/* ---------------- citations ---------------- */

function citationChips(ids, ctx) {
  if (!Array.isArray(ids) || !ids.length) return '<span class="muted">none</span>';
  return ids
    .map((id) => {
      ctx.citationRefs?.add(id);
      const ref = ctx.model.citationsById.get(id);
      const title = ref ? `${(ref.authors || []).join('; ')} (${ref.year ?? 'n.d.'})` : 'Unresolved citation';
      return `<a class="cite-chip${ref ? '' : ' cite-missing'}" href="${ctx.root}files/references-bibliography.html#${escAttr(id)}" title="${escAttr(title)}">${esc(id)}</a>`;
    })
    .join(' ');
}

/* ---------------- honesty banners ---------------- */

function bannerBody(value, ctx) {
  if (isPrimitive(value)) return `<p>${text(String(value), ctx)}</p>`;
  if (Array.isArray(value)) return `<ul>${value.map((v) => `<li>${isPrimitive(v) ? text(String(v), ctx) : bannerBody(v, ctx)}</li>`).join('')}</ul>`;
  return Object.entries(value)
    .map(([k, v]) => `<div class="banner-item"><b>${esc(humanize(k))}:</b> ${bannerBody(v, ctx)}</div>`)
    .join('');
}

export function collectBanners(doc, ctx) {
  const banners = [];
  for (const [key, value] of Object.entries(doc)) {
    if (isShoutingKey(key) || BANNER_EXTRA.has(key)) {
      const critical = /SYNTHETIC|CRITICAL|WARNING|FABRICAT/i.test(key) || /FABRICATED/.test(String(value));
      banners.push({ key, critical, html: bannerBody(value, ctx) });
    }
  }
  if (doc.status === 'awaiting_data') {
    banners.push({ key: 'status', critical: false, html: '<p>This file is a schema-defined placeholder <b>awaiting real data</b>. The empty state is deliberate — see the integrity rule in the manifest.</p>' });
  }
  return banners;
}

export function renderBanners(banners) {
  return banners
    .map(
      (b) => `<aside class="banner banner-${b.critical ? 'critical' : 'advisory'}">
<div class="banner-head"><span class="badge-icon">${b.critical ? '⚠' : 'ℹ'}</span>${esc(humanize(b.key === 'status' ? 'Awaiting data' : b.key))}</div>
${b.html}</aside>`
    )
    .join('\n');
}

/* ---------------- typed array renderers ---------------- */

function isKpiArray(arr) {
  return arr.length > 0 && arr.every((i) => i && typeof i === 'object' && i.label && i.definition);
}
function isRiskArray(arr) {
  return arr.length > 0 && arr.every((i) => i && typeof i === 'object' && i.severity != null && i.likelihood != null);
}
function isCitationArray(arr) {
  // Bibliography entries: citation_id + bibliographic fields. apa7 is often absent,
  // so key on authors/title (which also excludes study-collection records).
  return arr.length > 0 && arr.every((i) => i && typeof i === 'object' && i.citation_id && (i.apa7 || (i.authors && i.title)));
}

function apaFallback(r) {
  const authors = Array.isArray(r.authors) ? r.authors.join('; ') : r.authors || 'Unknown author';
  const bits = [`${authors} (${r.year ?? 'n.d.'}).`, r.title ? `${r.title}.` : '', r.container || '', r.publisher || ''].filter(Boolean);
  return bits.join(' ');
}
function isStudyArray(arr) {
  return arr.length > 0 && arr.every((i) => i && typeof i === 'object' && i.citation_id && (i.summary || i.relevance_to_omnidrone));
}

const DIRECTION = {
  higher_is_better: '↑ higher is better',
  lower_is_better: '↓ lower is better',
  band_is_better: '⇅ band is better',
};

function kpiTiles(arr, ctx) {
  const tiles = arr
    .map((k) => {
      let value;
      if (k.status === 'target_only' && k.target != null) value = `<span class="kpi-num num">◎ ${esc(String(k.target))}<small>${esc(k.unit || '')}</small></span><small class="muted">target — no baseline</small>`;
      else if (k.status === 'measured' && k.value != null) value = `<span class="kpi-num num">${esc(String(k.value))}<small>${esc(k.unit || '')}</small></span>`;
      else value = statusChip(k.status || 'awaiting_data');
      const band = k.acceptable_band ? `<small class="muted">band ${k.acceptable_band.min ?? '—'} – ${k.acceptable_band.max ?? '∞'} ${esc(k.unit || '')}</small>` : '';
      return `<div class="kpi">
<div class="kpi-label">${esc(k.label)}${k.id ? ` <code class="mono">${esc(k.id)}</code>` : ''}</div>
<div class="kpi-value">${value}</div>
${k.formula ? `<code class="mono kpi-formula">${esc(k.formula)}</code>` : ''}
<div class="kpi-meta"><small>${esc(DIRECTION[k.direction] || k.direction || '')}${k.unit && k.status !== 'measured' ? ` · ${esc(k.unit)}` : ''}</small>${band}</div>
<div class="kpi-def">${text(k.definition, ctx)}</div>
${k.note ? `<p class="note muted">${text(k.note, ctx)}</p>` : ''}
${k.citation_ids?.length ? `<div class="cite-row">${citationChips(k.citation_ids, ctx)}</div>` : ''}
</div>`;
    })
    .join('');
  return `<div class="kpi-grid">${tiles}</div>`;
}

function rpnClass(rpn) {
  if (rpn >= 300) return 'critical';
  if (rpn >= 200) return 'warning';
  if (rpn >= 100) return 'advisory';
  return 'ok';
}

function riskTable(arr, ctx) {
  const rows = [...arr]
    .sort((a, b) => (b.rpn || 0) - (a.rpn || 0))
    .map((r) => {
      const detail = [r.cause && `<b>Cause:</b> ${text(r.cause, ctx)}`, r.effect && `<b>Effect:</b> ${text(r.effect, ctx)}`, r.mitigation && `<b>Mitigation:</b> ${text(r.mitigation, ctx)}`, r.note && `<b>Note:</b> ${text(r.note, ctx)}`]
        .filter(Boolean)
        .join('<br>');
      return `<tr>
<td class="mono">${esc(r.id || '')}</td>
<td><div>${text(r.description || '', ctx)}</div>${detail ? `<details><summary>Cause · effect · mitigation</summary><div class="risk-detail">${detail}</div></details>` : ''}</td>
<td class="num">${r.severity ?? ''}</td><td class="num">${r.likelihood ?? ''}</td><td class="num">${r.detectability ?? ''}</td>
<td class="num rpn rpn-${rpnClass(r.rpn || 0)}">${r.rpn ?? ''}</td>
<td class="num">${r.residual_rpn ?? ''}</td>
<td>${r.status ? statusChip(r.status) : ''}</td>
<td><small>${esc(r.owner || '')}</small></td>
</tr>`;
    })
    .join('');
  return `<div class="table-scroll"><table class="risk-table">
<thead><tr><th>ID</th><th>Risk (sorted by RPN)</th><th title="Severity">S</th><th title="Likelihood">L</th><th title="Detectability">D</th><th>RPN</th><th>Residual</th><th>Status</th><th>Owner</th></tr></thead>
<tbody>${rows}</tbody></table></div>`;
}

const SUPPORT_CHIP = {
  supports: '<span class="chip chip-ok"><span class="badge-icon">✓</span>Supports</span>',
  challenges: '<span class="chip chip-warning"><span class="badge-icon">!</span>Challenges</span>',
  mixed: '<span class="chip chip-advisory"><span class="badge-icon">±</span>Mixed</span>',
};

function studyCards(arr, ctx) {
  const STUDY_HANDLED = new Set(['citation_id', 'theme', 'study_type', 'year', 'summary', 'key_findings', 'supports_or_challenges', 'priority']);
  return arr
    .map((s) => {
      ctx.citationRefs?.add(s.citation_id);
      const ref = ctx.model.citationsById.get(s.citation_id);
      const title = ref?.title || s.citation_id;
      const rest = Object.entries(s)
        .filter(([k]) => !STUDY_HANDLED.has(k))
        .map(([k, v]) => renderKV(k, v, 3, ctx))
        .join('');
      return `<article class="card study">
<h3><a href="${ctx.root}files/references-bibliography.html#${escAttr(s.citation_id)}">${esc(title)}</a> <small class="muted">(${esc(String(s.year ?? ref?.year ?? 'n.d.'))})</small></h3>
<div class="chip-row">${s.study_type ? `<span class="chip chip-assumption">${esc(humanize(s.study_type))}</span>` : ''}${SUPPORT_CHIP[s.supports_or_challenges] || ''}${s.priority ? `<span class="chip chip-advisory"><span class="badge-icon">★</span>${esc(String(s.priority))}</span>` : ''}</div>
${s.summary ? `<p>${text(s.summary, ctx)}</p>` : ''}
${Array.isArray(s.key_findings) ? `<ul>${s.key_findings.map((f) => `<li>${text(String(f), ctx)}</li>`).join('')}</ul>` : ''}
${rest ? `<dl class="kv">${rest}</dl>` : ''}
</article>`;
    })
    .join('');
}

const VERIFY_CHIP = {
  url_checked: '<span class="chip chip-ok"><span class="badge-icon">✓</span>URL checked</span>',
  cited_from_search_result: '<span class="chip chip-advisory"><span class="badge-icon">!</span>From search result — unopened</span>',
  needs_verification: '<span class="chip chip-warning"><span class="badge-icon">⚠</span>Needs verification</span>',
};

function citationList(arr, ctx) {
  return arr
    .map((r) => {
      const links = [r.doi && `<a href="https://doi.org/${escAttr(r.doi)}" rel="noopener">doi:${esc(r.doi)}</a>`, r.url && `<a href="${escAttr(r.url)}" rel="noopener">source ↗</a>`]
        .filter(Boolean)
        .join(' · ');
      return `<article class="card ref" id="${escAttr(r.citation_id)}">
<p class="ref-apa">${text(r.apa7 || apaFallback(r), ctx)}${r.apa7 ? '' : ' <span class="chip chip-unknown"><span class="badge-icon">⌀</span>no pre-rendered APA</span>'}</p>
<div class="chip-row">
<code class="mono">${esc(r.citation_id)}</code>
${r.type ? `<span class="chip chip-assumption">${esc(humanize(r.type))}</span>` : ''}
${VERIFY_CHIP[r.verification_status] || (r.verification_status ? statusChip(r.verification_status) : '')}
${r.confidence ? confidenceChip(r.confidence) : ''}
${(r.themes || []).map((t) => `<span class="chip chip-theme">${esc(humanize(t))}</span>`).join('')}
</div>
${links ? `<p class="ref-links">${links}</p>` : ''}
${r.relevance ? `<p><b>Relevance:</b> ${text(r.relevance, ctx)}</p>` : ''}
${Array.isArray(r.key_figures_used) ? `<details><summary>Key figures used (${r.key_figures_used.length})</summary><ul>${r.key_figures_used.map((f) => `<li>${esc(String(f))}</li>`).join('')}</ul></details>` : ''}
${r.verification_note ? `<p class="note muted">${text(r.verification_note, ctx)}</p>` : ''}
</article>`;
    })
    .join('');
}

/* ---------------- generic renderer ---------------- */

function renderArray(arr, depth, ctx) {
  if (!arr.length) return '<p class="muted">— empty —</p>';
  if (arr.every(isPrimitive)) return `<ul>${arr.map((v) => `<li>${v === null ? '—' : text(String(v), ctx)}</li>`).join('')}</ul>`;
  if (arr.every((i) => i && typeof i === 'object' && !Array.isArray(i))) {
    try {
      if (isCitationArray(arr)) return citationList(arr, ctx);
      if (isStudyArray(arr)) return studyCards(arr, ctx);
      if (isKpiArray(arr)) return kpiTiles(arr, ctx);
      if (isRiskArray(arr)) return riskTable(arr, ctx);
    } catch {
      /* fall through to generic */
    }
    const keys = [...new Set(arr.flatMap((i) => Object.keys(i)))];
    const flat = keys.length <= 8 && arr.every((i) => Object.values(i).every((v) => isPrimitive(v) && String(v ?? '').length < 220));
    if (flat) {
      const head = keys.map((k) => `<th>${esc(humanize(k))}</th>`).join('');
      const rows = arr
        .map((i) => `<tr>${keys.map((k) => `<td>${cellValue(k, i[k], ctx)}</td>`).join('')}</tr>`)
        .join('');
      return `<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    return arr.map((i) => objectCard(i, depth, ctx)).join('');
  }
  return `<ul>${arr.map((v) => `<li>${renderValue(v, depth + 1, ctx)}</li>`).join('')}</ul>`;
}

function cellValue(key, v, ctx) {
  if (v === null || v === undefined) return '<span class="muted">—</span>';
  if (key === 'provenance') return provenanceBadge(v) || esc(String(v));
  if (key === 'status') return statusChip(v);
  if (typeof v === 'number') return `<span class="num">${esc(String(v))}</span>`;
  return text(String(v), ctx);
}

function objectCard(obj, depth, ctx) {
  const titleKey = ['label', 'name', 'title', 'id', 'stage', 'phase', 'question'].find((k) => typeof obj[k] === 'string');
  const title = titleKey ? obj[titleKey] : null;
  const body = Object.entries(obj)
    .filter(([k]) => k !== titleKey)
    .map(([k, v]) => renderKV(k, v, depth + 1, ctx))
    .join('');
  return `<article class="card">${title ? `<h3>${text(title, ctx)}</h3>` : ''}<dl class="kv">${body}</dl></article>`;
}

function renderKV(key, value, depth, ctx) {
  if (key === 'citation_ids') return `<dt>Citations</dt><dd><div class="cite-row">${citationChips(value, ctx)}</div></dd>`;
  if (key === 'provenance' && typeof value === 'string') return `<dt>${esc(humanize(key))}</dt><dd>${provenanceBadge(value) || esc(value)}</dd>`;
  if (key === 'status' && typeof value === 'string') return `<dt>Status</dt><dd>${statusChip(value)}</dd>`;
  if (CALLOUT_KEYS.has(key) && typeof value === 'string') {
    return `<dt class="callout-dt">${esc(humanize(key))}</dt><dd><div class="callout">${text(value, ctx)}</div></dd>`;
  }
  if (key === 'note' && typeof value === 'string') return `<dt>Note</dt><dd><p class="note muted">${text(value, ctx)}</p></dd>`;
  const rendered = renderValue(value, depth, ctx, key);
  if (!isPrimitive(value) && depth >= 4) {
    return `<dt>${esc(humanize(key))}</dt><dd><details><summary>${esc(humanize(key))} (expand)</summary>${rendered}</details></dd>`;
  }
  return `<dt>${esc(humanize(key))}</dt><dd>${rendered}</dd>`;
}

export function renderValue(value, depth, ctx, key = '') {
  if (value === null || value === undefined) return '<span class="muted">—</span>';
  if (typeof value === 'string') return value.length > 90 ? `<p>${text(value, ctx)}</p>` : text(value, ctx);
  if (typeof value === 'number' || typeof value === 'boolean') return `<span class="num">${esc(String(value))}</span>`;
  if (Array.isArray(value)) return renderArray(value, depth, ctx);
  const entries = Object.entries(value);
  if (!entries.length) return '<p class="muted">— empty —</p>';
  return `<dl class="kv">${entries.map(([k, v]) => renderKV(k, v, depth + 1, ctx)).join('')}</dl>`;
}

/* ---------------- document assembly ---------------- */

export function renderFileHeader(file, ctx) {
  const d = file.doc;
  return `<header class="doc-head">
<h1>${esc(file.title)}</h1>
${d.subtitle ? `<p class="subtitle">${esc(d.subtitle)}</p>` : ''}
<div class="doc-meta">
<code class="mono">${esc(file.id)}</code>
${file.version ? `<span>v${esc(file.version)}</span>` : ''}
${file.lastUpdated ? `<span>updated ${esc(file.lastUpdated)}</span>` : ''}
${file.provenance ? provenanceBadge(file.provenance) : ''}
${file.confidence ? confidenceChip(file.confidence) : ''}
<a class="raw-link" href="${ctx.root}../${escAttr(file.path)}">raw JSON ↗</a>
</div>
${Array.isArray(d.citation_ids) && d.citation_ids.length ? `<div class="cite-row">${citationChips(d.citation_ids, ctx)}</div>` : ''}
</header>`;
}

export function renderDocument(file, ctx) {
  const doc = file.doc;
  const banners = collectBanners(doc, ctx);
  const bannerKeys = new Set(banners.map((b) => b.key));
  let body = '';

  if (file.isChart) {
    if (doc.description) body += `<p class="lead">${text(doc.description, ctx)}</p>`;
    const figure = renderChartFigure(doc);
    if (doc.chart_type === 'table' && Array.isArray(doc.rows)) {
      body += renderArray(doc.rows, 1, ctx);
      bannerKeys.add('rows');
      bannerKeys.add('columns');
    } else if (figure) {
      body += figure;
    } else {
      body += `<p class="muted">Chart type “${esc(doc.chart_type)}” has no visual renderer — showing the data instead.</p>`;
      body += chartDataTable(doc, true) || renderValue(doc.series, 1, ctx);
    }
    body += Object.entries(doc)
      .filter(([k]) => !SKIP_TOP.has(k) && !CHART_HANDLED.has(k) && !bannerKeys.has(k) && k !== 'description')
      .map(([k, v]) => `<section class="doc-sec"><h2>${esc(humanize(k))}</h2>${renderValue(v, 1, ctx, k)}</section>`)
      .join('\n');
  } else {
    body = Object.entries(doc)
      .filter(([k]) => !SKIP_TOP.has(k) && !bannerKeys.has(k) && !(k === 'status' && doc.status === 'awaiting_data'))
      .map(([k, v]) => {
        if (k === 'description' && typeof v === 'string') return `<p class="lead">${text(v, ctx)}</p>`;
        if (CALLOUT_KEYS.has(k) && typeof v === 'string') return `<div class="callout"><b>${esc(humanize(k))}.</b> ${text(v, ctx)}</div>`;
        return `<section class="doc-sec"><h2>${esc(humanize(k))}</h2>${renderValue(v, 1, ctx, k)}</section>`;
      })
      .join('\n');
  }

  return renderFileHeader(file, ctx) + renderBanners(banners) + body;
}
