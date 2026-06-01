/* Modul „Abrechnung 2026" – Vorhalte- und Versorgungspauschale
   Quelle: Praxishilfe MFA „Vorhalte- und Versorgungspauschale 2026" (Stand April 2026)
   Jede Karte wird als aufklappbarer Abschnitt gerendert (siehe app.js renderBlocks).
   Block-Typen: p | h3 | alert | table | checks | steps | kpi | casemeta | cards | note */
window.ABRECHNUNG = [
  {
    id: "ab-ueberblick", icon: "⚖️", title: "Die beiden Pauschalen im Überblick",
    blocks: [
      { t: "p", html: "Beide Pauschalen gehen auf das <strong>GVSG</strong> zurück, adressieren aber unterschiedliche Probleme: Struktur der Praxis vs. Entlastung chronisch Kranker." },
      { t: "cards", items: [
        { title: "Vorhaltepauschale · ab 01.01.2026", color: "#007AFF", html:
          "Pauschale für die <strong>Praxis-Struktur</strong>. Pro Behandlungsfall, wenn im Quartal <strong>keine fachärztlichen Leistungen</strong> erbracht wurden.<br><br>" +
          "GOP <strong>03040</strong>: 128 Pkt · 15,86 €<br>+ 03041: +10 Pkt · +1,24 €<br>+ 03042: +30 Pkt · +3,72 €<br>" +
          "<strong>Maximum 158 Pkt · ca. 19,58 €</strong><br>pro Behandlungsfall · ohne Budget · einmal pro Quartal." },
        { title: "Versorgungspauschale · ab 01.07.2026", color: "#34C759", html:
          "Pauschale für <strong>einfache Chroniker</strong>. Deckt 2 Quartale ab — der Patient muss nicht jedes Quartal wegen reiner Folgerezepte kommen. <strong>Pflicht-GOP</strong>, nicht optional.<br><br>" +
          "GOP <strong>03100</strong> · AK 1 (18–54 J.): 45,36 € / Halbjahr<br>GOP <strong>03100</strong> · AK 2 (55–74 J.): 51,34 € / Halbjahr<br>" +
          "Zusätzlich Vorhaltepauschale 03043: 179 Pkt · 22,81 € (+ Zuschläge 03044 / 03045)." }
      ]},
      { t: "alert", level: "warn", title: "Abschlag bei Impflücke", html: "Minus <strong>40 %</strong> auf GOP 03040, wenn die Praxis im Quartal <strong>weniger als 10 Schutzimpfungen</strong> abgerechnet hat." },
      { t: "alert", level: "info", title: "Die Versorgungspauschale ersetzt", html: "Statt Versichertenpauschale (03000) <em>und</em> Chronikerpauschale (03220): die Versorgungspauschale ersetzt diese beiden." }
    ]
  },
  {
    id: "ab-baum", icon: "🌳", title: "Entscheidungsbaum: Welche Pauschale?",
    blocks: [
      { t: "p", html: "Drei typische Szenarien mit Schritt-für-Schritt-Anleitung für die korrekte GOP-Auswahl." },
      { t: "h3", html: "Szenario A · Standard-Patient" },
      { t: "p", html: "<span class='dx'>Patient kommt wegen akuter Beschwerden, keine chronische Dauerdiagnose.</span>" },
      { t: "steps", items: [
        "Versichertenpauschale <strong>GOP 03000</strong> abrechnen.",
        "KV setzt automatisch die Vorhaltepauschale <strong>GOP 03040</strong> zu — sofern keine fachärztlichen Leistungen im Quartal.",
        "Zuschlag <strong>03041</strong> oder <strong>03042</strong> wird automatisch durch die KV ergänzt, je nach Kriterienerfüllung der Praxis."
      ]},
      { t: "alert", level: "info", title: "Wichtig für dich als MFA", html: "Du trägst nichts manuell zur Vorhaltepauschale ein. Die KV prüft die Kriterien automatisch. Deine Aufgabe: darauf achten, dass die 10 Kriterien-Leistungen korrekt und vollständig dokumentiert und abgerechnet werden." },
      { t: "h3", html: "Szenario B · Einfacher Chroniker" },
      { t: "p", html: "<span class='dx'>Patient 18–74 J., seit ≥ 4 Quartalen genau eine der 4 definierten Diagnosen, nimmt nur ein Rezept-Medikament.</span>" },
      { t: "steps", items: [
        "Vorgeschichte prüfen: in den letzten 4 Quartalen mind. 3 Kontakte, davon mind. 2 persönlich (einer kann Video sein).",
        "Versorgungspauschale <strong>GOP 03100</strong> abrechnen — deckt 2 Quartale ab.",
        "<strong>NICHT</strong> gleichzeitig abrechnen: GOP 03000, 03220, 03222.",
        "KV setzt Halbjahres-Vorhaltepauschale <strong>GOP 03043</strong> plus Zuschläge automatisch zu.",
        "Folgequartal-Kontakt wegen Chroniker-Diagnose: Zuschlag <strong>GOP 03110</strong> (19,37 € bzw. 22,04 €) — aber max. 8 % der Fälle."
      ]},
      { t: "alert", level: "ok", title: "Die 4 qualifizierenden Diagnosen", html:
        "<strong>E03.x / E06.3</strong> — Hypothyreose, Autoimmunthyreoiditis<br>" +
        "<strong>E78.x</strong> — Fettstoffwechselstörungen<br>" +
        "<strong>I10.00 / I10.90</strong> — essentielle Hypertonie, ohne hypertensive Krise<br>" +
        "<strong>M10.x</strong> — idiopathische Gicht" },
      { t: "h3", html: "Szenario C · Komplexer Chroniker" },
      { t: "p", html: "<span class='dx'>Patient hat mehrere chronische Diagnosen (z. B. Hypothyreose + Diabetes).</span>" },
      { t: "steps", items: [
        "Versorgungspauschale 03100 <strong>nicht möglich</strong> — Ausschlusskriterium.",
        "Normale Versichertenpauschale <strong>GOP 03000</strong> abrechnen.",
        "Chronikerzuschlag <strong>GOP 03220/03221</strong> zusätzlich, sofern Voraussetzungen erfüllt.",
        "Vorhaltepauschale <strong>03040</strong> wird von der KV automatisch zugesetzt."
      ]},
      { t: "alert", level: "info", title: "Merksatz", html: "Die Versorgungspauschale gilt nur für den „einfachen“ Chroniker — eine Diagnose aus der Liste, ein Medikament, keine intensive Betreuung. Alles andere läuft weiter wie bisher." }
    ]
  },
  {
    id: "ab-kriterien", icon: "✅", title: "Die 10 Kriterien der Vorhaltepauschale",
    blocks: [
      { t: "p", html: "Die Kriterien 1–8 werden <strong>automatisch</strong> aus den Abrechnungsdaten geprüft. Kriterien 9 und 10 müssen mit der Pseudoziffer <strong>99305</strong> (Qualitätszirkel) bzw. <strong>99306</strong> (erweiterte Sprechzeiten) am letzten Tag des Quartals bei einem beliebigen GKV-Patienten gekennzeichnet werden." },
      { t: "table", align: ["l","l","r"], head: ["#", "Kriterium", "Anteil*"], rows: [
        ["1", "Haus- und Pflegeheimbesuche", "≥ 5 %"],
        ["2", "Geriatrische oder palliativmedizinische Versorgung", "≥ 12 %"],
        ["3", "Kooperation mit Pflegeheimen", "≥ 1 %"],
        ["4", "Schutzimpfungen", "≥ 7 % / Q4: 25 %"],
        ["5", "Kleinchirurgie / Wundversorgung / postoperative Behandlung", "≥ 3 %"],
        ["6", "Ultraschall (Abdomen und/oder Schilddrüse)", "≥ 2 %"],
        ["7", "Basisdiagnostik (Langzeit-RR, EKG, Belastungs-EKG, Spirographie)", "≥ 3 %"],
        ["8", "Videosprechstunden", "anteilig"],
        ["9", "Teilnahme an Qualitätszirkeln (2×/Jahr) oder BAG/MVZ · <strong>SNR 99305</strong>", "strukturell"],
        ["10", "Erweiterte Sprechzeiten (≥ 60 Min/14 Tage, Randzeiten) · <strong>SNR 99306</strong>", "strukturell"]
      ]},
      { t: "note", html: "* bezogen auf alle kollektivvertraglichen Behandlungsfälle gemäß Nr. 10 Präambel 3.1 EBM. Selektivvertragliche Fälle (HZV) zählen nicht mit." }
    ]
  },
  {
    id: "ab-merkhilfe", icon: "📌", title: "Merkhilfe & 3 Kontrollfragen",
    blocks: [
      { t: "cards", items: [
        { title: "Vorhaltepauschale merken", color: "#007AFF", html: "Geht an die <strong>Praxis</strong>. Kommt automatisch. Deine Rolle: vollständig dokumentieren, SNR 99305/99306 am Quartalsende nicht vergessen." },
        { title: "Versorgungspauschale merken", color: "#34C759", html: "Geht an den <strong>Patienten</strong>. Musst du aktiv erkennen und ansetzen. 4 Diagnosen, 1 Medikament, Halbjahr — dann Pflicht." }
      ]},
      { t: "h3", html: "Drei Kontrollfragen vor jeder Quartalsabrechnung" },
      { t: "steps", items: [
        "Haben wir in diesem Quartal mindestens <strong>10 Impfungen</strong> abgerechnet? → sonst 40 % Abschlag auf 03040.",
        "Qualitätszirkel und erweiterte Sprechzeiten mit <strong>SNR 99305/99306</strong> am Quartalsende gesetzt?",
        "Ab Juli 2026: Habe ich die Einfach-Chroniker identifiziert und <strong>03100 statt 03000+03220</strong> angesetzt?"
      ]},
      { t: "h3", html: "Die drei wichtigsten Zahlen 2026" },
      { t: "kpi", items: [
        { num: "12,4 ¢", lab: "Punktwert 2026 (bundesweit)" },
        { num: "10 / Q", lab: "Impf-Minimum, sonst 40 % Abschlag", color: "red" },
        { num: "max. 8 %", lab: "03110-Deckel (Fälle mit 03100)" }
      ]}
    ]
  },

  // ===================== 8 FÄLLE =====================
  {
    id: "ab-fall1", icon: "①", title: "Fall 1 · Multimorbider Senior",
    blocks: [
      { t: "casemeta", who: "Herr W., 78 Jahre", dx: "Arteriosklerose · Herzinsuffizienz · COPD · Diabetes Typ 2 · 6 Medikamente", level: "komplex" },
      { t: "p", html: "Kommt 4× im Quartal wegen verschiedener Beschwerden. 1 Hausbesuch wegen Sturz. EKG und Langzeit-RR wegen Herzinsuffizienz. Grippeimpfung (Q4). Ausführliches Beratungsgespräch zur Medikamentenanpassung (15 min)." },
      { t: "checks", items: [
        { ok: false, html: "Versorgungspauschale 03100 möglich? → <strong>Nein</strong>, mehrere chronische Diagnosen" },
        { ok: true, html: "Versichertenpauschale 03000 (Altersklasse ≥ 75 J.)" },
        { ok: true, html: "Chronikerzuschlag 03220 + 03221 (2. Kontakt)" },
        { ok: true, html: "Vorhaltepauschale 03040 wird automatisch gesetzt" }
      ]},
      { t: "table", align: ["l","l","r","r"], head: ["Position","GOP","Punkte","€"], rows: [
        ["Versichertenpauschale AK 5 (≥ 75 J.)","03005","285","35,32 €"],
        ["Chronikerpauschale I","03220","130","16,10 €"],
        ["Chronikerpauschale II (2. Kontakt)","03221","40","4,96 €"],
        ["Hausbesuch","01410","181","22,43 €"],
        ["EKG","03321","127","15,74 €"],
        ["Langzeit-RR","03324","55","6,82 €"],
        ["Grippeimpfung","89111","70","8,68 €"],
        ["Hausärztliches Gespräch (15 min)","03230","128*","7,93 €"],
        ["Vorhaltepauschale (KV-gesetzt)","03040","128","15,86 €"],
        ["Zuschlag (8+ Kriterien, KV-gesetzt)","03042","30","3,72 €"],
        ["<strong>Summe Behandlungsfall</strong>","","<strong>~1.144</strong>","<strong>ca. 137,56 €</strong>"]
      ]},
      { t: "note", html: "* GOP 03230 bleibt auf 64 Punkte pro Fall budgetiert — der Rest wird nur anteilig vergütet." },
      { t: "alert", level: "ok", title: "Merke", html: "Dieser Fall ist ein Multiplikator für die Vorhaltepauschale — er füllt gleich drei der zehn Kriterien: Hausbesuch (Krit. 1), Basisdiagnostik EKG/LZ-RR (Krit. 7), Schutzimpfung (Krit. 4)." }
    ]
  },
  {
    id: "ab-fall2", icon: "②", title: "Fall 2 · Hashimoto-Patientin",
    blocks: [
      { t: "casemeta", who: "Frau M., 42 Jahre", dx: "Hashimoto-Thyreoiditis (E06.3) · L-Thyroxin 75 µg · sonst gesund", level: "einfach" },
      { t: "p", html: "<strong>Prototyp Versorgungspauschale.</strong> Kommt zur halbjährlichen Kontrolle mit aktuellem TSH-Wert vom Labor. 10-minütiges Gespräch, Rezept für L-Thyroxin. Seit 3 Jahren in Behandlung, in den letzten 4 Quartalen 3 Kontakte (2× persönlich, 1× Video)." },
      { t: "alert", level: "warn", title: "Pflicht-GOP", html: "Alle Kriterien erfüllt → 03100 <strong>muss</strong> angesetzt werden. Die alte Kombination 03000 + 03220 ist nicht mehr zulässig." },
      { t: "table", align: ["l","l","r","r"], head: ["Abrechnung ab 01.07.2026","GOP","Punkte","€"], rows: [
        ["Versorgungspauschale AK 1 (18–54 J.), deckt 2 Quartale","03100","~365","45,36 €"],
        ["Vorhaltepauschale Halbjahr (KV-gesetzt)","03043","179","22,81 €"],
        ["Zuschlag 8+ Kriterien (KV-gesetzt)","03045","42","5,21 €"],
        ["<strong>Summe für 2 Quartale</strong>","","<strong>~586</strong>","<strong>ca. 73,38 €</strong>"]
      ]},
      { t: "note", html: "Vergleich alte Welt (4× pro Jahr): 2× Versicherten- + 2× Chroniker- + 2× Vorhaltepauschale hätten über 2 Quartale ca. 110 € ergeben. Die Pauschale ist also finanziell ungünstiger — aber der Patient muss nicht jedes Quartal für ein Rezept kommen." },
      { t: "alert", level: "warn", title: "Folgequartal-Infekt", html: "Wenn Frau M. wegen eines Infekts kommt: keine neue Versichertenpauschale! Akutleistungen (z. B. GOP 03212 Beratung) sind separat berechenbar, aber 03000/03220 bleiben gesperrt." },
      { t: "checks", items: [
        { ok: true, html: "Alter 18–74 Jahre (hier 42)" },
        { ok: true, html: "Diagnose aus der Liste (E06.3)" },
        { ok: true, html: "Seit ≥ 4 Quartalen in Behandlung" },
        { ok: true, html: "Nur ein rezeptpflichtiges Medikament" },
        { ok: true, html: "≥ 3 Kontakte in 4 Quartalen, davon ≥ 2 persönlich" },
        { ok: true, html: "Keine weiteren chronischen Diagnosen" }
      ]}
    ]
  },
  {
    id: "ab-fall3", icon: "③", title: "Fall 3 · Hypertoniker mit Infekt-Quartal",
    blocks: [
      { t: "casemeta", who: "Herr L., 58 Jahre", dx: "Essentielle Hypertonie I10.90 · Ramipril 5 mg · keine weitere chronische Diagnose", level: "mittel" },
      { t: "p", html: "<strong>Q3/2026:</strong> Routinekontrolle, Rezept, Blutdruckmessung → Versorgungspauschale 03100 angesetzt. <strong>Q4/2026:</strong> Kommt wegen grippalem Infekt, Krankschreibung 3 Tage; zweiter Kontakt wegen Husten-Kontrolle." },
      { t: "table", align: ["l","l","r","r"], head: ["Abrechnung Q3/2026 (Ansatz 03100)","GOP","Punkte","€"], rows: [
        ["Versorgungspauschale AK 2 (55–74 J.)","03100","413","51,34 €"],
        ["Vorhaltepauschale + Zuschlag (KV)","03043 + 03045","221","28,02 €"],
        ["<strong>Summe Q3</strong>","","<strong>~634</strong>","<strong>ca. 79,36 €</strong>"]
      ]},
      { t: "table", align: ["l","l","r","r"], head: ["Abrechnung Q4/2026 (Infekt-Quartal)","GOP","Punkte","€"], rows: [
        ["Versichertenpauschale","03000","—","<span class='dx'>gesperrt</span>"],
        ["Chronikerpauschale","03220","—","<span class='dx'>gesperrt</span>"],
        ["Zuschlag bei intensiver Betreuung","03110","173","22,04 €"],
        ["AU-Bescheinigung","01630","21","2,60 €"],
        ["Hausärztliches Gespräch","03230","128*","7,93 €"],
        ["Zuschlag 03110 + Vorhaltepauschalen (KV)","03046/47/48","~95","ca. 12,86 €"],
        ["<strong>Summe Q4</strong>","","<strong>~417</strong>","<strong>ca. 45,43 €</strong>"]
      ]},
      { t: "note", html: "* GOP 03230 wieder auf 64 Punkte budgetiert." },
      { t: "alert", level: "critical", title: "Der 8-%-Deckel", html: "Die Praxis darf GOP 03110 nur bei maximal 8 % der Fälle abrechnen, in denen im Vorquartal 03100 angesetzt wurde. Bei 500 Versorgungspauschalen im Q3 = max. 40 Fälle mit 03110 im Q4. Ist das Kontingent voll, gibt es nur die Akutleistungen ohne Zuschlag." }
    ]
  },
  {
    id: "ab-fall4", icon: "④", title: "Fall 4 · Impf-Lücke – der teure Fehler",
    blocks: [
      { t: "casemeta", who: "Praxis Dr. X · Q2/2026", dx: "Einzelpraxis · 850 Behandlungsfälle · nur 6 Impfungen abgerechnet", level: "komplex" },
      { t: "p", html: "Der Arzt ist impfskeptisch und verweist Patienten für Impfungen an die Nachbarpraxis. Ansonsten erfüllt die Praxis 5 der 10 Kriterien (Hausbesuche, Basisdiagnostik, Ultraschall, Videosprechstunde, Qualitätszirkel)." },
      { t: "table", align: ["l","l","r","r"], head: ["Rechnung pro Behandlungsfall","GOP","Punkte","€"], rows: [
        ["Vorhaltepauschale Basis","03040","128","15,86 €"],
        ["40 % Abschlag (Impflücke)","—","−51","<span class='amount-neg'>−6,34 €</span>"],
        ["Zwischensumme 03040","—","77","9,52 €"],
        ["Zuschlag 5 Kriterien","03041","10","1,24 €"],
        ["<strong>Effektiv pro Fall</strong>","—","<strong>87</strong>","<strong>10,76 €</strong>"]
      ]},
      { t: "kpi", items: [
        { num: "−5.389 €", lab: "Quartals-Verlust (850 × 6,34 €)", color: "red" },
        { num: "−21.556 €", lab: "Jahres-Hochrechnung", color: "red" },
        { num: "17,10 €", lab: "Max. möglich bei 8+ Kriterien", color: "green" }
      ]},
      { t: "alert", level: "critical", title: "Das teuerste Kriterium", html: "Die 10 Impfungen pro Quartal sind der größte Hebel. Bei 850 Fällen kostet die Impflücke über 5.000 € pro Quartal — nur 10 Impfstoffe hätten gereicht." },
      { t: "checks", items: [
        { ok: false, html: "Impfkriterium (Krit. 4): < 10 Impfungen → 40 % Abschlag auf 03040" },
        { ok: true, html: "Aber: 5 erfüllte Kriterien → Zuschlag 03041 (+10 Punkte) bleibt" },
        { ok: false, html: "Kriterium 4 fehlt → 03042 (8+ Kriterien) nicht erreichbar" }
      ]}
    ]
  },
  {
    id: "ab-fall5", icon: "⑤", title: "Fall 5 · Ausschließliche Videosprechstunde",
    blocks: [
      { t: "casemeta", who: "Frau S., 34 Jahre", dx: "Kontrolle nach Harnwegsinfekt · ausschließlich Videosprechstunde", level: "mittel" },
      { t: "p", html: "Reisende Patientin, erscheint im gesamten Quartal ausschließlich per Video. Keine Präsenz in der Praxis. Keine chronische Diagnose." },
      { t: "table", align: ["l","l","r","r"], head: ["Abrechnung im Detail","GOP","Punkte","€"], rows: [
        ["Versichertenpauschale AK 3 (18–54 J.)","03003","115","14,25 €"],
        ["Video-Abschlag 20 %","—","−23","<span class='amount-neg'>−2,85 €</span>"],
        ["Vorhaltepauschale (KV)","03040","128","15,86 €"],
        ["Video-Abschlag 20 %","—","−26","<span class='amount-neg'>−3,17 €</span>"],
        ["Zuschlag (5 Kriterien)","03041","10","1,24 €"],
        ["Video-Abschlag 20 %","—","−2","<span class='amount-neg'>−0,25 €</span>"],
        ["Videosprechstunde (Zuschlag)","01450","40","4,96 €"],
        ["<strong>Summe Behandlungsfall</strong>","","<strong>242</strong>","<strong>30,04 €</strong>"]
      ]},
      { t: "alert", level: "info", title: "Gut zu wissen", html: "Videosprechstunden zählen trotzdem positiv ins Kriterium 8 der Vorhaltepauschale — der 20-%-Abschlag im Einzelfall wird strukturell ausgeglichen, wenn die Praxis genug davon macht." },
      { t: "checks", items: [
        { ok: true, html: "Kennzeichnung mit Pseudo-GOP 88220 (ausschließlich Video)" },
        { ok: false, html: "Automatisch 20 % Abschlag auf 03000, 03040, 03041, 03042, 03060, 03061" }
      ]}
    ]
  },
  {
    id: "ab-fall6", icon: "⑥", title: "Fall 6 · Diabetologische Schwerpunktpraxis",
    blocks: [
      { t: "casemeta", who: "Diabetologische Schwerpunktpraxis (BAG)", dx: "1.400 Fälle · 28 % spezialisierte Diabetes-Behandlungen · nur 4 Impfungen/Quartal", level: "komplex" },
      { t: "p", html: "Die BAG betreut überwiegend Diabetes-Patienten im DMP. Impfquote niedrig, weil die meisten Patienten parallel vom Hausarzt geimpft werden. 6 Kriterien erfüllt (Hausbesuche, Geriatrie, Kooperation Pflegeheim, Basisdiagnostik, QZ, erweiterte Sprechzeiten — nicht: Impfung, Ultraschall-Abdomen, Kleinchirurgie, Videosprechstunde)." },
      { t: "table", align: ["l","l","r","r"], head: ["Ergebnis pro Behandlungsfall","GOP","Punkte","€"], rows: [
        ["Vorhaltepauschale Basis","03040","128","15,86 €"],
        ["Praxisgröße > 1.200 Fälle → Aufschlag","—","+9","+1,12 €"],
        ["Zuschlag SPP-Automatik","03041","10","1,24 €"],
        ["<strong>Effektiv pro Fall</strong>","—","<strong>147</strong>","<strong>18,22 €</strong>"]
      ]},
      { t: "kpi", items: [
        { num: "25.508 €", lab: "Quartals-Summe (1.400 × 18,22 €)", color: "green" },
        { num: "13.485 €", lab: "Ohne SPP-Status (mit Impfabschlag)" },
        { num: "+12.023 €", lab: "Schutzeffekt SPP pro Quartal", color: "green" }
      ]},
      { t: "alert", level: "ok", title: "Wichtig", html: "Der SPP-Status (diabetologisch, HIV, Substitution) muss nicht separat beantragt werden — er ergibt sich automatisch aus dem Abrechnungsspiegel, wenn > 20 % entsprechende Leistungen erbracht werden." },
      { t: "checks", items: [
        { ok: true, html: "> 20 % Patienten mit spezialisierter Diabetes-Behandlung → gilt als SPP" },
        { ok: true, html: "Automatisch 10-Punkte-Zuschlag 03041 ohne Kriterienprüfung" },
        { ok: true, html: "Kein 40 %-Impfabschlag trotz < 10 Impfungen" },
        { ok: false, html: "Aber: 30-Punkte-Zuschlag 03042 nur bei 8+ Kriterien (hier nur 6) → nicht erreicht" }
      ]}
    ]
  },
  {
    id: "ab-fall7", icon: "⑦", title: "Fall 7 · Diagnose ändert sich",
    blocks: [
      { t: "casemeta", who: "Herr G., 61 Jahre", dx: "Hypertonie I10.90 (ein Medikament) → jetzt Neudiagnose Typ-2-Diabetes", level: "komplex" },
      { t: "p", html: "<strong>Q1/2026:</strong> Versorgungspauschale 03100 korrekt angesetzt (deckt Q1 + Q2 ab). <strong>Q2/2026:</strong> Routinekontrolle zeigt HbA1c 8,2 % → Erstdiagnose Diabetes Typ 2 (E11.9). Beginn Metformin." },
      { t: "alert", level: "warn", title: "Problem", html: "Die Ausschlusskriterien der Versorgungspauschale sind jetzt verletzt." },
      { t: "table", align: ["l","l","r","r"], head: ["Q2/2026 · 03100 gilt weiter","GOP","Punkte","€"], rows: [
        ["Versorgungspauschale (läuft aus Q1 weiter)","03100","413","51,34 €"],
        ["HbA1c-Labor (Eigenbefund)","32094","—","0,60 €"],
        ["Beratung Diabeteserstdiagnose","03230","128*","7,93 €"]
      ]},
      { t: "table", align: ["l","l","r","r"], head: ["Q3/2026 · keine 03100 mehr","GOP","Punkte","€"], rows: [
        ["Versichertenpauschale AK 4 (55–74 J.)","03004","179","22,18 €"],
        ["Chronikerpauschale","03220","130","16,10 €"],
        ["DMP-Einschreibung Diabetes (einmalig)","03313","—","extrabudg."]
      ]},
      { t: "note", html: "Hinweis: Die Schulungsunterlage nennt hier versehentlich GOP 03005 (≥ 75 J.). Altersrichtig für 55–74 J. ist <strong>03004</strong> (179 Pkt · 22,18 €)." },
      { t: "alert", level: "info", title: "Organisations-Tipp", html: "Bei jedem Chroniker mit 03100 im Dauer-Monitoring einen Marker im PVS setzen. Sobald eine zweite Dauerdiagnose oder ein zweites Dauerrezept hinzukommt, wechselt die Abrechnungslogik." },
      { t: "checks", items: [
        { ok: false, html: "Jetzt 2 chronische Diagnosen (Hypertonie + Diabetes)" },
        { ok: false, html: "Jetzt 2 Dauermedikamente" },
        { ok: true, html: "Aber: 03100 in Q1 wurde korrekt angesetzt → nicht rückwirkend zu korrigieren" }
      ]}
    ]
  },
  {
    id: "ab-fall8", icon: "⑧", title: "Fall 8 · Facharzt-Leistung sperrt Vorhaltepauschale",
    blocks: [
      { t: "casemeta", who: "Frau K., 49 Jahre", dx: "Anpassungsstörung · Hausarzt hat Psychotherapie-Zulassung · Richtlinientherapie läuft", level: "komplex" },
      { t: "p", html: "Der Hausarzt führt bei Frau K. im Quartal eine Richtlinien-Psychotherapie-Sitzung (EBM-Kapitel 35.2) durch. Zusätzlich kommt die Patientin wegen eines Atemwegsinfekts (03000-Fall)." },
      { t: "table", align: ["l","l","r","r"], head: ["Abrechnung im Detail","GOP","Punkte","€"], rows: [
        ["Versichertenpauschale AK 3","03003","115","14,25 €"],
        ["Einzeltherapie (Kurzzeit, 50 min)","35401","858","106,30 €"],
        ["Psychotherapeutische Sprechstunde","35151","232","28,75 €"],
        ["Vorhaltepauschale + Zuschläge","03040 + 03041/42","—","<span class='dx'>gesperrt</span>"],
        ["<strong>Summe Behandlungsfall</strong>","","<strong>1.205</strong>","<strong>149,30 €</strong>"]
      ]},
      { t: "alert", level: "info", title: "Ausnahme", html: "Die psychosomatische Grundversorgung (GOP 35100, 35110) zählt <em>nicht</em> als fachärztlich und sperrt die Vorhaltepauschale nicht. Schlafstörungsdiagnostik (Abschnitt 30.9) und Schmerztherapie (Abschnitt 30.7) sperren hingegen beide." },
      { t: "alert", level: "warn", title: "Für dich als MFA", html: "Vor jeder Quartalsabrechnung prüfen, ob bei Patienten mit 35er-Positionen (außer 35100/35110) die automatische 03040-Zusetzung korrekt unterdrückt ist. Die KV filtert das meist automatisch, aber Korrekturbescheide häufen sich genau hier." },
      { t: "checks", items: [
        { ok: true, html: "Richtlinien-Psychotherapie Kap. 35.2 = fachärztliche Leistung" },
        { ok: false, html: "Vorhaltepauschale 03040 + Zuschläge 03041/03042 → entfallen für diesen Behandlungsfall" },
        { ok: true, html: "Versichertenpauschale + hausärztliche Leistungen bleiben abrechenbar" }
      ]}
    ]
  },
  {
    id: "ab-quellen", icon: "📚", title: "Quellen & Rechtsgrundlagen",
    blocks: [
      { t: "h3", html: "Gesetzliche Grundlage" },
      { t: "p", html: "Gesundheitsversorgungsstärkungsgesetz (GVSG) · Beschluss des Bewertungsausschusses 792. Sitzung vom 19.08.2025 (Vorhaltepauschale) · Beschluss des Bewertungsausschusses vom 11.03.2026 (hausärztliche Versorgungspauschale ab 01.07.2026)." },
      { t: "h3", html: "Primärquellen" },
      { t: "p", html: "Kassenärztliche Bundesvereinigung (kbv.de) · GKV-Spitzenverband · regionale KVen: KV Nordrhein, KV Bayerns, KV Rheinland-Pfalz, KV Bremen, KV Berlin, KV Westfalen-Lippe." },
      { t: "h3", html: "Fachpublikationen" },
      { t: "p", html: "Deutsches Ärzteblatt · Der niedergelassene Arzt · Deutsches Arztportal · Virchowbund · Institut für Hausärztliche Fortbildung (IHF) · PKV-Institut · BDI (Berufsverband Deutscher Internistinnen und Internisten)." },
      { t: "h3", html: "Hinweis zur Nutzung" },
      { t: "p", html: "Eurowerte sind Näherungen mit bundesweitem Orientierungs-Punktwert 2026 (ca. 12,4 Cent); regionale Abweichungen möglich. Bei Unklarheiten immer die zuständige Kassenärztliche Vereinigung kontaktieren." },
      { t: "alert", level: "warn", title: "Haftungsausschluss", html: "Dieses Dokument dient der Information und Orientierung. Es ersetzt keine professionelle Abrechnungsberatung durch die zuständige KV, Steuerberater oder Abrechnungsdienstleister. Stand der Recherche: April 2026." }
    ]
  }
];
