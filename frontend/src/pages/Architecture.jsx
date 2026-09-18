import { useLang } from "../contexts/LanguageContext";
import { IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";
import { ThreeDCDiagram, EdgeFabricDiagram, StackDiagram } from "../components/diagrams/Diagrams";

export default function Architecture() {
  const { lang } = useLang();

  const stack = lang === "id" ? [
    { title: "Workload Pelanggan", body: "VM, container, AI, database, app" },
    { title: "Platform Services", body: "K8s, queues, registry, model studio" },
    { title: "Sovereign Cloud", body: "Compute, storage, networking" },
    { title: "Open Fabric", body: "EVPN-VXLAN, BGP, SONiC, KVM" },
    { title: "Pusat Data Berdaulat", body: "Indonesia · multi-DC · DR" },
  ] : [
    { title: "Customer Workloads", body: "VMs, containers, AI, databases, apps" },
    { title: "Platform Services", body: "K8s, queues, registry, model studio" },
    { title: "Sovereign Cloud", body: "Compute, storage, networking" },
    { title: "Open Fabric", body: "EVPN-VXLAN, BGP, SONiC, KVM" },
    { title: "Sovereign Data Centers", body: "Indonesia · multi-DC · DR" },
  ];

  return (
    <div data-testid="page-architecture">
      <PageHero
        eyebrow={lang === "id" ? "ARSITEKTUR" : "ARCHITECTURE"}
        title={lang === "id" ? "Arsitektur referensi." : "Reference architecture."}
        accent={lang === "id" ? "Berdaulat. Tangguh." : "Sovereign. Resilient."}
        subtitle={lang === "id"
          ? "Tiga pusat data berdaulat, satu fabric programmable, dan jangkauan edge yang menjangkau setiap cabang, pabrik, kampus, dan BTS."
          : "Three sovereign data centers, one programmable fabric, and an edge that reaches every branch, factory, campus and BTS."}
        image={IMAGES.fabric}
      />

      <section className="section" data-testid="arch-3dc">
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "3-PUSAT-DATA" : "3-DATA-CENTER"}
            title={lang === "id" ? "Topologi sovereign cloud 3 pusat data." : "3-data-center sovereign cloud topology."}
            subtitle={lang === "id"
              ? "Site primer, sekunder, dan DR yang terinterkoneksi melalui sovereign fabric. Active/active untuk workload kritis, active/passive untuk DR."
              : "Primary, secondary and DR sites interconnected by a sovereign fabric. Active/active for critical workloads, active/passive for DR."}
          />
          <Reveal>
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
        </div>
      </section>

      <section className="section bg-white" data-testid="arch-edge-fabric">
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "EDGE-KE-CORE" : "EDGE-TO-CORE"}
            title={lang === "id" ? "Fabric edge-ke-core." : "Edge-to-core fabric."}
            subtitle={lang === "id"
              ? "Satu fabric programmable yang membawa cloud ke setiap titik edge — dari smart city hingga BTS 5G."
              : "One programmable fabric that brings cloud to every edge point — from smart city to 5G BTS."}
          />
          <Reveal>
            <div className="mt-12 card-surface p-6 sm:p-10">
              <EdgeFabricDiagram
                labels={{
                  core: lang === "id" ? "Cloud Inti" : "Core Cloud",
                  fabric: lang === "id" ? "Fabric Edge-ke-Core" : "Edge-to-Core Fabric",
                  edges: lang === "id" ? ["Smart City", "Telco / 5G", "Industri / IoT", "Cabang / Ritel"] : ["Smart City", "Telco / 5G", "Industrial / IoT", "Branch / Retail"],
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" data-testid="arch-stack">
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "STACK" : "STACK"}
            title={lang === "id" ? "Open networking. Open compute." : "Open networking. Open compute."}
            subtitle={lang === "id"
              ? "Dibangun di atas KVM, Kubernetes, EVPN-VXLAN, dan SONiC — tanpa vendor lock-in."
              : "Built on KVM, Kubernetes, EVPN-VXLAN and SONiC — no vendor lock-in."}
          />
          <Reveal>
            <div className="mt-12">
              <StackDiagram rows={stack} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white" data-testid="arch-deployments">
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "MODEL DEPLOYMENT" : "DEPLOYMENT MODELS"} title={lang === "id" ? "Pilih model deployment Anda." : "Choose your deployment model."} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { en: { t: "Sovereign Multi-DC", d: "Three Prominence-operated data centers across Indonesia." }, id: { t: "Sovereign Multi-DC", d: "Tiga pusat data yang dioperasikan Prominence di seluruh Indonesia." } },
              { en: { t: "Dedicated Sovereign Node", d: "A dedicated, sovereign cloud node deployed for your organization." }, id: { t: "Sovereign Node Dedikasi", d: "Sovereign cloud node dedikasi yang di-deploy untuk organisasi Anda." } },
              { en: { t: "Edge + Core Hybrid", d: "Distributed edge nodes that synchronize with the core sovereign cloud." }, id: { t: "Hybrid Edge + Inti", d: "Node edge terdistribusi yang sinkron dengan sovereign cloud inti." } },
            ].map((d, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="card-surface p-7 h-full" data-testid={`deployment-model-${i}`}>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-signal-600">M-{i + 1}</div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{d[lang].t}</h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{d[lang].d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="See the full architecture brief."
        titleId="Lihat brief arsitektur lengkap."
        subEn="Request a detailed architecture document and workshop session."
        subId="Minta dokumen arsitektur detail dan sesi workshop."
      />
    </div>
  );
}
