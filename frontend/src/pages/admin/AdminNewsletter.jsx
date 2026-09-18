import { useEffect, useState } from "react";
import { api, formatApiError } from "../../lib/api";
import { Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminNewsletter() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/newsletter");
      setItems(data || []);
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Remove this subscriber?")) return;
    try {
      await api.delete(`/admin/newsletter/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
      toast.success("Removed");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const exportCSV = () => {
    const rows = [["email", "locale", "subscribed_at"], ...items.map((i) => [i.email, i.locale || "en", i.created_at])];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `prominence-subscribers-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="admin-newsletter">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-3">AUDIENCE</div>
          <h1 className="heading-2">Newsletter subscribers</h1>
          <p className="lead mt-2">{items.length} active subscriber{items.length === 1 ? "" : "s"}.</p>
        </div>
        <button onClick={exportCSV} disabled={!items.length} data-testid="export-csv-btn" className="inline-flex items-center gap-2 rounded-full border border-ink-200 text-ink bg-white px-5 py-3 text-sm font-semibold hover:bg-ink-50 disabled:opacity-60">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-ink-400 animate-pulse">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-400">No subscribers yet.</div>
        ) : (
          <table className="w-full" data-testid="newsletter-table">
            <thead className="bg-ink-50 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left py-3 px-5">Email</th>
                <th className="text-left py-3 px-5 w-32">Locale</th>
                <th className="text-left py-3 px-5 w-48">Subscribed</th>
                <th className="text-right py-3 px-5 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-ink-100">
              {items.map((s) => (
                <tr key={s.id} className="hover:bg-ink-50" data-testid={`subscriber-row-${s.id}`}>
                  <td className="py-3.5 px-5 text-ink font-medium">{s.email}</td>
                  <td className="py-3.5 px-5 font-mono uppercase text-ink-500">{s.locale || "en"}</td>
                  <td className="py-3.5 px-5 text-ink-500 text-xs">{new Date(s.created_at).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button onClick={() => remove(s.id)} className="inline-flex items-center justify-center h-7 w-7 rounded-md text-ink-400 hover:text-ember hover:bg-ember/5" data-testid={`delete-sub-${s.id}`}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
