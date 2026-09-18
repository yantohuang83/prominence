import { useEffect, useState } from "react";
import { api, formatApiError } from "../../lib/api";
import { Trash2, Mail, Phone, Building2, Globe, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminInquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("all"); // all | unread | consultation | workshop | pilot | partnership | media

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/inquiries");
      setItems(data || []);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/admin/inquiries/${id}/read`);
      setItems((arr) => arr.map((i) => (i.id === id ? { ...i, read: true } : i)));
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setItems((arr) => arr.filter((i) => i.id !== id));
      if (open?.id === id) setOpen(null);
      toast.success("Inquiry deleted");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const filtered = items.filter((i) => {
    if (filter === "all") return true;
    if (filter === "unread") return !i.read;
    return i.interest === filter;
  });

  const filterTabs = [
    { k: "all", l: "All", c: items.length },
    { k: "unread", l: "Unread", c: items.filter((i) => !i.read).length },
    { k: "consultation", l: "Consultation" },
    { k: "workshop", l: "Workshop" },
    { k: "pilot", l: "Pilot" },
    { k: "partnership", l: "Partnership" },
    { k: "media", l: "Media" },
  ];

  return (
    <div data-testid="admin-inquiries">
      <div className="mb-8">
        <div className="eyebrow mb-3">INQUIRIES</div>
        <h1 className="heading-2">Contact inquiries</h1>
        <p className="lead mt-2">All inbound requests from the public contact form.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filterTabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            data-testid={`filter-${t.k}`}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              filter === t.k ? "bg-ink text-white border-ink" : "border-ink-100 text-ink-500 hover:border-ink-300 bg-white"
            }`}
          >
            {t.l}
            {t.c !== undefined && <span className="font-mono">{t.c}</span>}
          </button>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-ink-400 animate-pulse">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-400">No inquiries match this filter.</div>
        ) : (
          <table className="w-full" data-testid="inquiries-table">
            <thead className="bg-ink-50 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left py-3 px-5">Name</th>
                <th className="text-left py-3 px-5">Email</th>
                <th className="text-left py-3 px-5">Intent</th>
                <th className="text-left py-3 px-5">Industry</th>
                <th className="text-left py-3 px-5">Date</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-ink-100">
              {filtered.map((i) => (
                <tr key={i.id} className={`hover:bg-ink-50 cursor-pointer ${!i.read ? "bg-signal-50/30" : ""}`} onClick={() => { setOpen(i); if (!i.read) markRead(i.id); }} data-testid={`inquiry-row-${i.id}`}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      {!i.read && <span className="h-1.5 w-1.5 rounded-full bg-signal-600 flex-shrink-0" />}
                      <span className="font-medium text-ink">{i.name}</span>
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{i.company || "—"}</div>
                  </td>
                  <td className="py-3.5 px-5 text-ink-600">{i.email}</td>
                  <td className="py-3.5 px-5"><span className="font-mono text-[10px] uppercase tracking-wider text-signal-600 bg-signal-50 px-2 py-1 rounded">{i.interest || "—"}</span></td>
                  <td className="py-3.5 px-5 text-ink-600">{i.industry || "—"}</td>
                  <td className="py-3.5 px-5 text-ink-500 text-xs">{new Date(i.created_at).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button onClick={(e) => { e.stopPropagation(); remove(i.id); }} className="inline-flex items-center justify-center h-7 w-7 rounded-md text-ink-400 hover:text-ember hover:bg-ember/5" data-testid={`delete-inquiry-${i.id}`}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex" data-testid="inquiry-drawer">
          <div className="flex-1 bg-ink/40" onClick={() => setOpen(null)} />
          <div className="w-full sm:max-w-xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="eyebrow">INQUIRY</div>
                <div className="font-display font-semibold text-ink text-lg">{open.name}</div>
              </div>
              <button onClick={() => setOpen(null)} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-ink-500 hover:bg-ink-50" data-testid="close-inquiry-drawer">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-5 text-sm">
              <Row icon={Mail} label="Email" value={<a className="text-signal-600 hover:underline" href={`mailto:${open.email}`}>{open.email}</a>} />
              <Row icon={Phone} label="Phone" value={open.phone || "—"} />
              <Row icon={Building2} label="Organization" value={`${open.company || "—"} · ${open.position || "—"}`} />
              <Row icon={Globe} label="Locale" value={(open.locale || "en").toUpperCase()} />
              <div className="grid grid-cols-3 gap-3 pt-2">
                <Meta label="Intent" value={open.interest || "—"} />
                <Meta label="Industry" value={open.industry || "—"} />
                <Meta label="Scope" value={open.deployment_scope || "—"} />
                <Meta label="Solution" value={open.solution || "—"} />
                <Meta label="Date" value={new Date(open.created_at).toLocaleString()} />
                <Meta label="Status" value={open.read ? "Read" : "Unread"} />
              </div>
              <div>
                <div className="eyebrow mb-2">MESSAGE</div>
                <div className="rounded-lg border border-ink-100 bg-ink-50 p-4 text-ink leading-relaxed whitespace-pre-wrap">{open.message}</div>
              </div>
              <div className="flex gap-2 pt-2">
                <a href={`mailto:${open.email}?subject=Re:%20Prominence%20${encodeURIComponent(open.interest || "inquiry")}`} className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-4 py-2.5 text-sm font-semibold hover:bg-ink-hover">
                  <Mail size={14} /> Reply via email
                </a>
                {!open.read && (
                  <button onClick={() => markRead(open.id)} className="inline-flex items-center gap-2 rounded-full border border-ink-200 text-ink px-4 py-2.5 text-sm font-medium hover:bg-ink-50">
                    <Check size={14} /> Mark as read
                  </button>
                )}
                <button onClick={() => remove(open.id)} className="ml-auto inline-flex items-center gap-2 rounded-full border border-ember/30 text-ember px-4 py-2.5 text-sm font-medium hover:bg-ember/5">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon size={14} className="text-signal-600 mt-1 flex-shrink-0" />
    <div className="min-w-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{label}</div>
      <div className="text-sm text-ink mt-0.5 break-words">{value}</div>
    </div>
  </div>
);
const Meta = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{label}</div>
    <div className="text-sm text-ink mt-0.5">{value}</div>
  </div>
);
