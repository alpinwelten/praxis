/* Modul „Nachschlagen" – Abkürzungen, GOPs, ICD-10-Codes, Fachbegriffe
   Quelle: Abkürzungsjournal Hausarzt 2026 · Revision 1 (Stand April 2026)
   Eurowerte = bundesweiter Orientierungspunktwert 2026 (ca. 12,4 Cent), regionale Abweichungen möglich. */
window.NACHSCHLAGEN = {
  abk: [
    { k: "AK", v: "Altersklasse (im EBM für Versichertenpauschalen: AK 1 = bis 4 J., AK 2 = 5–17 J., AK 3 = 18–54 J., AK 4 = 55–74 J., AK 5 = ab 75 J.)", note: "korrigiert" },
    { k: "AU", v: "Arbeitsunfähigkeitsbescheinigung, Krankschreibung, GOP 01630" },
    { k: "BAG", v: "Berufsausübungsgemeinschaft, mehrere Ärzte in gemeinsamer Praxisführung (früher: Gemeinschaftspraxis)" },
    { k: "BHF", v: "Behandlungsfall, ein Patient in einem Quartal bei derselben Praxis; Abrechnungsgrundlage für die meisten Pauschalen" },
    { k: "BMV-Ä", v: "Bundesmantelvertrag-Ärzte, regelt die vertragsärztliche Versorgung in der GKV" },
    { k: "COPD", v: "Chronic Obstructive Pulmonary Disease, chronisch obstruktive Lungenerkrankung" },
    { k: "DMP", v: "Disease-Management-Programm, strukturierte Behandlungsprogramme für chronisch Kranke (Diabetes, KHK, Asthma, COPD, Brustkrebs, Depression)" },
    { k: "EBM", v: "Einheitlicher Bewertungsmaßstab, Leistungsverzeichnis der vertragsärztlichen GKV-Versorgung mit Bewertung in Punkten" },
    { k: "EKG", v: "Elektrokardiogramm, Ruhe-EKG (GOP 03321), Belastungs-EKG (GOP 03322), Langzeit-EKG (GOP 03323)" },
    { k: "GKV", v: "Gesetzliche Krankenversicherung, im Gegensatz zur PKV (Private Krankenversicherung)" },
    { k: "GOÄ", v: "Gebührenordnung für Ärzte, für privatärztliche Abrechnung (PKV und Selbstzahler), nicht für GKV" },
    { k: "GOP", v: "Gebührenordnungsposition, fünfstellige Ziffer im EBM für eine abrechenbare Leistung (z. B. 03040)" },
    { k: "GVSG", v: "Gesundheitsversorgungsstärkungsgesetz, 2024 beschlossenes Gesetz, Grundlage für Entbudgetierung und neue Pauschalen 2026" },
    { k: "HbA1c", v: "Hämoglobin A1c, Langzeitblutzuckerwert der letzten 8–12 Wochen; Diagnose- und Verlaufsparameter bei Diabetes" },
    { k: "HIV", v: "Human Immunodeficiency Virus, Humanes Immunschwächevirus" },
    { k: "HZV", v: "Hausarztzentrierte Versorgung, Selektivvertrag nach §73b SGB V; HZV-Fälle zählen nicht in die Kriterienprüfung der Vorhaltepauschale" },
    { k: "ICD-10-GM", v: "International Classification of Diseases, 10. Revision, German Modification, verpflichtende Diagnose-Codierung in Deutschland" },
    { k: "KBV", v: "Kassenärztliche Bundesvereinigung, Dachverband der Kassenärztlichen Vereinigungen; Vertragspartner im Bewertungsausschuss" },
    { k: "KIM", v: "Kommunikation im Medizinwesen, sicherer E-Mail-Dienst in der Telematikinfrastruktur (TI)" },
    { k: "KV", v: "Kassenärztliche Vereinigung, Landesebene (17 KVen in Deutschland); setzt Vorhaltepauschale und Zuschläge automatisch zu" },
    { k: "KVB", v: "Kassenärztliche Vereinigung Bayerns" },
    { k: "KVNO", v: "Kassenärztliche Vereinigung Nordrhein" },
    { k: "LZ-RR", v: "Langzeit-Riva-Rocci, 24-Stunden-Blutdruckmessung (GOP 03324); zählt zu Kriterium 7 der Vorhaltepauschale" },
    { k: "MFA", v: "Medizinische Fachangestellte, staatlich anerkannter Ausbildungsberuf (früher Arzthelferin)" },
    { k: "MVZ", v: "Medizinisches Versorgungszentrum, fachübergreifende, ärztlich geleitete Einrichtung mit angestellten Ärzten" },
    { k: "OPV", v: "Orientierungspunktwert, bundesweiter Punktwert, aus dem sich die Euro-Vergütung einer GOP ergibt. 2026: ca. 12,4 Cent" },
    { k: "pAPK", v: "Persönlicher Arzt-Patienten-Kontakt, räumliche und zeitgleiche Anwesenheit von Arzt und Patient; Voraussetzung für die Versorgungspauschale" },
    { k: "PKV", v: "Private Krankenversicherung, Abrechnung nach GOÄ, nicht EBM" },
    { k: "PVS", v: "Praxisverwaltungssystem, Praxissoftware zur Dokumentation und Abrechnung (z. B. Medistar, T2med, CGM, Duria, Turbomed)" },
    { k: "Q1–Q4", v: "Quartal 1 bis 4 (Jan–März, Apr–Juni, Juli–Sept, Okt–Dez); Abrechnungszeitraum der KV" },
    { k: "QZ", v: "Qualitätszirkel, anerkannte Fortbildungsgruppe; Teilnahme 2×/Jahr erfüllt Kriterium 9 der Vorhaltepauschale (Kennzeichnung SNR 99305)" },
    { k: "SGB V", v: "Sozialgesetzbuch V, gesetzliche Krankenversicherung; zentrale Rechtsgrundlage" },
    { k: "SNR", v: "Symbolnummer, Pseudo-GOP ohne Punktwert, dient der Kennzeichnung bestimmter Sachverhalte in der Abrechnung" },
    { k: "SPP", v: "Schwerpunktpraxis, diabetologische, HIV- oder Substitutionspraxis mit > 20 % entsprechenden Patienten; erhält Sonderregeln bei der Vorhaltepauschale" },
    { k: "TI", v: "Telematikinfrastruktur, sicheres Netzwerk des Gesundheitswesens (für KIM, ePA, eRezept, eAU)" },
    { k: "TSH", v: "Thyreoidea-stimulierendes Hormon, Laborparameter zur Schilddrüsenfunktionsdiagnostik" },
    { k: "TSVG", v: "Terminservice- und Versorgungsgesetz, 2019; Neupatientenzuschläge sind 2025 entfallen" },
    { k: "VHP", v: "Vorhaltepauschale, Sammelbegriff für GOP 03040 und die Zuschläge 03041, 03042 (quartalsweise) bzw. 03043–03048 (halbjährlich)" }
  ],

  gops: [
    { group: "Versicherten- und Chronikerpauschalen", items: [
      { k: "03000", v: "Versichertenpauschale AK 1 (< 5 J.)", note: "Kleinkinder", amount: "17,42 €" },
      { k: "03001", v: "Versichertenpauschale AK 2 (5–17 J.)", amount: "12,51 €" },
      { k: "03003", v: "Versichertenpauschale AK 3 (18–54 J.)", note: "neu · Altersgrenze korrigiert (vorher 19–54 J.)", amount: "14,25 €" },
      { k: "03004", v: "Versichertenpauschale AK 4 (55–74 J.)", amount: "22,18 €" },
      { k: "03005", v: "Versichertenpauschale AK 5 (≥ 75 J.)", note: "neu · Altersgrenze korrigiert (vorher ≥ 76 J.)", amount: "35,32 €" },
      { k: "03220", v: "Chronikerpauschale I", note: "1 Kontakt im Quartal", amount: "16,10 €" },
      { k: "03221", v: "Chronikerpauschale II", note: "ab 2. Kontakt im Quartal", amount: "4,96 €" },
      { k: "03222", v: "Zuschlag Medikationsplan", note: "bei ≥ 3 Dauermedikamenten", amount: "1,49 €" }
    ]},
    { group: "Vorhalte- und Versorgungspauschalen (neu ab 2026)", items: [
      { k: "03040", v: "Vorhaltepauschale Basis (Quartal)", amount: "15,86 €" },
      { k: "03041", v: "Zuschlag zur 03040 (2–7 Kriterien erfüllt)", amount: "+1,24 €" },
      { k: "03042", v: "Zuschlag zur 03040 (≥ 8 Kriterien erfüllt)", amount: "+3,72 €" },
      { k: "03043", v: "Vorhaltepauschale Halbjahr (bei 03100)", amount: "22,81 €" },
      { k: "03044", v: "Zuschlag zur 03043 (2–7 Kriterien)", amount: "+1,74 €" },
      { k: "03045", v: "Zuschlag zur 03043 (≥ 8 Kriterien)", amount: "+5,21 €" },
      { k: "03046", v: "Vorhaltepauschale zur 03110 (Folgequartal)", amount: "9,81 €" },
      { k: "03047", v: "Zuschlag zur 03046 (2–7 Kriterien)", amount: "+0,76 €" },
      { k: "03048", v: "Zuschlag zur 03046 (≥ 8 Kriterien)", amount: "+2,29 €" },
      { k: "03100", v: "Versorgungspauschale AK 1 (18–54 J.)", note: "ab 01.07.2026 · Halbjahrespauschale", amount: "45,36 €" },
      { k: "03100", v: "Versorgungspauschale AK 2 (55–74 J.)", note: "ab 01.07.2026 · Halbjahrespauschale", amount: "51,34 €" },
      { k: "03110", v: "Zuschlag bei intensiverer Betreuung AK 1", note: "Folgequartal nach 03100, max. 8 % der Fälle", amount: "19,37 €" },
      { k: "03110", v: "Zuschlag bei intensiverer Betreuung AK 2", note: "Folgequartal nach 03100, max. 8 % der Fälle", amount: "22,04 €" }
    ]},
    { group: "Hausbesuche und Gesprächsleistungen", items: [
      { k: "01410", v: "Hausbesuch", amount: "22,43 €" },
      { k: "01413", v: "Mitbesuch (weiterer Patient am selben Ort)", amount: "9,55 €" },
      { k: "01415", v: "Dringender Besuch (sofort, ohne Zuwarten)", amount: "25,66 €" },
      { k: "01450", v: "Zuschlag Videosprechstunde", amount: "4,96 €" },
      { k: "01630", v: "Arbeitsunfähigkeitsbescheinigung (eAU)", amount: "2,60 €" },
      { k: "03060", v: "Dringender Hausbesuch (nach Art und Schwere sofort)", note: "neu · zählt zu den Positionen mit 20-%-Video-Abschlag", amount: "regional" },
      { k: "03061", v: "Dringender Mitbesuch", note: "neu · zählt zu den Positionen mit 20-%-Video-Abschlag", amount: "regional" },
      { k: "03230", v: "Hausärztliches Gespräch", note: "budgetiert auf 64 Pkt (7,93 €) pro BHF", amount: "7,93 €" },
      { k: "03212", v: "Akutgespräch / Akutberatung", amount: "variabel" }
    ]},
    { group: "Diagnostik, Impfungen, Sonderkennziffern", items: [
      { k: "03321", v: "Ruhe-EKG (12 Ableitungen)", amount: "15,74 €" },
      { k: "03322", v: "Belastungs-EKG", amount: "21,18 €" },
      { k: "03324", v: "Langzeit-Blutdruckmessung (24h)", amount: "6,82 €" },
      { k: "03313", v: "DMP-Einschreibung (einmalig, je Programm)", amount: "extrabudg." },
      { k: "32094", v: "HbA1c (Eigenlabor)", amount: "0,60 €" },
      { k: "35100", v: "Psychosomatische Grundversorgung, verbale Intervention", note: "sperrt die Vorhaltepauschale nicht", amount: "17,94 €" },
      { k: "35110", v: "Psychosomatische Grundversorgung, differenzialdiagnostische Klärung", note: "sperrt die Vorhaltepauschale nicht", amount: "22,16 €" },
      { k: "35151", v: "Psychotherapeutische Sprechstunde (Kap. 35.2 EBM)", note: "neu · sperrt die Vorhaltepauschale", amount: "28,75 €" },
      { k: "35401", v: "Richtlinien-Einzeltherapie, Kurzzeit (50 min)", note: "sperrt die Vorhaltepauschale", amount: "106,30 €" },
      { k: "89111", v: "Schutzimpfung (z. B. Grippe)", amount: "8,68 €" }
    ]},
    { group: "Pseudo-GOPs und Symbolnummern", items: [
      { k: "88220", v: "Kennzeichnung: ausschließlich Videosprechstunde", note: "präzisiert · löst 20 % Abschlag auf 03000, 03040, 03041, 03042, 03060, 03061 aus", amount: "SNR" },
      { k: "88230", v: "Pseudo-GOP bei Folgequartals-Kontakt nach 03100", note: "wenn keine andere GOP passt", amount: "SNR" },
      { k: "99305", v: "Kennzeichnung Kriterium 9 (Qualitätszirkel)", note: "einmal am letzten Tag des Quartals", amount: "SNR" },
      { k: "99306", v: "Kennzeichnung Kriterium 10 (erweiterte Sprechzeiten)", note: "einmal am letzten Tag des Quartals", amount: "SNR" }
    ]}
  ],

  icd: [
    { group: "Qualifizierende Diagnosen für GOP 03100", items: [
      { k: "E03.0", v: "Angeborene Hypothyreose mit diffuser Struma", note: "qualifiziert für Versorgungspauschale bei Monotherapie" },
      { k: "E03.1", v: "Angeborene Hypothyreose ohne Struma" },
      { k: "E03.4", v: "Atrophie der Schilddrüse (erworben)" },
      { k: "E03.8", v: "Sonstige näher bezeichnete Hypothyreose" },
      { k: "E03.9", v: "Hypothyreose, nicht näher bezeichnet", note: "typisch bei L-Thyroxin-Substitution" },
      { k: "E06.3", v: "Autoimmunthyreoiditis (Hashimoto-Thyreoiditis)" },
      { k: "E78.0–E78.5", v: "Störungen des Lipoproteinstoffwechsels", note: "reine Hypercholesterinämie, Mischhyperlipidämie u. a., bei Monotherapie mit Statin" },
      { k: "E78.8 / E78.9", v: "Sonstige / nicht näher bezeichnete Störungen des Lipoproteinstoffwechsels" },
      { k: "I10.00", v: "Benigne essentielle Hypertonie", note: "ohne hypertensive Krise (Grundvoraussetzung)" },
      { k: "I10.90", v: "Essentielle Hypertonie, nicht näher bezeichnet", note: "ohne hypertensive Krise" },
      { k: "M10.00–M10.99", v: "Idiopathische Gicht", note: "verschiedene Lokalisationen, bei Monotherapie mit Allopurinol o. ä." }
    ]},
    { group: "Weitere in den Fallbeispielen vorkommende Codes", items: [
      { k: "E11.9", v: "Diabetes mellitus Typ 2, ohne Komplikationen", note: "schließt die Versorgungspauschale aus (mehrfache Chronikerdiagnose)" },
      { k: "I10.01 / I10.11 / I10.91", v: "Hypertonie mit hypertensiver Krise", note: "schließt die Versorgungspauschale aus" }
    ]}
  ],

  begriffe: [
    { k: "Behandlungsfall", v: "Ein Patient, der in einem Quartal in derselben Praxis behandelt wird. Mehrere Kontakte im Quartal ergeben einen Behandlungsfall. Grundlage für die Abrechnung der meisten Pauschalen. Aus Behandlungsfällen werden die Kriterien der Vorhaltepauschale prozentual berechnet." },
    { k: "Bewertungsausschuss", v: "Gemeinsames Gremium von KBV und GKV-Spitzenverband. Legt den EBM fest, einschließlich neuer GOPs, Punktwerte, Bewertungen und Abrechnungsregeln. Beschlüsse sind für alle Vertragsärzte bindend." },
    { k: "Chronikerregelung", v: "Ein Patient gilt als chronisch krank, wenn er in mindestens drei der letzten vier Quartale wegen derselben gesicherten Dauerdiagnose behandelt wurde. Erst dann können Chronikerpauschale (03220) oder Versorgungspauschale (03100) angesetzt werden." },
    { k: "Entbudgetierung", v: "Aufhebung der Mengenbegrenzung bei der Vergütung. Seit 01.10.2025 sind die meisten hausärztlichen Leistungen entbudgetiert, sie werden zum vollen Eurowert bezahlt. Ausnahmen: GOP 03230 (Gesprächsleistung), Akupunktur, Schmerztherapie, einige weitere." },
    { k: "Extrabudgetäre Vergütung", v: "Leistungen, die außerhalb des Praxisbudgets voll bezahlt werden (z. B. Impfungen, DMP-Einschreibung, Vorhaltepauschale). Leistungen innerhalb des Budgets werden ab einer Obergrenze nur anteilig vergütet." },
    { k: "Kollektivvertrag", v: "Standardversorgungsvertrag zwischen KV und Krankenkassen. Alle Versicherten ohne besondere Einschreibung werden kollektivvertraglich behandelt. Nur diese Fälle zählen in die Kriterienprüfung der Vorhaltepauschale." },
    { k: "Medikationsplan", v: "Verpflichtende Übersicht aller Dauermedikamente eines Patienten. Anspruch bei mindestens drei verordneten Medikamenten über mind. 28 Tage (§31a SGB V). Zuschlag über GOP 03222." },
    { k: "Orientierungspunktwert", v: "Der Geldwert, der einem Punkt im EBM entspricht. Bundesweit verhandelt, regional leicht angepasst. 2026 ca. 12,4 Cent pro Punkt. Eine GOP mit 128 Punkten entspricht also ca. 128 × 0,124 € = 15,87 €." },
    { k: "Präambel 3.1 EBM", v: "Einleitender Regelungsteil des hausärztlichen Kapitels im EBM. Nummer 10 definiert den Behandlungsfallbegriff, maßgeblich für alle prozentualen Kriterien der Vorhaltepauschale." },
    { k: "Richtlinien-Psychotherapie", v: "Durch den Gemeinsamen Bundesausschuss definierte Psychotherapieverfahren. GOPs aus Kapitel 35.2 EBM (u. a. 35151, 35401) sperren die Vorhaltepauschale 03040, da sie als fachärztliche Leistung gelten." },
    { k: "Selektivvertrag", v: "Versorgungsvertrag außerhalb des Kollektivvertrags, z. B. HZV-Vertrag. Patienten schreiben sich freiwillig ein. Selektivvertragliche Fälle zählen nicht in die Kriterienprüfung der Vorhaltepauschale." },
    { k: "Substitutionspraxis", v: "Praxis, die opioidabhängige Patienten substitutionsgestützt nach Abschnitt 1.8 EBM versorgt. Bei > 20 % Substitutionspatienten gelten dieselben Ausnahmeregeln wie für diabetologische Schwerpunktpraxen (automatischer 10-Punkte-Zuschlag, kein Impfabschlag)." },
    { k: "Versichertenpauschale", v: "Grundpauschale pro Behandlungsfall (GOP 03000–03005). Altersgestaffelt, einmal pro Quartal pro Patient. Wird durch die Versorgungspauschale 03100 bei passenden Chronikern ersetzt, nicht ergänzt." },
    { k: "Versorgungspauschale", v: "Neue Pflicht-Halbjahrespauschale ab 01.07.2026 (GOP 03100) für Patienten mit genau einer qualifizierenden chronischen Diagnose und einem Dauermedikament. Ersetzt Versicherten- und Chronikerpauschale für diese Gruppe. Deckt zwei Quartale ab." },
    { k: "Vorhaltepauschale", v: "Pauschale für die Praxis-Struktur (GOP 03040 mit Zuschlägen 03041/03042). Wird automatisch von der KV zur Versichertenpauschale zugesetzt, wenn im Quartal keine fachärztlichen Leistungen erbracht wurden. Gestaffelt nach 10 Strukturkriterien, mit 40-%-Abschlag bei weniger als 10 Impfungen pro Quartal." }
  ]
};
