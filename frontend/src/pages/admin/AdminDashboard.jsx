import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Inbox, Mail, Newspaper, HelpCircle, ArrowRight, TrendingUp } from "lucide-react";

const Card = ({ label, value, hint, icon: Icon, to, accent, testId }) => (
  <Link to={to} data-testid={testId} className="card-surface p-6 hover:-translate-y-0.5 transition-transform block">
    <div className="flex items-start justify-between">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${accent || "bg-ink text-white"}`}>
        <Icon size={18} />
      </div>
      <ArrowRight size={14} className="text-ink-300" />
    </div>
    <div className="mt-6 font-display text-3xl font-bold text-ink tabular">{value ?? "—"}</div>
    <div className="mt-1 text-sm text-ink-500">{label}</div>
    {hint && <div className="mt-3 text-xs text-ink-400">{hint}</div>}
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/inquiries", { params: { limit: 5 } }),
        ]);
        setStats(s.data);
        setRecent(r.data || []);
      } catch (e) { /* handled by interceptor */ }
    })();
  }, []);

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      <div>
        <div className="eyebrow mb-3">OVERVIEW</div>
        <h1 className="heading-2">Dashboard</h1>
        <p className="lead mt-2">A quick snapshot of activity across your Prominence site.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Total Inquiries" value={stats?.inquiries} hint={`${stats?.inquiries_unread ?? 0} unread`} icon={Inbox} to="/admin/inquiries" testId="stat-inquiries" />
        <Card label="Newsletter Subscribers" value={stats?.subscribers} icon={Mail} to="/admin/newsletter" accent="bg-signal-600 text-white" testId="stat-subscribers" />
        <Card label="Published Insights" value={stats?.insights} icon={Newspaper} to="/admin/insights" testId="stat-insights" />
        <Card label="FAQ Items" value={stats?.faqs} icon={HelpCircle} to="/admin/faqs" testId="stat-faqs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-surface p-6 lg:col-span-2" data-testid="recent-inquiries">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="eyebrow mb-1">RECENT</div>
              <h2 className="heading-3">Latest inquiries</h2>
            </div>
            <Link to="/admin/inquiries" className="text-xs font-semibold text-signal-600 hover:text-signal-700">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-400">No inquiries yet.</div>
          ) : (
            <div className="divide-y divide-ink-100">
              {recent.map((i) => (
                <Link to={`/admin/inquiries`} key={i.id} className="flex items-start justify-between gap-4 py-3.5 group">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink truncate">{i.name}</span>
                      {!i.read && <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-600 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-ink-500 truncate">{i.company || "—"} · {i.email}</div>
                    <div className="text-xs text-ink-400 mt-1 line-clamp-1">{i.message}</div>
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-ink-300 flex-shrink-0">
                    {i.interest || "inquiry"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card-surface p-6" data-testid="quick-actions">
          <div className="eyebrow mb-1">QUICK ACTIONS</div>
          <h2 className="heading-3 mb-4">Get started</h2>
          <div className="space-y-2">
            <Link to="/admin/insights/new" className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-3 hover:bg-ink-50">
              <span className="text-sm font-medium text-ink">Write a new insight</span>
              <ArrowRight size={14} className="text-ink-400" />
            </Link>
            <Link to="/admin/faqs" className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-3 hover:bg-ink-50">
              <span className="text-sm font-medium text-ink">Add a FAQ item</span>
              <ArrowRight size={14} className="text-ink-400" />
            </Link>
            <Link to="/admin/inquiries" className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-3 hover:bg-ink-50">
              <span className="text-sm font-medium text-ink">Triage inquiries</span>
              <ArrowRight size={14} className="text-ink-400" />
            </Link>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-signal-50 border border-signal-100 flex items-start gap-3">
            <TrendingUp size={16} className="text-signal-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-ink-600 leading-relaxed">
              Tip: published insights appear on the public <code className="font-mono">/resources</code> page automatically.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
