import { useEffect, useState } from "react";
import { api, formatApiError } from "../../lib/api";
import { Plus, Trash2, Save, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

const empty = { question: { en: "", id: "" }, answer: { en: "", id: "" }, order: 0, published: true };

export default function AdminFAQs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null); // {id?, ...}
  const [lang, setLang] = useState("en");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/faqs");
      setItems(data || []);
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const togglePublish = async (item) => {
    try {
      await api.put(`/admin/faqs/${item.id}`, { ...item, published: !item.published });
      setItems((arr) => arr.map((x) => (x.id === item.id ? { ...x, published: !x.published } : x)));
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const save = async () => {
    if (!edit.question.en && !edit.question.id) { toast.error("Question required."); return; }
    setBusy(true);
    try {
      if (edit.id) {
        const { id: _id, created_at, updated_at, ...body } = edit;
        await api.put(`/admin/faqs/${edit.id}`, body);
        toast.success("Updated");
      } else {
        await api.post("/admin/faqs", edit);
        toast.success("Created");
      }
      setEdit(null);
      load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setBusy(false); }
  };

  return (
    <div data-testid="admin-faqs">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-3">CONTENT</div>
          <h1 className="heading-2">FAQs</h1>
          <p className="lead mt-2">Bilingual FAQ items shown on the public Resources page.</p>
        </div>
        <button onClick={() => { setEdit({ ...empty, order: items.length }); setLang("en"); }} data-testid="new-faq-btn" className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-3 text-sm font-semibold hover:bg-ink-hover">
          <Plus size={14} /> New FAQ
        </button>
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-ink-400 animate-pulse">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-400">No FAQs yet. Add the first one.</div>
        ) : (
          <table className="w-full" data-testid="faqs-table">
            <thead className="bg-ink-50 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="text-left py-3 px-5">Question</th>
                <th className="text-left py-3 px-5 w-24">Order</th>
                <th className="text-left py-3 px-5 w-32">Status</th>
                <th className="text-right py-3 px-5 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-ink-100">
              {items.map((f) => (
                <tr key={f.id} className="hover:bg-ink-50" data-testid={`faq-row-${f.id}`}>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-ink">{f.question?.en || f.question?.id || "—"}</div>
                    <div className="text-xs text-ink-500 mt-0.5 line-clamp-1">{f.answer?.en || f.answer?.id || "—"}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-ink-500">{f.order ?? 0}</td>
                  <td className="py-3.5 px-5">
                    <button onClick={() => togglePublish(f)} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${f.published ? "bg-emerald-50 text-emerald-700" : "bg-ink-50 text-ink-500"}`}>
                      {f.published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {f.published ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => { setEdit({ ...f }); setLang("en"); }} className="text-xs font-semibold text-signal-600 hover:text-signal-700 px-2 py-1" data-testid={`edit-faq-${f.id}`}>Edit</button>
                      <button onClick={() => remove(f.id)} className="inline-flex items-center justify-center h-7 w-7 rounded-md text-ink-400 hover:text-ember hover:bg-ember/5" data-testid={`delete-faq-${f.id}`}>
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

      {/* Modal */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="faq-modal">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setEdit(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
              <div>
                <div className="eyebrow">{edit.id ? "EDIT FAQ" : "NEW FAQ"}</div>
                <div className="font-display font-semibold text-ink text-lg">{edit.id ? "Update FAQ" : "Create FAQ"}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-full border border-ink-100 p-0.5 bg-white">
                  {["en", "id"].map((l) => (
                    <button key={l} onClick={() => setLang(l)} data-testid={`faq-lang-${l}`} className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${lang === l ? "bg-ink text-white" : "text-ink-500"}`}>{l}</button>
                  ))}
                </div>
                <button onClick={() => setEdit(null)} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-ink-500 hover:bg-ink-50"><X size={16} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <Field label={`Question (${lang.toUpperCase()})`}>
                <input data-testid="faq-question" value={edit.question[lang]} onChange={(e) => setEdit({ ...edit, question: { ...edit.question, [lang]: e.target.value } })} className={inputCls} />
              </Field>
              <Field label={`Answer (${lang.toUpperCase()})`}>
                <textarea data-testid="faq-answer" rows={5} value={edit.answer[lang]} onChange={(e) => setEdit({ ...edit, answer: { ...edit.answer, [lang]: e.target.value } })} className={inputCls + " resize-none"} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Display order">
                  <input data-testid="faq-order" type="number" value={edit.order} onChange={(e) => setEdit({ ...edit, order: Number(e.target.value) || 0 })} className={inputCls} />
                </Field>
                <label className="flex items-end gap-3 pb-2 cursor-pointer">
                  <input type="checkbox" data-testid="faq-published" checked={edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.checked })} className="h-4 w-4 rounded border-ink-200 text-signal-600" />
                  <span className="text-sm text-ink">Published</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-ink-100 flex items-center justify-end gap-2">
              <button onClick={() => setEdit(null)} className="rounded-full border border-ink-200 text-ink px-4 py-2 text-xs font-semibold hover:bg-ink-50">Cancel</button>
              <button onClick={save} disabled={busy} data-testid="faq-save" className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-4 py-2 text-xs font-semibold hover:bg-ink-hover disabled:opacity-60">
                <Save size={12} /> {edit.id ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full bg-white border border-ink-100 rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder-ink-300 focus:outline-none focus:border-ink-400 focus:ring-2 focus:ring-signal-100";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-ink-500 mb-2">{label}</span>
    {children}
  </label>
);
