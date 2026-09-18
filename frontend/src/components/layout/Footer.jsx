import { Link } from "react-router-dom";
import { useState } from "react";
import { useLang } from "../../contexts/LanguageContext";
import { FOOTER } from "../../i18n/content";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Footer = () => {
  const { lang } = useLang();
  const t = FOOTER[lang];
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post(`${API}/newsletter`, { email, locale: lang });
      toast.success(lang === "id" ? "Terima kasih telah berlangganan." : "Thanks for subscribing.");
      setEmail("");
    } catch (err) {
      toast.error(lang === "id" ? "Gagal berlangganan. Coba lagi." : "Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-ink text-ink-100 mt-32" data-testid="site-footer">
      <div className="container-max py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/prominence-icon.png"
                alt=""
                className="h-10 w-auto"
                loading="lazy"
                decoding="async"
              />
              <span className="font-display text-xl font-semibold tracking-tight text-white">Prominence</span>
            </Link>
            <p className="mt-5 text-sm text-ink-200 max-w-md leading-relaxed">{t.tagline}</p>
            <p className="mt-3 text-xs text-ink-300 tracking-wider uppercase">{t.address}</p>

            <form onSubmit={onSubscribe} className="mt-8 max-w-md" data-testid="footer-newsletter">
              <label className="block text-xs font-semibold tracking-[0.22em] uppercase text-ink-300 mb-3">
                {t.subscribe}
              </label>
              <div className="flex gap-0 border-b border-ink-300/30 focus-within:border-white transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.subscribePlaceholder}
                  data-testid="footer-newsletter-input"
                  className="flex-1 bg-transparent py-3 text-sm placeholder-ink-300 text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="footer-newsletter-submit"
                  className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-medium text-white hover:text-signal-300 disabled:opacity-60"
                >
                  {t.subscribeCta}
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(t.columns).map(([title, links]) => (
              <div key={title}>
                <div className="text-xs font-semibold tracking-[0.22em] uppercase text-ink-300 mb-4">{title}</div>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link to={l.href} className="text-sm text-ink-100 hover:text-white link-underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-300">
          <div>{t.rights}</div>
          <div className="font-mono uppercase tracking-wider">Jakarta · ID</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
