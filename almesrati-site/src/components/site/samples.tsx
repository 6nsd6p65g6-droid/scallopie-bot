import { useState } from "react";
import {
  designById,
  designLabel,
  designSets,
  designsOf,
  isRect,
  originNames,
  outdoorLabel,
  productById,
  productTitle,
  setById,
  useNames,
  videoForProduct,
} from "../../site-data";
import { playVideo, useSiteEvent } from "./actions";
import { designRequestItem, openCalculator } from "./catalog";
import { SecHead } from "./head";
import { IconCheck, IconPlay, IconPlus, IconZoom } from "./icons";
import { Lightbox } from "./lightbox";
import { useRequest } from "./request";

// العيّنات: صور حقيقية أرسلها المالك من المعرض، مرتبة حسب الصنف، وكل صورة بنسبة مقاس بلاطتها.
// الضغط على الصورة يكبّرها، وزر الإضافة يكتب رقم التصميم في الطلب.

export function Samples() {
  const { add, has } = useRequest();
  const [setId, setSetId] = useState(designSets[0].id);
  const [open, setOpen] = useState<number | null>(null);

  // قسم آخر يطلب فتح مجموعة (من قائمة الأصناف أو من التصاميم).
  useSiteEvent<string>("ms:samples", (id) => {
    if (!setById(id)) return;
    setSetId(id);
    setOpen(null);
  });
  // تكبير صورة تصميم محدد (من جدار الواجهة أو من قسم التصاميم).
  useSiteEvent<string>("ms:design", (id) => {
    const d = designById(id);
    if (!d) return;
    setSetId(d.setId);
    const inSet = designsOf(d.setId);
    let i = 0;
    for (const x of inSet) {
      if (x.id === d.id) break;
      i += 1 + x.more.length;
    }
    setOpen(i);
  });

  const set = setById(setId) ?? designSets[0];
  const list = designsOf(set.id);
  const product = productById(set.productId);
  const video = product ? videoForProduct(product.id) : undefined;
  const usage = product ? (product.outdoor ? outdoorLabel : product.use ? useNames[product.use] : "") : "";
  // كل صور المجموعة بالترتيب، والقطع الإضافية لنفس الكود بعد صورتها الأولى.
  const slides = list.flatMap((d) => [{ d, image: d.image, piece: 0 }, ...d.more.map((m, k) => ({ d, image: m.image, piece: k + 1 }))]);
  const slideOf = (designIndex: number) => Math.max(0, slides.findIndex((x) => x.d.id === list[designIndex]?.id));
  const current = open !== null ? slides[open]?.d : undefined;
  const currentItem = current ? designRequestItem(current) : null;
  const currentAdded = currentItem ? has(currentItem.key) : false;

  return (
    <section className="sec sec-smp" id="samples" aria-labelledby="samples-title">
      <div className="wrap">
        <SecHead
          id="samples-title"
          kicker="صور حقيقية من المعرض"
          title="العيّنات"
          lead="صوّرنا البلاط في المعرض كما هو، بلا تعديل على ألوانه. اختر الصنف، واضغط على أي صورة لتكبيرها."
        />

        <div className="smp-tabs" role="group" aria-label="اختر الصنف" data-reveal>
          {designSets.map((s) => (
            <button key={s.id} type="button" className={`pill ${s.id === set.id ? "is-on" : ""}`} aria-pressed={s.id === set.id} onClick={() => setSetId(s.id)}>
              {s.isNew ? <span className="pill-new">جديد</span> : null}
              {s.label}
              <span className="pill-n">{s.looks.length}</span>
            </button>
          ))}
        </div>

        {product ? (
          <div className="smp-info" key={`info-${set.id}`}>
            <div className="smp-info-text">
              <h3>{productTitle(product)}</h3>
              <p>
                {originNames[product.origin]}
                {usage ? `، ${usage}` : ""}
                {product.note ? `، ${product.note}` : ""}
              </p>
            </div>
            <div className="smp-info-actions">
              {isRect(product) ? (
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => openCalculator(product)}>
                  احسب الكمية
                </button>
              ) : null}
              {video ? (
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => playVideo(video.id)}>
                  <IconPlay /> فيديو الصنف
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <ul className="smp-grid" data-shape={set.shape} key={set.id}>
          {list.map((d, i) => {
            const item = designRequestItem(d);
            const added = has(item.key);
            return (
              <li key={d.id} className="smp" style={{ animationDelay: `${Math.min(i, 11) * 45}ms` }}>
                <button type="button" className="smp-pic" onClick={() => setOpen(slideOf(i))} aria-label={`تكبير ${designLabel(d)}: ${d.look}`}>
                  <img src={d.thumb} alt="" loading="lazy" decoding="async" />
                  {d.more.length ? <span className="smp-more">{d.more.length === 1 ? "صورتان" : `${d.more.length + 1} صور`}</span> : null}
                  <span className="smp-zoom" aria-hidden="true">
                    <IconZoom />
                  </span>
                </button>
                <div className="smp-meta">
                  <span className="smp-text">
                    <strong>{designLabel(d)}</strong>
                    <span>{d.look}</span>
                  </span>
                  <button
                    type="button"
                    className={`smp-add ${added ? "is-added" : ""}`}
                    onClick={() => add(item)}
                    aria-label={added ? `${item.title} في طلبك` : `أضف ${item.title} لطلبي`}
                  >
                    {added ? <IconCheck /> : <IconPlus />}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="smp-note">
          {set.note ? `${set.note} ` : ""}
          الصور مأخوذة بالهاتف داخل المعرض، فقد تظهر عليها انعكاسات الإضاءة. لون الشاشة يختلف قليلاً عن الواقع، والعيّنة نفسها تجدها في المعرض.
        </p>
      </div>

      {open !== null && current && product ? (
        <Lightbox
          items={slides.map(({ d, image, piece }) => ({
            image,
            alt: `صورة حقيقية: ${productTitle(product)}، ${designLabel(d)}، ${d.look}${piece ? "، قطعة ثانية" : ""}`,
            caption: `${productTitle(product)}، ${designLabel(d)}`,
            note: piece ? `${d.look} (قطعة ثانية من نفس الكود)` : d.look,
          }))}
          index={open}
          onClose={() => setOpen(null)}
          onNav={(i) => setOpen(i)}
          actions={
            currentItem ? (
              <>
                <button type="button" className={`btn btn-sm ${currentAdded ? "btn-done" : "btn-gold"}`} onClick={() => add(currentItem)}>
                  {currentAdded ? <IconCheck /> : <IconPlus />} {currentAdded ? "في طلبك" : "أضف لطلبي"}
                </button>
                {isRect(product) ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-on-navy"
                    onClick={() => {
                      setOpen(null);
                      openCalculator(product);
                    }}
                  >
                    احسب الكمية
                  </button>
                ) : null}
              </>
            ) : null
          }
        />
      ) : null}
    </section>
  );
}
