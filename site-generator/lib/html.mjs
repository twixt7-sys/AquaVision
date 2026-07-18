// Small HTML helpers shared by every emitter.

export function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function escAttr(s) {
  return esc(s).replaceAll("'", '&#39;');
}

const SHOUTING = /^[A-Z][A-Z0-9_]{2,}$/;

// "the_meta_point" -> "The Meta Point"; SHOUTING_KEYS keep their case.
export function humanize(key) {
  const k = String(key);
  if (SHOUTING.test(k)) return k.replaceAll('_', ' ');
  return k
    .replaceAll(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bThe\b/g, (m, off) => (off === 0 ? 'The' : 'the'))
    .replace(/\bVs\b/gi, 'vs');
}

export function isShoutingKey(key) {
  return SHOUTING.test(String(key));
}

export const PROVENANCE = {
  verified_external: { label: 'Sourced', cls: 'verified', icon: '✓' },
  derived_calculation: { label: 'Calculated', cls: 'calculated', icon: 'ƒ' },
  modeled_projection: { label: 'Projection', cls: 'projection', icon: '↗' },
  design_target: { label: 'Target', cls: 'target', icon: '◎' },
  illustrative_synthetic: { label: 'SAMPLE DATA — NOT REAL', cls: 'synthetic', icon: '⚠' },
  assumption: { label: 'Assumption', cls: 'assumption', icon: '?' },
};

// Every badge carries icon + text, never colour alone (brand accessibility rule).
export function provenanceBadge(prov) {
  const p = PROVENANCE[prov];
  if (!p) return '';
  return `<span class="badge badge-${p.cls}" title="Provenance: ${escAttr(prov)}"><span class="badge-icon">${p.icon}</span>${esc(p.label)}</span>`;
}

export function statusChip(status) {
  const s = String(status);
  const map = {
    awaiting_data: { cls: 'unknown', icon: '⌀', label: 'Awaiting data' },
    target_only: { cls: 'target', icon: '◎', label: 'Target only' },
    measured: { cls: 'ok', icon: '✓', label: 'Measured' },
    modeled: { cls: 'projection', icon: '↗', label: 'Modeled' },
    mitigating: { cls: 'advisory', icon: '…', label: 'Mitigating' },
    open: { cls: 'warning', icon: '!', label: 'Open' },
    closed: { cls: 'ok', icon: '✓', label: 'Closed' },
    accepted: { cls: 'assumption', icon: '≈', label: 'Accepted' },
  };
  const m = map[s] || { cls: 'assumption', icon: '·', label: humanize(s) };
  return `<span class="chip chip-${m.cls}"><span class="badge-icon">${m.icon}</span>${esc(m.label)}</span>`;
}

export function confidenceChip(conf) {
  const c = String(conf).toLowerCase();
  const cls = c === 'high' ? 'ok' : c === 'medium' ? 'advisory' : 'warning';
  return `<span class="chip chip-${cls}" title="Author-assessed confidence"><span class="badge-icon">◆</span>Confidence: ${esc(c)}</span>`;
}

// Link mentions of "*.json" in already-escaped text to their page.
export function autolinkFiles(escapedText, ctx) {
  return escapedText.replace(/([a-z0-9][a-z0-9._-]*\.json)((?:#[^\s"'<)\],]*)?)/g, (m, base, frag) => {
    const id = ctx.basenameToId.get(base);
    if (!id) return m;
    return `<a href="${ctx.root}files/${id}.html">${base}</a>${frag}`;
  });
}

export function text(v, ctx) {
  return autolinkFiles(esc(v), ctx);
}
