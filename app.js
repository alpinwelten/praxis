/* ============================================================
   PRAXIS – App-Logik
   Navigation · Akkordeons · Rendering (Abrechnung/Lexikon)
   · eigenes SVG-Icon-System · globale Suche · PWA / Service Worker
   ============================================================ */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

/* ============================================================
   ICONS – eigene Linien-Icons (stroke = currentColor)
   ============================================================ */
const ICON_PATHS = {
  home:        '<path d="M3 10.7 12 3l9 7.7"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/>',
  syringe:     '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-2 2"/>',
  calculator:  '<rect x="4" y="2" width="16" height="20" rx="2.5"/><path d="M8 6h8"/><path d="M8 11h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 15h.01"/><path d="M12 15h.01"/><path d="M16 15h.01"/><path d="M8 19h.01"/><path d="M12 19h.01"/>',
  book:        '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  shield:      '<path d="M12 22s8-3.5 8-9.5V5l-8-3-8 3v7.5c0 6 8 9.5 8 9.5Z"/><path d="m9 12 2 2 4-4"/>',
  sparkles:    '<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17z"/>',
  search:      '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  zap:         '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  'list-checks':'<path d="m3.5 6 1.4 1.4L7.5 5"/><path d="M11 6h9"/><path d="m3.5 12 1.4 1.4L7.5 11"/><path d="M11 12h9"/><path d="m3.5 18 1.4 1.4L7.5 17"/><path d="M11 18h9"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  table:       '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 9v12"/>',
  alert:       '<path d="M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4.5"/><path d="M12 17.5h.01"/>',
  scale:       '<path d="m16 16 3-8 3 8c-2 1.5-4 1.5-6 0"/><path d="m2 16 3-8 3 8c-2 1.5-4 1.5-6 0"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h3c2 0 5-1 6-2 1 1 4 2 6 2h3"/>',
  'arrow-lr':  '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  hash:        '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
  phone:       '<path d="M13.8 10.2a8 8 0 0 0 4 4l1.4-1.7a1 1 0 0 1 1-.3c.8.3 1.6.4 2.3.5a1 1 0 0 1 .9 1V18a2 2 0 0 1-2.2 2A18 18 0 0 1 4 5.2 2 2 0 0 1 6 3h2.8a1 1 0 0 1 1 .9c.1.8.3 1.6.5 2.3a1 1 0 0 1-.3 1Z"/>',
  'git-branch':'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.4 2.4L15.5 9.5"/>',
  pin:         '<path d="M12 17v5"/><path d="M9 10.8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5.8a2 2 0 0 0 .6 1.4l1.2 1.2a1 1 0 0 1-.7 1.7H7.9a1 1 0 0 1-.7-1.7l1.2-1.2a2 2 0 0 0 .6-1.4Z"/>',
  bookmark:    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>'
};

function iconSvg(name) {
  const p = ICON_PATHS[name];
  if (!p) return '';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}
// Inhalt eines Icon-Chips: Nummer (num:N) oder Icon
function chipInner(name) {
  if (name && name.indexOf('num:') === 0) return `<span class="num-badge">${esc(name.slice(4))}</span>`;
  return iconSvg(name);
}

const TAB_ICON = { home: 'home', ssb: 'syringe', abrechnung: 'calculator', nachschlagen: 'book' };
const SSB_ICON = {
  aktualitaet: 'zap', 'ssb-grundlagen': 'list-checks', 'ssb-rezept': 'file-text', 'ssb-tabelle': 'table',
  'ssb-fallen': 'alert', 'impf-grundlagen': 'scale', bezugsweg: 'arrow-lr', 'impf-tabelle': 'syringe',
  abrechnung: 'hash', kontakte: 'phone'
};
const AB_ICON = { 'ab-ueberblick': 'scale', 'ab-baum': 'git-branch', 'ab-kriterien': 'check-circle', 'ab-merkhilfe': 'pin', 'ab-quellen': 'bookmark' };
function abIconFor(id) { return id.indexOf('ab-fall') === 0 ? 'num:' + id.slice(7) : (AB_ICON[id] || 'bookmark'); }

const SUBTITLE = {
  home:        'MFA-Nachschlagewerk · Bayern/KVB',
  ssb:         'Sprechstundenbedarf & Impfen · V1.7',
  abrechnung:  'Vorhalte- & Versorgungspauschale 2026',
  nachschlagen:'Abkürzungen · GOPs · ICD-10 · Begriffe'
};
const MODULE_LABEL = { ssb: 'SSB & Impfen', abrechnung: 'Abrechnung 2026', nachschlagen: 'Nachschlagen' };

let SEARCH_INDEX = [];

/* ============================================================
   NAVIGATION
   ============================================================ */
function navigateTo(view, { scroll = true } = {}) {
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
  const sub = $('#header-sub'); if (sub) sub.textContent = SUBTITLE[view] || SUBTITLE.home;
  if (scroll) window.scrollTo(0, 0);
}

function openSection(sectionEl) {
  if (!sectionEl) return;
  const body = sectionEl.querySelector('.section-body');
  const chev = sectionEl.querySelector('.chevron');
  const head = sectionEl.querySelector('.section-header');
  if (body && !body.classList.contains('open')) {
    body.classList.add('open'); if (chev) chev.classList.add('open');
    if (head) head.setAttribute('aria-expanded', 'true');
  }
}

// Akkordeon-Kopf umschalten (Maus + Tastatur), inkl. ARIA-Status
function toggleHeader(h) {
  const body = h.nextElementSibling, chev = h.querySelector('.chevron');
  const open = body.classList.toggle('open');
  if (chev) chev.classList.toggle('open', open);
  h.setAttribute('aria-expanded', open ? 'true' : 'false');
}

// Abschnitts-Köpfe als bedienbare Buttons auszeichnen
function enhanceAccordions() {
  $$('.section-header').forEach(h => {
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    const body = h.nextElementSibling;
    h.setAttribute('aria-expanded', body && body.classList.contains('open') ? 'true' : 'false');
    const chev = h.querySelector('.chevron'); if (chev) chev.setAttribute('aria-hidden', 'true');
  });
}

function flash(el) {
  if (!el) return;
  el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
}

/* ============================================================
   RENDERING: BLÖCKE (Abrechnung)
   ============================================================ */
function renderTable(b) {
  const al = b.align || [];
  const alStyle = i => al[i] === 'r' ? ' style="text-align:right;white-space:nowrap"' : '';
  const ths = b.head.map((h, i) => `<th${alStyle(i)}>${h}</th>`).join('');
  const trs = b.rows.map(r => '<tr>' + r.map((c, i) => `<td${alStyle(i)}>${c}</td>`).join('') + '</tr>').join('');
  return `<div class="table-wrap"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
}

function renderBlock(b) {
  switch (b.t) {
    case 'p':     return `<p>${b.html}</p>`;
    case 'note':  return `<p style="font-size:12px;color:var(--gray-1)">${b.html}</p>`;
    case 'h3':    return `<h3>${b.html}</h3>`;
    case 'alert': return `<div class="alert alert-${b.level}">${b.title ? `<strong>${esc(b.title)}</strong>` : ''}${b.html}</div>`;
    case 'table': return renderTable(b);
    case 'steps': return `<ol class="step-list">${b.items.map(i => `<li>${i}</li>`).join('')}</ol>`;
    case 'kpi':   return `<div class="kpi-grid">${b.items.map(i => `<div class="kpi"><div class="num ${i.color || ''}">${esc(i.num)}</div><div class="lab">${esc(i.lab)}</div></div>`).join('')}</div>`;
    case 'casemeta':
      return `<div class="case-meta"><span class="who">${esc(b.who)}</span><span class="pill ${b.level}">${esc(b.level)}</span></div><div class="dx">${esc(b.dx)}</div>`;
    case 'cards':
      return `<div class="grid-2">${b.items.map(c => `<div class="mini-card"><h4 style="color:${c.color || 'var(--text-2)'}">${esc(c.title)}</h4><div style="font-size:13px;line-height:1.5">${c.html}</div></div>`).join('')}</div>`;
    case 'checks':
      return `<ul style="list-style:none;padding:0;margin:8px 0">${b.items.map(it =>
        `<li style="padding:6px 0 6px 26px;position:relative;font-size:14px"><span style="position:absolute;left:3px;top:6px;font-weight:800;color:${it.ok ? 'var(--accent-green)' : 'var(--accent-red)'}">${it.ok ? '✓' : '✕'}</span>${it.html}</li>`
      ).join('')}</ul>`;
    default: return '';
  }
}

function sectionHeaderHtml(iconName, title) {
  return `<span class="sec-title"><span class="sec-ic">${chipInner(iconName)}</span><span class="sec-label">${esc(title)}</span></span><span class="chevron">›</span>`;
}

function renderAbrechnung() {
  const host = $('#abrechnung-list');
  host.innerHTML = (window.ABRECHNUNG || []).map(card => `
    <div class="section" id="${card.id}">
      <div class="section-header">${sectionHeaderHtml(abIconFor(card.id), card.title)}</div>
      <div class="section-body">${card.blocks.map(renderBlock).join('')}</div>
    </div>`).join('');
}

// Statische SSB-Abschnitte mit Icon-Chips versehen (Emoji aus Titel entfernen)
function decorateStaticSections() {
  $$('#view-ssb .section').forEach(sec => {
    const h = sec.querySelector('.section-header');
    if (!h || h.querySelector('.sec-title')) return;
    const span = h.querySelector('span:not(.chevron)');
    if (!span) return;
    const label = span.textContent.replace(/^[^\p{L}\p{N}]+/u, '').trim();
    const name = SSB_ICON[sec.id] || 'bookmark';
    h.innerHTML = sectionHeaderHtml(name, label);
  });
}

// Icons in Chrome-Elemente einsetzen (Tabs, Kacheln, Suche)
function injectIcons() {
  $$('.tab').forEach(t => { const ic = t.querySelector('.ic'); if (ic) ic.innerHTML = iconSvg(TAB_ICON[t.dataset.view]); });
  $$('.tile-ic[data-icon]').forEach(el => { el.innerHTML = iconSvg(el.dataset.icon); });
  $$('.si').forEach(el => { el.innerHTML = iconSvg('search'); });
  const hs = $('#open-search'); if (hs) hs.innerHTML = iconSvg('search');
}

/* ============================================================
   RENDERING: LEXIKON
   ============================================================ */
let lexTab = 'abk';

function entryHtml(e, withAmount) {
  const note = e.note ? `<span class="note">${esc(e.note)}</span>` : '';
  const amt  = (withAmount && e.amount) ? `<span class="amount">${esc(e.amount)}</span>` : '';
  return `<div class="entry"><span class="k">${esc(e.k)}</span><span class="v">${esc(e.v)}${note}</span>${amt}</div>`;
}
function begriffHtml(e) {
  return `<div class="entry" style="flex-direction:column;gap:3px"><span class="k" style="color:var(--text);min-width:0">${esc(e.k)}</span><span class="v">${esc(e.v)}</span></div>`;
}
function matchEntry(e, q) {
  if (!q) return true;
  return (e.k + ' ' + e.v + ' ' + (e.note || '')).toLowerCase().includes(q);
}
function renderLexikon() {
  const data = window.NACHSCHLAGEN;
  const q = ($('#lex-filter').value || '').trim().toLowerCase();
  const host = $('#lex-list');
  let html = '';
  if (lexTab === 'abk') {
    const items = data.abk.filter(e => matchEntry(e, q));
    html = items.length ? `<div class="entry-list">${items.map(e => entryHtml(e, false)).join('')}</div>` : '<div class="entry-empty">Kein Treffer.</div>';
  } else if (lexTab === 'begriffe') {
    const items = data.begriffe.filter(e => matchEntry(e, q));
    html = items.length ? `<div class="entry-list">${items.map(begriffHtml).join('')}</div>` : '<div class="entry-empty">Kein Treffer.</div>';
  } else {
    const groups = data[lexTab];
    const withAmount = lexTab === 'gops';
    let any = false;
    html = groups.map(g => {
      const items = g.items.filter(e => matchEntry(e, q));
      if (!items.length) return '';
      any = true;
      return `<div class="group-label">${esc(g.group)}</div><div class="entry-list">${items.map(e => entryHtml(e, withAmount)).join('')}</div>`;
    }).join('');
    if (!any) html = '<div class="entry-empty">Kein Treffer.</div>';
  }
  host.innerHTML = html;
}

/* ============================================================
   SUCH-INDEX
   ============================================================ */
function lexEntry(e, tab, groupLabel, amount) {
  return {
    module: 'nachschlagen', moduleLabel: 'Nachschlagen',
    title: e.k + (amount ? ' · ' + amount : ''),
    text: e.v + (e.note ? ' (' + e.note + ')' : '') + ' · ' + groupLabel,
    viewId: 'nachschlagen', lexTab: tab, key: e.k
  };
}
function buildSearchIndex() {
  const idx = [];
  [['view-ssb', 'ssb'], ['view-abrechnung', 'abrechnung']].forEach(([viewId, view]) => {
    $$('#' + viewId + ' .section').forEach(sec => {
      const titleEl = sec.querySelector('.section-header .sec-label') || sec.querySelector('.section-header span');
      const bodyEl  = sec.querySelector('.section-body');
      idx.push({
        module: view, moduleLabel: MODULE_LABEL[view],
        title: titleEl ? titleEl.textContent.trim() : '',
        text: bodyEl ? bodyEl.textContent.replace(/\s+/g, ' ').trim() : '',
        viewId: view, anchor: sec.id
      });
    });
  });
  const N = window.NACHSCHLAGEN;
  N.abk.forEach(e => idx.push(lexEntry(e, 'abk', 'Abkürzung')));
  N.begriffe.forEach(e => idx.push(lexEntry(e, 'begriffe', 'Begriff')));
  N.gops.forEach(g => g.items.forEach(e => idx.push(lexEntry(e, 'gops', g.group, e.amount))));
  N.icd.forEach(g => g.items.forEach(e => idx.push(lexEntry(e, 'icd', g.group))));
  SEARCH_INDEX = idx;
}

/* ============================================================
   SUCHE (Overlay)
   ============================================================ */
function snippet(text, q) {
  const low = text.toLowerCase();
  let i = low.indexOf(q);
  if (i < 0) return esc(text.slice(0, 110));
  const from = Math.max(0, i - 40);
  const seg = (from > 0 ? '… ' : '') + text.slice(from, i + q.length + 70);
  const out = esc(seg);
  const eq = esc(text.substr(i, q.length));
  return out.replace(eq, `<mark class="search-hl">${eq}</mark>`);
}

function runSearch(qRaw) {
  const q = (qRaw || '').trim().toLowerCase();
  const host = $('#search-results');
  if (q.length < 2) {
    host.innerHTML = '<div class="sr-hint"><div class="big">🔍</div><div>Tippe einen Begriff ein —<br>z. B. „Hepatitis", „03100", „Impflücke", „MFA".</div></div>';
    return;
  }
  const hits = SEARCH_INDEX
    .map(e => {
      const inTitle = e.title.toLowerCase().includes(q);
      const inText  = e.text.toLowerCase().includes(q);
      if (!inTitle && !inText) return null;
      return { e, score: (inTitle ? 0 : 1) };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score);

  if (!hits.length) {
    host.innerHTML = '<div class="sr-empty"><div class="big">🤷</div><div>Kein Ergebnis für „' + esc(qRaw) + '".</div></div>';
    return;
  }

  const order = ['ssb', 'abrechnung', 'nachschlagen'];
  let html = '';
  order.forEach(mod => {
    const group = hits.filter(h => h.e.module === mod);
    if (!group.length) return;
    html += `<div class="sr-group">${MODULE_LABEL[mod]} · ${group.length}</div>`;
    group.slice(0, 40).forEach(({ e }) => {
      const payload = encodeURIComponent(JSON.stringify({ v: e.viewId, a: e.anchor || '', lt: e.lexTab || '', k: e.key || '' }));
      html += `<button class="sr-item" data-jump="${payload}">
        <div class="t">${esc(e.title)}</div>
        <div class="c">${snippet(e.text, q)}</div>
        <div class="m">${esc(e.moduleLabel)}</div>
      </button>`;
    });
  });
  host.innerHTML = html;
}

function jumpTo(p) {
  closeSearch();
  navigateTo(p.v);
  setTimeout(() => {
    if (p.v === 'nachschlagen') {
      if (p.lt) setLexTab(p.lt);
      const f = $('#lex-filter'); f.value = p.k || ''; renderLexikon();
      const first = $('#lex-list .entry'); if (first) { first.scrollIntoView({ block: 'center' }); flash(first); }
    } else if (p.a) {
      const sec = document.getElementById(p.a);
      if (sec) { openSection(sec); sec.scrollIntoView({ block: 'start' }); flash(sec); }
    }
  }, 80);
}

let searchTrigger = null;
function openSearch() {
  searchTrigger = document.activeElement;
  const ov = $('#search-overlay');
  ov.classList.add('open'); ov.removeAttribute('inert'); ov.setAttribute('aria-hidden', 'false');
  const inp = $('#search-input'); inp.value = ''; runSearch('');
  setTimeout(() => inp.focus(), 120);
}
function closeSearch() {
  const ov = $('#search-overlay');
  if (!ov.classList.contains('open')) return;
  ov.classList.remove('open'); ov.setAttribute('inert', ''); ov.setAttribute('aria-hidden', 'true');
  $('#search-input').blur();
  if (searchTrigger && typeof searchTrigger.focus === 'function') { try { searchTrigger.focus(); } catch (e) {} }
}

/* ============================================================
   LEXIKON-TABS
   ============================================================ */
function setLexTab(tab) {
  lexTab = tab;
  $$('#lex-seg button').forEach(b => {
    const on = b.dataset.lex === tab;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  renderAbrechnung();
  decorateStaticSections();
  enhanceAccordions();
  renderLexikon();
  injectIcons();
  buildSearchIndex();

  $('#tabbar').addEventListener('click', e => {
    const tab = e.target.closest('.tab'); if (tab) navigateTo(tab.dataset.view);
  });
  $$('[data-goto]').forEach(el => el.addEventListener('click', () => navigateTo(el.dataset.goto)));

  document.body.addEventListener('click', e => {
    const h = e.target.closest('.section-header');
    if (h) toggleHeader(h);
  });
  document.body.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const h = e.target.closest('.section-header');
    if (h) { e.preventDefault(); toggleHeader(h); }
  });

  $('#lex-seg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    setLexTab(b.dataset.lex); $('#lex-filter').value = ''; renderLexikon();
  });
  $('#lex-filter').addEventListener('input', renderLexikon);

  $('#open-search').addEventListener('click', openSearch);
  $('#home-search').addEventListener('click', openSearch);
  $('#search-cancel').addEventListener('click', closeSearch);
  $('#search-input').addEventListener('input', e => runSearch(e.target.value));
  $('#search-results').addEventListener('click', e => {
    const it = e.target.closest('[data-jump]'); if (!it) return;
    jumpTo(JSON.parse(decodeURIComponent(it.dataset.jump)));
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  navigateTo('home', { scroll: false });
}

document.addEventListener('DOMContentLoaded', init);

/* ============================================================
   SERVICE WORKER (Offline)
   ============================================================ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline egal */ });
  });
}
