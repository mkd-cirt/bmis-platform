"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { bmis_domains } from "@/data/domains/bmis-domains";
import { sme_domains } from "@/data/domains/sme-domains";
import { sectors } from "@/data/sectors";
import { classifyEntity } from "@/lib/classification";
import { calculateAssessmentScore, getTopGaps } from "@/lib/scoring";

type Track = "none"|"bmis"|"sme";
type Phase = "home"|"classify"|"result-classify"|"assessment"|"results";
type ControlStatus = "NOT_STARTED"|"PARTIAL"|"IMPLEMENTED"|"NOT_APPLICABLE";

const SC: Record<ControlStatus,{label:string;color:string;dot:string;icon:string}> = {
  NOT_STARTED:    {label:"Не е имплементирано", color:"bg-red-500/15 text-red-300 border-red-500/25",     dot:"bg-red-400",    icon:"✗"},
  PARTIAL:        {label:"Делумно",              color:"bg-amber-500/15 text-amber-300 border-amber-500/25",dot:"bg-amber-400",  icon:"◐"},
  IMPLEMENTED:    {label:"Имплементирано",       color:"bg-green-500/15 text-green-300 border-green-500/25",dot:"bg-green-400", icon:"✓"},
  NOT_APPLICABLE: {label:"Не се применува",      color:"bg-slate-500/15 text-slate-400 border-slate-500/25",dot:"bg-slate-500", icon:"—"},
};

const LC = { basic:"text-green-300 bg-green-500/10 border-green-500/20", advanced:"text-amber-300 bg-amber-500/10 border-amber-500/20", expert:"text-red-300 bg-red-500/10 border-red-500/20" };
const LL = { basic:"Основно", advanced:"Напредно", expert:"Експертско" };
const SEVC = { critical:"badge-critical", high:"badge-high", medium:"badge-medium", low:"badge-low" };

export default function AssessmentPage() {
  const [phase, setPhase]           = useState<Phase>("home");
  const [track, setTrack]           = useState<Track>("none");
  const [sectorId, setSectorId]     = useState("");
  const [size, setSize]             = useState("");
  const [employees, setEmployees]   = useState("");
  const [turnover, setTurnover]     = useState("");
  const [balance, setBalance]       = useState("");
  const [classResult, setClassResult] = useState<any>(null);
  const [answers, setAnswers]       = useState<Record<string,ControlStatus>>({});
  const [notes, setNotes]           = useState<Record<string,string>>({});
  const [activeDomain, setActiveDomain] = useState(0);
  const [score, setScore]           = useState<any>(null);
  const [orgName, setOrgName]       = useState("Мојата Организација");
  const [saving, setSaving]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const domains: any[] = track === "bmis" ? bmis_domains : sme_domains;

  const setAnswer = (id: string, s: ControlStatus) => setAnswers(p => ({...p,[id]:s}));

  const totalControls = domains.flatMap((d:any)=>d.controls).length;
  const answeredCount = domains.flatMap((d:any)=>d.controls).filter((c:any)=>answers[c.id] && answers[c.id]!=="NOT_STARTED").length;
  const overallPct    = totalControls > 0 ? Math.round((answeredCount/totalControls)*100) : 0;

  const domainPct = (d: any) => {
    const total = d.controls.length;
    const done  = d.controls.filter((c:any)=>answers[c.id] && answers[c.id]!=="NOT_STARTED").length;
    return Math.round((done/total)*100);
  };

  const saveJSON = () => {
    const data = { track, classResult, answers, notes, orgName, ts: Date.now() };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url;
    a.download = `bmis-assessment-${Date.now()}.json`; a.click();
  };

  const loadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target?.result as string);
        setTrack(d.track); setClassResult(d.classResult);
        setAnswers(d.answers||{}); setNotes(d.notes||{});
        if (d.orgName) setOrgName(d.orgName);
        setPhase("assessment");
      } catch { alert("Невалиден фајл"); }
    };
    reader.readAsText(file);
  };

  const runClassify = () => {
    if (!sectorId || !size) { alert("Изберете сектор и големина"); return; }
    const r = classifyEntity({ sectorId, size:size as any, employees:Number(employees)||0, annualTurnoverM:Number(turnover)||0, annualBalanceSheetM:Number(balance)||0 });
    setClassResult(r); setPhase("result-classify");
  };

  const startBmis = () => { setTrack("bmis"); setPhase("assessment"); setActiveDomain(0); };
  const startSme  = () => { setTrack("sme");  setPhase("assessment"); setActiveDomain(0); };

  const finish = () => {
    if (track==="bmis") {
      const arr = Object.entries(answers).map(([controlId,status])=>({controlId,status}));
      setScore(calculateAssessmentScore(arr));
    }
    setPhase("results");
  };

  const downloadPDF = async () => {
    setSaving(true);
    const { generatePDFReport } = await import("@/lib/pdf-generator");
    const allControls = domains.flatMap((d:any)=>d.controls);
    const implemented = allControls.filter((c:any)=>answers[c.id]==="IMPLEMENTED").length;
    const partial     = allControls.filter((c:any)=>answers[c.id]==="PARTIAL").length;
    const missing     = allControls.filter((c:any)=>!answers[c.id]||answers[c.id]==="NOT_STARTED").length;
    const pct         = score?.percentage ?? Math.round((implemented/allControls.length)*100);
    const gaps        = track==="bmis"
      ? getTopGaps(Object.entries(answers).map(([controlId,status])=>({controlId,status:status as any})),15)
      : allControls.filter((c:any)=>!answers[c.id]||answers[c.id]==="NOT_STARTED").slice(0,15).map((c:any)=>({
          controlId:c.id, title:c.title, severity:c.level||"medium",
          domain: domains.find((d:any)=>d.controls.some((x:any)=>x.id===c.id))?.title||"",
        }));
    generatePDFReport({
      orgName, entityType: classResult?.classification || track.toUpperCase(),
      track, date: new Date().toLocaleDateString("mk-MK"),
      percentage: pct,
      maturityLevel: score?.maturityLevel?.label || "—",
      implemented, partial, missing,
      domainScores: score?.domainScores?.map((ds:any)=>({name:ds.domainName, percentage:ds.percentage})) ||
        domains.map((d:any)=>({ name:d.title, percentage:domainPct(d) })),
      gaps: gaps as any,
    });
    setSaving(false);
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (phase==="home") return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />
      <div className="relative max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-10 transition-colors">
          ← Назад кон почетната
        </Link>

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-blue-300 border border-blue-500/20 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />
            MKD-CIRT · Алатка за самооценување v1.0
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-800 text-white mb-4">
            Алатка за самооценување
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Закон за безбедност на мрежни и информациски системи (ЗБМИС) со проширена поддршка за ММСП
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            {n:"01",icon:"🎯",t:"Определување на статус",d:"Прашања за сектор и големина на организацијата."},
            {n:"02",icon:"📋",t:"Проценка на усогласеност",d:"Детален контролен список по домени."},
            {n:"03",icon:"📊",t:"Анализа на резултати",d:"Визуелен приказ, недостатоци и план за подобрување."},
          ].map(s=>(
            <div key={s.n} className="glass glass-hover rounded-2xl p-6 border border-white/5 transition-all hover:-translate-y-0.5">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="font-mono text-xs text-blue-500 mb-2">ФАЗА {s.n}</div>
              <div className="font-display font-600 text-white mb-2">{s.t}</div>
              <div className="text-sm text-slate-400 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>

        {/* Load saved */}
        <div className="glass rounded-2xl p-6 border border-white/5 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-display font-600 text-white mb-1">📂 Продолжи со претходна проценка</h3>
              <p className="text-sm text-slate-400">Прикачете претходно зачуван JSON фајл.</p>
            </div>
            <div>
              <input ref={fileRef} type="file" accept=".json" onChange={loadJSON} className="hidden" />
              <button onClick={()=>fileRef.current?.click()} className="btn-ghost text-sm py-2 px-4">
                📥 Вчитај прогрес
              </button>
            </div>
          </div>
        </div>

        {/* Tracks */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-2xl p-8 border border-blue-500/15 hover:border-blue-500/30 transition-all hover:-translate-y-0.5">
            <div className="text-3xl mb-4">🏛️</div>
            <div className="inline-flex badge text-blue-300 bg-blue-500/10 border-blue-500/20 mb-3">Анекс I + II</div>
            <h3 className="font-display font-700 text-white text-xl mb-3">За субјекти опфатени со ЗБМИС</h3>
            <p className="text-slate-400 text-sm mb-5">Детална проценка за Суштински и Важни субјекти.</p>
            <ul className="space-y-2 mb-6 text-sm text-slate-300">
              {["12 домени со 90 контроли","Технички и организациски контроли","Извештај за законска усогласеност","PDF извоз на резултатите"].map(f=>(
                <li key={f} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full"/>{f}</li>
              ))}
            </ul>
            <div className="flex gap-3 flex-wrap">
              <button onClick={()=>setPhase("classify")} className="btn-primary text-sm py-2.5 px-5">
                Започни со идентификација →
              </button>
              <button onClick={startBmis} className="btn-ghost text-sm py-2.5 px-4">
                Премини директно
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border border-green-500/15 hover:border-green-500/30 transition-all hover:-translate-y-0.5">
            <div className="text-3xl mb-4">🏪</div>
            <div className="inline-flex badge text-green-300 bg-green-500/10 border-green-500/20 mb-3">ENISA</div>
            <h3 className="font-display font-700 text-white text-xl mb-3">За ММСП</h3>
            <p className="text-slate-400 text-sm mb-5">Поедноставена самопроценка базирана на ENISA препораки.</p>
            <ul className="space-y-2 mb-6 text-sm text-slate-300">
              {["6 поедноставени домени","Тристепенска проценка","Практични ENISA препораки","PDF извоз на резултатите"].map(f=>(
                <li key={f} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"/>{f}</li>
              ))}
            </ul>
            <button onClick={startSme} className="btn-primary text-sm py-2.5 px-5" style={{background:"linear-gradient(135deg,#059669,#10b981)"}}>
              Започни ММСП проценка →
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-amber-500/10 text-sm text-slate-500">
          <span className="text-amber-400 font-medium">⚠️ Важно: </span>
          Оваа алатка работи согласно ЗБМИС, NIS2 и ENISA насоки. По усвојување на подзаконските акти можни се измени. Не претставува правен совет.
        </div>
      </div>
    </div>
  );

  // ── CLASSIFY ─────────────────────────────────────────────────────────────
  if (phase==="classify") return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative max-w-2xl mx-auto">
        <button onClick={()=>setPhase("home")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          ← Назад
        </button>
        <div className="mb-8">
          <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-widest">фаза 01</div>
          <h2 className="font-display text-3xl font-700 text-white mb-2">Определување на статус</h2>
          <p className="text-slate-400 text-sm">Одговорете за да утврдиме вашата NIS2 класификација.</p>
        </div>

        <div className="space-y-5">
          {/* Org name */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <label className="block text-sm font-medium text-white mb-3">Ime на организацијата</label>
            <input value={orgName} onChange={e=>setOrgName(e.target.value)} className="input" placeholder="МојаКомпанија ДООЕЛ" />
          </div>

          {/* Sector */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <label className="block text-sm font-medium text-white mb-3">
              1. Во кој сектор работи вашата организација?
            </label>
            <select value={sectorId} onChange={e=>setSectorId(e.target.value)} className="input">
              <option value="">-- Изберете сектор --</option>
              {sectors.map(s=>(
                <optgroup key={s.id} label={`${s.annex==="I"?"🔴":"🟡"} Анекс ${s.annex} — ${s.name.mk}`}>
                  {s.subsectors.map(sub=>(
                    <option key={sub.id} value={s.id}>{sub.name.mk}</option>
                  ))}
                </optgroup>
              ))}
              <option value="OTHER">Друг сектор (не е директно опфатен)</option>
            </select>
          </div>

          {/* Size */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <label className="block text-sm font-medium text-white mb-4">
              2. Каква е големината на вашата организација?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {v:"MICRO", l:"Микро",  d:"< 10 вработени · < 2М€"},
                {v:"SMALL", l:"Мала",   d:"< 50 вработени · < 10М€"},
                {v:"MEDIUM",l:"Средна", d:"< 250 вработени · < 50М€"},
                {v:"LARGE", l:"Голема", d:"≥ 250 вработени · ≥ 50М€"},
              ].map(o=>(
                <button key={o.v} onClick={()=>setSize(o.v)}
                  className={`p-4 rounded-xl border text-left transition-all ${size===o.v ? "border-blue-500 bg-blue-500/10" : "border-white/8 glass glass-hover"}`}>
                  <div className="font-display font-600 text-white text-sm">{o.l}</div>
                  <div className="text-xs text-slate-500 mt-1">{o.d}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional numbers */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <label className="block text-sm font-medium text-white mb-4">3. Дополнителни детали <span className="text-slate-500">(опционално)</span></label>
            <div className="grid grid-cols-3 gap-4">
              {[
                {l:"Вработени",    v:employees, s:setEmployees, p:"пр. 45"},
                {l:"Промет (М€)",  v:turnover,  s:setTurnover,  p:"пр. 8"},
                {l:"Биланс (М€)",  v:balance,   s:setBalance,   p:"пр. 6"},
              ].map(f=>(
                <div key={f.l}>
                  <div className="text-xs text-slate-400 mb-2">{f.l}</div>
                  <input type="number" value={f.v} onChange={e=>f.s(e.target.value)} placeholder={f.p} className="input text-sm py-2" />
                </div>
              ))}
            </div>
          </div>

          <button onClick={runClassify} className="btn-primary w-full justify-center py-4 text-base">
            Класифицирај ја мојата организација →
          </button>
        </div>
      </div>
    </div>
  );

  // ── CLASSIFY RESULT ───────────────────────────────────────────────────────
  if (phase==="result-classify" && classResult) return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative max-w-2xl mx-auto">
        <button onClick={()=>setPhase("classify")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          ← Назад
        </button>
        <div className="mb-8">
          <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-widest">резултат</div>
          <h2 className="font-display text-3xl font-700 text-white">Класификација</h2>
        </div>

        <div className={`glass rounded-2xl p-8 border mb-6 ${
          classResult.classification==="ESSENTIAL" ? "border-red-500/30" :
          classResult.classification==="IMPORTANT"  ? "border-amber-500/30" :
          classResult.classification==="SME"        ? "border-green-500/30" : "border-white/10"}`}>
          <div className="flex items-start gap-5">
            <div className="text-5xl flex-shrink-0">
              {classResult.classification==="ESSENTIAL" ? "🔴" :
               classResult.classification==="IMPORTANT"  ? "🟡" :
               classResult.classification==="SME"        ? "🟢" : "⚪"}
            </div>
            <div>
              <h3 className="font-display text-2xl font-700 text-white mb-3">
                {classResult.classification==="ESSENTIAL" ? "Суштински субјект" :
                 classResult.classification==="IMPORTANT"  ? "Важен субјект" :
                 classResult.classification==="SME"        ? "ММСП" : "Не е директно опфатен"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{classResult.reason}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {classResult.track==="BMIS" && (
            <button onClick={startBmis} className="btn-primary flex-1 justify-center py-3">
              Започни БМИС проценка →
            </button>
          )}
          {(classResult.track==="SME"||classResult.track==="NONE") && (
            <button onClick={startSme} className="btn-primary flex-1 justify-center py-3"
              style={{background:"linear-gradient(135deg,#059669,#10b981)"}}>
              Започни ММСП проценка →
            </button>
          )}
          {classResult.track==="BMIS" && (
            <button onClick={startSme} className="btn-ghost flex-1 py-3">
              Или ММСП проценка
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── ASSESSMENT ───────────────────────────────────────────────────────────
  if (phase==="assessment") {
    const domain   = domains[activeDomain];
    const controls = domain.controls;

    return (
      <div className="min-h-screen bg-[#080f1e] flex">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex w-72 flex-col glass border-r border-white/5 fixed h-full overflow-y-auto">
          <div className="p-5 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-display font-bold text-xs text-white">MK</div>
              <span className="font-display font-600 text-white text-sm">MKD-CIRT BMIS</span>
            </Link>
            <div className="font-display font-600 text-white text-sm mb-1">
              {track==="bmis" ? "БМИС Проценка" : "ММСП Проценка"}
            </div>
            <div className="text-xs text-slate-500 mb-3">{answeredCount} / {totalControls} одговорени</div>
            <div className="progress-track">
              <div className="progress-fill" style={{width:`${overallPct}%`}} />
            </div>
            <div className="text-right text-xs text-slate-500 mt-1">{overallPct}%</div>
          </div>

          <div className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {domains.map((d:any,i:number)=>{
              const p = domainPct(d);
              return (
                <button key={d.id} onClick={()=>setActiveDomain(i)}
                  className={`sidebar-item w-full text-left ${activeDomain===i?"active":""}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${p===100?"bg-green-500 text-white":p>0?"bg-amber-500 text-white":"bg-white/8 text-slate-400"}`}>
                    {p===100?"✓":i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs">{d.title}</div>
                    {p>0 && p<100 && <div className="text-xs text-slate-600">{p}%</div>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/5 space-y-2">
            <button onClick={saveJSON} className="btn-ghost w-full text-xs py-2">💾 Зачувај прогрес</button>
            <button onClick={finish}   className="btn-primary w-full justify-center text-xs py-2">Заврши →</button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 lg:ml-72 px-4 md:px-8 py-8 max-w-3xl mx-auto">

          {/* Mobile top bar */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-3">
              <Link href="/" className="text-sm text-slate-400">← Почетна</Link>
              <div className="flex gap-2">
                <button onClick={saveJSON} className="btn-ghost text-xs py-1.5 px-3">💾</button>
                <button onClick={finish}   className="btn-primary text-xs py-1.5 px-3">Заврши →</button>
              </div>
            </div>
            <div className="progress-track mb-2">
              <div className="progress-fill" style={{width:`${overallPct}%`}} />
            </div>
            <select value={activeDomain} onChange={e=>setActiveDomain(Number(e.target.value))} className="input text-sm mt-2">
              {domains.map((d:any,i:number)=><option key={d.id} value={i}>{i+1}. {d.title}</option>)}
            </select>
          </div>

          {/* Domain header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="font-mono text-xs text-blue-500 uppercase tracking-widest">
                Домен {activeDomain+1} / {domains.length}
              </span>
              <span className={`badge text-xs ${domainPct(domain)===100?"badge-done":domainPct(domain)>0?"badge-partial":"badge-missing"}`}>
                {domainPct(domain)}% завршено
              </span>
            </div>
            <h2 className="font-display text-2xl font-700 text-white mb-1">{domain.title}</h2>
            <p className="text-slate-400 text-sm">{domain.description}</p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {controls.map((ctrl:any)=>{
              const status = answers[ctrl.id]||"NOT_STARTED";
              const cfg    = SC[status];
              return (
                <div key={ctrl.id}
                  className={`glass rounded-2xl p-6 border transition-all ${
                    status==="IMPLEMENTED" ? "border-green-500/15" :
                    status==="PARTIAL"     ? "border-amber-500/15" : "border-white/5"}`}>

                  {/* Control meta */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-mono text-xs text-slate-600">{ctrl.id}</span>
                        {ctrl.severity && (
                          <span className={`badge text-xs ${SEVC[ctrl.severity as keyof typeof SEVC]||""}`}>
                            {ctrl.severity}
                          </span>
                        )}
                        {ctrl.level && (
                          <span className={`badge text-xs ${LC[ctrl.level as keyof typeof LC]}`}>
                            {LL[ctrl.level as keyof typeof LL]}
                          </span>
                        )}
                        <span className={`badge text-xs ml-auto ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      <h4 className="font-display font-600 text-white text-base mb-1">{ctrl.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{ctrl.description}</p>
                      {ctrl.references && ctrl.references.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {ctrl.references.map((r:string)=>(
                            <span key={r} className="font-mono text-xs bg-blue-500/8 text-blue-400 border border-blue-500/15 px-2 py-0.5 rounded">{r}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status selector */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {(Object.keys(SC) as ControlStatus[]).map(s=>(
                      <button key={s} onClick={()=>setAnswer(ctrl.id,s)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${status===s ? SC[s].color : "glass border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15"}`}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status===s ? SC[s].dot : "bg-white/15"}`} />
                        {SC[s].label}
                      </button>
                    ))}
                  </div>

                  {/* Notes */}
                  <input type="text" value={notes[ctrl.id]||""} onChange={e=>setNotes(p=>({...p,[ctrl.id]:e.target.value}))}
                    placeholder="Белешки, докази, коментари (опционално)..."
                    className="input text-xs py-2.5 text-slate-300" />
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
            <button onClick={()=>setActiveDomain(Math.max(0,activeDomain-1))} disabled={activeDomain===0}
              className="btn-ghost px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed">
              ← Претходен
            </button>
            {activeDomain < domains.length-1 ? (
              <button onClick={()=>setActiveDomain(activeDomain+1)} className="btn-primary px-6 py-3">
                Следен домен →
              </button>
            ) : (
              <button onClick={finish} className="btn-primary px-8 py-3" style={{background:"linear-gradient(135deg,#059669,#10b981)"}}>
                ✓ Заврши проценката
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────────────
  if (phase==="results") {
    const allControls = domains.flatMap((d:any)=>d.controls);
    const implemented = allControls.filter((c:any)=>answers[c.id]==="IMPLEMENTED").length;
    const partial     = allControls.filter((c:any)=>answers[c.id]==="PARTIAL").length;
    const missing     = allControls.filter((c:any)=>!answers[c.id]||answers[c.id]==="NOT_STARTED").length;
    const pct         = score?.percentage ?? Math.round((implemented/allControls.length)*100);
    const maturity    = score?.maturityLevel?.label || (pct>=80?"Managed":pct>=60?"Defined":pct>=40?"Developing":"Initial");
    const pctColor    = pct>=80?"#10b981":pct>=60?"#f59e0b":pct>=40?"#f97316":"#ef4444";

    const gaps = track==="bmis"
      ? getTopGaps(Object.entries(answers).map(([controlId,status])=>({controlId,status:status as any})),10)
      : allControls.filter((c:any)=>!answers[c.id]||answers[c.id]==="NOT_STARTED").slice(0,10).map((c:any)=>({
          controlId:c.id, title:c.title, severity:c.level||"medium",
          domain:domains.find((d:any)=>d.controls.some((x:any)=>x.id===c.id))?.title||"",
        }));

    return (
      <div className="min-h-screen bg-[#080f1e] px-4 py-12">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="relative max-w-4xl mx-auto">
          <button onClick={()=>setPhase("assessment")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
            ← Назад кон проценката
          </button>

          <div className="text-center mb-10">
            <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-widest">резултати</div>
            <h2 className="font-display text-4xl font-700 text-white mb-2">Извештај за усогласеност</h2>
            <p className="text-slate-400 text-sm">{track==="bmis"?"БМИС / NIS2 Проценка":"ММСП Проценка"} · {orgName}</p>
          </div>

          {/* Score hero */}
          <div className="glass rounded-3xl p-10 border border-white/8 mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-36 h-36 rounded-full mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div className="absolute inset-0 rounded-full border-4 transition-all" style={{borderColor:pctColor,clipPath:"inset(0 round 50%)"}} />
                <div className="text-center">
                  <div className="font-display text-4xl font-800 text-white" style={{color:pctColor}}>{pct}%</div>
                  <div className="text-xs text-slate-500 mt-0.5">резултат</div>
                </div>
              </div>
              <h3 className="font-display text-2xl font-700 text-white mb-2">{maturity}</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                {score?.maturityLevel?.description || "Тековно ниво на зрелост на сајбер-безбедноста"}
              </p>
              <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
                {[
                  {n:implemented,l:"Имплементирано",c:"text-green-400"},
                  {n:partial,    l:"Делумно",        c:"text-amber-400"},
                  {n:missing,    l:"Недостига",      c:"text-red-400"},
                ].map(s=>(
                  <div key={s.l} className="glass rounded-xl p-4 border border-white/5">
                    <div className={`font-display text-3xl font-800 ${s.c}`}>{s.n}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domain bars */}
          {score && (
            <div className="glass rounded-2xl p-6 border border-white/8 mb-8">
              <h3 className="font-display font-700 text-white mb-6">📊 Резултати по домени</h3>
              <div className="space-y-4">
                {score.domainScores.map((ds:any)=>(
                  <div key={ds.domainId}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300 font-medium">{ds.domainName}</span>
                      <span className={`font-display font-700 ${ds.percentage>=80?"text-green-400":ds.percentage>=50?"text-amber-400":"text-red-400"}`}>
                        {ds.percentage}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{
                        width:`${ds.percentage}%`,
                        background: ds.percentage>=80?"linear-gradient(90deg,#059669,#10b981)":
                                    ds.percentage>=50?"linear-gradient(90deg,#d97706,#f59e0b)":
                                    "linear-gradient(90deg,#dc2626,#ef4444)",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SME domain bars fallback */}
          {!score && track==="sme" && (
            <div className="glass rounded-2xl p-6 border border-white/8 mb-8">
              <h3 className="font-display font-700 text-white mb-6">📊 Резултати по домени</h3>
              <div className="space-y-4">
                {domains.map((d:any)=>{
                  const p = domainPct(d);
                  return (
                    <div key={d.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300 font-medium">{d.title}</span>
                        <span className={`font-display font-700 ${p>=80?"text-green-400":p>=50?"text-amber-400":"text-red-400"}`}>{p}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{
                          width:`${p}%`,
                          background:p>=80?"linear-gradient(90deg,#059669,#10b981)":p>=50?"linear-gradient(90deg,#d97706,#f59e0b)":"linear-gradient(90deg,#dc2626,#ef4444)",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Improvement plan */}
          {gaps.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-red-500/8 mb-8">
              <h3 className="font-display font-700 text-white mb-2">🎯 План за подобрување</h3>
              <p className="text-slate-400 text-sm mb-6">Приоритетни недостатоци подредени по критичност</p>
              <div className="space-y-3">
                {gaps.map((g:any,i:number)=>(
                  <div key={g.controlId} className="glass rounded-xl p-4 border border-white/5 flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-300 font-display font-700 text-sm flex-shrink-0">
                      {i+1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white mb-0.5">{g.title}</div>
                      <div className="text-xs text-slate-500">{g.domain}</div>
                    </div>
                    <span className={`badge text-xs flex-shrink-0 ${
                      g.severity==="critical"||g.severity==="expert"   ? "badge-critical" :
                      g.severity==="high"    ||g.severity==="advanced" ? "badge-high" : "badge-medium"}`}>
                      {g.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button onClick={downloadPDF} disabled={saving}
              className="btn-primary gap-2 px-6 py-3">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Генерирање...</> : "📄 Преземи PDF извештај"}
            </button>
            <button onClick={saveJSON} className="btn-ghost px-6 py-3">💾 Зачувај JSON</button>
            <button onClick={()=>{setAnswers({});setNotes({});setScore(null);setPhase("home");}}
              className="btn-ghost px-6 py-3">🔄 Нова проценка</button>
            <Link href="/" className="btn-ghost px-6 py-3">← Почетна</Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
