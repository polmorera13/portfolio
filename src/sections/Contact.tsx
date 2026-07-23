import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Instagram, Linkedin, CheckCircle } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { sendContact } from "../lib/api";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const INITIAL: FormState = { name: "", email: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(false);

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
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm(INITIAL);
    } catch {
      setServerError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-navy border border-charcoal rounded-lg px-4 py-3 text-off-white text-sm placeholder-steel-blue/50 focus:border-brand-blue/60 focus:outline-none transition-colors duration-200";
  const errCls = "text-xs mt-1";

  return (
    <section id="contacto" className="section-gap">
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
            </div>

            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <a
                href={`mailto:${t("contact.email")}`}
                className="flex items-center gap-3 text-steel-blue hover:text-off-white transition-colors group"
              >
                <Mail size={18} className="text-brand-blue" />
                <span className="text-sm">{t("contact.email")}</span>
              </a>
              <a
                href="https://instagram.com/polmorera_cc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-steel-blue hover:text-off-white transition-colors group"
              >
                <Instagram size={18} className="text-brand-blue" />
                <span className="text-sm">@polmorera_cc</span>
              </a>
              <a
                href="https://linkedin.com/in/polmorera"
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
            className="bg-charcoal rounded-xl p-8 lg:p-12 border border-brand-blue/10"
          >
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle size={48} className="text-brand-blue" />
                <p className="text-off-white font-semibold text-lg">{t("contact.form.success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* Nombre y empresa */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-steel-blue uppercase tracking-wide">
                    {t("contact.form.fields.name")} *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Ana García · Empresa S.L."
                    className={`${inputCls}${errors.name ? " border-red-500/60" : ""}`}
                  />
                  {errors.name && (
                    <p className={errCls} style={{ color: "oklch(65% 0.18 25)" }}>{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-steel-blue uppercase tracking-wide">
                    {t("contact.form.fields.email")} *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="ana@empresa.com"
                    className={`${inputCls}${errors.email ? " border-red-500/60" : ""}`}
                  />
                  {errors.email && (
                    <p className={errCls} style={{ color: "oklch(65% 0.18 25)" }}>{errors.email}</p>
                  )}
                </div>

                {/* Mensaje */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-steel-blue uppercase tracking-wide">
                    {t("contact.form.fields.message")}
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Cuéntanos qué buscas…"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {serverError && (
                  <p className="text-xs" style={{ color: "oklch(65% 0.18 25)" }}>
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
                    t("contact.form.submit")
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
