// Emits assets/search-index.js as a plain script (no fetch, so file:// works).

function collectText(value, out) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) for (const v of value) collectText(v, out);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) collectText(v, out);
}

export function buildSearchIndex(model) {
  const entries = [];
  entries.push({
    id: 'home',
    title: 'Home — Repository overview',
    section: '',
    sectionLabel: 'AquaVision',
    url: 'index.html',
    provenance: '',
    flags: '',
    text: 'home dashboard overview provenance legend awaiting data sections aquavision omnidrone knowledge repository',
  });
  for (const s of model.sections) {
    entries.push({
      id: s.id,
      title: `${s.num} ${s.label}`,
      section: s.id,
      sectionLabel: s.label,
      url: `sections/${s.id}.html`,
      provenance: '',
      flags: '',
      text: `${s.description} ${(s.audience || []).join(' ')}`,
    });
  }
  for (const f of model.files) {
    const strings = [];
    collectText(f.doc, strings);
    const sec = model.sectionsById.get(f.section);
    entries.push({
      id: f.id,
      title: f.title,
      section: f.section,
      sectionLabel: sec ? sec.label : f.section,
      url: `files/${f.id}.html`,
      provenance: f.provenance || '',
      flags: `${f.hasSynthetic ? 'S' : ''}${f.awaitingData ? 'A' : ''}`,
      text: strings.join(' • ').slice(0, 800).toLowerCase(),
    });
  }
  return `window.AV_SEARCH = ${JSON.stringify(entries)};\n`;
}
