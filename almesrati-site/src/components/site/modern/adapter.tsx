import { useState } from "react";
import { designLabel, originNames, productById, productTitle, type Design } from "../../../site-data";
import { scrollToId } from "../actions";
import { designRequestItem } from "../catalog";
import { IconCheck, IconPlus, IconZoom } from "../icons";
import { Lightbox, type LightboxItem } from "../lightbox";
import { useRequest } from "../request";
import type { GalleryItem } from "./data";

// ما يختلف بين الموقعين: عارض الصور، والتنقّل، ومكان قائمة المنتجات.
export { IconCheck, IconPlus, IconZoom, designRequestItem, scrollToId };
export const PRODUCTS_ANCHOR = "samples";

const tileItem = (d: Design): LightboxItem => {
  const p = productById(d.productId);
  return {
    image: d.image,
    alt: `صورة حقيقية: ${p ? productTitle(p) : ""}، ${designLabel(d)}، ${d.look}`,
    caption: `${p ? productTitle(p) : ""}، ${designLabel(d)}`,
    note: p ? `${d.look} · ${originNames[p.origin]}` : d.look,
  };
};

type Box = { items: LightboxItem[]; designs: (Design | undefined)[]; index: number };

export function useViewer() {
  const { add, has } = useRequest();
  const [box, setBox] = useState<Box | null>(null);
  const openTiles = (list: Design[], index = 0) => setBox({ items: list.map(tileItem), designs: list, index });
  const openScenes = (list: GalleryItem[], index: number) =>
    setBox({
      items: list.map((g) => ({
        image: g.img.large,
        alt: `${g.scene.title}: تصميم توضيحي من صورة بلاطة حقيقية`,
        caption: g.scene.title,
        note: g.design ? `تصميم توضيحي · البلاط: ${designLabel(g.design)}، ${g.design.look}` : "تصميم توضيحي",
      })),
      designs: list.map((g) => g.design),
      index,
    });
  const current = box ? box.designs[box.index] : undefined;
  const item = current ? designRequestItem(current) : null;
  const added = item ? has(item.key) : false;
  const node = box ? (
    <Lightbox
      items={box.items}
      index={box.index}
      onClose={() => setBox(null)}
      onNav={(i) => setBox((b) => (b ? { ...b, index: i } : b))}
      actions={
        item ? (
          <button type="button" className={`btn btn-sm ${added ? "btn-done" : "btn-gold"}`} onClick={() => add(item)}>
            {added ? <IconCheck /> : <IconPlus />} {added ? "في طلبك" : "أضف لطلبي"}
          </button>
        ) : null
      }
    />
  ) : null;
  return { openTiles, openScenes, node };
}
