import { Link } from "react-router-dom";
import { ArrowRight, Cloud, Network, Radio, Brain, ShieldCheck, Settings } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { PLATFORM_PILLARS, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";
import { StackDiagram } from "../components/diagrams/Diagrams";

const ICONS = { Cloud, Network, Radio, Brain, ShieldCheck, Settings };

export default function PlatformOverview() {
  const { lang } = useLang();
  const rows = lang === "id" ? [
    { title: "Operasi & Otomasi", body: "Observability, IaC, GitOps, SLA/SLO" },
    { title: "Keamanan & Tata Kelola", body: "Zero Trust, IAM, audit, enkripsi" },
    { title: "AI & Data", body: "GPU, model studio, vector DB, data lake" },
    { title: "Network as a Service", body: "VPC, LB, FW, SD-WAN, private connect" },
    { title: "Sovereign Cloud", body: "Compute, storage, K8s, platform services" },
    { title: "Edge Cloud", body: "PoP, BTS, IoT, smart city, ritel" },
  ] : [
    { title: "Operations & Automation", body: "Observability, IaC, GitOps, SLA/SLO" },
    { title: "Security & Governance", body: "Zero Trust, IAM, audit, encryption" },
    { title: "AI & Data Platform", body: "GPU, model studio, vector DB, data lake" },
    { title: "Network as a Service", body: "VPC, LB, FW, SD-WAN, private connect" },
    { title: "Sovereign Cloud", body: "Compute, storage, K8s, platform services" },
    { title: "Edge Cloud", body: "PoP, BTS, IoT, smart city, retail" },
  ];

  return (
    <div data-testid="page-platform-overview">
      <PageHero
        eyebrow={lang === "id" ? "PLATFORM" : "PLATFORM"}
        title={lang === "id" ? "Satu control plane berdaulat." : "One sovereign control plane."}
        accent={lang === "id" ? "Dari inti ke edge." : "From core to edge."}
        subtitle={lang === "id"
          ? "Cloud, jaringan, edge, AI, keamanan, dan operasi — bersatu di satu platform yang dirancang untuk Indonesia."
          : "Cloud, network, edge, AI, security and operations — unified on one platform designed for Indonesia."}
        image={IMAGES.dataCenter}
        testId="platform-overview-hero"
      />

      <section className="section">
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "STACK" : "THE STACK"}
            title={lang === "id" ? "Enam lapisan. Satu sistem terpadu." : "Six layers. One coherent system."}
            subtitle={lang === "id"
              ? "Setiap lapisan diintegrasikan dengan API, observability, dan tata kelola yang sama."
              : "Every layer is integrated with the same APIs, observability and governance."}
          />
          <Reveal>
            <div className="mt-12">
              <StackDiagram rows={rows} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white" data-testid="platform-pillars-grid">
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "PILAR" : "PILLARS"}
            title={lang === "id" ? "Telusuri setiap pilar." : "Explore each pillar."}
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_PILLARS.map((p, i) => {
              const Icon = ICONS[p.icon];
              return (
                <Reveal key={p.slug} delay={i * 0.04}>
                  <Link to={`/platform/${p.slug}`} data-testid={`platform-pillar-${p.slug}`} className="card-surface block p-7 h-full group hover:-translate-y-1 transition-transform">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white group-hover:bg-signal-600 transition-colors">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-ink">{p[lang].title}</h3>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">{p[lang].tagline}</p>
                    <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-signal-600">
                      {lang === "id" ? "Lihat detail" : "View details"} <ArrowRight size={12} />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="Architect your sovereign platform."
        titleId="Rancang platform berdaulat Anda."
        subEn="Talk to our team about a tailored deployment for your organization."
        subId="Bicarakan dengan tim kami untuk deployment yang disesuaikan untuk organisasi Anda."
      />
    </div>
  );
}
