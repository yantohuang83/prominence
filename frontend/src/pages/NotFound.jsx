import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { lang } = useLang();
  return (
    <div className="min-h-[70vh] flex items-center justify-center" data-testid="page-404">
      <div className="text-center px-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal-600 mb-4">404</div>
        <h1 className="heading-2">{lang === "id" ? "Halaman tidak ditemukan." : "Page not found."}</h1>
        <p className="lead mt-4 max-w-md mx-auto">
          {lang === "id"
            ? "Tautan ini mungkin tidak lagi tersedia. Kembali ke beranda."
            : "This link may no longer be available. Return to the homepage."}
        </p>
        <Link to="/" data-testid="404-home" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-3 text-sm font-semibold hover:bg-ink-hover transition-colors">
          <ArrowLeft size={14} /> {lang === "id" ? "Kembali ke beranda" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}
