import { designLabel, designs, originNames, productById, setById } from "../../site-data";
import { openDesign, showSamples } from "./actions";
import { designRequestItem } from "./catalog";
import { IconCheck, IconPlus, IconZoom } from "./icons";
import { useRequest } from "./request";

// وصل حديثاً: الأصناف الجديدة جنب بعض، وعلى كل واحد بلد الصناعة ولونه بوضوح.
export function NewArrivals() {
  const { add, has } = useRequest();
  const list = designs.filter((d) => setById(d.setId)?.isNew);
  if (!list.length) return null;
  return (
    <section className="news" id="new" aria-labelledby="news-title">
      <div className="wrap news-in">
        <div className="news-head" data-reveal>
          <p className="kicker">وصل حديثاً</p>
          <h2 id="news-title">ترافنتينو 120×60</h2>
          <span className="orn" aria-hidden="true" />
          <p>يُركّب في الحمامات والمطابخ وحيطان الديكور. صور حقيقية من المعرض.</p>
        </div>
        <ul className="news-list">
          {list.map((d, i) => {
            const p = productById(d.productId);
            const item = designRequestItem(d);
            const added = has(item.key);
            return (
              <li key={d.id} className="news-card" data-reveal style={{ ["--d" as string]: `${i * 120}ms` }}>
                <button type="button" className="news-pic" onClick={() => openDesign(d.id)} aria-label={`تكبير: ${d.look}، ${p ? originNames[p.origin] : ""}`}>
                  <img src={d.thumb} alt="" loading="lazy" />
                  <span className="news-zoom" aria-hidden="true">
                    <IconZoom />
                  </span>
                </button>
                <div className="news-text">
                  <span className="news-origin">{p ? originNames[p.origin] : ""}</span>
                  <strong>{d.look}</strong>
                  <span>
                    بورسلين 120×60{d.code ? ` · ${designLabel(d)}` : ""}
                  </span>
                  <div className="news-acts">
                    <button type="button" className={`btn btn-sm ${added ? "btn-done" : "btn-primary"}`} onClick={() => add(item)}>
                      {added ? <IconCheck /> : <IconPlus />} {added ? "في طلبك" : "أضف لطلبي"}
                    </button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => showSamples(d.setId)}>
                      العيّنات
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
