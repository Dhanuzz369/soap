/**
 * Turkish UI strings. Source: src/i18n/ui/en.ts. Rules: docs/i18n-translator-guide.md.
 * Formal business Turkish ("siz").
 */
import type { UiPartial } from './types.ts';

/** Set by `npm run i18n:stamp`: the English dictionary this file was translated from. */
export const sourceHash = '2d63fbf41757';

const tr: UiPartial = {
  meta: {
    tagline: 'Sabun ve ev bakım ürünleri, Hindistan’dan ihracat',
  },

  terms: {
    incoterms: 'FOB, CIF ve CFR mevcuttur; ödeme koşulları sipariş başına kararlaştırılır (T/T veya LC)',
    payment: 'Sipariş başına kararlaştırılır (T/T veya LC)',
    port: 'Başlıca Hindistan limanlarından sevkiyat',
    leadTime: 'Sipariş onayından sonra genellikle 3-5 hafta, özel marka gereksinimlerine bağlı olarak',
  },

  common: {
    skip: 'İçeriğe geç',
    home: 'Ana sayfa',
    products: 'Ürünler',
    blog: 'Rehberler',
    breadcrumb: 'Sayfa yolu',
    requestQuote: 'Teklif İsteyin',
    viewProducts: 'Ürünleri Görüntüleyin',
    exporterLine: 'Hindistan’dan İhracatçı ve Tedarikçi',
    hsn: 'HSN',
    hsnTitle: 'Armonize Mal Tanımlama ve Kodlama Sistemi',
    allProducts: 'Tüm ürünler',
    allGuides: 'Tüm rehberler',
    productsCount: '{n} ürün',
    minRead: '{n} dk okuma',
    readFaq: 'SSS’yi okuyun',
    straightAnswers: 'Net cevaplar.',
    buyerFaq: 'Alıcı SSS',
    faqDefault: 'Alıcıların sorduğu sorular',
    exportProcessFull: 'İhracat süreci ayrıntılarıyla',
    renderAlt: 'Tipik bir ihracat ambalajında {nameLower} görseli',
    drawingAlt: '{nameLower} çizimi',
    photoAlt: '{name}, GoodBiz ürünü',
    categoryRenderAlt: 'Tipik {nameLower} ambalajlarının görseli',
    rangeAlt: 'GoodBiz Hygiene ürün gamının tipik ihracat ambalajlarındaki görseli',
    portAlt: 'Hindistan’ın Kochi kentindeki Uluslararası Konteyner Aktarma Terminali’nde geceleyin bir konteyner gemisini yükleyen portal vinçler',
    portCaption: 'Kochi konteyner terminali. Fotoğraf: {creator}, {license}.',
    specCaption: 'Tipik özellikler. Nihai değerler sipariş başına teyit edilir.',
  },

  header: {
    homeAria: '{name}, ana sayfa',
    menu: 'Menü',
    mainNav: 'Ana menü',
    mainNavMobile: 'Ana menü (mobil)',
    nav: {
      products: 'Ürünler',
      privateLabel: 'Özel Marka',
      exportProcess: 'İhracat Süreci',
      guides: 'Alıcı Rehberleri',
      about: 'Hakkımızda',
      faq: 'SSS',
    },
  },

  footer: {
    tag: 'Hindistan’dan temizlik',
    lede: 'Kontrol ettiğimiz Hindistanlı üreticilerden tedarik edilen sabun ve ev bakım ürünleri; bir {parent} şirketi olan GoodBiz Hygiene tarafından ihraç edilir.',
    nav: 'Alt bilgi',
    products: 'Ürünler',
    company: 'Şirket',
    contact: 'İletişim',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, bir {parent} şirketi. Hindistan’dan ticari ihracatçı.',
    backToTop: 'Başa dön',
  },

  lang: {
    label: 'Dil',
    menuAria: 'Dil seçin. Geçerli dil: {name}',
    more: 'Diğer diller…',
    moreTitle: 'Bu sayfayı Google Çeviri’de açar (makine çevirisi)',
  },

  whatsapp: {
    aria: 'GoodBiz Hygiene ile WhatsApp’tan yazışın',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Talebe ekle',
    addAria: 'Talebe ekle: {name}',
    noteH: 'Tek konteynerde karıştırın.',
    noteText: 'Bunları diğer ürün gruplarındaki ürünlerle tek bir 20 ft veya 40 ft konteynerde birleştirebilirsiniz. Karışımı teklif verirken teyit ederiz.',
  },

  quote: {
    heading: 'Teklif isteyin.',
    text: 'İhtiyacınızı tek satırda yazın. Talep formu, ürünlerinizi, miktarınızı ve limanınızı eklemeniz için bu bilgiyle dolu olarak açılır.',
    placeholder: 'ör. 1×20 ft bulaşık deterjanı, limon, 500 ml',
    label: 'Neye ihtiyacınız var?',
    submit: 'Talebi başlatın',
  },

  ld: {
    hsnCode: 'HSN Kodu',
    variants: 'Çeşitler',
    packSizes: 'Ambalaj boyutları',
  },

  home: {
    title: 'Sabun ve Ev Bakım Ürünleri İhracatçısı ve Tedarikçisi, Hindistan',
    description:
      'Bir GoodBiz Global şirketi olan GoodBiz Hygiene, kontrol edilmiş Hindistanlı üreticilerden sabun, deterjan ve ev bakım ürünleri ihraç eder; özel marka ve karışık konteyner sunar.',
    eyebrow: 'Sabun · Deterjan · Ev bakımı',
    h1a: 'Sabun ve Ev Bakımı',
    h1b: 'Hindistan’dan ihracat.',
    text: 'GoodBiz Hygiene bir ticari ihracatçıdır: sabun, deterjan ve temizlik ürünlerini kontrol ettiğimiz Hindistanlı üreticilerden tedarik eder; özel marka ve karışık konteyner sunarız.',
    rangeH: 'Ürün gamı.',
    rangeIntro: '{n} ürünün üçü. Her ürünün kendi sayfasında tipik özellikler, ambalaj boyutları ve özel marka seçenekleri yer alır.',
    rangeAll: '{n} ürünün tamamını görüntüleyin',
    processL1: 'İhracat siparişleri',
    processL2: 'nasıl yürür?',
    processIntro:
      'Sizinle üretici arasında tek bir ticari ihracatçı: teklif, numuneler, evraklar ve sevkiyat; ilk mesajdan konşimentoya kadar.',
    steps: [
      {
        name: 'Şartname ve numuneler',
        text: 'Ürünleri, ambalaj boyutlarını, miktarı ve varış limanını bize iletin. Tipik özellikler ve teslim süreleriyle birlikte ambalaj başına fiyat teklif eder, onayınız için numune temin ederiz.',
      },
      {
        name: 'Tedarik ve özel marka',
        text: 'Talebinizi kontrol edilmiş bir Hindistanlı üreticiyle eşleştiririz. Özel markada, toplu üretimden önce tasarımınız, kokunuz ve ambalaj tercihleriniz onaylanır.',
      },
      {
        name: 'Evraklar ve sevkiyat',
        text: 'Üretici siparişi üretip paketlerken biz fatura, çeki listesi, menşe şahadetnamesi, COA ve MSDS belgelerini hazırlarız. {port}. {leadTime}.',
      },
    ],
    catsH: 'Kategoriler.',
    catsText: 'HSN 3401 ve 3402 kapsamında beş ürün grubu. Hepsini tek bir 20 ft veya 40 ft konteynerde birleştirebilirsiniz.',
    tileMeta: '{n} ürün · HSN {hsn}',
    answersMore: 'Daha fazla cevap SSS sayfasında',
    statementA: 'Özenle tedarik edilir,',
    statementB: 'güvenle sevk edilir.',
    statementLead:
      'Her GoodBiz Hygiene siparişi kontrol edilmiş bir Hindistanlı üreticiyle eşleştirilir, onayladığınız numuneye göre kontrol edilir ve eksiksiz ihracat evraklarıyla sevk edilir. Siparişin büyüklüğü ne olursa olsun, her siparişte bu şekilde çalışırız.',
    promises: [
      { title: 'Yalnızca kontrol edilmiş üreticiler', text: 'Her ürün; kalite, tutarlılık ve ihracat deneyimi açısından kontrol ettiğimiz bir Hindistanlı üreticiden gelir.' },
      { title: 'Numuneniz, birebir', text: 'Onayladığınız formül, koku ve ambalaj sevk edilen üründür; yükleme öncesinde numunenize göre kontrol edilir.' },
      { title: 'Doğru hazırlanmış evraklar', text: 'Fatura, çeki listesi, menşe şahadetnamesi, COA ve MSDS her sevkiyat için hazırlanır; gümrük müşavirinize teslime hazırdır.' },
      { title: 'Tek muhatap, limandan limana', text: 'İlk numuneden konşimentoya kadar, sipariş ettiğiniz tüm ürünler için tek teklif ve tek iletişim noktası.' },
    ],
    guidesH: 'Alıcı rehberleri',
    fanTabs: 'Ürün grubu seçin',
    fanShow: 'Göster: {name}',
    fanView: 'Grubu incele',
    fanOpen: '{name}: ürün grubunu incele',
  },

  productsIndex: {
    title: 'Sabun, Deterjan ve Temizlik Ürünleri İhracatçısı ve Tedarikçisi, Hindistan',
    description:
      'Kontrol edilmiş Hindistanlı üreticilerden tedarik edilen {n} sabun, çamaşır, mutfak, yüzey temizleyici ve hammadde ürününü HSN kodları ve özel marka seçenekleriyle inceleyin.',
    hsnLink: 'Ürün bazında HSN kodları',
    rangeFull: 'Ürün gamının tamamı',
    hsnH: 'Hangi ürüne hangi HSN kodu uygulanır?',
    hsnText:
      'Kodlar 6 hane olarak gösterilir. 8 haneli ITC-HS kodu sipariş başına teyit edilir; bazı ürünlerin alternatif sınıflandırmaları vardır (her ürün sayfasına bakın).',
    hsnCaption: 'Ürün bazında HSN özeti, ürün grubuna göre',
    colProduct: 'Ürün',
    colRange: 'Grup',
    colHsn: 'HSN (6 hane)',
    h1a: 'Her ürün,',
    h1b: 'tek bir ihracat ortağı.',
    shelfLead: '{r} ürün grubunda {n} ürün; HSN 3401 ve 3402 kapsamında, özel marka ve karma konteyner seçenekleriyle.',
    shelfAria: 'Ürün rafı',
    jumpNav: 'Ürün grubuna git',
    shelfPause: 'Rafı durdur',
  },

  product: {
    hsnAlt: 'Alternatif sınıflandırma aşağıda belirtilmiştir',
    hsnConfirmed: '8 haneli ITC-HS kodu sipariş başına teyit edilir',
    factsH: 'Alıcılar için temel bilgiler',
    hsnCode: 'HSN kodu',
    hsnNoteDefault: '8 haneli ITC-HS kodu sipariş başına teyit edilir.',
    moq: 'Asgari sipariş miktarı',
    privateLabel: 'Özel marka',
    plAvailable: 'Mevcuttur.',
    plNot: 'Bu ürün için sunulmamaktadır.',
    varH: 'Çeşitler, ambalaj boyutları ve ambalaj seçenekleri',
    variants: 'Mevcut çeşitler',
    variantsAria: 'Çeşitler',
    packSizes: 'Ambalaj boyutları',
    packaging: 'Ambalaj seçenekleri',
    galleryH: 'Daha fazla koku, fotoğraflarla',
    specH: 'Tipik özellikler nelerdir?',
    specNote: '{name}: ihracat kaliteleri için tipik değerler. Nihai değerler sipariş başına üreticiyle teyit edilir.',
    aboutAria: 'Hakkında: {name}',
    loadH: 'Konteyner yüklemesi (yaklaşık)',
    loadText: 'Yaklaşık rakamlardır; nihai yükleme planı sipariş başına teyit edilir.',
    ft20: '20 ft konteyner',
    ft40: '40 ft konteyner',
    guidesH: 'Bu ürün için alıcı rehberleri',
    relatedH: 'İlgili ürünler',
    relatedAll: 'Tümü: {nameLower}',
    quoteH: 'Bu ürün için teklif alın.',
    quoteText: '{nameLower} için çeşidi, ambalaj boyutunu, miktarı ve varış limanını tek satırda bize yazın. Talep formu bu bilgiyle dolu olarak açılır.',
  },

  category: {
    title: '{name}: Hindistan’dan İhracatçı ve Tedarikçi',
    hsnMeta: '{n} ürün · 8 haneli ITC-HS kodu sipariş başına teyit edilir',
    seeProducts: '{n} ürünü görüntüleyin',
    productsH: 'Bu grupta hangi ürünleri tedarik ediyoruz: {nameLower}?',
    quoteH: 'Teklif alın: {nameLower}.',
  },

  blogIndex: {
    title: 'Sabun ve Temizlik Ürünü Alıcıları için İhracat Rehberleri',
    description:
      'Hindistan’dan sabun, deterjan ve ev bakım ürünü ithal edenler için pratik rehberler: HSN kodları, MOQ, evraklar, özel marka ve sevkiyat.',
    l1: 'Alıcı rehberleri.',
    l2: 'Sabun ve ev bakımı ithalatı için.',
    lead: 'İthalatçılar ve distribütörler için sade notlar: sınıflandırma, maliyetler, evraklar ve ürün seçimi.',
    latest: 'Son yazılar',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Hızlı cevaplar',
    relatedH: 'Bu rehberde geçen ürünler',
    quoteH: 'Sipariş mi planlıyorsunuz?',
    quoteText: 'İhtiyacınızı tek satırda yazın. Talep formu, ürünlerinizi, miktarınızı ve limanınızı eklemeniz için bu bilgiyle dolu olarak açılır.',
  },

  contact: {
    title: 'Teklif İsteyin: Hindistan’dan Sabun ve Ev Bakım Ürünleri İhracatçısı ve Tedarikçisi',
    description:
      'GoodBiz Hygiene’den Hindistan menşeli sabun, deterjan ve ev bakım ürünleri için teklif isteyin. Ürünlerinizi, ambalaj boyutlarınızı ve limanınızı e-posta veya WhatsApp ile iletin.',
    l1: 'Teklif isteyin.',
    l2: 'Hindistan’dan, limanınıza.',
    lead: 'İhtiyacınızı bize iletin: ürünler, ambalaj boyutları, miktar ve varış limanı. GoodBiz Hygiene fiyatlar, tipik özellikler ve teslim süreleriyle yanıt verir.',
    start: 'Talebi başlatın',
    waMessage: 'WhatsApp’tan bize yazın',
    formH: 'Talep formu',
    asideAria: 'Bize ulaşmanın diğer yolları',
    email: 'E-posta',
    whatsapp: 'WhatsApp',
    phone: 'Telefon',
    office: 'Ofis',
    terms: 'İhracat koşulları',
    oftenH: 'Sıklıkla birlikte teklif alınanlar',
    oftenText: 'Yukarıdaki formda o ürünü işaretlemek için bir karttaki “Talebe ekle” düğmesine dokunun.',
  },

  form: {
    name: 'Adınız',
    company: 'Şirket',
    country: 'Ülke',
    email: 'E-posta',
    phone: 'WhatsApp veya telefon',
    phoneHint: '(ülke koduyla)',
    quantity: 'Miktar',
    choose: 'Birini seçin',
    quantities: [
      'Numune veya deneme miktarı',
      'Karışık konteynerin bir kısmı',
      '1 x 20 ft konteyner',
      '1 x 40 ft konteyner',
      'Birkaç konteyner veya düzenli tedarik',
      'Henüz emin değilim',
    ],
    productsLegend: 'İlgilendiğiniz ürünler',
    chooseAny: '(istediğiniz kadar seçin)',
    plLegend: 'Özel marka istiyor musunuz?',
    plYes: 'Evet, markam altında',
    plNo: 'Hayır',
    message: 'Mesaj',
    messageHint: '(ambalaj boyutları, kokular, varış limanı)',
    submit: 'Talebi gönderin',
    hint: 'Bu işlem, talebiniz doldurulmuş olarak e-posta uygulamanızı açar. WhatsApp’ı mı tercih edersiniz?',
    hintLink: 'WhatsApp’tan bize yazın',
    hintJs: 'Ardından talebi WhatsApp veya e-posta ile göndermeyi seçin.',
    sendH: 'Talebiniz hazır. Nasıl göndermek istersiniz?',
    sendWa: 'WhatsApp ile gönderin',
    sendEmail: 'E-posta ile gönderin',
    sendNote: 'Her biri kendi uygulamanızı mesaj yazılı olarak açar; göndermeden önce kontrol edebilirsiniz.',
  },

  about: {
    title: 'GoodBiz Hygiene Hakkında: Hindistan’dan Sabun ve Ev Bakım Ürünleri İhracatçısı ve Tedarikçisi',
    description:
      'GoodBiz Hygiene, Hindistan’dan ticari ihracatçı olan GoodBiz Global’in ev bakımı ve hijyen ihracat bölümüdür ve GoodBiz Agro’nun kardeş markasıdır.',
    l1: 'GoodBiz Hygiene.',
    l2: 'Bir {parent} şirketi.',
    lead: 'GoodBiz Hygiene, Hindistan’dan ticari ihracatçı olan {parent}’ın ev bakımı ve hijyen ihracat bölümüdür ve GoodBiz Agro’nun kardeş markasıdır.',
    whatH: 'GoodBiz Hygiene ne yapar?',
    what1:
      'GoodBiz Hygiene, Hindistan dışındaki ithalatçılara, distribütörlere, toptancılara, süpermarket zincirlerine ve özel marka sahiplerine sabun, deterjan ve ev bakım ürünleri tedarik eder. Fabrikası yoktur. Ürünler kontrol edilmiş Hindistanlı üreticilerden tedarik edilir; GoodBiz Hygiene teklif, özel marka koordinasyonu, ihracat evrakları ve sevkiyatı üstlenir.',
    what2:
      'Ürün gamı, HSN 3401 (sabunlar) ve HSN 3402 (deterjanlar ile yıkama veya temizlik müstahzarları) kapsamında sınıflandırılan ürünleri ve bitkisel fenol gibi yakın ürünleri beş grupta kapsar.',
    rangesH: 'Beş ürün grubu',
    familyH: '{parent} bünyesinde',
    familyText: '{parent}, tarımsal ihracat için GoodBiz Agro’yu, sabun ve ev bakımı için GoodBiz Hygiene’i yürütür.',
    visit: 'Ziyaret edin',
    basedIn: 'Merkez',
    founded: 'Kuruluş',
    iec: 'İthalatçı İhracatçı Kodu (IEC)',
  },

  faqPage: {
    title: 'SSS: Hindistan’dan Sabun ve Ev Bakım Ürünleri İhracatçısı ve Tedarikçisi',
    description:
      'GoodBiz Hygiene üzerinden Hindistan’dan sabun, deterjan ve temizleyici alan ithalatçılar için cevaplar: tedarik, özel marka, MOQ, Incoterms, evraklar ve teslim süreleri.',
    l1: 'Alıcı soruları.',
    l2: 'Net cevaplar.',
    lead: 'GoodBiz Hygiene, Hindistan’dan sabun ve ev bakım ürünlerini nasıl tedarik eder, teklif verir ve sevk eder. Ürüne özel sorular her ürün sayfasında cevaplanır.',
    quoteH: 'Hâlâ bir sorunuz mu var?',
    quoteText: 'Sorunuzu talebinizle birlikte tek satırda gönderin. Ürünleriniz ve pazarınız için ayrıntılarla yanıt veririz.',
  },

  faqs: [
    {
      heading: 'Tedarik ve ürünler',
      faqs: [
        {
          q: 'GoodBiz Hygiene ihraç ettiği ürünleri üretiyor mu?',
          a: 'Hayır. GoodBiz Hygiene, Hindistan’dan bir ticari ihracatçıdır ve bir GoodBiz Global şirketidir. Sabun, deterjan ve ev bakım ürünlerini kontrol edilmiş Hindistanlı üreticilerden tedarik eder; yurt dışındaki alıcılar için teklif, özel marka koordinasyonu, evrak ve sevkiyatı üstlenir.',
        },
        {
          q: 'GoodBiz Hygiene hangi ürünleri tedarik ediyor?',
          a: 'Beş ürün grubu: banyo ve kişisel sabunlar, çamaşır bakımı, mutfak bakımı, yüzey ve ev temizleyicileri ile sabun noodle, LABSA ve SLES gibi endüstriyel hammaddeler. Her ürünün kendi sayfasında tipik özellikler, ambalaj boyutları ve HSN kodu yer alır.',
        },
        {
          q: 'Sabun ve temizlik ürünlerine hangi HSN kodları uygulanır?',
          a: 'Sabunlar HSN 3401, deterjanlar ile yıkama veya temizlik müstahzarları HSN 3402 kapsamındadır. Site kodları 6 hane olarak gösterir; örneğin 3402 50. 8 haneli ITC-HS kodu sipariş başına teyit edilir; çamaşır yumuşatıcı ve bitkisel fenol gibi bazı ürünler farklı sınıflandırılabilir.',
        },
        {
          q: 'Ürün sayfalarındaki özellikler nihai değerler midir?',
          a: 'Hayır. Özellikler, ihracat kaliteleri için tipik değerlerdir. Aktif madde, TFM veya pH gibi nihai değerler her sipariş için üreticiyle teyit edilir ve tekliflerde belirtilir.',
        },
      ],
    },
    {
      heading: 'Sipariş ve özel marka',
      faqs: [
        {
          q: 'Ürünleri kendi markam altında sipariş edebilir miyim?',
          a: 'Evet. Özel marka çoğu üründe mevcuttur: etiket tasarımınız, formülasyonun izin verdiği ölçüde koku ve renk seçimi ve pazarınızın ihtiyaç duyduğu ambalaj boyutları. Asgari miktarlar ürüne ve ambalaja bağlıdır ve her ürün sayfasında tipik olarak belirtilir.',
        },
        {
          q: 'Farklı ürünleri tek konteynerde birleştirebilir miyim?',
          a: 'Evet. Birden fazla gruptan ürünleri tek bir 20 ft veya 40 ft konteynerde birleştirebilirsiniz; böylece her ürün için ayrı bir konteyner doldurmadan bir ürün grubunu deneyebilirsiniz. Karışım, teklif verirken paketleme ve uyumluluk kurallarına göre teyit edilir.',
        },
        {
          q: 'Sipariş vermeden önce numune alabilir miyim?',
          a: 'Evet. Çoğu ürün için siparişi onaylamadan önce numune temin edilebilir. Talebinizde ürünleri ve kurye bilgilerinizi belirtin; nelerin gönderilebileceğini teyit edelim.',
        },
        {
          q: 'Nasıl teklif isteyebilirim?',
          a: 'İletişim sayfasındaki talep formunu kullanın veya ürünleri, ambalaj boyutlarını, miktarı ve varış limanını belirten bir WhatsApp mesajı ya da e-posta gönderin. Fiyatlar, tipik özellikler ve teslim süreleriyle yanıt veririz.',
        },
      ],
    },
    {
      heading: 'Sevkiyat, ödeme ve evraklar',
      faqs: [
        { q: 'Hangi Incoterms ve ödeme koşullarını sunuyorsunuz?', a: '{incoterms}.' },
        { q: 'Bir siparişin sevk edilmesi ne kadar sürer?', a: '{leadTime}. {port}.' },
        {
          q: 'Bir sevkiyatla birlikte hangi ihracat evrakları gelir?',
          a: 'Sevkiyatlar normalde ticari fatura, çeki listesi, menşe şahadetnamesi ve konşimento ile birlikte; ayrıca analiz sertifikası (COA) ve malzeme güvenlik bilgi formu (MSDS) gibi ürün belgeleriyle gelir. Kesin set ülkenize bağlıdır ve sipariş başına teyit edilir.',
        },
        {
          q: 'Ülkeme sevkiyat yapıyor musunuz?',
          a: 'GoodBiz Hygiene, çoğu ülkedeki ithalatçılara, distribütörlere ve özel marka sahiplerine teklif verir. Etiket dili veya kayıt gibi varış ülkesi kuralları, sipariş onaylanmadan önce sizinle birlikte kontrol edilir.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'İhracat Süreci: Hindistan’dan Sabun ve Ev Bakım Ürünleri İhracatçısı ve Tedarikçisi',
    description:
      'GoodBiz Hygiene, Hindistan’dan sabun, deterjan ve temizleyicileri nasıl ihraç eder: teklif, numuneler, Incoterms, ödeme koşulları, evraklar, limanlar ve tipik teslim süreleri.',
    lead: 'GoodBiz Hygiene üzerinden Hindistan’dan sabun ve ev bakım ürünleri satın almanın adımları, koşulları ve evrakları.',
    route: {
      h1a: 'Hindistan’ın limanlarından',
      h1b: 'sizin limanınıza.',
      regionsLabel: 'Bir varış bölgesi seçin',
      regions: {
        gulf: 'Körfez ve Orta Doğu',
        eastAfrica: 'Doğu Afrika',
        westAfrica: 'Batı Afrika',
        europe: 'Avrupa',
        southeastAsia: 'Güneydoğu Asya',
        latinAmerica: 'Latin Amerika',
      },
      ports: {
        nhavaSheva: 'Nhava Sheva (Mumbai)',
        mundra: 'Mundra',
        chennai: 'Chennai',
        jebelAli: 'Cebel Ali',
        mombasa: 'Mombasa',
        lagos: 'Lagos',
        tema: 'Tema',
        rotterdam: 'Rotterdam',
        singapore: 'Singapur',
        jakarta: 'Cakarta',
        santos: 'Santos',
      },
      lane: '{from} → {to}',
      laneAll: 'Hindistan limanları → sizin limanınız',
      terms: 'FOB, CIF veya CFR · {leadTime}',
      illustrative: 'Rotalar temsilîdir.',
      credit: 'Harita verileri: Natural Earth (kamu malı)',
      mapAlt: 'Nhava Sheva, Mundra ve Chennai’den altı bölgedeki limanlara temsilî deniz rotalarını gösteren harita',
      pause: 'Rota turunu duraklat',
      timelineAria: 'Siparişten sefere',
      timeline: ['Sipariş onaylandı', 'Üretim ve paketleme', 'Belgeler', 'Yükleme ve sefer'],
    },
    stepsLink: 'Altı adım',
    termsH: 'İhracat koşulları nelerdir?',
    termsIncoterms: 'Incoterms ve ödeme',
    termsPort: 'Liman',
    termsLead: 'Teslim süresi',
    processL1: 'Talepten sevkiyata',
    processL2: 'adımlar nelerdir?',
    processIntro: 'Altı adım; herhangi bir şey üretilmeden önce teklif, numuneler ve proforma fatura üzerindeki onayınızla.',
    steps: [
      { name: 'Talep', text: 'Ürünleri, ambalaj boyutlarını, miktarı, varış limanını ve varsa özel marka ihtiyaçlarını talep formu, e-posta veya WhatsApp ile iletin.' },
      { name: 'Teklif', text: 'Tipik özellikler, ihtiyaç duyduğunuz Incoterm ve teslim süresiyle birlikte ambalaj başına fiyat teklif ederiz. {incoterms}.' },
      { name: 'Numuneler ve onaylar', text: 'Sipariş onaylanmadan önce ürün numuneleri ve özel markada tasarım provaları onaylanır.' },
      { name: 'Proforma fatura ve ödeme', text: 'Proforma fatura; ürünleri, miktarları, paketlemeyi, Incoterm’i ve ödeme koşullarını (T/T veya LC) teyit eder.' },
      { name: 'Üretim ve paketleme', text: 'Üretici siparişi üretir ve paketler; ihracat ve pazarınız için işaretlenir.' },
      { name: 'Evraklar ve sevkiyat', text: 'İhracat evraklarını hazırlar ve sevkiyatı organize ederiz. {port}.' },
    ],
    docsH: 'Bir sevkiyatla hangi evraklar gelir?',
    docsText: 'Kesin set ülkenize bağlıdır ve sipariş başına teyit edilir.',
    documents: [
      'Ticari fatura',
      'Çeki listesi',
      'Menşe şahadetnamesi',
      'Konşimento (deniz taşımacılığı)',
      'Analiz sertifikası (COA)',
      'Malzeme güvenlik bilgi formu (MSDS)',
    ],
    faqH: 'İhracat süreci: alıcıların sorduğu sorular',
    faqs: [
      { q: 'Hangi Incoterms koşullarını sunuyorsunuz?', a: '{incoterms}.' },
      { q: 'Sevkiyatlar hangi limandan çıkar?', a: '{port}. Liman; ürüne, üreticinin konumuna ve varış yerinize göre seçilir ve teklifte belirtilir.' },
      { q: 'Teslim süresi nedir?', a: '{leadTime}.' },
      {
        q: 'Hangi evraklar dahildir?',
        a: 'Sevkiyatlar normalde ticari fatura, çeki listesi, menşe şahadetnamesi, konşimento (deniz taşımacılığı) ile birlikte, ürünün gerektirdiği durumlarda COA ve MSDS ile gelir. Ülkeniz sağlık sertifikası veya onaylı fatura gibi ek evraklar isteyebilir; bu, sipariş başına kararlaştırılır.',
      },
      {
        q: 'Faturaya hangi HSN kodu yazılır?',
        a: 'Site HSN kodlarını 6 hane olarak gösterir; örneğin 3402 50. 8 haneli ITC-HS kodu sipariş başına teyit edilir. Çamaşır yumuşatıcı ve bitkisel fenol alternatif sınıflandırmalara girebilir (3809 91 ve 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Özel Marka Sabun ve Temizlik Ürünleri: Hindistan’dan İhracatçı ve Tedarikçi',
    description:
      'Hindistan’dan özel marka sabun, deterjan ve temizleyiciler: tasarımınız, kokunuz, renginiz ve ambalaj boyutlarınızla, kontrol edilmiş Hindistanlı üreticilerce üretilir ve GoodBiz Hygiene tarafından ihraç edilir.',
    lead: 'Sabun, deterjan ve temizleyicileri kendi markanız altında satın. GoodBiz Hygiene talebinizi kontrol edilmiş bir Hindistanlı üreticiyle eşleştirir, numune ve tasarım süreçlerini yönetir ve bitmiş ürünleri limanınıza sevk eder.',
    hero: {
      h1a: 'Sizin markanız,',
      h1b: 'Hindistan’dan tedarik ve sevkiyat.',
      cta: 'Özel marka talebi başlatın',
      placeholder: 'Markanız',
      inputLabel: 'Marka adınızı yazın',
      colourLegend: 'Etiket rengi',
      colourways: { sage: 'Adaçayı', ocean: 'Okyanus', blush: 'Pudra' },
      packAlt: 'Pompalı şişe ve katlanır karton kutu çizimi; boş etikette bir marka adı yazıyor',
      caption: 'Tipik bir özel marka ambalajının çizimi.',
      message: 'Özel marka talebi: “{brand}” markamızla satış yapmak istiyoruz.',
      messageNoBrand: 'Özel marka talebi: kendi markamızla satış yapmak istiyoruz.',
      stepsAria: 'Dört adımda özel marka siparişi',
      steps: ['Brif', 'Tasarım provası', 'Numune onayı', 'Sevk edildi'],
    },
    optionsH: 'Nelerde özelleştirme yapılabilir?',
    optionsText: 'Dört seçim, ürün gamını size ait kılar. Her biri toplu üretimden önce sizin tarafınızdan onaylanır.',
    options: [
      {
        title: 'Ambalajda markanız',
        text: 'Tasarımınızla basılmış etiket, kılıf, karton veya sargı. Dosyalarınızı üreticiye iletir, baskıdan önce onayınız için bir prova getiririz.',
      },
      {
        title: 'Koku ve renk',
        text: 'Her ürünün tipik olarak üretildiği kokular ve renkler arasından seçin; örneğin limon, lavanta, gül veya neem. Standart gamın dışındaki değişiklikler önce üreticiyle kontrol edilir.',
      },
      {
        title: 'Ambalaj boyutları ve formatları',
        text: 'Perakende şişeler, yedek dolumlar, poşetler, sabun kalıpları ve dökme bidonlar veya varillerden, rafınıza ve fiyat noktanıza uygun olanı seçin. Her ürün sayfasında tipik ambalaj boyutları listelenir.',
      },
      {
        title: 'Kalite sınıfı ve özellik',
        text: 'Pazarınızın beklediği kalite sınıfını seçin; örneğin banyo sabununda TFM veya deterjanlarda aktif madde. Tipik değerler ürün sayfalarında gösterilir, nihai değerler tekliflerinizde belirtilir.',
      },
    ],
    processL1: 'Bir özel marka',
    processL2: 'siparişi nasıl yürür.',
    processIntro: 'Talebinizden limanınızdaki ürüne beş adım; herhangi bir şey üretilmeden önce numune ve tasarım üzerindeki onayınızla.',
    steps: [
      { name: 'Talebinizi paylaşın', text: 'Ürünler, ambalaj boyutları, kokular, hedef pazar ve tahmini miktar.' },
      { name: 'Teklif ve üretici eşleşmesi', text: 'Talebi kontrol edilmiş bir Hindistanlı üreticiyle eşleştirir, Incoterms ve teslim süresiyle birlikte ambalaj başına teklif veririz.' },
      { name: 'Numuneler ve tasarım', text: 'Bir ürün numunesini ve tasarımınızın basılı provasını onaylarsınız. Üretim normalde her ikisini onayladıktan sonra başlar.' },
      { name: 'Üretim ve paketleme', text: 'Üretici siparişinizi markanız altında üretir ve paketler; ihracat için işaretlenir.' },
      { name: 'Evraklar ve sevkiyat', text: 'İhracat evraklarını hazırlar ve sevkiyatı organize ederiz. {port}.' },
    ],
    faqH: 'Özel marka: alıcıların sorduğu sorular',
    faqs: [
      {
        q: 'Özel marka için asgari sipariş miktarı nedir?',
        a: 'Ürüne ve ambalaja bağlıdır. Çoğu ürün için sabit bir asgari sipariş yoktur; ancak özel marka tasarımının basılı etiketler veya kartonlar için kendi asgari miktarı olabilir. Miktarınızı bize iletin, teklifimizi verelim.',
      },
      {
        q: 'Tasarımın ve markanın sahibi kim?',
        a: 'Tasarım size aittir; kullanım koşulları sipariş başına kararlaştırılır. GoodBiz Hygiene baskıyı üreticiyle koordine eder.',
      },
      {
        q: 'Özel marka ve standart ürünleri tek konteynerde karıştırabilir miyim?',
        a: 'Evet. Özel marka hatları, teklif aşamasında teyit edilen paketleme ve uyumluluk kurallarına tabi olarak GoodBiz Hygiene gamındaki diğer ürünlerle aynı konteyneri paylaşabilir.',
      },
      {
        q: 'Bir özel marka siparişi ne kadar sürer?',
        a: '{leadTime}. İlk sipariş, numune ve tasarım onayı için gereken süreyi içerir; tekrar siparişler genellikle daha kısa sürer.',
      },
      {
        q: 'GoodBiz Hygiene ürünleri üretiyor mu?',
        a: 'Hayır. GoodBiz Hygiene, Hindistan’dan bir ticari ihracatçıdır. Ürünler kontrol edilmiş Hindistanlı üreticilerce üretilir; GoodBiz Hygiene talebi, onayları, evrakları ve sevkiyatı yönetir.',
      },
    ],
    quoteH: 'Talebinizi başlatın.',
    quoteText: 'Aklınızdaki ürünleri, ambalajları ve pazarı tek satırda iletin. Seçenekler, fiyatlar ve teslim süreleriyle yanıt veririz.',
  },

  notFound: {
    title: 'Sayfa bulunamadı',
    description: 'Bu sayfa bulunamadı. GoodBiz Hygiene’in sabun ve ev bakım ürünlerine göz atın veya teklif isteyin.',
    l1: 'Bu sayfa',
    l2: 'rafta yok.',
    lead: 'Bağlantı eski veya hatalı yazılmış olabilir. Ürün gamının tamamı bir tık uzağınızda.',
    sprayAlt: 'Sprey temizleyici şişesi görseli',
  },
};

export default tr;
