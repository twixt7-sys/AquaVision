// Shared page shell: head, sidebar, topbar, search overlay, prev/next footer.
import { esc, escAttr } from './html.mjs';

function sidebar(model, root, active) {
  const items = model.sections
    .map((s) => {
      const open = active.sectionId === s.id ? ' open' : '';
      const files = s.files
        .map((f) => {
          const cur = active.fileId === f.id ? ' aria-current="page" class="current"' : '';
          const flag = f.hasSynthetic ? ' <span class="nav-flag" title="Contains sample (synthetic) data">⚠</span>' : '';
          return `<li><a href="${root}files/${f.id}.html"${cur}>${esc(f.title)}${flag}</a></li>`;
        })
        .join('');
      const secCur = active.sectionId === s.id && !active.fileId ? ' aria-current="page" class="current"' : '';
      return `<details class="nav-sec"${open}>
<summary><span class="nav-num">${s.num}</span>${esc(s.label)}</summary>
<ul>
<li><a href="${root}sections/${s.id}.html"${secCur}>Overview</a></li>
${files}
</ul>
</details>`;
    })
    .join('\n');

  return `<aside class="sidebar" id="sidebar">
<a class="sidebar-brand" href="${root}index.html">
<img src="${root}assets/img/logo-mark.jpg" alt="AquaVision mark" width="36" height="36">
<span><strong>AQUAVISION</strong><small>OmniDrone Knowledge Repository</small></span>
</a>
<nav class="sidebar-nav" aria-label="Sections">${items}</nav>
<div class="sidebar-foot"><small>Fisheries • Aquaculture • Technology</small></div>
</aside>`;
}

function searchOverlay() {
  return `<div class="search-overlay" id="search-overlay" hidden>
<div class="search-panel" role="dialog" aria-label="Search">
<input type="search" id="search-input" placeholder="Search the repository… (Esc to close)" autocomplete="off" spellcheck="false">
<ul class="search-results" id="search-results"></ul>
<div class="search-hint">↑↓ to navigate · Enter to open · Esc to close</div>
</div>
</div>`;
}

export function page({ model, root, title, breadcrumb, active = {}, content, footer = '' }) {
  const crumbs = breadcrumb
    .map((c, i) =>
      i === breadcrumb.length - 1 || !c.href
        ? `<span class="crumb-here">${esc(c.label)}</span>`
        : `<a href="${c.href}">${esc(c.label)}</a>`
    )
    .join('<span class="crumb-sep">›</span>');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — AquaVision</title>
<link rel="icon" href="${root}assets/img/logo-mark.jpg">
<link rel="stylesheet" href="${root}assets/style.css">
<script>try{var t=localStorage.getItem('av-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
</head>
<body>
<div class="app">
${sidebar(model, root, active)}
<div class="main">
<header class="topbar">
<button class="icon-btn" id="nav-toggle" aria-label="Toggle navigation">☰</button>
<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>
<button class="search-btn" id="search-btn" aria-label="Search"><span aria-hidden="true">🔍</span> Search <kbd>Ctrl K</kbd></button>
<button class="icon-btn" id="theme-toggle" aria-label="Toggle light/dark theme" title="Toggle theme">◐</button>
</header>
<main class="content">
${content}
</main>
${footer}
</div>
</div>
${searchOverlay()}
<script src="${root}assets/search-index.js"></script>
<script src="${root}assets/app.js"></script>
</body>
</html>`;
}

export function prevNextFooter(prev, next, root) {
  const cell = (f, dir) =>
    f
      ? `<a class="pn pn-${dir}" href="${root}files/${f.id}.html">
<small>${dir === 'prev' ? '← Previous' : 'Next →'} · ${escAttr(f.sectionLabel)}</small>
<span>${esc(f.title)}</span></a>`
      : '<span class="pn pn-empty"></span>';
  return `<footer class="page-footer">${cell(prev, 'prev')}${cell(next, 'next')}</footer>`;
}
