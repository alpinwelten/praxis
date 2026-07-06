/* Synonyme für die globale Suche.
   Schlüssel: normalisiert (klein, ae/oe/ue/ss). Ein Treffer auf den Schlüssel
   (auch als Wortanfang) erweitert die Suche um die Alternativen.
   Beispiel: „Blutdruck“ findet damit auch Hypertonie/I10-Einträge. */
window.SUCHE_ALIASE = {
  blutdruck: ['hypertonie', 'i10', 'rr'],
  bluthochdruck: ['hypertonie', 'i10'],
  hypertonie: ['blutdruck', 'i10'],
  hochdruck: ['hypertonie', 'i10'],

  fettstoffwechsel: ['lipoprotein', 'e78', 'hyperlipid', 'cholesterin'],
  cholesterin: ['lipoprotein', 'e78', 'statin', 'fettstoffwechsel'],
  hyperlipid: ['e78', 'lipoprotein'],
  blutfett: ['lipoprotein', 'e78', 'fettstoffwechsel'],
  statin: ['e78', 'lipoprotein', 'cholesterin'],

  schilddruese: ['hypothyreose', 'thyreoiditis', 'tsh', 'e03', 'struma'],
  hashimoto: ['autoimmunthyreoiditis', 'e06.3'],
  unterfunktion: ['hypothyreose', 'e03'],
  thyroxin: ['hypothyreose', 'tsh', 'e03'],

  gicht: ['m10', 'harnsaeure'],
  harnsaeure: ['gicht', 'm10', 'allopurinol'],
  allopurinol: ['gicht', 'm10'],

  zucker: ['diabetes', 'hba1c', 'e11'],
  diabetes: ['e11', 'hba1c'],

  krankschreibung: ['arbeitsunfaehigkeit', 'au', '01630', 'eau'],
  arbeitsunfaehigkeit: ['au', '01630', 'krankschreibung'],

  video: ['videosprechstunde', '88220', '01450'],
  hausbesuch: ['01410', 'besuch', 'mitbesuch'],
  impfen: ['impfung', 'schutzimpfung'],
  impfung: ['schutzimpfung', 'impf'],
  grippe: ['influenza', 'grippeimpfung', '89111'],
  guertelrose: ['zoster', 'shingrix'],

  medikationsplan: ['03222'],
  qualitaetszirkel: ['99305', 'qz'],
  sprechzeiten: ['99306'],
  chroniker: ['03220', '03100', 'chronikerpauschale'],
  pauschale: ['pauschalen', 'pauschal'],
  diagnosen: ['diagnose', 'qualifizierend'],
  qualifizierend: ['diagnosen', '03100'],
};
