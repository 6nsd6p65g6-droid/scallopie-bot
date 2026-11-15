import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { company, emblem, originOrder, originShort, productById, productName, products, videos, type OriginId } from "../../site-data";
import { prefersReducedMotion } from "./fx";
import { IconArrow, IconPlay } from "./icons";

// الواجهة: معيَّن من أربع بلاطات كما في شعار الشركة، بخامات حقيقية من فيديوهات المعرض.
// كل بلاطة زر: الثلاث الأولى تفتح فيديو صنفها، والرابعة تفتح قائمة الأصناف.

const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");

export function playVideo(id: string) {
  window.dispatchEvent(new CustomEvent("ms:video", { detail: id }));
  document.getElementById("videos")?.scrollIntoView({ behavior: scrollBehavior() });
}

export function filterOrigin(origin: OriginId) {
  window.dispatchEvent(new CustomEvent("ms:origin", { detail: origin }));
  document.getElementById("catalog")?.scrollIntoView({ behavior: scrollBehavior() });
}

const CYCLE_MS = 3000;

const tiles = emblem.map((t) => {
  const video = t.videoId ? videos.find((v) => v.id === t.videoId) : undefined;
  const product = video ? productById(video.productId) : undefined;
  return {
    texture: t.texture,
    video,
    title: product ? `${productName(product)} ${originShort[product.origin]}` : "كل الأصناف",
    size: product ? (product.size ?? "") : `${products.length} صنفاً`,
  };
});

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const emRef = useRef<HTMLDivElement>(null);

  // إبراز البلاطات بالتناوب حتى يقترب الزائر منها.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setActive((a) => (a + 1) % tiles.length);
    }, CYCLE_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  const go = (i: number) => {
    const t = tiles[i];
    if (t.video) playVideo(t.video.id);
    else document.getElementById("catalog")?.scrollIntoView({ behavior: scrollBehavior() });
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = emRef.current;
    if (!el || e.pointerType === "touch" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tx", `${(((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(1)}deg`);
    el.style.setProperty("--ty", `${(((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(1)}deg`);
  };
  const onLeave = () => {
    emRef.current?.style.removeProperty("--tx");
    emRef.current?.style.removeProperty("--ty");
    setPaused(false);
  };

  const current = tiles[active];

  return (
    <section className="hero" id="top" aria-label="الواجهة">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="kicker">
            <span className="kicker-gem" aria-hidden="true" />
            سيراميك · بورسلين · كوطو · رخام
          </p>
          <h1>
            <span className="sr-only">{company.fullName}: </span>
            شاهد البلاط <em>قبل أن تختار</em>
          </h1>
          <p className="hero-sub">صوّرنا لك أصنافنا في المعرض كما هي. شاهدها بالفيديو، احسب الكمية التي تحتاجها، وجهّز طلبك في دقائق.</p>
          <div className="hero-cta">
            <a href="#videos" className="btn btn-gold btn-lg">
              <IconPlay /> شاهد الأصناف بالفيديو
            </a>
            <a href="#catalog" className="btn btn-line btn-lg">
              قائمة الأصناف <IconArrow />
            </a>
          </div>
          <div className="hero-origins">
            <span>بلد الصناعة</span>
            <div role="group" aria-label="تصفح الأصناف حسب بلد الصناعة">
              {originOrder.map((o) => (
                <button key={o} type="button" className="origin-chip" onClick={() => filterOrigin(o)}>
                  {originShort[o]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div
            className="em"
            ref={emRef}
            onPointerMove={onMove}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={onLeave}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <svg className="em-rings" viewBox="0 0 200 200" aria-hidden="true">
              <circle className="em-ring-navy" cx="100" cy="100" r="96" />
              <circle className="em-ring-gold" cx="100" cy="100" r="99" />
              <circle className="em-ring-dash" cx="100" cy="100" r="90" />
            </svg>
            <div className="em-diamond">
              {tiles.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  className={`em-tile ${i === active ? "is-on" : ""}`}
                  style={{ "--i": i } as CSSProperties}
                  onClick={() => go(i)}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-label={t.video ? `${t.title} ${t.size}: شاهد الفيديو` : "تصفح كل الأصناف"}
                >
                  <span className="em-tex" style={{ backgroundImage: `url(${t.texture})` }} />
                  <span className="em-shine" />
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="em-cap" onClick={() => go(active)}>
            <span className="em-cap-text" key={active}>
              <strong>{current.title}</strong>
              <span>{current.size}</span>
            </span>
            <span className="em-cap-go">
              {current.video ? (
                <>
                  <IconPlay /> شاهد الفيديو
                </>
              ) : (
                <>
                  تصفح <IconArrow />
                </>
              )}
            </span>
          </button>
          <p className="em-hint">اضغط على أي بلاطة</p>
        </div>
      </div>
    </section>
  );
}
