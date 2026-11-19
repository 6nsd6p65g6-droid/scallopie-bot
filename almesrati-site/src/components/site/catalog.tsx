import { useState, type CSSProperties } from "react";
import {
  designLabel,
  designsForProduct,
  finishOrder,
  isRect,
  kinds,
  originNames,
  originOrder,
  originShort,
  outdoorLabel,
  products,
  productName,
  productById,
  productTitle,
  setForProduct,
  useNames,
  videoForProduct,
  type Design,
  type Finish,
  type Kind,
  type OriginId,
  type Product,
  type RectProduct,
} from "../../site-data";
import type { CalcDetail } from "./calculator";
import { playVideo, scrollToId, showSamples } from "./actions";
import { normalize } from "./fx";
import { SecHead } from "./head";
import { IconCheck, IconChevron, IconClose, IconGrid, IconPlay, IconPlus, IconRotate, IconSearch } from "./icons";
import { useRequest } from "./request";

// قائمة الأصناف: صفوف مرتبة حسب بلد الصناعة، مع بحث وفلاتر. كل صف يُفتح ليعرض التفاصيل والأزرار.

type OriginFilter = OriginId | "all";
type KindFilter = Kind | "all";
type FinishFilter = Finish | "all";

const usageOf = (p: Product) => (p.outdoor ? outdoorLabel : p.use ? useNames[p.use] : "");

const haystack = new Map(
  products.map((p) => [
    p.id,
    normalize(
      [
        p.kind,
        p.variant ?? "",
        p.size ?? "",
        originNames[p.origin],
        originShort[p.origin],
        p.origin,
        ...(p.finishes ?? []),
        p.note ?? "",
        usageOf(p),
        p.outdoor ? "خارجي حوش ساحه" : "",
        isRect(p) ? `${p.w} ${p.h} ${p.h} ${p.w}` : "",
        videoForProduct(p.id) ? "فيديو" : "",
        setForProduct(p.id) ? "صور حقيقيه عينات تصاميم" : "",
        p.keywords ?? "",
      ].join(" "),
    ),
  ]),
);

// بند الصنف في قائمة الطلب (نفس المفتاح أينما أضيف).
export const requestItem = (p: Product, finish?: Finish) => ({
  key: p.id,
  title: productTitle(p),
  detail: [originNames[p.origin], finish && p.finishes && p.finishes.length > 1 ? `لمعة: ${finish}` : "", p.note ?? ""].filter(Boolean).join("، "),
});

// بند تصميم محدد من الصور الحقيقية: يُكتب في الطلب برقم التصميم ووصف لونه.
export const designRequestItem = (d: Design) => {
  const p = productById(d.productId);
  return {
    key: `${d.productId}:${d.id}`,
    title: `${p ? productTitle(p) : ""}، ${designLabel(d)}`,
    detail: [p ? originNames[p.origin] : "", d.look].filter(Boolean).join("، "),
  };
};

export function openCalculator(p: RectProduct) {
  const detail: CalcDetail = { id: p.id, w: p.w, h: p.h, title: productTitle(p), origin: originNames[p.origin], kind: p.kind, use: p.use, outdoor: !!p.outdoor };
  window.dispatchEvent(new CustomEvent("am:calc", { detail }));
  scrollToId("calculator");
}

const countWord = (n: number) => (n === 1 ? "صنف" : n === 2 ? "صنفان" : n <= 10 ? "أصناف" : "صنفاً");

export function Catalog() {
  const [origin, setOrigin] = useState<OriginFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [finish, setFinish] = useState<FinishFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const tokens = normalize(query).split(" ").filter(Boolean);
  const matches = (p: Product, skip?: "origin" | "kind" | "finish") =>
    (skip === "origin" || origin === "all" || p.origin === origin) &&
    (skip === "kind" || kind === "all" || p.kind === kind) &&
    (skip === "finish" || finish === "all" || (p.finishes ?? []).includes(finish)) &&
    tokens.every((t) => haystack.get(p.id)!.includes(t));

  const list = products.filter((p) => matches(p));
  const count = (pred: (p: Product) => boolean, skip: "origin" | "kind" | "finish") => products.filter((p) => matches(p, skip) && pred(p)).length;
  const filtersOn = origin !== "all" || kind !== "all" || finish !== "all" || tokens.length > 0;
  const reset = () => {
    setOrigin("all");
    setKind("all");
    setFinish("all");
    setQuery("");
  };

  const groups = originOrder.map((o) => ({ origin: o, items: list.filter((p) => p.origin === o) })).filter((g) => g.items.length > 0);
  const finishesInUse = finishOrder.filter((f) => products.some((p) => p.finishes?.includes(f)));
  const listKey = `${origin}|${kind}|${finish}|${tokens.join(" ")}`;

  return (
    <section className="sec sec-cat" id="catalog">
      <div className="wrap">
        <SecHead kicker="كل ما نوفّره" title="قائمة الأصناف" lead="كل الأصناف مرتبة حسب بلد الصناعة. ابحث أو اختر النوع، واضغط على الصنف لترى تفاصيله." />

        <div className="cat">
        <aside className="cat-tools" data-reveal aria-label="بحث وتصفية الأصناف">
          <label className="search">
            <IconSearch />
            <span className="sr-only">ابحث في الأصناف</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث: بورسلين 120، كوطو، باركي..." />
            {query ? (
              <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="مسح البحث">
                <IconClose />
              </button>
            ) : null}
          </label>

          <span className="tools-label">بلد الصناعة</span>
          <div className="tabs" role="group" aria-label="بلد الصناعة">
            <Tab on={origin === "all"} onClick={() => setOrigin("all")} label="كل البلدان" n={count(() => true, "origin")} />
            {originOrder.map((o) => (
              <Tab key={o} on={origin === o} onClick={() => setOrigin(o)} label={originNames[o]} n={count((p) => p.origin === o, "origin")} />
            ))}
          </div>

          <span className="tools-label">النوع</span>
          <div className="chips" role="group" aria-label="نوع البلاط">
            <Chip on={kind === "all"} onClick={() => setKind("all")} label="كل الأنواع" />
            {kinds.map((k) => (
              <Chip key={k} on={kind === k} onClick={() => setKind(k)} label={k} n={count((p) => p.kind === k, "kind")} />
            ))}
          </div>

          <span className="tools-label">اللمعة</span>
          <div className="chips" role="group" aria-label="درجة اللمعة">
            <Chip on={finish === "all"} onClick={() => setFinish("all")} label="الكل" />
            {finishesInUse.map((f) => (
              <Chip key={f} on={finish === f} onClick={() => setFinish(f)} label={f} n={count((p) => !!p.finishes?.includes(f), "finish")} />
            ))}
          </div>
        </aside>

        <div className="cat-main">
        <div className="cat-status" aria-live="polite">
          <span>{list.length === 0 ? "لا توجد أصناف مطابقة" : `${list.length} ${countWord(list.length)}`}</span>
          {filtersOn ? (
            <button type="button" className="btn btn-text" onClick={reset}>
              <IconRotate /> إعادة ضبط
            </button>
          ) : null}
        </div>

        {list.length === 0 ? (
          <div className="cat-empty">
            <p>لم نجد صنفاً يطابق بحثك.</p>
            <p className="muted">جرّب كلمة أخرى مثل «بورسلين» أو مقاساً مثل «60».</p>
            <button type="button" className="btn btn-primary" onClick={reset}>
              عرض كل الأصناف
            </button>
          </div>
        ) : (
          <div className="groups" key={listKey}>
            {groups.map((g, gi) => (
              <section key={g.origin} className="grp" style={{ "--g": gi } as CSSProperties} aria-labelledby={`grp-${g.origin}`}>
                <header className="grp-head">
                  <h3 id={`grp-${g.origin}`}>{originNames[g.origin]}</h3>
                  <span>
                    {g.items.length} {countWord(g.items.length)}
                  </span>
                </header>
                <ul className="rows">
                  {g.items.map((p) => (
                    <Row key={p.id} product={p} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
        <p className="muted small cat-note">الأصناف التي بجانبها صورة لها عيّنات مصوّرة في قسم العيّنات. بقية التصاميم والألوان المتوفرة تُعرض في المعرض.</p>
        </div>
        </div>
      </div>
    </section>
  );
}

function Tab({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <button type="button" className={`tab ${on ? "is-on" : ""}`} aria-pressed={on} onClick={onClick} disabled={!on && n === 0}>
      {label}
      <span className="tab-n">{n}</span>
    </button>
  );
}

function Chip({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n?: number }) {
  return (
    <button type="button" className={`chip ${on ? "is-on" : ""}`} aria-pressed={on} onClick={onClick} disabled={!on && n === 0}>
      {label}
      {typeof n === "number" ? <span className="chip-n">{n}</span> : null}
    </button>
  );
}

// عيّنة الصنف: صورة حقيقية من تصاميمه إن وُجدت، وإلا شكل البلاطة مرسوماً بنسبة مقاسها (120 سم = 34 بكسل).
export function Swatch({ product: p }: { product: Product }) {
  const photo = designsForProduct(p.id)[0]?.tiny;
  if (photo)
    return (
      <span className="sw sw-photo" aria-hidden="true">
        <img src={photo} alt="" loading="lazy" width={200} height={200} />
      </span>
    );
  return (
    <span className="sw" aria-hidden="true">
      {isRect(p) ? <i style={{ width: `${(p.w / 120) * 34}px`, height: `${(p.h / 120) * 34}px` }} /> : <i className="sw-hex" />}
    </span>
  );
}

function Row({ product: p, open, onToggle }: { product: Product; open: boolean; onToggle: () => void }) {
  const { add, has } = useRequest();
  const [finish, setFinish] = useState<Finish | undefined>(p.finishes?.[0]);
  const added = has(p.id);
  const video = videoForProduct(p.id);
  const set = setForProduct(p.id);
  const samples = designsForProduct(p.id);
  const usage = usageOf(p);
  const panelId = `row-${p.id}`;

  return (
    <li className={`row ${open ? "is-open" : ""}`}>
      <div className="row-head">
        <button type="button" className="row-toggle" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <Swatch product={p} />
          <span className="row-title">
            <strong>{productName(p)}</strong>
            <span className="row-size">{p.size ?? "شكل سداسي"}</span>
          </span>
          <span className="row-meta">
            {usage ? <span>{usage}</span> : null}
            {samples.length > 0 ? (
              <span className="row-tag">
                <IconGrid /> {samples.length === 1 ? "صورة" : samples.length === 2 ? "صورتان" : samples.length <= 10 ? `${samples.length} صور` : `${samples.length} صورة`}
              </span>
            ) : null}
            {video ? (
              <span className="row-video">
                <IconPlay /> فيديو
              </span>
            ) : null}
          </span>
          <IconChevron dir="down" className="row-chev" />
        </button>
        <button
          type="button"
          className={`row-add ${added ? "is-added" : ""}`}
          onClick={() => add(requestItem(p, finish))}
          aria-label={added ? `${productTitle(p)} في طلبك` : `أضف ${productTitle(p)} لطلبي`}
        >
          {added ? <IconCheck /> : <IconPlus />}
        </button>
      </div>

      <div className="row-panel" id={panelId} hidden={!open}>
        <div className="row-panel-in">
          <dl className="row-facts">
            <div>
              <dt>بلد الصناعة</dt>
              <dd>{originNames[p.origin]}</dd>
            </div>
            {usage ? (
              <div>
                <dt>التركيب</dt>
                <dd>{usage}</dd>
              </div>
            ) : null}
            {p.note ? (
              <div>
                <dt>ملاحظة</dt>
                <dd>{p.note}</dd>
              </div>
            ) : null}
            {p.finishes && p.finishes.length === 1 ? (
              <div>
                <dt>اللمعة</dt>
                <dd>{p.finishes[0]}</dd>
              </div>
            ) : null}
          </dl>

          {p.finishes && p.finishes.length > 1 ? (
            <div className="row-fin" role="radiogroup" aria-label={`لمعة ${productTitle(p)}`}>
              <span>اللمعة</span>
              {p.finishes.map((f) => (
                <button key={f} type="button" role="radio" aria-checked={f === finish} className={`fin ${f === finish ? "is-on" : ""}`} onClick={() => setFinish(f)}>
                  {f}
                </button>
              ))}
            </div>
          ) : null}

          {set && samples.length > 0 ? (
            <button type="button" className="row-shots" onClick={() => showSamples(set.id)} aria-label={`شاهد صور ${productTitle(p)} الحقيقية، عددها ${samples.length}`}>
              {samples.slice(0, 5).map((d) => (
                <img key={d.id} src={d.tiny} alt="" loading="lazy" width={200} height={200} />
              ))}
              <span>صور حقيقية من المعرض</span>
            </button>
          ) : null}

          <div className="row-actions">
            <button type="button" className={`btn btn-sm ${added ? "btn-done" : "btn-primary"}`} onClick={() => add(requestItem(p, finish))}>
              {added ? <IconCheck /> : <IconPlus />} {added ? "في طلبك" : "أضف لطلبي"}
            </button>
            {isRect(p) ? (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => openCalculator(p)}>
                احسب الكمية
              </button>
            ) : null}
            {set ? (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => showSamples(set.id)}>
                <IconGrid /> شاهد العيّنات
              </button>
            ) : null}
            {video ? (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => playVideo(video.id)}>
                <IconPlay /> شاهد الفيديو
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
