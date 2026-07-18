// Loads manifest.json + every data file into one model object.
import { readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to parse ${path}: ${err.message}`);
  }
}

function walk(value, visit, key = null, depth = 0) {
  visit(key, value, depth);
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit, key, depth + 1);
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, visit, k, depth + 1);
  }
}

export function load(repoRoot) {
  const manifest = readJson(join(repoRoot, 'manifest.json'));
  const errors = [];

  const sections = manifest.index.sections.map((s) => ({ ...s, files: [] }));
  const sectionsById = new Map(sections.map((s) => [s.id, s]));

  const files = [];
  for (const entry of manifest.index.files) {
    let doc;
    try {
      doc = readJson(join(repoRoot, entry.path));
    } catch (err) {
      errors.push(err.message);
      continue;
    }
    let hasSynthetic = doc.provenance === 'illustrative_synthetic';
    let awaitingData = false;
    walk(doc, (key, value) => {
      if (key === 'SYNTHETIC_WARNING' || value === 'illustrative_synthetic') hasSynthetic = true;
      if (key === 'status' && value === 'awaiting_data') awaitingData = true;
    });
    const file = {
      id: entry.id,
      section: entry.section,
      path: entry.path,
      basename: basename(entry.path),
      doc,
      title: doc.title || doc.id || entry.id,
      subtitle: doc.subtitle || null,
      provenance: doc.provenance || null,
      confidence: doc.confidence || null,
      version: doc.version || null,
      lastUpdated: doc.last_updated || null,
      isChart: typeof doc.chart_type === 'string',
      hasSynthetic,
      awaitingData,
    };
    files.push(file);
    const sec = sectionsById.get(entry.section);
    if (sec) sec.files.push(file);
    else errors.push(`${entry.path}: unknown section "${entry.section}"`);
  }

  const filesById = new Map(files.map((f) => [f.id, f]));
  const basenameToId = new Map(files.map((f) => [f.basename, f.id]));

  // Section number prefix from its directory name, e.g. data/05_hardware/ -> "05".
  for (const s of sections) {
    const m = s.path.match(/\/(\d+)_/);
    s.num = m ? m[1] : '';
  }

  // Citation lookup: every citation_ids[] anywhere resolves here.
  const citationsById = new Map();
  const bib = filesById.get('references-bibliography');
  if (bib && Array.isArray(bib.doc.references)) {
    for (const ref of bib.doc.references) {
      if (ref.citation_id) citationsById.set(ref.citation_id, ref);
    }
  }

  return { manifest, sections, sectionsById, files, filesById, basenameToId, citationsById, errors };
}
