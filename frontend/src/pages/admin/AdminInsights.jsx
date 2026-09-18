import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatApiError } from "../../lib/api";
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function AdminInsights() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/insights");
      setItems(data || []);
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const togglePublish = async (item) => {
    try {
      await api.put(`/admin/insights/${item.id}`, { ...item, published: !item.published });
      setItems((arr) => arr.map((x) => (x.id === item.id ? { ...x, published: !x.published } : x)));
      toast.success(item.published ? "Unpublished" : "Published");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this insight permanently?")) return;
    try {
      await api.delete(`/admin/insights/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
      toast.success("Insight deleted");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  return (
    <div data-testid="admin-insights">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-3">CONTENT</div>
          <h1 className="heading-2">Insights</h1>
          <p className="lead mt-2">Bilingual articles for the public Resources page.</p>
        </div>
        <Link to="/admin/insights/new" data-testid="new-insight-btn" className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-3 text-sm font-semibold hover:bg-ink-hover">
          <Plus size={14} /> New insight
        </Link>
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-ink-400 animate-pulse">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-sm text-ink-500 mb-4">No insights yet. Write your first article to start building thought leadership.</div>
            <Link to="/admin/insights/new" className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-3 text-sm font-semibold">
              <Plus size={14} /> Create insight
            </Link>
          </div>
        ) : (
          <table className="w-full" data-testid="insights-table">
            <thead className="bg-ink-50 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left py-3 px-5">Title</th>
                <th className="text-left py-3 px-5">Category</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Updated</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-ink-100">
              {items.map((i) => (
                <tr key={i.id} className="hover:bg-ink-50" data-testid={`insight-row-${i.id}`}>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-ink">{i.title?.en || i.title?.id || "Untitled"}</div>
                    <div className="text-xs text-ink-500 mt-0.5 font-mono">/{i.slug}</div>
                  </td>
                  <td className="py-3.5 px-5 text-ink-600">{i.category}</td>
                  <td className="py-3.5 px-5">
                    <button onClick={() => togglePublish(i)} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${i.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-ink-50 text-ink-500 hover:bg-ink-100"}`} data-testid={`toggle-publish-${i.id}`}>
                      {i.published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {i.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3.5 px-5 text-ink-500 text-xs">{new Date(i.updated_at).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      {i.published && (
                        <a href={`/resources/${i.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center h-7 w-7 rounded-md text-ink-400 hover:text-signal-600 hover:bg-signal-50" title="View on site">
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <Link to={`/admin/insights/${i.id}`} className="inline-flex items-center justify-center h-7 w-7 rounded-md text-ink-400 hover:text-signal-600 hover:bg-signal-50" data-testid={`edit-insight-${i.id}`} title="Edit">
                        <Edit2 size={13} />
                      </Link>
                      <button onClick={() => remove(i.id)} className="inline-flex items-center justify-center h-7 w-7 rounded-md text-ink-400 hover:text-ember hover:bg-ember/5" data-testid={`delete-insight-${i.id}`} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
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
