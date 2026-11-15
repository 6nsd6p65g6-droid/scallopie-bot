import { useEffect, useState, type CSSProperties } from "react";
import {
  finishOrder,
  isRect,
  kinds,
  lookTexture,
  originNames,
  originOrder,
  originShort,
  outdoorLabel,
  products,
  productName,
  productTitle,
  useNames,
  videoForProduct,
  type Finish,
  type Kind,
  type OriginId,
  type Product,
  type RectProduct,
} from "../../site-data";
import type { CalcDetail } from "./calculator";
import { normalize, prefersReducedMotion } from "./fx";
import { playVideo } from "./hero";
import { IconCheck, IconChevron, IconClose, IconPlay, IconPlus, IconRotate, IconSearch } from "./icons";
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

export function openCalculator(p: RectProduct) {
  const detail: CalcDetail = { id: p.id, w: p.w, h: p.h, title: productTitle(p), origin: originNames[p.origin], kind: p.kind, use: p.use, outdoor: !!p.outdoor };
  window.dispatchEvent(new CustomEvent("am:calc", { detail }));
  document.getElementById("calculator")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

const countWord = (n: number) => (n === 1 ? "صنف" : n === 2 ? "صنفان" : n <= 10 ? "أصناف" : "صنفاً");

export function Catalog() {
  const [origin, setOrigin] = useState<OriginFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [finish, setFinish] = useState<FinishFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const onOrigin = (e: Event) => {
      setOrigin((e as CustomEvent<OriginId>).detail);
      setKind("all");
      setFinish("all");
      setQuery("");
    };
    window.addEventListener("ms:origin", onOrigin);
    return () => window.removeEventListener("ms:origin", onOrigin);
  }, []);

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
        <div className="sec-head" data-reveal>
          <span className="orn" aria-hidden="true" />
          <h2 className="h2">قائمة الأصناف</h2>
          <p className="lead">كل الأصناف مرتبة حسب بلد الصناعة. ابحث أو اختر النوع، واضغط على الصنف لترى تفاصيله.</p>
        </div>

        <div className="cat-tools" data-reveal>
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

          <div className="tabs" role="group" aria-label="بلد الصناعة">
            <Tab on={origin === "all"} onClick={() => setOrigin("all")} label="الكل" n={count(() => true, "origin")} />
            {originOrder.map((o) => (
              <Tab key={o} on={origin === o} onClick={() => setOrigin(o)} label={originShort[o]} n={count((p) => p.origin === o, "origin")} />
            ))}
          </div>

          <div className="chips" role="group" aria-label="نوع البلاط">
            <Chip on={kind === "all"} onClick={() => setKind("all")} label="كل الأنواع" />
            {kinds.map((k) => (
              <Chip key={k} on={kind === k} onClick={() => setKind(k)} label={k} n={count((p) => p.kind === k, "kind")} />
            ))}
          </div>

          <div className="chips chips-soft" role="group" aria-label="درجة اللمعة">
            <span className="chips-label">اللمعة</span>
            <Chip on={finish === "all"} onClick={() => setFinish("all")} label="الكل" />
            {finishesInUse.map((f) => (
              <Chip key={f} on={finish === f} onClick={() => setFinish(f)} label={f} n={count((p) => !!p.finishes?.includes(f), "finish")} />
            ))}
          </div>
        </div>

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
        <p className="muted small cat-note">العيّنات الصغيرة توضيحية، والتصاميم والألوان المتوفرة تُعرض في المعرض.</p>
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

// عيّنة الصنف: معيَّن صغير بخامته. الصورة الحقيقية (swatch) تتقدم على الخامة التوضيحية.
export function Swatch({ product: p }: { product: Product }) {
  const image = p.swatch ?? lookTexture[p.look];
  return (
    <span className={`sw ${p.shape === "hex" ? "sw-hex" : ""}`} data-look={p.look} aria-hidden="true">
      <i style={image ? { backgroundImage: `url(${image})` } : undefined} />
    </span>
  );
}

// شكل البلاطة بنسبة مقاسها الحقيقي (120 سم = 30 بكسل) للمقارنة بين المقاسات.
function SizeGlyph({ product: p }: { product: Product }) {
  if (!isRect(p)) return <span className="glyph glyph-hex" aria-hidden="true" />;
  return <span className="glyph" style={{ width: `${(p.w / 120) * 30}px`, height: `${(p.h / 120) * 30}px` }} aria-hidden="true" />;
}

function Row({ product: p, open, onToggle }: { product: Product; open: boolean; onToggle: () => void }) {
  const { add, has } = useRequest();
  const [finish, setFinish] = useState<Finish | undefined>(p.finishes?.[0]);
  const added = has(p.id);
  const video = videoForProduct(p.id);
  const usage = usageOf(p);
  const panelId = `row-${p.id}`;

  return (
    <li className={`row ${open ? "is-open" : ""}`}>
      <div className="row-head">
        <button type="button" className="row-toggle" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <Swatch product={p} />
          <span className="row-title">
            <strong>{productName(p)}</strong>
            <span className="row-size">
              {p.size ?? "شكل سداسي"}
              <SizeGlyph product={p} />
            </span>
          </span>
          <span className="row-meta">
            {usage ? <span>{usage}</span> : null}
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

          {video ? (
            <div className="shots" role="img" aria-label={`${video.shots.length} تصاميم من فيديو المعرض`}>
              {video.shots.map((s) => (
                <span key={s} style={{ backgroundImage: `url(${s})` }} />
              ))}
            </div>
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
