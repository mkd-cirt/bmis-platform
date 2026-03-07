"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sectors } from "@/data/sectors";
import {
  classifyEntity,
  isAutoEssentialEntity,
  type ClassificationInput,
  type EntitySize,
} from "@/lib/classification";

// Сите категории кои се АВТОМАТСКИ СУШТИНСКИ независно од големина
// Редоследот е важен — прво Член 8(1) т.4, потоа т.2, т.5, т.6, и Член 4(3)
const AUTO_TYPES = [
  {
    key: "isPublicSector" as const,
    icon: "🏛",
    label: "Институција на јавниот сектор",
    sublabel: "Член 8(1) т.4 + Член 4(1)",
    desc: "Собрание, Влада, министерство, суд, општини, самостојни органи на државната управа, управни организации",
  },
  {
    key: "isQualifiedTrustProvider" as const,
    icon: "🔐",
    label: "Давател на квалификувани доверливи услуги",
    sublabel: "Член 8(1) т.2",
    desc: "Квалификувани електронски потписи, печати, временски жигови согласно прописите за е-идентификација",
  },
  {
    key: "isTrustServiceProvider" as const,
    icon: "✦",
    label: "Давател на доверливи услуги",
    sublabel: "Член 8(1) т.5 + Член 4(3) т.2",
    desc: "Доверливи услуги (неквалификувани) согласно прописите за електронска идентификација",
  },
  {
    key: "isTldRegistry" as const,
    icon: "◎",
    label: "Регистар на врвни домени (.mk / .мкд)",
    sublabel: "Член 8(1) т.2 + Член 4(3) т.3",
    desc: "Субјектот кој го води Единствениот регистар на врвни домени .mk и .мкд",
  },
  {
    key: "isDnsProvider" as const,
    icon: "⬡",
    label: "Давател на ДНС услуги",
    sublabel: "Член 8(1) т.2 + Член 4(3) т.4",
    desc: "Јавно достапни рекурзивни или авторитативни DNS услуги (освен оператори на коренски сервери)",
  },
  {
    key: "isCriticalInfraOwner" as const,
    icon: "⚡",
    label: "Сопственик/оператор на критична инфраструктура",
    sublabel: "Член 8(1) т.6 + Член 4(3) т.9",
    desc: "Утврден со закон согласно прописите за критична инфраструктура на РСМ",
  },
  {
    key: "isUniqueSectorProvider" as const,
    icon: "◈",
    label: "Единствен давател на суштинска услуга во РСМ",
    sublabel: "Член 4(3) т.5",
    desc: "Единствен давател на услуга во Републиката суштинска за одржување на општествени или економски активности",
  },
  {
    key: "isPublicSafetyImpact" as const,
    icon: "⊕",
    label: "Значително влијание врз јавната безбедност или здравје",
    sublabel: "Член 4(3) т.6",
    desc: "Услугата на субјектот има значително влијание врз јавната безбедност, јавната заштита или јавното здравје",
  },
  {
    key: "isSystemicRisk" as const,
    icon: "⊗",
    label: "Субјект со значителни системски ризици",
    sublabel: "Член 4(3) т.7",
    desc: "Нарушувањето на услугата може да предизвика значителни системски ризици со потенцијално прекугранично влијание",
  },
  {
    key: "isCriticalForSector" as const,
    icon: "◆",
    label: "Критичен субјект за одредена област",
    sublabel: "Член 4(3) т.8",
    desc: "Поради посебна важност, критичен за одредена област, тип услуга или за меѓусебно зависни области",
  },
  {
    key: "isDomainRegistrar" as const,
    icon: "▣",
    label: "Давател на услуги за регистрација на домени",
    sublabel: "Член 4(3) т.10",
    desc: "Регистратор или застапник кој обезбедува услуги за регистрација на имиња на домени",
  },
];

type AutoKey = typeof AUTO_TYPES[number]["key"];
type FlagKey = AutoKey | "isPublicElectronicCommsOp";

const SIZES: { v: EntitySize; label: string; range: string; zbmis: string; color: string }[] = [
  { v: "MICRO",  label: "Микро",  range: "< 10 вработени  ·  до €2М",           zbmis: "Не е опфатено со ЗБМИС",    color: "#64748b" },
  { v: "SMALL",  label: "Мало",   range: "10–49 вработени  ·  до €10М",          zbmis: "Не е опфатено со ЗБМИС",    color: "#64748b" },
  { v: "MEDIUM", label: "Средно", range: "50–249 вработени  ·  €10–50М приход",  zbmis: "Важен субјект — Член 8(2)", color: "#f59e0b" },
  { v: "LARGE",  label: "Големо", range: "250+ вработени  ·  €50М+ приход",      zbmis: "Суштински — Член 8(1) т.1", color: "#ef4444" },
];

const emptyFlags: Record<FlagKey, boolean> = {
  isPublicSector: false, isQualifiedTrustProvider: false, isTrustServiceProvider: false,
  isTldRegistry: false, isDnsProvider: false, isCriticalInfraOwner: false,
  isUniqueSectorProvider: false, isPublicSafetyImpact: false, isSystemicRisk: false,
  isCriticalForSector: false, isDomainRegistrar: false, isPublicElectronicCommsOp: false,
};

export default function ClassifyPage() {
  const router = useRouter();
  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [orgName, setOrgName]     = useState("");
  const [sectorId, setSectorId]   = useState("");
  const [size, setSize]           = useState<EntitySize | "">("");
  const [employees, setEmployees] = useState("");
  const [turnover,  setTurnover]  = useState("");
  const [balance,   setBalance]   = useState("");
  const [flags, setFlags]         = useState<Record<FlagKey, boolean>>(emptyFlags);

  const toggle = (key: FlagKey, val: boolean) =>
    setFlags(prev => ({ ...prev, [key]: val }));

  // Пресметај дали е auto-essential со тековните flags
  const autoResult = isAutoEssentialEntity({
    sectorId: "OTHER", size: "MICRO", employees: 0,
    annualTurnoverM: 0, annualBalanceSheetM: 0, ...flags,
  });
  const isAuto = autoResult.yes;

  const doClassify = () => {
    const result = classifyEntity({
      sectorId: sectorId || "OTHER",
      size: (size || "MICRO") as EntitySize,
      employees: Number(employees) || 0,
      annualTurnoverM: Number(turnover) || 0,
      annualBalanceSheetM: Number(balance) || 0,
      ...flags,
    });
    sessionStorage.setItem("classifyResult", JSON.stringify({ ...result, orgName }));
    router.push("/assessment/classify/result");
  };

  const steps = isAuto ? [1, 2] : [1, 2, 3];
  const stepLabels = ["Тип на субјект", "Сектор", "Големина"];

  return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-10">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative max-w-xl mx-auto">
        <Link href="/assessment"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-300 mb-10 tracking-wider uppercase transition-colors">
          ← Назад
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-mono text-blue-500 tracking-widest uppercase mb-3">
            ЗБМИС · Сл. весник бр. 135 · 4.7.2025
          </div>
          <h1 className="font-display text-4xl font-800 text-white leading-tight mb-2">
            Класификација<br />на субјект
          </h1>
          <p className="text-slate-500 text-sm">
            Член 4 и Член 8 — суштински и важни субјекти
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-700 border transition-all ${
                  step === s ? "bg-blue-600 border-blue-600 text-white" :
                  step > s   ? "bg-blue-600/20 border-blue-600/40 text-blue-400" :
                               "border-white/10 text-slate-600"
                }`}>
                  {step > s ? "✓" : s}
                </div>
                <span className={`text-xs font-mono transition-colors ${step === s ? "text-slate-300" : "text-slate-600"}`}>
                  {stepLabels[s - 1]}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px mx-3 transition-all ${step > s ? "bg-blue-600/40" : "bg-white/8"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ═══════════════ STEP 1 ═══════════════ */}
        {step === 1 && (
          <div className="space-y-4">

            {/* Org name */}
            <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                Назив на организацијата
              </label>
              <input
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="input"
                placeholder="пр. Енергетика АД Скопје"
                autoFocus
              />
            </div>

            {/* Auto-essential types */}
            <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <div className="mb-5">
                <div className="text-sm font-medium text-white mb-1">
                  Посебни категории субјекти
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  Овие субјекти се <span className="text-red-400 font-medium">суштински автоматски</span> — независно
                  од бројот на вработени, приход или биланс (Член 8(1) т.2, т.4, т.5, т.6 и Член 4(3)).
                </div>
              </div>

              <div className="space-y-1.5">
                {AUTO_TYPES.map(item => {
                  const checked = flags[item.key];
                  return (
                    <label key={item.key}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-white/5 hover:border-white/12 hover:bg-white/2"
                      }`}>
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                        checked ? "bg-red-600 border-red-600" : "border-white/20"
                      }`}>
                        {checked && <span className="text-white text-xs leading-none">✓</span>}
                      </div>
                      <input type="checkbox" checked={checked}
                        onChange={e => toggle(item.key, e.target.checked)}
                        className="sr-only" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-sm font-medium text-white">{item.label}</span>
                            <span className="ml-2 text-xs font-mono text-slate-600">{item.sublabel}</span>
                          </div>
                          {checked && (
                            <span className="flex-shrink-0 text-xs bg-red-600/15 text-red-300 border border-red-500/25 px-2 py-0.5 rounded-full font-mono">
                              СУШТИНСКИ
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {isAuto && (
                <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-red-300">Автоматска класификација</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Вашата организација е <strong className="text-white">СУШТИНСКИ СУБЈЕКТ независно од
                    нејзината големина</strong>. Нема потреба да внесувате број на вработени или финансиски
                    показатели. Притиснете Класифицирај.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => isAuto ? doClassify() : setStep(2)}
              disabled={!orgName.trim()}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-30">
              {isAuto ? "Класифицирај →" : "Продолжи →"}
            </button>
          </div>
        )}

        {/* ═══════════════ STEP 2 ═══════════════ */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                Сектор на дејност
              </label>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                16 области по Член 4(2) на ЗБМИС — законот се применува на средни и големи субјекти
              </p>
              <select
                value={sectorId}
                onChange={e => setSectorId(e.target.value)}
                className="input">
                <option value="">— Изберете сектор —</option>
                {sectors.map((s: any) => (
                  <optgroup key={s.id} label={s.name.mk}>
                    {s.subsectors?.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>{sub.name.mk}</option>
                    ))}
                  </optgroup>
                ))}
                <option value="OTHER">Друг сектор (надвор од Член 4(2))</option>
              </select>

              {/* Телеком — посебен случај Член 8(1) т.3 */}
              <div className="mt-4 p-4 rounded-xl border border-amber-500/15 bg-amber-500/4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                    flags.isPublicElectronicCommsOp ? "bg-amber-500 border-amber-500" : "border-white/20"
                  }`}>
                    {flags.isPublicElectronicCommsOp && <span className="text-white text-xs">✓</span>}
                  </div>
                  <input type="checkbox" checked={flags.isPublicElectronicCommsOp}
                    onChange={e => toggle("isPublicElectronicCommsOp", e.target.checked)}
                    className="sr-only" />
                  <div>
                    <div className="text-sm text-amber-200 font-medium">
                      Оператор/давател на јавни електронски комуникациски мрежи или услуги
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Член 8(1) т.3 + Член 4(3) т.1 — средни и големи телеком оператори се СУШТИНСКИ субјекти
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="text-xs text-slate-600 px-1 leading-relaxed">
              Финалната листа на суштински и важни субјекти ја утврдува Владата на предлог на
              Министерството за дигитална трансформација согласно Член 7 од ЗБМИС.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost px-5 py-3">← Назад</button>
              <button
                onClick={() => isAuto ? doClassify() : setStep(3)}
                disabled={!sectorId}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-30">
                {isAuto ? "Класифицирај →" : "Продолжи →"}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════ STEP 3 ═══════════════ */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Големина на организацијата
              </div>
              <div className="text-xs text-slate-500 mb-5">
                Согласно Закон за трговски друштва — просек за последните 2 фискални години
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SIZES.map(o => (
                  <button key={o.v} onClick={() => setSize(o.v)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      size === o.v
                        ? "border-blue-500/50 bg-blue-500/8"
                        : "border-white/6 bg-white/1 hover:border-white/12 hover:bg-white/3"
                    }`}>
                    <div className="font-display font-700 text-base text-white mb-1">{o.label}</div>
                    <div className="text-xs text-slate-500 mb-2 leading-snug">{o.range}</div>
                    <div className="text-xs font-mono" style={{ color: o.color }}>{o.zbmis}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
                Точни вредности <span className="text-slate-600 normal-case font-normal">(опционално)</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Вработени",          v: employees, fn: setEmployees, ph: "120"  },
                  { l: "Приход (М€)",        v: turnover,  fn: setTurnover,  ph: "15.5" },
                  { l: "Биланс (М€)",        v: balance,   fn: setBalance,   ph: "12"   },
                ].map(f => (
                  <div key={f.l}>
                    <div className="text-xs text-slate-500 mb-2">{f.l}</div>
                    <input type="number" value={f.v}
                      onChange={e => f.fn(e.target.value)}
                      placeholder={f.ph} className="input text-sm py-2.5" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost px-5 py-3">← Назад</button>
              <button onClick={doClassify} disabled={size === ""}
                className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-30">
                Класифицирај →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
