import { useEffect, useState } from "react";
import { motion } from "../lib/motion-lite";
import { useTranslation, Trans } from "../lib/i18n";
import { Mail, Instagram, Linkedin, CheckCircle } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { sendContact, type ContactType } from "../lib/api";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";
import { usePage } from "../lib/page";
import { pageHref } from "../routes";
import { withBase } from "../lib/paths";

interface FormState {
  name: string;
  email: string;
  website: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  website?: string;
  consent?: string;
}

const INITIAL: FormState = { name: "", email: "", website: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Los enlaces a #contacto-propuesta preseleccionan la propuesta gratis
// (#contacto-3videos es el ancla antigua y sigue funcionando); los de
// #contacto, "Un presupuesto".
const PROPOSAL_HASHES = ["#contacto-propuesta", "#contacto-3videos"];
const HASH_QUOTE = "#contacto";

function typeFromHash(hash: string): ContactType | null {
  if (PROPOSAL_HASHES.includes(hash)) return "proposal";
  if (hash === HASH_QUOTE) return "quote";
  return null;
}

export default function Contact() {
  const { t } = useTranslation();
  const { lang: pageLang } = usePage();
  const [type, setType] = useState<ContactType>("quote");
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedType, setSubmittedType] = useState<ContactType | null>(null);
  const [serverError, setServerError] = useState(false);
  const [consent, setConsent] = useState(false);

  // Preselección según el enlace por el que se llega (al cargar y en cada clic,
  // también cuando se pulsa dos veces el mismo enlace y el hash no cambia).
  useEffect(() => {
    const initial = typeFromHash(window.location.hash);
    if (initial) setType(initial);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const hash = href.slice(href.indexOf("#"));
      const next = href.includes("#") ? typeFromHash(hash) : null;
      if (next) {
        setType(next);
        setSubmittedType(null);
      }
    };
    // Cambios de ancla sin clic (escrita a mano, atrás/adelante del navegador)
    const onHashChange = () => {
      const next = typeFromHash(window.location.hash);
      if (next) setType(next);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = t("contact.form.errors.name_required");
    if (!form.email.trim()) errs.email = t("contact.form.errors.email_required");
    else if (!EMAIL_RE.test(form.email)) errs.email = t("contact.form.errors.email_invalid");
    if (type === "proposal" && !form.website.trim()) errs.website = t("contact.form.errors.website_required");
    if (!consent) errs.consent = t("contact.form.errors.consent_required");
    return errs;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setServerError(false);
    try {
      await sendContact({
        type,
        name: form.name.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        message: form.message.trim(),
      });
      setSubmittedType(type);
      setForm(INITIAL);
      setConsent(false);
      // A la página de gracias (noindex), con la frase de la propuesta si se pidió
      window.location.assign(pageHref("thanks", pageLang) + (type === "proposal" ? "?tipo=propuesta" : ""));
    } catch {
      setServerError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const chooseType = (next: ContactType) => {
    setType(next);
    if (next === "quote" && errors.website) setErrors((prev) => ({ ...prev, website: undefined }));
  };

  const inputCls =
    "w-full bg-navy border border-charcoal rounded-lg px-4 py-3 text-off-white text-sm placeholder-steel-blue/50 focus:border-brand-blue/60 focus:outline-none transition-colors duration-200";
  const labelCls = "text-xs font-semibold text-steel-blue uppercase tracking-wide";
  const errCls = "text-xs mt-1";
  const errStyle = { color: "oklch(65% 0.18 25)" };
  const isProposal = type === "proposal";

  return (
    <section id="contacto" className="section-gap relative overflow-hidden isolate">
      {/* Fondo: foto de Pol a todo el bloque, con una capa oscura para que el texto y el formulario resalten */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <img
          src={withBase("/pol-morera-camara.webp")}
          alt=""
          width={1000}
          height={1251}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(13, 27, 42, 0.82)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0D1B2A 0%, rgba(13,27,42,0) 18%, rgba(13,27,42,0) 82%, #0D1B2A 100%)" }} />
      </div>
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <motion.span variants={fadeUp} className="eyebrow">
                {t("contact.eyebrow")}
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-off-white font-bold"
                style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
              >
                {t("contact.title")}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-steel-blue text-lg">
                {t("contact.subtitle")}
              </motion.p>
              <motion.p variants={fadeUp} className="text-steel-blue">
                {t("contact.fixed_quote")}
              </motion.p>
            </div>

            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              {/* WhatsApp: lo primero de la columna, con el estilo del botón principal */}
              <a
                href={whatsappUrl(t("contact.whatsapp_msg"))}
                target="_blank"
                rel="noopener"
                className="self-start inline-flex items-center gap-3 bg-brand-blue text-off-white font-semibold text-base px-6 py-3.5 rounded-lg hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.01] mb-2"
              >
                <WhatsAppIcon size={20} />
                {t("contact.whatsapp")}
              </a>
              <a
                href={`mailto:${t("contact.email")}`}
                className="flex items-center gap-3 text-steel-blue hover:text-off-white transition-colors group"
              >
                <Mail size={18} className="text-brand-blue" />
                <span className="text-sm">{t("contact.email")}</span>
              </a>
              <a
                href="https://www.instagram.com/polmoreraugc/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-steel-blue hover:text-off-white transition-colors group"
              >
                <Instagram size={18} className="text-brand-blue" />
                <span className="text-sm">@polmoreraugc</span>
              </a>
              <a
                href="https://www.linkedin.com/in/pol-morera-de-frutos-9b8b35124/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-steel-blue hover:text-off-white transition-colors group"
              >
                <Linkedin size={18} className="text-brand-blue" />
                <span className="text-sm">Pol Morera</span>
              </a>
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            variants={fadeUp}
            className="bg-charcoal rounded-xl p-8 lg:p-12 border border-brand-blue/10 relative"
          >
            {/* Destinos de los enlaces a la propuesta gratis (el segundo es el antiguo) */}
            <span id="contacto-propuesta" className="absolute -top-24" aria-hidden="true" />
            <span id="contacto-3videos" className="absolute -top-24" aria-hidden="true" />

            {submittedType ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle size={48} className="text-brand-blue" />
                <p className="text-off-white font-semibold text-lg">
                  {submittedType === "proposal" ? t("contact.form.success_videos3") : t("contact.form.success")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* ¿Qué necesitas? — pastillas con el estilo de los filtros del portfolio */}
                <fieldset className="flex flex-col gap-2.5">
                  <legend className={`${labelCls} mb-2.5`}>{t("contact.form.type_question")}</legend>
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {(["quote", "proposal"] as ContactType[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={type === key}
                        onClick={() => chooseType(key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                          type === key
                            ? "bg-brand-blue text-off-white"
                            : "border border-steel-blue/30 text-steel-blue hover:border-steel-blue/60 hover:text-off-white"
                        }`}
                      >
                        {t(key === "quote" ? "contact.form.type_quote" : "contact.form.type_videos3")}
                      </button>
                    ))}
                  </div>
                  {isProposal && (
                    <p className="text-xs text-steel-blue/80">{t("contact.form.type_help")}</p>
                  )}
                </fieldset>

                {/* Nombre y empresa */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>{t("contact.form.fields.name")} *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Ana García · Empresa S.L."
                    className={`${inputCls}${errors.name ? " border-red-500/60" : ""}`}
                  />
                  {errors.name && <p className={errCls} style={errStyle}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>{t("contact.form.fields.email")} *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="ana@empresa.com"
                    className={`${inputCls}${errors.email ? " border-red-500/60" : ""}`}
                  />
                  {errors.email && <p className={errCls} style={errStyle}>{errors.email}</p>}
                </div>

                {/* Web o Instagram: obligatorio solo con la propuesta gratis */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>
                    {t("contact.form.fields.website")}{isProposal ? " *" : ""}
                  </label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={set("website")}
                    placeholder={t("contact.form.website_placeholder")}
                    className={`${inputCls}${errors.website ? " border-red-500/60" : ""}`}
                  />
                  {errors.website && <p className={errCls} style={errStyle}>{errors.website}</p>}
                </div>

                {/* Mensaje */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>{t("contact.form.fields.message")}</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    placeholder={t(isProposal ? "contact.form.message_placeholder_videos3" : "contact.form.message_placeholder")}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Consentimiento (obligatorio) + información básica de protección de datos */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-start gap-3 cursor-pointer text-sm text-steel-blue">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
                      }}
                      className="mt-0.5 w-4 h-4 shrink-0 accent-brand-blue cursor-pointer"
                    />
                    <span>
                      <Trans
                        i18nKey="contact.form.consent"
                        components={{ link: <a href={withBase("/politica-privacidad")} target="_blank" rel="noopener" className="text-brand-blue underline underline-offset-2 hover:text-off-white" /> }}
                      />
                    </span>
                  </label>
                  {errors.consent && <p className={errCls} style={errStyle}>{errors.consent}</p>}
                </div>

                <p className="text-[11px] leading-relaxed text-steel-blue/70">
                  <Trans
                    i18nKey="contact.form.info"
                    components={{ link: <a href={withBase("/politica-privacidad")} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-steel-blue" /> }}
                  />
                </p>

                {serverError && (
                  <p className="text-xs" style={errStyle}>
                    {t("contact.form.errors.server_error")}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 bg-brand-blue text-off-white font-semibold text-base px-8 py-3.5 rounded-lg hover:bg-brand-blue/90 transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span
                        className="inline-block w-4 h-4 border-2 border-off-white/30 border-t-off-white rounded-full animate-spin"
                      />
                      {t("contact.form.submitting")}
                    </span>
                  ) : (
                    t(isProposal ? "contact.form.submit_videos3" : "contact.form.submit")
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
