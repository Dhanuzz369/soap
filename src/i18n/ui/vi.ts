/**
 * Vietnamese UI strings. Source: src/i18n/ui/en.ts. Rules: docs/i18n-translator-guide.md.
 * Register: formal business Vietnamese (Quý khách).
 */
import type { UiPartial } from './types.ts';

/** Set by `npm run i18n:stamp`: the English dictionary this file was translated from. */
export const sourceHash = '63f8be54f28d';

const vi: UiPartial = {
  meta: {
    tagline: 'Xà phòng và sản phẩm vệ sinh gia dụng, xuất khẩu từ Ấn Độ',
  },

  terms: {
    incoterms: 'FOB, CIF và CFR; điều khoản thanh toán thỏa thuận theo từng đơn hàng (T/T hoặc LC)',
    payment: 'Thỏa thuận theo từng đơn hàng (T/T hoặc LC)',
    port: 'Giao hàng từ các cảng lớn của Ấn Độ',
    leadTime: 'Thông thường 3–5 tuần sau khi xác nhận đơn hàng, tùy theo yêu cầu về nhãn riêng',
  },

  common: {
    skip: 'Chuyển đến nội dung',
    home: 'Trang chủ',
    products: 'Sản phẩm',
    blog: 'Blog',
    breadcrumb: 'Đường dẫn điều hướng',
    requestQuote: 'Yêu cầu báo giá',
    viewProducts: 'Xem sản phẩm',
    exporterLine: 'Nhà xuất khẩu và nhà cung cấp từ Ấn Độ',
    hsn: 'HSN',
    hsnTitle: 'Hệ thống danh pháp hài hòa (Harmonized System of Nomenclature)',
    allProducts: 'Tất cả sản phẩm',
    allGuides: 'Tất cả cẩm nang',
    productsCount: '{n} sản phẩm',
    minRead: 'Đọc trong {n} phút',
    readFaq: 'Đọc phần Hỏi đáp',
    straightAnswers: 'Giải đáp rõ ràng.',
    buyerFaq: 'Hỏi đáp dành cho người mua',
    faqDefault: 'Những câu hỏi người mua thường đặt ra',
    exportProcessFull: 'Toàn bộ quy trình xuất khẩu',
    renderAlt: 'Hình minh họa {nameLower} trong bao bì xuất khẩu điển hình',
    drawingAlt: 'Hình minh họa {nameLower}',
    photoAlt: '{name} từ GoodBiz',
    categoryRenderAlt: 'Hình minh họa các quy cách đóng gói {nameLower} điển hình',
    rangeAlt: 'Hình minh họa dòng sản phẩm GoodBiz Hygiene trong các quy cách đóng gói xuất khẩu điển hình',
    portAlt: 'Cần trục giàn bốc xếp container lên tàu vào ban đêm tại Cảng trung chuyển container quốc tế ở Kochi, Ấn Độ',
    portCaption: 'Cảng container Kochi. Ảnh: {creator}, {license}.',
    specCaption: 'Thông số kỹ thuật điển hình. Giá trị cuối cùng được xác nhận theo từng đơn hàng.',
  },

  header: {
    homeAria: '{name}, trang chủ',
    menu: 'Menu',
    mainNav: 'Chính',
    mainNavMobile: 'Chính (di động)',
    nav: {
      products: 'Sản phẩm',
      privateLabel: 'Nhãn riêng',
      exportProcess: 'Quy trình xuất khẩu',
      guides: 'Cẩm nang mua hàng',
      about: 'Giới thiệu',
      faq: 'Hỏi đáp',
    },
  },

  footer: {
    tag: 'Sạch từ Ấn Độ',
    lede: 'Xà phòng và sản phẩm vệ sinh gia dụng, được cung ứng từ các nhà sản xuất Ấn Độ đã được thẩm định và xuất khẩu bởi GoodBiz Hygiene, một công ty thuộc {parent}.',
    nav: 'Chân trang',
    products: 'Sản phẩm',
    company: 'Công ty',
    contact: 'Liên hệ',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, một công ty thuộc {parent}. Nhà xuất khẩu thương mại từ Ấn Độ.',
    backToTop: 'Lên đầu trang',
  },

  lang: {
    label: 'Ngôn ngữ',
    menuAria: 'Chọn ngôn ngữ. Ngôn ngữ hiện tại: {name}',
    more: 'Các ngôn ngữ khác…',
    moreTitle: 'Mở trang này trong Google Dịch (dịch máy)',
  },

  whatsapp: {
    aria: 'Trò chuyện với GoodBiz Hygiene qua WhatsApp',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Thêm vào yêu cầu',
    addAria: 'Thêm vào yêu cầu: {name}',
    noteH: 'Ghép chung trong một container.',
    noteText: 'Quý khách có thể kết hợp các sản phẩm này với sản phẩm thuộc dòng khác trong cùng một container 20 ft hoặc 40 ft. Chúng tôi xác nhận phương án ghép hàng khi báo giá.',
  },

  quote: {
    heading: 'Yêu cầu báo giá.',
    text: 'Chỉ cần nêu nhu cầu của Quý khách trong một dòng. Biểu mẫu yêu cầu sẽ mở ra với nội dung đã điền sẵn, để Quý khách bổ sung sản phẩm, số lượng và cảng đến.',
    placeholder: 'ví dụ: 1×20 ft nước rửa chén, hương chanh, 500 ml',
    label: 'Quý khách cần gì?',
    submit: 'Bắt đầu gửi yêu cầu',
  },

  ld: {
    hsnCode: 'Mã HSN',
    variants: 'Các loại',
    packSizes: 'Quy cách đóng gói',
  },

  home: {
    title: 'Nhà xuất khẩu và nhà cung cấp xà phòng, sản phẩm vệ sinh gia dụng từ Ấn Độ',
    description:
      'GoodBiz Hygiene, một công ty thuộc GoodBiz Global, xuất khẩu xà phòng, chất tẩy rửa và sản phẩm vệ sinh gia dụng từ các nhà sản xuất Ấn Độ đã được thẩm định, có nhãn riêng và ghép container.',
    eyebrow: 'Xà phòng · Chất tẩy rửa · Vệ sinh gia dụng',
    h1a: 'Xà phòng và vệ sinh gia dụng',
    h1b: 'Xuất khẩu từ Ấn Độ.',
    text: 'GoodBiz Hygiene là nhà xuất khẩu thương mại: chúng tôi cung ứng xà phòng, chất tẩy rửa và nước vệ sinh từ các nhà sản xuất Ấn Độ đã được thẩm định, có nhãn riêng và ghép container.',
    rangeH: 'Dòng sản phẩm.',
    rangeIntro: 'Ba trong tổng số {n} sản phẩm. Mỗi sản phẩm có trang riêng với thông số kỹ thuật điển hình, quy cách đóng gói và các tùy chọn nhãn riêng.',
    rangeAll: 'Xem tất cả {n} sản phẩm',
    processL1: 'Đơn hàng xuất khẩu',
    processL2: 'vận hành như thế nào.',
    processIntro:
      'Một nhà xuất khẩu thương mại đứng giữa Quý khách và nhà sản xuất: báo giá, mẫu thử, chứng từ và lô hàng, từ tin nhắn đầu tiên đến vận đơn đường biển.',
    steps: [
      {
        name: 'Thông số kỹ thuật và mẫu thử',
        text: 'Quý khách gửi sản phẩm, quy cách đóng gói, số lượng và cảng đến. Chúng tôi báo giá theo từng quy cách kèm thông số kỹ thuật điển hình và thời gian giao hàng, đồng thời sắp xếp mẫu để Quý khách duyệt.',
      },
      {
        name: 'Tìm nguồn hàng và nhãn riêng',
        text: 'Chúng tôi ghép yêu cầu của Quý khách với một nhà sản xuất Ấn Độ đã được thẩm định. Với nhãn riêng, thiết kế bao bì, hương liệu và quy cách đóng gói của Quý khách được duyệt trước khi sản xuất hàng loạt.',
      },
      {
        name: 'Chứng từ và vận chuyển',
        text: 'Nhà sản xuất sản xuất và đóng gói đơn hàng, trong khi chúng tôi chuẩn bị hóa đơn, phiếu đóng gói, giấy chứng nhận xuất xứ, COA và MSDS. {port}. {leadTime}.',
      },
    ],
    catsH: 'Các nhóm sản phẩm.',
    catsText: 'Năm nhóm sản phẩm thuộc HSN 3401 và 3402. Có thể ghép chung trong một container 20 ft hoặc 40 ft.',
    tileMeta: '{n} sản phẩm · HSN {hsn}',
    answersMore: 'Xem thêm câu trả lời tại trang Hỏi đáp',
    statementA: 'Tuyển chọn cẩn trọng,',
    statementB: 'giao hàng đáng tin cậy.',
    statementLead:
      'Mỗi đơn hàng của GoodBiz Hygiene đều được ghép với một nhà sản xuất Ấn Độ đã được thẩm định, đối chiếu với mẫu Quý khách đã duyệt và giao kèm bộ chứng từ xuất khẩu đầy đủ. Đây là cách chúng tôi làm việc với mọi đơn hàng, dù lớn hay nhỏ.',
    promises: [
      { title: 'Chỉ hợp tác với nhà sản xuất đã thẩm định', text: 'Mỗi sản phẩm đến từ một nhà sản xuất Ấn Độ mà chúng tôi đã kiểm tra về chất lượng, tính ổn định và kinh nghiệm xuất khẩu.' },
      { title: 'Đúng mẫu Quý khách đã duyệt', text: 'Công thức, hương liệu và bao bì Quý khách đã duyệt chính là hàng được giao, được đối chiếu với mẫu của Quý khách trước khi xếp hàng.' },
      { title: 'Chứng từ chuẩn xác', text: 'Hóa đơn, phiếu đóng gói, giấy chứng nhận xuất xứ, COA và MSDS được chuẩn bị cho từng lô hàng, sẵn sàng cho đại lý hải quan của Quý khách.' },
      { title: 'Một đối tác, từ cảng đến cảng', text: 'Một bản báo giá và một đầu mối liên hệ duy nhất, từ mẫu đầu tiên đến vận đơn đường biển, cho mọi sản phẩm Quý khách đặt mua.' },
    ],
    guidesH: 'Cẩm nang cho người mua',
    fanTabs: 'Chọn nhóm sản phẩm',
    fanShow: 'Hiện {name}',
    fanView: 'Xem nhóm này',
    fanOpen: '{name}: xem nhóm sản phẩm',
  },

  productsIndex: {
    title: 'Nhà xuất khẩu và nhà cung cấp xà phòng, chất giặt rửa và sản phẩm tẩy rửa từ Ấn Độ',
    description:
      'Khám phá {n} sản phẩm xà phòng, giặt giũ, nhà bếp, tẩy rửa bề mặt và nguyên liệu từ các nhà sản xuất Ấn Độ đã được thẩm định, kèm mã HSN và tùy chọn nhãn riêng.',
    l1: 'Tất cả sản phẩm.',
    l2: 'Xà phòng, chất giặt rửa và nước tẩy rửa.',
    lead: '{n} sản phẩm thuộc năm nhóm, được cung ứng từ các nhà sản xuất Ấn Độ đã được thẩm định và có tùy chọn nhãn riêng. Hãy chọn một nhóm, hoặc mở từng sản phẩm để xem thông số kỹ thuật, quy cách đóng gói và mã HSN.',
    hsnLink: 'Mã HSN theo sản phẩm',
    rangesNav: 'Năm nhóm sản phẩm',
    rangeFull: 'Toàn bộ dòng sản phẩm',
    hsnH: 'Mã HSN nào áp dụng cho từng sản phẩm?',
    hsnText:
      'Mã được hiển thị ở mức 6 chữ số. Mã ITC-HS 8 chữ số được xác nhận theo từng đơn hàng, và một số sản phẩm có cách phân loại thay thế (xem trang của từng sản phẩm).',
    hsnCaption: 'Tổng quan mã HSN theo sản phẩm, xếp theo nhóm',
    colProduct: 'Sản phẩm',
    colRange: 'Nhóm',
    colHsn: 'HSN (6 chữ số)',
  },

  product: {
    hsnAlt: 'Có cách phân loại thay thế, xem ghi chú bên dưới',
    hsnConfirmed: 'Mã ITC-HS 8 chữ số được xác nhận theo từng đơn hàng',
    factsH: 'Thông tin chính dành cho người mua',
    hsnCode: 'Mã HSN',
    hsnNoteDefault: 'Mã ITC-HS 8 chữ số được xác nhận theo từng đơn hàng.',
    moq: 'Số lượng đặt hàng tối thiểu',
    privateLabel: 'Nhãn riêng',
    plAvailable: 'Có cung cấp.',
    plNot: 'Không cung cấp cho sản phẩm này.',
    varH: 'Chủng loại, quy cách đóng gói và bao bì',
    variants: 'Các chủng loại có sẵn',
    variantsAria: 'Chủng loại',
    packSizes: 'Quy cách đóng gói',
    packaging: 'Tùy chọn bao bì',
    galleryH: 'Thêm các mùi hương, qua hình ảnh',
    specH: 'Thông số kỹ thuật điển hình là gì?',
    specNote: '{name}: giá trị điển hình của các cấp độ xuất khẩu. Giá trị cuối cùng được xác nhận với nhà sản xuất theo từng đơn hàng.',
    aboutAria: 'Giới thiệu về {name}',
    loadH: 'Xếp hàng vào container (xấp xỉ)',
    loadText: 'Số liệu xấp xỉ; phương án xếp hàng cuối cùng được xác nhận theo từng đơn hàng.',
    ft20: 'Container 20 ft',
    ft40: 'Container 40 ft',
    guidesH: 'Cẩm nang mua hàng cho sản phẩm này',
    relatedH: 'Sản phẩm liên quan',
    relatedAll: 'Tất cả {nameLower}',
    quoteH: 'Báo giá cho sản phẩm này.',
    quoteText: 'Hãy cho chúng tôi biết chủng loại {nameLower}, quy cách đóng gói, số lượng và cảng đến trong một dòng. Biểu mẫu yêu cầu sẽ mở ra với nội dung đã điền sẵn.',
  },

  category: {
    title: '{name}: nhà xuất khẩu và nhà cung cấp từ Ấn Độ',
    hsnMeta: '{n} sản phẩm · Mã ITC-HS 8 chữ số được xác nhận theo từng đơn hàng',
    seeProducts: 'Xem {n} sản phẩm',
    productsH: 'Chúng tôi cung cấp những sản phẩm {nameLower} nào?',
    quoteH: 'Báo giá {nameLower}.',
  },

  blogIndex: {
    title: 'Cẩm nang xuất khẩu dành cho người mua xà phòng và sản phẩm tẩy rửa',
    description:
      'Cẩm nang thực tế cho nhà nhập khẩu xà phòng, chất tẩy rửa và sản phẩm vệ sinh gia dụng từ Ấn Độ: mã HSN, MOQ, chứng từ, nhãn riêng và vận chuyển.',
    l1: 'Cẩm nang cho người mua.',
    l2: 'Nhập khẩu xà phòng và vệ sinh gia dụng.',
    lead: 'Những ghi chú dễ hiểu dành cho nhà nhập khẩu và nhà phân phối: phân loại hàng hóa, chi phí, chứng từ và cách chọn sản phẩm.',
    latest: 'Bài viết mới nhất',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Trả lời nhanh',
    relatedH: 'Các sản phẩm được nhắc đến trong cẩm nang này',
    quoteH: 'Quý khách đang lên kế hoạch đặt hàng?',
    quoteText: 'Chỉ cần nêu nhu cầu của Quý khách trong một dòng. Biểu mẫu yêu cầu sẽ mở ra với nội dung đã điền sẵn, để Quý khách bổ sung sản phẩm, số lượng và cảng đến.',
  },

  contact: {
    title: 'Yêu cầu báo giá: nhà xuất khẩu và nhà cung cấp xà phòng, sản phẩm vệ sinh gia dụng từ Ấn Độ',
    description:
      'Yêu cầu GoodBiz Hygiene báo giá xà phòng, chất tẩy rửa và sản phẩm vệ sinh gia dụng từ Ấn Độ. Gửi sản phẩm, quy cách đóng gói và cảng đến qua email hoặc WhatsApp.',
    l1: 'Yêu cầu báo giá.',
    l2: 'Từ Ấn Độ, đến cảng của Quý khách.',
    lead: 'Hãy cho chúng tôi biết nhu cầu của Quý khách: sản phẩm, quy cách đóng gói, số lượng và cảng đến. GoodBiz Hygiene sẽ phản hồi kèm giá, thông số kỹ thuật điển hình và thời gian giao hàng.',
    start: 'Bắt đầu gửi yêu cầu',
    waMessage: 'Nhắn tin cho chúng tôi qua WhatsApp',
    formH: 'Biểu mẫu yêu cầu',
    asideAria: 'Các cách liên hệ khác',
    email: 'Email',
    whatsapp: 'WhatsApp',
    phone: 'Điện thoại',
    office: 'Văn phòng',
    terms: 'Điều khoản xuất khẩu',
    oftenH: 'Thường được báo giá cùng nhau',
    oftenText: 'Nhấn “Thêm vào yêu cầu” trên một thẻ sản phẩm để đánh dấu sản phẩm đó trong biểu mẫu phía trên.',
  },

  form: {
    name: 'Họ và tên của Quý khách',
    company: 'Công ty',
    country: 'Quốc gia',
    email: 'Email',
    phone: 'WhatsApp hoặc điện thoại',
    phoneHint: '(kèm mã quốc gia)',
    quantity: 'Số lượng',
    choose: 'Chọn một mục',
    quantities: [
      'Mẫu hoặc số lượng dùng thử',
      'Một phần của container ghép hàng',
      '1 container 20 ft',
      '1 container 40 ft',
      'Nhiều container hoặc cung ứng thường xuyên',
      'Chưa chắc chắn',
    ],
    productsLegend: 'Sản phẩm quan tâm',
    chooseAny: '(chọn tùy ý)',
    plLegend: 'Quý khách có cần nhãn riêng không?',
    plYes: 'Có, dưới thương hiệu của tôi',
    plNo: 'Không',
    message: 'Nội dung tin nhắn',
    messageHint: '(quy cách đóng gói, mùi hương, cảng đến)',
    submit: 'Gửi yêu cầu',
    hint: 'Thao tác này sẽ mở ứng dụng email của Quý khách với yêu cầu đã được điền sẵn. Quý khách muốn dùng WhatsApp hơn?',
    hintLink: 'Nhắn tin cho chúng tôi qua WhatsApp',
    hintJs: 'Tiếp theo, hãy chọn gửi qua WhatsApp hoặc qua email.',
    sendH: 'Yêu cầu của Quý khách đã sẵn sàng. Quý khách muốn gửi bằng cách nào?',
    sendWa: 'Gửi qua WhatsApp',
    sendEmail: 'Gửi qua Email',
    sendNote: 'Mỗi lựa chọn đều mở ứng dụng của chính Quý khách với nội dung tin nhắn đã soạn sẵn, để Quý khách kiểm tra trước khi gửi.',
  },

  about: {
    title: 'Giới thiệu GoodBiz Hygiene: nhà xuất khẩu và nhà cung cấp xà phòng, sản phẩm vệ sinh gia dụng từ Ấn Độ',
    description:
      'GoodBiz Hygiene là bộ phận xuất khẩu sản phẩm vệ sinh gia dụng của GoodBiz Global, một nhà xuất khẩu thương mại từ Ấn Độ, và là thương hiệu chị em của GoodBiz Agro.',
    l1: 'GoodBiz Hygiene.',
    l2: 'Một công ty thuộc {parent}.',
    lead: 'GoodBiz Hygiene là bộ phận xuất khẩu sản phẩm vệ sinh gia dụng của {parent}, một nhà xuất khẩu thương mại từ Ấn Độ, và là thương hiệu chị em của GoodBiz Agro.',
    whatH: 'GoodBiz Hygiene làm gì?',
    what1:
      'GoodBiz Hygiene cung cấp xà phòng, chất tẩy rửa và sản phẩm vệ sinh gia dụng cho nhà nhập khẩu, nhà phân phối, nhà bán sỉ, chuỗi siêu thị và các thương hiệu nhãn riêng bên ngoài Ấn Độ. Công ty không sở hữu nhà máy. Sản phẩm được cung ứng từ các nhà sản xuất Ấn Độ đã được thẩm định, còn GoodBiz Hygiene đảm nhiệm báo giá, điều phối nhãn riêng, chứng từ xuất khẩu và vận chuyển.',
    what2:
      'Dòng sản phẩm gồm các mặt hàng được phân loại theo HSN 3401 (xà phòng) và HSN 3402 (chất tẩy rửa và các chế phẩm giặt rửa hoặc làm sạch), cùng một số mặt hàng liên quan chặt chẽ như phenol thảo dược, chia thành năm nhóm.',
    rangesH: 'Năm nhóm sản phẩm',
    familyH: 'Thuộc {parent}',
    familyText: '{parent} vận hành GoodBiz Agro cho xuất khẩu nông sản và GoodBiz Hygiene cho xà phòng và sản phẩm vệ sinh gia dụng.',
    visit: 'Truy cập',
    basedIn: 'Trụ sở tại',
    founded: 'Thành lập',
    iec: 'Mã số nhà nhập khẩu - xuất khẩu (IEC)',
  },

  faqPage: {
    title: 'Hỏi đáp: nhà xuất khẩu và nhà cung cấp xà phòng, sản phẩm vệ sinh gia dụng từ Ấn Độ',
    description:
      'Giải đáp cho nhà nhập khẩu mua xà phòng, chất tẩy rửa từ Ấn Độ qua GoodBiz Hygiene: nguồn hàng, nhãn riêng, MOQ, Incoterms, chứng từ và thời gian giao hàng.',
    l1: 'Câu hỏi của người mua.',
    l2: 'Giải đáp rõ ràng.',
    lead: 'Cách GoodBiz Hygiene tìm nguồn hàng, báo giá và vận chuyển xà phòng và sản phẩm vệ sinh gia dụng từ Ấn Độ. Các câu hỏi riêng về từng sản phẩm được giải đáp trên trang của sản phẩm đó.',
    quoteH: 'Quý khách vẫn còn thắc mắc?',
    quoteText: 'Hãy gửi câu hỏi kèm yêu cầu của Quý khách trong một dòng. Chúng tôi sẽ phản hồi chi tiết cho sản phẩm và thị trường của Quý khách.',
  },

  faqs: [
    {
      heading: 'Nguồn hàng và sản phẩm',
      faqs: [
        {
          q: 'GoodBiz Hygiene có tự sản xuất các sản phẩm xuất khẩu không?',
          a: 'Không. GoodBiz Hygiene là nhà xuất khẩu thương mại từ Ấn Độ và là một công ty thuộc GoodBiz Global. Công ty cung ứng xà phòng, chất tẩy rửa và sản phẩm vệ sinh gia dụng từ các nhà sản xuất Ấn Độ đã được thẩm định, sau đó đảm nhiệm báo giá, điều phối nhãn riêng, chứng từ và vận chuyển cho người mua ở nước ngoài.',
        },
        {
          q: 'GoodBiz Hygiene cung cấp những sản phẩm nào?',
          a: 'Năm nhóm: xà phòng tắm và xà phòng cá nhân, chăm sóc đồ giặt, chăm sóc nhà bếp, nước tẩy rửa bề mặt và gia dụng, cùng nguyên liệu công nghiệp như hạt xà phòng (soap noodles), LABSA và SLES. Mỗi sản phẩm có trang riêng với thông số kỹ thuật điển hình, quy cách đóng gói và mã HSN.',
        },
        {
          q: 'Mã HSN nào áp dụng cho xà phòng và sản phẩm tẩy rửa?',
          a: 'Xà phòng thuộc HSN 3401, còn chất tẩy rửa và các chế phẩm giặt rửa hoặc làm sạch thuộc HSN 3402. Trang web hiển thị mã ở mức 6 chữ số, ví dụ 3402 50. Mã ITC-HS 8 chữ số được xác nhận theo từng đơn hàng, và một số sản phẩm, như nước xả vải và phenol thảo dược, có thể được phân loại khác.',
        },
        {
          q: 'Thông số kỹ thuật trên trang sản phẩm có phải là giá trị cuối cùng không?',
          a: 'Không. Thông số kỹ thuật là giá trị điển hình của các cấp độ xuất khẩu. Giá trị cuối cùng, như hàm lượng hoạt chất, TFM hoặc pH, được xác nhận với nhà sản xuất cho từng đơn hàng và ghi rõ trong bản báo giá.',
        },
      ],
    },
    {
      heading: 'Đặt hàng và nhãn riêng',
      faqs: [
        {
          q: 'Tôi có thể đặt hàng dưới thương hiệu riêng của mình không?',
          a: 'Có. Nhãn riêng được cung cấp cho hầu hết sản phẩm: thiết kế nhãn của Quý khách, lựa chọn mùi hương và màu sắc khi công thức cho phép, cùng các quy cách đóng gói phù hợp với thị trường của Quý khách. Số lượng tối thiểu tùy theo sản phẩm và quy cách, và được nêu ở mức điển hình trên trang của từng sản phẩm.',
        },
        {
          q: 'Tôi có thể ghép nhiều sản phẩm khác nhau trong một container không?',
          a: 'Có. Quý khách có thể gom sản phẩm từ nhiều nhóm vào một container 20 ft hoặc 40 ft, giúp dùng thử một dòng sản phẩm mà không phải đầy một container cho từng sản phẩm. Phương án ghép hàng được xác nhận theo quy tắc đóng gói và tương thích khi chúng tôi báo giá.',
        },
        {
          q: 'Tôi có thể nhận mẫu trước khi đặt hàng không?',
          a: 'Có. Có thể sắp xếp mẫu cho hầu hết sản phẩm trước khi Quý khách xác nhận đơn hàng. Hãy nêu sản phẩm và thông tin chuyển phát của Quý khách trong yêu cầu, chúng tôi sẽ xác nhận những gì có thể gửi.',
        },
        {
          q: 'Làm thế nào để yêu cầu báo giá?',
          a: 'Hãy dùng biểu mẫu yêu cầu trên trang liên hệ, hoặc gửi tin nhắn WhatsApp hay email nêu sản phẩm, quy cách đóng gói, số lượng và cảng đến. Chúng tôi sẽ phản hồi kèm giá, thông số kỹ thuật điển hình và thời gian giao hàng.',
        },
      ],
    },
    {
      heading: 'Vận chuyển, thanh toán và chứng từ',
      faqs: [
        { q: 'Quý công ty áp dụng những điều kiện Incoterms và điều khoản thanh toán nào?', a: '{incoterms}.' },
        { q: 'Một đơn hàng mất bao lâu để giao?', a: '{leadTime}. {port}.' },
        {
          q: 'Lô hàng đi kèm những chứng từ xuất khẩu nào?',
          a: 'Lô hàng thông thường đi kèm hóa đơn thương mại, phiếu đóng gói, giấy chứng nhận xuất xứ và vận đơn đường biển, cùng các tài liệu sản phẩm như giấy chứng nhận phân tích (COA) và bảng dữ liệu an toàn hóa chất (MSDS). Bộ chứng từ cụ thể phụ thuộc vào quốc gia của Quý khách và được xác nhận theo từng đơn hàng.',
        },
        {
          q: 'Quý công ty có giao hàng đến quốc gia của tôi không?',
          a: 'GoodBiz Hygiene báo giá cho nhà nhập khẩu, nhà phân phối và các thương hiệu nhãn riêng ở hầu hết các quốc gia. Các quy định tại nước đến, như ngôn ngữ nhãn hoặc đăng ký lưu hành, được trao đổi với Quý khách trước khi xác nhận đơn hàng.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'Quy trình xuất khẩu: nhà xuất khẩu và nhà cung cấp xà phòng, sản phẩm vệ sinh gia dụng từ Ấn Độ',
    description:
      'Cách GoodBiz Hygiene xuất khẩu xà phòng, chất tẩy rửa từ Ấn Độ: báo giá, mẫu thử, Incoterms, điều khoản thanh toán, chứng từ, cảng và thời gian giao hàng điển hình.',
    l1: 'Quy trình xuất khẩu.',
    l2: 'Từ yêu cầu đến vận đơn đường biển.',
    lead: 'Các bước, điều khoản và chứng từ khi mua xà phòng và sản phẩm vệ sinh gia dụng từ Ấn Độ qua GoodBiz Hygiene.',
    stepsLink: 'Sáu bước',
    termsH: 'Điều khoản xuất khẩu gồm những gì?',
    termsIncoterms: 'Incoterms và thanh toán',
    termsPort: 'Cảng',
    termsLead: 'Thời gian giao hàng',
    processL1: 'Các bước thực hiện',
    processL2: 'từ yêu cầu đến lô hàng là gì?',
    processIntro: 'Sáu bước, trong đó Quý khách duyệt bản báo giá, mẫu thử và hóa đơn chiếu lệ trước khi bắt đầu sản xuất.',
    steps: [
      { name: 'Yêu cầu', text: 'Gửi sản phẩm, quy cách đóng gói, số lượng, cảng đến và các yêu cầu về nhãn riêng (nếu có) qua biểu mẫu yêu cầu, email hoặc WhatsApp.' },
      { name: 'Báo giá', text: 'Chúng tôi báo giá theo từng quy cách kèm thông số kỹ thuật điển hình, điều kiện Incoterms Quý khách cần và thời gian giao hàng. {incoterms}.' },
      { name: 'Mẫu thử và phê duyệt', text: 'Mẫu sản phẩm và, với nhãn riêng, bản in thử thiết kế bao bì được duyệt trước khi xác nhận đơn hàng.' },
      { name: 'Hóa đơn chiếu lệ và thanh toán', text: 'Hóa đơn chiếu lệ xác nhận sản phẩm, số lượng, quy cách đóng gói, điều kiện Incoterms và điều khoản thanh toán (T/T hoặc LC).' },
      { name: 'Sản xuất và đóng gói', text: 'Nhà sản xuất sản xuất và đóng gói đơn hàng, có ký mã hiệu phục vụ xuất khẩu và phù hợp với thị trường của Quý khách.' },
      { name: 'Chứng từ và vận chuyển', text: 'Chúng tôi chuẩn bị chứng từ xuất khẩu và đặt chỗ vận chuyển. {port}.' },
    ],
    docsH: 'Lô hàng đi kèm những chứng từ nào?',
    docsText: 'Bộ chứng từ cụ thể phụ thuộc vào quốc gia của Quý khách và được xác nhận theo từng đơn hàng.',
    documents: [
      'Hóa đơn thương mại',
      'Phiếu đóng gói',
      'Giấy chứng nhận xuất xứ',
      'Vận đơn đường biển (vận chuyển đường biển)',
      'Giấy chứng nhận phân tích (COA)',
      'Bảng dữ liệu an toàn hóa chất (MSDS)',
    ],
    faqH: 'Quy trình xuất khẩu: những câu hỏi người mua thường đặt ra',
    faqs: [
      { q: 'Quý công ty áp dụng những điều kiện Incoterms nào?', a: '{incoterms}.' },
      { q: 'Hàng được giao từ cảng nào?', a: '{port}. Cảng được chọn theo sản phẩm, vị trí nhà sản xuất và điểm đến của Quý khách, và được ghi rõ trong bản báo giá.' },
      { q: 'Thời gian giao hàng là bao lâu?', a: '{leadTime}.' },
      {
        q: 'Những chứng từ nào được kèm theo?',
        a: 'Lô hàng thông thường đi kèm hóa đơn thương mại, phiếu đóng gói, giấy chứng nhận xuất xứ, vận đơn đường biển, cùng COA và MSDS khi sản phẩm cần. Quốc gia của Quý khách có thể yêu cầu thêm, chẳng hạn giấy chứng nhận y tế hoặc hóa đơn hợp pháp hóa lãnh sự; nội dung này được thỏa thuận theo từng đơn hàng.',
      },
      {
        q: 'Mã HSN nào được ghi trên hóa đơn?',
        a: 'Trang web hiển thị mã HSN ở mức 6 chữ số, ví dụ 3402 50. Mã ITC-HS 8 chữ số được xác nhận theo từng đơn hàng. Nước xả vải và phenol thảo dược có thể thuộc các cách phân loại thay thế (3809 91 và 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Xà phòng và sản phẩm tẩy rửa nhãn riêng: nhà xuất khẩu và nhà cung cấp từ Ấn Độ',
    description:
      'Xà phòng, chất tẩy rửa nhãn riêng từ Ấn Độ: thiết kế bao bì, hương liệu, màu sắc và quy cách đóng gói theo ý Quý khách, do nhà sản xuất Ấn Độ đã thẩm định sản xuất và GoodBiz Hygiene xuất khẩu.',
    l1: 'Xà phòng nhãn riêng',
    l2: 'và sản phẩm tẩy rửa từ Ấn Độ.',
    lead: 'Bán xà phòng, chất tẩy rửa và nước vệ sinh dưới thương hiệu của chính Quý khách. GoodBiz Hygiene ghép yêu cầu của Quý khách với một nhà sản xuất Ấn Độ đã được thẩm định, quản lý mẫu và thiết kế bao bì, rồi giao thành phẩm đến cảng của Quý khách.',
    renderAlt: 'Hình minh họa bánh xà phòng và chai nước rửa tay có vòi nhấn trong bao bì nhãn riêng điển hình',
    startBrief: 'Bắt đầu gửi yêu cầu của Quý khách',
    howRuns: 'Một đơn hàng vận hành như thế nào',
    optionsH: 'Có thể tùy chỉnh những gì?',
    optionsText: 'Bốn lựa chọn giúp dòng sản phẩm mang dấu ấn riêng của Quý khách. Mỗi lựa chọn đều do Quý khách duyệt trước khi sản xuất hàng loạt.',
    options: [
      {
        title: 'Thương hiệu của Quý khách trên bao bì',
        text: 'Nhãn, ống bọc, thùng carton hoặc giấy gói được in theo thiết kế của Quý khách. Chúng tôi chuyển tệp của Quý khách cho nhà sản xuất và gửi lại bản in thử để duyệt trước khi in.',
      },
      {
        title: 'Hương liệu và màu sắc',
        text: 'Chọn trong các mùi hương và màu sắc mà mỗi sản phẩm thường được sản xuất, như chanh, oải hương, hoa hồng hoặc neem. Những thay đổi ngoài dải tiêu chuẩn sẽ được kiểm tra với nhà sản xuất trước.',
      },
      {
        title: 'Quy cách và dạng đóng gói',
        text: 'Chai bán lẻ, gói refill, túi, bánh xà phòng và can hoặc thùng phuy số lượng lớn, được chọn phù hợp với kệ hàng và mức giá của Quý khách. Trang của từng sản phẩm liệt kê các quy cách đóng gói điển hình.',
      },
      {
        title: 'Cấp độ và thông số kỹ thuật',
        text: 'Chọn cấp độ mà thị trường của Quý khách mong đợi, ví dụ TFM đối với xà phòng tắm hoặc hàm lượng hoạt chất đối với chất tẩy rửa. Giá trị điển hình được nêu trên trang sản phẩm và giá trị cuối cùng được ghi trong bản báo giá của Quý khách.',
      },
    ],
    processL1: 'Một đơn hàng nhãn riêng',
    processL2: 'vận hành như thế nào.',
    processIntro: 'Năm bước từ yêu cầu của Quý khách đến khi hàng về cảng, trong đó Quý khách duyệt mẫu và thiết kế bao bì trước khi bất kỳ sản phẩm nào được sản xuất.',
    steps: [
      { name: 'Gửi yêu cầu của Quý khách', text: 'Sản phẩm, quy cách đóng gói, mùi hương, thị trường mục tiêu và ước tính số lượng.' },
      { name: 'Báo giá và ghép nhà sản xuất', text: 'Chúng tôi ghép yêu cầu với một nhà sản xuất Ấn Độ đã được thẩm định và báo giá theo từng quy cách, kèm điều kiện Incoterms và thời gian giao hàng.' },
      { name: 'Mẫu thử và thiết kế bao bì', text: 'Quý khách duyệt một mẫu sản phẩm và bản in thử thiết kế bao bì. Việc sản xuất thường bắt đầu sau khi Quý khách duyệt cả hai.' },
      { name: 'Sản xuất và đóng gói', text: 'Nhà sản xuất sản xuất và đóng gói đơn hàng dưới thương hiệu của Quý khách, có ký mã hiệu phục vụ xuất khẩu.' },
      { name: 'Chứng từ và vận chuyển', text: 'Chúng tôi chuẩn bị chứng từ xuất khẩu và đặt chỗ vận chuyển. {port}.' },
    ],
    faqH: 'Nhãn riêng: những câu hỏi người mua thường đặt ra',
    faqs: [
      {
        q: 'Số lượng đặt hàng tối thiểu cho nhãn riêng là bao nhiêu?',
        a: 'Tùy theo sản phẩm và quy cách đóng gói. Với hầu hết sản phẩm không có mức tối thiểu cố định, tuy nhiên một thiết kế nhãn riêng có thể kèm mức tối thiểu riêng cho nhãn in hoặc thùng carton. Hãy cho chúng tôi biết số lượng của Quý khách và chúng tôi sẽ báo giá.',
      },
      {
        q: 'Ai sở hữu thiết kế bao bì và thương hiệu?',
        a: 'Thiết kế vẫn thuộc về Quý khách; điều khoản sử dụng được thỏa thuận theo từng đơn hàng. GoodBiz Hygiene điều phối việc in ấn với nhà sản xuất.',
      },
      {
        q: 'Tôi có thể ghép sản phẩm nhãn riêng và sản phẩm tiêu chuẩn trong một container không?',
        a: 'Có. Các dòng nhãn riêng có thể dùng chung container với các sản phẩm khác trong dòng GoodBiz Hygiene, theo quy tắc đóng gói và tương thích được xác nhận khi báo giá.',
      },
      {
        q: 'Một đơn hàng nhãn riêng mất bao lâu?',
        a: '{leadTime}. Đơn hàng đầu tiên bao gồm thời gian duyệt mẫu và thiết kế bao bì; các đơn hàng lặp lại thường nhanh hơn.',
      },
      {
        q: 'GoodBiz Hygiene có tự sản xuất các sản phẩm không?',
        a: 'Không. GoodBiz Hygiene là nhà xuất khẩu thương mại từ Ấn Độ. Sản phẩm do các nhà sản xuất Ấn Độ đã được thẩm định sản xuất, còn GoodBiz Hygiene quản lý yêu cầu, các khâu phê duyệt, chứng từ và vận chuyển.',
      },
    ],
    quoteH: 'Bắt đầu gửi yêu cầu của Quý khách.',
    quoteText: 'Hãy nêu sản phẩm, quy cách đóng gói và thị trường Quý khách đang hướng đến trong một dòng. Chúng tôi sẽ phản hồi kèm các phương án, giá và thời gian giao hàng.',
  },

  notFound: {
    title: 'Không tìm thấy trang',
    description: 'Không tìm thấy trang này. Hãy xem xà phòng và sản phẩm vệ sinh gia dụng của GoodBiz Hygiene hoặc yêu cầu báo giá.',
    l1: 'Trang này không có',
    l2: 'trên kệ.',
    lead: 'Liên kết có thể đã cũ hoặc bị gõ sai. Toàn bộ dòng sản phẩm chỉ cách một lần nhấp chuột.',
    sprayAlt: 'Hình minh họa chai nước tẩy rửa dạng xịt',
  },
};

export default vi;
