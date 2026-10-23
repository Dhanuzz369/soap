/**
 * Portuguese UI strings (Brazilian Portuguese, professional register; readable in Angola and Mozambique).
 * Source: src/i18n/ui/en.ts. Rules: docs/i18n-translator-guide.md.
 */
import type { UiPartial } from './types.ts';

/** Set by `npm run i18n:stamp`: the English dictionary this file was translated from. */
export const sourceHash = '2d63fbf41757';

const pt: UiPartial = {
  meta: {
    tagline: 'Sabonetes e produtos de limpeza doméstica, exportados da Índia',
  },

  terms: {
    incoterms: 'FOB, CIF e CFR disponíveis; condições de pagamento acordadas a cada pedido (T/T ou LC)',
    payment: 'Acordadas a cada pedido (T/T ou LC)',
    port: 'Embarque nos principais portos indianos',
    leadTime: 'Normalmente de 3 a 5 semanas após a confirmação do pedido, conforme as exigências de marca própria',
  },

  common: {
    skip: 'Ir para o conteúdo',
    home: 'Início',
    products: 'Produtos',
    blog: 'Guias',
    breadcrumb: 'Trilha de navegação',
    requestQuote: 'Solicitar cotação',
    viewProducts: 'Ver produtos',
    exporterLine: 'Exportador e fornecedor da Índia',
    hsn: 'HSN',
    hsnTitle: 'Sistema Harmonizado de Nomenclatura',
    allProducts: 'Todos os produtos',
    allGuides: 'Todos os guias',
    productsCount: 'Produtos: {n}',
    minRead: '{n} min de leitura',
    readFaq: 'Ler as perguntas frequentes',
    straightAnswers: 'Respostas diretas.',
    buyerFaq: 'Perguntas frequentes do comprador',
    faqDefault: 'Perguntas dos compradores',
    exportProcessFull: 'O processo de exportação completo',
    renderAlt: 'Ilustração de {nameLower} em uma embalagem de exportação típica',
    drawingAlt: 'Ilustração de {nameLower}',
    photoAlt: '{name} da GoodBiz',
    categoryRenderAlt: 'Ilustração de embalagens típicas de {nameLower}',
    rangeAlt: 'Ilustração da linha GoodBiz Hygiene em embalagens de exportação típicas',
    portAlt: 'Guindastes de pórtico carregando um navio porta-contêineres à noite no Terminal Internacional de Transbordo de Contêineres de Kochi, na Índia',
    portCaption: 'Terminal de contêineres, Kochi. Foto: {creator}, {license}.',
    specCaption: 'Especificações típicas. Os valores finais são confirmados a cada pedido.',
  },

  header: {
    homeAria: '{name}, página inicial',
    menu: 'Menu',
    mainNav: 'Principal',
    mainNavMobile: 'Principal (celular)',
    nav: {
      products: 'Produtos',
      privateLabel: 'Marca própria',
      exportProcess: 'Processo de exportação',
      guides: 'Guias do comprador',
      about: 'Sobre',
      faq: 'Perguntas frequentes',
    },
  },

  footer: {
    tag: 'Limpeza que vem da Índia',
    lede: 'Sabonetes e produtos de limpeza doméstica, adquiridos de fabricantes indianos selecionados e exportados pela GoodBiz Hygiene, uma empresa {parent}.',
    nav: 'Rodapé',
    products: 'Produtos',
    company: 'Empresa',
    contact: 'Contato',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, uma empresa {parent}. Exportador comercial da Índia.',
    backToTop: 'Voltar ao topo',
  },

  lang: {
    label: 'Idioma',
    menuAria: 'Escolher um idioma. Idioma atual: {name}',
    more: 'Mais idiomas…',
    moreTitle: 'Abre esta página no Google Tradutor (tradução automática)',
  },

  whatsapp: {
    aria: 'Conversar com a GoodBiz Hygiene pelo WhatsApp',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Adicionar à consulta',
    addAria: 'Adicionar à consulta: {name}',
    noteH: 'Misture tudo em um só contêiner.',
    noteText: 'Combine estes itens com produtos de outras linhas em um contêiner de 20 ou 40 pés. Confirmamos a combinação ao enviar a cotação.',
  },

  quote: {
    heading: 'Solicite uma cotação.',
    text: 'Diga em uma linha o que você precisa. O formulário de consulta abre já preenchido, pronto para receber seus produtos, a quantidade e o porto.',
    placeholder: 'ex.: 1 contêiner de 20 pés de detergente para louças, limão, 500 ml',
    label: 'O que você precisa?',
    submit: 'Iniciar consulta',
  },

  ld: {
    hsnCode: 'Código HSN',
    variants: 'Variedades',
    packSizes: 'Tamanhos de embalagem',
  },

  home: {
    title: 'Exportador e fornecedor de sabonetes e produtos de limpeza doméstica da Índia',
    description:
      'A GoodBiz Hygiene, empresa do grupo GoodBiz Global, exporta sabonetes, detergentes e produtos de limpeza de fabricantes indianos selecionados, com marca própria e contêineres mistos.',
    eyebrow: 'Sabonetes · Detergentes · Limpeza doméstica',
    h1a: 'Sabonetes e limpeza doméstica',
    h1b: 'Exportados da Índia.',
    text: 'A GoodBiz Hygiene é um exportador comercial: adquirimos sabonetes, detergentes e produtos de limpeza de fabricantes indianos selecionados, com marca própria e contêineres mistos.',
    rangeH: 'A linha de produtos.',
    rangeIntro: 'Três de {n} produtos. Cada um tem página própria, com especificações típicas, tamanhos de embalagem e opções de marca própria.',
    rangeAll: 'Ver todos os {n} produtos',
    processL1: 'Como funcionam',
    processL2: 'os pedidos de exportação.',
    processIntro:
      'Um único exportador comercial entre você e o fabricante: cotação, amostras, documentação e embarque, da primeira mensagem ao conhecimento de embarque.',
    steps: [
      {
        name: 'Especificação e amostras',
        text: 'Envie os produtos, os tamanhos de embalagem, a quantidade e o porto de destino. Cotamos o preço por embalagem, com especificações típicas e prazos, e providenciamos amostras para sua aprovação.',
      },
      {
        name: 'Seleção do fabricante e marca própria',
        text: 'Associamos sua solicitação a um fabricante indiano selecionado. Na marca própria, sua arte, sua fragrância e suas embalagens são aprovadas antes da produção em escala.',
      },
      {
        name: 'Documentos e embarque',
        text: 'O fabricante produz e embala o pedido enquanto preparamos a fatura, a lista de embalagem, o certificado de origem, o COA e a MSDS. {port}. {leadTime}.',
      },
    ],
    catsH: 'As categorias.',
    catsText: 'Cinco linhas sob os códigos HSN 3401 e 3402. Misture-as em um único contêiner de 20 ou 40 pés.',
    tileMeta: '{n} produtos · HSN {hsn}',
    answersMore: 'Mais respostas na página de perguntas frequentes',
    statementA: 'Selecionado com critério,',
    statementB: 'embarcado com confiança.',
    statementLead:
      'Todo pedido da GoodBiz Hygiene é associado a um fabricante indiano selecionado, conferido com a amostra que você aprovou e embarcado com a documentação de exportação completa. É assim que trabalhamos em todos os pedidos, de qualquer tamanho.',
    promises: [
      { title: 'Somente fabricantes selecionados', text: 'Cada produto vem de um fabricante indiano que avaliamos quanto a qualidade, consistência e experiência em exportação.' },
      { title: 'Sua amostra, reproduzida', text: 'A fórmula, a fragrância e a embalagem que você aprova são as que seguem no embarque, conferidas com a sua amostra antes do carregamento.' },
      { title: 'Documentação bem feita', text: 'Fatura, lista de embalagem, certificado de origem, COA e MSDS preparados para cada embarque, prontos para o seu despachante aduaneiro.' },
      { title: 'Um só parceiro, de porto a porto', text: 'Uma única cotação e um único ponto de contato, da primeira amostra ao conhecimento de embarque, para todos os produtos do seu pedido.' },
    ],
    guidesH: 'Guias do comprador',
    fanTabs: 'Escolher uma linha',
    fanShow: 'Mostrar {name}',
    fanView: 'Ver a linha',
    fanOpen: '{name}: ver a linha',
  },

  productsIndex: {
    title: 'Exportador e fornecedor de sabonetes, detergentes e produtos de limpeza da Índia',
    description:
      'Conheça {n} produtos de sabonete, lavanderia, cozinha, limpeza de superfícies e matérias-primas de fabricantes indianos selecionados, com códigos HSN e marca própria.',
    hsnLink: 'Códigos HSN por produto',
    rangeFull: 'A linha completa',
    hsnH: 'Qual código HSN se aplica a cada produto?',
    hsnText:
      'Os códigos são exibidos com 6 dígitos. O código ITC-HS de 8 dígitos é confirmado a cada pedido, e alguns produtos têm classificações alternativas (veja a página de cada produto).',
    hsnCaption: 'Visão geral do HSN por produto, agrupada por linha',
    colProduct: 'Produto',
    colRange: 'Linha',
    colHsn: 'HSN (6 dígitos)',
    h1a: 'Cada produto,',
    h1b: 'um só parceiro de exportação.',
    shelfLead: '{n} produtos em {r} linhas, sob HSN 3401 e 3402, com marca própria e contêineres mistos.',
    shelfAria: 'Vitrine de produtos',
    jumpNav: 'Ir para uma linha',
    shelfPause: 'Pausar a vitrine',
  },

  product: {
    hsnAlt: 'Classificação alternativa indicada abaixo',
    hsnConfirmed: 'Código ITC-HS de 8 dígitos confirmado a cada pedido',
    factsH: 'Dados principais para compradores',
    hsnCode: 'Código HSN',
    hsnNoteDefault: 'O código ITC-HS de 8 dígitos é confirmado a cada pedido.',
    moq: 'Quantidade mínima de pedido',
    privateLabel: 'Marca própria',
    plAvailable: 'Disponível.',
    plNot: 'Não oferecida para este produto.',
    varH: 'Variedades, tamanhos de embalagem e acondicionamento',
    variants: 'Variedades disponíveis',
    variantsAria: 'Variedades',
    packSizes: 'Tamanhos de embalagem',
    packaging: 'Opções de acondicionamento',
    galleryH: 'Mais fragrâncias, em fotos',
    specH: 'Quais são as especificações típicas?',
    specNote: '{name}: valores típicos para os graus de exportação. Os valores finais são confirmados com o fabricante a cada pedido.',
    aboutAria: 'Sobre {name}',
    loadH: 'Carregamento do contêiner (aprox.)',
    loadText: 'Valores aproximados; o plano final de carregamento é confirmado a cada pedido.',
    ft20: 'Contêiner de 20 pés',
    ft40: 'Contêiner de 40 pés',
    guidesH: 'Guias do comprador para este produto',
    relatedH: 'Produtos relacionados',
    relatedAll: 'Ver tudo em {nameLower}',
    quoteH: 'Cote este produto.',
    quoteText: 'Informe em uma linha a variedade de {nameLower}, o tamanho da embalagem, a quantidade e o porto de destino. O formulário de consulta abre já preenchido.',
  },

  category: {
    title: '{name}: exportador e fornecedor da Índia',
    hsnMeta: '{n} produtos · código ITC-HS de 8 dígitos confirmado a cada pedido',
    seeProducts: 'Ver os {n} produtos',
    productsH: 'Quais produtos de {nameLower} fornecemos?',
    quoteH: 'Solicite cotação de {nameLower}.',
  },

  blogIndex: {
    title: 'Guias de exportação para compradores de sabonetes e produtos de limpeza',
    description:
      'Guias práticos para importadores de sabonetes, detergentes e produtos de limpeza doméstica da Índia: códigos HSN, MOQ, documentos, marca própria e embarque.',
    l1: 'Guias do comprador.',
    l2: 'Para importar sabonetes e limpeza doméstica.',
    lead: 'Notas em linguagem simples para importadores e distribuidores: classificação, custos, documentos e escolha de produtos.',
    latest: 'Artigos recentes',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Respostas rápidas',
    relatedH: 'Produtos citados neste guia',
    quoteH: 'Está planejando um pedido?',
    quoteText: 'Diga em uma linha o que você precisa. O formulário de consulta abre já preenchido, pronto para receber seus produtos, a quantidade e o porto.',
  },

  contact: {
    title: 'Solicitar cotação: exportador e fornecedor de sabonetes e limpeza doméstica da Índia',
    description:
      'Solicite uma cotação à GoodBiz Hygiene para sabonetes, detergentes e produtos de limpeza doméstica da Índia. Envie produtos, embalagens e porto por e-mail ou WhatsApp.',
    l1: 'Solicite uma cotação.',
    l2: 'Da Índia ao seu porto.',
    lead: 'Diga-nos o que você precisa: produtos, tamanhos de embalagem, quantidade e porto de destino. A GoodBiz Hygiene responde com preços, especificações típicas e prazos.',
    start: 'Iniciar a consulta',
    waMessage: 'Fale conosco pelo WhatsApp',
    formH: 'Formulário de consulta',
    asideAria: 'Outras formas de contato',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    phone: 'Telefone',
    office: 'Escritório',
    terms: 'Condições de exportação',
    oftenH: 'Frequentemente cotados juntos',
    oftenText: 'Toque em “Adicionar à consulta” em um cartão para marcar esse produto no formulário acima.',
  },

  form: {
    name: 'Seu nome',
    company: 'Empresa',
    country: 'País',
    email: 'E-mail',
    phone: 'WhatsApp ou telefone',
    phoneHint: '(com código do país)',
    quantity: 'Quantidade',
    choose: 'Escolha uma opção',
    quantities: [
      'Amostras ou quantidade para teste',
      'Parte de um contêiner misto',
      '1 contêiner de 20 pés',
      '1 contêiner de 40 pés',
      'Vários contêineres ou fornecimento regular',
      'Ainda não tenho certeza',
    ],
    productsLegend: 'Produtos de interesse',
    chooseAny: '(escolha quantos quiser)',
    plLegend: 'Você precisa de marca própria?',
    plYes: 'Sim, com a minha marca',
    plNo: 'Não',
    message: 'Mensagem',
    messageHint: '(tamanhos de embalagem, fragrâncias, porto de destino)',
    submit: 'Enviar consulta',
    hint: 'Isto abre o seu aplicativo de e-mail com a consulta preenchida. Prefere o WhatsApp?',
    hintLink: 'Fale conosco pelo WhatsApp',
    hintJs: 'Em seguida, escolha enviar pelo WhatsApp ou por e-mail.',
    sendH: 'Sua consulta está pronta. Como deseja enviá-la?',
    sendWa: 'Enviar pelo WhatsApp',
    sendEmail: 'Enviar por e-mail',
    sendNote: 'Cada opção abre o seu próprio aplicativo com a mensagem já escrita, para que você a confira antes de enviar.',
  },

  about: {
    title: 'Sobre a GoodBiz Hygiene: exportador e fornecedor de sabonetes e limpeza doméstica da Índia',
    description:
      'A GoodBiz Hygiene é a divisão de exportação de limpeza doméstica e higiene da GoodBiz Global, exportador comercial da Índia, e marca irmã da GoodBiz Agro.',
    l1: 'GoodBiz Hygiene.',
    l2: 'Uma empresa {parent}.',
    lead: 'A GoodBiz Hygiene é a divisão de exportação de limpeza doméstica e higiene da {parent}, exportador comercial da Índia, e marca irmã da GoodBiz Agro.',
    whatH: 'O que faz a GoodBiz Hygiene?',
    what1:
      'A GoodBiz Hygiene fornece sabonetes, detergentes e produtos de limpeza doméstica a importadores, distribuidores, atacadistas, redes de supermercados e marcas próprias fora da Índia. Ela não possui fábrica. Os produtos são adquiridos de fabricantes indianos selecionados, e a GoodBiz Hygiene cuida da cotação, da coordenação da marca própria, dos documentos de exportação e do embarque.',
    what2:
      'A linha abrange produtos classificados no HSN 3401 (sabonetes) e no HSN 3402 (detergentes e preparações para lavagem ou limpeza), além de itens muito próximos, como o fenol de ervas, em cinco linhas.',
    rangesH: 'As cinco linhas',
    familyH: 'Parte da {parent}',
    familyText: 'A {parent} opera a GoodBiz Agro, para exportações agrícolas, e a GoodBiz Hygiene, para sabonetes e limpeza doméstica.',
    visit: 'Visite',
    basedIn: 'Sede em',
    founded: 'Fundação',
    iec: 'Código de Importador e Exportador (IEC)',
  },

  faqPage: {
    title: 'Perguntas frequentes: exportador e fornecedor de sabonetes e limpeza doméstica da Índia',
    description:
      'Respostas para importadores que compram sabonetes, detergentes e limpadores da Índia pela GoodBiz Hygiene: fornecimento, marca própria, MOQ, incoterms, documentos e prazos.',
    l1: 'Perguntas dos compradores.',
    l2: 'Respostas diretas.',
    lead: 'Como a GoodBiz Hygiene adquire, cota e embarca sabonetes e produtos de limpeza doméstica da Índia. As dúvidas específicas de cada produto são respondidas na página do produto.',
    quoteH: 'Ainda tem uma dúvida?',
    quoteText: 'Envie-a junto com a sua consulta, em uma linha. Respondemos com os detalhes dos seus produtos e do seu mercado.',
  },

  faqs: [
    {
      heading: 'Fornecimento e produtos',
      faqs: [
        {
          q: 'A GoodBiz Hygiene fabrica os produtos que exporta?',
          a: 'Não. A GoodBiz Hygiene é um exportador comercial da Índia e uma empresa do grupo GoodBiz Global. Ela adquire sabonetes, detergentes e produtos de limpeza doméstica de fabricantes indianos selecionados e cuida da cotação, da coordenação da marca própria, dos documentos e do embarque para compradores no exterior.',
        },
        {
          q: 'Quais produtos a GoodBiz Hygiene fornece?',
          a: 'Cinco linhas: sabonetes de banho e de uso pessoal, cuidado com a roupa, cuidado com a cozinha, limpadores de superfícies e de uso doméstico e matérias-primas industriais, como noodles de sabão, LABSA e SLES. Cada produto tem página própria, com especificações típicas, tamanhos de embalagem e código HSN.',
        },
        {
          q: 'Quais códigos HSN se aplicam a sabonetes e produtos de limpeza?',
          a: 'Os sabonetes se enquadram no HSN 3401, e os detergentes e as preparações para lavagem ou limpeza, no HSN 3402. O site exibe os códigos com 6 dígitos, por exemplo 3402 50. O código ITC-HS de 8 dígitos é confirmado a cada pedido, e alguns produtos, como o amaciante e o fenol de ervas, podem ter classificação diferente.',
        },
        {
          q: 'As especificações das páginas dos produtos são definitivas?',
          a: 'Não. As especificações são valores típicos para os graus de exportação. Os valores finais, como matéria ativa, TFM ou pH, são confirmados com o fabricante a cada pedido e indicados na cotação.',
        },
      ],
    },
    {
      heading: 'Pedidos e marca própria',
      faqs: [
        {
          q: 'Posso encomendar produtos com a minha própria marca?',
          a: 'Sim. A marca própria está disponível na maioria dos produtos: a arte do seu rótulo, a escolha de fragrância e cor quando a formulação permite e os tamanhos de embalagem de que o seu mercado precisa. As quantidades mínimas dependem do produto e da embalagem e constam, como valores típicos, na página de cada produto.',
        },
        {
          q: 'Posso combinar produtos diferentes em um mesmo contêiner?',
          a: 'Sim. Você pode consolidar produtos de várias linhas em um contêiner de 20 ou 40 pés, o que permite testar uma linha sem ter de encher um contêiner por produto. A combinação é confirmada, na cotação, conforme as regras de acondicionamento e de compatibilidade.',
        },
        {
          q: 'Posso receber amostras antes de fazer o pedido?',
          a: 'Sim. É possível providenciar amostras da maioria dos produtos antes de você confirmar um pedido. Informe na consulta os produtos e os dados da sua transportadora, e confirmaremos o que pode ser enviado.',
        },
        {
          q: 'Como solicito uma cotação?',
          a: 'Use o formulário de consulta da página de contato ou envie uma mensagem por WhatsApp ou e-mail com os produtos, os tamanhos de embalagem, a quantidade e o porto de destino. Respondemos com preços, especificações típicas e prazos.',
        },
      ],
    },
    {
      heading: 'Embarque, pagamento e documentos',
      faqs: [
        { q: 'Quais incoterms e condições de pagamento vocês oferecem?', a: '{incoterms}.' },
        { q: 'Quanto tempo leva para um pedido ser embarcado?', a: '{leadTime}. {port}.' },
        {
          q: 'Quais documentos de exportação acompanham um embarque?',
          a: 'Os embarques normalmente seguem com fatura comercial, lista de embalagem, certificado de origem e conhecimento de embarque, além de documentos do produto, como o certificado de análise (COA) e a ficha de dados de segurança (MSDS). O conjunto exato depende do seu país e é confirmado a cada pedido.',
        },
        {
          q: 'Vocês enviam para o meu país?',
          a: 'A GoodBiz Hygiene cota para importadores, distribuidores e marcas próprias na maioria dos países. As regras do destino, como idioma da rotulagem ou registro, são verificadas com você antes da confirmação do pedido.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'Processo de exportação: exportador e fornecedor de sabonetes e limpeza doméstica da Índia',
    description:
      'Como a GoodBiz Hygiene exporta sabonetes, detergentes e limpadores da Índia: cotação, amostras, incoterms, condições de pagamento, documentos, portos e prazos típicos.',
    lead: 'As etapas, as condições e os documentos para comprar sabonetes e produtos de limpeza doméstica da Índia pela GoodBiz Hygiene.',
    route: {
      h1a: 'Dos portos da Índia,',
      h1b: 'aos seus.',
      regionsLabel: 'Escolha uma região de destino',
      regions: {
        gulf: 'Golfo e Oriente Médio',
        eastAfrica: 'África Oriental',
        westAfrica: 'África Ocidental',
        europe: 'Europa',
        southeastAsia: 'Sudeste Asiático',
        latinAmerica: 'América Latina',
      },
      ports: {
        nhavaSheva: 'Nhava Sheva (Mumbai)',
        mundra: 'Mundra',
        chennai: 'Chennai',
        jebelAli: 'Jebel Ali',
        mombasa: 'Mombaça',
        lagos: 'Lagos',
        tema: 'Tema',
        rotterdam: 'Roterdã',
        singapore: 'Singapura',
        jakarta: 'Jacarta',
        santos: 'Santos',
      },
      lane: '{from} → {to}',
      laneAll: 'Portos da Índia → o seu porto',
      terms: 'FOB, CIF ou CFR · {leadTime}',
      illustrative: 'Rotas ilustrativas.',
      credit: 'Dados do mapa: Natural Earth (domínio público)',
      mapAlt: 'Mapa de rotas marítimas ilustrativas de Nhava Sheva, Mundra e Chennai para portos em seis regiões',
      pause: 'Pausar a sequência de rotas',
      timelineAria: 'Do pedido à partida do navio',
      timeline: ['Pedido confirmado', 'Produção e embalagem', 'Documentos', 'Embarque e partida'],
    },
    stepsLink: 'As seis etapas',
    termsH: 'Quais são as condições de exportação?',
    termsIncoterms: 'Incoterms e pagamento',
    termsPort: 'Porto',
    termsLead: 'Prazo',
    processL1: 'Quais são as etapas',
    processL2: 'da consulta ao embarque?',
    processIntro: 'Seis etapas, com a sua aprovação da cotação, das amostras e da fatura proforma antes de qualquer produção.',
    steps: [
      { name: 'Consulta', text: 'Envie os produtos, os tamanhos de embalagem, a quantidade, o porto de destino e eventuais necessidades de marca própria, pelo formulário de consulta, por e-mail ou pelo WhatsApp.' },
      { name: 'Cotação', text: 'Cotamos o preço por embalagem, com especificações típicas, o incoterm de que você precisa e o prazo. {incoterms}.' },
      { name: 'Amostras e aprovações', text: 'As amostras dos produtos e, na marca própria, as provas da arte são aprovadas antes da confirmação do pedido.' },
      { name: 'Fatura proforma e pagamento', text: 'Uma fatura proforma confirma produtos, quantidades, acondicionamento, incoterm e condições de pagamento (T/T ou LC).' },
      { name: 'Produção e embalagem', text: 'O fabricante produz e embala o pedido, com marcação para exportação e para o seu mercado.' },
      { name: 'Documentos e embarque', text: 'Preparamos os documentos de exportação e reservamos o embarque. {port}.' },
    ],
    docsH: 'Quais documentos acompanham um embarque?',
    docsText: 'O conjunto exato depende do seu país e é confirmado a cada pedido.',
    documents: [
      'Fatura comercial',
      'Lista de embalagem',
      'Certificado de origem',
      'Conhecimento de embarque (frete marítimo)',
      'Certificado de análise (COA)',
      'Ficha de dados de segurança (MSDS)',
    ],
    faqH: 'Processo de exportação: perguntas dos compradores',
    faqs: [
      { q: 'Quais incoterms vocês oferecem?', a: '{incoterms}.' },
      { q: 'De qual porto saem os embarques?', a: '{port}. O porto é escolhido conforme o produto, a localização do fabricante e o seu destino, e indicado na cotação.' },
      { q: 'Qual é o prazo?', a: '{leadTime}.' },
      {
        q: 'Quais documentos estão incluídos?',
        a: 'Os embarques normalmente seguem com fatura comercial, lista de embalagem, certificado de origem e conhecimento de embarque (frete marítimo), além de COA e MSDS quando o produto os exige. O seu país pode exigir outros, como certificado sanitário ou fatura legalizada; isso é combinado a cada pedido.',
      },
      {
        q: 'Qual código HSN vai na fatura?',
        a: 'O site exibe os códigos HSN com 6 dígitos, por exemplo 3402 50. O código ITC-HS de 8 dígitos é confirmado a cada pedido. O amaciante e o fenol de ervas podem se enquadrar em classificações alternativas (3809 91 e 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Sabonetes e produtos de limpeza com marca própria: exportador e fornecedor da Índia',
    description:
      'Sabonetes, detergentes e limpadores com marca própria da Índia: sua arte, fragrância, cor e embalagens, fabricados por indianos selecionados e exportados pela GoodBiz Hygiene.',
    lead: 'Venda sabonetes, detergentes e limpadores com a sua própria marca. A GoodBiz Hygiene associa a sua solicitação a um fabricante indiano selecionado, cuida das amostras e da arte e embarca os produtos acabados até o seu porto.',
    hero: {
      h1a: 'Sua marca,',
      h1b: 'com origem e embarque na Índia.',
      cta: 'Iniciar uma consulta de marca própria',
      placeholder: 'Sua Marca',
      inputLabel: 'Digite o nome da sua marca',
      colourLegend: 'Cor do rótulo',
      colourways: { sage: 'Sálvia', ocean: 'Oceano', blush: 'Rosé' },
      packAlt: 'Ilustração de um frasco com válvula pump e um cartucho dobrável com um rótulo em branco exibindo um nome de marca',
      caption: 'Ilustração de uma embalagem típica de marca própria.',
      message: 'Consulta de marca própria: queremos vender com a nossa marca “{brand}”.',
      messageNoBrand: 'Consulta de marca própria: queremos vender com a nossa própria marca.',
      stepsAria: 'Um pedido de marca própria em quatro etapas',
      steps: ['Briefing', 'Prova de arte', 'Amostra aprovada', 'Embarcado'],
    },
    optionsH: 'O que pode ser personalizado?',
    optionsText: 'Quatro escolhas tornam uma linha sua. Cada uma é aprovada por você antes da produção em escala.',
    options: [
      {
        title: 'Sua marca na embalagem',
        text: 'Rótulo, cinta, caixa ou envoltório impressos com a sua arte. Enviamos os seus arquivos ao fabricante e devolvemos uma prova para aprovação antes da impressão.',
      },
      {
        title: 'Fragrância e cor',
        text: 'Escolha entre as fragrâncias e cores em que cada produto é normalmente fabricado, como limão, lavanda, rosa ou nim. Alterações fora da linha padrão são verificadas antes com o fabricante.',
      },
      {
        title: 'Tamanhos e formatos de embalagem',
        text: 'Frascos para varejo, refis, sachês, barras e galões ou tambores a granel, escolhidos de acordo com a sua prateleira e o seu preço-alvo. A página de cada produto lista os tamanhos de embalagem típicos.',
      },
      {
        title: 'Grau e especificação',
        text: 'Escolha o grau que o seu mercado espera, por exemplo o TFM do sabonete de banho ou a matéria ativa dos detergentes. Os valores típicos aparecem nas páginas dos produtos, e os valores finais constam da sua cotação.',
      },
    ],
    processL1: 'Como um pedido',
    processL2: 'de marca própria transcorre.',
    processIntro: 'Cinco etapas, da sua solicitação até a mercadoria no seu porto, com a sua aprovação da amostra e da arte antes de qualquer fabricação.',
    steps: [
      { name: 'Envie a sua solicitação', text: 'Produtos, tamanhos de embalagem, fragrâncias, mercado-alvo e uma estimativa de quantidade.' },
      { name: 'Cotação e seleção do fabricante', text: 'Associamos a solicitação a um fabricante indiano selecionado e cotamos por embalagem, com incoterms e prazo.' },
      { name: 'Amostras e arte', text: 'Você aprova uma amostra do produto e uma prova impressa da sua arte. A produção normalmente começa depois que você aprova ambas.' },
      { name: 'Produção e embalagem', text: 'O fabricante produz e embala o seu pedido com a sua marca, com marcação para exportação.' },
      { name: 'Documentos e embarque', text: 'Preparamos os documentos de exportação e reservamos o embarque. {port}.' },
    ],
    faqH: 'Marca própria: perguntas dos compradores',
    faqs: [
      {
        q: 'Qual é o pedido mínimo para marca própria?',
        a: 'Depende do produto e da embalagem. Para a maioria dos produtos não há pedido mínimo fixo, embora um projeto de marca própria possa ter mínimo próprio para rótulos ou caixas impressos. Informe a sua quantidade e faremos a cotação.',
      },
      {
        q: 'De quem são a arte e a marca?',
        a: 'A arte continua sendo sua; as condições de uso são combinadas a cada pedido. A GoodBiz Hygiene coordena a impressão com o fabricante.',
      },
      {
        q: 'Posso misturar marca própria e produtos padrão em um mesmo contêiner?',
        a: 'Sim. As linhas de marca própria podem compartilhar um contêiner com outros produtos da linha GoodBiz Hygiene, observadas as regras de acondicionamento e de compatibilidade confirmadas na cotação.',
      },
      {
        q: 'Quanto tempo leva um pedido de marca própria?',
        a: '{leadTime}. O primeiro pedido inclui o tempo de aprovação das amostras e da arte; os pedidos seguintes costumam ser mais rápidos.',
      },
      {
        q: 'A GoodBiz Hygiene fabrica os produtos?',
        a: 'Não. A GoodBiz Hygiene é um exportador comercial da Índia. Os produtos são feitos por fabricantes indianos selecionados, e a GoodBiz Hygiene cuida da solicitação, das aprovações, dos documentos e do embarque.',
      },
    ],
    quoteH: 'Inicie a sua solicitação.',
    quoteText: 'Envie em uma linha os produtos, as embalagens e o mercado que você tem em mente. Respondemos com opções, preços e prazos.',
  },

  notFound: {
    title: 'Página não encontrada',
    description: 'Não foi possível encontrar esta página. Conheça os sabonetes e produtos de limpeza doméstica da GoodBiz Hygiene ou solicite uma cotação.',
    l1: 'Esta página não está',
    l2: 'na prateleira.',
    lead: 'O link pode ser antigo ou ter sido digitado errado. A linha completa está a um clique de distância.',
    sprayAlt: 'Ilustração de um frasco de limpador em spray',
  },
};

export default pt;
