import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLang } from "../../contexts/LanguageContext";
import { NAV, PLATFORM_PILLARS, INDUSTRIES } from "../../i18n/content";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Logo = () => (
  <Link to="/" data-testid="nav-logo" className="flex items-center group">
    <img
      src="/prominence-logo.png"
      alt="Prominence"
      className="h-9 w-auto transition-transform group-hover:scale-[1.02]"
      loading="eager"
      decoding="async"
    />
  </Link>
);

const TopBar = () => {
  const { lang, toggle } = useLang();
  return (
    <div className="hidden md:block border-b border-ink-100 bg-white/60 backdrop-blur">
      <div className="container-max flex h-9 items-center justify-between text-xs text-ink-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span>Sovereign Edge Cloud · Multi-DC Indonesia</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/contact" className="hover:text-ink transition-colors" data-testid="topbar-contact">
            {lang === "id" ? "Hubungi sales" : "Talk to sales"}
          </Link>
          <button
            type="button"
            onClick={toggle}
            data-testid="lang-toggle"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 px-2.5 py-1 hover:border-ink-300 transition-colors"
          >
            <Globe size={12} />
            <span className="font-mono uppercase">{lang}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MegaPanel = ({ open, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className="absolute left-0 right-0 top-full pt-2"
      >
        <div className="container-max">
          <div className="card-surface p-8 grid grid-cols-12 gap-8">{children}</div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Header = () => {
  const { lang } = useLang();
  const t = NAV[lang];
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // 'platform' | 'solutions' | null
  const [mobile, setMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobile(false);
  }, [location.pathname]);

  const navItem = (label, to, key) => (
    <NavLink
      key={key || to}
      to={to}
      data-testid={`nav-${key || label.toLowerCase()}`}
      onMouseEnter={() => setOpenMenu(null)}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? "text-ink" : "text-ink-500 hover:text-ink"}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-xl border-b border-ink-100" : "bg-transparent"
      }`}
    >
      <TopBar />
      <div className="container-max relative" onMouseLeave={() => setOpenMenu(null)}>
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />
            <div className="hidden lg:flex items-center gap-7">
              {/* Platform mega menu trigger */}
              <button
                type="button"
                data-testid="nav-platform"
                onMouseEnter={() => setOpenMenu("platform")}
                onClick={() => setOpenMenu((m) => (m === "platform" ? null : "platform"))}
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  openMenu === "platform" ? "text-ink" : "text-ink-500 hover:text-ink"
                }`}
              >
                {t.platform}
                <ChevronDown size={14} className={`transition-transform ${openMenu === "platform" ? "rotate-180" : ""}`} />
              </button>
              <button
                type="button"
                data-testid="nav-solutions"
                onMouseEnter={() => setOpenMenu("solutions")}
                onClick={() => setOpenMenu((m) => (m === "solutions" ? null : "solutions"))}
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  openMenu === "solutions" ? "text-ink" : "text-ink-500 hover:text-ink"
                }`}
              >
                {t.solutions}
                <ChevronDown size={14} className={`transition-transform ${openMenu === "solutions" ? "rotate-180" : ""}`} />
              </button>
              {navItem(t.architecture, "/architecture", "architecture")}
              {navItem(t.services, "/services", "services")}
              {navItem(t.products, "/products", "products")}
              {navItem(t.resources, "/resources", "resources")}
              {navItem(t.partners, "/partners", "partners")}
              {navItem(t.company, "/company", "company")}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              data-testid="nav-cta-consultation"
              onMouseEnter={() => setOpenMenu(null)}
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 py-2 text-sm font-medium hover:bg-ink-hover transition-colors"
            >
              {t.requestConsultation}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-ink"
            onClick={() => setMobile((m) => !m)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Hover bridge & Mega menus */}
        <div className="relative">
          <MegaPanel open={openMenu === "platform"}>
            <div className="col-span-4">
              <div className="eyebrow mb-3">{lang === "id" ? "Platform" : "Platform"}</div>
              <h3 className="heading-3 mb-2">{lang === "id" ? "Satu platform berdaulat." : "One sovereign platform."}</h3>
              <p className="text-sm text-ink-500">
                {lang === "id"
                  ? "Cloud, jaringan, edge, AI, dan keamanan dalam satu control plane."
                  : "Cloud, network, edge, AI and security under one control plane."}
              </p>
              <Link to="/platform" data-testid="mega-platform-overview" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-signal-600 hover:text-signal-700">
                {lang === "id" ? "Lihat ikhtisar" : "View overview"} →
              </Link>
            </div>
            <div className="col-span-8 grid grid-cols-2 gap-x-6 gap-y-2">
              {PLATFORM_PILLARS.map((p) => (
                <Link
                  key={p.slug}
                  to={`/platform/${p.slug}`}
                  data-testid={`mega-platform-${p.slug}`}
                  className="group flex flex-col gap-0.5 rounded-lg px-3 py-2.5 hover:bg-ink-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-ink group-hover:text-signal-600">{p[lang].title}</span>
                  <span className="text-xs text-ink-500 line-clamp-1">{p[lang].tagline}</span>
                </Link>
              ))}
            </div>
          </MegaPanel>

          <MegaPanel open={openMenu === "solutions"}>
            <div className="col-span-4">
              <div className="eyebrow mb-3">{lang === "id" ? "Solusi" : "Solutions"}</div>
              <h3 className="heading-3 mb-2">
                {lang === "id" ? "Untuk industri yang menjalankan Indonesia." : "For the industries that run Indonesia."}
              </h3>
              <Link to="/solutions" data-testid="mega-solutions-overview" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-signal-600 hover:text-signal-700">
                {lang === "id" ? "Semua solusi" : "All solutions"} →
              </Link>
            </div>
            <div className="col-span-8 grid grid-cols-2 gap-x-6 gap-y-2">
              {INDUSTRIES.map((p) => (
                <Link
                  key={p.slug}
                  to={`/solutions/${p.slug}`}
                  data-testid={`mega-solution-${p.slug}`}
                  className="group flex flex-col gap-0.5 rounded-lg px-3 py-2.5 hover:bg-ink-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-ink group-hover:text-signal-600">{p[lang].title}</span>
                  <span className="text-xs text-ink-500 line-clamp-1">{p[lang].tagline}</span>
                </Link>
              ))}
            </div>
          </MegaPanel>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden border-t border-ink-100 bg-white"
            >
              <div className="py-4 space-y-1">
                <MobileGroup title={t.platform} items={PLATFORM_PILLARS.map((p) => ({ to: `/platform/${p.slug}`, label: p[lang].title }))} />
                <MobileGroup title={t.solutions} items={INDUSTRIES.map((p) => ({ to: `/solutions/${p.slug}`, label: p[lang].title }))} />
                <MobileLink to="/architecture" label={t.architecture} />
                <MobileLink to="/services" label={t.services} />
                <MobileLink to="/products" label={t.products} />
                <MobileLink to="/resources" label={t.resources} />
                <MobileLink to="/partners" label={t.partners} />
                <MobileLink to="/company" label={t.company} />
                <div className="pt-3 px-1 flex items-center gap-2">
                  <Link to="/contact" data-testid="mobile-cta" className="flex-1 text-center rounded-full bg-ink text-white px-4 py-2.5 text-sm font-medium">
                    {t.requestConsultation}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const MobileLink = ({ to, label }) => (
  <Link to={to} className="block px-1 py-2.5 text-[15px] font-medium text-ink">
    {label}
  </Link>
);

const MobileGroup = ({ title, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-100/60 pb-2">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-2.5 text-[15px] font-medium text-ink">
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pl-2 py-1 space-y-1">
          {items.map((it) => (
            <Link key={it.to} to={it.to} className="block py-1.5 text-sm text-ink-500">
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
