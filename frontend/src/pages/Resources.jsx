import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLang } from "../contexts/LanguageContext";
import { RESOURCES_FAQ, IMAGES } from "../i18n/content";
import { PageHero, FinalCTA, Reveal, SectionTitle } from "../components/shared/SectionPrimitives";
import { FileText, BookOpen, Newspaper, Video, GraduationCap, HelpCircle, ArrowRight, Calendar } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const RESOURCE_TYPES = [
  { key: "insights", icon: "Newspaper", en: { t: "Insights", d: "Editorial perspectives on sovereign cloud, edge and AI in Indonesia." }, id: { t: "Insights", d: "Perspektif editorial soal sovereign cloud, edge, dan AI di Indonesia." } },
  { key: "whitepapers", icon: "FileText", en: { t: "Whitepapers", d: "Technical and strategic whitepapers for decision-makers." }, id: { t: "Whitepaper", d: "Whitepaper teknis dan strategis untuk pengambil keputusan." } },
  { key: "architecture-briefs", icon: "BookOpen", en: { t: "Architecture Briefs", d: "Reference designs for sovereign cloud, edge and AI workloads." }, id: { t: "Architecture Brief", d: "Desain referensi untuk workload sovereign cloud, edge, dan AI." } },
  { key: "case-studies", icon: "GraduationCap", en: { t: "Case Studies", d: "Real-world deployments across government, telco and enterprise." }, id: { t: "Studi Kasus", d: "Deployment nyata di pemerintah, telco, dan enterprise." } },
  { key: "solution-briefs", icon: "FileText", en: { t: "Solution Briefs", d: "Short, sharp guides for each industry and use case." }, id: { t: "Solution Brief", d: "Panduan ringkas untuk setiap industri dan use case." } },
  { key: "webinars", icon: "Video", en: { t: "Webinars", d: "Live and on-demand sessions with Prominence architects." }, id: { t: "Webinar", d: "Sesi live dan on-demand bersama arsitek Prominence." } },
];

const ICONS = { Newspaper, FileText, BookOpen, GraduationCap, Video, HelpCircle };

export default function Resources() {
  const { lang } = useLang();
  const [insights, setInsights] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [i, f] = await Promise.all([
          axios.get(`${API}/insights`, { params: { limit: 12 } }),
          axios.get(`${API}/faqs`),
        ]);
        setInsights(i.data || []);
        setFaqs(f.data || []);
      } catch { /* fall back to static FAQs */ }
    })();
  }, []);

  // Merge CMS FAQs (when any) with static fallback FAQs from the i18n bundle.
  const faqList = faqs.length > 0
    ? faqs.map((f) => ({ en: { q: f.question?.en, a: f.answer?.en }, id: { q: f.question?.id, a: f.answer?.id } }))
    : RESOURCES_FAQ;

  return (
    <div data-testid="page-resources">
      <PageHero
        eyebrow={lang === "id" ? "SUMBER DAYA" : "RESOURCES"}
        title={lang === "id" ? "Wawasan untuk pengambil keputusan." : "Insight for decision-makers."}
        subtitle={lang === "id"
          ? "Whitepaper, architecture brief, studi kasus, dan webinar untuk membantu Anda mengevaluasi sovereign cloud dan strategi edge."
          : "Whitepapers, architecture briefs, case studies and webinars to help you evaluate sovereign cloud and edge strategy."}
        image={IMAGES.grid}
      />

      {insights.length > 0 && (
        <section className="section" data-testid="resources-latest">
          <div className="container-max">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <SectionTitle eyebrow={lang === "id" ? "TERBARU" : "LATEST"} title={lang === "id" ? "Artikel terbaru dari Prominence." : "Latest from Prominence."} />
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {insights.map((it, i) => (
                <Reveal key={it.id} delay={i * 0.04}>
                  <Link to={`/resources/${it.slug}`} className="card-surface block overflow-hidden h-full hover:-translate-y-1 transition-transform" data-testid={`insight-card-${it.slug}`}>
                    {it.cover_image && (
                      <div className="aspect-[16/9] overflow-hidden bg-ink-50">
                        <img src={it.cover_image} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-signal-600">{it.category || "Insights"}</div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-ink leading-snug">{it.title?.[lang] || it.title?.en}</h3>
                      {(it.excerpt?.[lang] || it.excerpt?.en) && (
                        <p className="mt-2 text-sm text-ink-500 line-clamp-3">{it.excerpt?.[lang] || it.excerpt?.en}</p>
                      )}
                      <div className="mt-5 flex items-center justify-between text-xs text-ink-500">
                        <span className="inline-flex items-center gap-1.5"><Calendar size={11} /> {new Date(it.created_at).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="inline-flex items-center gap-1 text-signal-600 font-semibold">{lang === "id" ? "Baca" : "Read"} <ArrowRight size={11} /></span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" data-testid="resources-types">
        <div className="container-max">
          <SectionTitle eyebrow={lang === "id" ? "PERPUSTAKAAN" : "LIBRARY"} title={lang === "id" ? "Telusuri berdasarkan jenis." : "Browse by type."} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESOURCE_TYPES.map((r, i) => {
              const Icon = ICONS[r.icon];
              return (
                <Reveal key={r.key} delay={i * 0.03}>
                  <div className="card-surface p-7 h-full" data-testid={`resource-type-${r.key}`}>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-signal-50 text-signal-600">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{r[lang].t}</h3>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">{r[lang].d}</p>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-signal-600">
                      {lang === "id" ? "Segera hadir" : "Coming soon"} <ArrowRight size={12} />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white" data-testid="resources-faq">
        <div className="container-max">
          <div className="grid lg:grid-cols-12 gap-12">
            <Reveal className="lg:col-span-4">
              <SectionTitle eyebrow="FAQ" title={lang === "id" ? "Pertanyaan umum." : "Common questions."} />
            </Reveal>
            <div className="lg:col-span-8">
              <Accordion type="single" collapsible className="space-y-3">
                {faqList.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="card-surface px-6 data-[state=open]:bg-white">
                    <AccordionTrigger className="text-left font-display text-base font-semibold text-ink hover:no-underline" data-testid={`faq-trigger-${i}`}>
                      {f[lang]?.q || f.en?.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-ink-500 leading-relaxed pb-5" data-testid={`faq-content-${i}`}>
                      {f[lang]?.a || f.en?.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA
        titleEn="Need a specific brief?"
        titleId="Butuh brief spesifik?"
        subEn="Request an architecture brief or whitepaper tailored to your scenario."
        subId="Minta architecture brief atau whitepaper yang disesuaikan dengan skenario Anda."
      />
    </div>
  );
}
