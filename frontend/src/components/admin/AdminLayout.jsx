import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LayoutDashboard, Inbox, Newspaper, HelpCircle, Mail, LogOut, ExternalLink, ChevronRight } from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/insights", label: "Insights", icon: Newspaper },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const onLogout = async () => {
    await logout();
    nav("/admin/login", { replace: true });
  };

  // breadcrumb derived from path
  const segments = location.pathname.replace(/^\//, "").split("/").filter(Boolean);

  return (
    <div className="min-h-screen bg-sand flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-white flex flex-col fixed top-0 bottom-0 left-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3" data-testid="admin-logo">
            <img src="/prominence-icon.png" alt="" className="h-8 w-auto" />
            <div>
              <div className="font-display font-semibold text-white text-base leading-none">Prominence</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-300 mt-1">CMS</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                data-testid={`admin-nav-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-ink-200 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon size={16} />
                <span className="font-medium">{n.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" target="_blank" className="flex items-center gap-2 text-xs text-ink-300 hover:text-white" data-testid="admin-view-site">
            <ExternalLink size={12} /> View live site
          </Link>
          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="min-w-0">
              <div className="text-xs text-ink-300 truncate">{user?.email}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-400">{user?.role}</div>
            </div>
            <button onClick={onLogout} data-testid="admin-logout" className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-xs text-white hover:bg-white/5">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-30 bg-sand/85 backdrop-blur border-b border-ink-100">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-ink-500">
              {segments.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <ChevronRight size={12} className="text-ink-300" />}
                  <span className={i === segments.length - 1 ? "text-ink font-medium" : ""}>{s}</span>
                </span>
              ))}
            </div>
          </div>
        </header>
        <main className="p-8" data-testid="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
