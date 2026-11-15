import { useEffect, useRef, useState } from "react";
import { isRect, originNames, originShort, outdoorLabel, productById, productName, useNames, videos } from "../../site-data";
import { openCalculator, requestItem } from "./catalog";
import { IconCheck, IconPlay, IconPlus } from "./icons";
import { useRequest } from "./request";

// صالة الفيديو: مشغّل واحد وقائمة بفيديوهات المعرض. كل فيديو مربوط بصنفه، ومنه يضاف للطلب أو تُحسب كميته.

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export function Videos() {
  const { add, has } = useRequest();
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  // رقم يزيد مع كل طلب تشغيل، حتى يعمل التشغيل ولو طُلب الفيديو المعروض نفسه.
  const [playRequest, setPlayRequest] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const pick = (i: number) => {
    setCurrent(i);
    setStarted(true);
    setPlayRequest((n) => n + 1);
  };

  // فتح فيديو من خارج القسم (بلاطات الواجهة أو قائمة الأصناف).
  useEffect(() => {
    const onVideo = (e: Event) => {
      const i = videos.findIndex((v) => v.id === (e as CustomEvent<string>).detail);
      if (i >= 0) pick(i);
    };
    window.addEventListener("ms:video", onVideo);
    return () => window.removeEventListener("ms:video", onVideo);
  }, []);

  // التشغيل بعد أن يظهر الفيديو المطلوب في الصفحة.
  useEffect(() => {
    if (playRequest === 0) return;
    void videoRef.current?.play().catch(() => undefined);
  }, [playRequest]);

  // إيقاف الفيديو عندما يبتعد الزائر عن القسم.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) videoRef.current?.pause();
    });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  const item = videos[current];
  if (!item) return null;
  const product = productById(item.productId);
  const added = product ? has(product.id) : false;

  return (
    <section className="sec sec-vid" id="videos">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <span className="orn" aria-hidden="true" />
          <h2 className="h2">الأصناف بالفيديو</h2>
          <p className="lead">صوّرنا العيّنات في المعرض كما هي، وكل فيديو يعرض عدة تصاميم من الصنف نفسه. اختر الصنف وشاهده.</p>
        </div>

        <div className="vid" data-reveal>
          <div className={`vid-stage ${item.h > item.w ? "is-tall" : "is-wide"}`} ref={stageRef}>
            <span className="vid-blur" style={{ backgroundImage: `url(${item.poster})` }} aria-hidden="true" />
            <video
              key={item.id}
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              width={item.w}
              height={item.h}
              preload="none"
              playsInline
              muted
              loop
              controls={started}
              aria-label={product ? `فيديو ${productName(product)} ${originShort[product.origin]} ${product.size ?? ""}` : "فيديو من المعرض"}
            />
            {!started ? (
              <button type="button" className="vid-play" onClick={() => pick(current)} aria-label="تشغيل الفيديو">
                <span>
                  <IconPlay />
                </span>
              </button>
            ) : null}
          </div>

          <div className="vid-side">
            <div className="vid-list" role="group" aria-label="فيديوهات الأصناف">
              {videos.map((v, i) => {
                const p = productById(v.productId);
                return (
                  <button key={v.id} type="button" className={`vid-item ${i === current ? "is-on" : ""}`} aria-pressed={i === current} onClick={() => pick(i)}>
                    <span className="sw" aria-hidden="true">
                      <i style={{ backgroundImage: `url(${v.shots[0]})` }} />
                    </span>
                    <span className="vid-item-text">
                      <strong>{p ? `${productName(p)} ${originShort[p.origin]}` : "فيديو"}</strong>
                      <span>{p?.size}</span>
                    </span>
                    <span className="vid-item-time">
                      <IconPlay /> {clock(v.seconds)}
                    </span>
                  </button>
                );
              })}
            </div>

            {product ? (
              <div className="vid-info" key={item.id}>
                <span className="tag">{originNames[product.origin]}</span>
                <h3>
                  {productName(product)} <span>{product.size}</span>
                </h3>
                <p className="vid-use">{product.outdoor ? outdoorLabel : product.use ? useNames[product.use] : null}</p>
                <div className="shots" role="img" aria-label={`${item.shots.length} تصاميم من هذا الفيديو`}>
                  {item.shots.map((s) => (
                    <span key={s} style={{ backgroundImage: `url(${s})` }} />
                  ))}
                </div>
                <p className="vid-note">لقطات من الفيديو. التصاميم المتوفرة حالياً تجدها في المعرض.</p>
                <div className="vid-actions">
                  <button type="button" className={`btn ${added ? "btn-done" : "btn-primary"}`} onClick={() => add(requestItem(product))}>
                    {added ? <IconCheck /> : <IconPlus />} {added ? "في طلبك" : "أضف لطلبي"}
                  </button>
                  {isRect(product) ? (
                    <button type="button" className="btn btn-ghost" onClick={() => openCalculator(product)}>
                      احسب الكمية
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
