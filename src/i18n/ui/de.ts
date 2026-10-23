/**
 * German UI strings (formal "Sie"). Source: src/i18n/ui/en.ts. Rules: docs/i18n-translator-guide.md.
 * German typography: „…“ for quotation marks; nouns are capitalised, so {name} is used instead of {nameLower}.
 */
import type { UiPartial } from './types.ts';

/** Set by `npm run i18n:stamp`: the English dictionary this file was translated from. */
export const sourceHash = '63f8be54f28d';

const de: UiPartial = {
  meta: {
    tagline: 'Seifen und Haushaltspflegeprodukte, exportiert aus Indien',
  },

  terms: {
    incoterms: 'FOB, CIF und CFR verfügbar; Zahlungsbedingungen werden je Auftrag vereinbart (T/T oder LC)',
    payment: 'Je Auftrag vereinbart (T/T oder LC)',
    port: 'Versand ab den wichtigsten indischen Häfen',
    leadTime: 'In der Regel 3 bis 5 Wochen nach Auftragsbestätigung, abhängig von den Anforderungen an die Handelsmarke',
  },

  common: {
    skip: 'Zum Inhalt springen',
    home: 'Startseite',
    products: 'Produkte',
    blog: 'Ratgeber',
    breadcrumb: 'Brotkrumennavigation',
    requestQuote: 'Angebot anfragen',
    viewProducts: 'Produkte ansehen',
    exporterLine: 'Exporteur und Lieferant aus Indien',
    hsn: 'HSN',
    hsnTitle: 'Harmonisiertes System zur Bezeichnung und Codierung der Waren (HSN)',
    allProducts: 'Alle Produkte',
    allGuides: 'Alle Ratgeber',
    productsCount: '{n} Produkte',
    minRead: '{n} Min. Lesezeit',
    readFaq: 'FAQ lesen',
    straightAnswers: 'Klare Antworten.',
    buyerFaq: 'FAQ für Einkäufer',
    faqDefault: 'Fragen von Einkäufern',
    exportProcessFull: 'Der Exportablauf im Detail',
    renderAlt: 'Illustration: {name} in einer typischen Exportverpackung',
    drawingAlt: 'Illustration: {name}',
    photoAlt: '{name} von GoodBiz',
    categoryRenderAlt: 'Illustration typischer Verpackungen: {name}',
    rangeAlt: 'Illustration des Sortiments von GoodBiz Hygiene in typischen Exportverpackungen',
    portAlt: 'Portalkräne beladen nachts ein Containerschiff am International Container Transshipment Terminal in Kochi, Indien',
    portCaption: 'Containerterminal, Kochi. Foto: {creator}, {license}.',
    specCaption: 'Typische Spezifikationen. Die endgültigen Werte werden je Auftrag bestätigt.',
  },

  header: {
    homeAria: '{name}, Startseite',
    menu: 'Menü',
    mainNav: 'Hauptnavigation',
    mainNavMobile: 'Hauptnavigation (mobil)',
    nav: {
      products: 'Produkte',
      privateLabel: 'Handelsmarke',
      exportProcess: 'Exportablauf',
      guides: 'Einkaufsratgeber',
      about: 'Über uns',
      faq: 'FAQ',
    },
  },

  footer: {
    tag: 'Sauber, aus Indien',
    lede: 'Seifen und Haushaltspflegeprodukte von geprüften indischen Herstellern, exportiert von GoodBiz Hygiene, einem Unternehmen von {parent}.',
    nav: 'Fußbereich',
    products: 'Produkte',
    company: 'Unternehmen',
    contact: 'Kontakt',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, ein Unternehmen von {parent}. Handelsexporteur aus Indien.',
    backToTop: 'Nach oben',
  },

  lang: {
    label: 'Sprache',
    menuAria: 'Sprache wählen. Aktuelle Sprache: {name}',
    more: 'Weitere Sprachen …',
    moreTitle: 'Öffnet diese Seite in Google Übersetzer (maschinelle Übersetzung)',
  },

  whatsapp: {
    aria: 'Mit GoodBiz Hygiene per WhatsApp chatten',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Zur Anfrage hinzufügen',
    addAria: 'Zur Anfrage hinzufügen: {name}',
    noteH: 'Mischen in einem Container.',
    noteText: 'Kombinieren Sie diese Produkte mit Artikeln aus anderen Sortimenten in einem 20-ft- oder 40-ft-Container. Die Zusammenstellung bestätigen wir mit dem Angebot.',
  },

  quote: {
    heading: 'Angebot anfragen.',
    text: 'Schildern Sie Ihren Bedarf in einer Zeile. Das Anfrageformular öffnet sich mit Ihrem Text und ist bereit für Produkte, Menge und Hafen.',
    placeholder: 'z. B. 1×20 ft Geschirrspülmittel, Zitrone, 500 ml',
    label: 'Was benötigen Sie?',
    submit: 'Anfrage starten',
  },

  ld: {
    hsnCode: 'HSN-Code',
    variants: 'Varianten',
    packSizes: 'Packungsgrößen',
  },

  home: {
    title: 'Seifen und Haushaltspflege: Exporteur und Lieferant aus Indien',
    description:
      'GoodBiz Hygiene, ein Unternehmen von GoodBiz Global, exportiert Seifen, Waschmittel und Haushaltsreiniger geprüfter indischer Hersteller, mit Handelsmarke und gemischten Containern.',
    eyebrow: 'Seifen · Waschmittel · Haushaltspflege',
    h1a: 'Seifen und Haushaltspflege',
    h1b: 'Exportiert aus Indien.',
    text: 'GoodBiz Hygiene ist ein Handelsexporteur: Wir beziehen Seifen, Waschmittel und Reiniger von geprüften indischen Herstellern, mit Handelsmarke und gemischten Containern.',
    rangeH: 'Das Sortiment.',
    rangeIntro: 'Drei von {n} Produkten. Jedes hat eine eigene Seite mit typischen Spezifikationen, Packungsgrößen und Optionen für Handelsmarken.',
    rangeAll: 'Alle {n} Produkte ansehen',
    processL1: 'So laufen',
    processL2: 'Exportaufträge ab.',
    processIntro:
      'Ein Handelsexporteur zwischen Ihnen und dem Hersteller: Angebot, Muster, Papiere und Verschiffung, von der ersten Nachricht bis zum Konnossement.',
    steps: [
      {
        name: 'Spezifikation und Muster',
        text: 'Senden Sie uns Produkte, Packungsgrößen, Menge und Zielhafen. Wir nennen Preise je Packung mit typischen Spezifikationen und Lieferzeiten und organisieren Muster zu Ihrer Freigabe.',
      },
      {
        name: 'Beschaffung und Handelsmarke',
        text: 'Wir ordnen Ihre Anforderungen einem geprüften indischen Hersteller zu. Bei Handelsmarken werden Ihr Artwork, Ihr Duft und Ihre Verpackung vor der Serienproduktion freigegeben.',
      },
      {
        name: 'Dokumente und Versand',
        text: 'Der Hersteller produziert und verpackt den Auftrag, während wir Rechnung, Packliste, Ursprungszeugnis, COA und MSDS vorbereiten. {port}. {leadTime}.',
      },
    ],
    catsH: 'Die Kategorien.',
    catsText: 'Fünf Sortimente unter HSN 3401 und 3402. Mischbar in einem 20-ft- oder 40-ft-Container.',
    tileMeta: '{n} Produkte · HSN {hsn}',
    answersMore: 'Weitere Antworten auf der FAQ-Seite',
    statementA: 'Mit Sorgfalt beschafft,',
    statementB: 'mit Zuverlässigkeit verschifft.',
    statementLead:
      'Jeder Auftrag von GoodBiz Hygiene wird einem geprüften indischen Hersteller zugeordnet, mit dem von Ihnen freigegebenen Muster abgeglichen und mit vollständigen Exportpapieren verschifft. So arbeiten wir bei jedem Auftrag, unabhängig von seiner Größe.',
    promises: [
      { title: 'Nur geprüfte Hersteller', text: 'Jedes Produkt stammt von einem indischen Hersteller, den wir auf Qualität, Konstanz und Exporterfahrung geprüft haben.' },
      { title: 'Ihr Muster, getroffen', text: 'Rezeptur, Duft und Verpackung, die Sie freigeben, werden geliefert und vor der Verladung mit Ihrem Muster abgeglichen.' },
      { title: 'Papiere in Ordnung', text: 'Rechnung, Packliste, Ursprungszeugnis, COA und MSDS werden für jede Sendung erstellt, bereit für Ihren Zollagenten.' },
      { title: 'Ein Partner, Hafen zu Hafen', text: 'Ein Angebot und ein Ansprechpartner vom ersten Muster bis zum Konnossement, für alle Produkte Ihrer Bestellung.' },
    ],
    guidesH: 'Einkaufsratgeber',
    fanTabs: 'Sortiment wählen',
    fanShow: '{name} zeigen',
    fanView: 'Sortiment ansehen',
    fanOpen: '{name}: Sortiment ansehen',
  },

  productsIndex: {
    title: 'Seifen, Waschmittel und Reiniger: Exporteur und Lieferant aus Indien',
    description:
      'Entdecken Sie {n} Produkte aus Seife, Wäschepflege, Küche, Oberflächenreinigung und Rohstoffen von geprüften indischen Herstellern, mit HSN-Codes und Handelsmarken-Optionen.',
    l1: 'Alle Produkte.',
    l2: 'Seifen, Waschmittel und Reiniger.',
    lead: '{n} Produkte in fünf Sortimenten, von geprüften indischen Herstellern und mit Optionen für Handelsmarken. Wählen Sie ein Sortiment oder öffnen Sie ein Produkt für Spezifikationen, Packungsgrößen und HSN-Codes.',
    hsnLink: 'HSN-Codes nach Produkt',
    rangesNav: 'Die fünf Sortimente',
    rangeFull: 'Das gesamte Sortiment',
    hsnH: 'Welcher HSN-Code gilt für welches Produkt?',
    hsnText:
      'Die Codes sind sechsstellig angegeben. Der achtstellige ITC-HS-Code wird je Auftrag bestätigt, und bei einigen Produkten gibt es alternative Einreihungen (siehe jeweilige Produktseite).',
    hsnCaption: 'HSN-Übersicht nach Produkt, gegliedert nach Sortiment',
    colProduct: 'Produkt',
    colRange: 'Sortiment',
    colHsn: 'HSN (6-stellig)',
  },

  product: {
    hsnAlt: 'Alternative Einreihung unten vermerkt',
    hsnConfirmed: 'Achtstelliger ITC-HS-Code wird je Auftrag bestätigt',
    factsH: 'Wichtige Fakten für Einkäufer',
    hsnCode: 'HSN-Code',
    hsnNoteDefault: 'Der achtstellige ITC-HS-Code wird je Auftrag bestätigt.',
    moq: 'Mindestbestellmenge',
    privateLabel: 'Handelsmarke',
    plAvailable: 'Verfügbar.',
    plNot: 'Für dieses Produkt nicht im Angebot.',
    varH: 'Sorten, Packungsgrößen und Verpackung',
    variants: 'Verfügbare Sorten',
    variantsAria: 'Sorten',
    packSizes: 'Packungsgrößen',
    packaging: 'Verpackungsoptionen',
    galleryH: 'Weitere Düfte im Bild',
    specH: 'Was sind die typischen Spezifikationen?',
    specNote: '{name}: typische Werte für Exportqualitäten. Die endgültigen Werte werden je Auftrag mit dem Hersteller bestätigt.',
    aboutAria: 'Über {name}',
    loadH: 'Containerbeladung (ca.)',
    loadText: 'Ungefähre Angaben; der endgültige Beladungsplan wird je Auftrag bestätigt.',
    ft20: '20-ft-Container',
    ft40: '40-ft-Container',
    guidesH: 'Einkaufsratgeber zu diesem Produkt',
    relatedH: 'Verwandte Produkte',
    relatedAll: 'Alle Produkte: {name}',
    quoteH: 'Dieses Produkt anfragen.',
    quoteText: 'Nennen Sie uns in einer Zeile Sorte, Packungsgröße, Menge und Zielhafen für {name}. Das Anfrageformular öffnet sich mit Ihrem Text.',
  },

  category: {
    title: '{name}: Exporteur und Lieferant aus Indien',
    hsnMeta: '{n} Produkte · achtstelliger ITC-HS-Code wird je Auftrag bestätigt',
    seeProducts: 'Die {n} Produkte ansehen',
    productsH: 'Welche Produkte der Kategorie „{name}“ liefern wir?',
    quoteH: 'Angebot für „{name}“ anfragen.',
  },

  blogIndex: {
    title: 'Exportratgeber für Einkäufer von Seifen und Reinigungsprodukten',
    description:
      'Praxisnahe Ratgeber für Importeure von Seifen, Waschmitteln und Haushaltspflegeprodukten aus Indien: HSN-Codes, MOQ, Dokumente, Handelsmarke und Versand.',
    l1: 'Einkaufsratgeber.',
    l2: 'Für den Import von Seifen und Haushaltspflege.',
    lead: 'Verständliche Hinweise für Importeure und Händler: Einreihung, Kosten, Dokumente und Produktauswahl.',
    latest: 'Neueste Artikel',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Kurze Antworten',
    relatedH: 'In diesem Ratgeber erwähnte Produkte',
    quoteH: 'Planen Sie eine Bestellung?',
    quoteText: 'Schildern Sie Ihren Bedarf in einer Zeile. Das Anfrageformular öffnet sich mit Ihrem Text und ist bereit für Produkte, Menge und Hafen.',
  },

  contact: {
    title: 'Angebot anfragen: Seifen und Haushaltspflege, Exporteur und Lieferant aus Indien',
    description:
      'Fragen Sie bei GoodBiz Hygiene ein Angebot für Seifen, Waschmittel und Haushaltspflegeprodukte aus Indien an. Senden Sie Produkte, Packungsgrößen und Hafen per E-Mail oder WhatsApp.',
    l1: 'Angebot anfragen.',
    l2: 'Aus Indien, zu Ihrem Hafen.',
    lead: 'Teilen Sie uns Ihren Bedarf mit: Produkte, Packungsgrößen, Menge und Zielhafen. GoodBiz Hygiene antwortet mit Preisen, typischen Spezifikationen und Lieferzeiten.',
    start: 'Anfrage starten',
    waMessage: 'Schreiben Sie uns per WhatsApp',
    formH: 'Anfrageformular',
    asideAria: 'Weitere Kontaktmöglichkeiten',
    email: 'E-Mail',
    whatsapp: 'WhatsApp',
    phone: 'Telefon',
    office: 'Büro',
    terms: 'Exportbedingungen',
    oftenH: 'Häufig gemeinsam angefragt',
    oftenText: 'Tippen Sie auf einer Karte auf „Zur Anfrage hinzufügen“, um das Produkt im Formular oben anzukreuzen.',
  },

  form: {
    name: 'Ihr Name',
    company: 'Unternehmen',
    country: 'Land',
    email: 'E-Mail',
    phone: 'WhatsApp oder Telefon',
    phoneHint: '(mit Landesvorwahl)',
    quantity: 'Menge',
    choose: 'Bitte wählen',
    quantities: [
      'Muster oder Probemenge',
      'Teil eines gemischten Containers',
      '1 × 20-ft-Container',
      '1 × 40-ft-Container',
      'Mehrere Container oder regelmäßige Lieferung',
      'Noch unklar',
    ],
    productsLegend: 'Gewünschte Produkte',
    chooseAny: '(Mehrfachauswahl möglich)',
    plLegend: 'Benötigen Sie eine Handelsmarke?',
    plYes: 'Ja, unter meiner Marke',
    plNo: 'Nein',
    message: 'Nachricht',
    messageHint: '(Packungsgrößen, Düfte, Zielhafen)',
    submit: 'Anfrage senden',
    hint: 'Dadurch öffnet sich Ihre E-Mail-App mit der ausgefüllten Anfrage. Lieber über WhatsApp?',
    hintLink: 'Schreiben Sie uns per WhatsApp',
    hintJs: 'Wählen Sie als Nächstes, ob Sie die Anfrage per WhatsApp oder E-Mail senden möchten.',
    sendH: 'Ihre Anfrage ist bereit. Wie möchten Sie sie senden?',
    sendWa: 'Per WhatsApp senden',
    sendEmail: 'Per E-Mail senden',
    sendNote: 'Beide öffnen Ihre eigene App mit dem ausgeschriebenen Text, sodass Sie ihn vor dem Absenden prüfen können.',
  },

  about: {
    title: 'Über GoodBiz Hygiene: Seifen und Haushaltspflege, Exporteur und Lieferant aus Indien',
    description:
      'GoodBiz Hygiene ist die Exportsparte für Haushaltspflege und Hygiene von GoodBiz Global, einem Handelsexporteur aus Indien, und eine Schwestermarke von GoodBiz Agro.',
    l1: 'GoodBiz Hygiene.',
    l2: 'Ein Unternehmen von {parent}.',
    lead: 'GoodBiz Hygiene ist die Exportsparte für Haushaltspflege und Hygiene von {parent}, einem Handelsexporteur aus Indien, und eine Schwestermarke von GoodBiz Agro.',
    whatH: 'Was macht GoodBiz Hygiene?',
    what1:
      'GoodBiz Hygiene beliefert Importeure, Händler, Großhändler, Supermarktketten und Handelsmarken außerhalb Indiens mit Seifen, Waschmitteln und Haushaltspflegeprodukten. Das Unternehmen besitzt keine Fabrik. Die Produkte stammen von geprüften indischen Herstellern, und GoodBiz Hygiene übernimmt Angebot, Abstimmung der Handelsmarke, Exportdokumente und Versand.',
    what2:
      'Das Sortiment umfasst Produkte der HSN 3401 (Seifen) und HSN 3402 (Waschmittel sowie Wasch- und Reinigungsmittel) sowie eng verwandte Artikel wie pflanzliches Phenol, gegliedert in fünf Sortimente.',
    rangesH: 'Die fünf Sortimente',
    familyH: 'Teil von {parent}',
    familyText: '{parent} betreibt GoodBiz Agro für landwirtschaftliche Exporte und GoodBiz Hygiene für Seifen und Haushaltspflege.',
    visit: 'Besuchen Sie',
    basedIn: 'Sitz in',
    founded: 'Gegründet',
    iec: 'Importer Exporter Code (IEC)',
  },

  faqPage: {
    title: 'FAQ: Seifen und Haushaltspflege, Exporteur und Lieferant aus Indien',
    description:
      'Antworten für Importeure, die Seifen, Waschmittel und Reiniger aus Indien über GoodBiz Hygiene beziehen: Beschaffung, Handelsmarke, MOQ, Incoterms, Dokumente und Lieferzeiten.',
    l1: 'Fragen von Einkäufern.',
    l2: 'Klare Antworten.',
    lead: 'Wie GoodBiz Hygiene Seifen und Haushaltspflegeprodukte aus Indien beschafft, anbietet und verschifft. Produktspezifische Fragen beantworten wir auf der jeweiligen Produktseite.',
    quoteH: 'Noch eine Frage?',
    quoteText: 'Senden Sie sie in einer Zeile mit Ihrer Anfrage. Wir antworten mit den Details zu Ihren Produkten und Ihrem Markt.',
  },

  faqs: [
    {
      heading: 'Beschaffung und Produkte',
      faqs: [
        {
          q: 'Stellt GoodBiz Hygiene die exportierten Produkte selbst her?',
          a: 'Nein. GoodBiz Hygiene ist ein Handelsexporteur aus Indien und ein Unternehmen von GoodBiz Global. Das Unternehmen bezieht Seifen, Waschmittel und Haushaltspflegeprodukte von geprüften indischen Herstellern und übernimmt für Abnehmer im Ausland Angebot, Abstimmung der Handelsmarke, Dokumente und Versand.',
        },
        {
          q: 'Welche Produkte liefert GoodBiz Hygiene?',
          a: 'Fünf Sortimente: Bade- und Körperseifen, Wäschepflege, Küchenpflege, Oberflächen- und Haushaltsreiniger sowie industrielle Rohstoffe wie Seifennudeln, LABSA und SLES. Jedes Produkt hat eine eigene Seite mit typischen Spezifikationen, Packungsgrößen und HSN-Code.',
        },
        {
          q: 'Welche HSN-Codes gelten für Seifen und Reinigungsprodukte?',
          a: 'Seifen fallen unter HSN 3401, Waschmittel sowie Wasch- und Reinigungsmittel unter HSN 3402. Die Website zeigt die Codes sechsstellig, zum Beispiel 3402 50. Der achtstellige ITC-HS-Code wird je Auftrag bestätigt, und einige Produkte, etwa Weichspüler und pflanzliches Phenol, können abweichend eingereiht werden.',
        },
        {
          q: 'Sind die Spezifikationen auf den Produktseiten verbindlich?',
          a: 'Nein. Die Spezifikationen sind typische Werte für Exportqualitäten. Die endgültigen Werte, etwa Aktivsubstanz, TFM oder pH-Wert, werden für jeden Auftrag mit dem Hersteller bestätigt und im Angebot angegeben.',
        },
      ],
    },
    {
      heading: 'Bestellung und Handelsmarke',
      faqs: [
        {
          q: 'Kann ich Produkte unter meiner eigenen Marke bestellen?',
          a: 'Ja. Eine Handelsmarke ist bei den meisten Produkten möglich: mit Ihrem Etiketten-Artwork, einer Auswahl an Duft und Farbe, soweit die Rezeptur es zulässt, und den Packungsgrößen, die Ihr Markt benötigt. Die Mindestmengen hängen von Produkt und Packung ab und sind auf jeder Produktseite als typische Werte angegeben.',
        },
        {
          q: 'Kann ich verschiedene Produkte in einem Container kombinieren?',
          a: 'Ja. Sie können Produkte aus mehreren Sortimenten in einem 20-ft- oder 40-ft-Container zusammenfassen und so ein Sortiment testen, ohne je Produkt einen Container zu füllen. Die Zusammenstellung wird beim Angebot anhand der Verpackungs- und Verträglichkeitsregeln bestätigt.',
        },
        {
          q: 'Kann ich vor der Bestellung Muster erhalten?',
          a: 'Ja. Für die meisten Produkte lassen sich Muster organisieren, bevor Sie einen Auftrag bestätigen. Nennen Sie uns in Ihrer Anfrage die Produkte und Ihre Kurierdaten, dann bestätigen wir, was versendet werden kann.',
        },
        {
          q: 'Wie fordere ich ein Angebot an?',
          a: 'Nutzen Sie das Anfrageformular auf der Kontaktseite oder senden Sie eine WhatsApp-Nachricht oder E-Mail mit Produkten, Packungsgrößen, Menge und Zielhafen. Wir antworten mit Preisen, typischen Spezifikationen und Lieferzeiten.',
        },
      ],
    },
    {
      heading: 'Versand, Zahlung und Dokumente',
      faqs: [
        { q: 'Welche Incoterms und Zahlungsbedingungen bieten Sie an?', a: '{incoterms}.' },
        { q: 'Wie lange dauert es, bis ein Auftrag versandt wird?', a: '{leadTime}. {port}.' },
        {
          q: 'Welche Exportdokumente gehören zu einer Sendung?',
          a: 'Sendungen werden in der Regel mit Handelsrechnung, Packliste, Ursprungszeugnis und Konnossement geliefert, dazu Produktdokumente wie ein Analysezertifikat (COA) und ein Sicherheitsdatenblatt (MSDS). Der genaue Umfang hängt von Ihrem Land ab und wird je Auftrag bestätigt.',
        },
        {
          q: 'Liefern Sie in mein Land?',
          a: 'GoodBiz Hygiene erstellt Angebote für Importeure, Händler und Handelsmarken in den meisten Ländern. Vorschriften des Bestimmungslandes, etwa zur Sprache der Kennzeichnung oder zur Registrierung, klären wir mit Ihnen, bevor der Auftrag bestätigt wird.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'Exportablauf: Seifen und Haushaltspflege, Exporteur und Lieferant aus Indien',
    description:
      'So exportiert GoodBiz Hygiene Seifen, Waschmittel und Reiniger aus Indien: Angebot, Muster, Incoterms, Zahlungsbedingungen, Dokumente, Häfen und typische Lieferzeiten.',
    l1: 'Der Exportablauf.',
    l2: 'Von der Anfrage bis zum Konnossement.',
    lead: 'Die Schritte, Bedingungen und Dokumente für den Bezug von Seifen und Haushaltspflegeprodukten aus Indien über GoodBiz Hygiene.',
    stepsLink: 'Die sechs Schritte',
    termsH: 'Wie lauten die Exportbedingungen?',
    termsIncoterms: 'Incoterms und Zahlung',
    termsPort: 'Hafen',
    termsLead: 'Lieferzeit',
    processL1: 'Welche Schritte führen',
    processL2: 'von der Anfrage zur Verschiffung?',
    processIntro: 'Sechs Schritte, bei denen Angebot, Muster und Proforma-Rechnung von Ihnen freigegeben werden, bevor etwas produziert wird.',
    steps: [
      { name: 'Anfrage', text: 'Senden Sie Produkte, Packungsgrößen, Menge, Zielhafen und etwaige Wünsche zur Handelsmarke über das Anfrageformular, per E-Mail oder WhatsApp.' },
      { name: 'Angebot', text: 'Wir nennen Preise je Packung mit typischen Spezifikationen, dem gewünschten Incoterm und der Lieferzeit. {incoterms}.' },
      { name: 'Muster und Freigaben', text: 'Produktmuster und, bei Handelsmarken, Artwork-Proofs werden freigegeben, bevor der Auftrag bestätigt wird.' },
      { name: 'Proforma-Rechnung und Zahlung', text: 'Eine Proforma-Rechnung bestätigt Produkte, Mengen, Verpackung, Incoterm und Zahlungsbedingungen (T/T oder LC).' },
      { name: 'Produktion und Verpackung', text: 'Der Hersteller produziert und verpackt den Auftrag, gekennzeichnet für den Export und Ihren Markt.' },
      { name: 'Dokumente und Versand', text: 'Wir erstellen die Exportdokumente und buchen die Verschiffung. {port}.' },
    ],
    docsH: 'Welche Dokumente gehören zu einer Sendung?',
    docsText: 'Der genaue Umfang hängt von Ihrem Land ab und wird je Auftrag bestätigt.',
    documents: [
      'Handelsrechnung',
      'Packliste',
      'Ursprungszeugnis',
      'Konnossement (Seefracht)',
      'Analysezertifikat (COA)',
      'Sicherheitsdatenblatt (MSDS)',
    ],
    faqH: 'Exportablauf: Fragen von Einkäufern',
    faqs: [
      { q: 'Welche Incoterms bieten Sie an?', a: '{incoterms}.' },
      { q: 'Von welchem Hafen werden die Sendungen verschifft?', a: '{port}. Der Hafen richtet sich nach Produkt, Standort des Herstellers und Ihrem Bestimmungsort und wird im Angebot genannt.' },
      { q: 'Wie lang ist die Lieferzeit?', a: '{leadTime}.' },
      {
        q: 'Welche Dokumente sind enthalten?',
        a: 'Sendungen werden in der Regel mit Handelsrechnung, Packliste, Ursprungszeugnis und Konnossement (Seefracht) geliefert, dazu COA und MSDS, wenn das Produkt sie erfordert. Ihr Land verlangt unter Umständen mehr, etwa ein Gesundheitszeugnis oder eine legalisierte Rechnung; das wird je Auftrag vereinbart.',
      },
      {
        q: 'Welcher HSN-Code gehört auf die Rechnung?',
        a: 'Die Website zeigt HSN-Codes sechsstellig, zum Beispiel 3402 50. Der achtstellige ITC-HS-Code wird je Auftrag bestätigt. Weichspüler und pflanzliches Phenol können unter abweichende Einreihungen fallen (3809 91 und 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Handelsmarken für Seifen und Reiniger: Exporteur und Lieferant aus Indien',
    description:
      'Handelsmarken für Seifen, Waschmittel und Reiniger aus Indien: Ihr Artwork, Duft, Farbe und Packungsgrößen, hergestellt von geprüften indischen Herstellern und exportiert von GoodBiz Hygiene.',
    l1: 'Handelsmarken für Seifen',
    l2: 'und Reiniger aus Indien.',
    lead: 'Verkaufen Sie Seifen, Waschmittel und Reiniger unter Ihrer eigenen Marke. GoodBiz Hygiene ordnet Ihre Anforderungen einem geprüften indischen Hersteller zu, betreut Muster und Artwork und verschifft die Fertigware zu Ihrem Hafen.',
    renderAlt: 'Illustration von Seifenstücken und einer Handseifenflasche in typischen Handelsmarken-Verpackungen',
    startBrief: 'Anforderungen senden',
    howRuns: 'So läuft ein Auftrag ab',
    optionsH: 'Was lässt sich individuell gestalten?',
    optionsText: 'Vier Entscheidungen machen ein Sortiment zu Ihrem eigenen. Jede wird von Ihnen vor der Serienproduktion freigegeben.',
    options: [
      {
        title: 'Ihre Marke auf der Verpackung',
        text: 'Etikett, Banderole, Karton oder Folie, bedruckt mit Ihrem Artwork. Wir leiten Ihre Dateien an den Hersteller weiter und senden vor dem Druck einen Proof zur Freigabe zurück.',
      },
      {
        title: 'Duft und Farbe',
        text: 'Wählen Sie aus den Düften und Farben, in denen das jeweilige Produkt üblicherweise hergestellt wird, etwa Zitrone, Lavendel, Rose oder Neem. Abweichungen vom Standardsortiment klären wir zuvor mit dem Hersteller.',
      },
      {
        title: 'Packungsgrößen und Formate',
        text: 'Flaschen für den Handel, Nachfüllpackungen, Beutel, Stücke sowie Großkanister oder Fässer, passend zu Ihrem Regal und Ihrer Preislage. Jede Produktseite nennt die typischen Packungsgrößen.',
      },
      {
        title: 'Qualität und Spezifikation',
        text: 'Wählen Sie die Qualität, die Ihr Markt erwartet, etwa TFM bei Badeseife oder Aktivsubstanz bei Waschmitteln. Typische Werte stehen auf den Produktseiten, die endgültigen Werte nennt Ihr Angebot.',
      },
    ],
    processL1: 'So läuft ein Auftrag',
    processL2: 'mit Handelsmarke ab.',
    processIntro: 'Fünf Schritte von Ihren Anforderungen bis zur Ware in Ihrem Hafen, wobei Muster und Artwork von Ihnen freigegeben werden, bevor etwas produziert wird.',
    steps: [
      { name: 'Anforderungen mitteilen', text: 'Produkte, Packungsgrößen, Düfte, Zielmarkt und eine Mengenschätzung.' },
      { name: 'Angebot und Herstellerzuordnung', text: 'Wir ordnen Ihre Anforderungen einem geprüften indischen Hersteller zu und nennen Preise je Packung, mit Incoterms und Lieferzeit.' },
      { name: 'Muster und Artwork', text: 'Sie geben ein Produktmuster und einen gedruckten Proof Ihres Artworks frei. Die Produktion beginnt in der Regel, nachdem Sie beides freigegeben haben.' },
      { name: 'Produktion und Verpackung', text: 'Der Hersteller produziert und verpackt Ihren Auftrag unter Ihrer Marke, gekennzeichnet für den Export.' },
      { name: 'Dokumente und Versand', text: 'Wir erstellen die Exportdokumente und buchen die Verschiffung. {port}.' },
    ],
    faqH: 'Handelsmarke: Fragen von Einkäufern',
    faqs: [
      {
        q: 'Wie hoch ist die Mindestbestellmenge bei Handelsmarken?',
        a: 'Sie hängt von Produkt und Packung ab. Bei den meisten Produkten gibt es keine feste Mindestbestellmenge, allerdings kann ein Handelsmarken-Design eine eigene Mindestmenge für bedruckte Etiketten oder Kartons haben. Nennen Sie uns Ihre Menge, dann machen wir Ihnen ein Angebot.',
      },
      {
        q: 'Wem gehören Artwork und Marke?',
        a: 'Das Artwork bleibt Ihr Eigentum; die Nutzungsbedingungen werden je Auftrag vereinbart. GoodBiz Hygiene koordiniert den Druck mit dem Hersteller.',
      },
      {
        q: 'Kann ich Handelsmarken- und Standardprodukte in einem Container mischen?',
        a: 'Ja. Handelsmarken-Linien können sich einen Container mit anderen Produkten aus dem Sortiment von GoodBiz Hygiene teilen, vorbehaltlich der Verpackungs- und Verträglichkeitsregeln, die mit dem Angebot bestätigt werden.',
      },
      {
        q: 'Wie lange dauert ein Auftrag mit Handelsmarke?',
        a: '{leadTime}. Bei einem Erstauftrag ist die Zeit für die Freigabe von Mustern und Artwork enthalten; Folgeaufträge gehen meist schneller.',
      },
      {
        q: 'Stellt GoodBiz Hygiene die Produkte selbst her?',
        a: 'Nein. GoodBiz Hygiene ist ein Handelsexporteur aus Indien. Die Produkte werden von geprüften indischen Herstellern gefertigt, und GoodBiz Hygiene betreut Anforderungen, Freigaben, Dokumente und Versand.',
      },
    ],
    quoteH: 'Anforderungen senden.',
    quoteText: 'Senden Sie uns Produkte, Packungen und Markt, die Ihnen vorschweben, in einer Zeile. Wir antworten mit Optionen, Preisen und Lieferzeiten.',
  },

  notFound: {
    title: 'Seite nicht gefunden',
    description: 'Diese Seite wurde nicht gefunden. Entdecken Sie die Seifen und Haushaltspflegeprodukte von GoodBiz Hygiene oder fragen Sie ein Angebot an.',
    l1: 'Diese Seite steht nicht',
    l2: 'im Regal.',
    lead: 'Der Link ist möglicherweise veraltet oder falsch geschrieben. Das gesamte Sortiment ist nur einen Klick entfernt.',
    sprayAlt: 'Illustration einer Sprühreiniger-Flasche',
  },
};

export default de;
