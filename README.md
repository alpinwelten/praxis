# Praxis – MFA-Nachschlagewerk

Eine schlanke Web-App (PWA) zum schnellen Nachschlagen im Praxisalltag einer
Medizinischen Fachangestellten (Bayern / KVB). Läuft im Browser, lässt sich auf
den iPhone-Home-Bildschirm legen und funktioniert offline.

**Live:** https://alpinwelten.github.io/praxis/

## Aufbau (Shell v2, Juli 2026)

Die App ist wie ein Dokument organisiert — Kapitel statt Akkordeons:

- **Startseite** mit der Karte „Die 4 qualifizierenden Diagnosen" (E03.x/E06.3,
  E78.x, I10.00/I10.90, M10.x), Schnellzugriffen und den 3 Merkzahlen 2026.
- **Permanente Suche im Header** — auf jeder Seite. Fehlertolerant: findet
  ICD-Codes mit und ohne Punkt („E063"), Einzelcodes aus Bereichen („E78.2"),
  Mehrwort-Anfragen und Synonyme („Blutdruck" → Hypertonie).
- **Abrechnung 2026** – Vorhalte- & Versorgungspauschale: Überblick,
  Entscheidungsbaum, die 10 Kriterien, Merkhilfe und 8 Fallbeispiele — jedes
  Kapitel als eigene Seite mit Blätter-Navigation.
- **SSB & Impfen** – Sprechstundenbedarf, Verordnungsfähigkeit, Impfstoffe,
  Bezugswege, Regress-Fallen, KVB-Kontakte (Schnellreferenz V1.7), 10 Kapitel.
- **Lexikon** – Abkürzungen, GOPs mit Eurowerten, ICD-10-Codes, Fachbegriffe.
  Ein Filterfeld durchsucht alle vier Kategorien gleichzeitig.
- **Hash-Routing mit History** – die Zurück-Geste/-Taste bleibt in der App,
  jede Ansicht ist verlinkbar, der Home-Button oben links führt immer zum Start.

## Auf dem iPhone installieren

1. Adresse oben in **Safari** öffnen.
2. **Teilen-Symbol** antippen → **„Zum Home-Bildschirm"** → *Hinzufügen*.
3. Die App „Praxis" startet danach im Vollbild mit eigenem Icon.

## Technik

Reine statische Seite (HTML/CSS/JS), keine Server, keine Datenbank, kein Tracking.
Veröffentlicht über GitHub Pages. Offline-Betrieb über einen Service Worker
(network-first mit 3,5-s-Timeout, danach Cache).

## Inhalte aktualisieren

- Abrechnung 2026: `data/abrechnung.js` (Karten mit Block-Typen, siehe Kopfkommentar)
- Lexikon: `data/nachschlagen.js`
- Such-Synonyme: `data/suche-aliase.js`
- SSB & Impfen: die `.section`-Blöcke in `index.html`
- Nach jeder Änderung in `sw.js` die `VERSION` hochzählen (z. B. `praxis-v6`),
  damit Geräte die neue Fassung laden.

## Hinweis

Alle Angaben ohne Gewähr. Quellen: KVB, KBV, EBM 2026, STIKO/G-BA, GKV-Spitzenverband
(Stand April/Mai 2026). Bei Unklarheiten die zuständige Kassenärztliche Vereinigung kontaktieren.
Enthält keine personenbezogenen Patientendaten; Fallbeispiele sind erfunden.
