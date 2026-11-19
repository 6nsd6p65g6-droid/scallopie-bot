import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  designById,
  designLabel,
  designsOf,
  isRect,
  originNames,
  productById,
  productTitle,
  sceneImage,
  sceneKinds,
  scenes,
  type Scene,
  type SceneKind,
} from "../../site-data";
import { openDesign, showSamples } from "./actions";
import { designRequestItem, openCalculator } from "./catalog";
import { SecHead } from "./head";
import { IconCheck, IconChevron, IconGrid, IconPlus, IconZoom } from "./icons";
import { Lightbox } from "./lightbox";
import { useRequest } from "./request";

// تصاميم البيوت والحمامات: صورة كبيرة لكل تصميم، وبجانبها البلاطة الحقيقية المستخدمة فيه.
// الصور توضيحية صُمّمت بالحاسوب من صور بلاطنا، وهذا مكتوب للزائر بوضوح.

type Filter = SceneKind | "all";
const filters: Filter[] = ["all", "floor", "bath"];
const filterLabel = (f: Filter) => (f === "all" ? "كل التصاميم" : sceneKinds[f]);
const countOf = (f: Filter) => scenes.filter((s) => f === "all" || s.kind === f).length;
const sceneAlt = (s: Scene) => {
  const d = designById(s.designId);
  const p = d ? productById(d.productId) : undefined;
  return `${s.title}: تصميم توضيحي يُظهر ${p ? productTitle(p) : "البلاط"} على ${s.surface}`;
};

export function Looks() {
  const { add, has } = useRequest();
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const touch = useRef<number | null>(null);

  const list = useMemo(() => scenes.filter((s) => filter === "all" || s.kind === filter), [filter]);
  const n = list.length;
  const scene = list[Math.min(index, n - 1)];
  const design = designById(scene.designId);
  const product = design ? productById(design.productId) : undefined;
  const img = sceneImage(scene);
  const prev = prevId && prevId !== scene.id ? scenes.find((s) => s.id === prevId) : undefined;

  const go = (i: number) => {
    setPrevId(scene.id);
    setIndex(((i % n) + n) % n);
  };
  const pick = (f: Filter) => {
    setPrevId(scene.id);
    setFilter(f);
    setIndex(0);
  };

  // تجهيز الصورة التالية حتى يكون الانتقال فورياً.
  useEffect(() => {
    const next = list[(Math.min(index, n - 1) + 1) % n];
    if (!next || next.id === scene.id) return;
    const pre = new Image();
    const src = sceneImage(next);
    pre.srcset = `${src.medium} 960w, ${src.large} 1600w`;
    pre.sizes = "(max-width: 960px) 100vw, 60vw";
    pre.src = src.medium;
  }, [index, list, n, scene.id]);

  // الصفحة من اليمين لليسار: السهم الأيسر للتالي.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index + 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index - 1);
    }
  };

  const item = design ? designRequestItem(design) : null;
  const added = item ? has(item.key) : false;
  const siblings = design ? designsOf(design.setId).length : 0;

  return (
    <section className="sec sec-looks" id="looks" aria-labelledby="looks-title">
      <div className="wrap">
        <SecHead
          id="looks-title"
          kicker="بلاطنا بعد التركيب"
          title="تصاميم البيوت والحمامات"
          lead="كيف تبدو أرضية بيتك أو حيطان حمّامك ببلاطنا؟ اختر تصميماً، وشاهد بجانبه صورة البلاطة الحقيقية المستخدمة فيه."
        />

        <div className="lk-tabs" role="group" aria-label="نوع التصميم" data-reveal>
          {filters.map((f) => (
            <button key={f} type="button" className={`pill ${filter === f ? "is-on" : ""}`} aria-pressed={filter === f} onClick={() => pick(f)}>
              {filterLabel(f)}
              <span className="pill-n">{countOf(f)}</span>
            </button>
          ))}
        </div>

        <div className="lk" data-reveal>
          <div className="lk-main">
            <div
              className="lk-stage"
              tabIndex={0}
              role="group"
              aria-roledescription="عارض التصاميم"
              aria-label={`${scene.title}، التصميم ${Math.min(index, n - 1) + 1} من ${n}. استخدم السهمين للتنقل.`}
              onKeyDown={onKey}
              onTouchStart={(e) => {
                touch.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touch.current === null) return;
                const dx = e.changedTouches[0].clientX - touch.current;
                touch.current = null;
                if (dx > 50) go(index + 1);
                if (dx < -50) go(index - 1);
              }}
            >
              {prev ? (
                <img
                  key={`old-${prev.id}`}
                  className="lk-img lk-img-old"
                  src={sceneImage(prev).medium}
                  srcSet={`${sceneImage(prev).medium} 960w, ${sceneImage(prev).large} 1600w`}
                  sizes="(max-width: 960px) 100vw, 60vw"
                  alt=""
                  aria-hidden="true"
                />
              ) : null}
              <img
                key={scene.id}
                className="lk-img lk-img-new"
                src={img.medium}
                srcSet={`${img.medium} 960w, ${img.large} 1600w`}
                sizes="(max-width: 960px) 100vw, 60vw"
                alt={sceneAlt(scene)}
                width={1600}
                height={1200}
                loading="lazy"
                decoding="async"
              />
              <span className="lk-badge">تصميم توضيحي</span>
              <div className="lk-cap" aria-hidden="true">
                <strong key={scene.id}>{scene.title}</strong>
                <span>
                  {Math.min(index, n - 1) + 1} / {n}
                </span>
              </div>
              <button type="button" className="lk-zoom" onClick={() => setZoom(true)} aria-label={`تكبير صورة ${scene.title}`}>
                <IconZoom />
              </button>
              {n > 1 ? (
                <>
                  <button type="button" className="lk-nav lk-prev" onClick={() => go(index - 1)} aria-label="التصميم السابق">
                    <IconChevron dir="right" />
                  </button>
                  <button type="button" className="lk-nav lk-next" onClick={() => go(index + 1)} aria-label="التصميم التالي">
                    <IconChevron dir="left" />
                  </button>
                </>
              ) : null}
            </div>

            <div className="lk-strip" role="group" aria-label="اختر تصميماً">
              {list.map((s, i) => (
                <button key={s.id} type="button" className={`lk-thumb ${s.id === scene.id ? "is-on" : ""}`} aria-pressed={s.id === scene.id} onClick={() => go(i)}>
                  <img src={sceneImage(s).thumb} alt="" width={320} height={240} loading="lazy" />
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {design && product && item ? (
            <aside className="lk-side" aria-live="polite">
              <div className="lk-side-in" key={scene.id}>
                <p className="lk-kind">{sceneKinds[scene.kind]}</p>
                <h3>{scene.title}</h3>
                <p className="lk-used">البلاط على {scene.surface} في هذا التصميم:</p>

                <button type="button" className="lk-tile" onClick={() => openDesign(design.id)} aria-label={`تكبير الصورة الحقيقية: ${productTitle(product)}، ${designLabel(design)}`}>
                  <span className="lk-tile-pic">
                    <img src={design.thumb} alt="" loading="lazy" />
                    <i>
                      <IconZoom />
                    </i>
                  </span>
                  <span className="lk-tile-text">
                    <em>صورة حقيقية من المعرض</em>
                    <strong>{productTitle(product)}</strong>
                    <span>{originNames[product.origin]}</span>
                    <span>
                      {designLabel(design)}: {design.look}
                    </span>
                  </span>
                </button>

                <div className="lk-actions">
                  <button type="button" className={`btn ${added ? "btn-done" : "btn-primary"}`} onClick={() => add(item)}>
                    {added ? <IconCheck /> : <IconPlus />} {added ? "في طلبك" : "أضف هذا التصميم لطلبي"}
                  </button>
                  {isRect(product) ? (
                    <button type="button" className="btn btn-ghost" onClick={() => openCalculator(product)}>
                      احسب الكمية
                    </button>
                  ) : null}
                </div>
                {siblings > 1 ? (
                  <button type="button" className="btn btn-text lk-more" onClick={() => showSamples(design.setId)}>
                    <IconGrid /> شاهد تصاميم هذا الصنف كلها ({siblings})
                  </button>
                ) : null}
              </div>
            </aside>
          ) : null}
        </div>

        <p className="lk-note">
          هذه الصور تصاميم توضيحية أُعدّت بالحاسوب لتقريب شكل بلاطنا بعد التركيب، وقد يختلف اللون والعروق قليلاً عن الواقع. الصورة الحقيقية لكل بلاطة تجدها بجانب التصميم
          وفي قسم العيّنات، والعيّنة نفسها في المعرض.
        </p>
      </div>

      {zoom ? (
        <Lightbox
          items={list.map((s) => ({ image: sceneImage(s).large, alt: sceneAlt(s), caption: s.title, note: "تصميم توضيحي" }))}
          index={Math.min(index, n - 1)}
          onClose={() => setZoom(false)}
          onNav={(i) => go(i)}
        />
      ) : null}
    </section>
  );
}
