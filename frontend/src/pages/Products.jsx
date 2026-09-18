import { useLang } from "../contexts/LanguageContext";
import { PRODUCTS } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Products() {
  const { lang } = useLang();
  return (
    <div data-testid="page-products">
      <PageHero
        eyebrow={lang === "id" ? "PRODUK" : "PRODUCTS"}
        title={lang === "id" ? "Empat paket. Satu jalan menuju produksi." : "Four packages. One path to production."}
        subtitle={lang === "id"
          ? "Mulai dengan asesmen, validasi dengan pilot 90 hari, lalu jalankan dengan managed platform atau sovereign cloud node."
          : "Start with an assessment, validate with a 90-day pilot, then run with a managed platform or sovereign cloud node."}
      />

      <section className="section" data-testid="product-cards">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <div
                  data-testid={`product-card-${p.slug}`}
                  className={`relative card-surface p-8 h-full flex flex-col ${p.featured ? "ring-2 ring-signal-600" : ""}`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-8 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-signal-600 text-white px-3 py-1">
                      {lang === "id" ? "Direkomendasikan" : "Recommended"}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-signal-600">{p.code}</span>
                    <span className="text-[11px] text-ink-500 uppercase tracking-wider">{p.duration[lang]}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-ink leading-tight">{p[lang].name}</h3>
                  <p className="mt-2 text-sm text-ink-500">{p[lang].tagline}</p>

                  <div className="mt-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">
                      {lang === "id" ? "Cocok untuk" : "Best for"}
                    </div>
                    <p className="text-sm text-ink leading-snug">{p[lang].bestFor}</p>
                  </div>

                  <div className="mt-6 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">
                      {lang === "id" ? "Deliverables" : "Deliverables"}
                    </div>
                    <ul className="space-y-2.5">
                      {p[lang].deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm text-ink-600">
                          <Check size={14} className="text-signal-600 mt-0.5 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    data-testid={`product-cta-${p.slug}`}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                      p.featured ? "bg-ink text-white hover:bg-ink-hover" : "border border-ink-200 text-ink hover:bg-ink-50"
                    }`}
                  >
                    {lang === "id" ? "Diskusikan" : "Discuss this package"} <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="Not sure where to start?"
        titleId="Tidak yakin mulai dari mana?"
        subEn="A short consultation can map the right package to your goals."
        subId="Konsultasi singkat dapat memetakan paket yang tepat untuk tujuan Anda."
      />
    </div>
  );
}
