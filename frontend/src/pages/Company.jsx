import { useLang } from "../contexts/LanguageContext";
import { COMPANY, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";
import { Check, MapPin, Users, Award } from "lucide-react";

export default function Company() {
  const { lang } = useLang();
  const c = COMPANY[lang];
  return (
    <div data-testid="page-company">
      <PageHero
        eyebrow={lang === "id" ? "PERUSAHAAN" : "COMPANY"}
        title={lang === "id" ? "Membangun infrastruktur digital berdaulat Indonesia." : "Building Indonesia's sovereign digital infrastructure."}
        subtitle={lang === "id"
          ? "Prominence dibentuk untuk memberikan apa yang dibutuhkan Indonesia berikutnya: sovereign edge cloud dan infrastruktur AI dengan kelas operator nasional."
          : "Prominence was formed to deliver what Indonesia needs next: sovereign edge cloud and AI infrastructure at national-operator scale."}
        image={IMAGES.team}
      />

      <section className="section" data-testid="company-mission">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <Reveal>
              <div className="card-surface p-9 h-full">
                <div className="eyebrow mb-4">{lang === "id" ? "MISI" : "MISSION"}</div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">{c.mission}</h3>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card-surface p-9 h-full">
                <div className="eyebrow mb-4">{lang === "id" ? "VISI" : "VISION"}</div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">{c.vision}</h3>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid="company-why">
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "MENGAPA PROMINENCE" : "WHY PROMINENCE"}
            title={lang === "id" ? "Enam alasan untuk memilih Prominence." : "Six reasons to choose Prominence."}
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.why.map((w, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="card-surface p-6 flex items-start gap-4" data-testid={`why-${i}`}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-signal-50 text-signal-600 flex-shrink-0">
                    <Check size={16} />
                  </span>
                  <div className="text-sm text-ink leading-relaxed">{w}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-testid="company-leadership">
        <div className="container-max">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-7">
              <SectionTitle
                eyebrow={lang === "id" ? "KEPEMIMPINAN" : "LEADERSHIP"}
                title={lang === "id" ? "Tim yang menjalankan infrastruktur skala nasional." : "A team that runs national-scale infrastructure."}
                subtitle={c.leadershipNote}
              />
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { v: "20+", l: lang === "id" ? "Pengalaman gabungan (tahun)" : "Combined experience (yrs)" },
                  { v: "120+", l: lang === "id" ? "Engineer & arsitek" : "Engineers & architects" },
                  { v: "17", l: lang === "id" ? "Industri yang dilayani" : "Industries served" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl sm:text-4xl font-bold text-ink tabular">{s.v}</div>
                    <div className="mt-2 text-xs text-ink-500 leading-snug">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <img src={IMAGES.workshop} alt="" loading="lazy" className="rounded-2xl border border-ink-100 aspect-[4/5] object-cover w-full" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid="company-governance">
        <div className="container-max">
          <SectionTitle
            eyebrow={lang === "id" ? "TATA KELOLA" : "GOVERNANCE"}
            title={lang === "id" ? "Tata kelola yang bisa diaudit, sepanjang waktu." : "Governance you can audit, end-to-end."}
            subtitle={lang === "id"
              ? "Prominence dijalankan dengan tata kelola yang transparan: kebijakan, audit, identitas, dan kepatuhan diintegrasikan ke dalam platform."
              : "Prominence operates with transparent governance: policy, audit, identity and compliance built into the platform."}
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: MapPin, en: { t: "Data residency Indonesia", d: "Penyimpanan dan kontrol data di yurisdiksi Indonesia." }, id: { t: "Residensi data Indonesia", d: "Penyimpanan dan kontrol data di yurisdiksi Indonesia." } },
              { icon: Users, en: { t: "Identity & access", d: "Federated identity, SSO, MFA, RBAC across all services." }, id: { t: "Identitas & akses", d: "Federated identity, SSO, MFA, RBAC di semua layanan." } },
              { icon: Award, en: { t: "Audit-ready", d: "Continuous audit, immutable logs and compliance reporting." }, id: { t: "Siap-audit", d: "Audit kontinu, log immutable, dan pelaporan kepatuhan." } },
            ].map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={i} delay={i * 0.04}>
                  <div className="card-surface p-7 h-full" data-testid={`gov-${i}`}>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{g[lang].t}</h3>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">{g[lang].d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="Build the sovereign cloud Indonesia deserves."
        titleId="Bangun sovereign cloud yang layak untuk Indonesia."
        subEn="Talk to us about your organization's sovereign infrastructure roadmap."
        subId="Bicarakan dengan kami soal roadmap infrastruktur berdaulat organisasi Anda."
      />
    </div>
  );
}
