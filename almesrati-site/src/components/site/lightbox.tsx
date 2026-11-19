import { useEffect, useRef, type ReactNode } from "react";
import { IconChevron, IconClose } from "./icons";

// عارض الصور المكبّرة: يُستخدم لصور العيّنات الحقيقية ولتصاميم البيوت والحمامات.
export type LightboxItem = { image: string; alt: string; caption: string; note?: string };

export function Lightbox({
  items,
  index,
  onClose,
  onNav,
  actions,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
  actions?: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);
  const g = items[index];
  const n = items.length;

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
      if (n < 2) return;
      if (e.key === "ArrowLeft") onNav((index + 1) % n);
      if (e.key === "ArrowRight") onNav((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onClose, onNav]);

  if (!g) return null;

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={g.caption} onClick={onClose}>
      <figure
        className="lb-fig"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touch.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touch.current === null || n < 2) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          // الصفحة من اليمين لليسار: السحب لليمين يعرض التالي.
          if (dx > 50) onNav((index + 1) % n);
          if (dx < -50) onNav((index - 1 + n) % n);
        }}
      >
        <img key={g.image} src={g.image} alt={g.alt} />
        <figcaption>
          <span className="lb-cap">
            <strong>{g.caption}</strong>
            {g.note ? <span>{g.note}</span> : null}
          </span>
          {n > 1 ? (
            <span className="lb-count">
              {index + 1} / {n}
            </span>
          ) : null}
        </figcaption>
        {actions ? <div className="lb-actions">{actions}</div> : null}
      </figure>
      <button ref={closeRef} type="button" className="icon-btn lb-close" onClick={onClose} aria-label="إغلاق">
        <IconClose />
      </button>
      {n > 1 ? (
        <>
          <button
            type="button"
            className="icon-btn lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              onNav((index - 1 + n) % n);
            }}
            aria-label="الصورة السابقة"
          >
            <IconChevron dir="right" />
          </button>
          <button
            type="button"
            className="icon-btn lb-next"
            onClick={(e) => {
              e.stopPropagation();
              onNav((index + 1) % n);
            }}
            aria-label="الصورة التالية"
          >
            <IconChevron dir="left" />
          </button>
        </>
      ) : null}
    </div>
  );
}
