import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { company, designs, products, scenes, setById, videos, type Design, type SetShape } from "../../site-data";
import { openDesign } from "./actions";
import { IconArrow, IconPause, IconPlay } from "./icons";

// الواجهة: جدار من صور بلاطنا الحقيقية يتحرك ببطء، وفي وسطه قرص كحلي بإطار ذهبي كما في شعار الشركة.
// الضغط على أي بلاطة يكبّر صورتها. الحركة تتوقف بزر، وتتوقف تلقائياً لمن يفضّل تقليل الحركة.

const COLS = 10;
const PER_COL = 6;
// نسبة ارتفاع الصورة إلى عرضها حسب شكل البلاطة.
const RATIO: Record<SetShape, number> = { slab: 1.9, square: 1, wall: 1.5 };
const shapeOf = (d: Design) => setById(d.setId)?.shape ?? "square";
// عرض صورة البطاقة الأكبر لكل شكل (للشاشات عالية الدقة).
const THUMB_W: Record<SetShape, number> = { slab: 280, square: 360, wall: 320 };

// توزيع ثابت غير عشوائي، حتى تتطابق الصفحة الجاهزة مع ما يرسمه المتصفح.
const columns: Design[][] = Array.from({ length: COLS }, (_, c) =>
  Array.from({ length: PER_COL }, (_, r) => designs[((c * PER_COL + r) * 11 + 3) % designs.length]),
);
// مدة دورة كل عمود تتناسب مع طوله، فتتحرك الأعمدة كلها بالسرعة نفسها.
const duration = (col: Design[]) => Math.round(col.reduce((sum, d) => sum + RATIO[shapeOf(d)], 0) * 7);

// صيغة المعدود حسب العدد: مفرد، مثنى، جمع (3 إلى 10)، ثم مفرد منصوب (11 فأكثر).
type Forms = [one: string, two: string, few: string, many: string];
const word = (n: number, f: Forms) => (n === 1 ? f[0] : n === 2 ? f[1] : n <= 10 ? f[2] : f[3]);
const DESIGN: Forms = ["تصميم", "تصميمان", "تصاميم", "تصميماً"];

// أرقام الواجهة تُحسب من بيانات الموقع نفسها، وكل رقم يوصل إلى قسمه.
const facts = [
  { n: designs.length, label: `${word(designs.length, DESIGN)} بصور حقيقية`, href: "#samples" },
  { n: scenes.length, label: `${word(scenes.length, DESIGN)} لبيوت وحمامات`, href: "#looks" },
  { n: products.length, label: `${word(products.length, ["صنف", "صنفان", "أصناف", "صنفاً"])} في القائمة`, href: "#catalog" },
  { n: videos.length, label: `${word(videos.length, ["فيديو", "فيديوهات", "فيديوهات", "فيديو"])} من المعرض`, href: "#videos" },
];

export function Hero() {
  const [paused, setPaused] = useState(false);
  const [away, setAway] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);

  // الجدار يتوقف عندما يبتعد الزائر عنه، حتى لا يستهلك البطارية.
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting));
    io.observe(wall);
    return () => io.disconnect();
  }, []);

  const onWallClick = (e: MouseEvent<HTMLDivElement>) => {
    const id = (e.target as HTMLElement).dataset.design;
    if (id) openDesign(id);
  };

  return (
    <section className="hero" id="top" aria-label="الواجهة">
      <div className="hero-stage">
        <div className={`wall ${paused || away ? "is-paused" : ""}`} ref={wallRef} onClick={onWallClick} aria-hidden="true">
          {columns.map((col, c) => (
            <div key={c} className="wall-col">
              <div className={`wall-track ${c % 2 ? "is-down" : ""}`} style={{ "--dur": `${duration(col)}s` } as CSSProperties}>
                {[0, 1].map((copy) =>
                  col.map((d) => (
                    <img
                      key={`${copy}-${d.id}`}
                      className={`wall-tile is-${shapeOf(d)}`}
                      src={d.tiny}
                      srcSet={`${d.tiny} 200w, ${d.thumb} ${THUMB_W[shapeOf(d)]}w`}
                      sizes="(max-width: 639px) 24vw, (max-width: 959px) 16vw, (max-width: 1279px) 12vw, 10vw"
                      alt=""
                      data-design={d.id}
                      decoding="async"
                      draggable={false}
                    />
                  )),
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="plate">
          <div className="plate-in">
            <span className="orn orn-gold" aria-hidden="true" />
            <p className="plate-kicker">سيراميك · بورسلين · كوطو · رخام</p>
            <h1>
              <span className="sr-only">{company.fullName}: </span>
              اختر بلاط بيتك <em>من صوره الحقيقية</em>
            </h1>
            <p className="plate-sub">صوّرنا لك تصاميمنا في المعرض كما هي. شاهدها داخل البيوت والحمامات، احسب الكمية، وجهّز طلبك في دقائق.</p>
            <div className="plate-cta">
              <a href="#looks" className="btn btn-gold">
                شاهد التصاميم <IconArrow />
              </a>
              <a href="#samples" className="btn btn-on-navy">
                صور العيّنات
              </a>
            </div>
          </div>
        </div>

        <div className="hero-tools">
          <p className="hero-hint">اضغط على أي بلاطة لتكبيرها</p>
          <button type="button" className="wall-toggle" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>
            {paused ? <IconPlay /> : <IconPause />}
            <span>{paused ? "تشغيل الحركة" : "إيقاف الحركة"}</span>
          </button>
        </div>
      </div>

      <ul className="facts">
        {facts.map((f) => (
          <li key={f.href}>
            <a href={f.href}>
              <strong>{f.n}</strong>
              <span>{f.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
