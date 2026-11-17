// بيانات «المصراتي للسيراميك والبرسلين». كل ما يحتاج تعديلاً لاحقاً موجود في هذا الملف فقط.

export const company = {
  name: "المصراتي",
  descriptor: "للسيراميك والبرسلين",
  fullName: "المصراتي للسيراميك والبرسلين",
};

// ---------- التواصل ----------
// لا تُكتب هنا أي بيانات غير مؤكدة. الأقسام التي تعتمد عليها تعرض نفسها تلقائياً عند تعبئتها.
export type SocialLink = { platform: string; handle: string; url: string };
// أرسلها المالك، وتأكدنا أن الرابطين يفتحان صفحتي الشركة.
export const socials: SocialLink[] = [
  { platform: "تيك توك", handle: "@almasrati92", url: "https://www.tiktok.com/@almasrati92" },
  { platform: "فيسبوك", handle: "المصراتي للسيراميك", url: "https://www.facebook.com/share/1Tz4UJCwQS/" },
];

// الاسم اختياري: يُكتب عندما يرسله المالك.
export type Phone = { name?: string; number: string; whatsapp?: boolean };
// أرقام الشركة كما أرسلها المالك: الرقم الأول عليه واتساب.
export const phones: Phone[] = [{ number: "0928106906", whatsapp: true }, { number: "0921111923" }];
// وصف الرقم عندما لا يُعرف اسم الموظف.
export const phoneLabel = (p: Phone) => p.name ?? (p.whatsapp ? "اتصال وواتساب" : "اتصال ورسائل");

// الفروع كما أرسلها المالك: فرع واحد في تاجوراء، سبان. أرقامه هي أرقام الشركة أعلاه، ويُضاف للفرع رقم خاص عند الحاجة.
// تأكدنا أن رابط الخريطة يفتح «محل المصراتي للسيراميك والبورسلين، تاجوراء».
export type Branch = { id: string; name: string; address: string; mapUrl?: string; phones?: Phone[] };
export const branches: Branch[] = [
  { id: "tajoura", name: "فرع تاجوراء", address: "تاجوراء، سبان", mapUrl: "https://maps.app.goo.gl/TtLsjuZT7ZqKaPyy9" },
];

// أوقات العمل كما أرسلها المالك: كل يوم ما عدا الجمعة، من 10 صباحاً حتى المغرب.
export type WorkHours = {
  days: string;
  time: string;
  closed?: string;
  opensAt: number; // بالدقائق من منتصف الليل بتوقيت ليبيا
  opensText: string;
  closedDay: number; // يوم العطلة (الأحد = 0)
};
export const workHours: WorkHours | null = {
  days: "من السبت إلى الخميس",
  time: "من 10 صباحاً حتى المغرب",
  closed: "الجمعة عطلة",
  opensAt: 10 * 60,
  opensText: "10 صباحاً",
  closedDay: 5,
};
// موقع تاجوراء، لحساب وقت المغرب في حالة «مفتوح الآن». ليبيا على توقيت +2 طوال السنة.
export const shopCoords = { lat: 32.882, lng: 13.35, utcOffset: 2 };

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

// مظهر مبسّط للصنف، تستخدمه حاسبة البلاط لتلوين المخطط فقط.
export type Look = "ivory" | "marble" | "kotto" | "pool" | "stone" | "wood" | "hex";

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
  { id: "ly-ceramic-60", kind: "سيراميك", origin: "libya", size: "60×60 سم", w: 60, h: 60, look: "ivory", use: "floor", outdoor: true },
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
export type VideoItem = { id: string; src: string; poster: string; w: number; h: number; seconds: number; productId: string };
export const videos: VideoItem[] = [
  { id: "v1", src: "video/v1.mp4", poster: "video/v1.jpg", w: 576, h: 1024, seconds: 21, productId: "ly-ceramic-60" },
  { id: "v2", src: "video/v2.mp4", poster: "video/v2.jpg", w: 1024, h: 576, seconds: 32, productId: "in-porcelain-120x60" },
  { id: "v3", src: "video/v3.mp4", poster: "video/v3.jpg", w: 576, h: 1024, seconds: 23, productId: "in-porcelain-80" },
];
export const videoForProduct = (productId: string) => videos.find((v) => v.productId === productId);

// ---------- التصاميم الحقيقية ----------
// صور أرسلها المالك من المعرض. عُدّلت زاويتها فقط لتظهر البلاطة مستقيمة، ولم تُغيَّر ألوانها.
// وصف اللون مأخوذ من الصورة نفسها ليساعد على التمييز بين التصاميم.
export type SetShape = "slab" | "square" | "wall";
export type DesignSet = {
  id: string;
  productId: string;
  label: string; // اسم التبويب
  shape: SetShape; // نسبة الصورة: لوح 60×120، مربع، أو حائطي مع ديكوره
  note?: string;
  looks: string[]; // وصف كل تصميم بترتيب صوره
  codes?: (string | undefined)[]; // كود التصميم كما أكده المالك، بنفس ترتيب الصور
  isNew?: boolean; // صنف وصل حديثاً: يُعلَّم «جديد»
  prefix?: string; // اسم يُكتب بدل «تصميم» حتى لا يتكرر «تصميم 1» في الصنف نفسه
};
export const designSets: DesignSet[] = [
  {
    id: "p120",
    productId: "in-porcelain-120x60",
    label: "بورسلين هندي 120×60",
    shape: "slab",
    looks: [
      "كريمي بعروق ذهبية",
      "أبيض بعروق سوداء رفيعة",
      "رمادي فاتح بعروق داكنة",
      "رمادي رخامي منقّط",
      "بيج فاتح",
      "رمادي متوسط",
      "رمادي فاتح بعروق رفيعة",
      "أبيض بعروق رمادية",
      "رمادي فاتح ناعم",
      "بني داكن بعروق فاتحة",
      "رمادي داكن بعروق",
      "بني فاتح",
    ],
  },
  {
    id: "ly120",
    productId: "ly-porcelain-120x60",
    label: "ترافنتينو ليبي 120×60",
    shape: "slab",
    isNew: true,
    prefix: "ترافنتينو",
    note: "الترافنتينو يُركّب في الحمامات والمطابخ وحيطان الديكور.",
    looks: ["ترافنتينو رمادي", "ترافنتينو بيج لامع", "ترافنتينو بيج مطفي"],
    codes: ["273", "284 لامع", "284 مطفي"],
  },
  {
    id: "in120t",
    productId: "in-porcelain-120x60",
    label: "ترافنتينو هندي 120×60",
    shape: "slab",
    isNew: true,
    prefix: "ترافنتينو",
    note: "الترافنتينو يُركّب في الحمامات والمطابخ وحيطان الديكور.",
    looks: ["ترافنتينو بيج فاتح", "ترافنتينو بيج وردي مطفي", "ترافنتينو رمادي داكن مطفي"],
    codes: ["8111", "8080", "8113"],
  },
  {
    id: "ly120m",
    productId: "ly-porcelain-120x60",
    label: "بورسلين ليبي 120×60",
    shape: "slab",
    looks: ["أبيض بعروق رمادية عريضة", "أبيض بعروق رمادية ناعمة", "أبيض بعروق رمادية متشعّبة"],
    codes: ["206", "289", "230"],
  },
  {
    id: "ly120tz",
    productId: "ly-porcelain-120x60",
    label: "تيرازو ليبي 120×60",
    shape: "slab",
    prefix: "تيرازو",
    looks: ["تيرازو رمادي فاتح بحبيبات سوداء وبنية وبيضاء"],
    codes: ["288"],
  },
  {
    id: "p80",
    productId: "in-porcelain-80",
    label: "بورسلين هندي 80×80",
    shape: "square",
    looks: ["رمادي بعروق بيضاء", "رمادي فاتح حجري", "رمادي حجري بعروق", "بيج إسمنتي", "بيج رمادي فاتح", "رمادي فاتح سادة"],
  },
  {
    id: "c60",
    productId: "ly-ceramic-60",
    label: "سيراميك ليبي 60×60",
    shape: "square",
    looks: ["رمادي فاتح بعروق ناعمة", "رمادي فاتح بتموّجات", "بيج كريمي", "بيج بعروق", "رمادي حجري", "أبيض بعروق بيج"],
  },
  {
    id: "lk60",
    productId: "ly-kotto-60",
    label: "كوطو ليبي 60×60",
    shape: "square",
    note: "سمك 14 ملم، للأرضيات والساحات الخارجية.",
    looks: ["بيج بنقشة ترافنتينو", "رمادي حجري بعروق مائلة", "رمادي فاتح حجري", "رمادي بحصى صغير", "رمادي بحجارة كبيرة", "بيج تيرازو بحبيبات بنية", "رمادي داكن حجري بعروق مائلة (قطعتان من نفس اللون)", "بيج رمادي حجري بعروق بنية", "رمادي فاتح منقّط", "رمادي غرانيتي بخطوط حجرية مائلة", "رمادي إسمنتي ببقع فاتحة", "رمادي إسمنتي داكن", "تيرازو رمادي بحجارة رمادية وسوداء"],
    codes: [undefined, undefined, undefined, undefined, undefined, "063", undefined, "053", "017", "038", "024", "016", "062"],
  },
  {
    id: "w30",
    productId: "ly-wall-30x60",
    label: "حائطي ليبي 30×60",
    shape: "wall",
    note: "كل صورة تعرض البلاطة السادة ومعها الديكور المطابق لها.",
    looks: ["أبيض رخامي بعروق سوداء مع ديكور هندسي بارز", "رمادي مع ديكور مربعات بارزة", "تيرازو رمادي مع ديكور مثلثات", "رمادي فاتح مع ديكور خطوط بارزة"],
  },
];

export type Design = {
  id: string;
  setId: string;
  productId: string;
  n: number; // رقم التصميم داخل مجموعته
  look: string;
  code?: string;
  image: string; // الصورة الكبيرة
  thumb: string; // صورة البطاقة
  tiny: string; // صورة صغيرة لجدار الواجهة والقوائم
};
export const designs: Design[] = designSets.flatMap((s) =>
  s.looks.map((look, i) => {
    const id = `${s.id}-${String(i + 1).padStart(2, "0")}`;
    return { id, setId: s.id, productId: s.productId, n: i + 1, look, code: s.codes?.[i], image: `designs/${id}.jpg`, thumb: `designs/${id}-t.jpg`, tiny: `designs/${id}-w.jpg` };
  }),
);
export const designById = (id: string) => designs.find((d) => d.id === id);
export const setById = (id: string) => designSets.find((s) => s.id === id);
export const setForProduct = (productId: string) => designSets.find((s) => s.productId === productId);
export const designsOf = (setId: string) => designs.filter((d) => d.setId === setId);
// كل تصاميم الصنف من كل مجموعاته، والجديد أولاً.
export const designsForProduct = (productId: string) => {
  const list = designs.filter((d) => d.productId === productId);
  const isNew = (id: string) => (designSets.find((s) => s.id === id)?.isNew ? 0 : 1);
  return list.slice().sort((a, b) => isNew(a.setId) - isNew(b.setId));
};
export const designLabel = (d: Design) => {
  if (d.code) return d.code;
  const set = designSets.find((s) => s.id === d.setId);
  if (set?.prefix) return set.looks.length === 1 ? set.prefix : `${set.prefix} ${d.n}`;
  return `تصميم ${d.n}`;
};

// ---------- تصاميم البيوت والحمامات ----------
// صور توضيحية صُمّمت بالحاسوب: كل صورة تُظهر أحد تصاميمنا الحقيقية بعد التركيب.
export type SceneKind = "floor" | "bath";
export const sceneKinds: Record<SceneKind, string> = { floor: "أرضيات البيت", bath: "الحمامات" };
export type Scene = { id: string; kind: SceneKind; title: string; designId: string; surface: string };
export const scenes: Scene[] = [
  { id: "living", kind: "floor", title: "صالة الجلوس", designId: "p120-01", surface: "الأرضية" },
  { id: "bath1", kind: "bath", title: "حمّام بالأبيض الرخامي", designId: "w30-01", surface: "الحيطان" },
  { id: "majlis", kind: "floor", title: "المجلس", designId: "p120-02", surface: "الأرضية" },
  { id: "bedroom", kind: "floor", title: "غرفة النوم", designId: "p80-01", surface: "الأرضية" },
  { id: "bath2", kind: "bath", title: "حمّام بالتيرازو", designId: "w30-03", surface: "الحيطان" },
  { id: "kitchen", kind: "floor", title: "المطبخ", designId: "c60-03", surface: "الأرضية" },
  { id: "bath3", kind: "bath", title: "حمّام بالرمادي الفاتح", designId: "w30-04", surface: "الحيطان" },
];
export const sceneImage = (s: Scene) => ({ large: `looks/${s.id}.jpg`, medium: `looks/${s.id}-m.jpg`, thumb: `looks/${s.id}-t.jpg` });
