import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLang } from "../../contexts/LanguageContext";
import { NAV } from "../../i18n/content";

export const SectionTitle = ({ eyebrow, title, subtitle, align = "left", className = "" }) => (
  <div className={`${align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"} ${className}`}>
    {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
    <h2 className="heading-2">{title}</h2>
    {subtitle && <p className="lead mt-5">{subtitle}</p>}
  </div>
);

export const PageHero = ({ eyebrow, title, subtitle, accent, image, children, testId = "page-hero" }) => (
  <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden" data-testid={testId}>
    <div className="absolute inset-0 dot-grid dot-grid-fade -z-10" />
    <div className="container-max relative">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow && <div className="eyebrow mb-6">{eyebrow}</div>}
          <h1 className="heading-1">
            {title}
            {accent && <span className="text-signal-600"> {accent}</span>}
          </h1>
          {subtitle && <p className="lead mt-6 max-w-2xl">{subtitle}</p>}
          {children}
        </motion.div>
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-ink-100 shadow-2xl shadow-ink-900/10">
              <img src={image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  </section>
);

export const FinalCTA = ({ titleEn, titleId, subEn, subId }) => {
  const { lang } = useLang();
  const t = NAV[lang];
  return (
    <section className="section" data-testid="final-cta">
      <div className="container-max">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-10 sm:p-16">
          <div className="absolute inset-0 opacity-30 dot-grid" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)" }} />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-signal-600/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="eyebrow text-signal-300 mb-4">{lang === "id" ? "MULAI" : "GET STARTED"}</div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight leading-tight">
                {lang === "id" ? titleId : titleEn}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-ink-100 max-w-2xl">{lang === "id" ? subId : subEn}</p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-end">
              <Link
                to="/contact"
                data-testid="final-cta-primary"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-ink px-6 py-3.5 text-sm font-semibold hover:bg-ink-100 transition-colors"
              >
                {t.requestConsultation}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                data-testid="final-cta-secondary"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 text-white px-6 py-3.5 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                {t.startAssessment}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);
