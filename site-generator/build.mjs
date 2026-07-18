#!/usr/bin/env node
// AquaVision repository navigator — static site generator.
// Usage: node site-generator/build.mjs
// Reads manifest.json + data/**/*.json, emits ./site/ (fully regenerated, safe to delete).
import { mkdirSync, writeFileSync, copyFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from './lib/load.mjs';
import { esc, escAttr, humanize, provenanceBadge, PROVENANCE } from './lib/html.mjs';
import { page, prevNextFooter } from './lib/layout.mjs';
import { renderDocument } from './lib/renderers.mjs';
import { sparkline } from './lib/charts.mjs';
import { buildSearchIndex } from './lib/search.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const OUT = join(REPO, 'site');

const model = load(REPO);
if (model.errors.length) {
  console.error('Data load errors:');
  for (const e of model.errors) console.error('  ✗ ' + e);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'sections'), { recursive: true });
mkdirSync(join(OUT, 'files'), { recursive: true });
mkdirSync(join(OUT, 'assets', 'img'), { recursive: true });

const emitted = new Set();
const warnings = [];
const citationRefs = new Set();

function emit(relPath, html) {
  writeFileSync(join(OUT, relPath), html, 'utf8');
  emitted.add(relPath.replaceAll('\\', '/'));
}

const audienceChip = (a) => `<span class="chip chip-theme">${esc(humanize(a))}</span>`;

/* ---------------- home ---------------- */

function homePage() {
  const m = model.manifest;
  const legend = Object.entries(m.READ_THIS_FIRST?.provenance_levels || {})
    .map(([k, v]) => `<div class="legend-item"><div>${provenanceBadge(k) || esc(k)}</div><p>${esc(v)}</p></div>`)
    .join('');

  const awaitingLinks = (m.statistics?.files_awaiting_real_data || [])
    .map((p) => {
      const id = model.basenameToId.get(posix.basename(p));
      return id ? `<li><a href="files/${id}.html">${esc(model.filesById.get(id).title)}</a> <code class="mono">${esc(p)}</code></li>` : `<li><code class="mono">${esc(p)}</code></li>`;
    })
    .join('');
  const gaps = (m.statistics?.highest_priority_gaps || []).map((g) => `<li>${esc(g)}</li>`).join('');

  const audiences = [...new Set(model.sections.flatMap((s) => s.audience || []))];
  const cards = model.sections
    .map(
      (s) => `<a class="section-card" href="sections/${s.id}.html" data-audiences="${escAttr((s.audience || []).join(' '))}">
<h3><span class="nav-num">${s.num}</span>${esc(s.label)}</h3>
<p>${esc(s.description)}</p>
<div class="chip-row">${(s.audience || []).map(audienceChip).join('')}</div>
<span class="file-count">${s.files.length} file${s.files.length === 1 ? '' : 's'} →</span>
</a>`
    )
    .join('');

  const chartCount = model.files.filter((f) => f.isChart).length;
  const content = `
<div class="hero">
<img class="logo" src="assets/img/logo-full.jpg" alt="AquaVision logo">
<div>
<div class="tagline">${esc(m.repository.tagline)}</div>
<h1>AquaVision</h1>
<p class="lead">${esc(m.repository.purpose)}</p>
</div>
</div>

<div class="stat-row">
<div class="stat"><b>${m.statistics.total_sections}</b><small>sections</small></div>
<div class="stat"><b>${m.statistics.total_data_files}</b><small>data files</small></div>
<div class="stat"><b>${chartCount}</b><small>chart payloads</small></div>
<div class="stat"><b>${esc(m.repository.last_updated)}</b><small>last updated</small></div>
</div>

<aside class="banner banner-advisory">
<div class="banner-head"><span class="badge-icon">ℹ</span>Integrity rule</div>
<p>${esc(m.READ_THIS_FIRST.integrity_rule)}</p>
</aside>

<section class="doc-sec">
<h2>Read this first — the provenance system</h2>
<p>${esc(m.READ_THIS_FIRST.provenance_warning)}</p>
<div class="legend-grid">${legend}</div>
</section>

<section class="doc-sec">
<h2>Awaiting real data</h2>
<p class="muted">These files are deliberate, schema-defined placeholders. Honest zeros beat invented traction.</p>
<ul>${awaitingLinks}</ul>
<h3>Highest-priority gaps</h3>
<ul>${gaps}</ul>
</section>

<section class="doc-sec">
<h2>Browse the repository</h2>
<div class="aud-filter" id="aud-filter">
<button class="active" data-aud="all">All audiences</button>
${audiences.map((a) => `<button data-aud="${escAttr(a)}">${esc(humanize(a))}</button>`).join('')}
</div>
<div class="section-grid">${cards}</div>
</section>`;

  emit('index.html', page({
    model, root: '', title: 'AquaVision — Knowledge Repository',
    breadcrumb: [{ label: 'Home' }],
    active: {},
    content,
  }));
}

/* ---------------- section pages ---------------- */

function sectionPages() {
  for (const s of model.sections) {
    const cards = s.files
      .map((f) => {
        const desc = typeof f.doc.description === 'string' ? f.doc.description : '';
        const short = desc.length > 170 ? desc.slice(0, 167).trimEnd() + '…' : desc;
        return `<a class="file-card" href="../files/${f.id}.html">
<h3>${esc(f.title)}</h3>
${f.subtitle ? `<small class="muted">${esc(f.subtitle)}</small>` : ''}
${f.isChart ? sparkline(f.doc) : ''}
<p class="desc">${esc(short)}</p>
<div class="meta">
<code class="mono">${esc(f.id)}</code>
${f.provenance ? provenanceBadge(f.provenance) : ''}
${f.hasSynthetic && f.provenance !== 'illustrative_synthetic' ? '<span class="chip chip-critical"><span class="badge-icon">⚠</span>Has sample data</span>' : ''}
${f.awaitingData ? '<span class="chip chip-unknown"><span class="badge-icon">⌀</span>Awaiting data</span>' : ''}
${f.lastUpdated ? `<span>${esc(f.lastUpdated)}</span>` : ''}
</div>
</a>`;
      })
      .join('');

    const content = `<header class="doc-head">
<h1><span class="nav-num" style="font-size:var(--fs-lg)">${s.num}</span> ${esc(s.label)}</h1>
<p class="lead">${esc(s.description)}</p>
<div class="chip-row">${(s.audience || []).map(audienceChip).join('')}</div>
</header>
<div class="file-grid">${cards}</div>`;

    emit(join('sections', `${s.id}.html`), page({
      model, root: '../', title: s.label,
      breadcrumb: [{ label: 'Home', href: '../index.html' }, { label: s.label }],
      active: { sectionId: s.id },
      content,
    }));
  }
}

/* ---------------- file pages ---------------- */

function filePages() {
  const ordered = model.files.map((f) => ({ ...f, sectionLabel: model.sectionsById.get(f.section)?.label || f.section }));
  ordered.forEach((f, i) => {
    const ctx = { root: '../', model, citationRefs, basenameToId: model.basenameToId };
    let body;
    try {
      body = renderDocument(f, ctx);
    } catch (err) {
      warnings.push(`${f.id}: renderer threw (${err.message}) — emitted raw fallback`);
      body = `<h1>${esc(f.title)}</h1><pre>${esc(JSON.stringify(f.doc, null, 2))}</pre>`;
    }
    const sec = model.sectionsById.get(f.section);
    emit(join('files', `${f.id}.html`), page({
      model, root: '../', title: f.title,
      breadcrumb: [
        { label: 'Home', href: '../index.html' },
        { label: sec?.label || f.section, href: `../sections/${f.section}.html` },
        { label: f.title },
      ],
      active: { sectionId: f.section, fileId: f.id },
      content: body,
      footer: prevNextFooter(ordered[i - 1], ordered[i + 1], '../'),
    }));
  });
}

/* ---------------- assets ---------------- */

function assets() {
  copyFileSync(join(HERE, 'static', 'style.css'), join(OUT, 'assets', 'style.css'));
  copyFileSync(join(HERE, 'static', 'app.js'), join(OUT, 'assets', 'app.js'));
  emitted.add('assets/style.css').add('assets/app.js');
  const imgs = [
    [model.manifest.assets?.logo_full, 'logo-full.jpg'],
    [model.manifest.assets?.logo_mark, 'logo-mark.jpg'],
    [model.manifest.assets?.product_render, 'product-render.jpg'],
  ];
  for (const [src, dst] of imgs) {
    if (src && existsSync(join(REPO, src))) {
      copyFileSync(join(REPO, src), join(OUT, 'assets', 'img', dst));
      emitted.add(`assets/img/${dst}`);
    } else {
      warnings.push(`asset missing in repo root: ${src}`);
    }
  }
  writeFileSync(join(OUT, 'assets', 'search-index.js'), buildSearchIndex(model), 'utf8');
  emitted.add('assets/search-index.js');
}

/* ---------------- self-check ---------------- */

function selfCheck() {
  let broken = 0;
  const linkRe = /(?:href|src)="([^"]+)"/g;
  for (const rel of [...emitted].filter((p) => p.endsWith('.html'))) {
    const html = readFileSync(join(OUT, rel), 'utf8');
    const dir = posix.dirname(rel);
    for (const m of html.matchAll(linkRe)) {
      const url = m[1];
      if (/^(https?:|mailto:|#|data:)/.test(url)) continue;
      const clean = url.split('#')[0];
      if (!clean) continue;
      const target = posix.normalize(posix.join(dir, clean));
      if (target.startsWith('..')) {
        // points outside site/ (raw JSON links) — verify against the repo
        if (!existsSync(join(OUT, ...target.split('/')))) {
          warnings.push(`broken external-relative link in ${rel}: ${url}`);
          broken++;
        }
      } else if (!emitted.has(target)) {
        warnings.push(`broken link in ${rel}: ${url}`);
        broken++;
      }
    }
  }
  let unresolvedCites = 0;
  for (const id of citationRefs) {
    if (!model.citationsById.has(id)) {
      warnings.push(`citation_id "${id}" not found in references-bibliography.json`);
      unresolvedCites++;
    }
  }
  return { broken, unresolvedCites };
}

/* ---------------- run ---------------- */

homePage();
sectionPages();
filePages();
assets();
const check = selfCheck();

const pages = [...emitted].filter((p) => p.endsWith('.html')).length;
console.log(`AquaVision site built → ${OUT}`);
console.log(`  pages: ${pages} (1 home + ${model.sections.length} sections + ${model.files.length} files)`);
console.log(`  citations referenced: ${citationRefs.size} (${check.unresolvedCites} unresolved)`);
console.log(`  broken links: ${check.broken}`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) console.log('  ⚠ ' + w);
}
console.log('\nOpen site\\index.html in a browser — no server needed.');
process.exit(check.broken > 0 ? 1 : 0);
