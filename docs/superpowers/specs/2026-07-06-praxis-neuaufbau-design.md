# Praxis-App Neuaufbau — Design (2026-07-06)

## Anlass

Nutzerfeedback zur bestehenden PWA: (1) sehr unübersichtlich, (2) kein Weg zurück zur
Startseite, (3) Begriffe — konkret die 4 qualifizierenden Diagnosen der
Versorgungspauschale — nicht schnell auffindbar. Die MFA nutzen stattdessen das PDF
„vorhalte-versorgungspauschale-2026.pdf".

Audit-Root-Causes (3 parallele Auditoren, bestätigt mit Datei:Zeile):

1. **Lexikon-Filter sucht nur im aktiven Untertab** (Default „Abkürzungen") →
   „Gicht"/„E06.3" liefern „Kein Treffer", obwohl alles im ICD-Tab steht. (kritisch)
2. **Kein Routing/History** → iOS-Zurück-Geste verlässt die App; Such-Overlay (z-500)
   verdeckt die Tab-Bar; Header nicht klickbar. (kritisch)
3. **23 zugeklappte Akkordeons ohne Inhaltsverzeichnis**; die 4 Diagnosen vergraben
   mitten in Akkordeon 2/13; Safari-Seitensuche blind (display:none). (hoch)
4. **Substring-Suche ohne Normalisierung**: „E78.2"/„M10.4" (Bereichs-Keys), Mehrwort-
   Anfragen, Flexionen („qualifizierende" vs. „qualifizierenden") scheitern; Ranking
   stellt exakte Treffer ans Ende; iOS-Tastatur öffnet nicht (focus im setTimeout). (hoch)
5. Hängende Zustände (persistenter Lexikon-Filter), SW ohne Netz-Timeout. (mittel)

**Inhalte sind vollständig und korrekt** (alle Werte gegen PDF geprüft) — das Problem
ist ausschließlich die Hülle. Konsequenz: Inhalte werden unverändert übernommen
(kein Abtippen medizinischer Daten = kein Fehlerrisiko), die Hülle wird neu gebaut.

## Leitidee

Die Nutzer vertrauen dem PDF, weil es ruhig, linear und scanbar ist. Die neue App
übernimmt dessen Dokument-Logik — Kapitel statt Akkordeons, Inhaltsverzeichnis pro
Modul, alles ausgeklappt — und ergänzt, was ein PDF nicht kann: eine allgegenwärtige,
fehlertolerante Sofort-Suche und Schnellzugriff auf die 4 Diagnosen ab Startseite.

## Informationsarchitektur

- **Hash-Routing** (`#/start`, `#/abrechnung`, `#/abrechnung/ab-baum`, `#/ssb/<id>`,
  `#/lexikon`, `#/suche?q=`) mit echter History → Zurück-Geste/-Taste funktioniert,
  jede Stelle ist verlinkbar, Scroll-Restore pro Route.
- **Header (sticky, überall)**: Home-Button (Praxis-Marke) + **permanentes Suchfeld**.
  Echtes `<input>` immer sichtbar → iOS öffnet die Tastatur nativ beim Antippen,
  kein JS-focus-Hack. Tippen navigiert zu `#/suche` mit Live-Ergebnissen.
- **Unterseiten-Leiste**: `‹ Zurück` + Kapiteltitel auf jeder Kapitelseite.
- **Tab-Bar unten (fix)**: Start · Abrechnung · SSB & Impfen · Lexikon.
- **Module = Inhaltsverzeichnis-Seiten** (wie PDF-Inhalt): Abrechnung gruppiert in
  „Übersicht" (4 Kapitel) / „Acht Praxisfälle" / „Anhang"; SSB & Impfen listet die
  10 Kapitel. Tap → **Kapitelseite**, Inhalt komplett ausgeklappt.
- **Startseite**: Suchfeld-Fokusfläche, Karte „Die 4 qualifizierenden Diagnosen"
  (komplett lesbar, ohne einen einzigen weiteren Tap), Schnellzugriffe
  (Entscheidungsbaum, 10 Kriterien, Merkzahlen, Fälle, Impfstoffe, GOPs), die
  3 Merkzahlen 2026. Install-Karte nur im Browser (nicht standalone). Keine
  hartkodierte Anrede.
- **Lexikon**: EIN Filterfeld über **alle vier** Kategorien gleichzeitig, Ergebnisse
  gruppiert; Kategorie-Chips (Alle · Abkürzungen · GOP · ICD-10 · Begriffe) nur als
  Eingrenzung. Navigation setzt Filterzustand zurück.

## Suche

- Tokenisierte UND-Suche mit Normalisierung: lowercase, Umlaut-Faltung (ö→oe/o),
  Code-Normalisierung („e063" ↔ „E06.3"), Präfix-Toleranz pro Token
  („qualifizierende…" matcht „qualifizierenden").
- **Synonyme**: Blutdruck→Hypertonie, Fettstoffwechsel/Cholesterin→Lipoprotein/E78,
  Schilddrüse→Hypothyreose/TSH/E03, Zucker→Diabetes, Impfung→Schutzimpfung u. a.
- **Bereichs-Expansion**: „E78.0–E78.5", „M10.00–M10.99" indexieren jeden Einzelcode.
- Feingranularer Index: Lexikoneinträge einzeln; Abrechnung pro Block (Alert,
  Tabelle, Steps) mit Kapitel-Anker; SSB pro Zwischenüberschrift/Tabelle.
- Ranking: exakter Code > Titel-Präfix > Titel enthält > Text; kein festes
  Modul-Ordering. Treffer-Tap → Kapitelseite, Block angescrollt (scroll-margin-top)
  und hervorgehoben.

## Visuelle Richtung

„Klinisch ruhig" — die Dokument-Anmutung des PDFs als App: Papierweiß (#F7F6F3),
Karten weiß, Tinte fast schwarz, **ein** Akzent Petrol/Teal (#0F766E, Klar-Marke);
Ampelfarben nur funktional (ok/warn/kritisch wie im PDF). Systemschrift (SF Pro),
kräftige Titel, Eyebrow-Labels wie im PDF („TEIL 1 · ÜBERSICHT"). **Signatur:
GOP-/ICD-/SNR-Codes als Mono-Chips** — tappbar, führen zum Lexikoneintrag. Dark Mode
via prefers-color-scheme. Reduzierte Motion respektiert.

## Technik

- Weiterhin reine statische PWA ohne Build (GitHub Pages). Dateien: index.html
  (Shell + SSB-Kapitel unverändert übernommen), styles.css (neu), app.js (neu:
  Router, Renderer, Suche), data/ unverändert + `data/suche-aliase.js` (Synonyme),
  sw.js (v5: Netz-Timeout 3,5 s → Cache-Fallback, HTTP-Status-Check, Reload-Hinweis).
- Aufräumen: `__tmp_ab.html`, `__tmp_lex.html` entfernen; README aktualisieren.

## Nicht-Ziele

Kein Framework, kein Server, keine inhaltliche Neuredaktion der Medizindaten,
kein Umbau der SSB-Inhalte ins Datenmodell (verbatim übernehmen).

## Erfolgskriterien

1. 4 Diagnosen: 0 Taps ab Start (auf der Startseite lesbar).
2. „Gicht", „E06.3", „E78.2", „Blutdruck", „qualifizierende Diagnosen" liefern
   überall relevante Treffer an Position 1–3.
3. Aus jeder Ansicht in ≤ 1 Tap zur Startseite (Home-Button/Tab), Zurück-Geste bleibt
   in der App.
4. Kein Inhalt mehr hinter display:none auf Kapitelseiten (Safari-Suche findet alles).
