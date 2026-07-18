// AquaVision navigator — theme toggle, search overlay, sidebar, audience filter.
(function () {
  'use strict';

  /* ---------- theme (dark is the brand default) ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('av-theme', next); } catch (e) {}
    });
  }

  /* ---------- mobile sidebar ---------- */
  var navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open') &&
          !e.target.closest('#sidebar') && !e.target.closest('#nav-toggle')) {
        document.body.classList.remove('nav-open');
      }
    });
  }

  /* ---------- search ---------- */
  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var searchBtn = document.getElementById('search-btn');
  var entries = window.AV_SEARCH || [];
  // Root prefix: pages under sections/ or files/ need "../" to reach index.html.
  var root = /[\\/](sections|files)[\\/]/.test(location.pathname) ? '../' : '';
  var sel = 0;
  var shown = [];

  function openSearch() {
    if (!overlay) return;
    overlay.hidden = false;
    input.value = '';
    render([]);
    input.focus();
  }
  function closeSearch() { if (overlay) overlay.hidden = true; }

  function score(entry, tokens) {
    var s = 0;
    var title = entry.title.toLowerCase();
    var id = entry.id.toLowerCase();
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      var hit = 0;
      if (title.indexOf(t) !== -1) hit = title.indexOf(t) === 0 ? 6 : 4;
      else if (id.indexOf(t) !== -1) hit = 3;
      else if (entry.sectionLabel.toLowerCase().indexOf(t) !== -1) hit = 2;
      else if (entry.text.indexOf(t) !== -1) hit = 1;
      if (!hit) return 0; // every token must match somewhere
      s += hit;
    }
    return s;
  }

  function render(list) {
    shown = list;
    sel = 0;
    if (!list.length) {
      resultsEl.innerHTML = input.value.trim()
        ? '<li><a><span class="muted">No matches</span></a></li>'
        : '<li><a><span class="muted">Type to search titles, ids, and content across all 85 files…</span></a></li>';
      return;
    }
    resultsEl.innerHTML = list.map(function (e, i) {
      var flags = '';
      if (e.flags.indexOf('S') !== -1) flags += '<span class="flag" title="Contains sample (synthetic) data" style="color:var(--av-critical)">⚠</span>';
      if (e.flags.indexOf('A') !== -1) flags += '<span class="flag" title="Awaiting real data" style="color:var(--av-unknown)">⌀</span>';
      return '<li class="' + (i === 0 ? 'sel' : '') + '"><a href="' + root + e.url + '">' +
        '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + e.title + '</span>' +
        flags + '<span class="sec-chip">' + (e.sectionLabel || '') + '</span></a></li>';
    }).join('');
  }

  function updateSel(d) {
    if (!shown.length) return;
    sel = (sel + d + shown.length) % shown.length;
    var items = resultsEl.children;
    for (var i = 0; i < items.length; i++) items[i].classList.toggle('sel', i === sel);
    items[sel].scrollIntoView({ block: 'nearest' });
  }

  if (input) {
    input.addEventListener('input', function () {
      var tokens = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      if (!tokens.length) { render([]); return; }
      var scored = [];
      for (var i = 0; i < entries.length; i++) {
        var s = score(entries[i], tokens);
        if (s > 0) scored.push([s, entries[i]]);
      }
      scored.sort(function (a, b) { return b[0] - a[0]; });
      render(scored.slice(0, 20).map(function (p) { return p[1]; }));
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); updateSel(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); updateSel(-1); }
      else if (e.key === 'Enter' && shown.length) {
        location.href = root + shown[sel].url;
      }
    });
  }
  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    else if (e.key === '/' && !e.target.closest('input, textarea')) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape' && overlay && !overlay.hidden) closeSearch();
  });

  /* ---------- audience filter (home page only) ---------- */
  var filter = document.getElementById('aud-filter');
  if (filter) {
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var aud = btn.dataset.aud;
      filter.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.querySelectorAll('.section-card').forEach(function (card) {
        card.classList.toggle('hidden', aud !== 'all' && (' ' + card.dataset.audiences + ' ').indexOf(' ' + aud + ' ') === -1);
      });
    });
  }
})();
