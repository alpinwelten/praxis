/* Praxis – MFA-Nachschlagewerk
   Shell v2: Hash-Routing (Zurück-Geste funktioniert), Kapitelseiten statt Akkordeons,
   permanente Suche im Header mit Normalisierung, Synonymen und ICD-Bereichs-Expansion.
   Inhalte: data/abrechnung.js, data/nachschlagen.js, SSB-Sektionen in index.html. */
'use strict';

/* ============================== Helfer ============================== */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

function norm(s) {
  return String(s).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[„“”‚‘’]/g, '"').replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ').trim();
}
/* Codes zusätzlich ohne Punkt auffindbar machen: "e06.3" -> "e063" */
function dotless(s) { return s.replace(/(\d)\.(\d)/g, '$1$2'); }
function stripTags(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  // Tabellenzellen/Zeilen nicht zusammenkleben lassen:
  d.querySelectorAll('td,th,li,br,tr,p,div').forEach(el => el.after(' '));
  return d.textContent.replace(/\s+/g, ' ').trim();
}
function stripEmoji(s) {
  return s.replace(/^[^A-Za-zÄÖÜäöü0-9]+\s*/u, '').trim();
}

/* ============================== Routing ============================== */
/* Routen: #/start · #/abrechnung[/kapitel] · #/ssb[/kapitel] · #/lexikon[/kategorie] · #/suche */
const scrollPos = {};   // Hash -> Scroll-Y
let currentHash = null;
let pendingAnchor = null; // { hash, sel } für Sprung aus Suchtreffern
let searchReturnHash = '#/start';

function parseHash() {
  const h = location.hash || '#/start';
  const parts = h.replace(/^#\//, '').split('/');
  let sub = parts[1] || null;
  if (sub) { try { sub = decodeURIComponent(sub); } catch (e) { /* Rohwert behalten → Unbekannt-Umleitung greift */ } }
  return { view: parts[0] || 'start', sub };
}

function route() {
  if (currentHash !== null) scrollPos[currentHash] = window.scrollY;
  const r = parseHash();
  const known = ['start', 'abrechnung', 'ssb', 'lexikon', 'suche'];
  if (!known.includes(r.view)) { location.replace('#/start'); return; }

  $$('.view').forEach(v => v.classList.remove('active'));
  $('#view-' + r.view).classList.add('active');

  if (r.view === 'abrechnung') showAbrechnung(r.sub);
  if (r.view === 'ssb')        showSsb(r.sub);
  if (r.view === 'lexikon')    showLexikon(r.sub);
  if (r.view === 'suche')      showSuche();
  if (r.view !== 'suche')      leaveSuche();

  updateChrome(r);

  const hash = location.hash || '#/start';
  currentHash = hash;
  if (pendingAnchor && pendingAnchor.hash === hash) {
    const sel = pendingAnchor.sel;
    pendingAnchor = null;
    const el = document.querySelector(sel);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ block: 'start' });
        el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
        // Screenreader/Tastatur nicht im Leeren zurücklassen
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      });
      return;
    }
  }
  window.scrollTo(0, scrollPos[hash] || 0);
}

/* Kopfbereich: Kontextleiste (Zurück + Titel), Tab-Markierung */
function updateChrome(r) {
  const bar = $('#contextbar');
  const info = chromeInfo(r);
  if (info) {
    bar.hidden = false;
    $('#back-link').setAttribute('href', info.back);
    $('#back-label').textContent = info.backLabel;
    $('#context-title').textContent = info.title;
  } else {
    bar.hidden = true;
  }
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === r.view));
  document.title = (info && info.title ? info.title + ' · ' : '') + 'Praxis';
}

function chromeInfo(r) {
  if (r.view === 'start') return null;
  if (r.view === 'suche') return { back: searchReturnHash, backLabel: 'Zurück', title: 'Suche' };
  if (r.view === 'lexikon') return { back: '#/start', backLabel: 'Start', title: 'Lexikon' };
  if (r.view === 'abrechnung') {
    if (!r.sub) return { back: '#/start', backLabel: 'Start', title: 'Abrechnung 2026' };
    const card = abCardById(r.sub);
    return { back: '#/abrechnung', backLabel: 'Abrechnung', title: card ? card.title.replace(/^Fall \d · /, '') : 'Abrechnung 2026' };
  }
  if (r.view === 'ssb') {
    if (!r.sub) return { back: '#/start', backLabel: 'Start', title: 'SSB & Impfen' };
    const s = SSB_CHAPTERS.find(c => c.id === r.sub);
    return { back: '#/ssb', backLabel: 'SSB & Impfen', title: s ? s.title : 'SSB & Impfen' };
  }
  return null;
}

/* ============================== Abrechnung ============================== */
const AB_GROUPS = [
  { label: 'Teil 1 · Übersicht', ids: ['ab-ueberblick', 'ab-baum', 'ab-kriterien', 'ab-merkhilfe'] },
  { label: 'Teil 2 · Acht Praxisfälle', ids: ['ab-fall1', 'ab-fall2', 'ab-fall3', 'ab-fall4', 'ab-fall5', 'ab-fall6', 'ab-fall7', 'ab-fall8'] },
  { label: 'Anhang', ids: ['ab-quellen'] },
];

function abCardById(id) { return (window.ABRECHNUNG || []).find(c => c.id === id); }

function abEyebrow(id) {
  const m = id.match(/^ab-fall(\d)$/);
  if (m) return 'Fall ' + m[1] + ' von 8';
  if (id === 'ab-quellen') return 'Anhang';
  return 'Teil 1 · Übersicht';
}

function abSubtitle(card) {
  const meta = card.blocks.find(b => b.t === 'casemeta');
  if (meta) return meta.who + ' · ' + stripTags(meta.dx);
  const p = card.blocks.find(b => b.t === 'p');
  return p ? stripTags(p.html) : '';
}

function renderAbrechnungToc() {
  const host = $('#abrechnung-toc');
  let html = `<div class="view-head"><p class="eyebrow">Modul 01</p><h1>Abrechnung 2026</h1>
    <p>Vorhalte- &amp; Versorgungspauschale · Praxishilfe MFA · Stand April 2026</p></div>`;
  for (const g of AB_GROUPS) {
    html += `<p class="home-label">${esc(g.label)}</p><div class="toc-list">`;
    g.ids.forEach(id => {
      const c = abCardById(id);
      if (!c) return;
      const fall = id.match(/^ab-fall(\d)$/);
      const num = g.label === 'Anhang' ? '§' : String(fall ? +fall[1] : g.ids.indexOf(id) + 1).padStart(2, '0');
      html += `<a class="toc-row" href="#/abrechnung/${id}">
        <span class="module-num">${num}</span>
        <span class="module-txt"><b>${esc(c.title.replace(/^Fall \d · /, ''))}</b><small>${esc(abSubtitle(c).slice(0, 96))}</small></span>
        <span class="row-ch" aria-hidden="true">›</span></a>`;
    });
    html += `</div>`;
  }
  html += `<div class="app-footer">Eurowerte = Näherung (Punktwert 2026 ca. 12,4 ¢) · ohne Gewähr</div>`;
  host.innerHTML = html;
}

function showAbrechnung(sub) {
  const toc = $('#abrechnung-toc');
  const chap = $('#abrechnung-chapter');
  const card = sub ? abCardById(sub) : null;
  if (!card) {
    toc.hidden = false; chap.hidden = true;
    if (sub) location.replace('#/abrechnung');
    return;
  }
  toc.hidden = true; chap.hidden = false;
  chap.innerHTML = renderCard(card) + chapterNav('abrechnung', AB_GROUPS.flatMap(g => g.ids), card.id,
    id => (abCardById(id) || {}).title || id);
}

function renderCard(card) {
  let html = `<header class="chapter-head"><p class="eyebrow accent">${esc(abEyebrow(card.id))}</p><h1>${esc(card.title.replace(/^Fall \d · /, ''))}</h1></header>`;
  card.blocks.forEach((b, i) => { html += renderBlock(b, card.id + '-b' + i); });
  return html;
}

function renderBlock(b, anchorId) {
  const a = ` data-bi="${anchorId}"`;
  switch (b.t) {
    case 'p': return `<p class="cb-p"${a}>${b.html}</p>`;
    case 'h3': return `<h3 class="cb-h3"${a}>${b.html}</h3>`;
    case 'note': return `<p class="note"${a}>${b.html}</p>`;
    case 'alert': {
      const lvl = ['info', 'warn', 'ok', 'critical'].includes(b.level) ? b.level : 'info';
      return `<div class="alert alert-${lvl}"${a}><strong>${esc(b.title || '')}</strong> ${b.html}</div>`;
    }
    case 'steps':
      return `<ol class="steps"${a}>` + b.items.map(s => `<li>${s}</li>`).join('') + `</ol>`;
    case 'checks':
      return `<ul class="checks"${a}>` + b.items.map(it =>
        `<li class="${it.ok ? 'c-ok' : 'c-no'}"><span class="dot" aria-hidden="true">${it.ok ? '✓' : '✕'}</span><span>${it.html}</span></li>`).join('') + `</ul>`;
    case 'table': {
      const al = b.align || [];
      const cls = i => (al[i] === 'r' ? ' class="ta-r"' : '');
      let t = `<div class="table-wrap"${a}><table><thead><tr>` +
        b.head.map((h, i) => `<th${cls(i)}>${h}</th>`).join('') + `</tr></thead><tbody>`;
      t += b.rows.map(row => `<tr>` + row.map((c, i) => {
        const isGop = (b.head[i] || '').trim().toUpperCase() === 'GOP' && c && !/[<]/.test(c);
        return `<td${cls(i)}>${isGop ? `<span class="code">${esc(c)}</span>` : c}</td>`;
      }).join('') + `</tr>`).join('');
      return t + `</tbody></table></div>`;
    }
    case 'kpi':
      return `<div class="kpi-row"${a}>` + b.items.map(k =>
        `<div class="kpi${k.color === 'red' ? ' warn' : ''}${k.color === 'green' ? ' ok' : ''}"><b>${esc(k.num)}</b><span>${esc(k.lab)}</span></div>`).join('') + `</div>`;
    case 'casemeta': {
      const initials = (b.who.match(/[A-ZÄÖÜ]/g) || []).slice(0, 2).join('');
      return `<div class="casemeta"${a}><span class="avatar" aria-hidden="true">${esc(initials)}</span>
        <span class="cm-txt"><b>${esc(b.who)}</b><small>${b.dx}</small></span>
        <span class="badge level-${esc(b.level)}">${esc(b.level)}</span></div>`;
    }
    case 'cards':
      return `<div class="grid-2"${a}>` + b.items.map(c =>
        `<div class="mini-card" style="--card-accent:${esc(c.color || '#0F766E')}"><h4>${esc(c.title)}</h4><p>${c.html}</p></div>`).join('') + `</div>`;
    default: return '';
  }
}

function chapterNav(view, ids, id, titleOf) {
  const i = ids.indexOf(id);
  const prev = i > 0 ? ids[i - 1] : null;
  const next = i >= 0 && i < ids.length - 1 ? ids[i + 1] : null;
  const clean = t => esc(String(t).replace(/^Fall \d · /, ''));
  let html = `<nav class="chapter-nav">`;
  html += prev ? `<a class="cn cn-prev" href="#/${view}/${prev}"><small>‹ Vorheriges</small><b>${clean(titleOf(prev))}</b></a>` : `<span></span>`;
  html += next ? `<a class="cn cn-next" href="#/${view}/${next}"><small>Nächstes ›</small><b>${clean(titleOf(next))}</b></a>` : `<span></span>`;
  return html + `</nav>`;
}

/* ============================== SSB & Impfen ============================== */
let SSB_CHAPTERS = [];

function initSsb() {
  SSB_CHAPTERS = $$('#ssb-sections .section').map(sec => {
    const head = sec.querySelector('.section-header span');
    const title = stripEmoji(head ? head.textContent : sec.id);
    const p = sec.querySelector('.section-body p');
    return { id: sec.id, el: sec, title, teaser: p ? p.textContent.replace(/\s+/g, ' ').trim().slice(0, 96) : '' };
  });
  // Akkordeon-Köpfe durch Kapitel-Titel ersetzen
  SSB_CHAPTERS.forEach((c, i) => {
    const head = document.createElement('header');
    head.className = 'chapter-head';
    head.innerHTML = `<p class="eyebrow accent">Kapitel ${i + 1} von ${SSB_CHAPTERS.length}</p><h1>${esc(c.title)}</h1>`;
    const oldHead = c.el.querySelector('.section-header');
    if (oldHead) oldHead.replaceWith(head);
  });
  const host = $('#ssb-toc');
  let html = `<div class="view-head"><p class="eyebrow">Modul 02</p><h1>SSB &amp; Impfen</h1>
    <p>Sprechstundenbedarf &amp; Impfen · KVB-Seminar V1.7 · Stand Mai 2026</p></div><div class="toc-list">`;
  SSB_CHAPTERS.forEach((c, i) => {
    html += `<a class="toc-row" href="#/ssb/${c.id}">
      <span class="module-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="module-txt"><b>${esc(c.title)}</b><small>${esc(c.teaser)}</small></span>
      <span class="row-ch" aria-hidden="true">›</span></a>`;
  });
  host.innerHTML = html + `</div><div class="app-footer">KVB-Seminar V1.7 · Stand 05.05.2026 · ohne Gewähr</div>`;
}

function showSsb(sub) {
  const toc = $('#ssb-toc');
  const wrap = $('#ssb-sections');
  const nav = $('#ssb-chapter-nav');
  const target = sub ? SSB_CHAPTERS.find(c => c.id === sub) : null;
  if (!target) {
    toc.hidden = false; wrap.hidden = true; nav.hidden = true; nav.innerHTML = '';
    if (sub) location.replace('#/ssb');
    return;
  }
  toc.hidden = true; wrap.hidden = false;
  SSB_CHAPTERS.forEach(c => { c.el.hidden = c.id !== target.id; });
  nav.hidden = false;
  nav.innerHTML = chapterNav('ssb', SSB_CHAPTERS.map(c => c.id), target.id,
    id => (SSB_CHAPTERS.find(c => c.id === id) || {}).title || id)
    .replace(/^<nav class="chapter-nav">/, '').replace(/<\/nav>$/, '');
}

/* ============================== Lexikon ============================== */
const LEX_CATS = [
  { key: 'abk', label: 'Abkürzung', plural: 'Abkürzungen' },
  { key: 'gops', label: 'GOP', plural: 'GOPs' },
  { key: 'icd', label: 'ICD-10', plural: 'ICD-10' },
  { key: 'begriffe', label: 'Abrechnung', plural: 'Abrechnungs- & Praxisbegriffe' },
  { key: 'med', label: 'Medizin', plural: 'Medizinische Fachbegriffe' },
];
let LEX = [];      // { cat, group, k, v, note, amount, hay, codes:Set }
let lexCat = 'alle';

/* "E78.0–E78.5", "M10.00–M10.99", "I10.00 / I10.90" -> alle Einzelcodes (normalisiert, mit und ohne Punkt) */
function expandCodes(key) {
  const out = new Set();
  norm(key).split(/\s*\/\s*/).forEach(part => {
    part = part.trim();
    const range = part.match(/^([a-z])(\d+)\.(\d+)-([a-z])(\d+)\.(\d+)$/);
    if (range && range[1] === range[4] && range[2] === range[5]) {
      const letter = range[1], major = range[2], from = range[3], to = range[6];
      const width = from.length;
      for (let n = parseInt(from, 10); n <= parseInt(to, 10); n++) {
        const minor = String(n).padStart(width, '0');
        const code = `${letter}${major}.${minor}`;
        out.add(code); out.add(dotless(code));
        if (width > 1) { const short = `${letter}${major}.${minor[0]}`; out.add(short); out.add(dotless(short)); }
      }
      out.add(letter + major);
    } else if (part) {
      out.add(part); out.add(dotless(part));
      const fam = part.match(/^([a-z]\d+)\./); if (fam) out.add(fam[1]);
      // GOPs werden mündlich ohne führende Null zugerufen: „3220“ ≙ 03220
      if (/^0\d+$/.test(part)) out.add(part.replace(/^0+/, ''));
    }
  });
  return out;
}

function initLex() {
  const N = window.NACHSCHLAGEN || {};
  const push = (cat, group, e) => {
    const kN = norm(e.k);
    // Bei GOPs/ICD ist e.k nur die Ziffer — der sichtbare Haupttext der Zeile
    // ist der Leistungs-/Diagnosename in e.v (ohne Klammer-Zusätze). Er zählt
    // deshalb zum Titel, sonst wäre der Weg Name → Nummer tot.
    const vName = (cat === 'gops' || cat === 'icd')
      ? ' ' + norm(String(e.v).replace(/\([^)]*\)/g, ' ')) : '';
    LEX.push({
      cat, group: group || '', k: e.k, v: e.v, note: e.note || '', amount: e.amount || '',
      // thay: sichtbarer Titel — er entscheidet im Lexikon.
      // shay: Titel + syn (unsichtbare Zweitnamen: Synonyme, Latein, gängige
      //       Falschschreibungen) — greift erst ab 5 Zeichen Eingabe.
      // hay:  Volltext — nur für die globale Suche (buildIndex).
      thay: kN + vName + ' ' + dotless(kN),
      shay: kN + vName + ' ' + norm(e.syn || '') + ' ' + dotless(kN),
      // syns: jede syn-Phrase einzeln — kurze Eingaben (U7, VHF, RR) matchen
      // nur eine KOMPLETTE Phrase, nie Füllwörter aus längeren Phrasen.
      syns: new Set(norm(e.syn || '').split(/\s*,\s*/).filter(Boolean).flatMap(s => s === dotless(s) ? [s] : [s, dotless(s)])),
      hay: norm([e.k, e.v, e.note, e.amount, e.syn].filter(Boolean).join(' ')) + ' ' + dotless(kN),
      codes: (cat === 'icd' || cat === 'gops') ? expandCodes(e.k) : new Set(),
    });
  };
  (N.abk || []).forEach(e => push('abk', '', e));
  (N.gops || []).forEach(g => g.items.forEach(e => push('gops', g.group, e)));
  (N.icd || []).forEach(g => g.items.forEach(e => push('icd', g.group, e)));
  (N.begriffe || []).forEach(e => push('begriffe', '', e));
  (window.MEDIZIN || []).forEach(e => push('med', e.group || '', e));
}

function showLexikon(sub) {
  const valid = ['abk', 'gops', 'icd', 'begriffe', 'med'];
  lexCat = valid.includes(sub) ? sub : 'alle';
  const stored = sessionStorage.getItem('lexQuery') || '';
  sessionStorage.removeItem('lexQuery');
  $('#lex-q').value = stored;
  syncLexChips();
  renderLex();
}

function syncLexChips() {
  $$('#lex-chips .chip').forEach(c => {
    const on = c.dataset.cat === lexCat;
    c.classList.toggle('active', on);
    c.setAttribute('aria-pressed', on);
  });
}

function lexRow(e, q) {
  // Medizin-Begriffe: Wortmarke statt Code-Chip (lange Begriffe passen nicht in Chips)
  if (e.cat === 'med') {
    return `<div class="lex-row lex-row-med">
      <span class="lex-txt"><b>${hl(e.k, q)}</b><span>${hl(e.v, q)}</span></span>
    </div>`;
  }
  const meta = [e.amount, e.note].filter(Boolean).map(esc).join(' · ');
  return `<div class="lex-row">
    <span class="code${e.cat === 'icd' ? ' code-icd' : ''}">${hl(e.k, q)}</span>
    <span class="lex-txt"><span>${hl(e.v, q)}</span>${meta ? `<small>${meta}</small>` : ''}</span>
  </div>`;
}

function renderLex() {
  const qRaw = $('#lex-q').value.trim();
  const host = $('#lex-list');
  const cats = lexCat === 'alle' ? LEX_CATS.map(c => c.key) : [lexCat];
  // Über die GANZE Ansicht filtern, nicht pro Kategorie — sonst fällt eine
  // einzelne leere Kategorie auf Substring zurück (Rauschen kehrt zurück)
  // und der „X Treffer“-Zähler des Empty-State passt nicht zur Anzeige.
  const pool = LEX.filter(e => cats.includes(e.cat));
  const matched = qRaw ? lexFilter(pool, qRaw) : pool;
  let html = '';

  for (const key of cats) {
    const cat = LEX_CATS.find(c => c.key === key);
    const entries = matched.filter(e => e.cat === key);
    if (!entries.length) continue;
    html += `<p class="home-label">${esc(cat.plural)}${qRaw ? ' · ' + entries.length : ''}</p>`;
    let lastGroup = null;
    html += `<div class="lex-group">`;
    for (const e of entries) {
      if (e.group && e.group !== lastGroup && !qRaw) { html += `<p class="lex-subhead">${esc(e.group)}</p>`; lastGroup = e.group; }
      html += lexRow(e, qRaw);
    }
    html += `</div>`;
  }

  if (!html) {
    const other = lexCat !== 'alle' && qRaw
      ? lexFilter(LEX.filter(e => e.cat !== lexCat), qRaw).length : 0;
    html = `<div class="empty">Kein Titel-Treffer${qRaw ? ` für „${esc(qRaw)}“` : ''}${lexCat !== 'alle' ? ' in dieser Kategorie' : ''}.` +
      (other ? ` <button class="linklike" id="lex-all-btn">${other} Treffer in allen Kategorien anzeigen</button>` : '') +
      (qRaw ? ` <button class="linklike" id="lex-suche-btn">In der Volltextsuche nach „${esc(qRaw)}“ suchen</button>` : '') + `</div>`;
  }
  host.innerHTML = html;
  const btn = $('#lex-all-btn');
  if (btn) btn.addEventListener('click', () => { lexCat = 'alle'; syncLexChips(); renderLex(); });
  const sbtn = $('#lex-suche-btn');
  if (sbtn) sbtn.addEventListener('click', () => {
    const lq = $('#lex-q').value.trim();
    $('#q').value = lq;
    sessionStorage.setItem('lexQuery', lq);   // Zurück-Geste stellt die Anfrage wieder her
    searchReturnHash = location.hash || '#/start';
    pushedSearch = true;
    searchEnteredByUser = true;   // showSuche darf die übergebene Anfrage nicht überschreiben
    location.hash = '#/suche';
  });
}

/* Ein einzelnes Zeichen filtert nach Anfangsbuchstabe des Eintrags („E“ → E03.0, EBM, EKG …).
   Ab 2 Zeichen entscheidet der SICHTBARE TITEL (bei GOPs/ICD inkl. des
   Leistungs-/Diagnosenamens). Ab 5 Zeichen — also bei ganzen Wörtern, nicht
   beim Tipp-Präfix — zählen zusätzlich die unsichtbaren Zweitnamen (syn):
   „Angina“ findet die Tonsillitis, „se“ holt sie nicht in die S-Liste.
   Beschreibungen werden im Lexikon bewusst NICHT durchsucht; dafür gibt es
   die Volltextsuche (Absprung-Button im Kein-Treffer-Fall). */
function lexFilter(entries, qRaw) {
  const q1 = norm(qRaw);
  if (/^[a-z0-9]$/.test(q1)) return entries.filter(e => norm(e.k).startsWith(q1));
  let groups = tokenGroups(qRaw);
  // „U 7“: Eingaben nur aus 1-Zeichen-Wörtern kompakt als ein Token werten —
  // sonst zeigte das Lexikon alles als Treffer, die globale Suche nichts.
  if (!groups.length) {
    const compact = q1.replace(/[^a-z0-9]+/g, '');
    if (compact.length >= 2) groups = tokenGroups(compact);
    if (!groups.length) return [];
  }
  return entries.filter(e => lexMatch(e, groups));
}

function lexMatch(e, groups) {
  return groups.every(alts =>
    alts.some(a => {
      if (e.codes.has(a.s) || codePrefix(e, a.s)) return true;
      if (a.s.length >= 5) return (a.strict ? hasTok : hasTokStart)(e.shay, a.s, false);
      // Kurz getippt: Präfix zählt nur im Titel — aber ein exakt getipptes
      // Kurzwort (U7, VHF, RR …) trifft seine komplette Zweitnamen-Phrase.
      return (a.strict ? hasTok : hasTokStart)(e.thay, a.s, false) || e.syns.has(a.s);
    }));
}
function codePrefix(e, t) {
  if (/^\d{2,}$/.test(t)) {
    // GOP-Präfix beim Tippen, auch ohne führende Null: „322“ → 03220/03221 …
    for (const c of e.codes) if (c.startsWith(t)) return true;
    return false;
  }
  if (!/^[a-z]\d/.test(t)) return false;
  for (const c of e.codes) if (c.startsWith(t) || t.startsWith(c)) return true;
  return false;
}

/* ============================== Such-Index ============================== */
let INDEX = [];

function catLabel(item) {
  if (item.type === 'lex') return LEX_CATS.find(c => c.key === item.cat).label;
  if (item.type === 'ab') return 'Abrechnung';
  return 'SSB & Impfen';
}

function buildIndex() {
  INDEX = [];
  // Lexikon: jeder Eintrag einzeln
  LEX.forEach(e => INDEX.push({
    type: 'lex', cat: e.cat, title: e.k, sub: e.v,
    hay: e.hay, codes: e.codes, titleN: norm(e.k),
    go() {
      sessionStorage.setItem('lexQuery', e.k);
      const target = '#/lexikon/' + e.cat;
      if (location.hash === target) showLexikon(e.cat); else location.hash = target;
    },
  }));
  // Abrechnung: Kapitel + jeder Block einzeln
  (window.ABRECHNUNG || []).forEach(card => {
    const cardTitle = card.title.replace(/^Fall \d · /, '');
    INDEX.push({
      type: 'ab', title: card.title, sub: abSubtitle(card).slice(0, 140),
      hay: norm(card.title + ' ' + abSubtitle(card)), codes: new Set(), titleN: norm(card.title),
      go() { location.hash = '#/abrechnung/' + card.id; },
    });
    card.blocks.forEach((b, i) => {
      const text = blockText(b);
      if (!text) return;
      const title = (b.t === 'alert' && b.title) ? b.title : (b.t === 'h3' ? stripTags(b.html) : cardTitle);
      const sel = `[data-bi="${card.id}-b${i}"]`;
      INDEX.push({
        type: 'ab', title, sub: text.slice(0, 160), context: cardTitle,
        hay: norm(title + ' ' + text) + ' ' + dotless(norm(text)), codes: new Set(), titleN: norm(title),
        go() { jumpToAnchor('#/abrechnung/' + card.id, sel); },
      });
    });
  });
  // SSB: Kapitel + Unterabschnitte (h4-Chunks, Tabellen, Alerts)
  SSB_CHAPTERS.forEach(ch => {
    INDEX.push({
      type: 'ssb', title: ch.title, sub: ch.teaser,
      hay: norm(ch.title + ' ' + ch.teaser), codes: new Set(), titleN: norm(ch.title),
      go() { location.hash = '#/ssb/' + ch.id; },
    });
    const body = ch.el.querySelector('.section-body');
    if (!body) return;
    let currentH4 = '', si = 0;
    Array.from(body.querySelectorAll(':scope > *')).forEach(el => {
      if (el.tagName === 'H4') { currentH4 = el.textContent.trim(); return; }
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (text.length < 25) return;
      const id = `${ch.id}-s${si++}`;
      el.setAttribute('data-si', id);
      const title = currentH4 || ch.title;
      const sel = `[data-si="${id}"]`;
      INDEX.push({
        type: 'ssb', title, sub: text.slice(0, 160), context: ch.title,
        hay: norm(title + ' ' + text) + ' ' + dotless(norm(text)), codes: new Set(), titleN: norm(title),
        go() { jumpToAnchor('#/ssb/' + ch.id, sel); },
      });
    });
  });
}

function blockText(b) {
  switch (b.t) {
    case 'p': case 'h3': case 'note': return stripTags(b.html);
    case 'alert': return stripTags((b.title || '') + ' ' + b.html);
    case 'steps': return b.items.map(stripTags).join(' · ');
    case 'checks': return b.items.map(i => stripTags(i.html)).join(' · ');
    case 'table': return b.head.map(h => stripTags(String(h))).join(' ') + ' ' +
      b.rows.map(r => r.map(c => stripTags(String(c))).join(' ')).join(' · ');
    case 'kpi': return b.items.map(k => k.num + ' ' + k.lab).join(' · ');
    case 'casemeta': return b.who + ' ' + stripTags(b.dx);
    case 'cards': return b.items.map(c => c.title + ' ' + stripTags(c.html)).join(' · ');
    default: return '';
  }
}

function jumpToAnchor(hash, sel) {
  pendingAnchor = { hash, sel };
  if (location.hash === hash) route(); else location.hash = hash;
}

/* ============================== Suche ============================== */
/* Tokens matchen an einer WORTGRENZE — nie frei schwebend mitten im Wort:
   - Wortanfang: „kard“ → Kardiomyopathie, aber NICHT Myokardinfarkt/Perikarditis.
   - Wortende (Komposita, ab 5 Zeichen): „spiegelung“ → Magenspiegelung,
     „pauschale“ → Versorgungspauschale. Bis 2 Restzeichen sind erlaubt,
     damit Plural/Fugenzeichen („embolie“ → Lungenembolien, „quartal“ →
     Folgequartals) und die letzten Tastenschläge beim Tippen nicht sperren.
     Erst ab 5 Zeichen, sonst fischt „kard“ über „des Myokards“ das
     Perikarditis-Rauschen wieder herein.
   Erst wenn die ganze Suche so leer bliebe, greift einmalig der
   Substring-Fallback (loose). Kurze Synonym-Aliase wie „au“/„rr“ weiterhin
   nur als GANZES Wort, sonst trifft „au“ jede „Pauschale“.
   Caches ohne Prototype, sonst crasht die Eingabe „constructor“. */
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tokReWord = Object.create(null), tokReStart = Object.create(null), tokReEdge = Object.create(null);
function hasTok(hay, t, loose) {          // ganzes Wort (strenge Aliase)
  if (t.length >= 4) return hasTokStart(hay, t, loose);
  let re = tokReWord[t];
  if (!re) re = tokReWord[t] = new RegExp('(^|[^a-z0-9])' + escRe(t) + '($|[^a-z0-9])');
  return re.test(hay);
}
function hasTokStart(hay, t, loose) {     // Wortgrenze (Nutzereingabe)
  if (t.length >= 4) {
    if (loose) return hay.includes(t);
    let re = tokReEdge[t];
    if (!re) re = tokReEdge[t] = new RegExp('(^|[^a-z0-9])' + escRe(t) +
      (t.length >= 5 ? '|' + escRe(t) + '[a-z0-9]{0,2}($|[^a-z0-9])' : ''));
    return re.test(hay);
  }
  let re = tokReStart[t];
  if (!re) re = tokReStart[t] = new RegExp('(^|[^a-z0-9])' + escRe(t));
  return re.test(hay);
}

function tokenGroups(qRaw) {
  const ALIAS = window.SUCHE_ALIASE || {};
  const tokens = norm(qRaw).split(/[\s,;]+/).filter(t => t.length >= 2);
  return tokens.map(t => {
    const alts = new Map(); // Text -> strict (true = nur ganzes Wort)
    const add = (s, strict) => { if (s.length >= 2 && !alts.has(s)) alts.set(s, strict); };
    add(t, false); add(dotless(t), false);
    // Flexions-Toleranz: „qualifizierenden“ ⇄ „qualifizierende“
    if (t.length >= 6) { add(t.slice(0, -1), false); add(t.slice(0, -2), false); }
    // Kompositum-Toleranz: „Syndesmoseband“ findet „Syndesmose“ (Wortanfang genügt)
    if (t.length >= 8) {
      const min = Math.max(6, Math.floor(t.length * 0.6));
      for (let L = t.length - 3; L >= min; L--) add(t.slice(0, L), false);
    }
    const aliasKey = Object.keys(ALIAS).find(k => t === k || (t.length >= 5 && t.startsWith(k)));
    if (aliasKey) ALIAS[aliasKey].forEach(x => add(norm(x), true));
    return Array.from(alts, ([s, strict]) => ({ s, strict }));
  }).filter(g => g.length);
}

function search(qRaw) {
  const qN = norm(qRaw), qCode = dotless(qN);
  // Ein einzelnes Zeichen: als Anfangsbuchstabe filtern („E“ → alles, was mit E beginnt).
  // Gleichnamige Blöcke desselben Kapitels nur einmal listen.
  if (/^[a-z0-9]$/.test(qN)) {
    const seen = new Set();
    return INDEX
      .filter(item => {
        if (!item.titleN.startsWith(qN)) return false;
        const key = item.type + '|' + (item.cat || '') + '|' + item.titleN;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(item => ({ item, score: item.type === 'lex' ? 10 : 0 }))
      .sort((a, b) => b.score - a.score || a.item.titleN.localeCompare(b.item.titleN, 'de'))
      .slice(0, 30);
  }
  const groups = tokenGroups(qRaw);
  if (!groups.length) return [];
  const collect = loose => {
    const hits = [];
    for (const item of INDEX) {
      let ok = true, score = 0;
      for (const alts of groups) {
        let matched = 0;
        for (const a of alts) {
          const t = a.s, fits = a.strict ? hasTok : hasTokStart;
          if (item.codes.has(t)) { matched = Math.max(matched, 40); break; }
          if (fits(item.titleN, t, loose)) { matched = Math.max(matched, 25); }
          else if (fits(item.hay, t, loose)) { matched = Math.max(matched, 8); }
          else if (/^[a-z]\d/.test(t)) {
            // „E78.2“ ⊂ Bereich E78.0–E78.5 · „E03.2“ → Familie E03 (Code ohne Punkt = Familie)
            for (const c of item.codes) if (c.startsWith(t) || (!c.includes('.') && c.length >= 3 && t.startsWith(c))) { matched = Math.max(matched, 20); break; }
          }
          else if (/^\d{2,}$/.test(t)) {
            // GOP-Präfix beim Tippen, auch ohne führende Null: „322“ → 03220 …
            for (const c of item.codes) if (c.startsWith(t)) { matched = Math.max(matched, 20); break; }
          }
        }
        if (!matched) { ok = false; break; }
        score += matched;
      }
      if (!ok) continue;
      if (item.titleN === qN || item.codes.has(qCode) || item.codes.has(qN)) score += 100;
      if (item.titleN.startsWith(qN)) score += 45;
      if (item.type === 'lex') score += 6;
      hits.push({ item, score });
    }
    return hits;
  };
  let hits = collect(false);
  if (!hits.length) hits = collect(true);
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 30);
}

function hl(text, qRaw) {
  let out = esc(String(text));
  if (!qRaw) return out;
  const words = qRaw.trim().split(/[\s,;]+/).filter(w => w.length >= 2);
  if (!words.length) return out;
  // Nur an Wortgrenzen markieren — „se“ soll nicht mitten in „Kassenärztliche“
  // aufleuchten. Wortende mit 2 Restzeichen ab 5 Zeichen, wie die Suche selbst.
  // Capture-Gruppe statt Lookbehind: Lookbehind kann Safari erst ab iOS 16.4.
  const L = 'A-Za-z0-9ÄÖÜäöüß';
  const escd = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const tails = words.filter(w => w.length >= 5).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = `(^|[^${L}])(${escd.join('|')})` +
    (tails.length ? `|(${tails.join('|')})(?=[${L}]{0,2}(?:[^${L}]|$))` : '');
  try {
    out = out.replace(new RegExp(re, 'gi'), (m, pre, ws, tw) =>
      ws !== undefined ? pre + '<mark>' + ws + '</mark>' : '<mark>' + tw + '</mark>');
  } catch (e) { /* noop */ }
  return out;
}

const SEARCH_SHORTCUTS = [
  { label: 'Die 4 qualifizierenden Diagnosen', hash: '#/start', sel: '.dx-card' },
  { label: 'Entscheidungsbaum', hash: '#/abrechnung/ab-baum' },
  { label: 'Die 10 Kriterien', hash: '#/abrechnung/ab-kriterien' },
  { label: 'Impfstoff-Übersicht', hash: '#/ssb/impf-tabelle' },
  { label: 'GOP-Werte in €', hash: '#/lexikon/gops' },
  { label: 'ICD-10-Codes', hash: '#/lexikon/icd' },
];
function shortcutChips() {
  return `<div class="shortcut-wrap">` +
    SEARCH_SHORTCUTS.map((s, i) => `<a class="chip chip-link" href="${s.hash}" data-shortcut="${i}">${esc(s.label)}</a>`).join('') + `</div>`;
}

let lastSearchQuery = '';
let pushedSearch = false;
let searchEnteredByUser = false;

function showSuche() {
  $('#q-cancel').hidden = false;
  // Nur bei Rückkehr per History (Zurück-Geste aus einem Treffer) die letzte
  // Anfrage wiederherstellen — beim aktiven Antippen des Felds leer starten.
  if (!searchEnteredByUser && !$('#q').value && lastSearchQuery) $('#q').value = lastSearchQuery;
  searchEnteredByUser = false;
  renderSearch();
}
function leaveSuche() {
  $('#q-cancel').hidden = true;
  pushedSearch = false;
  if ($('#q').value) { lastSearchQuery = $('#q').value; $('#q').value = ''; }
}

function renderSearch() {
  const q = $('#q').value.trim();
  const host = $('#search-results');
  if (q.length < 1) {
    host.innerHTML = `<div class="view-head"><h1>Suche</h1><p>Tippe einen ICD-Code (E06.3), eine GOP (03100), eine Abkürzung oder ein Stichwort — auch „Blutdruck“ oder „Gicht“ funktionieren.</p></div>
      <p class="home-label">Direkt hinspringen</p>` + shortcutChips();
    return;
  }
  const hits = search(q);
  if (!hits.length) {
    host.innerHTML = `<div class="empty" role="status"><b>Keine Treffer für „${esc(q)}“.</b><br>
      Versuch es mit einem ICD-Code (z.&nbsp;B. <span class="code">E06.3</span>), einer GOP (<span class="code">03100</span>) oder einem anderen Stichwort.</div>
      <p class="home-label">Oder direkt hinspringen</p>` + shortcutChips();
    return;
  }
  host.innerHTML = `<p class="home-label" role="status">${hits.length === 30 ? '30+' : hits.length} Treffer</p><div class="result-list">` +
    hits.map((h, i) => {
      const it = h.item;
      const ctx = it.context ? ` <span class="result-ctx">· ${esc(it.context)}</span>` : '';
      return `<button class="result-row" data-hit="${i}">
        <span class="result-cat cat-${it.type === 'lex' ? esc(it.cat) : esc(it.type)}">${esc(catLabel(it))}</span>
        <span class="result-txt"><b>${hl(it.title, q)}${ctx}</b><small>${hl(it.sub, q)}</small></span>
      </button>`;
    }).join('') + `</div>`;
  $$('#search-results .result-row').forEach(btn =>
    btn.addEventListener('click', () => hits[+btn.dataset.hit].item.go()));
}

/* ============================== Events & Start ============================== */
function initEvents() {
  window.addEventListener('hashchange', route);

  const q = $('#q');
  const toSearch = () => {
    if (parseHash().view !== 'suche') {
      searchReturnHash = location.hash || '#/start';
      pushedSearch = true;
      searchEnteredByUser = true;
      location.hash = '#/suche';
    }
  };
  // Bewusst kein focus-Listener (WCAG 3.2.1): Tab-Fokus allein wechselt keine Ansicht.
  q.addEventListener('click', toSearch);
  q.addEventListener('input', () => { toSearch(); renderSearch(); });
  q.addEventListener('keydown', e => {
    if (e.key === 'Enter') { toSearch(); q.blur(); }
    if (e.key === 'Escape') $('#q-cancel').click();
  });
  $('#q-cancel').addEventListener('click', () => {
    q.value = '';
    lastSearchQuery = '';
    // Kein zusätzlicher History-Eintrag: die Zurück-Geste soll die Suche nicht erneut zeigen
    if (pushedSearch) history.back();
    else location.hash = (searchReturnHash && searchReturnHash !== '#/suche') ? searchReturnHash : '#/start';
  });

  // Such-Shortcuts mit Ankerziel (z. B. Diagnosen-Karte auf der Startseite)
  $('#search-results').addEventListener('click', e => {
    const a = e.target.closest('[data-shortcut]');
    if (!a) return;
    const s = SEARCH_SHORTCUTS[+a.dataset.shortcut];
    if (s && s.sel) { e.preventDefault(); jumpToAnchor(s.hash, s.sel); }
  });

  $('#lex-q').addEventListener('input', renderLex);
  $('#lex-chips').addEventListener('click', e => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    lexCat = chip.dataset.cat;
    sessionStorage.setItem('lexQuery', $('#lex-q').value);
    const base = lexCat === 'alle' ? '#/lexikon' : '#/lexikon/' + lexCat;
    // replace statt push: Kategorie-Wechsel soll die Zurück-Geste nicht aufblähen
    if (location.hash !== base) location.replace(base);
    else { sessionStorage.removeItem('lexQuery'); syncLexChips(); renderLex(); }
  });

  // Installierte App braucht keine Installationsanleitung
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (standalone) $('#install-card').hidden = true;
}

document.addEventListener('DOMContentLoaded', () => {
  initLex();
  initSsb();
  renderAbrechnungToc();
  buildIndex();
  initEvents();
  if (!location.hash) location.replace('#/start');
  route();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
    // Neue Version übernimmt die Kontrolle → einmal neu laden, damit
    // Inhalte sofort ankommen (iOS hält PWAs sonst tagelang im Speicher).
    let hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController) location.reload();
      hadController = true;
    });
  }
});
