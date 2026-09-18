import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, formatApiError } from "../../lib/api";
import { ArrowLeft, Save, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const empty = {
  title: { en: "", id: "" },
  excerpt: { en: "", id: "" },
  body: { en: "", id: "" },
  category: "Insights",
  cover_image: "",
  published: false,
};

export default function AdminInsightEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("write"); // write | preview
  const [lang, setLang] = useState("en");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const { data } = await api.get(`/admin/insights/${id}`);
        setForm({
          title: data.title || { en: "", id: "" },
          excerpt: data.excerpt || { en: "", id: "" },
          body: data.body || { en: "", id: "" },
          category: data.category || "Insights",
          cover_image: data.cover_image || "",
          published: !!data.published,
        });
        setSlug(data.slug);
      } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setLoading(false); }
    })();
  }, [id, isNew]);

  const setLocalized = (field) => (val) => setForm((f) => ({ ...f, [field]: { ...f[field], [lang]: val } }));

  const save = async (publishOverride) => {
    if (!form.title.en && !form.title.id) {
      toast.error("Title is required (EN or ID).");
      return;
    }
    if (!form.body.en && !form.body.id) {
      toast.error("Body is required (EN or ID).");
      return;
    }
    setBusy(true);
    const payload = { ...form };
    if (typeof publishOverride === "boolean") payload.published = publishOverride;
    try {
      if (isNew) {
        const { data } = await api.post("/admin/insights", payload);
        toast.success(payload.published ? "Insight published" : "Draft saved");
        nav(`/admin/insights/${data.id}`, { replace: true });
      } else {
        await api.put(`/admin/insights/${id}`, payload);
        setForm((f) => ({ ...f, published: payload.published }));
        toast.success(payload.published ? "Insight published" : "Saved");
      }
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!window.confirm("Delete this insight permanently?")) return;
    try {
      await api.delete(`/admin/insights/${id}`);
      toast.success("Deleted");
      nav("/admin/insights");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  if (loading) return <div className="text-sm text-ink-400 animate-pulse">Loading…</div>;

  return (
    <div data-testid="admin-insight-editor">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/insights" className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-ink-100 text-ink-500 hover:text-ink hover:bg-white">
            <ArrowLeft size={14} />
          </Link>
          <div>
            <div className="eyebrow">{isNew ? "NEW INSIGHT" : "EDIT INSIGHT"}</div>
            <h1 className="font-display text-2xl font-bold text-ink">{form.title[lang] || form.title.en || form.title.id || "Untitled"}</h1>
            {slug && <div className="text-xs font-mono text-ink-400 mt-1">/{slug}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <button onClick={remove} className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 text-ember px-4 py-2 text-xs font-semibold hover:bg-ember/5" data-testid="delete-insight-btn">
              <Trash2 size={12} /> Delete
            </button>
          )}
          <button onClick={() => save(false)} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 text-ink px-4 py-2 text-xs font-semibold hover:bg-ink-50 disabled:opacity-60" data-testid="save-draft-btn">
            <Save size={12} /> Save draft
          </button>
          <button onClick={() => save(true)} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-4 py-2 text-xs font-semibold hover:bg-ink-hover disabled:opacity-60" data-testid="publish-btn">
            {form.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="eyebrow">CONTENT · {lang.toUpperCase()}</div>
              <div className="inline-flex rounded-full border border-ink-100 p-0.5 bg-white" data-testid="lang-tabs">
                {["en", "id"].map((l) => (
                  <button key={l} onClick={() => setLang(l)} data-testid={`lang-${l}`} className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${lang === l ? "bg-ink text-white" : "text-ink-500"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Title">
              <input data-testid="field-title" value={form.title[lang]} onChange={(e) => setLocalized("title")(e.target.value)} className={inputCls} placeholder={`Title (${lang})`} />
            </Field>
            <Field label="Excerpt">
              <textarea data-testid="field-excerpt" rows={2} value={form.excerpt[lang]} onChange={(e) => setLocalized("excerpt")(e.target.value)} className={inputCls + " resize-none"} placeholder="A short summary that appears in the article card." />
            </Field>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-ink-500">Body (Markdown)</span>
                <div className="inline-flex rounded-md border border-ink-100 p-0.5 bg-white">
                  {[
                    { k: "write", l: "Write" },
                    { k: "preview", l: "Preview" },
                  ].map((t) => (
                    <button key={t.k} onClick={() => setTab(t.k)} data-testid={`tab-${t.k}`} className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors ${tab === t.k ? "bg-ink text-white" : "text-ink-500"}`}>
                      {t.l}
                    </button>
                  ))}
                </div>
              </div>
              {tab === "write" ? (
                <textarea
                  data-testid="field-body"
                  rows={18}
                  value={form.body[lang]}
                  onChange={(e) => setLocalized("body")(e.target.value)}
                  placeholder={"# Headline\n\nWrite your article in markdown..."}
                  className={inputCls + " resize-y font-mono text-[13px] leading-relaxed"}
                />
              ) : (
                <div className="rounded-lg border border-ink-100 bg-white p-6 min-h-[420px] prose prose-sm max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-ink prose-p:text-ink-700 prose-a:text-signal-600" data-testid="body-preview">
                  <ReactMarkdown>{form.body[lang] || "_Nothing to preview yet._"}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card-surface p-6">
            <div className="eyebrow mb-4">SETTINGS</div>
            <Field label="Category">
              <input data-testid="field-category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Cover image URL">
              <input data-testid="field-cover" value={form.cover_image} onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))} className={inputCls} placeholder="https://…" />
            </Field>
            {form.cover_image && (
              <div className="mt-3 rounded-lg overflow-hidden border border-ink-100 aspect-video">
                <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="mt-5 flex items-center gap-3 cursor-pointer">
              <input type="checkbox" data-testid="field-published" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="h-4 w-4 rounded border-ink-200 text-signal-600 focus:ring-signal-100" />
              <span className="text-sm text-ink">Published (visible on public site)</span>
            </label>
          </div>

          <div className="card-surface p-6 bg-signal-50 border-signal-100">
            <div className="flex items-start gap-3">
              <Eye size={16} className="text-signal-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-ink-600 leading-relaxed">
                Tip: Markdown supports headings (#), bold (**), links ([label](url)), lists, and code blocks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-white border border-ink-100 rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder-ink-300 focus:outline-none focus:border-ink-400 focus:ring-2 focus:ring-signal-100";

const Field = ({ label, children }) => (
  <label className="block mt-4 first:mt-0">
    <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-ink-500 mb-2">{label}</span>
    {children}
  </label>
);
