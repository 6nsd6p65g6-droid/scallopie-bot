// بيانات «المصراتي للسيراميك والبرسلين». كل ما يحتاج تعديلاً لاحقاً موجود في هذا الملف فقط.

export const company = {
  name: "المصراتي",
  descriptor: "للسيراميك والبرسلين",
  fullName: "المصراتي للسيراميك والبرسلين",
};

// ---------- التواصل (بانتظار بيانات الشركة) ----------
// لا تُكتب هنا أي بيانات غير مؤكدة. الأقسام التي تعتمد عليها تعرض نفسها تلقائياً عند تعبئتها.
export type SocialLink = { platform: string; handle: string; url: string };
export const socials: SocialLink[] = [];

export type Phone = { name: string; number: string; whatsapp?: boolean };
export type Branch = { id: string; name: string; address: string; phones: Phone[]; mapUrl?: string };
export const branches: Branch[] = [];

// مثال: { days: "من السبت إلى الخميس", time: "من 10 صباحاً حتى المغرب", closed: "الجمعة عطلة" }
export type WorkHours = { days: string; time: string; closed?: string };
export const workHours: WorkHours | null = null;

// يحول الرقم المحلي إلى صيغة دولية: 0924035518 تصبح 218924035518
export const intlNumber = (phone: string) => `218${phone.replace(/\D/g, "").replace(/^0/, "")}`;
export const telHref = (phone: string) => `tel:+${intlNumber(phone)}`;
export const waHref = (phone: string, text: string) => `https://wa.me/${intlNumber(phone)}?text=${encodeURIComponent(text)}`;
// رسالة نصية بنص جاهز (الصيغة ?&body= تعمل على آيفون وأندرويد).
export const smsHref = (phone: string, text: string) => `sms:+${intlNumber(phone)}?&body=${encodeURIComponent(text)}`;

// ---------- الأصناف (نفس أصناف شركة الميثاق كما أوضح المالك) ----------
export type OriginId = "libya" | "india" | "turkey" | "egypt" | "tunisia";
export const originNames: Record<OriginId, string> = {
  libya: "صناعة ليبية",
  india: "صناعة هندية",
  turkey: "صناعة تركية",
  egypt: "صناعة مصرية",
  tunisia: "صناعة تونسية",
};
// اسم مختصر للأزرار والعناوين
export const originShort: Record<OriginId, string> = { libya: "ليبي", india: "هندي", turkey: "تركي", egypt: "مصري", tunisia: "تونسي" };
export const originOrder: OriginId[] = ["libya", "india", "turkey", "egypt", "tunisia"];

export type Kind = "سيراميك" | "بورسلين" | "كوطو" | "سيراميك حائطي" | "سيراميك أحواض سباحة" | "رخام";
export const kinds: Kind[] = ["بورسلين", "سيراميك", "كوطو", "سيراميك حائطي", "رخام", "سيراميك أحواض سباحة"];

export type Finish = "مطفي" | "نص لمعة" | "لمعة" | "دبل لمعة";
export const finishOrder: Finish[] = ["مطفي", "نص لمعة", "لمعة", "دبل لمعة"];

// خامة العيّنة الصغيرة بجانب الصنف (توضيحية، والتصاميم المتوفرة تُعرض في المعرض)
export type Look = "ivory" | "marble" | "kotto" | "pool" | "stone" | "wood" | "hex";
export const lookTexture: Partial<Record<Look, string>> = {
  marble: "assets/t-white120.jpg",
  stone: "assets/t-concrete.jpg",
  kotto: "assets/tex-kotto.jpg",
  pool: "assets/tex-pool.jpg",
  wood: "assets/tex-wood.jpg",
};

// مكان التركيب كما أوضح المالك. الأصناف بدون قيمة تُركّب للأرضيات.
export type Use = "floor" | "wall" | "both";
export const useNames: Record<Use, string> = { floor: "يُركّب للأرضيات", wall: "يُركّب للحيطان", both: "يُركّب للأرضيات والحيطان" };
export const outdoorLabel = "يُركّب للأرضيات والساحات الخارجية";

export type Product = {
  id: string;
  kind: Kind;
  variant?: string; // وصف يظهر بعد النوع، مثل «باركي»
  origin: OriginId;
  shape?: "hex"; // بلاط سداسي
  size?: string; // كما يظهر للزائر (يُترك فارغاً إلى أن يُرسل المقاس)
  w?: number; // العرض بالسنتيمتر
  h?: number; // الطول بالسنتيمتر
  look: Look;
  swatch?: string; // صورة حقيقية للصنف تُعرض بدل الخامة التوضيحية
  finishes?: Finish[];
  note?: string;
  use?: Use;
  outdoor?: boolean; // يصلح للساحات الخارجية (أرضيات فقط)
  keywords?: string; // كلمات إضافية يجدها البحث
};

// الأصناف المستطيلة المعروف مقاسها: هي التي تدخل حاسبة البلاط.
export type RectProduct = Product & { size: string; w: number; h: number };
export const isRect = (p: Product): p is RectProduct => p.shape !== "hex" && !!p.size && typeof p.w === "number" && typeof p.h === "number";

export const products: Product[] = [
  { id: "ly-ceramic-60", kind: "سيراميك", origin: "libya", size: "60×60 سم", w: 60, h: 60, look: "ivory", swatch: "assets/t-white.jpg", use: "floor", outdoor: true },
  { id: "ly-porcelain-120x60", kind: "بورسلين", origin: "libya", size: "120×60 سم", w: 120, h: 60, look: "marble", use: "both" },
  { id: "ly-wall-30x60", kind: "سيراميك حائطي", origin: "libya", size: "30×60 سم", w: 30, h: 60, look: "ivory", note: "مع ديكور 30×60", use: "wall" },
  { id: "ly-kotto-60", kind: "كوطو", origin: "libya", size: "60×60 سم", w: 60, h: 60, look: "kotto", note: "سمك 14 ملم", use: "floor", outdoor: true },
  { id: "ly-kotto-50", kind: "كوطو", origin: "libya", size: "50×50 سم", w: 50, h: 50, look: "kotto", use: "floor", outdoor: true },
  { id: "ly-kotto-45", kind: "كوطو", origin: "libya", size: "45×45 سم", w: 45, h: 45, look: "kotto", use: "floor", outdoor: true },
  { id: "ly-porcelain-80", kind: "بورسلين", origin: "libya", size: "80×80 سم", w: 80, h: 80, look: "marble" },
  { id: "ly-wall-40x80", kind: "سيراميك حائطي", origin: "libya", size: "40×80 سم", w: 40, h: 80, look: "ivory", note: "مع ديكور 40×80", use: "both" },
  {
    id: "in-porcelain-120x60",
    kind: "بورسلين",
    origin: "india",
    size: "120×60 سم",
    w: 120,
    h: 60,
    look: "marble",
    swatch: "assets/t-grey120.jpg",
    finishes: ["لمعة", "مطفي", "نص لمعة", "دبل لمعة"],
    use: "both",
  },
  {
    id: "in-porcelain-80",
    kind: "بورسلين",
    origin: "india",
    size: "80×80 سم",
    w: 80,
    h: 80,
    look: "marble",
    swatch: "assets/t-grey80.jpg",
    finishes: ["لمعة", "مطفي", "نص لمعة"],
  },
  { id: "in-porcelain-60", kind: "بورسلين", origin: "india", size: "60×60 سم", w: 60, h: 60, look: "stone", use: "floor", outdoor: true },
  { id: "in-ceramic-60", kind: "سيراميك", origin: "india", size: "60×60 سم", w: 60, h: 60, look: "ivory", use: "floor", outdoor: true },
  { id: "in-pool-30x60", kind: "سيراميك أحواض سباحة", origin: "india", size: "30×60 سم", w: 30, h: 60, look: "pool", use: "both" },
  { id: "in-porcelain-100", kind: "بورسلين", origin: "india", size: "1×1 متر", w: 100, h: 100, look: "marble" },
  { id: "in-porcelain-120x80", kind: "بورسلين", origin: "india", size: "120×80 سم", w: 120, h: 80, look: "stone" },
  { id: "in-kotto-50", kind: "كوطو", origin: "india", size: "50×50 سم", w: 50, h: 50, look: "kotto", use: "floor", outdoor: true },
  { id: "in-kotto-45", kind: "كوطو", origin: "india", size: "45×45 سم", w: 45, h: 45, look: "kotto", use: "floor", outdoor: true },
  { id: "in-parquet-20x120", kind: "بورسلين", variant: "باركي", origin: "india", size: "20×120 سم", w: 20, h: 120, look: "wood", use: "both" },
  { id: "tr-porcelain-120x60", kind: "بورسلين", origin: "turkey", size: "120×60 سم", w: 120, h: 60, look: "marble", finishes: ["لمعة"], use: "both" },
  { id: "tr-marble-30x60", kind: "رخام", origin: "turkey", size: "30×60 سم", w: 30, h: 60, look: "marble", use: "floor" },
  { id: "eg-parquet-20x120", kind: "بورسلين", variant: "باركي", origin: "egypt", size: "20×120 سم", w: 20, h: 120, look: "wood", use: "both" },
  { id: "eg-ceramic-70", kind: "سيراميك", origin: "egypt", size: "70×70 سم", w: 70, h: 70, look: "ivory", use: "floor" },
  { id: "eg-porcelain-80", kind: "بورسلين", origin: "egypt", size: "80×80 سم", w: 80, h: 80, look: "marble", use: "floor" },
  // السداسي التونسي: للحيطان والأرضيات. المقاس لم يُرسل بعد، فلا يدخل الحاسبة حتى يُضاف.
  {
    id: "tn-hex",
    kind: "سيراميك",
    variant: "سداسي",
    origin: "tunisia",
    shape: "hex",
    look: "hex",
    use: "both",
    note: "ألوان سادة ومنقوشة",
    keywords: "سداسية سداسيات هكساجون خلية نحل تونسي تونس",
  },
];

export const rectProducts = products.filter(isRect);
export const productById = (id: string) => products.find((p) => p.id === id);
export const productName = (p: Product) => `${p.kind}${p.variant ? ` ${p.variant}` : ""}`;
export const productTitle = (p: Product) => `${productName(p)}${p.size ? ` ${p.size}` : ""}`;

// ---------- فيديوهات المعرض (صوّرها المالك في المعرض، وكل فيديو يعرض عدة تصاميم من صنف واحد) ----------
export type VideoItem = {
  id: string;
  src: string;
  poster: string;
  w: number;
  h: number;
  seconds: number;
  productId: string;
  shots: string[]; // لقطات مقصوصة من الفيديو نفسه
};
export const videos: VideoItem[] = [
  {
    id: "v1",
    src: "video/v1.mp4",
    poster: "video/v1.jpg",
    w: 576,
    h: 1024,
    seconds: 21,
    productId: "ly-ceramic-60",
    shots: ["assets/t-white.jpg", "assets/t-vein.jpg", "assets/t-beige.jpg", "assets/t-terrazzo.jpg"],
  },
  {
    id: "v2",
    src: "video/v2.mp4",
    poster: "video/v2.jpg",
    w: 1024,
    h: 576,
    seconds: 32,
    productId: "in-porcelain-120x60",
    shots: ["assets/t-cream120.jpg", "assets/t-dark120.jpg", "assets/t-white120.jpg", "assets/t-grey120.jpg"],
  },
  {
    id: "v3",
    src: "video/v3.mp4",
    poster: "video/v3.jpg",
    w: 576,
    h: 1024,
    seconds: 23,
    productId: "in-porcelain-80",
    shots: ["assets/t-grey80.jpg", "assets/t-dark80.jpg", "assets/t-concrete.jpg"],
  },
];
export const videoForProduct = (productId: string) => videos.find((v) => v.productId === productId);

// ---------- شعار الواجهة: معيَّن من أربع بلاطات كما في شعار الشركة، بخامات حقيقية من فيديوهات المعرض ----------
// الترتيب: أعلى، يمين، يسار، أسفل. البلاطات الثلاث الأولى تفتح فيديو صنفها، والرابعة تفتح قائمة الأصناف.
export type EmblemTile = { texture: string; videoId?: string };
export const emblem: EmblemTile[] = [
  { texture: "assets/t-vein.jpg", videoId: "v1" },
  { texture: "assets/t-cream120.jpg", videoId: "v2" },
  { texture: "assets/t-grey80.jpg", videoId: "v3" },
  { texture: "assets/t-dark120.jpg" },
];
