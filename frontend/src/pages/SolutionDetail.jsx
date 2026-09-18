import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, Check, AlertCircle, Landmark, Antenna, Banknote, Factory, Ship, Building2 } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { INDUSTRIES, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";

const ICONS = { Landmark, Antenna, Banknote, Factory, Ship, Building2 };

export default function SolutionDetail() {
  const { slug } = useParams();
  const { lang } = useLang();
  const ind = INDUSTRIES.find((i) => i.slug === slug);
  if (!ind) return <Navigate to="/solutions" replace />;
  const Icon = ICONS[ind.icon];

  return (
    <div data-testid={`page-solution-${slug}`}>
      <PageHero
        eyebrow={lang === "id" ? "SOLUSI · " + ind[lang].title.toUpperCase() : "SOLUTIONS · " + ind[lang].title.toUpperCase()}
        title={ind[lang].title}
        subtitle={ind[lang].summary}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="chip"><Icon size={12} className="text-signal-600" /> {ind[lang].tagline}</span>
        </div>
      </PageHero>

      <section className="section" data-testid={`solution-${slug}-content`}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12">
            <Reveal>
              <div className="card-surface p-8 h-full">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-ember/10 text-ember">
                  <AlertCircle size={16} />
                </div>
                <h3 className="mt-5 heading-3">{lang === "id" ? "Tantangan industri" : "Industry challenges"}</h3>
                <ul className="mt-5 space-y-3">
                  {ind[lang].pains.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-ink-600">
                      <span className="mt-1.5 h-1 w-3 bg-ember flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card-surface p-8 h-full bg-ink text-white border-ink">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-signal-600/20 text-signal-300">
                  <Check size={16} />
                </div>
                <h3 className="mt-5 font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  {lang === "id" ? "Bagaimana Prominence membantu" : "How Prominence helps"}
                </h3>
                <ul className="mt-5 space-y-3">
                  {ind[lang].solutions.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-ink-100">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-signal-600 flex-shrink-0">
                        <Check size={11} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid={`solution-${slug}-other`}>
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "INDUSTRI LAIN" : "OTHER INDUSTRIES"} title={lang === "id" ? "Lihat solusi lain." : "See other solutions."} />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {INDUSTRIES.filter((i) => i.slug !== slug).map((other) => {
              const IC = ICONS[other.icon];
              return (
                <Link key={other.slug} to={`/solutions/${other.slug}`} className="card-surface p-5 hover:-translate-y-0.5 transition-transform" data-testid={`other-solution-${other.slug}`}>
                  <IC size={16} className="text-signal-600" />
                  <div className="mt-3 font-display text-sm font-semibold text-ink leading-snug">{other[lang].title}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-signal-600">
                    {lang === "id" ? "Buka" : "Open"} <ArrowRight size={10} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn={`Build a sovereign roadmap for ${ind.en.title.toLowerCase()}.`}
        titleId={`Susun roadmap berdaulat untuk ${ind.id.title.toLowerCase()}.`}
        subEn="Schedule a workshop tailored to your sector's regulatory and operational realities."
        subId="Jadwalkan workshop yang disesuaikan dengan realitas regulasi dan operasional sektor Anda."
      />
    </div>
  );
}
