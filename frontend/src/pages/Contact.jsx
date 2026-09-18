import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useLang } from "../contexts/LanguageContext";
import { INDUSTRIES, PLATFORM_PILLARS } from "../i18n/content";
import { PageHero, Reveal } from "../components/shared/SectionPrimitives";
import { formatApiError } from "../lib/api";
import { Mail, MapPin, Phone, ArrowRight, Check, CalendarDays, Handshake, FlaskConical, MessageSquare } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INTENTS = [
  { key: "consultation", icon: MessageSquare, en: "Request a consultation", id: "Minta konsultasi" },
  { key: "workshop", icon: CalendarDays, en: "Schedule architecture workshop", id: "Jadwalkan architecture workshop" },
  { key: "pilot", icon: FlaskConical, en: "Request 90-day pilot", id: "Minta pilot 90 hari" },
  { key: "partnership", icon: Handshake, en: "Partner with us", id: "Jadi mitra kami" },
  { key: "media", icon: Mail, en: "Media & general inquiry", id: "Media & pertanyaan umum" },
];

const SCOPES = [
  { en: "Single site / pilot", id: "Satu situs / pilot" },
  { en: "Multi-site / regional", id: "Multi-situs / regional" },
  { en: "National / sovereign", id: "Nasional / berdaulat" },
];

export default function Contact() {
  const { lang } = useLang();
  const [intent, setIntent] = useState("consultation");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    industry: "",
    solution: "",
    deployment_scope: "",
    message: "",
  });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(lang === "id" ? "Lengkapi nama, email, dan pesan." : "Please fill name, email and message.");
      return;
    }
    if (form.message.trim().length < 10) {
      toast.error(lang === "id" ? "Pesan minimal 10 karakter." : "Message must be at least 10 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, { ...form, interest: intent, locale: lang });
      setSubmitted(true);
      toast.success(lang === "id" ? "Pesan terkirim. Kami akan menghubungi Anda." : "Message sent. We will be in touch.");
    } catch (err) {
      toast.error(formatApiError(err?.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="page-contact">
      <PageHero
        eyebrow={lang === "id" ? "KONTAK" : "CONTACT"}
        title={lang === "id" ? "Mari susun roadmap sovereign cloud Anda." : "Let's build your sovereign cloud roadmap."}
        subtitle={lang === "id"
          ? "Bicarakan dengan Prominence soal cloud, edge, AI, jaringan, dan modernisasi infrastruktur."
          : "Talk to Prominence about cloud, edge, AI, network and infrastructure modernization."}
      />

      <section className="pb-24" data-testid="contact-form-section">
        <div className="container-max">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Sidebar */}
            <Reveal className="lg:col-span-4">
              <div className="card-surface p-7">
                <div className="eyebrow mb-4">{lang === "id" ? "JENIS PERMINTAAN" : "REQUEST TYPE"}</div>
                <div className="space-y-2">
                  {INTENTS.map((it) => {
                    const Icon = it.icon;
                    const active = intent === it.key;
                    return (
                      <button
                        key={it.key}
                        type="button"
                        onClick={() => setIntent(it.key)}
                        data-testid={`intent-${it.key}`}
                        className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-left transition-all ${
                          active ? "border-ink bg-ink text-white" : "border-ink-100 text-ink hover:border-ink-300"
                        }`}
                      >
                        <Icon size={15} className={active ? "text-signal-300" : "text-signal-600"} />
                        <span className="font-medium">{it[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card-surface p-7 mt-6">
                <div className="eyebrow mb-4">{lang === "id" ? "KANTOR" : "OFFICE"}</div>
                <div className="space-y-3 text-sm text-ink-600">
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="mt-0.5 text-signal-600 flex-shrink-0" />
                    <span>
                      Gedung 18 Office Park, Unit 10-F/18OP, Jl. T.B. Simatupang No. 18,
                      Pasar Minggu, Jakarta Selatan 12520
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={15} className="mt-0.5 text-signal-600 flex-shrink-0" />
                    info@prominence.id
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={15} className="mt-0.5 text-signal-600 flex-shrink-0" />
                    02138820511
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1} className="lg:col-span-8">
              <div className="card-surface p-7 sm:p-10">
                {submitted ? (
                  <div className="py-10 text-center" data-testid="contact-success">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-signal-50 text-signal-600 mb-5">
                      <Check size={26} />
                    </div>
                    <h3 className="heading-3">{lang === "id" ? "Terima kasih." : "Thank you."}</h3>
                    <p className="lead mt-3 max-w-md mx-auto">
                      {lang === "id"
                        ? "Kami telah menerima pesan Anda. Tim Prominence akan menghubungi dalam 1 hari kerja."
                        : "We've received your message. The Prominence team will be in touch within one business day."}
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", company: "", position: "", email: "", phone: "", industry: "", solution: "", deployment_scope: "", message: "" }); }}
                      className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-signal-600 hover:text-signal-700"
                      data-testid="contact-reset"
                    >
                      {lang === "id" ? "Kirim pesan lain" : "Send another message"} <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-5" data-testid="contact-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label={lang === "id" ? "Nama lengkap *" : "Full name *"} required>
                        <input data-testid="contact-name" required value={form.name} onChange={update("name")} className={inputClass} />
                      </Field>
                      <Field label={lang === "id" ? "Email kerja *" : "Work email *"} required>
                        <input data-testid="contact-email" type="email" required value={form.email} onChange={update("email")} className={inputClass} />
                      </Field>
                      <Field label={lang === "id" ? "Organisasi" : "Organization"}>
                        <input data-testid="contact-company" value={form.company} onChange={update("company")} className={inputClass} />
                      </Field>
                      <Field label={lang === "id" ? "Posisi" : "Position"}>
                        <input data-testid="contact-position" value={form.position} onChange={update("position")} className={inputClass} />
                      </Field>
                      <Field label={lang === "id" ? "Telepon" : "Phone"}>
                        <input data-testid="contact-phone" value={form.phone} onChange={update("phone")} className={inputClass} />
                      </Field>
                      <Field label={lang === "id" ? "Industri" : "Industry"}>
                        <select data-testid="contact-industry" value={form.industry} onChange={update("industry")} className={inputClass}>
                          <option value="">{lang === "id" ? "Pilih industri" : "Select industry"}</option>
                          {INDUSTRIES.map((i) => (
                            <option key={i.slug} value={i.slug}>{i[lang].title}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label={lang === "id" ? "Solusi yang diminati" : "Interested solution"}>
                        <select data-testid="contact-solution" value={form.solution} onChange={update("solution")} className={inputClass}>
                          <option value="">{lang === "id" ? "Pilih kapabilitas" : "Select capability"}</option>
                          {PLATFORM_PILLARS.map((p) => (
                            <option key={p.slug} value={p.slug}>{p[lang].title}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label={lang === "id" ? "Cakupan deployment" : "Deployment scope"}>
                        <select data-testid="contact-scope" value={form.deployment_scope} onChange={update("deployment_scope")} className={inputClass}>
                          <option value="">{lang === "id" ? "Pilih cakupan" : "Select scope"}</option>
                          {SCOPES.map((s) => (
                            <option key={s.en} value={s.en}>{s[lang]}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <Field label={lang === "id" ? "Ceritakan kebutuhan Anda *" : "Tell us about your needs *"} required>
                      <textarea
                        data-testid="contact-message"
                        required
                        minLength={10}
                        rows={5}
                        value={form.message}
                        onChange={update("message")}
                        className={inputClass + " resize-none"}
                      />
                    </Field>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-4 border-t border-ink-100">
                      <p className="text-xs text-ink-500 max-w-md">
                        {lang === "id"
                          ? "Dengan mengirim formulir ini, Anda setuju agar Prominence menghubungi Anda."
                          : "By submitting this form, you agree to be contacted by Prominence."}
                      </p>
                      <button
                        type="submit"
                        disabled={loading}
                        data-testid="contact-submit"
                        className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3.5 text-sm font-semibold hover:bg-ink-hover transition-colors disabled:opacity-60"
                      >
                        {loading ? (lang === "id" ? "Mengirim..." : "Sending...") : (lang === "id" ? "Kirim pesan" : "Send message")}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputClass = "w-full bg-white border border-ink-100 rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder-ink-300 focus:outline-none focus:border-ink-400 focus:ring-2 focus:ring-signal-100 transition-all";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-ink-500 mb-2">{label}</span>
    {children}
  </label>
);
