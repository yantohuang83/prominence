import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";
import { PARTNER_CATEGORIES, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";
import { Database, Network, Shield, Cpu, Cloud, Boxes, Landmark, ArrowRight } from "lucide-react";

const ICONS = {
  "data-center": Database,
  "network": Network,
  "security": Shield,
  "ai": Cpu,
  "cloud": Cloud,
  "si": Boxes,
  "gov": Landmark,
};

const DESCRIPTIONS = {
  "data-center": { en: "Tier III/IV data center facilities across Indonesia.", id: "Fasilitas pusat data Tier III/IV di seluruh Indonesia." },
  "network": { en: "Switching, routing, optics and SDN technology partners.", id: "Mitra teknologi switching, routing, optik, dan SDN." },
  "security": { en: "Identity, Zero Trust, SOC and threat intelligence partners.", id: "Mitra identitas, Zero Trust, SOC, dan threat intelligence." },
  "ai": { en: "GPU silicon, accelerator and model platform partners.", id: "Mitra silikon GPU, akselerator, dan platform model." },
  "cloud": { en: "Hyperscaler interconnect and managed-service partners.", id: "Mitra interconnect hyperscaler dan managed service." },
  "si": { en: "System integrators delivering end-to-end implementation.", id: "System integrator yang mengirimkan implementasi end-to-end." },
  "gov": { en: "Government, BUMN and strategic ecosystem partners.", id: "Mitra pemerintah, BUMN, dan ekosistem strategis." },
};

export default function Partners() {
  const { lang } = useLang();
  return (
    <div data-testid="page-partners">
      <PageHero
        eyebrow={lang === "id" ? "MITRA" : "PARTNERS"}
        title={lang === "id" ? "Ekosistem yang dirancang untuk Indonesia." : "An ecosystem engineered for Indonesia."}
        subtitle={lang === "id"
          ? "Kami berkolaborasi dengan mitra terdepan di pusat data, jaringan, keamanan, AI, hyperscaler, dan ekosistem pemerintah untuk memberikan platform berdaulat yang Anda butuhkan."
          : "We work with leading data center, network, security, AI, hyperscaler and government ecosystem partners to deliver the sovereign platform you need."}
      />

      <section className="section" data-testid="partner-grid">
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "KATEGORI MITRA" : "PARTNER CATEGORIES"} title={lang === "id" ? "Tujuh kategori mitra." : "Seven partner categories."} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNER_CATEGORIES.map((c, i) => {
              const Icon = ICONS[c.key];
              return (
                <Reveal key={c.key} delay={i * 0.04}>
                  <div className="card-surface p-7 h-full" data-testid={`partner-cat-card-${c.key}`}>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-300">P-{i + 1}</span>
                    </div>
                    <h3 className="mt-6 font-display text-lg font-semibold text-ink">{c[lang]}</h3>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">{DESCRIPTIONS[c.key][lang]}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid="partner-become">
        <div className="container-max">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-7">
              <SectionTitle
                eyebrow={lang === "id" ? "JADI MITRA" : "BECOME A PARTNER"}
                title={lang === "id" ? "Bangun bersama kami." : "Build with us."}
                subtitle={lang === "id"
                  ? "Bergabunglah dengan ekosistem mitra Prominence untuk membawa sovereign edge cloud dan AI ke organisasi-organisasi Indonesia."
                  : "Join the Prominence partner ecosystem to bring sovereign edge cloud and AI to Indonesian organizations."}
              />
              <Link to="/contact" data-testid="partner-cta" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3.5 text-sm font-semibold hover:bg-ink-hover transition-colors">
                {lang === "id" ? "Hubungi tim kemitraan" : "Talk to partnerships"} <ArrowRight size={14} />
              </Link>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <img src={IMAGES.team} alt="" loading="lazy" className="rounded-2xl border border-ink-100 aspect-[4/3] object-cover w-full" />
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="A partner ecosystem you can build on."
        titleId="Ekosistem mitra yang bisa Anda andalkan."
        subEn="Talk to us about technology, integration or go-to-market partnerships."
        subId="Bicarakan dengan kami soal kemitraan teknologi, integrasi, atau go-to-market."
      />
    </div>
  );
}
