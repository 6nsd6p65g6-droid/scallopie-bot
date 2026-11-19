// عنوان القسم: سطر صغير، ثم العنوان، ثم زخرفة الشعار (خط ذهبي يتوسطه معيَّن)، ثم الشرح.
export function SecHead({ kicker, title, lead, id }: { kicker?: string; title: string; lead?: string; id?: string }) {
  return (
    <div className="sec-head" data-reveal>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2 className="h2" id={id}>
        {title}
      </h2>
      <span className="orn" aria-hidden="true" />
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}
