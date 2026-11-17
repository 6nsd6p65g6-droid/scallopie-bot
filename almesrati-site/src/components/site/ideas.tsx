import type { CSSProperties } from "react";
import { designById, designLabel, ideas, productById, productTitle, type Design, type Idea } from "../../site-data";
import { openDesign } from "./actions";
import { designRequestItem } from "./catalog";
import { SecHead } from "./head";
import { IconCheck, IconPlus, IconZoom } from "./icons";
import { useRequest } from "./request";

// أفكار لمساحتك: كل فكرة تُرسم من صور بلاطتين حقيقيتين من المعرض، مع أكوادهما.

const ROWS = 4;
const COLS = 6;

// أي البلاطتين في كل خانة من الشبكة.
function pick(layout: Idea["layout"], r: number, c: number) {
  if (layout === "frame") return r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1 ? 1 : 0;
  if (layout === "checker") return (r + c) % 2;
  if (layout === "path") return c === 2 || c === 3 ? 0 : 1;
  if (layout === "accent") return (r === 1 || r === 2) && (c === 2 || c === 3) ? 1 : 0;
  return 0;
}

export const ideaTiles = (idea: Idea) => idea.tiles.map((id) => designById(id)).filter(Boolean) as Design[];

// لوحة الفكرة: شبكة بلاط للأرضيات، أو ركن غرفة (حائط وأرضية) للبلاط الكبير.
export function IdeaBoard({ idea }: { idea: Idea }) {
  const [a, b] = ideaTiles(idea);
  if (!a || !b) return null;
  const vars = { "--ta": `url(${a.tiny})`, "--tb": `url(${b.tiny})` } as CSSProperties;
  const label = `تشكيل توضيحي: ${idea.title}، من البلاطتين ${designLabel(a)} و${designLabel(b)}`;

  if (idea.layout === "room") {
    return (
      <div className="ib ib-room" style={vars} role="img" aria-label={label}>
        <div className="ib-wall">
          {Array.from({ length: 20 }, (_, i) => (
            <i key={i} className="t0" />
          ))}
        </div>
        <div className="ib-floor">
          <div className="ib-plane">
            {Array.from({ length: 36 }, (_, i) => (
              <i key={i} className="t1" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cells = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) cells.push(<i key={`${r}-${c}`} className={`t${pick(idea.layout, r, c)} r${(r * 5 + c * 3 + r * c) % 4}`} />);
  return (
    <div className="ib ib-grid" style={vars} role="img" aria-label={label}>
      {cells}
    </div>
  );
}

export function Ideas() {
  const { add, has } = useRequest();
  return (
    <section className="sec sec-ideas" id="ideas" aria-labelledby="ideas-title">
      <div className="wrap">
        <SecHead
          id="ideas-title"
          kicker="من بلاطنا الحقيقي"
          title="أفكار لمساحتك"
          lead="تشكيلات جاهزة من بلاطتين من أصنافنا: للحوش والمدخل والسطح والحمّام والصالة. كل فكرة مرسومة من صور البلاط الحقيقية، ومكتوب عليها كود كل بلاطة."
        />
        <ul className="id-list">
          {ideas.map((idea, i) => {
            const tiles = ideaTiles(idea);
            if (tiles.length < 2) return null;
            const items = tiles.map(designRequestItem);
            const added = items.every((it) => has(it.key));
            return (
              <li key={idea.id} className="id-card" data-reveal style={{ "--d": `${i * 60}ms` } as CSSProperties}>
                <IdeaBoard idea={idea} />
                <div className="id-body">
                  <p className="id-place">{idea.place}</p>
                  <h3>{idea.title}</h3>
                  <p className="id-text">{idea.text}</p>
                  <ul className="id-tiles">
                    {tiles.map((d, k) => {
                      const p = productById(d.productId);
                      return (
                        <li key={d.id}>
                          <button type="button" className="id-tile" onClick={() => openDesign(d.id)} aria-label={`تكبير الصورة الحقيقية: ${idea.roles[k]}، ${designLabel(d)}، ${d.look}`}>
                            <span className="id-pic">
                              <img src={d.tiny} alt="" loading="lazy" width={200} height={200} />
                              <i>
                                <IconZoom />
                              </i>
                            </span>
                            <span className="id-tile-text">
                              <em>{idea.roles[k]}</em>
                              <strong>{designLabel(d)}</strong>
                              <span>{p ? productTitle(p) : ""}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button type="button" className={`btn btn-sm ${added ? "btn-done" : "btn-primary"}`} onClick={() => items.forEach((it) => add(it))}>
                    {added ? <IconCheck /> : <IconPlus />} {added ? "البلاطتان في طلبك" : "أضف البلاطتين لطلبي"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="id-note">
          الأشكال مرسومة من صور بلاطنا الحقيقية لتقريب الفكرة فقط، والمقاسات في الرسم تقريبية. اضغط على أي بلاطة لترى صورتها الكاملة، والعيّنات نفسها في المعرض.
        </p>
      </div>
    </section>
  );
}
