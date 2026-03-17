"use client";
import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const registered   = searchParams.get("registered") === "true";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Грешка при најава"); return; }
      sessionStorage.setItem("userToken", data.token);
      sessionStorage.setItem("userName",  data.name  ?? "");
      sessionStorage.setItem("userEmail", data.email ?? "");
      router.push("/dashboard");
    } catch {
      setError("Грешка при поврзување со серверот");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-25" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white group-hover:bg-blue-500 transition-colors">MK</div>
            <span className="font-bold text-white text-xl">MKD-CIRT BMIS</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Најава</h1>
          <p className="text-slate-400 text-sm">Најавете се со вашата организациска сметка</p>
        </div>

        {/* Success banner after registration */}
        {registered && (
          <div className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Сметката е успешно создадена — можете да се најавите.
          </div>
        )}

        {/* Card */}
        <div className="card p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Е-пошта</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="ana@kompanija.mk"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Лозинка</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Се најавува...
                </>
              ) : "Најави се →"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Немате сметка?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Регистрирајте се
            </Link>
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link href="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Административна најава →
          </Link>
        </div>
      </div>
    </div>
  );
}
