"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fields = [
  { key:"orgName",  label:"Организација",  type:"text",     ph:"МојаКомпанија ДООЕЛ" },
  { key:"name",     label:"Ваше ime",       type:"text",     ph:"Ана Петровска" },
  { key:"email",    label:"Email адреса",   type:"email",    ph:"ana@kompanija.mk" },
  { key:"password", label:"Лозинка",        type:"password", ph:"мин. 8 знаци" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ orgName:"", name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [step, setStep]       = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/register", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Грешка");
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center font-display font-800 text-white group-hover:bg-blue-500 transition-colors">MK</div>
            <span className="font-display font-700 text-white text-xl">MKD-CIRT BMIS</span>
          </Link>
          <h1 className="font-display text-3xl font-700 text-white mb-2">Регистрација</h1>
          <p className="text-slate-400 text-sm">Создадете сметка за вашата организација</p>
        </div>

        <div className="glass-md rounded-2xl p-8 border border-white/8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span>❌</span> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))}
                  required placeholder={f.ph} className="input" />
              </div>
            ))}
            <div className="glass rounded-xl p-3 border border-white/5 text-xs text-slate-500 leading-relaxed">
              🔒 Вашите податоци се заштитени и не се споделуваат со трети страни.
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Се регистрирате...</>
              ) : "Создај сметка →"}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Веќе имате сметка?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Најавете се</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
