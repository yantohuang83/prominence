import { useLang } from "../contexts/LanguageContext";
import { SERVICES, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";
import { Search, PenTool, Hammer, Headphones, Workflow, Check } from "lucide-react";

const ICONS = { Search, PenTool, Hammer, Headphones, Workflow };

export default function Services() {
  const { lang } = useLang();
  return (
    <div data-testid="page-services">
      <PageHero
        eyebrow={lang === "id" ? "LAYANAN" : "PROFESSIONAL SERVICES"}
        title={lang === "id" ? "Layanan profesional, dari asesmen ke operasi." : "Professional services, from assessment to operations."}
        subtitle={lang === "id"
          ? "Tim Prominence memandu Anda dari hari pertama: asesmen, desain arsitektur, implementasi, managed services, dan otomasi."
          : "The Prominence team guides you from day one: assessment, architecture design, implementation, managed services and automation."}
        image={IMAGES.workshop}
      />

      <section className="section" data-testid="services-grid">
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "LAYANAN" : "SERVICES"} title={lang === "id" ? "Lima pilar layanan." : "Five service pillars."} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <Reveal key={s.slug} delay={i * 0.04}>
                  <div className="card-surface p-7 h-full" data-testid={`service-card-${s.slug}`}>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-300">S-{i + 1}</span>
                    </div>
                    <h3 className="mt-6 font-display text-lg font-semibold text-ink">{s[lang].title}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {s[lang].points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm text-ink-600">
                          <Check size={14} className="text-signal-600 mt-0.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid="services-engagement">
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "ENGAGEMENT" : "ENGAGEMENT"} title={lang === "id" ? "Tiga jalur untuk memulai." : "Three paths to get started."} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { en: { t: "Assessment Sprint", d: "2–4 week deep-dive into infrastructure, workloads and opportunities." }, id: { t: "Sprint Asesmen", d: "Deep-dive 2–4 minggu ke infrastruktur, workload, dan peluang." } },
              { en: { t: "Architecture Workshop", d: "Co-design a sovereign cloud, edge or AI architecture with our experts." }, id: { t: "Workshop Arsitektur", d: "Co-design sovereign cloud, edge, atau AI bersama ahli kami." } },
              { en: { t: "Managed Operations", d: "Hand over day-2 operations with full SLA, observability and reporting." }, id: { t: "Operasi Terkelola", d: "Serahkan operasi day-2 dengan SLA, observability, dan pelaporan penuh." } },
            ].map((d, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="card-surface p-7 h-full" data-testid={`engagement-${i}`}>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-signal-600">E-{i + 1}</div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{d[lang].t}</h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{d[lang].d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="From kickoff to production."
        titleId="Dari kickoff hingga produksi."
        subEn="Talk to our services team about your engagement."
        subId="Bicarakan dengan tim layanan kami soal engagement Anda."
      />
    </div>
  );
}
