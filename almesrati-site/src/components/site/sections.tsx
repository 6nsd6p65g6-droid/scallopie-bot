import { useEffect, useState, type CSSProperties } from "react";
import { branches, company, phoneLabel, phones, shopCoords, socials, telHref, waHref, workHours, type Phone, type WorkHours } from "../../site-data";
import { formatClock, sunsetMinutes } from "./fx";
import { SecHead } from "./head";
import { IconArrow, IconCalc, IconChat, IconClock, IconGrid, IconHeart, IconHome, IconList, IconPhone, IconPin, IconStack } from "./icons";
import { useRequest } from "./request";

// روابط الشريط العلوي: ثلاثة على كل جانب من الشعار.
const navStart = [
  { id: "looks", label: "التصاميم" },
  { id: "samples", label: "العيّنات" },
  { id: "videos", label: "الفيديو" },
];
const navEnd = [
  { id: "catalog", label: "الأصناف" },
  { id: "calculator", label: "الحاسبة" },
  { id: "contact", label: "تواصل معنا" },
];
const allLinks = [...navStart, ...navEnd];
const sectionIds = ["looks", "samples", "videos", "catalog", "calculator", "steps", "contact"];

// القسم الظاهر الآن في منتصف الشاشة، لتمييز رابطه.
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = document.getElementById("top");
    const ioTop = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { rootMargin: "-45% 0px -50% 0px" });
    if (top) ioTop.observe(top);
    return () => {
      io.disconnect();
      ioTop.disconnect();
    };
  }, []);
  return active;
}

// أول رقم عليه واتساب: للمحادثة السريعة من الشريط العلوي.
const waPhone = [...phones, ...branches.flatMap((b) => b.phones ?? [])].find((p) => p.whatsapp);
const greeting = `مرحباً، أستفسر عن أصناف ${company.fullName}`;

// الشريط العلوي: الشعار في الوسط والروابط على جانبيه. على الجوال يبقى الشعار والاسم وزر واتساب، والتنقل من الشريط السفلي.
export function Header() {
  const { items, setOpen, pulse } = useRequest();
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const link = (l: { id: string; label: string }) => (
    <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined}>
      {l.label}
    </a>
  );

  return (
    <header className={`hd ${scrolled ? "is-scrolled" : ""}`}>
      <div className="wrap hd-in">
        <div className="hd-side hd-side-a">
          <a href="#top" className="hd-word" aria-label={`${company.fullName}: أعلى الصفحة`}>
            <strong>{company.name}</strong>
            <span>{company.descriptor}</span>
          </a>
          <nav className="hd-nav" aria-label="أقسام الموقع">
            {navStart.map(link)}
          </nav>
        </div>
        <a href="#top" className="hd-logo" aria-label={`${company.fullName}: أعلى الصفحة`}>
          <img src="brand/logo-192.png" alt="" width={192} height={192} />
        </a>
        <div className="hd-side hd-side-b">
          <nav className="hd-nav" aria-label="أدوات الموقع">
            {navEnd.map(link)}
          </nav>
          <div className="hd-acts">
            {waPhone ? (
              <a className="hd-wa" href={waHref(waPhone.number, greeting)} target="_blank" rel="noopener noreferrer" aria-label={`راسلنا على واتساب: ${waPhone.number}`}>
                <IconChat />
              </a>
            ) : null}
            <button type="button" className="hd-req" onClick={() => setOpen(true)} aria-label={`طلبي، ${items.length} عناصر`}>
              <IconList />
              <span className="hd-req-label">طلبي</span>
              <span key={pulse} className={`badge ${items.length ? "is-on" : ""}`}>
                {items.length}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// شريط الجوال السفلي: خمسة أزرار ثابتة تحت الإبهام بدل القائمة المخفية.
const tabs = [
  { id: "looks", label: "التصاميم", icon: <IconHome /> },
  { id: "samples", label: "العيّنات", icon: <IconGrid /> },
  { id: "catalog", label: "الأصناف", icon: <IconStack /> },
  { id: "calculator", label: "الحاسبة", icon: <IconCalc /> },
];

export function TabBar() {
  const { items, open, setOpen, pulse } = useRequest();
  const active = useActiveSection();
  return (
    <nav className="tb" aria-label="التنقل السريع">
      {tabs.map((t) => (
        <a key={t.id} href={`#${t.id}`} className={active === t.id ? "is-on" : ""} aria-current={active === t.id ? "true" : undefined}>
          {t.icon}
          <span>{t.label}</span>
        </a>
      ))}
      <button type="button" className={open ? "is-on" : ""} onClick={() => setOpen(true)} aria-label={`طلبي، ${items.length} عناصر`}>
        <IconList />
        <span>طلبي</span>
        <span key={pulse} className={`badge ${items.length ? "is-on" : ""}`}>
          {items.length}
        </span>
      </button>
    </nav>
  );
}

const steps = [
  { title: "اختر ما يعجبك", text: "تصفح التصاميم وصور العيّنات الحقيقية، وأضف ما يعجبك إلى «طلبي» برقم تصميمه.", href: "#samples", cta: "صور العيّنات" },
  { title: "احسب الكمية", text: "أدخل مقاسات الغرفة أو الحمام أو الساحة، والحاسبة تعطيك عدد البلاط مع هامش الاحتياط.", href: "#calculator", cta: "حاسبة البلاط" },
  { title: "جهّز طلبك", text: "افتح «طلبي» فتجد الأصناف والكميات مكتوبة في رسالة واحدة جاهزة للإرسال.", href: "", cta: "افتح طلبي" },
];

export function Steps() {
  const { setOpen } = useRequest();
  return (
    <section className="sec sec-steps" id="steps">
      <div className="wrap">
        <SecHead kicker="من الصورة إلى بيتك" title="اطلب في ثلاث خطوات" />
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

// حالة المعرض الآن حسب أوقات العمل بتوقيت ليبيا: يفتح 10 صباحاً ويغلق مع المغرب، والجمعة عطلة.
function shopStatus(now: number, hours: WorkHours) {
  const local = new Date(now + shopCoords.utcOffset * 3600 * 1000);
  const day = local.getUTCDay();
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes();
  const sunset = sunsetMinutes(local, shopCoords.lat, shopCoords.lng, shopCoords.utcOffset);
  if (sunset === null) return null;
  const opens = hours.opensText;
  if (day === hours.closedDay) return { open: false, text: `مغلق اليوم (الجمعة)، نفتح غداً ${opens}` };
  if (minutes < hours.opensAt) return { open: false, text: `مغلق الآن، نفتح اليوم ${opens}` };
  if (minutes < sunset) return { open: true, text: `مفتوح الآن حتى المغرب، نحو ${formatClock(sunset)}` };
  const tomorrowClosed = (day + 1) % 7 === hours.closedDay;
  return { open: false, text: tomorrowClosed ? `مغلق الآن، نفتح السبت ${opens}` : `مغلق الآن، نفتح غداً ${opens}` };
}

// تُحسب في المتصفح فقط وتتحدث كل دقيقة، لأن الصفحة الجاهزة لا تعرف ساعة الزائر.
function useShopStatus() {
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    if (!workHours) return;
    const hours = workHours;
    const update = () => setStatus(shopStatus(Date.now(), hours));
    update();
    const t = window.setInterval(update, 60000);
    return () => window.clearInterval(t);
  }, []);
  return status;
}

function PhoneList({ list }: { list: Phone[] }) {
  return (
    <ul className="ct-phones">
      {list.map((p) => (
        <li key={p.number} className="ct-phone">
          <span className="ct-num" dir="ltr">
            {p.number}
          </span>
          <span className="ct-label">{phoneLabel(p)}</span>
          <span className="ct-acts">
            {p.whatsapp ? (
              <a className="btn btn-sm btn-wa" href={waHref(p.number, greeting)} target="_blank" rel="noopener noreferrer" aria-label={`راسلنا على واتساب: ${p.number}`}>
                <IconChat /> واتساب
              </a>
            ) : null}
            <a className="btn btn-sm btn-primary" href={telHref(p.number)} aria-label={`اتصل بنا: ${p.number}`}>
              <IconPhone /> اتصال
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Contact() {
  const status = useShopStatus();
  const hasBranches = branches.length > 0;
  const hasData = hasBranches || phones.length > 0 || socials.length > 0;
  const lead = hasBranches
    ? "زرنا في المعرض لتعاين الأصناف بنفسك، أو راسلنا على واتساب، أو اتصل بنا مباشرة."
    : hasData
      ? "راسلنا على واتساب أو اتصل بنا مباشرة، وتابع جديد الأصناف على صفحاتنا."
      : undefined;

  return (
    <section className="sec sec-contact" id="contact">
      <div className="wrap">
        <SecHead kicker={hasBranches ? "نسعد بزيارتك" : "نسعد بتواصلك"} title="تواصل معنا" lead={lead} />

        {hasData ? (
          <div className="ct">
            {branches.map((b, bi) => (
              <article key={b.id} className="ct-col ct-visit" data-reveal style={{ "--d": `${bi * 120}ms` } as CSSProperties}>
                <h3>
                  <IconPin /> {b.name}
                </h3>
                <dl className="ct-facts">
                  <div>
                    <dt>العنوان</dt>
                    <dd>{b.address}</dd>
                  </div>
                  {workHours ? (
                    <div>
                      <dt>أوقات العمل</dt>
                      <dd>
                        {workHours.days}، {workHours.time}
                        {workHours.closed ? <span className="ct-off">{workHours.closed}</span> : null}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {status ? (
                  <p className={`ct-status ${status.open ? "is-open" : ""}`}>
                    <i aria-hidden="true" /> {status.text}
                  </p>
                ) : null}
                {b.mapUrl ? (
                  <a className="btn btn-primary ct-map" href={b.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`موقع ${b.name} على خرائط Google`}>
                    <IconPin /> افتح الموقع على خرائط Google
                  </a>
                ) : null}
                {b.phones?.length ? <PhoneList list={b.phones} /> : null}
              </article>
            ))}

            {phones.length > 0 || socials.length > 0 ? (
              <div className="ct-col" data-reveal style={{ "--d": "120ms" } as CSSProperties}>
                {phones.length > 0 ? (
                  <>
                    <h3>
                      <IconPhone /> اتصل بنا
                    </h3>
                    <PhoneList list={phones} />
                  </>
                ) : null}
                {socials.length > 0 ? (
                  <>
                    <h3 className={phones.length > 0 ? "ct-sub" : undefined}>
                      <IconHeart /> تابعنا
                    </h3>
                    <div className="ct-socs">
                      {socials.map((so) => (
                        <a key={so.url} href={so.url} target="_blank" rel="noopener noreferrer" className="soc">
                          <span className="soc-platform">{so.platform}</span>
                          <span className="soc-handle" dir={so.handle.startsWith("@") ? "ltr" : undefined}>
                            {so.handle}
                          </span>
                          <span className="soc-go">
                            <IconArrow />
                          </span>
                        </a>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="pending" data-reveal>
            <strong>بيانات التواصل تُضاف هنا</strong>
            <p>عناوين الفروع، أرقام الهاتف وواتساب، ساعات العمل، وصفحات التواصل الاجتماعي. يظهر هذا الجزء تلقائياً عند إضافتها.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft-in">
        <a href="#top" className="ft-brand" aria-label={`${company.fullName}: أعلى الصفحة`}>
          <img src="brand/logo-192.png" alt="" width={192} height={192} loading="lazy" />
          <strong>{company.name}</strong>
          <span>{company.descriptor}</span>
        </a>
        {branches.length > 0 || workHours ? (
          <p className="ft-info">
            {branches.map((b) => b.address).join(" · ")}
            {branches.length > 0 && workHours ? <br /> : null}
            {workHours ? `${workHours.days}، ${workHours.time}` : null}
          </p>
        ) : null}
        <span className="orn orn-gold" aria-hidden="true" />
        <nav className="ft-links" aria-label="روابط الموقع">
          {allLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="ft-copy">
          © {new Date().getFullYear()} {company.fullName}
        </p>
      </div>
    </footer>
  );
}
