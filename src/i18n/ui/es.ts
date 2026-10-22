/**
 * Spanish UI strings (neutral international Spanish, formal "usted").
 * Source: src/i18n/ui/en.ts. Rules: docs/i18n-translator-guide.md.
 */
import type { UiPartial } from './types.ts';

/** Set by `npm run i18n:stamp`: the English dictionary this file was translated from. */
export const sourceHash = '1e31c873b185';

const es: UiPartial = {
  meta: {
    tagline: 'Jabones y productos de limpieza del hogar, exportados desde la India',
  },

  terms: {
    incoterms: 'FOB, CIF y CFR disponibles; condiciones de pago acordadas en cada pedido (T/T o LC)',
    payment: 'Acordadas en cada pedido (T/T o LC)',
    port: 'Embarque desde los principales puertos de la India',
    leadTime: 'Normalmente de 3 a 5 semanas tras la confirmación del pedido, según los requisitos de marca propia',
  },

  common: {
    skip: 'Ir al contenido',
    home: 'Inicio',
    products: 'Productos',
    blog: 'Blog',
    breadcrumb: 'Ruta de navegación',
    requestQuote: 'Solicitar cotización',
    viewProducts: 'Ver productos',
    exporterLine: 'Exportador y proveedor desde la India',
    hsn: 'HSN',
    hsnTitle: 'Sistema Armonizado de Nomenclatura',
    allProducts: 'Todos los productos',
    allGuides: 'Todas las guías',
    productsCount: '{n} productos',
    minRead: '{n} min de lectura',
    readFaq: 'Leer las preguntas frecuentes',
    straightAnswers: 'Respuestas claras.',
    buyerFaq: 'Preguntas frecuentes del comprador',
    faqDefault: 'Preguntas habituales de los compradores',
    exportProcessFull: 'El proceso de exportación completo',
    renderAlt: 'Ilustración de {nameLower} en un envase de exportación típico',
    drawingAlt: 'Ilustración de {nameLower}',
    photoAlt: '{name} de GoodBiz',
    categoryRenderAlt: 'Ilustración de envases típicos de {nameLower}',
    rangeAlt: 'Ilustración de la gama de GoodBiz Hygiene en envases de exportación típicos',
    heroAlt:
      'Ilustración de la gama de GoodBiz Hygiene en envases de exportación típicos: una botella de lavavajillas, una garrafa de suavizante, un limpiador en spray, un dosificador de jabón de manos, una bolsa de detergente, un bidón de materia prima, un bidón de plástico y pastillas de jabón',
    portAlt: 'Grúas pórtico cargando un buque portacontenedores de noche en la Terminal Internacional de Transbordo de Contenedores de Kochi, India',
    portCaption: 'Terminal de contenedores de Kochi. Foto: {creator}, {license}.',
    specCaption: 'Especificaciones típicas. Los valores finales se confirman en cada pedido.',
  },

  header: {
    homeAria: '{name}, inicio',
    menu: 'Menú',
    mainNav: 'Principal',
    mainNavMobile: 'Principal (móvil)',
    nav: {
      products: 'Productos',
      privateLabel: 'Marca propia',
      exportProcess: 'Proceso de exportación',
      guides: 'Guías para compradores',
      about: 'Nosotros',
      faq: 'Preguntas frecuentes',
    },
  },

  footer: {
    tag: 'Limpieza desde la India',
    lede: 'Jabones y productos de limpieza del hogar, adquiridos a fabricantes indios seleccionados y exportados por GoodBiz Hygiene, una empresa de {parent}.',
    nav: 'Pie de página',
    products: 'Productos',
    company: 'Empresa',
    contact: 'Contacto',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, una empresa de {parent}. Exportador comercial desde la India.',
    backToTop: 'Volver arriba',
  },

  lang: {
    label: 'Idioma',
    menuAria: 'Elegir un idioma. Idioma actual: {name}',
    more: 'Más idiomas…',
    moreTitle: 'Abre esta página en Google Translate (traducción automática)',
  },

  whatsapp: {
    aria: 'Chatear con GoodBiz Hygiene por WhatsApp',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Añadir a la consulta',
    addAria: 'Añadir a la consulta: {name}',
    noteH: 'Combínelos en un solo contenedor.',
    noteText: 'Puede combinar estos productos con los de otras gamas en un contenedor de 20 o 40 pies. Confirmamos la combinación al cotizar.',
  },

  quote: {
    heading: 'Solicite una cotización.',
    text: 'Cuéntenos en una línea lo que necesita. El formulario de consulta se abre con su texto ya escrito, listo para que añada productos, cantidad y puerto.',
    placeholder: 'p. ej., 1 contenedor de 20 pies de lavavajillas, limón, 500 ml',
    label: '¿Qué necesita?',
    submit: 'Iniciar consulta',
  },

  ld: {
    hsnCode: 'Código HSN',
    variants: 'Variantes',
    packSizes: 'Tamaños de envase',
  },

  home: {
    title: 'Exportador y proveedor de jabones y productos de limpieza desde la India',
    description:
      'GoodBiz Hygiene, empresa de GoodBiz Global, exporta jabones, detergentes y productos de limpieza de fabricantes indios seleccionados, con marca propia y contenedores mixtos.',
    eyebrow: 'Jabones · Detergentes · Limpieza del hogar',
    h1a: 'Jabones y limpieza del hogar',
    h1b: 'Exportados desde la India.',
    text: 'GoodBiz Hygiene es un exportador comercial: adquirimos jabones, detergentes y limpiadores de fabricantes indios seleccionados, con marca propia y contenedores mixtos.',
    rangeH: 'La gama.',
    rangeIntro: 'Tres de {n} productos. Cada uno tiene su propia página con especificaciones típicas, tamaños de envase y opciones de marca propia.',
    rangeAll: 'Ver los {n} productos',
    processL1: 'Cómo funcionan',
    processL2: 'los pedidos de exportación.',
    processIntro:
      'Un único exportador comercial entre usted y el fabricante: la cotización, las muestras, la documentación y el embarque, desde el primer mensaje hasta el conocimiento de embarque.',
    steps: [
      {
        name: 'Especificación y muestras',
        text: 'Envíenos los productos, los tamaños de envase, la cantidad y el puerto de destino. Cotizamos precios por envase con especificaciones y plazos típicos, y gestionamos muestras para su aprobación.',
      },
      {
        name: 'Abastecimiento y marca propia',
        text: 'Asignamos su solicitud a un fabricante indio seleccionado. En marca propia, usted aprueba su diseño, su fragancia y sus envases antes de la producción en volumen.',
      },
      {
        name: 'Documentos y embarque',
        text: 'El fabricante produce y envasa el pedido mientras preparamos la factura, la lista de empaque, el certificado de origen, el COA y la MSDS. {port}. {leadTime}.',
      },
    ],
    catsH: 'Las categorías.',
    catsText: 'Cinco gamas bajo las partidas HSN 3401 y 3402. Combínelas en un mismo contenedor de 20 o 40 pies.',
    tileMeta: '{n} productos · HSN {hsn}',
    answersMore: 'Más respuestas en la página de preguntas frecuentes',
    statementA: 'Abastecido con cuidado,',
    statementB: 'enviado con confianza.',
    statementLead:
      'Cada pedido de GoodBiz Hygiene se asigna a un fabricante indio seleccionado, se verifica frente a la muestra que usted aprobó y se embarca con la documentación de exportación completa. Así trabajamos en todos los pedidos, sea cual sea su tamaño.',
    promises: [
      { title: 'Solo fabricantes seleccionados', text: 'Cada producto procede de un fabricante indio cuya calidad, regularidad y experiencia exportadora hemos verificado.' },
      { title: 'Su muestra, reproducida', text: 'La fórmula, la fragancia y el envase que usted aprueba son los que se envían, verificados frente a su muestra antes de la carga.' },
      { title: 'Documentación en regla', text: 'Factura, lista de empaque, certificado de origen, COA y MSDS preparados para cada embarque, listos para su agente de aduanas.' },
      { title: 'Un solo socio, de puerto a puerto', text: 'Una sola cotización y un solo interlocutor desde la primera muestra hasta el conocimiento de embarque, para todos los productos que pida.' },
    ],
    guidesH: 'Guías para compradores',
  },

  productsIndex: {
    title: 'Exportador y proveedor de jabones, detergentes y productos de limpieza desde la India',
    description:
      'Explore {n} productos de jabón, lavandería, cocina, limpieza de superficies y materias primas de fabricantes indios seleccionados, con códigos HSN y opciones de marca propia.',
    l1: 'Todos los productos.',
    l2: 'Jabones, detergentes y limpiadores.',
    lead: '{n} productos en cinco gamas, adquiridos a fabricantes indios seleccionados y con opciones de marca propia. Elija una gama o abra cualquier producto para ver especificaciones, tamaños de envase y códigos HSN.',
    hsnLink: 'Códigos HSN por producto',
    rangesNav: 'Las cinco gamas',
    rangeFull: 'La gama completa',
    hsnH: '¿Qué código HSN corresponde a cada producto?',
    hsnText:
      'Los códigos se muestran con 6 dígitos. El código ITC-HS de 8 dígitos se confirma en cada pedido, y algunos productos tienen clasificaciones alternativas (consulte cada página de producto).',
    hsnCaption: 'Resumen de códigos HSN por producto, agrupados por gama',
    colProduct: 'Producto',
    colRange: 'Gama',
    colHsn: 'HSN (6 dígitos)',
  },

  product: {
    hsnAlt: 'Clasificación alternativa indicada a continuación',
    hsnConfirmed: 'Código ITC-HS de 8 dígitos confirmado en cada pedido',
    factsH: 'Datos clave para compradores',
    hsnCode: 'Código HSN',
    hsnNoteDefault: 'El código ITC-HS de 8 dígitos se confirma en cada pedido.',
    moq: 'Cantidad mínima de pedido',
    privateLabel: 'Marca propia',
    plAvailable: 'Disponible.',
    plNot: 'No se ofrece para este producto.',
    varH: 'Variedades, tamaños de envase y embalaje',
    variants: 'Variedades disponibles',
    variantsAria: 'Variedades',
    packSizes: 'Tamaños de envase',
    packaging: 'Opciones de embalaje',
    galleryH: 'Más fragancias, en fotos',
    specH: '¿Cuáles son las especificaciones típicas?',
    specNote: '{name}: valores típicos para calidades de exportación. Los valores finales se confirman con el fabricante en cada pedido.',
    aboutAria: 'Acerca de {name}',
    loadH: 'Carga del contenedor (aprox.)',
    loadText: 'Cifras aproximadas; el plan de carga final se confirma en cada pedido.',
    ft20: 'Contenedor de 20 pies',
    ft40: 'Contenedor de 40 pies',
    guidesH: 'Guías para compradores sobre este producto',
    relatedH: 'Productos relacionados',
    relatedAll: 'Ver toda la categoría: {name}',
    quoteH: 'Cotice este producto.',
    quoteText: 'Indíquenos en una línea la variedad de {nameLower}, el tamaño de envase, la cantidad y el puerto de destino. El formulario de consulta se abre con su texto ya escrito.',
  },

  category: {
    title: '{name}: exportador y proveedor desde la India',
    hsnMeta: '{n} productos · código ITC-HS de 8 dígitos confirmado en cada pedido',
    seeProducts: 'Ver los {n} productos',
    productsH: '¿Qué productos de {nameLower} suministramos?',
    quoteH: 'Cotice {nameLower}.',
  },

  blogIndex: {
    title: 'Guías de exportación para compradores de jabones y productos de limpieza',
    description:
      'Guías prácticas para importadores de jabones, detergentes y productos de limpieza del hogar desde la India: códigos HSN, MOQ, documentos, marca propia y transporte.',
    l1: 'Guías para compradores.',
    l2: 'Para importar jabones y productos de limpieza.',
    lead: 'Notas claras para importadores y distribuidores: clasificación arancelaria, costos, documentos y elección de productos.',
    latest: 'Últimos artículos',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Respuestas rápidas',
    relatedH: 'Productos mencionados en esta guía',
    quoteH: '¿Está planificando un pedido?',
    quoteText: 'Cuéntenos en una línea lo que necesita. El formulario de consulta se abre con su texto ya escrito, listo para que añada productos, cantidad y puerto.',
  },

  contact: {
    title: 'Solicitar cotización: exportador y proveedor de jabones y productos de limpieza desde la India',
    description:
      'Solicite una cotización a GoodBiz Hygiene de jabones, detergentes y productos de limpieza desde la India. Envíe sus productos, envases y puerto por correo o WhatsApp.',
    l1: 'Solicite una cotización.',
    l2: 'Desde la India hasta su puerto.',
    lead: 'Indíquenos lo que necesita: los productos, los tamaños de envase, la cantidad y el puerto de destino. GoodBiz Hygiene responde con precios, especificaciones típicas y plazos de entrega.',
    start: 'Iniciar la consulta',
    waMessage: 'Escríbanos por WhatsApp',
    formH: 'Formulario de consulta',
    asideAria: 'Otras formas de contactarnos',
    email: 'Correo electrónico',
    whatsapp: 'WhatsApp',
    phone: 'Teléfono',
    office: 'Oficina',
    terms: 'Condiciones de exportación',
    oftenH: 'Se cotizan a menudo juntos',
    oftenText: 'Pulse «Añadir a la consulta» en una tarjeta para marcar ese producto en el formulario de arriba.',
  },

  form: {
    name: 'Su nombre',
    company: 'Empresa',
    country: 'País',
    email: 'Correo electrónico',
    phone: 'WhatsApp o teléfono',
    phoneHint: '(con prefijo del país)',
    quantity: 'Cantidad',
    choose: 'Elija una opción',
    quantities: [
      'Muestras o una cantidad de prueba',
      'Parte de un contenedor mixto',
      '1 contenedor de 20 pies',
      '1 contenedor de 40 pies',
      'Varios contenedores o suministro regular',
      'Aún no lo sé',
    ],
    productsLegend: 'Productos de interés',
    chooseAny: '(elija los que quiera)',
    plLegend: '¿Necesita marca propia?',
    plYes: 'Sí, con mi marca',
    plNo: 'No',
    message: 'Mensaje',
    messageHint: '(tamaños de envase, fragancias, puerto de destino)',
    submit: 'Enviar consulta',
    hint: 'Se abrirá su aplicación de correo con la consulta ya rellenada. ¿Prefiere WhatsApp?',
    hintLink: 'Escríbanos por WhatsApp',
    hintJs: 'A continuación, elija si desea enviarla por WhatsApp o por correo.',
    sendH: 'Su consulta está lista. ¿Cómo desea enviarla?',
    sendWa: 'Enviar por WhatsApp',
    sendEmail: 'Enviar por correo',
    sendNote: 'Cada opción abre su propia aplicación con el mensaje ya redactado, para que pueda revisarlo antes de enviarlo.',
  },

  about: {
    title: 'Sobre GoodBiz Hygiene: exportador y proveedor de jabones y productos de limpieza desde la India',
    description:
      'GoodBiz Hygiene es la división de exportación de productos de limpieza e higiene de GoodBiz Global, exportador comercial de la India, y marca hermana de GoodBiz Agro.',
    l1: 'GoodBiz Hygiene.',
    l2: 'Una empresa de {parent}.',
    lead: 'GoodBiz Hygiene es la división de exportación de productos de limpieza e higiene de {parent}, exportador comercial de la India, y marca hermana de GoodBiz Agro.',
    whatH: '¿A qué se dedica GoodBiz Hygiene?',
    what1:
      'GoodBiz Hygiene suministra jabones, detergentes y productos de limpieza del hogar a importadores, distribuidores, mayoristas, cadenas de supermercados y marcas propias fuera de la India. No posee ninguna fábrica. Los productos se adquieren a fabricantes indios seleccionados, y GoodBiz Hygiene se encarga de la cotización, la coordinación de la marca propia, los documentos de exportación y el transporte.',
    what2:
      'La gama abarca productos clasificados en la partida HSN 3401 (jabones) y en la HSN 3402 (detergentes y preparaciones para lavar o limpiar), además de artículos muy relacionados, como el fenol herbal, en cinco gamas.',
    rangesH: 'Las cinco gamas',
    familyH: 'Parte de {parent}',
    familyText: '{parent} gestiona GoodBiz Agro para las exportaciones agrícolas y GoodBiz Hygiene para jabones y limpieza del hogar.',
    visit: 'Visite',
    basedIn: 'Con sede en',
    founded: 'Fundación',
    iec: 'Código de importador-exportador (IEC)',
  },

  faqPage: {
    title: 'Preguntas frecuentes: exportador y proveedor de jabones y productos de limpieza desde la India',
    description:
      'Respuestas para importadores que compran jabones, detergentes y limpiadores de la India con GoodBiz Hygiene: abastecimiento, marca propia, MOQ, incoterms, documentos y plazos.',
    l1: 'Preguntas de los compradores.',
    l2: 'Respuestas claras.',
    lead: 'Cómo GoodBiz Hygiene adquiere, cotiza y embarca jabones y productos de limpieza del hogar desde la India. Las preguntas específicas de cada producto se responden en su página.',
    quoteH: '¿Aún tiene alguna pregunta?',
    quoteText: 'Envíela junto con su consulta, en una línea. Le responderemos con los detalles de sus productos y de su mercado.',
  },

  faqs: [
    {
      heading: 'Abastecimiento y productos',
      faqs: [
        {
          q: '¿GoodBiz Hygiene fabrica los productos que exporta?',
          a: 'No. GoodBiz Hygiene es un exportador comercial de la India y una empresa de GoodBiz Global. Adquiere jabones, detergentes y productos de limpieza del hogar a fabricantes indios seleccionados y se encarga de la cotización, la coordinación de la marca propia, los documentos y el transporte para los compradores del extranjero.',
        },
        {
          q: '¿Qué productos suministra GoodBiz Hygiene?',
          a: 'Cinco gamas: jabones de baño y de uso personal, cuidado de la ropa, cuidado de la cocina, limpiadores de superficies y del hogar, y materias primas industriales como fideos de jabón, LABSA y SLES. Cada producto tiene su propia página con especificaciones típicas, tamaños de envase y su código HSN.',
        },
        {
          q: '¿Qué códigos HSN corresponden a los jabones y los productos de limpieza?',
          a: 'Los jabones se clasifican en la partida HSN 3401 y los detergentes y preparaciones para lavar o limpiar en la HSN 3402. El sitio muestra los códigos con 6 dígitos, por ejemplo 3402 50. El código ITC-HS de 8 dígitos se confirma en cada pedido, y algunos productos, como el suavizante y el fenol herbal, pueden clasificarse de otra forma.',
        },
        {
          q: '¿Son definitivas las especificaciones de las páginas de producto?',
          a: 'No. Las especificaciones son valores típicos para calidades de exportación. Los valores finales, como la materia activa, el TFM o el pH, se confirman con el fabricante en cada pedido y se indican en la cotización.',
        },
      ],
    },
    {
      heading: 'Pedidos y marca propia',
      faqs: [
        {
          q: '¿Puedo pedir productos con mi propia marca?',
          a: 'Sí. La marca propia está disponible en la mayoría de los productos: su diseño de etiqueta, una selección de fragancia y color cuando la formulación lo permite, y los tamaños de envase que necesite su mercado. Las cantidades mínimas dependen del producto y del envase, y se indican como valores típicos en cada página de producto.',
        },
        {
          q: '¿Puedo combinar distintos productos en un mismo contenedor?',
          a: 'Sí. Puede consolidar productos de varias gamas en un contenedor de 20 o 40 pies, lo que le permite probar una gama sin llenar un contenedor por producto. La combinación se confirma según las reglas de embalaje y compatibilidad al cotizar.',
        },
        {
          q: '¿Puedo recibir muestras antes de hacer un pedido?',
          a: 'Sí. Pueden gestionarse muestras de la mayoría de los productos antes de que confirme un pedido. Indíquenos en su consulta los productos y los datos de su servicio de mensajería, y le confirmaremos qué se puede enviar.',
        },
        {
          q: '¿Cómo solicito una cotización?',
          a: 'Utilice el formulario de consulta de la página de contacto, o envíe un mensaje por WhatsApp o un correo con los productos, los tamaños de envase, la cantidad y el puerto de destino. Respondemos con precios, especificaciones típicas y plazos de entrega.',
        },
      ],
    },
    {
      heading: 'Transporte, pago y documentos',
      faqs: [
        { q: '¿Qué incoterms y condiciones de pago ofrecen?', a: '{incoterms}.' },
        { q: '¿Cuánto tarda en embarcarse un pedido?', a: '{leadTime}. {port}.' },
        {
          q: '¿Qué documentos de exportación acompañan al embarque?',
          a: 'Normalmente, los embarques viajan con factura comercial, lista de empaque, certificado de origen y conocimiento de embarque, además de documentos del producto como el certificado de análisis (COA) y la hoja de datos de seguridad (MSDS). El conjunto exacto depende de su país y se confirma en cada pedido.',
        },
        {
          q: '¿Envían a mi país?',
          a: 'GoodBiz Hygiene cotiza a importadores, distribuidores y marcas propias de la mayoría de los países. Las normas del destino, como el idioma del etiquetado o el registro, se revisan con usted antes de confirmar el pedido.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'Proceso de exportación: exportador y proveedor de jabones y productos de limpieza desde la India',
    description:
      'Cómo exporta GoodBiz Hygiene jabones, detergentes y limpiadores desde la India: cotización, muestras, incoterms, condiciones de pago, documentos, puertos y plazos típicos.',
    l1: 'El proceso de exportación.',
    l2: 'De la consulta al conocimiento de embarque.',
    lead: 'Los pasos, las condiciones y los documentos para comprar jabones y productos de limpieza del hogar desde la India con GoodBiz Hygiene.',
    stepsLink: 'Los seis pasos',
    termsH: '¿Cuáles son las condiciones de exportación?',
    termsIncoterms: 'Incoterms y pago',
    termsPort: 'Puerto',
    termsLead: 'Plazo de entrega',
    processL1: '¿Cuáles son los pasos',
    processL2: 'de la consulta al embarque?',
    processIntro: 'Seis pasos, con su aprobación de la cotización, las muestras y la factura proforma antes de producir nada.',
    steps: [
      { name: 'Consulta', text: 'Envíenos los productos, los tamaños de envase, la cantidad, el puerto de destino y sus necesidades de marca propia, mediante el formulario de consulta, el correo o WhatsApp.' },
      { name: 'Cotización', text: 'Cotizamos precios por envase con especificaciones típicas, el incoterm que necesite y el plazo de entrega. {incoterms}.' },
      { name: 'Muestras y aprobaciones', text: 'Las muestras del producto y, en marca propia, las pruebas del diseño se aprueban antes de confirmar el pedido.' },
      { name: 'Factura proforma y pago', text: 'Una factura proforma confirma los productos, las cantidades, el embalaje, el incoterm y las condiciones de pago (T/T o LC).' },
      { name: 'Producción y embalaje', text: 'El fabricante produce y envasa el pedido, con el marcado para la exportación y para su mercado.' },
      { name: 'Documentos y embarque', text: 'Preparamos los documentos de exportación y reservamos el embarque. {port}.' },
    ],
    docsH: '¿Qué documentos acompañan al embarque?',
    docsText: 'El conjunto exacto depende de su país y se confirma en cada pedido.',
    documents: [
      'Factura comercial',
      'Lista de empaque',
      'Certificado de origen',
      'Conocimiento de embarque (flete marítimo)',
      'Certificado de análisis (COA)',
      'Hoja de datos de seguridad (MSDS)',
    ],
    faqH: 'Proceso de exportación: preguntas habituales de los compradores',
    faqs: [
      { q: '¿Qué incoterms ofrecen?', a: '{incoterms}.' },
      { q: '¿Desde qué puerto salen los embarques?', a: '{port}. El puerto se elige según el producto, la ubicación del fabricante y su destino, y se indica en la cotización.' },
      { q: '¿Cuál es el plazo de entrega?', a: '{leadTime}.' },
      {
        q: '¿Qué documentos se incluyen?',
        a: 'Normalmente, los embarques viajan con factura comercial, lista de empaque, certificado de origen y conocimiento de embarque (flete marítimo), además de un COA y una MSDS cuando el producto los requiere. Su país puede exigir más documentos, como un certificado sanitario o una factura legalizada; esto se acuerda en cada pedido.',
      },
      {
        q: '¿Qué código HSN se indica en la factura?',
        a: 'El sitio muestra los códigos HSN con 6 dígitos, por ejemplo 3402 50. El código ITC-HS de 8 dígitos se confirma en cada pedido. El suavizante y el fenol herbal pueden clasificarse en otras partidas (3809 91 y 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Jabones y productos de limpieza de marca propia: exportador y proveedor desde la India',
    description:
      'Jabones, detergentes y limpiadores de marca propia desde la India: su diseño, fragancia, color y tamaños de envase, fabricados por fabricantes indios seleccionados y exportados por GoodBiz Hygiene.',
    l1: 'Jabones de marca propia',
    l2: 'y productos de limpieza desde la India.',
    lead: 'Venda jabones, detergentes y limpiadores con su propia marca. GoodBiz Hygiene asigna su solicitud a un fabricante indio seleccionado, gestiona las muestras y el diseño, y envía el producto terminado a su puerto.',
    renderAlt: 'Ilustración de pastillas de jabón y una botella de jabón de manos en envases típicos de marca propia',
    startBrief: 'Inicie su solicitud',
    howRuns: 'Cómo se desarrolla un pedido',
    optionsH: '¿Qué se puede personalizar?',
    optionsText: 'Cuatro decisiones hacen de una gama algo propio. Usted aprueba cada una antes de la producción en volumen.',
    options: [
      {
        title: 'Su marca en el envase',
        text: 'Etiqueta, funda, caja o envoltorio impresos con su diseño. Enviamos sus archivos al fabricante y le devolvemos una prueba para su aprobación antes de imprimir.',
      },
      {
        title: 'Fragancia y color',
        text: 'Elija entre las fragancias y los colores en que se fabrica habitualmente cada producto, como limón, lavanda, rosa o neem. Los cambios fuera de la gama estándar se consultan antes con el fabricante.',
      },
      {
        title: 'Tamaños y formatos de envase',
        text: 'Botellas para el comercio minorista, recargas, bolsas, pastillas y bidones o tambores a granel, según su estantería y su nivel de precio. Cada página de producto indica sus tamaños de envase típicos.',
      },
      {
        title: 'Calidad y especificación',
        text: 'Elija la calidad que espera su mercado, por ejemplo el TFM en el jabón de baño o la materia activa en los detergentes. Los valores típicos figuran en las páginas de producto y los valores finales se indican en su cotización.',
      },
    ],
    processL1: 'Cómo se desarrolla un pedido',
    processL2: 'de marca propia.',
    processIntro: 'Cinco pasos desde su solicitud hasta la mercancía en su puerto, con su aprobación de la muestra y del diseño antes de fabricar nada.',
    steps: [
      { name: 'Envíenos su solicitud', text: 'Productos, tamaños de envase, fragancias, mercado de destino y una estimación de la cantidad.' },
      { name: 'Cotización y fabricante asignado', text: 'Asignamos la solicitud a un fabricante indio seleccionado y cotizamos por envase, con incoterms y plazo de entrega.' },
      { name: 'Muestras y diseño', text: 'Usted aprueba una muestra del producto y una prueba impresa de su diseño. La producción suele comenzar cuando aprueba ambas.' },
      { name: 'Producción y embalaje', text: 'El fabricante produce y envasa su pedido con su marca, con el marcado para la exportación.' },
      { name: 'Documentos y embarque', text: 'Preparamos los documentos de exportación y reservamos el embarque. {port}.' },
    ],
    faqH: 'Marca propia: preguntas habituales de los compradores',
    faqs: [
      {
        q: '¿Cuál es el pedido mínimo para marca propia?',
        a: 'Depende del producto y del envase. En la mayoría de los productos no hay un pedido mínimo fijo, aunque un diseño de marca propia puede tener su propio mínimo para etiquetas o cajas impresas. Indíquenos su cantidad y se la cotizaremos.',
      },
      {
        q: '¿De quién son el diseño y la marca?',
        a: 'El diseño sigue siendo suyo; las condiciones de uso se acuerdan en cada pedido. GoodBiz Hygiene coordina la impresión con el fabricante.',
      },
      {
        q: '¿Puedo combinar productos de marca propia y estándar en un mismo contenedor?',
        a: 'Sí. Las líneas de marca propia pueden compartir contenedor con otros productos de la gama de GoodBiz Hygiene, sujeto a las reglas de embalaje y compatibilidad que se confirman al cotizar.',
      },
      {
        q: '¿Cuánto tarda un pedido de marca propia?',
        a: '{leadTime}. Un primer pedido incluye el tiempo para aprobar las muestras y el diseño; los pedidos de reposición suelen ser más rápidos.',
      },
      {
        q: '¿GoodBiz Hygiene fabrica los productos?',
        a: 'No. GoodBiz Hygiene es un exportador comercial de la India. Los productos los fabrican fabricantes indios seleccionados, y GoodBiz Hygiene gestiona la solicitud, las aprobaciones, los documentos y el transporte.',
      },
    ],
    quoteH: 'Inicie su solicitud.',
    quoteText: 'Envíenos en una línea los productos, los envases y el mercado que tiene en mente. Le responderemos con opciones, precios y plazos de entrega.',
  },

  notFound: {
    title: 'Página no encontrada',
    description: 'No se encontró esta página. Explore los jabones y productos de limpieza del hogar de GoodBiz Hygiene o solicite una cotización.',
    l1: 'Esta página no está',
    l2: 'en la estantería.',
    lead: 'Puede que el enlace sea antiguo o esté mal escrito. La gama completa está a un clic.',
    sprayAlt: 'Ilustración de una botella de limpiador en spray',
  },
};

export default es;
