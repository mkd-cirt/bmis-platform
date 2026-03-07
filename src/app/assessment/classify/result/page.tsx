"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CFG: Record<string,{icon:string;label:string;border:string;bg:string;color:string}> = {
  ESSENTIAL:    { icon:"🔴", label:"СУШТИНСКИ СУБЈЕКТ",              border:"border-red-500/30",    bg:"from-red-600/5",    color:"text-red-300"    },
  IMPORTANT:    { icon:"🟡", label:"ВАЖЕН СУБЈЕКТ",                  border:"border-amber-500/30",  bg:"from-amber-600/5",  color:"text-amber-300"  },
  PUBLIC_SECTOR:{ icon:"🏛️", label:"СУШТИНСКИ — ЈАВЕН СЕКТОР",       border:"border-blue-500/30",   bg:"from-blue-600/5",   color:"text-blue-300"   },
  SPECIAL:      { icon:"⚡", label:"СУШТИНСКИ — ПОСЕБНА КАТЕГОРИЈА", border:"border-red-500/30",    bg:"from-red-600/5",    color:"text-red-300"    },
  SME:          { icon:"🟢", label:"ММСП — НЕ Е ДИРЕКТНО ОПФАТЕН",  border:"border-green-500/30",  bg:"from-green-600/5",  color:"text-green-300"  },
  NOT_COVERED:  { icon:"⚪", label:"НЕ Е ДИРЕКТНО ОПФАТЕН",          border:"border-slate-500/30",  bg:"from-slate-600/5",  color:"text-slate-400"  },
};

export default function ClassifyResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("classifyResult");
    if (!raw) { router.push("/assessment/classify"); return; }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data) return (
    <div className="min-h-screen bg-[#080f1e] flex items-center justify-center">
      <div className="text-slate-400 text-sm">Се вчитува...</div>
    </div>
  );

  const cfg = CFG[data.classification] || CFG.NOT_COVERED;
  const isBmis = data.track === "BMIS";

  return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative max-w-2xl mx-auto">

        <Link href="/assessment/classify" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          ← Нова класификација
        </Link>

        <div className="mb-6">
          <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-widest">// резултат на класификација</div>
          <h1 className="font-display text-3xl font-700 text-white">Статус на субјектот</h1>
        </div>

        {/* Result */}
        <div className={`glass-md rounded-2xl p-8 border ${cfg.border} mb-5 relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${cfg.bg} to-transparent pointer-events-none`} />
          <div className="relative">
            <div className="flex items-start gap-5 mb-5">
              <span className="text-5xl flex-shrink-0">{cfg.icon}</span>
              <div>
                <div className="text-xs font-mono text-slate-500 mb-1 uppercase tracking-wide">{data.orgName}</div>
                <h2 className={`font-display text-2xl font-800 mb-2 ${cfg.color}`}>{cfg.label}</h2>
                <div className="text-xs text-blue-400 font-mono">{data.legalBasis}</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{data.reason}</p>
          </div>
        </div>

        {/* Obligations */}
        <div className="glass rounded-2xl p-6 border border-white/8 mb-4">
          <h3 className="font-display font-600 text-white text-base mb-4">📋 Обврски согласно ЗБМИС</h3>
          <ul className="space-y-2.5">
            {data.obligations.map((o: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-300 flex-shrink-0 mt-0.5 font-display font-700">
                  {i + 1}
                </span>
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* Sanctions + Deadlines */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="glass rounded-xl p-4 border border-red-500/15">
            <div className="text-xs text-red-400 font-mono uppercase tracking-wide mb-2">⚠️ Санкции</div>
            <div className="text-xs text-slate-300 leading-relaxed">{data.sanctions}</div>
          </div>
          <div className="glass rounded-xl p-4 border border-amber-500/15">
            <div className="text-xs text-amber-400 font-mono uppercase tracking-wide mb-2">📅 Рокови</div>
            <div className="text-xs text-slate-300 leading-relaxed">{data.deadlines}</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass rounded-xl p-4 border border-white/5 text-xs text-slate-500 mb-8 leading-relaxed">
          ⚠️ Оваа класификација е индикативна и информативна. Финалната листа на суштински и важни субјекти ја утврдува Владата на РСМ на предлог на Министерството за дигитална трансформација согласно Член 7 од ЗБМИС (Сл. весник бр. 135, 4.7.2025). Оваа алатка не претставува правен совет.
        </div>

        {/* CTA */}
        <div className="flex gap-4 flex-wrap">
          {isBmis ? (
            <Link href="/assessment?track=bmis" className="btn-primary flex-1 justify-center py-3.5">
              Продолжи со БМИС проценка →
            </Link>
          ) : (
            <Link href="/assessment?track=sme" className="btn-primary flex-1 justify-center py-3.5"
              style={{background:"linear-gradient(135deg,#059669,#10b981)"}}>
              Продолжи со ММСП проценка →
            </Link>
          )}
          <Link href="/assessment" className="btn-ghost px-6 py-3">Почетна на проценка</Link>
        </div>
      </div>
    </div>
  );
}
