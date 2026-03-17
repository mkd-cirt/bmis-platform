export const dynamic = "force-dynamic";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0b1120]">
      <nav className="glass border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-display font-bold text-sm text-white">MK</div>
          <span className="font-display font-600 text-white text-sm">MKD-CIRT BMIS</span>
        </div>
        <Link href="/login" className="btn-ghost text-sm py-2 px-4">Одјави се</Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl font-700 text-white mb-1">Dashboard</h1>
            <p className="text-slate-400 text-sm">Управувајте со вашите BMIS проценки</p>
          </div>
          <Link href="/assessment" className="btn-primary">+ Нова проценка</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label:"Вкупно проценки",   value:"0", color:"text-white" },
            { label:"Завршени",          value:"0", color:"text-green-400" },
            { label:"Во тек",            value:"0", color:"text-amber-400" },
            { label:"Просечен резултат", value:"—", color:"text-blue-400" },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-5 border border-white/5">
              <div className={`font-display text-3xl font-800 mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-display font-600 text-white">Мои проценки</h2>
            <Link href="/assessment" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">+ Нова</Link>
          </div>
          <div className="px-6 py-20 text-center">
            <div className="text-5xl mb-4">📋</div>
            <div className="font-display font-600 text-white text-lg mb-2">Нема проценки уште</div>
            <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
              Започнете со вашата прва BMIS самооценка — трае помалку од 30 минути.
            </p>
            <Link href="/assessment" className="btn-primary">Започни проценка →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
