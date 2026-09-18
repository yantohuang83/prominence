import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, GitBranch, Lock, Layers, Cpu, Activity,
  Cloud, Network, Radio, Brain, Settings, ArrowRight,
  Landmark, Antenna, Banknote, Factory, Ship, Building2,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import {
  HOME, VALUE_CARDS, PLATFORM_PILLARS, INDUSTRIES, PRODUCTS,
  PARTNER_CATEGORIES, NAV, IMAGES,
} from "../i18n/content";
import { ThreeDCDiagram } from "../components/diagrams/Diagrams";
import { Reveal, FinalCTA } from "../components/shared/SectionPrimitives";

const ICONS = { ShieldCheck, GitBranch, Lock, Layers, Cpu, Activity, Cloud, Network, Radio, Brain, Settings, Landmark, Antenna, Banknote, Factory, Ship, Building2 };

const HeroVisual = () => (
  <div className="relative">
    <div className="relative aspect-square rounded-3xl overflow-hidden border border-ink-100 shadow-2xl shadow-ink-900/10">
      <img src={IMAGES.hero} alt="Sovereign cloud network" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/35 via-ink/10 to-transparent" />
      {/* Floating status card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 rounded-xl bg-white/95 backdrop-blur p-4 border border-ink-100 shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-signal-600">Sovereign Fabric · Live</span>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            99.99% SLA
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="font-display text-xl font-bold text-ink tabular">3</div>
            <div className="text-[10px] text-ink-500 uppercase tracking-wider">Data Centers</div>
          </div>
          <div>
            <div className="font-display text-xl font-bold text-ink tabular">120+</div>
            <div className="text-[10px] text-ink-500 uppercase tracking-wider">Edge Sites</div>
          </div>
          <div>
            <div className="font-display text-xl font-bold text-ink tabular">17</div>
            <div className="text-[10px] text-ink-500 uppercase tracking-wider">Industries</div>
          </div>
        </div>
      </motion.div>
      {/* Top tag */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6">
        <div className="chip border-white/40 bg-white/15 text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-300" />
          Indonesia · Sovereign
        </div>
      </div>
    </div>
  </div>
);

const Hero = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  const nav = NAV[lang];
  return (
    <section className="relative pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden" data-testid="home-hero">
      <div className="absolute inset-0 -z-10 dot-grid dot-grid-fade" />
      <div className="container-max">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7">
            <div className="eyebrow mb-6">{t.eyebrow}</div>
            <h1 className="heading-1">
              {t.heroTitle.split(" ").slice(0, -3).join(" ")}{" "}
              <span className="relative">
                <span className="text-signal-600">{t.heroTitle.split(" ").slice(-3).join(" ")}</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0,3 Q50,0 100,3 T200,3" stroke="#0055FF" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                </svg>
              </span>
            </h1>
            <p className="lead mt-7 max-w-2xl">{t.heroSubtitle}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link to="/contact" data-testid="hero-cta-primary" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-6 py-3.5 text-sm font-semibold hover:bg-ink-hover transition-colors">
                {t.heroCtaPrimary} <ArrowRight size={16} />
              </Link>
              <Link to="/platform" data-testid="hero-cta-secondary" className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 text-ink px-6 py-3.5 text-sm font-medium hover:bg-white transition-colors">
                {t.heroCtaSecondary}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-ink-500">
              {[
                lang === "id" ? "Residensi data Indonesia" : "Indonesian data residency",
                lang === "id" ? "SLA operator-grade" : "Operator-grade SLA",
                lang === "id" ? "Standar terbuka" : "Open standards",
                "Zero Trust",
              ].map((it) => (
                <span key={it} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-signal-600" />
                  {it}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

const Trusted = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  const logos = ["KEMENTERIAN", "BUMN", "BANK NASIONAL", "TELCO XYZ", "PORT AUTHORITY", "ENERGI NUSANTARA", "PEMKOT JAKARTA", "MIGAS INDONESIA"];
  return (
    <section className="border-y border-ink-100/70 bg-white" data-testid="home-trusted">
      <div className="container-max py-10">
        <div className="text-center text-xs font-semibold tracking-[0.22em] uppercase text-ink-500 mb-6">{t.trustedBy}</div>
        <div className="overflow-hidden">
          <div className="flex marquee-track gap-12 whitespace-nowrap">
            {[...logos, ...logos].map((l, i) => (
              <span key={`${l}-${i}`} className="font-display text-base font-semibold text-ink-300 tracking-wider">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ValueGrid = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  return (
    <section className="section" data-testid="home-value">
      <div className="container-max">
        <Reveal>
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">{lang === "id" ? "MENGAPA PROMINENCE" : "WHY PROMINENCE"}</div>
            <h2 className="heading-2">{t.valueTitle}</h2>
            <p className="lead mt-5">{t.valueSubtitle}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-100 rounded-2xl overflow-hidden border border-ink-100">
          {VALUE_CARDS.map((card, idx) => {
            const Icon = ICONS[card.icon];
            return (
              <Reveal key={card.key} delay={idx * 0.05}>
                <div className="bg-white p-8 h-full group hover:bg-ink-50 transition-colors" data-testid={`value-card-${card.key}`}>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white group-hover:bg-signal-600 transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-300">0{idx + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold text-ink">{card[lang].title}</h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{card[lang].body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const PlatformPreview = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  return (
    <section className="section bg-white" data-testid="home-platform">
      <div className="container-max">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="eyebrow mb-4">{lang === "id" ? "PLATFORM" : "PLATFORM"}</div>
            <h2 className="heading-2">{t.platformPreviewTitle}</h2>
            <p className="lead mt-5">{t.platformPreviewSubtitle}</p>
            <Link to="/platform" data-testid="home-platform-cta" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-signal-600 hover:text-signal-700">
              {lang === "id" ? "Lihat semua kapabilitas" : "View all capabilities"} <ArrowRight size={14} />
            </Link>
          </Reveal>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLATFORM_PILLARS.map((p, i) => {
              const Icon = ICONS[p.icon];
              return (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link to={`/platform/${p.slug}`} data-testid={`platform-card-${p.slug}`} className="block card-surface p-6 hover:-translate-y-0.5 transition-transform group">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-signal-50 text-signal-600">
                        <Icon size={16} />
                      </div>
                      <ArrowRight size={14} className="text-ink-300 group-hover:text-signal-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h3 className="mt-5 font-display font-semibold text-base text-ink">{p[lang].title}</h3>
                    <p className="mt-1.5 text-xs text-ink-500 leading-relaxed line-clamp-2">{p[lang].tagline}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const ArchitectureBlock = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  return (
    <section className="section" data-testid="home-architecture">
      <div className="container-max">
        <Reveal>
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">{lang === "id" ? "ARSITEKTUR" : "ARCHITECTURE"}</div>
            <h2 className="heading-2">{t.archTitle}</h2>
            <p className="lead mt-5">{t.archSubtitle}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 card-surface p-6 sm:p-10">
            <ThreeDCDiagram
              labels={{
                primary: lang === "id" ? "DC Primer" : "Primary DC",
                secondary: lang === "id" ? "DC Sekunder" : "Secondary DC",
                dr: lang === "id" ? "DR Site" : "DR Site",
                fabric: lang === "id" ? "Sovereign Fabric" : "Sovereign Fabric",
                edges: lang === "id" ? ["Cabang", "Pabrik", "Kampus", "BTS / 5G"] : ["Branch", "Factory", "Campus", "BTS / 5G"],
              }}
            />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link to="/architecture" data-testid="home-arch-cta" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-signal-600">
              {lang === "id" ? "Lihat arsitektur referensi" : "Explore reference architecture"} <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Industries = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  return (
    <section className="section bg-white" data-testid="home-industries">
      <div className="container-max">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="eyebrow mb-4">{lang === "id" ? "SOLUSI" : "SOLUTIONS"}</div>
              <h2 className="heading-2">{t.industriesTitle}</h2>
              <p className="lead mt-4">{t.industriesSubtitle}</p>
            </div>
            <Link to="/solutions" data-testid="home-industries-cta" className="inline-flex items-center gap-2 text-sm font-semibold text-signal-600 hover:text-signal-700">
              {lang === "id" ? "Semua solusi" : "All solutions"} <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ICONS[ind.icon];
            return (
              <Reveal key={ind.slug} delay={i * 0.05}>
                <Link to={`/solutions/${ind.slug}`} data-testid={`industry-card-${ind.slug}`} className="group block">
                  <div className="card-surface overflow-hidden hover:-translate-y-1 transition-transform">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white group-hover:bg-signal-600 transition-colors">
                          <Icon size={18} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-300">{`0${i + 1}`}</span>
                      </div>
                      <h3 className="mt-5 font-display font-semibold text-lg text-ink">{ind[lang].title}</h3>
                      <p className="mt-2 text-sm text-ink-500 line-clamp-3">{ind[lang].summary}</p>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-signal-600">
                        {lang === "id" ? "Pelajari" : "Explore"} <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProductsTeaser = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  return (
    <section className="section" data-testid="home-products">
      <div className="container-max">
        <Reveal>
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">{lang === "id" ? "PRODUK" : "PRODUCTS"}</div>
            <h2 className="heading-2">{t.productsTitle}</h2>
            <p className="lead mt-5">{t.productsSubtitle}</p>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link to={`/products`} data-testid={`product-card-${p.slug}`} className={`block group h-full ${p.featured ? "ring-2 ring-signal-600 rounded-2xl" : ""}`}>
                <div className="card-surface p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-signal-600">{p.code}</span>
                    {p.featured && <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-signal-600 text-white px-2 py-0.5">{lang === "id" ? "Populer" : "Popular"}</span>}
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-lg text-ink leading-tight">{p[lang].name}</h3>
                  <p className="mt-2 text-xs text-ink-500 leading-relaxed flex-1">{p[lang].tagline}</p>
                  <div className="mt-5 pt-5 border-t border-ink-100 flex items-center justify-between">
                    <span className="text-xs text-ink-500">{p.duration[lang]}</span>
                    <ArrowRight size={14} className="text-ink-300 group-hover:translate-x-0.5 group-hover:text-signal-600 transition-all" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Partners = () => {
  const { lang } = useLang();
  const t = HOME[lang];
  return (
    <section className="section bg-white" data-testid="home-partners">
      <div className="container-max">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5">
            <div className="eyebrow mb-4">{lang === "id" ? "EKOSISTEM" : "ECOSYSTEM"}</div>
            <h2 className="heading-2">{t.partnersTitle}</h2>
            <p className="lead mt-5">{t.partnersSubtitle}</p>
            <Link to="/partners" data-testid="home-partners-cta" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-signal-600 hover:text-signal-700">
              {lang === "id" ? "Lihat ekosistem mitra" : "Explore partner ecosystem"} <ArrowRight size={14} />
            </Link>
          </Reveal>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PARTNER_CATEGORIES.map((c, i) => (
              <Reveal key={c.key} delay={i * 0.04}>
                <div className="card-surface p-5 h-full" data-testid={`partner-cat-${c.key}`}>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-signal-600 mb-2">P-{i + 1}</div>
                  <div className="font-display text-sm font-semibold text-ink leading-snug">{c[lang]}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const { lang } = useLang();
  const t = HOME[lang];
  return (
    <div data-testid="page-home">
      <Hero />
      <Trusted />
      <ValueGrid />
      <PlatformPreview />
      <ArchitectureBlock />
      <Industries />
      <ProductsTeaser />
      <Partners />
      <FinalCTA titleEn={t.finalCtaTitle} titleId={HOME.id.finalCtaTitle} subEn={t.finalCtaSubtitle} subId={HOME.id.finalCtaSubtitle} />
    </div>
  );
}
