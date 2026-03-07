"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS = {
  ESSENTIAL: {
    label: "СУШТИНСКИ СУБЈЕКТ",
    subtitle: "Задолжителна БМИС усогласеност",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.05)",
    border: "rgba(239,68,68,0.2)",
  },
  IMPORTANT: {
    label: "ВАЖЕН СУБЈЕКТ",
    subtitle: "Пропорционални обврски согласно ЗБМИС",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.05)",
    border: "rgba(245,158,11,0.2)",
  },
  SME: {
    label: "ММСП — НЕ Е ОПФАТЕН СО ЗБМИС",
    subtitle: "Препорачана доброволна проценка",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.05)",
    border: "rgba(34,197,94,0.2)",
  },
  NOT_COVERED: {
    label: "НЕ Е ДИРЕКТНО ОПФАТЕН",
    subtitle: "Надвор од Член 4(2) — индикативна класификација",
    color: "#64748b",
    bg: "rgba(100,116,139,0.05)",
    border: "rgba(100,116,139,0.2)",
  },
} as const;

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("classifyResult");
    if (!raw) {
      router.push("/assessment/classify");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data)
    return (
      <div className="min-h-screen bg-[#080f1e] flex items-center justify-center">
        <div className="text-slate-500 text-sm font-mono">Се вчитува...</div>
      </div>
    );

  const s = STATUS[data.classification as keyof typeof STATUS] ?? STATUS.NOT_COVERED;

  const actionCta =
    data.track === "BMIS"
      ? { href: "/assessment?track=bmis", label: "Продолжи со БМИС проценка →", className: "btn-primary" }
      : data.track === "SME"
        ? {
            href: "/assessment?track=sme",
            label: "Продолжи со ММСП проценка →",
            className: "bg-emerald-600 hover:bg-emerald-500 text-white",
          }
        : {
            href: "/assessment?track=sme",
            label: "Започни доброволна проценка →",
            className: "bg-slate-700 hover:bg-slate-600 text-white",
          };

  return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-10">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />
      <div className="relative max-w-3xl mx-auto">
        <Link
          href="/assessment/classify"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-300 mb-8 tracking-wider uppercase transition-colors"
        >
          ← Нова класификација
        </Link>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/5 pointer-events-none" />
          <div className="relative">
            <div className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">{data.orgName}</div>
            <h1 className="font-display text-3xl md:text-4xl font-800 leading-tight" style={{ color: s.color }}>
              {s.label}
            </h1>
            <div className="text-xs text-slate-400 mt-2">{s.subtitle}</div>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              <span className="text-[11px] font-mono text-slate-400">{data.legalBasis}</span>
            </div>
          </div>
        </div>

        {data.isAutoEssential && (
          <div className="mb-5 flex items-center gap-3 p-3 rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Класифициран <strong className="text-white">автоматски — независно од бројот на вработени, приход или биланс</strong>.
            </p>
          </div>
        )}

        <div className="mb-5 p-5 rounded-2xl border" style={{ borderColor: s.border, background: s.bg }}>
          <p className="text-sm text-slate-300 leading-relaxed">{data.reason}</p>
        </div>

        {data.obligations?.length > 0 && (
          <div className="mb-4 rounded-2xl border border-white/8 bg-white/2 p-5">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">Обврски / препораки</div>
            <ul className="space-y-2.5">
              {data.obligations.map((o: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-xs text-blue-400 font-mono mt-0.5">
                    {i + 1}
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl border border-red-500/12 bg-red-500/3 p-4">
            <div className="text-xs font-mono text-red-500 uppercase tracking-wider mb-2">Санкции</div>
            <div className="text-xs text-slate-400 leading-relaxed">{data.sanctions}</div>
          </div>
          <div className="rounded-xl border border-amber-500/12 bg-amber-500/3 p-4">
            <div className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-2">Рок</div>
            <div className="text-xs text-slate-400 leading-relaxed">{data.deadlines}</div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-2">Правна напомена</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Оваа класификација е индикативна и служи како самопроценка. Финалната листа на суштински и важни субјекти ја утврдува
            Владата на РСМ на предлог на Министерството за дигитална трансформација согласно Член 7 од ЗБМИС (Сл. весник бр. 135,
            4.7.2025). Не претставува правен совет.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={actionCta.href}
            className={`flex-1 justify-center py-3.5 rounded-xl font-medium text-sm flex items-center transition-all ${actionCta.className}`}
          >
            {actionCta.label}
          </Link>
          <Link href="/assessment/classify" className="btn-ghost px-5 py-3 text-sm">
            ← Назад
          </Link>
        </div>
      </div>
    </div>
  );
}
