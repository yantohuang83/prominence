import { useParams, Link, Navigate } from "react-router-dom";
import { Check, ArrowRight, Cloud, Network, Radio, Brain, ShieldCheck, Settings } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { PLATFORM_PILLARS, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";

const ICONS = { Cloud, Network, Radio, Brain, ShieldCheck, Settings };

export default function PlatformSubpage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const pillar = PLATFORM_PILLARS.find((p) => p.slug === slug);
  if (!pillar) return <Navigate to="/platform" replace />;
  const Icon = ICONS[pillar.icon];

  const otherPillars = PLATFORM_PILLARS.filter((p) => p.slug !== slug);

  return (
    <div data-testid={`page-platform-${slug}`}>
      <PageHero
        eyebrow={lang === "id" ? "PLATFORM · " + pillar[lang].title.toUpperCase() : "PLATFORM · " + pillar[lang].title.toUpperCase()}
        title={pillar[lang].title}
        subtitle={pillar[lang].summary}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="chip"><Icon size={12} className="text-signal-600" /> {pillar[lang].tagline}</span>
        </div>
      </PageHero>

      <section className="section" data-testid={`platform-${slug}-capabilities`}>
        <div className="container-max">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
              <SectionTitle
                eyebrow={lang === "id" ? "KAPABILITAS" : "CAPABILITIES"}
                title={lang === "id" ? "Apa yang Anda dapatkan." : "What you get."}
                subtitle={lang === "id"
                  ? "Setiap kapabilitas dikirim sebagai layanan terkelola dengan API, observability, dan SLA."
                  : "Every capability is delivered as a managed service with API, observability and SLA."}
              />
            </Reveal>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pillar[lang].capabilities.map((c, i) => (
                <Reveal key={c} delay={i * 0.03}>
                  <div className="card-surface p-5 h-full flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-signal-50 text-signal-600 flex-shrink-0">
                      <Check size={14} />
                    </span>
                    <div className="text-sm text-ink leading-snug">{c}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid={`platform-${slug}-related`}>
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "JUGA DI PLATFORM" : "ALSO IN THE PLATFORM"}
            title={lang === "id" ? "Jelajahi pilar lain." : "Explore other pillars."}
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {otherPillars.map((p) => {
              const IC = ICONS[p.icon];
              return (
                <Link key={p.slug} to={`/platform/${p.slug}`} className="card-surface p-5 hover:-translate-y-0.5 transition-transform" data-testid={`related-platform-${p.slug}`}>
                  <IC size={16} className="text-signal-600" />
                  <div className="mt-3 font-display text-sm font-semibold text-ink leading-snug">{p[lang].title}</div>
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
        titleEn={`Bring ${pillar.en.title} into your organization.`}
        titleId={`Hadirkan ${pillar.id.title} di organisasi Anda.`}
        subEn="Start with an assessment or schedule an architecture workshop."
        subId="Mulai dengan asesmen atau jadwalkan architecture workshop."
      />
    </div>
  );
}
