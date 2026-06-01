# Design-Spezifikation: „Praxis" — MFA-Nachschlage-App (PWA)

**Datum:** 2026-06-01
**Auftraggeber:** Markus Schubert (für Petra, MFA in hausärztlicher Praxis, Bayern/KVB)
**Ziel:** Eine schöne, durchgängige iOS-Style Web-App, die die vorhandenen Workshop-/Praxis-Unterlagen
vereint, auf GitHub Pages veröffentlicht wird (eigene Internetadresse), per QR-Code abrufbar ist und
sich mit eigenem Icon auf den iPhone-Home-Bildschirm legen lässt.

## 1. Zweck & Erfolgskriterien

Petra soll im Praxisalltag in Sekunden nachschlagen können, was sie braucht — auf dem iPhone, offline,
ohne Browser-Leiste, mit Suche über alle Themen.

Erfolg = (1) App online unter `https://alpinwelten.github.io/<repo>/`, (2) QR-Code führt direkt dorthin,
(3) auf iPhone als „Praxis"-Icon installierbar, (4) alle drei Inhaltsbereiche + Original-PDFs enthalten,
(5) Inhalte fachlich exakt aus den Quell-PDFs übernommen, (6) automatischer Dark Mode, schnell & offline.

## 2. Inhalt (Quellen → Module)

| Modul | Quelle | Umfang |
|---|---|---|
| **SSB & Impfen** | bestehende iPhone-Schnellreferenz V1.7 (Bayern/KVB) | 10 Abschnitte (Aktualität, 7 SSB-Grundregeln, Muster 16a, Verordnungsfähigkeit, Regress-Fallen, Impf-Recht, Bezugsweg, Impfstoff-Übersicht, Hep-B-Ziffern, KVB-Kontakte) |
| **Abrechnung 2026** | `vorhalte-versorgungspauschale-2026.pdf` (17 S.) | 2 Pauschalen im Vergleich, Entscheidungsbaum (3 Szenarien), 10 Kriterien der Vorhaltepauschale, Merkhilfe/Kontrollfragen, 8 Fallbeispiele, Quellen |
| **Nachschlagen** | `abkuerzungsjournal-2026-revision-1.pdf` (9 S.) | ~55 Abkürzungen A–Z, ~34 GOPs mit €-Beträgen, ICD-10-Codes, Fachbegriffe |
| **Dokumente** | Original-PDFs (ohne Zertifikat) | Schnellreferenz-PDF, Abkürzungsjournal, Vorhalte-/Versorgungspauschale, Workshop-Deck |

**Ausgeschlossen:** `certificate.pdf` (persönliches Zertifikat mit Klarnamen) — bleibt aus der öffentlichen App.

## 3. Architektur

Reine **statische PWA** (HTML/CSS/JS, kein Server, keine Datenbank). Deploy auf GitHub Pages.

Komponenten (kleine, klar abgegrenzte Einheiten):

- `index.html` — App-Shell: Header, Tab-Leiste, Such-Overlay, Container für Views.
- `styles.css` — Designsystem (aus der bestehenden Referenz übernommen + erweitert): iOS-Karten,
  Akkordeons, Alert-Boxen, Badges, Tabellen, Dark Mode, Safe-Area.
- `app.js` — Navigation (Tab-Wechsel), Akkordeon-Logik, **globale Suche** (Index über alle Module),
  Rendering der datengetriebenen Module, PWA-Install-Hinweis.
- `data/abrechnung.js` — strukturierte Daten Modul „Abrechnung 2026" (als JS-Global, offline-robust).
- `data/nachschlagen.js` — strukturierte Daten Modul „Nachschlagen".
- `data/ssb.js` — Inhalt SSB & Impfen (aus bestehender HTML übernommen) + Suchindex.
- `manifest.webmanifest` — PWA-Manifest (Name „Praxis", Icons, Theme-Color, standalone).
- `sw.js` — Service Worker: Cache-First für App-Shell & Daten → **offline** lauffähig.
- `icons/` — App-Icons (180/192/512 + maskable), Apple-Touch-Icon: **weißes Kreuz auf blauem Verlauf**.
- `pdfs/` — Original-Dokumente (ohne Zertifikat).

**Datenfluss:** Beim Laden registriert `app.js` den Service Worker, baut aus den `data/*`-Globals einen
Suchindex und rendert die aktive View. Tab-Klick wechselt die View ohne Reload (SPA-artig). Suche
filtert/öffnet passende Abschnitte und springt hin (mit Treffer-Highlight).

## 4. Look & Verhalten

- Apple-Designsprache wie in der bestehenden Referenz: weiße Karten, 16px-Radius, KVB-/iOS-Blau (#007AFF),
  Akkordeons, farbige Hinweis-Boxen (rot=Regress/Achtung, orange=Warnung, grün=ok, blau=Info), Status-Badges.
- **Untere Tab-Leiste** (iOS): Start · SSB & Impfen · Abrechnung · Nachschlagen · Dokumente.
- **Sticky-Suchfeld** auf der Startseite, durchsucht alle Module.
- **Automatischer Dark Mode** (`prefers-color-scheme`).
- Touch-optimiert (große Tap-Ziele, kein Tap-Highlight), Safe-Area für Notch/Home-Indicator.
- Offline lauffähig nach erstem Laden.

## 5. Veröffentlichung & Zustellung

1. Lokaler Aufbau in `/Users/markusschubert/praxis` (nicht im iCloud-Pfad → keine Sync-Konflikte).
2. GitHub-Repo unter Account `alpinwelten`, GitHub Pages aus `main`/root → URL `https://alpinwelten.github.io/<repo>/`.
3. **QR-Code** (PNG/SVG) auf die Live-URL, als Datei zur Weitergabe (z. B. ausdrucken/teilen).
4. Anleitung „Zum Home-Bildschirm hinzufügen" (Safari → Teilen → Zum Home-Bildschirm) → Icon „Praxis".

## 6. Datenschutz (DSGVO)

Inhalte sind Fachreferenz (KVB-Regeln, Tabellen, **erfundene** Fallbeispiele) — kein echter Patientenbezug.
Persönliches Zertifikat ausgeschlossen. Damit ist die öffentliche Veröffentlichung unbedenklich.
Hinweis im Footer: Quellen/Stände, „ohne Gewähr", Bezug auf KVB/EBM 2026.

## 7. Qualitätssicherung

Nach dem Bau: Multi-Agent-Review (adversarisch) über die Dimensionen
**Inhaltstreue vs. PDF · Code/PWA-Korrektheit · Barrierefreiheit · Designkonsistenz · Datenschutz · Deployment**.
Befunde werden korrigiert. Abschließend Live-URL geladen und PWA-Installierbarkeit geprüft.

## 8. Bewusst NICHT enthalten (YAGNI)

Kein Login/Benutzerkonto, keine Server-Logik, keine Analytics/Tracking, kein Backend, keine
Mehrsprachigkeit, kein CMS. Inhalte sind statisch und werden bei Bedarf im Code aktualisiert.
