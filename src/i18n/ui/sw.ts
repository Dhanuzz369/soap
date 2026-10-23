/**
 * Swahili UI strings. Source: src/i18n/ui/en.ts. Rules: docs/i18n-translator-guide.md.
 */
import type { UiPartial } from './types.ts';

/** Set by `npm run i18n:stamp`: the English dictionary this file was translated from. */
export const sourceHash = '2d63fbf41757';

const sw: UiPartial = {
  meta: {
    tagline: 'Sabuni na bidhaa za usafi wa nyumbani, zinazosafirishwa nje kutoka India',
  },

  terms: {
    incoterms: 'FOB, CIF na CFR zinapatikana; masharti ya malipo hukubaliwa kwa kila oda (T/T au LC)',
    payment: 'Hukubaliwa kwa kila oda (T/T au LC)',
    port: 'Usafirishaji kutoka bandari kuu za India',
    leadTime: 'Kwa kawaida wiki 3 hadi 5 baada ya oda kuthibitishwa, kulingana na mahitaji ya chapa ya mnunuzi (private label)',
  },

  common: {
    skip: 'Ruka hadi kwenye maudhui',
    home: 'Mwanzo',
    products: 'Bidhaa',
    blog: 'Miongozo',
    breadcrumb: 'Njia ya kurasa',
    requestQuote: 'Omba Nukuu ya Bei',
    viewProducts: 'Tazama Bidhaa',
    exporterLine: 'Msafirishaji Nje na Muuzaji kutoka India',
    hsn: 'HSN',
    hsnTitle: 'Mfumo Uliooanishwa wa Uainishaji wa Bidhaa (Harmonized System of Nomenclature)',
    allProducts: 'Bidhaa zote',
    allGuides: 'Miongozo yote',
    productsCount: 'Bidhaa {n}',
    minRead: 'Dakika {n} za kusoma',
    readFaq: 'Soma Maswali Yanayoulizwa Mara kwa Mara',
    straightAnswers: 'Majibu ya moja kwa moja.',
    buyerFaq: 'Maswali ya Wanunuzi',
    faqDefault: 'Maswali ambayo wanunuzi huuliza',
    exportProcessFull: 'Mchakato wa usafirishaji nje kwa kina',
    renderAlt: 'Mchoro wa {nameLower} katika kifungashio cha kawaida cha usafirishaji nje',
    drawingAlt: 'Mchoro wa {nameLower}',
    photoAlt: '{name} kutoka GoodBiz',
    categoryRenderAlt: 'Mchoro wa vifungashio vya kawaida vya {nameLower}',
    rangeAlt: 'Mchoro wa bidhaa za GoodBiz Hygiene katika vifungashio vya kawaida vya usafirishaji nje',
    portAlt: 'Winchi kubwa za gantry zikipakia meli ya kontena usiku kwenye Kituo cha Kimataifa cha Uhamishaji wa Kontena (International Container Transshipment Terminal) huko Kochi, India',
    portCaption: 'Kituo cha kontena, Kochi. Picha: {creator}, {license}.',
    specCaption: 'Vipimo vya kawaida. Thamani za mwisho huthibitishwa kwa kila oda.',
  },

  header: {
    homeAria: '{name}, ukurasa wa mwanzo',
    menu: 'Menyu',
    mainNav: 'Kuu',
    mainNavMobile: 'Kuu (simu)',
    nav: {
      products: 'Bidhaa',
      privateLabel: 'Chapa ya Mnunuzi',
      exportProcess: 'Mchakato wa Usafirishaji',
      guides: 'Miongozo ya Wanunuzi',
      about: 'Kuhusu Sisi',
      faq: 'Maswali',
    },
  },

  footer: {
    tag: 'Usafi, kutoka India',
    lede: 'Sabuni na bidhaa za usafi wa nyumbani, zinazotoka kwa watengenezaji wa India tuliowakagua na kusafirishwa nje na GoodBiz Hygiene, kampuni ya {parent}.',
    nav: 'Kijachini',
    products: 'Bidhaa',
    company: 'Kampuni',
    contact: 'Mawasiliano',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, kampuni ya {parent}. Msafirishaji nje wa kibiashara kutoka India.',
    backToTop: 'Rudi juu',
  },

  lang: {
    label: 'Lugha',
    menuAria: 'Chagua lugha. Lugha ya sasa: {name}',
    more: 'Lugha nyingine…',
    moreTitle: 'Hufungua ukurasa huu katika Google Translate (tafsiri ya mashine)',
  },

  whatsapp: {
    aria: 'Ongea na GoodBiz Hygiene kupitia WhatsApp',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Ongeza kwenye ombi',
    addAria: 'Ongeza kwenye ombi: {name}',
    noteH: 'Changanya kwenye kontena moja.',
    noteText: 'Changanya bidhaa hizi na bidhaa za makundi mengine katika kontena moja la futi 20 au futi 40. Tunathibitisha mchanganyiko huo wakati wa kutoa nukuu.',
  },

  quote: {
    heading: 'Omba nukuu ya bei.',
    text: 'Tuambie mahitaji yako kwa sentensi moja. Fomu ya ombi hufunguka ikiwa na maelezo hayo, tayari kwa bidhaa, kiasi na bandari yako.',
    placeholder: 'mf. kontena 1×futi 20 la sabuni ya kuosha vyombo, ndimu, 500 ml',
    label: 'Unahitaji nini?',
    submit: 'Anza ombi',
  },

  ld: {
    hsnCode: 'Msimbo wa HSN',
    variants: 'Aina',
    packSizes: 'Ukubwa wa vifungashio',
  },

  home: {
    title: 'Msafirishaji Nje na Muuzaji wa Sabuni na Bidhaa za Usafi wa Nyumbani kutoka India',
    description:
      'GoodBiz Hygiene, kampuni ya GoodBiz Global, husafirisha nje sabuni, sabuni za kufulia na bidhaa za usafi wa nyumbani kutoka kwa watengenezaji wa India tuliowakagua, pamoja na chapa ya mnunuzi na makontena mchanganyiko.',
    eyebrow: 'Sabuni · Sabuni za kufulia · Usafi wa nyumbani',
    h1a: 'Sabuni na Usafi wa Nyumbani',
    h1b: 'Zinasafirishwa kutoka India.',
    text: 'GoodBiz Hygiene ni msafirishaji nje wa kibiashara (merchant exporter): tunanunua sabuni, sabuni za kufulia na visafishaji kutoka kwa watengenezaji wa India tuliowakagua, pamoja na chapa ya mnunuzi na makontena mchanganyiko.',
    rangeH: 'Bidhaa Zetu.',
    rangeIntro: 'Bidhaa tatu kati ya {n}. Kila moja ina ukurasa wake wenye vipimo vya kawaida, ukubwa wa vifungashio na chaguo za chapa ya mnunuzi.',
    rangeAll: 'Tazama bidhaa zote {n}',
    processL1: 'Jinsi oda za',
    processL2: 'usafirishaji nje zinavyofanya kazi.',
    processIntro:
      'Msafirishaji nje mmoja wa kibiashara kati yako na mtengenezaji: nukuu ya bei, sampuli, nyaraka na usafirishaji, tangu ujumbe wa kwanza hadi hati ya shehena (bill of lading).',
    steps: [
      {
        name: 'Vipimo na sampuli',
        text: 'Tutumie bidhaa, ukubwa wa vifungashio, kiasi na bandari ya kuwasili. Tunatoa nukuu ya bei kwa kila kifungashio pamoja na vipimo vya kawaida na muda wa maandalizi, na kupanga sampuli kwa idhini yako.',
      },
      {
        name: 'Upatikanaji wa bidhaa na chapa ya mnunuzi',
        text: 'Tunalinganisha maelezo yako na mtengenezaji wa India tuliyemkagua. Kwa chapa ya mnunuzi, michoro yako ya lebo, harufu na chaguo za vifungashio huidhinishwa kabla ya uzalishaji wa jumla.',
      },
      {
        name: 'Nyaraka na usafirishaji',
        text: 'Mtengenezaji huzalisha na kupakia oda, huku sisi tukiandaa ankara, orodha ya upakiaji, cheti cha asili, COA na MSDS. {port}. {leadTime}.',
      },
    ],
    catsH: 'Makundi ya Bidhaa.',
    catsText: 'Makundi matano chini ya HSN 3401 na 3402. Yachanganye katika kontena moja la futi 20 au futi 40.',
    tileMeta: 'Bidhaa {n} · HSN {hsn}',
    answersMore: 'Majibu zaidi kwenye ukurasa wa Maswali',
    statementA: 'Zinapatikana kwa uangalifu,',
    statementB: 'zinasafirishwa kwa uhakika.',
    statementLead:
      'Kila oda ya GoodBiz Hygiene hulinganishwa na mtengenezaji wa India tuliyemkagua, hukaguliwa dhidi ya sampuli uliyoidhinisha, na husafirishwa na nyaraka kamili za usafirishaji nje. Hivi ndivyo tunavyofanya kazi kwa kila oda, bila kujali ukubwa wake.',
    promises: [
      { title: 'Watengenezaji waliokaguliwa pekee', text: 'Kila bidhaa hutoka kwa mtengenezaji wa India tuliyemkagua kwa ubora, uthabiti na uzoefu wa usafirishaji nje.' },
      { title: 'Sampuli yako, inalingana', text: 'Fomula, harufu na kifungashio ulivyoidhinisha ndivyo vinavyosafirishwa, baada ya kukaguliwa dhidi ya sampuli yako kabla ya kupakia.' },
      { title: 'Nyaraka zilizotimia', text: 'Ankara, orodha ya upakiaji, cheti cha asili, COA na MSDS huandaliwa kwa kila shehena, tayari kwa wakala wako wa forodha.' },
      { title: 'Mshirika mmoja, kutoka bandari hadi bandari', text: 'Nukuu moja na mtu mmoja wa mawasiliano tangu sampuli ya kwanza hadi hati ya shehena (bill of lading), kwa kila bidhaa unayoagiza.' },
    ],
    guidesH: 'Miongozo ya wanunuzi',
    fanTabs: 'Chagua kundi',
    fanShow: 'Onyesha {name}',
    fanView: 'Tazama kundi',
    fanOpen: '{name}: tazama kundi hili',
  },

  productsIndex: {
    title: 'Msafirishaji Nje na Muuzaji wa Sabuni, Sabuni za Kufulia na Bidhaa za Usafi kutoka India',
    description:
      'Tazama bidhaa {n} za sabuni, kufulia, jikoni, visafishaji vya nyuso na malighafi kutoka kwa watengenezaji wa India tuliowakagua, zikiwa na misimbo ya HSN na chaguo za chapa ya mnunuzi.',
    hsnLink: 'Misimbo ya HSN kwa kila bidhaa',
    rangeFull: 'Bidhaa zote kwa kina',
    hsnH: 'Ni msimbo gani wa HSN unaotumika kwa kila bidhaa?',
    hsnText:
      'Misimbo huonyeshwa kwa tarakimu 6. Msimbo wa ITC-HS wa tarakimu 8 huthibitishwa kwa kila oda, na bidhaa chache zina uainishaji mbadala (tazama ukurasa wa kila bidhaa).',
    hsnCaption: 'Muhtasari wa HSN kwa kila bidhaa, kwa makundi',
    colProduct: 'Bidhaa',
    colRange: 'Kundi',
    colHsn: 'HSN (tarakimu 6)',
    h1a: 'Kila bidhaa,',
    h1b: 'mshirika mmoja wa mauzo nje.',
    shelfLead: 'Bidhaa {n} katika makundi {r}, chini ya HSN 3401 na 3402, pamoja na chapa ya mnunuzi na makontena mchanganyiko.',
    shelfAria: 'Rafu ya bidhaa',
    jumpNav: 'Nenda kwenye kundi',
    shelfPause: 'Simamisha rafu',
  },

  product: {
    hsnAlt: 'Uainishaji mbadala umeelezwa hapa chini',
    hsnConfirmed: 'Msimbo wa ITC-HS wa tarakimu 8 huthibitishwa kwa kila oda',
    factsH: 'Mambo muhimu kwa wanunuzi',
    hsnCode: 'Msimbo wa HSN',
    hsnNoteDefault: 'Msimbo wa ITC-HS wa tarakimu 8 huthibitishwa kwa kila oda.',
    moq: 'Kiwango cha chini cha oda (MOQ)',
    privateLabel: 'Chapa ya mnunuzi',
    plAvailable: 'Inapatikana.',
    plNot: 'Haitolewi kwa bidhaa hii.',
    varH: 'Aina, ukubwa wa vifungashio na ufungashaji',
    variants: 'Aina zinazopatikana',
    variantsAria: 'Aina',
    packSizes: 'Ukubwa wa vifungashio',
    packaging: 'Chaguo za ufungashaji',
    galleryH: 'Harufu zaidi, kwenye picha',
    specH: 'Vipimo vya kawaida ni vipi?',
    specNote: '{name}: thamani za kawaida kwa daraja za usafirishaji nje. Thamani za mwisho huthibitishwa na mtengenezaji kwa kila oda.',
    aboutAria: 'Kuhusu {name}',
    loadH: 'Upakiaji wa kontena (takriban)',
    loadText: 'Takwimu za makadirio; mpango wa mwisho wa upakiaji huthibitishwa kwa kila oda.',
    ft20: 'Kontena la futi 20',
    ft40: 'Kontena la futi 40',
    guidesH: 'Miongozo ya wanunuzi kuhusu bidhaa hii',
    relatedH: 'Bidhaa zinazohusiana',
    relatedAll: '{nameLower} zote',
    quoteH: 'Omba nukuu ya bidhaa hii.',
    quoteText: 'Tuambie aina ya {nameLower}, ukubwa wa kifungashio, kiasi na bandari ya kuwasili kwa sentensi moja. Fomu ya ombi hufunguka ikiwa na maelezo hayo.',
  },

  category: {
    title: '{name}: Msafirishaji Nje na Muuzaji kutoka India',
    hsnMeta: 'Bidhaa {n} · Msimbo wa ITC-HS wa tarakimu 8 huthibitishwa kwa kila oda',
    seeProducts: 'Tazama bidhaa {n}',
    productsH: 'Tunatoa bidhaa gani za {nameLower}?',
    quoteH: 'Omba nukuu ya {nameLower}.',
  },

  blogIndex: {
    title: 'Miongozo ya Usafirishaji Nje kwa Wanunuzi wa Sabuni na Bidhaa za Usafi',
    description:
      'Miongozo ya vitendo kwa waagizaji wa sabuni, sabuni za kufulia na bidhaa za usafi wa nyumbani kutoka India: misimbo ya HSN, MOQ, nyaraka, chapa ya mnunuzi na usafirishaji.',
    l1: 'Miongozo ya wanunuzi.',
    l2: 'Kwa kuagiza sabuni na bidhaa za usafi wa nyumbani.',
    lead: 'Maelezo rahisi kwa waagizaji na wasambazaji: uainishaji, gharama, nyaraka na uchaguzi wa bidhaa.',
    latest: 'Makala za hivi karibuni',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Majibu ya haraka',
    relatedH: 'Bidhaa zilizotajwa katika mwongozo huu',
    quoteH: 'Unapanga oda?',
    quoteText: 'Tuambie unachohitaji kwa sentensi moja. Fomu ya ombi hufunguka ikiwa na maelezo hayo, tayari kwa bidhaa, kiasi na bandari yako.',
  },

  contact: {
    title: 'Omba Nukuu ya Bei: Msafirishaji Nje na Muuzaji wa Sabuni na Bidhaa za Usafi kutoka India',
    description:
      'Omba nukuu ya bei kutoka GoodBiz Hygiene kwa sabuni, sabuni za kufulia na bidhaa za usafi wa nyumbani kutoka India. Tuma bidhaa, ukubwa wa vifungashio na bandari yako kwa barua pepe au WhatsApp.',
    l1: 'Omba nukuu ya bei.',
    l2: 'Kutoka India, hadi bandari yako.',
    lead: 'Tuambie unachohitaji: bidhaa, ukubwa wa vifungashio, kiasi na bandari ya kuwasili. GoodBiz Hygiene hujibu kwa bei, vipimo vya kawaida na muda wa maandalizi.',
    start: 'Anza ombi',
    waMessage: 'Tutumie ujumbe kwenye WhatsApp',
    formH: 'Fomu ya ombi',
    asideAria: 'Njia nyingine za kuwasiliana nasi',
    email: 'Barua pepe',
    whatsapp: 'WhatsApp',
    phone: 'Simu',
    office: 'Ofisi',
    terms: 'Masharti ya usafirishaji nje',
    oftenH: 'Mara nyingi huombewa nukuu pamoja',
    oftenText: 'Gusa “Ongeza kwenye ombi” kwenye kadi ili kuchagua bidhaa hiyo kwenye fomu iliyo hapo juu.',
  },

  form: {
    name: 'Jina lako',
    company: 'Kampuni',
    country: 'Nchi',
    email: 'Barua pepe',
    phone: 'WhatsApp au simu',
    phoneHint: '(pamoja na msimbo wa nchi)',
    quantity: 'Kiasi',
    choose: 'Chagua kimoja',
    quantities: [
      'Sampuli au kiasi cha majaribio',
      'Sehemu ya kontena mchanganyiko',
      'Kontena 1 la futi 20',
      'Kontena 1 la futi 40',
      'Makontena kadhaa au usambazaji wa kawaida',
      'Sina uhakika bado',
    ],
    productsLegend: 'Bidhaa unazopendezwa nazo',
    chooseAny: '(chagua yoyote)',
    plLegend: 'Je, unahitaji chapa ya mnunuzi?',
    plYes: 'Ndiyo, chini ya chapa yangu',
    plNo: 'Hapana',
    message: 'Ujumbe',
    messageHint: '(ukubwa wa vifungashio, harufu, bandari ya kuwasili)',
    submit: 'Tuma ombi',
    hint: 'Hii hufungua programu yako ya barua pepe ikiwa na ombi limejazwa. Unapendelea WhatsApp?',
    hintLink: 'Tutumie ujumbe kwenye WhatsApp',
    hintJs: 'Kisha, chagua kulituma kupitia WhatsApp au barua pepe.',
    sendH: 'Ombi lako liko tayari. Ungependa kulituma kwa njia gani?',
    sendWa: 'Tuma kupitia WhatsApp',
    sendEmail: 'Tuma kupitia Barua pepe',
    sendNote: 'Kila njia hufungua programu yako mwenyewe ikiwa na ujumbe umeandikwa, ili uweze kuukagua kabla ya kutuma.',
  },

  about: {
    title: 'Kuhusu GoodBiz Hygiene: Msafirishaji Nje na Muuzaji wa Sabuni na Bidhaa za Usafi kutoka India',
    description:
      'GoodBiz Hygiene ni kitengo cha usafirishaji nje cha bidhaa za usafi wa nyumbani cha GoodBiz Global, msafirishaji nje wa kibiashara kutoka India, na chapa dada ya GoodBiz Agro.',
    l1: 'GoodBiz Hygiene.',
    l2: 'Kampuni ya {parent}.',
    lead: 'GoodBiz Hygiene ni kitengo cha usafirishaji nje cha bidhaa za usafi wa nyumbani cha {parent}, msafirishaji nje wa kibiashara kutoka India, na chapa dada ya GoodBiz Agro.',
    whatH: 'GoodBiz Hygiene hufanya nini?',
    what1:
      'GoodBiz Hygiene hutoa sabuni, sabuni za kufulia na bidhaa za usafi wa nyumbani kwa waagizaji, wasambazaji, wauzaji wa jumla, minyororo ya maduka makubwa na chapa za private label nje ya India. Haimiliki kiwanda. Bidhaa hupatikana kutoka kwa watengenezaji wa India tuliowakagua, na GoodBiz Hygiene husimamia nukuu ya bei, uratibu wa chapa ya mnunuzi, nyaraka za usafirishaji nje na usafirishaji.',
    what2:
      'Bidhaa zinajumuisha zile zilizoainishwa chini ya HSN 3401 (sabuni) na HSN 3402 (sabuni za kufulia na maandalizi ya kuosha au kusafisha), pamoja na bidhaa zinazohusiana kwa karibu kama fenoli ya mitishamba, katika makundi matano.',
    rangesH: 'Makundi matano',
    familyH: 'Sehemu ya {parent}',
    familyText: '{parent} huendesha GoodBiz Agro kwa usafirishaji nje wa bidhaa za kilimo na GoodBiz Hygiene kwa sabuni na usafi wa nyumbani.',
    visit: 'Tembelea',
    basedIn: 'Makao yake',
    founded: 'Ilianzishwa',
    iec: 'Msimbo wa Mwagizaji na Msafirishaji Nje (IEC)',
  },

  faqPage: {
    title: 'Maswali: Msafirishaji Nje na Muuzaji wa Sabuni na Bidhaa za Usafi kutoka India',
    description:
      'Majibu kwa waagizaji wanaonunua sabuni, sabuni za kufulia na visafishaji kutoka India kupitia GoodBiz Hygiene: upatikanaji, chapa ya mnunuzi, MOQ, incoterms, nyaraka na muda wa maandalizi.',
    l1: 'Maswali ya wanunuzi.',
    l2: 'Majibu ya moja kwa moja.',
    lead: 'Jinsi GoodBiz Hygiene inavyopata, kutoa nukuu na kusafirisha sabuni na bidhaa za usafi wa nyumbani kutoka India. Maswali kuhusu bidhaa mahususi hujibiwa kwenye ukurasa wa kila bidhaa.',
    quoteH: 'Bado una swali?',
    quoteText: 'Litume pamoja na ombi lako kwa sentensi moja. Tunajibu kwa maelezo ya bidhaa na soko lako.',
  },

  faqs: [
    {
      heading: 'Upatikanaji na bidhaa',
      faqs: [
        {
          q: 'Je, GoodBiz Hygiene hutengeneza bidhaa inazosafirisha nje?',
          a: 'Hapana. GoodBiz Hygiene ni msafirishaji nje wa kibiashara kutoka India na kampuni ya GoodBiz Global. Hupata sabuni, sabuni za kufulia na bidhaa za usafi wa nyumbani kutoka kwa watengenezaji wa India tuliowakagua, kisha husimamia nukuu ya bei, uratibu wa chapa ya mnunuzi, nyaraka na usafirishaji kwa wanunuzi wa ng’ambo.',
        },
        {
          q: 'GoodBiz Hygiene hutoa bidhaa gani?',
          a: 'Makundi matano: sabuni za kuogea na za mwili, bidhaa za kufulia, bidhaa za jikoni, visafishaji vya nyuso na nyumbani, na malighafi za viwandani kama soap noodles, LABSA na SLES. Kila bidhaa ina ukurasa wake wenye vipimo vya kawaida, ukubwa wa vifungashio na msimbo wake wa HSN.',
        },
        {
          q: 'Ni misimbo gani ya HSN inayotumika kwa sabuni na bidhaa za kusafisha?',
          a: 'Sabuni huangukia chini ya HSN 3401, na sabuni za kufulia na maandalizi ya kuosha au kusafisha chini ya HSN 3402. Tovuti inaonyesha misimbo kwa tarakimu 6, kwa mfano 3402 50. Msimbo wa ITC-HS wa tarakimu 8 huthibitishwa kwa kila oda, na bidhaa chache, kama laini ya nguo na fenoli ya mitishamba, zinaweza kuainishwa tofauti.',
        },
        {
          q: 'Je, vipimo vilivyo kwenye kurasa za bidhaa ni vya mwisho?',
          a: 'Hapana. Vipimo ni thamani za kawaida kwa daraja za usafirishaji nje. Thamani za mwisho, kama kiasi cha viambato hai (active matter), TFM au pH, huthibitishwa na mtengenezaji kwa kila oda na kuandikwa kwenye nukuu ya bei.',
        },
      ],
    },
    {
      heading: 'Kuagiza na chapa ya mnunuzi',
      faqs: [
        {
          q: 'Je, ninaweza kuagiza bidhaa chini ya chapa yangu mwenyewe?',
          a: 'Ndiyo. Chapa ya mnunuzi (private label) inapatikana kwa bidhaa nyingi: michoro ya lebo yako, chaguo la harufu na rangi pale fomula inaporuhusu, na ukubwa wa vifungashio ambao soko lako linahitaji. Kiwango cha chini cha oda hutegemea bidhaa na kifungashio, na huorodheshwa kama cha kawaida kwenye ukurasa wa kila bidhaa.',
        },
        {
          q: 'Je, ninaweza kuchanganya bidhaa tofauti kwenye kontena moja?',
          a: 'Ndiyo. Unaweza kuunganisha bidhaa kutoka makundi kadhaa katika kontena moja la futi 20 au futi 40, jambo linalokuwezesha kujaribu kundi la bidhaa bila kujaza kontena kwa kila bidhaa. Mchanganyiko huthibitishwa kwa kuzingatia kanuni za ufungashaji na utangamano wakati wa kutoa nukuu.',
        },
        {
          q: 'Je, naweza kupata sampuli kabla ya kuagiza?',
          a: 'Ndiyo. Sampuli zinaweza kupangwa kwa bidhaa nyingi kabla ya kuthibitisha oda. Tuambie bidhaa na maelezo ya mjumbe wako (courier) kwenye ombi lako, nasi tutathibitisha kile kinachoweza kutumwa.',
        },
        {
          q: 'Ninawezaje kuomba nukuu ya bei?',
          a: 'Tumia fomu ya ombi kwenye ukurasa wa mawasiliano, au tuma ujumbe wa WhatsApp au barua pepe pamoja na bidhaa, ukubwa wa vifungashio, kiasi na bandari ya kuwasili. Tunajibu kwa bei, vipimo vya kawaida na muda wa maandalizi.',
        },
      ],
    },
    {
      heading: 'Usafirishaji, malipo na nyaraka',
      faqs: [
        { q: 'Mnatoa incoterms na masharti gani ya malipo?', a: '{incoterms}.' },
        { q: 'Oda huchukua muda gani kusafirishwa?', a: '{leadTime}. {port}.' },
        {
          q: 'Ni nyaraka gani za usafirishaji nje huambatana na shehena?',
          a: 'Shehena kwa kawaida husafirishwa na ankara ya kibiashara, orodha ya upakiaji, cheti cha asili na hati ya shehena (bill of lading), pamoja na nyaraka za bidhaa kama cheti cha uchambuzi (COA) na karatasi ya data za usalama wa nyenzo (MSDS). Seti kamili hutegemea nchi yako na huthibitishwa kwa kila oda.',
        },
        {
          q: 'Je, mnasafirisha hadi nchi yangu?',
          a: 'GoodBiz Hygiene hutoa nukuu kwa waagizaji, wasambazaji na chapa za private label katika nchi nyingi. Kanuni za nchi ya kuwasili, kama lugha ya lebo au usajili, hukaguliwa nawe kabla ya oda kuthibitishwa.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'Mchakato wa Usafirishaji Nje: Msafirishaji Nje na Muuzaji wa Sabuni na Bidhaa za Usafi kutoka India',
    description:
      'Jinsi GoodBiz Hygiene inavyosafirisha nje sabuni, sabuni za kufulia na visafishaji kutoka India: nukuu ya bei, sampuli, incoterms, masharti ya malipo, nyaraka, bandari na muda wa kawaida wa maandalizi.',
    lead: 'Hatua, masharti na nyaraka za kununua sabuni na bidhaa za usafi wa nyumbani kutoka India kupitia GoodBiz Hygiene.',
    route: {
      h1a: 'Kutoka bandari za India,',
      h1b: 'hadi bandari yako.',
      regionsLabel: 'Chagua eneo la kufikia',
      regions: {
        gulf: 'Ghuba na Mashariki ya Kati',
        eastAfrica: 'Afrika Mashariki',
        westAfrica: 'Afrika Magharibi',
        europe: 'Ulaya',
        southeastAsia: 'Kusini-Mashariki mwa Asia',
        latinAmerica: 'Amerika ya Kusini',
      },
      ports: {
        nhavaSheva: 'Nhava Sheva (Mumbai)',
        mundra: 'Mundra',
        chennai: 'Chennai',
        jebelAli: 'Jebel Ali',
        mombasa: 'Mombasa',
        lagos: 'Lagos',
        tema: 'Tema',
        rotterdam: 'Rotterdam',
        singapore: 'Singapore',
        jakarta: 'Jakarta',
        santos: 'Santos',
      },
      lane: '{from} → {to}',
      laneAll: 'Bandari za India → bandari yako',
      terms: 'FOB, CIF au CFR · {leadTime}',
      illustrative: 'Njia ni za mfano tu.',
      credit: 'Data ya ramani: Natural Earth (kikoa cha umma)',
      mapAlt: 'Ramani ya njia za baharini za mfano kutoka Nhava Sheva, Mundra na Chennai hadi bandari katika maeneo sita',
      pause: 'Sitisha onyesho la njia',
      timelineAria: 'Kutoka oda hadi kusafiri',
      timeline: ['Oda imethibitishwa', 'Uzalishaji na ufungashaji', 'Nyaraka', 'Upakiaji na kusafiri'],
    },
    stepsLink: 'Hatua sita',
    termsH: 'Masharti ya usafirishaji nje ni yapi?',
    termsIncoterms: 'Incoterms na malipo',
    termsPort: 'Bandari',
    termsLead: 'Muda wa maandalizi',
    processL1: 'Hatua zipi zipo',
    processL2: 'kutoka ombi hadi usafirishaji?',
    processIntro: 'Hatua sita, ukiidhinisha nukuu ya bei, sampuli na ankara ya awali (proforma invoice) kabla ya chochote kuzalishwa.',
    steps: [
      { name: 'Ombi', text: 'Tuma bidhaa, ukubwa wa vifungashio, kiasi, bandari ya kuwasili na mahitaji yoyote ya chapa ya mnunuzi, kwa kutumia fomu ya ombi, barua pepe au WhatsApp.' },
      { name: 'Nukuu ya bei', text: 'Tunatoa bei kwa kila kifungashio pamoja na vipimo vya kawaida, incoterm unayohitaji na muda wa maandalizi. {incoterms}.' },
      { name: 'Sampuli na idhini', text: 'Sampuli za bidhaa na, kwa chapa ya mnunuzi, michoro ya majaribio ya lebo huidhinishwa kabla ya oda kuthibitishwa.' },
      { name: 'Ankara ya awali na malipo', text: 'Ankara ya awali (proforma invoice) huthibitisha bidhaa, kiasi, ufungashaji, incoterm na masharti ya malipo (T/T au LC).' },
      { name: 'Uzalishaji na ufungashaji', text: 'Mtengenezaji huzalisha na kufungasha oda, ikiwa na alama za usafirishaji nje na za soko lako.' },
      { name: 'Nyaraka na usafirishaji', text: 'Tunaandaa nyaraka za usafirishaji nje na kupanga usafirishaji wa shehena. {port}.' },
    ],
    docsH: 'Ni nyaraka gani huambatana na shehena?',
    docsText: 'Seti kamili hutegemea nchi yako na huthibitishwa kwa kila oda.',
    documents: [
      'Ankara ya kibiashara',
      'Orodha ya upakiaji',
      'Cheti cha asili',
      'Hati ya shehena (bill of lading) kwa usafirishaji wa baharini',
      'Cheti cha uchambuzi (COA)',
      'Karatasi ya data za usalama wa nyenzo (MSDS)',
    ],
    faqH: 'Mchakato wa usafirishaji nje: maswali ya wanunuzi',
    faqs: [
      { q: 'Mnatoa incoterms zipi?', a: '{incoterms}.' },
      { q: 'Shehena huondoka kutoka bandari gani?', a: '{port}. Bandari huchaguliwa kulingana na bidhaa, eneo la mtengenezaji na mahali unapopeleka, na huandikwa kwenye nukuu ya bei.' },
      { q: 'Muda wa maandalizi ni upi?', a: '{leadTime}.' },
      {
        q: 'Ni nyaraka zipi zinajumuishwa?',
        a: 'Shehena kwa kawaida husafirishwa na ankara ya kibiashara, orodha ya upakiaji, cheti cha asili, hati ya shehena (bill of lading) kwa usafirishaji wa baharini, pamoja na COA na MSDS pale bidhaa inapozihitaji. Nchi yako inaweza kuhitaji zaidi, kama cheti cha afya au ankara iliyothibitishwa kisheria; hili hukubaliwa kwa kila oda.',
      },
      {
        q: 'Ni msimbo gani wa HSN unaowekwa kwenye ankara?',
        a: 'Tovuti inaonyesha misimbo ya HSN kwa tarakimu 6, kwa mfano 3402 50. Msimbo wa ITC-HS wa tarakimu 8 huthibitishwa kwa kila oda. Laini ya nguo na fenoli ya mitishamba zinaweza kuangukia chini ya uainishaji mbadala (3809 91 na 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Sabuni na Bidhaa za Usafi kwa Chapa ya Mnunuzi: Msafirishaji Nje na Muuzaji kutoka India',
    description:
      'Sabuni, sabuni za kufulia na visafishaji kwa chapa ya mnunuzi kutoka India: michoro yako, harufu, rangi na ukubwa wa vifungashio, vinavyotengenezwa na watengenezaji wa India tuliowakagua na kusafirishwa nje na GoodBiz Hygiene.',
    lead: 'Uza sabuni, sabuni za kufulia na visafishaji chini ya chapa yako mwenyewe. GoodBiz Hygiene hulinganisha maelezo yako na mtengenezaji wa India tuliyemkagua, husimamia sampuli na michoro, na husafirisha bidhaa zilizokamilika hadi bandari yako.',
    hero: {
      h1a: 'Chapa yako,',
      h1b: 'inapatikana na kusafirishwa kutoka India.',
      cta: 'Anza ombi la chapa ya mnunuzi',
      placeholder: 'Chapa Yako',
      inputLabel: 'Andika jina la chapa yako',
      colourLegend: 'Rangi ya lebo',
      colourways: { sage: 'Kijani', ocean: 'Bahari', blush: 'Waridi' },
      packAlt: 'Mchoro wa chupa ya pampu na boksi la karatasi linalokunjwa, lenye lebo tupu inayoonyesha jina la chapa',
      caption: 'Mchoro wa kifungashio cha kawaida cha chapa ya mnunuzi.',
      message: 'Ombi la chapa ya mnunuzi: tungependa kuuza chini ya chapa yetu “{brand}”.',
      messageNoBrand: 'Ombi la chapa ya mnunuzi: tungependa kuuza chini ya chapa yetu wenyewe.',
      stepsAria: 'Oda ya chapa ya mnunuzi kwa hatua nne',
      steps: ['Maelezo', 'Rasimu ya muundo', 'Sampuli imeidhinishwa', 'Imesafirishwa'],
    },
    optionsH: 'Nini kinaweza kubadilishwa?',
    optionsText: 'Chaguo nne hufanya bidhaa kuwa zako. Kila moja huidhinishwa nawe kabla ya uzalishaji wa jumla.',
    options: [
      {
        title: 'Chapa yako kwenye kifungashio',
        text: 'Lebo, kifuniko, katoni au kanga iliyochapishwa kwa michoro yako. Tunatuma faili zako kwa mtengenezaji na kukurudishia mfano wa majaribio kwa idhini kabla ya kuchapisha.',
      },
      {
        title: 'Harufu na rangi',
        text: 'Chagua kutoka kwa harufu na rangi ambazo kila bidhaa hutengenezwa nazo kwa kawaida, kama ndimu, lavenda, waridi au mwarobaini. Mabadiliko nje ya kundi la kawaida hukaguliwa kwanza na mtengenezaji.',
      },
      {
        title: 'Ukubwa na aina za vifungashio',
        text: 'Chupa za rejareja, vifungashio vya kujazia upya, mifuko, vipande vya sabuni na makopo au mapipa ya jumla, vilivyochaguliwa kulingana na rafu yako na kiwango chako cha bei. Ukurasa wa kila bidhaa huorodhesha ukubwa wake wa kawaida wa vifungashio.',
      },
      {
        title: 'Daraja na vipimo',
        text: 'Chagua daraja ambalo soko lako linatarajia, kwa mfano TFM kwa sabuni ya kuogea au viambato hai (active matter) kwa sabuni za kufulia. Thamani za kawaida huonyeshwa kwenye kurasa za bidhaa na thamani za mwisho huandikwa kwenye nukuu yako ya bei.',
      },
    ],
    processL1: 'Jinsi oda ya chapa ya mnunuzi',
    processL2: 'inavyoendeshwa.',
    processIntro: 'Hatua tano kutoka maelezo yako hadi bidhaa kufika bandarini kwako, ukiidhinisha sampuli na michoro kabla ya chochote kutengenezwa.',
    steps: [
      { name: 'Shiriki maelezo yako', text: 'Bidhaa, ukubwa wa vifungashio, harufu, soko lengwa na makadirio ya kiasi.' },
      { name: 'Nukuu ya bei na kulinganisha mtengenezaji', text: 'Tunalinganisha maelezo yako na mtengenezaji wa India tuliyemkagua na kutoa bei kwa kila kifungashio, pamoja na incoterms na muda wa maandalizi.' },
      { name: 'Sampuli na michoro', text: 'Unaidhinisha sampuli ya bidhaa na mfano uliochapishwa wa michoro yako. Uzalishaji kwa kawaida huanza baada ya kuidhinisha vyote viwili.' },
      { name: 'Uzalishaji na ufungashaji', text: 'Mtengenezaji huzalisha na kufungasha oda yako chini ya chapa yako, ikiwa na alama za usafirishaji nje.' },
      { name: 'Nyaraka na usafirishaji', text: 'Tunaandaa nyaraka za usafirishaji nje na kupanga usafirishaji wa shehena. {port}.' },
    ],
    faqH: 'Chapa ya mnunuzi: maswali ya wanunuzi',
    faqs: [
      {
        q: 'Kiwango cha chini cha oda kwa chapa ya mnunuzi ni kipi?',
        a: 'Hutegemea bidhaa na kifungashio. Hakuna kiwango cha chini kilichowekwa kwa bidhaa nyingi, ingawa muundo wa chapa ya mnunuzi unaweza kuwa na kiwango chake cha chini kwa lebo au katoni zilizochapishwa. Tuambie kiasi chako nasi tutatoa nukuu.',
      },
      {
        q: 'Nani anamiliki michoro na chapa?',
        a: 'Michoro hubaki yako; masharti ya matumizi hukubaliwa kwa kila oda. GoodBiz Hygiene huratibu uchapishaji na mtengenezaji.',
      },
      {
        q: 'Je, ninaweza kuchanganya bidhaa za chapa ya mnunuzi na bidhaa za kawaida kwenye kontena moja?',
        a: 'Ndiyo. Bidhaa za chapa ya mnunuzi zinaweza kushiriki kontena na bidhaa nyingine za GoodBiz Hygiene, kwa kuzingatia kanuni za ufungashaji na utangamano zinazothibitishwa wakati wa nukuu.',
      },
      {
        q: 'Oda ya chapa ya mnunuzi huchukua muda gani?',
        a: '{leadTime}. Oda ya kwanza inajumuisha muda wa kuidhinisha sampuli na michoro; oda zinazofuata kwa kawaida huwa za haraka zaidi.',
      },
      {
        q: 'Je, GoodBiz Hygiene hutengeneza bidhaa hizo?',
        a: 'Hapana. GoodBiz Hygiene ni msafirishaji nje wa kibiashara kutoka India. Bidhaa hutengenezwa na watengenezaji wa India tuliowakagua, na GoodBiz Hygiene husimamia maelezo, idhini, nyaraka na usafirishaji.',
      },
    ],
    quoteH: 'Anza maelezo yako.',
    quoteText: 'Tuma bidhaa, vifungashio na soko unalolenga kwa sentensi moja. Tunajibu kwa chaguo, bei na muda wa maandalizi.',
  },

  notFound: {
    title: 'Ukurasa haujapatikana',
    description: 'Ukurasa huu haukupatikana. Tazama sabuni na bidhaa za usafi wa nyumbani za GoodBiz Hygiene au omba nukuu ya bei.',
    l1: 'Ukurasa huu haupo',
    l2: 'kwenye rafu.',
    lead: 'Kiungo kinaweza kuwa cha zamani au kimeandikwa vibaya. Bidhaa zote ziko mbofyo mmoja tu.',
    sprayAlt: 'Mchoro wa chupa ya kisafishaji cha kupulizia',
  },
};

export default sw;
