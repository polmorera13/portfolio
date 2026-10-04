import { useTranslation } from "react-i18next";

/** Tarjeta blanca de la metodología 3×3: 3 anuncios (cuerpos) × 3 ganchos = 9 versiones para testear.
 *  Va debajo de los puntos del servicio de anuncios (portada y página del servicio). */
export default function Method3x3() {
  const { t } = useTranslation();
  const m = t("svcpage.method3x3", { returnObjects: true }) as { title: string; subtitle: string; ad: string; hook: string };
  const hooks = ["A", "B", "C"];
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold" style={{ color: "#0D1B2A", fontSize: "clamp(22px, 2.2vw, 28px)", lineHeight: 1.15 }}>{m.title}</h3>
        <p className="font-semibold" style={{ color: "#3A4F63", fontSize: "15.5px", lineHeight: 1.45 }}>{m.subtitle}</p>
      </div>
      <div aria-hidden="true" className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: "auto repeat(3, minmax(0, 1fr))" }}>
        <span />
        {hooks.map((h) => (
          <span key={h} className="text-center text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "#4A6580" }}>{m.hook} {h}</span>
        ))}
        {[1, 2, 3].map((n) => (
          <div key={n} className="contents">
            <span className="self-center pr-1.5 text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap" style={{ color: "#4A6580" }}>{m.ad} {n}</span>
            {hooks.map((h) => (
              <span key={h} className="rounded-lg flex items-center justify-center font-bold text-sm h-9 sm:h-10"
                style={{ background: n === 1 && h === "A" ? "#4A90D9" : "#EAF2FB", color: n === 1 && h === "A" ? "#fff" : "#2F74C0" }}>
                {n}{h}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
