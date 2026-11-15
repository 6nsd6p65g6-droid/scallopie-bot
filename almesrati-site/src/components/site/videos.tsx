import { useEffect, useRef, useState } from "react";
import { isRect, originNames, originShort, outdoorLabel, productById, productName, productTitle, setForProduct, useNames, videos } from "../../site-data";
import { showSamples, useSiteEvent } from "./actions";
import { openCalculator, requestItem } from "./catalog";
import { SecHead } from "./head";
import { IconCheck, IconChevron, IconClose, IconGrid, IconPlay, IconPlus } from "./icons";
import { useRequest } from "./request";

// فيديوهات المعرض: بطاقات مثل مقاطع الهاتف، والضغط على البطاقة يفتح المشغّل فوق الصفحة.
// كل فيديو مربوط بصنفه، ومن المشغّل يُضاف الصنف للطلب أو تُحسب كميته أو تُفتح صوره.

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export function Videos() {
  const [open, setOpen] = useState<number | null>(null);

  // فتح فيديو من قسم آخر (قائمة الأصناف أو العيّنات).
  useSiteEvent<string>("ms:video", (id) => {
    const i = videos.findIndex((v) => v.id === id);
    if (i >= 0) setOpen(i);
  });

  return (
    <section className="sec sec-vid" id="videos" aria-labelledby="videos-title">
      <div className="wrap">
        <SecHead
          id="videos-title"
          kicker="جولة قصيرة"
          title="من داخل المعرض"
          lead="صوّرنا العيّنات في المعرض، وكل فيديو يمرّ على عدة تصاميم من الصنف نفسه. اضغط على الفيديو لتشاهده."
        />

        <ul className="reels" data-reveal>
          {videos.map((v, i) => {
            const p = productById(v.productId);
            return (
              <li key={v.id}>
                <button type="button" className="reel" onClick={() => setOpen(i)} aria-label={`شاهد فيديو ${p ? productTitle(p) : "المعرض"}، مدته ${clock(v.seconds)}`}>
                  <img src={v.poster} alt="" width={v.w} height={v.h} loading="lazy" decoding="async" />
                  <span className="reel-time">{clock(v.seconds)}</span>
                  <span className="reel-play" aria-hidden="true">
                    <IconPlay />
                  </span>
                  <span className="reel-cap">
                    <strong>{p ? `${productName(p)} ${originShort[p.origin]}` : "فيديو من المعرض"}</strong>
                    <span>{p?.size}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {open !== null ? <VideoBox index={open} onClose={() => setOpen(null)} onNav={setOpen} /> : null}
    </section>
  );
}

function VideoBox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (i: number) => void }) {
  const { add, has } = useRequest();
  const closeRef = useRef<HTMLButtonElement>(null);
  const v = videos[index];
  const n = videos.length;
  const product = productById(v.productId);
  const set = product ? setForProduct(product.id) : undefined;
  const added = product ? has(product.id) : false;
  const usage = product ? (product.outdoor ? outdoorLabel : product.use ? useNames[product.use] : "") : "";

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("no-scroll");
    closeRef.current?.focus();
    return () => {
      document.documentElement.classList.remove("no-scroll");
      last?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="vb" role="dialog" aria-modal="true" aria-label={product ? `فيديو ${productTitle(product)}` : "فيديو من المعرض"} onClick={onClose}>
      <div className={`vb-in ${v.h > v.w ? "is-tall" : "is-wide"}`} onClick={(e) => e.stopPropagation()}>
        <div className="vb-video">
          <video key={v.id} src={v.src} poster={v.poster} width={v.w} height={v.h} controls autoPlay muted loop playsInline />
        </div>
        <div className="vb-info" key={`info-${v.id}`}>
          {product ? (
            <>
              <span className="tag">{originNames[product.origin]}</span>
              <h3>
                {productName(product)} <span>{product.size}</span>
              </h3>
              {usage ? <p className="vb-use">{usage}</p> : null}
              <p className="vb-note">الفيديو مصوَّر في المعرض ويمرّ على عدة تصاميم من هذا الصنف. التصاميم المتوفرة حالياً تجدها في المعرض.</p>
              <div className="vb-actions">
                <button type="button" className={`btn ${added ? "btn-done" : "btn-gold"}`} onClick={() => add(requestItem(product))}>
                  {added ? <IconCheck /> : <IconPlus />} {added ? "في طلبك" : "أضف لطلبي"}
                </button>
                {isRect(product) ? (
                  <button
                    type="button"
                    className="btn btn-on-navy"
                    onClick={() => {
                      onClose();
                      openCalculator(product);
                    }}
                  >
                    احسب الكمية
                  </button>
                ) : null}
                {set ? (
                  <button
                    type="button"
                    className="btn btn-on-navy"
                    onClick={() => {
                      onClose();
                      showSamples(set.id);
                    }}
                  >
                    <IconGrid /> صور العيّنات
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
          {n > 1 ? (
            <div className="vb-nav">
              <button type="button" className="btn btn-sm btn-on-navy" onClick={() => onNav((index - 1 + n) % n)}>
                <IconChevron dir="right" /> السابق
              </button>
              <span>
                {index + 1} / {n}
              </span>
              <button type="button" className="btn btn-sm btn-on-navy" onClick={() => onNav((index + 1) % n)}>
                التالي <IconChevron dir="left" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <button ref={closeRef} type="button" className="icon-btn vb-close" onClick={onClose} aria-label="إغلاق الفيديو">
        <IconClose />
      </button>
    </div>
  );
}
