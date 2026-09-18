import { useState, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav("/admin", { replace: true }); }, [user, nav]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-sand"><div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-400 animate-pulse">Checking session…</div></div>;
  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const r = await login(email.trim().toLowerCase(), password);
    setBusy(false);
    if (!r.ok) {
      setError(r.error || "Login failed");
      toast.error(r.error || "Login failed");
    } else {
      toast.success("Welcome back");
      nav("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-sand" data-testid="admin-login">
      {/* Left brand panel */}
      <div className="lg:flex-1 bg-ink text-white p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)" }} />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-signal-600/30 blur-3xl" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/prominence-icon.png" alt="" className="h-10 w-auto" />
            <span className="font-display text-xl font-semibold text-white">Prominence</span>
          </Link>
        </div>
        <div className="relative max-w-lg">
          <div className="eyebrow text-signal-300 mb-5">CMS · ADMIN ACCESS</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
            Manage Prominence's content with confidence.
          </h1>
          <p className="mt-5 text-ink-100 leading-relaxed text-base">
            Publish insights, edit FAQs, triage inquiries and grow your subscriber base — all from a single sovereign console.
          </p>
        </div>
        <div className="relative font-mono text-[10px] tracking-[0.2em] uppercase text-ink-300">
          v1.0 · Sovereign · Jakarta
        </div>
      </div>

      {/* Right form */}
      <div className="lg:w-[480px] xl:w-[520px] flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="eyebrow mb-4">SIGN IN</div>
          <h2 className="heading-2">Welcome back.</h2>
          <p className="text-sm text-ink-500 mt-3">Enter your administrator credentials to continue.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" data-testid="login-form">
            <label className="block">
              <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-ink-500 mb-2">Email</span>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  data-testid="login-email"
                  type="email" required autoFocus
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@prominence.id"
                  className="w-full bg-white border border-ink-100 rounded-lg pl-10 pr-3.5 py-3 text-sm text-ink placeholder-ink-300 focus:outline-none focus:border-ink-400 focus:ring-2 focus:ring-signal-100"
                />
              </div>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-ink-500 mb-2">Password</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  data-testid="login-password"
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-ink-100 rounded-lg pl-10 pr-3.5 py-3 text-sm text-ink placeholder-ink-300 focus:outline-none focus:border-ink-400 focus:ring-2 focus:ring-signal-100"
                />
              </div>
            </label>

            {error && <div className="text-sm text-ember bg-ember/5 border border-ember/20 rounded-md px-3 py-2" data-testid="login-error">{error}</div>}

            <button
              type="submit"
              disabled={busy}
              data-testid="login-submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-sm font-semibold hover:bg-ink-hover transition-colors disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"} <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 text-xs text-ink-400">
            <Link to="/" className="hover:text-ink">← Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
