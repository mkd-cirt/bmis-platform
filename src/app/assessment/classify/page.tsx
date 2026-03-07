"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sectors } from "@/data/sectors";
import { classifyEntity, type ClassificationInput, type EntitySize } from "@/lib/classification";

const SIZES = [
  { v:"MICRO" as EntitySize, l:"Микро",  d:"< 10 вработени, до €2М приход", sub:"Не е опфатено со ЗБМИС", c:"text-slate-400" },
  { v:"SMALL" as EntitySize, l:"Мало",   d:"10–49 вработени, до €10М приход", sub:"Не е опфатено со ЗБМИС", c:"text-slate-400" },
  { v:"MEDIUM" as EntitySize,l:"Средно", d:"50–249 вработени ИЛИ €10–50М приход", sub:"Потенцијален ВАЖЕН субјект — Член 8(2)", c:"text-amber-400" },
  { v:"LARGE" as EntitySize, l:"Големо", d:"250+ вработени ИЛИ €50М+ приход ИЛИ €43М+ биланс", sub:"СУШТИНСКИ субјект — Член 8(1) т.1", c:"text-red-400" },
];

export default function ClassifyPage() {
  const router = useRouter();
  const [step, setStep]         = useState(1);
  const [orgName, setOrgName]   = useState("");
  const [sectorId, setSectorId] = useState("");
  const [size, setSize]         = useState<EntitySize | "">("");
  const [employees, setEmployees]   = useState("");
  const [turnover,  setTurnover]    = useState("");
  const [balance,   setBalance]     = useState("");
  const [isPublic,    setIsPublic]    = useState(false);
  const [isQTS,       setIsQTS]       = useState(false);
  const [isDNS,       setIsDNS]       = useState(false);
  const [isTLD,       setIsTLD]       = useState(false);
  const [isTelecom,   setIsTelecom]   = useState(false);
  const [isCritInfra, setIsCritInfra] = useState(false);
  const [isUnique,    setIsUnique]    = useState(false);

  const isSpecial = isPublic || isQTS || isDNS || isTLD || isCritInfra || isUnique;

  const handleClassify = () => {
    const input: ClassificationInput = {
      sectorId: sectorId || "OTHER",
      size: (size || "MICRO") as EntitySize,
      employees: Number(employees) || 0,
      annualTurnoverM: Number(turnover) || 0,
      annualBalanceSheetM: Number(balance) || 0,
      isPublicSector: isPublic,
      isQualifiedTrustProvider: isQTS,
      isDnsProvider: isDNS,
      isTldRegistry: isTLD,
      isPublicElectronicCommsOp: isTelecom,
      isCriticalInfraOwner: isCritInfra,
      isUniqueSectorProvider: isUnique,
    };
    const result = classifyEntity(input);
    sessionStorage.setItem("classifyResult", JSON.stringify({ ...result, orgName }));
    router.push("/assessment/classify/result");
  };

  return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative max-w-2xl mx-auto">

        <Link href="/assessment" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">← Назад</Link>

        <div className="mb-8">
          <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-widest">// фаза 01 — идентификација</div>
          <h1 className="font-display text-3xl font-700 text-white mb-2">Определување на статус</h1>
          <p className="text-slate-400 text-sm">Класификација согласно <span className="text-slate-200">Член 4 и Член 8 од ЗБМИС</span> (Сл. весник бр. 135, 4.7.2025)</p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {[1,2,3].map(n => (
            <div key={n} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-700 transition-all ${step >= n ? "bg-blue-600 text-white" : "glass border border-white/10 text-slate-500"}`}>
                {step > n ? "✓" : n}
              </div>
              {n < 3 && <div className={`h-px w-10 transition-all ${step > n ? "bg-blue-600" : "bg-white/10"}`} />}
            </div>
          ))}
          <span className="text-xs text-slate-500 ml-1">
            {step === 1 ? "Основни инфо + посебни категории" : step === 2 ? "Сектор на дејност" : "Големина на субјектот"}
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="glass-md rounded-2xl p-6 border border-white/8">
              <label className="block text-sm font-medium text-white mb-3">Назив на организацијата</label>
              <input value={orgName} onChange={e => setOrgName(e.target.value)} className="input" placeholder="пр. Енергетика АД Скопје" />
            </div>

            <div className="glass-md rounded-2xl p-6 border border-white/8">
              <div className="text-sm font-medium text-white mb-1">Посебни категории субјекти</div>
              <div className="text-xs text-slate-500 mb-4">Овие субјекти се суштински НЕЗАВИСНО ОД НИВНАТА ГОЛЕМИНА — Член 8(1) т.2,4,6</div>
              <div className="space-y-2.5">
                {[
                  { v:isPublic,    s:setIsPublic,    l:"🏛️ Институција на јавниот сектор",               d:"Влада, министерство, општина, суд — Член 4(1) и Член 8(1) т.4" },
                  { v:isQTS,       s:setIsQTS,       l:"🔐 Давател на квалификувани доверливи услуги",     d:"Член 8(1) т.2 — суштински без оглед на големина" },
                  { v:isDNS,       s:setIsDNS,       l:"🌐 Давател на ДНС услуги",                         d:"Член 8(1) т.2 — суштински без оглед на големина" },
                  { v:isTLD,       s:setIsTLD,       l:"📍 Регистар на врвни домени (.mk / .мкд)",          d:"Член 8(1) т.2 — суштински без оглед на големина" },
                  { v:isCritInfra, s:setIsCritInfra, l:"⚡ Сопственик/оператор на критична инфраструктура", d:"Член 8(1) т.6 — суштински без оглед на големина" },
                  { v:isUnique,    s:setIsUnique,    l:"🎯 Единствен давател на суштинска услуга во РСМ",   d:"Член 4(3) т.5 — суштински без оглед на големина" },
                ].map(item => (
                  <label key={item.l} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${item.v ? "border-blue-500/40 bg-blue-500/8" : "border-white/8 glass hover:border-white/15"}`}>
                    <input type="checkbox" checked={item.v} onChange={e => item.s(e.target.checked)} className="mt-0.5 accent-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">{item.l}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.d}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!orgName.trim()}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-40">
              Продолжи →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="glass-md rounded-2xl p-6 border border-white/8">
              <label className="block text-sm font-medium text-white mb-1">Сектор на дејност</label>
              <p className="text-xs text-slate-500 mb-4">16 области опфатени со Член 4(2) на ЗБМИС — важат за средни и големи субјекти</p>
              <select value={sectorId} onChange={e => setSectorId(e.target.value)} className="input">
                <option value="">-- Изберете сектор --</option>
                {sectors.map(s => (
                  <optgroup key={s.id} label={s.name.mk}>
                    {s.subsectors.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name.mk}</option>
                    ))}
                  </optgroup>
                ))}
                <option value="OTHER">Друг сектор (надвор од Член 4(2))</option>
              </select>

              {(sectorId === "digital-telecom" || sectorId.startsWith("digital")) && (
                <label className="flex items-start gap-3 mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 cursor-pointer">
                  <input type="checkbox" checked={isTelecom} onChange={e => setIsTelecom(e.target.checked)} className="mt-0.5 accent-amber-500 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-amber-200">Оператор/давател на јавни електронски комуникациски мрежи или услуги</div>
                    <div className="text-xs text-slate-500 mt-0.5">Член 8(1) т.3 — средни телеком оператори исто така се СУШТИНСКИ субјекти</div>
                  </div>
                </label>
              )}
            </div>

            {isSpecial && (
              <div className="glass rounded-xl p-4 border border-green-500/20 text-sm text-green-300">
                ✓ Идентификувана е посебна категорија — класификацијата не зависи од секторот. Можете да продолжите.
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3">← Назад</button>
              <button onClick={() => setStep(3)} disabled={!sectorId && !isSpecial}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-40">
                Продолжи →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            {isSpecial ? (
              <div className="glass rounded-xl p-5 border border-green-500/20 text-sm text-green-300 leading-relaxed">
                ✓ Вашата организација е во посебна категорија и се класифицира <strong>независно од нејзината големина</strong>. Можете директно да ја видите класификацијата.
              </div>
            ) : (
              <>
                <div className="glass-md rounded-2xl p-6 border border-white/8">
                  <div className="text-sm font-medium text-white mb-1">Големина на организацијата</div>
                  <div className="text-xs text-slate-500 mb-4">Согласно Закон за трговски друштва — просек за последните 2 фискални години</div>
                  <div className="grid grid-cols-2 gap-3">
                    {SIZES.map(o => (
                      <button key={o.v} onClick={() => setSize(o.v)}
                        className={`p-4 rounded-xl border text-left transition-all ${size === o.v ? "border-blue-500/60 bg-blue-500/10" : "border-white/8 glass glass-hover"}`}>
                        <div className={`font-display font-700 text-sm mb-1 ${o.c}`}>{o.l}</div>
                        <div className="text-xs text-slate-500 leading-relaxed">{o.d}</div>
                        <div className={`text-xs mt-2 font-medium ${o.c}`}>{o.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-md rounded-2xl p-6 border border-white/8">
                  <div className="text-sm font-medium text-white mb-4">Точни вредности <span className="text-slate-500 font-normal">(опционално)</span></div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { l:"Вработени",         v:employees, fn:setEmployees, ph:"пр. 120" },
                      { l:"Годишен приход (М€)", v:turnover, fn:setTurnover, ph:"пр. 15.5" },
                      { l:"Биланс (М€)",         v:balance,  fn:setBalance,  ph:"пр. 12" },
                    ].map(f => (
                      <div key={f.l}>
                        <div className="text-xs text-slate-400 mb-2">{f.l}</div>
                        <input type="number" value={f.v} onChange={e => f.fn(e.target.value)}
                          placeholder={f.ph} className="input text-sm py-2.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="glass rounded-xl p-4 border border-white/5 text-xs text-slate-500 leading-relaxed">
              📜 Класификацијата е индикативна. Финалната листа ја утврдува Владата на предлог на Министерството за дигитална трансформација согласно Член 7 од ЗБМИС (Сл. весник бр. 135, 4.7.2025).
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3">← Назад</button>
              <button onClick={handleClassify}
                disabled={!isSpecial && size === ""}
                className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-40">
                Класифицирај →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
