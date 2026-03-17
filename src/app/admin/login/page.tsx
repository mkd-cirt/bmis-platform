"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) router.replace("/admin");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Грешка при најава"); return; }
      sessionStorage.setItem("adminToken", data.token);
      router.push("/admin");
    } catch {
      setError("Грешка при поврзување со серверот");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-4">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-25" />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <span className="text-white font-bold text-sm">MK</span>
          </div>
          <div className="text-white font-bold text-lg">MKD-CIRT</div>
          <div className="text-slate-400 text-xs tracking-widest uppercase mt-0.5">Admin Portal</div>
        </div>

        {/* Card */}
        <div className="card p-7">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-5">
            Административна најава
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Е-пошта</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="admin@mkd-cirt.mk"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Лозинка</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? "Се најавува..." : "Најави се"}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Назад кон платформата
          </a>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-600">
          © 2025 MKD-CIRT · Ограничен пристап — само за овластени лица
        </div>
      </div>
    </div>
  );
}
