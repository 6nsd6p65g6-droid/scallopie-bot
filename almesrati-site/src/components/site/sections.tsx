import { useEffect, useState, type CSSProperties } from "react";
import { branches, company, socials, telHref, waHref, workHours } from "../../site-data";
import { IconArrow, IconChat, IconClock, IconClose, IconList, IconMenu, IconPhone, IconPin } from "./icons";
import { useRequest } from "./request";

const navLinks = [
  { href: "#videos", id: "videos", label: "الفيديو" },
  { href: "#catalog", id: "catalog", label: "الأصناف" },
  { href: "#calculator", id: "calculator", label: "حاسبة البلاط" },
  { href: "#steps", id: "steps", label: "طريقة الطلب" },
  { href: "#contact", id: "contact", label: "تواصل معنا" },
];

function Brand() {
  return (
    <>
      <img src="brand/logo-192.png" alt="" width={56} height={56} />
      <span className="brand-text">
        <strong>{company.name}</strong>
        <span>{company.descriptor}</span>
      </span>
    </>
  );
}

export function Header() {
  const { items, setOpen, pulse } = useRequest();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", menu);
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header className={`hd ${scrolled ? "is-scrolled" : ""} ${menu ? "is-menu" : ""}`}>
      <div className="wrap hd-in">
        <a href="#top" className="brand" aria-label={company.fullName} onClick={() => setMenu(false)}>
          <Brand />
        </a>
        <nav className="hd-nav" aria-label="التنقل الرئيسي">
          {navLinks.map((l) => (
            <a key={l.id} href={l.href} aria-current={active === l.id ? "true" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hd-actions">
          <button type="button" className="hd-req" onClick={() => setOpen(true)} aria-label={`طلبي، ${items.length} عناصر`}>
            <IconList />
            <span className="hd-req-label">طلبي</span>
            <span key={pulse} className={`badge ${items.length ? "is-on" : ""}`}>
              {items.length}
            </span>
          </button>
          <button type="button" className="hd-burger" aria-expanded={menu} aria-controls="mnav" aria-label="القائمة" onClick={() => setMenu((v) => !v)}>
            {menu ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      <nav id="mnav" className="mnav" aria-label="قائمة الجوال" inert={!menu}>
        {navLinks.map((l, i) => (
          <a key={l.id} href={l.href} onClick={() => setMenu(false)} style={{ "--i": i } as CSSProperties}>
            {l.label}
            <IconArrow />
          </a>
        ))}
      </nav>
    </header>
  );
}

const steps = [
  { title: "اختر أصنافك", text: "تصفح قائمة الأصناف أو شاهدها بالفيديو، وأضف ما يعجبك إلى «طلبي».", href: "#catalog", cta: "قائمة الأصناف" },
  { title: "احسب الكمية", text: "أدخل مقاسات الغرفة أو الحمام أو الساحة، والحاسبة تعطيك عدد البلاط مع هامش الاحتياط.", href: "#calculator", cta: "حاسبة البلاط" },
  { title: "جهّز طلبك", text: "افتح «طلبي» فتجد الأصناف والكميات مكتوبة في رسالة واحدة جاهزة للإرسال.", href: "", cta: "افتح طلبي" },
];

export function Steps() {
  const { setOpen } = useRequest();
  return (
    <section className="sec sec-steps" id="steps">
      <div className="wrap">
        <div className="sec-head sec-head-center" data-reveal>
          <span className="orn" aria-hidden="true" />
          <h2 className="h2">اطلب في ثلاث خطوات</h2>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step" data-reveal style={{ "--d": `${i * 120}ms` } as CSSProperties}>
              <span className="step-num" aria-hidden="true">
                <b>{i + 1}</b>
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.href ? (
                <a className="btn btn-text" href={s.href}>
                  {s.cta} <IconArrow />
                </a>
              ) : (
                <button type="button" className="btn btn-text" onClick={() => setOpen(true)}>
                  {s.cta} <IconArrow />
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Contact() {
  const hasData = branches.length > 0 || socials.length > 0;
  return (
    <section className="sec sec-contact" id="contact">
      <div className="wrap">
        <div className="sec-head sec-head-light" data-reveal>
          <span className="orn" aria-hidden="true" />
          <h2 className="h2">تواصل معنا</h2>
          {hasData ? <p className="lead">زرنا لتعاين الأصناف بنفسك، أو راسلنا على واتساب، أو اتصل بنا مباشرة.</p> : null}
        </div>

        {branches.length > 0 ? (
          <div className="br-grid">
            {branches.map((b, bi) => (
              <article key={b.id} className="br" data-reveal style={{ "--d": `${bi * 120}ms` } as CSSProperties}>
                <h3>{b.name}</h3>
                <p className="br-line">
                  <IconPin /> <span>{b.address}</span>
                </p>
                {workHours ? (
                  <p className="br-line">
                    <IconClock />
                    <span>
                      {workHours.days}، {workHours.time}
                      {workHours.closed ? <span className="br-off">{workHours.closed}</span> : null}
                    </span>
                  </p>
                ) : null}
                {b.mapUrl ? (
                  <a className="btn btn-line btn-sm br-map" href={b.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`موقع ${b.name} على خرائط Google`}>
                    <IconPin /> افتح الموقع على الخريطة
                  </a>
                ) : null}
                <ul className="br-phones">
                  {b.phones.map((p) => (
                    <li key={p.number}>
                      <span className="br-name">{p.name}</span>
                      <span className="br-number" dir="ltr">
                        {p.number}
                      </span>
                      <span className="br-acts">
                        {p.whatsapp ? (
                          <a className="icon-btn icon-btn-wa" href={waHref(p.number, `مرحباً، أستفسر عن أصناف ${company.fullName}`)} target="_blank" rel="noopener noreferrer" aria-label={`واتساب ${p.name}`}>
                            <IconChat />
                          </a>
                        ) : null}
                        <a className="icon-btn icon-btn-call" href={telHref(p.number)} aria-label={`اتصال بـ${p.name}: ${p.number}`}>
                          <IconPhone />
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : null}

        {socials.length > 0 ? (
          <div className="soc-grid">
            {socials.map((s, i) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="soc" data-reveal style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <span className="soc-platform">{s.platform}</span>
                <span className="soc-handle" dir={s.handle.startsWith("@") ? "ltr" : undefined}>
                  {s.handle}
                </span>
                <span className="soc-go">
                  <IconArrow />
                </span>
              </a>
            ))}
          </div>
        ) : null}

        {!hasData ? (
          <div className="pending" data-reveal>
            <strong>بيانات التواصل تُضاف هنا</strong>
            <p>عناوين الفروع، أرقام الهاتف وواتساب، ساعات العمل، وصفحات التواصل الاجتماعي. يظهر هذا الجزء تلقائياً عند إضافتها.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft-in">
        <div className="brand brand-ft">
          <Brand />
        </div>
        <nav className="ft-links" aria-label="روابط الموقع">
          {navLinks.map((l) => (
            <a key={l.id} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="ft-copy">© {new Date().getFullYear()} {company.fullName}</p>
      </div>
    </footer>
  );
}
