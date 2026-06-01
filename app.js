/* ============================================================
   PRAXIS – App-Logik
   Navigation · Akkordeons · Rendering (Abrechnung/Lexikon/Dokumente)
   · globale Suche · PWA / Service Worker
   ============================================================ */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

const SUBTITLE = {
  home:        'MFA-Nachschlagewerk · Bayern/KVB',
  ssb:         'Sprechstundenbedarf & Impfen · V1.7',
  abrechnung:  'Vorhalte- & Versorgungspauschale 2026',
  nachschlagen:'Abkürzungen · GOPs · ICD-10 · Begriffe',
  dokumente:   'Original-Unterlagen als PDF'
};
const MODULE_LABEL = { ssb:'SSB & Impfen', abrechnung:'Abrechnung 2026', nachschlagen:'Nachschlagen' };

const DOCS = [
  { file:'pdfs/schnellreferenz-ssb-impfen.pdf',         icon:'💉', title:'Schnellreferenz SSB & Impfen', desc:'KVB V1.7 · kompakte Übersicht' },
  { file:'pdfs/ssb-impfen-workshop-2026.pdf',           icon:'📊', title:'Workshop: SSB & Impfen (Folien)', desc:'71 Seiten · KVB-Seminar 2026' },
  { file:'pdfs/vorhalte-versorgungspauschale-2026.pdf', icon:'🧮', title:'Vorhalte- & Versorgungspauschale 2026', desc:'17 Seiten · Abrechnungsleitfaden' },
  { file:'pdfs/abkuerzungsjournal-2026.pdf',            icon:'🔤', title:'Abkürzungsjournal 2026', desc:'9 Seiten · Revision 1' }
];

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
  if (body && !body.classList.contains('open')) { body.classList.add('open'); if (chev) chev.classList.add('open'); }
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

function renderAbrechnung() {
  const host = $('#abrechnung-list');
  host.innerHTML = (window.ABRECHNUNG || []).map(card => `
    <div class="section" id="${card.id}">
      <div class="section-header"><span>${card.icon} ${esc(card.title)}</span><span class="chevron">›</span></div>
      <div class="section-body">${card.blocks.map(renderBlock).join('')}</div>
    </div>`).join('');
}

/* ============================================================
   RENDERING: LEXIKON (Nachschlagen)
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
    html = items.length ? `<div class="entry-list">${items.map(e => entryHtml(e, false)).join('')}</div>`
                        : '<div class="entry-empty">Kein Treffer.</div>';
  } else if (lexTab === 'begriffe') {
    const items = data.begriffe.filter(e => matchEntry(e, q));
    html = items.length ? `<div class="entry-list">${items.map(begriffHtml).join('')}</div>`
                        : '<div class="entry-empty">Kein Treffer.</div>';
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
   RENDERING: DOKUMENTE
   ============================================================ */
function renderDokumente() {
  $('#doc-list').innerHTML = DOCS.map(d => `
    <a class="doc" href="${d.file}" target="_blank" rel="noopener">
      <span class="doc-ic">${d.icon}</span>
      <span><span class="doc-t">${esc(d.title)}</span><div class="doc-d">${esc(d.desc)}</div></span>
      <span class="doc-go">›</span>
    </a>`).join('');
}

/* ============================================================
   SUCH-INDEX
   ============================================================ */
function buildSearchIndex() {
  const idx = [];
  // SSB & Abrechnung: pro aufklappbarem Abschnitt
  [['view-ssb', 'ssb'], ['view-abrechnung', 'abrechnung']].forEach(([viewId, view]) => {
    $$('#' + viewId + ' .section').forEach(sec => {
      const titleEl = sec.querySelector('.section-header > span');
      const bodyEl  = sec.querySelector('.section-body');
      idx.push({
        module: view,
        moduleLabel: MODULE_LABEL[view],
        title: titleEl ? titleEl.textContent.trim() : '',
        text: bodyEl ? bodyEl.textContent.replace(/\s+/g, ' ').trim() : '',
        viewId: view, anchor: sec.id
      });
    });
  });
  // Nachschlagen: pro Eintrag
  const N = window.NACHSCHLAGEN;
  N.abk.forEach(e => idx.push(lexEntry(e, 'abk', 'Abkürzung')));
  N.begriffe.forEach(e => idx.push(lexEntry(e, 'begriffe', 'Begriff')));
  N.gops.forEach(g => g.items.forEach(e => idx.push(lexEntry(e, 'gops', g.group, e.amount))));
  N.icd.forEach(g => g.items.forEach(e => idx.push(lexEntry(e, 'icd', g.group))));
  SEARCH_INDEX = idx;
}

function lexEntry(e, tab, groupLabel, amount) {
  return {
    module: 'nachschlagen', moduleLabel: 'Nachschlagen',
    title: e.k + (amount ? ' · ' + amount : ''),
    text: e.v + (e.note ? ' (' + e.note + ')' : '') + ' · ' + groupLabel,
    viewId: 'nachschlagen', lexTab: tab, key: e.k
  };
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
  // Treffer hervorheben (auf escaptem Text)
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

function openSearch() {
  const ov = $('#search-overlay');
  ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false');
  const inp = $('#search-input'); inp.value = ''; runSearch('');
  setTimeout(() => inp.focus(), 120);
}
function closeSearch() {
  const ov = $('#search-overlay');
  ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
  $('#search-input').blur();
}

/* ============================================================
   LEXIKON-TABS
   ============================================================ */
function setLexTab(tab) {
  lexTab = tab;
  $$('#lex-seg button').forEach(b => b.classList.toggle('active', b.dataset.lex === tab));
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  renderAbrechnung();
  renderLexikon();
  renderDokumente();
  buildSearchIndex();

  // Tab-Leiste
  $('#tabbar').addEventListener('click', e => {
    const tab = e.target.closest('.tab'); if (tab) navigateTo(tab.dataset.view);
  });

  // Kacheln auf der Startseite
  $$('[data-goto]').forEach(el => el.addEventListener('click', () => navigateTo(el.dataset.goto)));

  // Akkordeons (Delegation für SSB + Abrechnung)
  document.body.addEventListener('click', e => {
    const h = e.target.closest('.section-header');
    if (!h) return;
    const body = h.nextElementSibling, chev = h.querySelector('.chevron');
    const open = body.classList.toggle('open'); if (chev) chev.classList.toggle('open', open);
  });

  // Lexikon
  $('#lex-seg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    setLexTab(b.dataset.lex); $('#lex-filter').value = ''; renderLexikon();
  });
  $('#lex-filter').addEventListener('input', renderLexikon);

  // Suche öffnen/schließen
  $('#open-search').addEventListener('click', openSearch);
  $('#home-search').addEventListener('click', openSearch);
  $('#home-search').addEventListener('focus', openSearch);
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
