import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useLang } from "../contexts/LanguageContext";
import { Reveal, FinalCTA } from "../components/shared/SectionPrimitives";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function InsightDetail() {
  const { slug } = useParams();
  const { lang } = useLang();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const { data } = await axios.get(`${API}/insights/${slug}`);
        setItem(data);
        document.title = `${data.title?.[lang] || data.title?.en} — Prominence`;
      } catch (e) {
        if (e?.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
      try {
        const r = await axios.get(`${API}/insights`, { params: { limit: 6 } });
        setRelated((r.data || []).filter((x) => x.slug !== slug).slice(0, 3));
      } catch { /* ignore */ }
    })();
  }, [slug, lang]);

  if (loading) {
    return <div className="container-max py-32 text-center text-sm text-ink-400 animate-pulse">Loading…</div>;
  }
  if (notFound || !item) {
    return (
      <div className="container-max py-32 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal-600 mb-3">404</div>
        <h1 className="heading-2">{lang === "id" ? "Artikel tidak ditemukan." : "Article not found."}</h1>
        <Link to="/resources" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal-600">
          <ArrowLeft size={14} /> {lang === "id" ? "Kembali ke Sumber Daya" : "Back to Resources"}
        </Link>
      </div>
    );
  }

  const title = item.title?.[lang] || item.title?.en;
  const body = item.body?.[lang] || item.body?.en || item.body?.id;
  const excerpt = item.excerpt?.[lang] || item.excerpt?.en;

  return (
    <div data-testid={`insight-detail-${item.slug}`}>
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid dot-grid-fade -z-10" />
        <div className="container-max">
          <Link to="/resources" className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal-600 hover:text-signal-700 mb-8">
            <ArrowLeft size={12} /> {lang === "id" ? "Sumber Daya" : "Resources"}
          </Link>
          <div className="max-w-3xl">
            <div className="eyebrow mb-5">{item.category || "INSIGHTS"}</div>
            <h1 className="heading-1">{title}</h1>
            {excerpt && <p className="lead mt-6">{excerpt}</p>}
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-ink-500">
              <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </section>

      {item.cover_image && (
        <div className="container-max">
          <div className="aspect-[16/8] rounded-2xl overflow-hidden border border-ink-100 mb-12">
            <img src={item.cover_image} alt={title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      )}

      <section className="pb-20">
        <div className="container-max">
          <div className="max-w-3xl mx-auto prose prose-base sm:prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-ink prose-p:text-ink-700 prose-li:text-ink-700 prose-a:text-signal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-code:text-signal-700 prose-code:bg-signal-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.9em]" data-testid="insight-body">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-white border-t border-ink-100">
          <div className="container-max">
            <div className="eyebrow mb-4">{lang === "id" ? "BACA JUGA" : "RELATED"}</div>
            <h2 className="heading-3 mb-8">{lang === "id" ? "Artikel lain" : "More insights"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Reveal key={r.id}>
                  <Link to={`/resources/${r.slug}`} className="card-surface p-6 block h-full hover:-translate-y-0.5 transition-transform">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-signal-600 mb-3">{r.category}</div>
                    <h3 className="font-display font-semibold text-ink leading-snug">{r.title?.[lang] || r.title?.en}</h3>
                    {(r.excerpt?.[lang] || r.excerpt?.en) && (
                      <p className="mt-2 text-xs text-ink-500 line-clamp-2">{r.excerpt?.[lang] || r.excerpt?.en}</p>
                    )}
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-signal-600">
                      {lang === "id" ? "Baca" : "Read"} <ArrowRight size={12} />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA
        titleEn="Want a deeper conversation?"
        titleId="Ingin diskusi lebih dalam?"
        subEn="Talk to our team about how this applies to your organization."
        subId="Bicarakan dengan tim kami tentang penerapan ke organisasi Anda."
      />
    </div>
  );
}
