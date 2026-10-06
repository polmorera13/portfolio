import { useState } from "react";
import { useTranslation, Trans } from "../lib/i18n";
import { sendContact } from "../lib/api";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";

// Formulario de la landing de anuncios: siempre es la propuesta gratis, con los
// campos justos. Al mensaje se le añade qué vídeo le interesa y de qué anuncio
// llega (utm_source, utm_campaign…), para saberlo en el correo.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

interface Errors { name?: string; email?: string; website?: string; consent?: string }

function origin(): string {
  const q = new URLSearchParams(window.location.search);
  const utm = UTM_KEYS.filter((k) => q.get(k)).map((k) => `${k}=${q.get(k)}`);
  if (q.get("fbclid")) utm.push("fbclid");
  if (q.get("gclid")) utm.push("gclid");
  return `Landing de anuncios (${window.location.pathname})${utm.length ? " · " + utm.join(" · ") : ""}`;
}

export default function LandingForm() {
  const { t } = useTranslation();
  const { lang } = usePage();
  const [form, setForm] = useState({ name: "", email: "", website: "", message: "" });
  const [needs, setNeeds] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(false);
  const options = t("landing.need_options", { returnObjects: true }) as string[];

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field as keyof Errors]) setErrors((p) => ({ ...p, [field]: undefined }));
  };
  const toggle = (o: string) => setNeeds((n) => (n.includes(o) ? n.filter((x) => x !== o) : [...n, o]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!form.name.trim()) errs.name = t("contact.form.errors.name_required");
    if (!form.email.trim()) errs.email = t("contact.form.errors.email_required");
    else if (!EMAIL_RE.test(form.email)) errs.email = t("contact.form.errors.email_invalid");
    if (!form.website.trim()) errs.website = t("contact.form.errors.website_required");
    if (!consent) errs.consent = t("contact.form.errors.consent_required");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setServerError(false);
    try {
      const extra = [needs.length ? `Le interesa: ${needs.join(", ")}` : "", `Llega desde: ${origin()}`].filter(Boolean).join("\n");
      await sendContact({
        type: "proposal",
        name: form.name.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        message: [form.message.trim(), "—", extra].filter(Boolean).join("\n\n"),
      });
      window.location.assign(pageHref("thanks", lang) + "?tipo=propuesta");
    } catch {
      setServerError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-navy border border-charcoal rounded-lg px-4 py-3 text-off-white text-base placeholder-steel-blue/50 focus:border-brand-blue/60 focus:outline-none transition-colors duration-200";
  const labelCls = "text-xs font-semibold text-steel-blue uppercase tracking-wide";
  const errStyle = { color: "oklch(65% 0.18 25)" };
  const privacy = pageHref("privacy", lang);

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lf-name" className={labelCls}>{t("contact.form.fields.name")} *</label>
        <input id="lf-name" type="text" autoComplete="name" value={form.name} onChange={set("name")} placeholder="Ana García · Empresa S.L." className={`${inputCls}${errors.name ? " border-red-500/60" : ""}`} />
        {errors.name && <p className="text-xs" style={errStyle}>{errors.name}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lf-email" className={labelCls}>{t("contact.form.fields.email")} *</label>
        <input id="lf-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="ana@empresa.com" className={`${inputCls}${errors.email ? " border-red-500/60" : ""}`} />
        {errors.email && <p className="text-xs" style={errStyle}>{errors.email}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lf-web" className={labelCls}>{t("contact.form.fields.website")} *</label>
        <input id="lf-web" type="text" autoComplete="url" value={form.website} onChange={set("website")} placeholder={t("contact.form.website_placeholder")} className={`${inputCls}${errors.website ? " border-red-500/60" : ""}`} />
        {errors.website && <p className="text-xs" style={errStyle}>{errors.website}</p>}
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className={`${labelCls} mb-2.5`}>
          {t("landing.form_need")} <span className="normal-case font-normal tracking-normal">{t("landing.form_need_optional")}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const on = needs.includes(o);
            return (
              <button
                key={o}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(o)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  on ? "bg-brand-blue-deep text-off-white" : "border border-steel-blue/30 text-steel-blue hover:border-steel-blue/60 hover:text-off-white"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lf-msg" className={labelCls}>{t("contact.form.fields.message")}</label>
        <textarea id="lf-msg" rows={3} value={form.message} onChange={set("message")} placeholder={t("contact.form.message_placeholder_videos3")} className={`${inputCls} resize-none`} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 cursor-pointer text-sm text-steel-blue">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => { setConsent(e.target.checked); if (errors.consent) setErrors((p) => ({ ...p, consent: undefined })); }}
            className="mt-0.5 w-4 h-4 shrink-0 accent-brand-blue cursor-pointer"
          />
          <span>
            <Trans i18nKey="contact.form.consent" components={{ link: <a href={privacy} target="_blank" rel="noopener" className="text-brand-blue underline underline-offset-2 hover:text-off-white" /> }} />
          </span>
        </label>
        {errors.consent && <p className="text-xs" style={errStyle}>{errors.consent}</p>}
      </div>

      <p className="text-[11px] leading-relaxed text-steel-blue/80">
        <Trans i18nKey="contact.form.info" components={{ link: <a href={privacy} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-steel-blue" /> }} />
      </p>

      {serverError && <p className="text-xs" style={errStyle}>{t("contact.form.errors.server_error")}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-blue-deep text-off-white font-semibold text-lg px-8 py-4 rounded-lg hover:bg-brand-blue-deep/90 transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? t("contact.form.submitting") : t("landing.cta")}
      </button>
    </form>
  );
}
