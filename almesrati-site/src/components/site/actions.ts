import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./fx";

// أوامر تربط أقسام الصفحة ببعضها: قسم يطلب، والقسم المعني يستجيب.

const behavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: behavior() });
}

function send<T>(name: string, detail: T) {
  window.dispatchEvent(new CustomEvent<T>(name, { detail }));
}

// يفتح فيديو المعرض في المشغّل.
export const playVideo = (videoId: string) => send("ms:video", videoId);

// يكبّر صورة تصميم حقيقي.
export const openDesign = (designId: string) => send("ms:design", designId);

// ينتقل إلى قسم العيّنات ويفتح تبويب المجموعة المطلوبة.
export function showSamples(setId: string) {
  send("ms:samples", setId);
  scrollToId("samples");
}

// يستمع القسم لأمر موجّه إليه.
export function useSiteEvent<T>(name: string, handler: (detail: T) => void) {
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => {
    const on = (e: Event) => latest.current((e as CustomEvent<T>).detail);
    window.addEventListener(name, on);
    return () => window.removeEventListener(name, on);
  }, [name]);
}
