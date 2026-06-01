# Praxis – MFA-Nachschlagewerk

Eine schlanke Web-App (PWA) zum schnellen Nachschlagen im Praxisalltag einer
Medizinischen Fachangestellten (Bayern / KVB). Läuft im Browser, lässt sich auf
den iPhone-Home-Bildschirm legen und funktioniert offline.

**Live:** https://alpinwelten.github.io/praxis/

## Inhalt

- **SSB & Impfen** – Sprechstundenbedarf, Verordnungsfähigkeit, Impfstoffe, Bezugswege, Regress-Fallen, KVB-Kontakte (Schnellreferenz V1.7).
- **Abrechnung 2026** – Vorhalte- & Versorgungspauschale: Überblick, Entscheidungsbaum, die 10 Kriterien, Merkhilfe und 8 Fallbeispiele.
- **Nachschlagen** – Abkürzungen A–Z, GOPs mit Eurowerten, ICD-10-Codes, Fachbegriffe.
- **Globale Suche** über alle Bereiche, eigene Icon-Sprache, automatischer Dark Mode.

## Auf dem iPhone installieren

1. Adresse oben in **Safari** öffnen.
2. **Teilen-Symbol** antippen → **„Zum Home-Bildschirm"** → *Hinzufügen*.
3. Die App „Praxis" startet danach im Vollbild mit eigenem Icon.

## Technik

Reine statische Seite (HTML/CSS/JS), keine Server, keine Datenbank, kein Tracking.
Veröffentlicht über GitHub Pages. Offline-Betrieb über einen Service Worker.

## Inhalte aktualisieren

Inhalte liegen in `data/abrechnung.js` und `data/nachschlagen.js`; die SSB-&-Impfen-Abschnitte
direkt in `index.html`. Nach einer Änderung in `sw.js` die `VERSION` hochzählen (z. B. `praxis-v2`),
damit Geräte die neue Fassung laden.

## Hinweis

Alle Angaben ohne Gewähr. Quellen: KVB, KBV, EBM 2026, STIKO/G-BA, GKV-Spitzenverband
(Stand April/Mai 2026). Bei Unklarheiten die zuständige Kassenärztliche Vereinigung kontaktieren.
Enthält keine personenbezogenen Patientendaten; Fallbeispiele sind erfunden.
