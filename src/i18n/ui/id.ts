/**
 * Indonesian UI strings (formal business Bahasa Indonesia, "Anda").
 * Source: src/i18n/ui/en.ts. Rules: docs/i18n-translator-guide.md.
 */
import type { UiPartial } from './types.ts';

/** Set by `npm run i18n:stamp`: the English dictionary this file was translated from. */
export const sourceHash = '63f8be54f28d';

const id: UiPartial = {
  meta: {
    tagline: 'Sabun dan produk perawatan rumah, diekspor dari India',
  },

  terms: {
    incoterms: 'FOB, CIF dan CFR tersedia; ketentuan pembayaran disepakati untuk setiap pesanan (T/T atau LC)',
    payment: 'Disepakati untuk setiap pesanan (T/T atau LC)',
    port: 'Dikirim dari pelabuhan-pelabuhan utama India',
    leadTime: 'Umumnya 3–5 minggu setelah konfirmasi pesanan, tergantung kebutuhan private label',
  },

  common: {
    skip: 'Langsung ke konten',
    home: 'Beranda',
    products: 'Produk',
    blog: 'Blog',
    breadcrumb: 'Navigasi remah roti',
    requestQuote: 'Minta Penawaran',
    viewProducts: 'Lihat Produk',
    exporterLine: 'Eksportir dan Pemasok dari India',
    hsn: 'HSN',
    hsnTitle: 'Harmonized System of Nomenclature (Sistem Penamaan Harmonisasi)',
    allProducts: 'Semua produk',
    allGuides: 'Semua panduan',
    productsCount: '{n} produk',
    minRead: '{n} menit baca',
    readFaq: 'Baca FAQ',
    straightAnswers: 'Jawaban yang lugas.',
    buyerFaq: 'FAQ pembeli',
    faqDefault: 'Pertanyaan yang sering diajukan pembeli',
    exportProcessFull: 'Proses ekspor selengkapnya',
    renderAlt: 'Ilustrasi {nameLower} dalam kemasan ekspor yang umum',
    drawingAlt: 'Ilustrasi {nameLower}',
    photoAlt: '{name} dari GoodBiz',
    categoryRenderAlt: 'Ilustrasi kemasan {nameLower} yang umum',
    rangeAlt: 'Ilustrasi lini produk GoodBiz Hygiene dalam kemasan ekspor yang umum',
    portAlt: 'Derek gantri memuat kapal kontainer pada malam hari di International Container Transshipment Terminal, Kochi, India',
    portCaption: 'Terminal kontainer, Kochi. Foto: {creator}, {license}.',
    specCaption: 'Spesifikasi tipikal. Nilai akhir dikonfirmasi untuk setiap pesanan.',
  },

  header: {
    homeAria: '{name}, beranda',
    menu: 'Menu',
    mainNav: 'Utama',
    mainNavMobile: 'Utama (seluler)',
    nav: {
      products: 'Produk',
      privateLabel: 'Private Label',
      exportProcess: 'Proses Ekspor',
      guides: 'Panduan Pembeli',
      about: 'Tentang Kami',
      faq: 'FAQ',
    },
  },

  footer: {
    tag: 'Bersih, dari India',
    lede: 'Sabun dan produk perawatan rumah, bersumber dari produsen India yang telah kami seleksi dan diekspor oleh GoodBiz Hygiene, perusahaan {parent}.',
    nav: 'Footer',
    products: 'Produk',
    company: 'Perusahaan',
    contact: 'Kontak',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, perusahaan {parent}. Merchant exporter dari India.',
    backToTop: 'Kembali ke atas',
  },

  lang: {
    label: 'Bahasa',
    menuAria: 'Pilih bahasa. Bahasa saat ini: {name}',
    more: 'Bahasa lainnya…',
    moreTitle: 'Membuka halaman ini di Google Translate (terjemahan mesin)',
  },

  whatsapp: {
    aria: 'Chat dengan GoodBiz Hygiene di WhatsApp',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Tambah ke permintaan',
    addAria: 'Tambah ke permintaan: {name}',
    noteH: 'Gabungkan dalam satu kontainer.',
    noteText: 'Kombinasikan produk-produk ini dengan produk dari lini lain dalam satu kontainer 20 kaki atau 40 kaki. Kami mengonfirmasi komposisinya saat memberikan penawaran.',
  },

  quote: {
    heading: 'Minta penawaran.',
    text: 'Sampaikan kebutuhan Anda dalam satu baris. Formulir permintaan akan terbuka dengan teks tersebut sudah terisi, siap dilengkapi produk, jumlah, dan pelabuhan tujuan.',
    placeholder: 'mis. 1×20 kaki sabun cuci piring, lemon, 500 ml',
    label: 'Apa yang Anda butuhkan?',
    submit: 'Mulai permintaan',
  },

  ld: {
    hsnCode: 'Kode HSN',
    variants: 'Varian',
    packSizes: 'Ukuran kemasan',
  },

  home: {
    title: 'Eksportir dan Pemasok Sabun & Produk Perawatan Rumah dari India',
    description:
      'GoodBiz Hygiene, perusahaan GoodBiz Global, mengekspor sabun, deterjen, dan produk perawatan rumah dari produsen India terseleksi, dengan private label dan kontainer campuran.',
    eyebrow: 'Sabun · Deterjen · Perawatan rumah',
    h1a: 'Sabun & Perawatan Rumah',
    h1b: 'Diekspor dari India.',
    text: 'GoodBiz Hygiene adalah merchant exporter: kami mencarikan sabun, deterjen, dan pembersih dari produsen India yang telah kami seleksi, dengan private label dan kontainer campuran.',
    rangeH: 'Lini Produk.',
    rangeIntro: 'Tiga dari {n} produk. Masing-masing memiliki halaman sendiri berisi spesifikasi tipikal, ukuran kemasan, dan opsi private label.',
    rangeAll: 'Lihat semua {n} produk',
    processL1: 'Cara kerja',
    processL2: 'pesanan ekspor.',
    processIntro:
      'Satu merchant exporter di antara Anda dan produsen: penawaran, sampel, dokumen, dan pengiriman, dari pesan pertama hingga bill of lading.',
    steps: [
      {
        name: 'Spesifikasi dan sampel',
        text: 'Kirimkan produk, ukuran kemasan, jumlah, dan pelabuhan tujuan. Kami memberikan penawaran harga per kemasan lengkap dengan spesifikasi tipikal dan lead time, serta mengatur sampel untuk persetujuan Anda.',
      },
      {
        name: 'Pengadaan dan private label',
        text: 'Kami mencocokkan kebutuhan Anda dengan produsen India yang telah kami seleksi. Untuk private label, desain kemasan, aroma, dan pilihan kemasan Anda disetujui sebelum produksi massal.',
      },
      {
        name: 'Dokumen dan pengiriman',
        text: 'Produsen memproduksi dan mengemas pesanan, sementara kami menyiapkan faktur, packing list, surat keterangan asal, COA, dan MSDS. {port}. {leadTime}.',
      },
    ],
    catsH: 'Kategori.',
    catsText: 'Lima lini produk di bawah HSN 3401 dan 3402. Gabungkan dalam satu kontainer 20 kaki atau 40 kaki.',
    tileMeta: '{n} produk · HSN {hsn}',
    answersMore: 'Jawaban lainnya ada di halaman FAQ',
    statementA: 'Dipilih dengan cermat,',
    statementB: 'dikirim dengan percaya diri.',
    statementLead:
      'Setiap pesanan GoodBiz Hygiene dicocokkan dengan produsen India yang telah kami seleksi, diperiksa terhadap sampel yang Anda setujui, dan dikirim dengan dokumen ekspor lengkap. Begitulah cara kami bekerja pada setiap pesanan, berapa pun ukurannya.',
    promises: [
      { title: 'Hanya produsen terseleksi', text: 'Setiap produk berasal dari produsen India yang telah kami periksa dari sisi kualitas, konsistensi, dan pengalaman ekspor.' },
      { title: 'Sesuai sampel Anda', text: 'Formula, aroma, dan kemasan yang Anda setujui adalah yang dikirim, diperiksa terhadap sampel Anda sebelum pemuatan.' },
      { title: 'Dokumen yang tertib', text: 'Faktur, packing list, surat keterangan asal, COA, dan MSDS disiapkan untuk setiap pengiriman, siap diserahkan kepada agen bea cukai Anda.' },
      { title: 'Satu mitra, dari pelabuhan ke pelabuhan', text: 'Satu penawaran dan satu narahubung dari sampel pertama hingga bill of lading, untuk semua produk yang Anda pesan.' },
    ],
    guidesH: 'Panduan pembeli',
    fanTabs: 'Pilih lini produk',
    fanShow: 'Tampilkan {name}',
    fanView: 'Lihat lini',
    fanOpen: '{name}: lihat lini produk',
  },

  productsIndex: {
    title: 'Eksportir dan Pemasok Sabun, Deterjen & Produk Pembersih dari India',
    description:
      'Jelajahi {n} produk sabun, perawatan pakaian, dapur, pembersih permukaan, dan bahan baku dari produsen India terseleksi, lengkap dengan kode HSN dan opsi private label.',
    l1: 'Semua produk.',
    l2: 'Sabun, deterjen & pembersih.',
    lead: '{n} produk dalam lima lini, bersumber dari produsen India yang telah kami seleksi dan tersedia dengan opsi private label. Pilih satu lini, atau buka produk mana pun untuk melihat spesifikasi, ukuran kemasan, dan kode HSN.',
    hsnLink: 'Kode HSN per produk',
    rangesNav: 'Lima lini produk',
    rangeFull: 'Lini produk selengkapnya',
    hsnH: 'Kode HSN mana yang berlaku untuk setiap produk?',
    hsnText:
      'Kode ditampilkan dalam 6 digit. Kode ITC-HS 8 digit dikonfirmasi untuk setiap pesanan, dan beberapa produk memiliki klasifikasi alternatif (lihat halaman masing-masing produk).',
    hsnCaption: 'Ikhtisar HSN per produk, dikelompokkan menurut lini',
    colProduct: 'Produk',
    colRange: 'Lini',
    colHsn: 'HSN (6 digit)',
  },

  product: {
    hsnAlt: 'Klasifikasi alternatif dicatat di bawah',
    hsnConfirmed: 'Kode ITC-HS 8 digit dikonfirmasi untuk setiap pesanan',
    factsH: 'Fakta penting bagi pembeli',
    hsnCode: 'Kode HSN',
    hsnNoteDefault: 'Kode ITC-HS 8 digit dikonfirmasi untuk setiap pesanan.',
    moq: 'Jumlah pesanan minimum',
    privateLabel: 'Private label',
    plAvailable: 'Tersedia.',
    plNot: 'Tidak ditawarkan untuk produk ini.',
    varH: 'Varian, ukuran kemasan, dan pengemasan',
    variants: 'Varian yang tersedia',
    variantsAria: 'Varian',
    packSizes: 'Ukuran kemasan',
    packaging: 'Opsi pengemasan',
    galleryH: 'Lebih banyak aroma, dalam foto',
    specH: 'Apa saja spesifikasi tipikalnya?',
    specNote: '{name}: nilai tipikal untuk grade ekspor. Nilai akhir dikonfirmasi dengan produsen untuk setiap pesanan.',
    aboutAria: 'Tentang {name}',
    loadH: 'Muatan kontainer (perkiraan)',
    loadText: 'Angka perkiraan; rencana pemuatan akhir dikonfirmasi untuk setiap pesanan.',
    ft20: 'Kontainer 20 kaki',
    ft40: 'Kontainer 40 kaki',
    guidesH: 'Panduan pembeli untuk produk ini',
    relatedH: 'Produk terkait',
    relatedAll: 'Semua {nameLower}',
    quoteH: 'Minta penawaran produk ini.',
    quoteText: 'Sebutkan varian {nameLower}, ukuran kemasan, jumlah, dan pelabuhan tujuan dalam satu baris. Formulir permintaan akan terbuka dengan teks tersebut sudah terisi.',
  },

  category: {
    title: '{name}: Eksportir dan Pemasok dari India',
    hsnMeta: '{n} produk · kode ITC-HS 8 digit dikonfirmasi untuk setiap pesanan',
    seeProducts: 'Lihat {n} produk',
    productsH: 'Produk {nameLower} apa saja yang kami pasok?',
    quoteH: 'Minta penawaran {nameLower}.',
  },

  blogIndex: {
    title: 'Panduan Ekspor bagi Pembeli Sabun & Produk Pembersih',
    description:
      'Panduan praktis bagi importir sabun, deterjen, dan produk perawatan rumah dari India: kode HSN, MOQ, dokumen, private label, dan pengiriman.',
    l1: 'Panduan pembeli.',
    l2: 'Untuk impor sabun & perawatan rumah.',
    lead: 'Catatan berbahasa lugas untuk importir dan distributor: klasifikasi, biaya, dokumen, dan cara memilih produk.',
    latest: 'Artikel terbaru',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Jawaban singkat',
    relatedH: 'Produk yang disebut dalam panduan ini',
    quoteH: 'Merencanakan pesanan?',
    quoteText: 'Sampaikan kebutuhan Anda dalam satu baris. Formulir permintaan akan terbuka dengan teks tersebut sudah terisi, siap dilengkapi produk, jumlah, dan pelabuhan tujuan.',
  },

  contact: {
    title: 'Minta Penawaran: Eksportir dan Pemasok Sabun & Produk Perawatan Rumah dari India',
    description:
      'Minta penawaran dari GoodBiz Hygiene untuk sabun, deterjen, dan produk perawatan rumah dari India. Kirimkan produk, ukuran kemasan, dan pelabuhan Anda lewat email atau WhatsApp.',
    l1: 'Minta penawaran.',
    l2: 'Dari India, ke pelabuhan Anda.',
    lead: 'Sampaikan kebutuhan Anda: produk, ukuran kemasan, jumlah, dan pelabuhan tujuan. GoodBiz Hygiene akan membalas dengan harga, spesifikasi tipikal, dan lead time.',
    start: 'Mulai permintaan',
    waMessage: 'Kirim pesan via WhatsApp',
    formH: 'Formulir permintaan',
    asideAria: 'Cara lain untuk menghubungi kami',
    email: 'Email',
    whatsapp: 'WhatsApp',
    phone: 'Telepon',
    office: 'Kantor',
    terms: 'Ketentuan ekspor',
    oftenH: 'Sering dimintakan penawaran bersamaan',
    oftenText: 'Ketuk “Tambah ke permintaan” pada kartu untuk mencentang produk tersebut di formulir di atas.',
  },

  form: {
    name: 'Nama Anda',
    company: 'Perusahaan',
    country: 'Negara',
    email: 'Email',
    phone: 'WhatsApp atau telepon',
    phoneHint: '(dengan kode negara)',
    quantity: 'Jumlah',
    choose: 'Pilih salah satu',
    quantities: [
      'Sampel atau jumlah uji coba',
      'Bagian dari kontainer campuran',
      '1 x kontainer 20 kaki',
      '1 x kontainer 40 kaki',
      'Beberapa kontainer atau pasokan rutin',
      'Belum yakin',
    ],
    productsLegend: 'Produk yang diminati',
    chooseAny: '(pilih sesuai kebutuhan)',
    plLegend: 'Apakah Anda memerlukan private label?',
    plYes: 'Ya, dengan merek saya',
    plNo: 'Tidak',
    message: 'Pesan',
    messageHint: '(ukuran kemasan, aroma, pelabuhan tujuan)',
    submit: 'Kirim permintaan',
    hint: 'Ini akan membuka aplikasi email Anda dengan permintaan yang sudah terisi. Lebih suka WhatsApp?',
    hintLink: 'Kirim pesan via WhatsApp',
    hintJs: 'Selanjutnya, pilih untuk mengirimnya lewat WhatsApp atau email.',
    sendH: 'Permintaan Anda sudah siap. Bagaimana Anda ingin mengirimnya?',
    sendWa: 'Kirim via WhatsApp',
    sendEmail: 'Kirim via Email',
    sendNote: 'Masing-masing membuka aplikasi Anda sendiri dengan pesan yang sudah tertulis, sehingga Anda dapat memeriksanya sebelum mengirim.',
  },

  about: {
    title: 'Tentang GoodBiz Hygiene: Eksportir dan Pemasok Sabun & Produk Perawatan Rumah dari India',
    description:
      'GoodBiz Hygiene adalah divisi ekspor produk perawatan rumah dan kebersihan GoodBiz Global, merchant exporter dari India, sekaligus merek saudara GoodBiz Agro.',
    l1: 'GoodBiz Hygiene.',
    l2: 'Perusahaan {parent}.',
    lead: 'GoodBiz Hygiene adalah divisi ekspor produk perawatan rumah dan kebersihan {parent}, merchant exporter dari India, sekaligus merek saudara GoodBiz Agro.',
    whatH: 'Apa yang dilakukan GoodBiz Hygiene?',
    what1:
      'GoodBiz Hygiene memasok sabun, deterjen, dan produk perawatan rumah kepada importir, distributor, grosir, jaringan supermarket, dan merek private label di luar India. GoodBiz Hygiene tidak memiliki pabrik. Produk bersumber dari produsen India yang telah kami seleksi, dan GoodBiz Hygiene menangani penawaran harga, koordinasi private label, dokumen ekspor, dan pengiriman.',
    what2:
      'Lini produk mencakup barang yang diklasifikasikan di bawah HSN 3401 (sabun) dan HSN 3402 (deterjen serta sediaan pencuci atau pembersih), ditambah barang yang berkaitan erat seperti fenol herbal, dalam lima lini.',
    rangesH: 'Lima lini produk',
    familyH: 'Bagian dari {parent}',
    familyText: '{parent} menjalankan GoodBiz Agro untuk ekspor produk pertanian dan GoodBiz Hygiene untuk sabun dan perawatan rumah.',
    visit: 'Kunjungi',
    basedIn: 'Berkedudukan di',
    founded: 'Didirikan',
    iec: 'Importer Exporter Code (IEC)',
  },

  faqPage: {
    title: 'FAQ: Eksportir dan Pemasok Sabun & Produk Perawatan Rumah dari India',
    description:
      'Jawaban bagi importir yang membeli sabun, deterjen, dan pembersih dari India melalui GoodBiz Hygiene: pengadaan, private label, MOQ, incoterms, dokumen, dan lead time.',
    l1: 'Pertanyaan pembeli.',
    l2: 'Jawaban yang lugas.',
    lead: 'Cara GoodBiz Hygiene mencarikan, menawarkan, dan mengirim sabun serta produk perawatan rumah dari India. Pertanyaan khusus produk dijawab di halaman masing-masing produk.',
    quoteH: 'Masih ada pertanyaan?',
    quoteText: 'Kirimkan bersama permintaan Anda dalam satu baris. Kami akan membalas dengan rincian untuk produk dan pasar Anda.',
  },

  faqs: [
    {
      heading: 'Pengadaan dan produk',
      faqs: [
        {
          q: 'Apakah GoodBiz Hygiene memproduksi sendiri produk yang diekspornya?',
          a: 'Tidak. GoodBiz Hygiene adalah merchant exporter dari India dan perusahaan GoodBiz Global. Perusahaan ini mencarikan sabun, deterjen, dan produk perawatan rumah dari produsen India yang telah diseleksi, lalu menangani penawaran harga, koordinasi private label, dokumen, dan pengiriman bagi pembeli luar negeri.',
        },
        {
          q: 'Produk apa saja yang dipasok GoodBiz Hygiene?',
          a: 'Lima lini: sabun mandi dan sabun perawatan diri, perawatan pakaian, perawatan dapur, pembersih permukaan dan rumah, serta bahan baku industri seperti soap noodles, LABSA, dan SLES. Setiap produk memiliki halaman sendiri berisi spesifikasi tipikal, ukuran kemasan, dan kode HSN-nya.',
        },
        {
          q: 'Kode HSN mana yang berlaku untuk sabun dan produk pembersih?',
          a: 'Sabun termasuk dalam HSN 3401, sedangkan deterjen dan sediaan pencuci atau pembersih termasuk dalam HSN 3402. Situs ini menampilkan kode dalam 6 digit, misalnya 3402 50. Kode ITC-HS 8 digit dikonfirmasi untuk setiap pesanan, dan beberapa produk, seperti pelembut pakaian dan fenol herbal, dapat diklasifikasikan secara berbeda.',
        },
        {
          q: 'Apakah spesifikasi di halaman produk bersifat final?',
          a: 'Tidak. Spesifikasi adalah nilai tipikal untuk grade ekspor. Nilai akhir, seperti bahan aktif, TFM, atau pH, dikonfirmasi dengan produsen untuk setiap pesanan dan dicantumkan dalam penawaran harga.',
        },
      ],
    },
    {
      heading: 'Pemesanan dan private label',
      faqs: [
        {
          q: 'Bisakah saya memesan produk dengan merek saya sendiri?',
          a: 'Bisa. Private label tersedia untuk sebagian besar produk: desain label Anda, pilihan aroma dan warna sepanjang formulasinya memungkinkan, serta ukuran kemasan yang dibutuhkan pasar Anda. Jumlah minimum bergantung pada produk dan kemasan, dan dicantumkan sebagai nilai tipikal di setiap halaman produk.',
        },
        {
          q: 'Bisakah saya menggabungkan berbagai produk dalam satu kontainer?',
          a: 'Bisa. Anda dapat menggabungkan produk dari beberapa lini dalam satu kontainer 20 kaki atau 40 kaki, sehingga Anda dapat mencoba satu lini tanpa harus memenuhi satu kontainer per produk. Komposisinya dikonfirmasi berdasarkan aturan pengemasan dan kompatibilitas saat kami memberikan penawaran.',
        },
        {
          q: 'Bisakah saya meminta sampel sebelum memesan?',
          a: 'Bisa. Sampel dapat diatur untuk sebagian besar produk sebelum Anda mengonfirmasi pesanan. Sebutkan produk dan data kurir Anda dalam permintaan, lalu kami akan mengonfirmasi apa yang dapat dikirim.',
        },
        {
          q: 'Bagaimana cara meminta penawaran?',
          a: 'Gunakan formulir permintaan di halaman kontak, atau kirim pesan WhatsApp atau email berisi produk, ukuran kemasan, jumlah, dan pelabuhan tujuan. Kami akan membalas dengan harga, spesifikasi tipikal, dan lead time.',
        },
      ],
    },
    {
      heading: 'Pengiriman, pembayaran, dan dokumen',
      faqs: [
        { q: 'Incoterms dan ketentuan pembayaran apa yang Anda tawarkan?', a: '{incoterms}.' },
        { q: 'Berapa lama pesanan siap dikirim?', a: '{leadTime}. {port}.' },
        {
          q: 'Dokumen ekspor apa saja yang menyertai pengiriman?',
          a: 'Pengiriman biasanya disertai faktur komersial, packing list, surat keterangan asal, dan bill of lading, ditambah dokumen produk seperti sertifikat analisis (COA) dan lembar data keselamatan bahan (MSDS). Kelengkapan pastinya bergantung pada negara Anda dan dikonfirmasi untuk setiap pesanan.',
        },
        {
          q: 'Apakah Anda mengirim ke negara saya?',
          a: 'GoodBiz Hygiene memberikan penawaran kepada importir, distributor, dan merek private label di sebagian besar negara. Aturan negara tujuan, seperti bahasa pelabelan atau registrasi, diperiksa bersama Anda sebelum pesanan dikonfirmasi.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'Proses Ekspor: Eksportir dan Pemasok Sabun & Produk Perawatan Rumah dari India',
    description:
      'Cara GoodBiz Hygiene mengekspor sabun, deterjen, dan pembersih dari India: penawaran, sampel, incoterms, ketentuan pembayaran, dokumen, pelabuhan, dan lead time tipikal.',
    l1: 'Proses ekspor.',
    l2: 'Dari permintaan hingga bill of lading.',
    lead: 'Langkah, ketentuan, dan dokumen untuk membeli sabun dan produk perawatan rumah dari India melalui GoodBiz Hygiene.',
    stepsLink: 'Enam langkah',
    termsH: 'Apa saja ketentuan ekspornya?',
    termsIncoterms: 'Incoterms dan pembayaran',
    termsPort: 'Pelabuhan',
    termsLead: 'Lead time',
    processL1: 'Apa saja langkah',
    processL2: 'dari permintaan hingga pengiriman?',
    processIntro: 'Enam langkah, dengan persetujuan Anda atas penawaran, sampel, dan proforma invoice sebelum apa pun diproduksi.',
    steps: [
      { name: 'Permintaan', text: 'Kirimkan produk, ukuran kemasan, jumlah, pelabuhan tujuan, dan kebutuhan private label (jika ada) melalui formulir permintaan, email, atau WhatsApp.' },
      { name: 'Penawaran', text: 'Kami menawarkan harga per kemasan beserta spesifikasi tipikal, incoterm yang Anda perlukan, dan lead time. {incoterms}.' },
      { name: 'Sampel dan persetujuan', text: 'Sampel produk dan, untuk private label, contoh cetak desain disetujui sebelum pesanan dikonfirmasi.' },
      { name: 'Proforma invoice dan pembayaran', text: 'Proforma invoice mengonfirmasi produk, jumlah, pengemasan, incoterm, dan ketentuan pembayaran (T/T atau LC).' },
      { name: 'Produksi dan pengemasan', text: 'Produsen memproduksi dan mengemas pesanan, dengan penandaan untuk ekspor dan untuk pasar Anda.' },
      { name: 'Dokumen dan pengiriman', text: 'Kami menyiapkan dokumen ekspor dan memesan pengiriman. {port}.' },
    ],
    docsH: 'Dokumen apa saja yang menyertai pengiriman?',
    docsText: 'Kelengkapan pastinya bergantung pada negara Anda dan dikonfirmasi untuk setiap pesanan.',
    documents: [
      'Faktur komersial',
      'Packing list',
      'Surat keterangan asal',
      'Bill of lading (angkutan laut)',
      'Sertifikat analisis (COA)',
      'Lembar data keselamatan bahan (MSDS)',
    ],
    faqH: 'Proses ekspor: pertanyaan yang sering diajukan pembeli',
    faqs: [
      { q: 'Incoterms apa yang Anda tawarkan?', a: '{incoterms}.' },
      { q: 'Dari pelabuhan mana pengiriman berangkat?', a: '{port}. Pelabuhan dipilih berdasarkan produk, lokasi produsen, dan tujuan Anda, lalu dicantumkan dalam penawaran harga.' },
      { q: 'Berapa lama lead time-nya?', a: '{leadTime}.' },
      {
        q: 'Dokumen apa saja yang disertakan?',
        a: 'Pengiriman biasanya disertai faktur komersial, packing list, surat keterangan asal, dan bill of lading (angkutan laut), ditambah COA dan MSDS jika produk memerlukannya. Negara Anda mungkin memerlukan dokumen tambahan, seperti sertifikat kesehatan atau faktur yang dilegalisasi; hal ini disepakati untuk setiap pesanan.',
      },
      {
        q: 'Kode HSN mana yang dicantumkan pada faktur?',
        a: 'Situs ini menampilkan kode HSN dalam 6 digit, misalnya 3402 50. Kode ITC-HS 8 digit dikonfirmasi untuk setiap pesanan. Pelembut pakaian dan fenol herbal dapat masuk dalam klasifikasi alternatif (3809 91 dan 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Sabun & Produk Pembersih Private Label: Eksportir dan Pemasok dari India',
    description:
      'Sabun, deterjen, dan pembersih private label dari India: desain, aroma, warna, dan ukuran kemasan sesuai Anda, dibuat produsen India terseleksi dan diekspor oleh GoodBiz Hygiene.',
    l1: 'Sabun private label',
    l2: 'dan produk pembersih dari India.',
    lead: 'Jual sabun, deterjen, dan pembersih dengan merek Anda sendiri. GoodBiz Hygiene mencocokkan kebutuhan Anda dengan produsen India terseleksi, mengelola sampel dan desain, lalu mengirim barang jadi ke pelabuhan Anda.',
    renderAlt: 'Ilustrasi sabun batang dan botol sabun cuci tangan dalam kemasan private label yang umum',
    startBrief: 'Mulai brief Anda',
    howRuns: 'Cara kerja pesanan',
    optionsH: 'Apa yang dapat disesuaikan?',
    optionsText: 'Empat pilihan menjadikan lini produk ini milik Anda. Masing-masing Anda setujui sebelum produksi massal.',
    options: [
      {
        title: 'Merek Anda pada kemasan',
        text: 'Label, sleeve, karton, atau pembungkus dicetak dengan desain Anda. Kami mengirim berkas Anda ke produsen dan mengembalikan contoh cetak untuk disetujui sebelum pencetakan.',
      },
      {
        title: 'Aroma dan warna',
        text: 'Pilih dari aroma dan warna yang umumnya tersedia untuk setiap produk, seperti lemon, lavender, mawar, atau mimba. Perubahan di luar lini standar diperiksa terlebih dahulu dengan produsen.',
      },
      {
        title: 'Ukuran dan format kemasan',
        text: 'Botol ritel, isi ulang, kantong, sabun batang, serta jerigen atau drum curah, dipilih sesuai rak dan titik harga Anda. Setiap halaman produk mencantumkan ukuran kemasan tipikalnya.',
      },
      {
        title: 'Grade dan spesifikasi',
        text: 'Pilih grade yang diharapkan pasar Anda, misalnya TFM untuk sabun mandi atau bahan aktif untuk deterjen. Nilai tipikal ditampilkan di halaman produk dan nilai akhir dicantumkan dalam penawaran harga Anda.',
      },
    ],
    processL1: 'Cara kerja pesanan',
    processL2: 'private label.',
    processIntro: 'Lima langkah dari brief Anda hingga barang tiba di pelabuhan Anda, dengan persetujuan Anda atas sampel dan desain sebelum apa pun dibuat.',
    steps: [
      { name: 'Sampaikan brief Anda', text: 'Produk, ukuran kemasan, aroma, pasar sasaran, dan perkiraan jumlah.' },
      { name: 'Penawaran dan pencocokan produsen', text: 'Kami mencocokkan brief dengan produsen India yang telah kami seleksi dan menawarkan harga per kemasan, lengkap dengan incoterms dan lead time.' },
      { name: 'Sampel dan desain', text: 'Anda menyetujui sampel produk dan contoh cetak desain Anda. Produksi umumnya dimulai setelah Anda menyetujui keduanya.' },
      { name: 'Produksi dan pengemasan', text: 'Produsen memproduksi dan mengemas pesanan Anda dengan merek Anda, dengan penandaan untuk ekspor.' },
      { name: 'Dokumen dan pengiriman', text: 'Kami menyiapkan dokumen ekspor dan memesan pengiriman. {port}.' },
    ],
    faqH: 'Private label: pertanyaan yang sering diajukan pembeli',
    faqs: [
      {
        q: 'Berapa pesanan minimum untuk private label?',
        a: 'Tergantung pada produk dan kemasan. Untuk sebagian besar produk tidak ada pesanan minimum yang tetap, meskipun desain private label dapat memiliki minimum tersendiri untuk label atau karton cetak. Sebutkan jumlah Anda dan kami akan menawarkan harganya.',
      },
      {
        q: 'Siapa pemilik desain dan merek?',
        a: 'Desain tetap milik Anda; ketentuan penggunaan disepakati untuk setiap pesanan. GoodBiz Hygiene mengoordinasikan pencetakan dengan produsen.',
      },
      {
        q: 'Bisakah saya menggabungkan produk private label dan produk standar dalam satu kontainer?',
        a: 'Bisa. Lini private label dapat berbagi kontainer dengan produk lain dari lini GoodBiz Hygiene, dengan syarat aturan pengemasan dan kompatibilitas yang dikonfirmasi saat penawaran.',
      },
      {
        q: 'Berapa lama pesanan private label diproses?',
        a: '{leadTime}. Pesanan pertama sudah termasuk waktu untuk menyetujui sampel dan desain; pesanan ulang biasanya lebih cepat.',
      },
      {
        q: 'Apakah GoodBiz Hygiene memproduksi produknya sendiri?',
        a: 'Tidak. GoodBiz Hygiene adalah merchant exporter dari India. Produk dibuat oleh produsen India yang telah diseleksi, dan GoodBiz Hygiene mengelola brief, persetujuan, dokumen, dan pengiriman.',
      },
    ],
    quoteH: 'Mulai brief Anda.',
    quoteText: 'Kirimkan produk, kemasan, dan pasar yang Anda bayangkan dalam satu baris. Kami akan membalas dengan pilihan, harga, dan lead time.',
  },

  notFound: {
    title: 'Halaman tidak ditemukan',
    description: 'Halaman ini tidak ditemukan. Jelajahi sabun dan produk perawatan rumah GoodBiz Hygiene atau minta penawaran.',
    l1: 'Halaman ini tidak ada',
    l2: 'di rak kami.',
    lead: 'Tautan mungkin sudah lama atau salah ketik. Seluruh lini produk hanya berjarak satu klik.',
    sprayAlt: 'Ilustrasi botol pembersih semprot',
  },
};

export default id;
