import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Antenna, Banknote, Factory, Ship, Building2 } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { INDUSTRIES, USE_CASES, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";

const ICONS = { Landmark, Antenna, Banknote, Factory, Ship, Building2 };

export default function SolutionsOverview() {
  const { lang } = useLang();
  return (
    <div data-testid="page-solutions-overview">
      <PageHero
        eyebrow={lang === "id" ? "SOLUSI" : "SOLUTIONS"}
        title={lang === "id" ? "Untuk industri yang menjalankan Indonesia." : "For the industries that run Indonesia."}
        subtitle={lang === "id"
          ? "Dari pemerintah dan BUMN hingga telco, keuangan, energi, dan smart city — solusi yang dirancang untuk kebutuhan regulasi dan skala operasional Anda."
          : "From government and BUMN to telco, finance, energy and smart city — solutions engineered for your regulatory and operational scale."}
        image={IMAGES.jakarta}
      />

      <section className="section" data-testid="solutions-by-industry">
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "BERDASARKAN INDUSTRI" : "BY INDUSTRY"} title={lang === "id" ? "Solusi industri." : "Industry solutions."} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ICONS[ind.icon];
              return (
                <Reveal key={ind.slug} delay={i * 0.04}>
                  <Link to={`/solutions/${ind.slug}`} data-testid={`solution-card-${ind.slug}`} className="block group h-full">
                    <div className="card-surface p-7 h-full hover:-translate-y-1 transition-transform">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white group-hover:bg-signal-600 transition-colors">
                          <Icon size={18} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-300">0{i + 1}</span>
                      </div>
                      <h3 className="mt-6 font-display text-xl font-semibold text-ink">{ind[lang].title}</h3>
                      <p className="mt-2 text-sm text-ink-500 leading-relaxed">{ind[lang].tagline}</p>
                      <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-signal-600">
                        {lang === "id" ? "Lihat solusi" : "View solution"} <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid="solutions-by-use-case">
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "BERDASARKAN USE CASE" : "BY USE CASE"} title={lang === "id" ? "Use case yang siap diterapkan." : "Ready-to-deploy use cases."} />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {USE_CASES.map((uc, i) => (
              <Reveal key={uc.en} delay={i * 0.02}>
                <div className="card-surface p-5 flex items-center justify-between group" data-testid={`use-case-${i}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-signal-600">UC-{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium text-ink">{uc[lang]}</span>
                  </div>
                  <ArrowRight size={14} className="text-ink-300 group-hover:text-signal-600 transition-colors" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="Find the right solution for your sector."
        titleId="Temukan solusi yang tepat untuk sektor Anda."
        subEn="Talk to our team about your industry-specific challenges and goals."
        subId="Bicarakan dengan tim kami soal tantangan dan tujuan spesifik industri Anda."
      />
    </div>
  );
}
