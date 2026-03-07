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

// ── Субјекти кои се АВТОМАТСКИ СУШТИНСКИ без разлика на големина ─────────────
const AUTO_ESSENTIAL_TYPES = [
  {
    key: "isPublicSector",
    icon: "🏛️",
    label: "Институција на јавниот сектор",
    desc: "Собрание, Влада, министерство, општина, суд, самостојни органи",
    basis: "Член 8(1) т.4 и Член 4(1)",
    color: "blue",
  },
  {
    key: "isQualifiedTrustProvider",
    icon: "🔐",
    label: "Давател на квалификувани доверливи услуги",
    desc: "Квалификувани електронски потписи, печати, временски жигови итн.",
    basis: "Член 8(1) т.2",
    color: "red",
  },
  {
    key: "isTldRegistry",
    icon: "📍",
    label: "Регистар на врвни домени (.mk / .мкд)",
    desc: "Субјектот кој го води Единствениот регистар на врвни домени",
    basis: "Член 8(1) т.2",
    color: "red",
  },
  {
    key: "isDnsProvider",
    icon: "🌐",
    label: "Давател на ДНС услуги",
    desc: "Јавно достапни рекурзивни или авторитативни DNS услуги",
    basis: "Член 8(1) т.2",
    color: "red",
  },
  {
    key: "isTrustServiceProvider",
    icon: "✅",
    label: "Давател на доверливи услуги",
    desc: "Доверливи услуги согласно прописите за електронска идентификација",
    basis: "Член 8(1) т.5 — Член 4(3) т.2",
    color: "red",
  },
  {
    key: "isCriticalInfraOwner",
    icon: "⚡",
    label: "Сопственик/оператор на критична инфраструктура",
    desc: "Утврден со закон согласно прописите за критична инфраструктура",
    basis: "Член 8(1) т.6",
    color: "red",
  },
  {
    key: "isUniqueSectorProvider",
    icon: "🎯",
    label: "Единствен давател на суштинска услуга во РСМ",
    desc: "Единствен давател на услуга суштинска за одржување на општествени/економски активности",
    basis: "Член 4(3) т.5",
    color: "red",
  },
  {
    key: "isPublicSafetyImpact",
    icon: "🛡️",
    label: "Значително влијание врз јавната безбедност или јавното здравје",
    desc: "Услугата на субјектот има значително влијание врз јавната безбедност, заштита или здравје",
    basis: "Член 4(3) т.6",
    color: "red",
  },
  {
    key: "isSystemicRisk",
    icon: "🔗",
    label: "Субјект кој предизвикува значителни системски ризици",
    desc: "Нарушувањето може да има прекугранично влијание — значителни системски ризици",
    basis: "Член 4(3) т.7",
    color: "red",
  },
  {
    key: "isCriticalForSector",
    icon: "🏗️",
    label: "Критичен субјект за одредена област или тип услуга",
    desc: "Поради посебна важност, критичен за одредена област или меѓусебно зависни области",
    basis: "Член 4(3) т.8",
    color: "red",
  },
  {
    key: "isDomainRegistrar",
    icon: "📋",
    label: "Субјект кој обезбедува услуги за регистрација на имиња на домени",
    desc: "Регистратор или застапник кој дава услуги за регистрација на имиња на домени",
    basis: "Член 4(3) т.10",
    color: "red",
  },
] as const;

type FlagKey = typeof AUTO_ESSENTIAL_TYPES[number]["key"] | "isPublicElectronicCommsOp";

const SIZES = [
  { v: "MICRO" as EntitySize, l: "Микро", d: "< 10 вработени, до €2М", sub: "Не е опфатено со ЗБМИС", c: "text-slate-400" },
  { v: "SMALL" as EntitySize, l: "Мало",  d: "10–49 вработени, до €10М", sub: "Не е опфатено со ЗБМИС", c: "text-slate-400" },
  { v: "MEDIUM" as EntitySize,l: "Средно",d: "50–249 вработени ИЛИ €10–50М", sub: "→ Важен субјект (Член 8(2))", c: "text-amber-400" },
  { v: "LARGE" as EntitySize, l: "Големо",d: "250+ вработени ИЛИ €50М+ ИЛИ €43М+ биланс", sub: "→ Суштински субјект (Член 8(1) т.1)", c: "text-red-400" },
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
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
    isPublicSector: false,
    isQualifiedTrustProvider: false,
    isTldRegistry: false,
    isDnsProvider: false,
    isTrustServiceProvider: false,
    isCriticalInfraOwner: false,
    isUniqueSectorProvider: false,
    isPublicSafetyImpact: false,
    isSystemicRisk: false,
    isCriticalForSector: false,
    isDomainRegistrar: false,
    isPublicElectronicCommsOp: false,
  });

  const toggleFlag = (key: FlagKey, val: boolean) =>
    setFlags(prev => ({ ...prev, [key]: val }));

  // Проверка дали е веќе автоматски суштински (без да треба чекор 3)
  const autoCheck = isAutoEssentialEntity({
    sectorId: "OTHER", size: "MICRO", employees: 0,
    annualTurnoverM: 0, annualBalanceSheetM: 0, ...flags,
  });
  const skipSizeStep = autoCheck.yes;

  const handleClassify = () => {
    const input: ClassificationInput = {
      sectorId: sectorId || "OTHER",
      size: (size || "MICRO") as EntitySize,
      employees: Number(employees) || 0,
      annualTurnoverM: Number(turnover) || 0,
      annualBalanceSheetM: Number(balance) || 0,
      ...flags,
    };
    const result = classifyEntity(input);
    sessionStorage.setItem("classifyResult", JSON.stringify({ ...result, orgName }));
    router.push("/assessment/classify/result");
  };

  // Ако е автоматски суштински, прескочи Step 3 и директно класифицирај
  const handleStep2Next = () => {
    if (skipSizeStep) {
      handleClassify();
    } else {
      setStep(3);
    }
  };

  const step2Valid = sectorId !== "" || skipSizeStep;

  return (
    <div className="min-h-screen bg-[#080f1e] px-4 py-12">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative max-w-2xl mx-auto">

        <Link href="/assessment" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">← Назад</Link>

        <div className="mb-8">
          <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-widest">// фаза 01 — идентификација</div>
          <h1 className="font-display text-3xl font-700 text-white mb-2">Определување на статус</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Класификација строго по <span className="text-slate-200">Член 4 и Член 8 од ЗБМИС</span>
            {" "}(Сл. весник бр. 135, 4.7.2025)
          </p>
        </div>

        {/* Progress — само 2 чекори ако е auto-essential */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, skipSizeStep ? null : 3].filter(Boolean).map((n, idx, arr) => (
            <div key={n} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-700 transition-all ${step >= (n as number) ? "bg-blue-600 text-white" : "glass border border-white/10 text-slate-500"}`}>
                {step > (n as number) ? "✓" : n}
              </div>
              {idx < arr.length - 1 && <div className={`h-px w-10 transition-all ${step > (n as number) ? "bg-blue-600" : "bg-white/10"}`} />}
            </div>
          ))}
          <span className="text-xs text-slate-500 ml-2">
            {step === 1 ? "Тип на субјект" : step === 2 ? "Сектор на дејност" : "Големина"}
          </span>
        </div>

        {/* ── STEP 1: Тип на субјект ── */}
        {step === 1 && (
          <div className="space-y-5">

            <div className="glass-md rounded-2xl p-6 border border-white/8">
              <label className="block text-sm font-medium text-white mb-3">Назив на организацијата</label>
              <input value={orgName} onChange={e => setOrgName(e.target.value)}
                className="input" placeholder="пр. Енергетика АД Скопје" />
            </div>

            <div className="glass-md rounded-2xl p-6 border border-white/8">
              <div className="text-sm font-medium text-white mb-1">
                Дали вашата организација спаѓа во некоја од следните категории?
              </div>
              <div className="text-xs text-slate-400 mb-1 leading-relaxed">
                Овие субјекти се <span className="text-red-400 font-medium">автоматски СУШТИНСКИ</span> согласно Член 8(1) т.2, т.4, т.5, т.6 —
                {" "}<span className="text-white">независно од бројот на вработени, приходот или билансот</span>.
              </div>
              <div className="text-xs text-slate-500 mb-5">
                Доколку вашата организација спаѓа во некоја категорија, нема да биде потребно да ја внесувате големината.
              </div>

              <div className="space-y-2.5">
                {AUTO_ESSENTIAL_TYPES.map(item => (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      flags[item.key as FlagKey]
                        ? "border-red-500/40 bg-red-500/6"
                        : "border-white/8 glass hover:border-white/15"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={flags[item.key as FlagKey]}
                      onChange={e => toggleFlag(item.key as FlagKey, e.target.checked)}
                      className="mt-0.5 accent-red-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="text-sm font-medium text-white">{item.label}</span>
                        {flags[item.key as FlagKey] && (
                          <span className="ml-auto text-xs bg-red-600/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-mono flex-shrink-0">
                            AUTO СУШТИНСКИ
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                      <div className="text-xs text-slate-600 mt-0.5 font-mono">{item.basis}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Auto-essential banner */}
              {skipSizeStep && (
                <div className="mt-5 p-4 rounded-xl border border-red-500/30 bg-red-500/8">
                  <div className="flex items-center gap-2 text-sm text-red-300 font-medium mb-1">
                    <span>🔴</span> Автоматска класификација: СУШТИНСКИ СУБЈЕКТ
                  </div>
                  <div className="text-xs text-slate-400">
                    Вашата организација е идентификувана во категорија која е суштинска <strong className="text-white">независно од нејзината големина</strong>.
                    Нема да биде потребно да внесувате број на вработени или приход. Одете на следниот чекор.
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => skipSizeStep ? handleClassify() : setStep(2)} disabled={!orgName.trim()}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-40">
              {skipSizeStep ? "Класифицирај →" : "Продолжи →"}
            </button>
          </div>
        )}

        {/* ── STEP 2: Сектор ── */}
        {step === 2 && (
          <div className="space-y-5">

            {skipSizeStep ? (
              <div className="glass-md rounded-2xl p-6 border border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🔴</span>
                  <div>
                    <div className="text-sm font-medium text-red-300">Автоматски СУШТИНСКИ субјект</div>
                    <div className="text-xs text-slate-500 mt-0.5">Класификацијата не зависи од секторот или големината</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Вашата организација е во категорија дефинирана со Член 8(1) на ЗБМИС која автоматски носи статус СУШТИНСКИ СУБЈЕКТ.
                  Изборот на сектор е опционален — само за евидентирање.
                </p>
              </div>
            ) : (
              <div className="glass-md rounded-2xl p-6 border border-white/8">
                <label className="block text-sm font-medium text-white mb-1">Сектор на дејност</label>
                <p className="text-xs text-slate-500 mb-4">
                  16 области по Член 4(2) на ЗБМИС — за средни и големи субјекти
                </p>
                <select value={sectorId} onChange={e => setSectorId(e.target.value)} className="input">
                  <option value="">-- Изберете сектор --</option>
                  {sectors.map(s => (
                    <optgroup key={s.id} label={s.name.mk}>
                      {s.subsectors?.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name.mk}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="OTHER">Друг сектор (надвор од Член 4(2))</option>
                </select>

                {/* Телеком — среден + голем е суштински */}
                {(sectorId.includes("digital") || sectorId.includes("telecom") || sectorId.includes("comm")) && (
                  <label className="flex items-start gap-3 mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 cursor-pointer">
                    <input type="checkbox" checked={flags.isPublicElectronicCommsOp}
                      onChange={e => toggleFlag("isPublicElectronicCommsOp", e.target.checked)}
                      className="mt-0.5 accent-amber-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-amber-200">Оператор/давател на јавни електронски комуникациски мрежи или услуги</div>
                      <div className="text-xs text-slate-500 mt-0.5">Член 8(1) т.3 — средните и големите телеком оператори се СУШТИНСКИ субјекти</div>
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* Optional sector for auto-essential */}
            {skipSizeStep && (
              <div className="glass rounded-xl p-4 border border-white/8">
                <label className="block text-xs text-slate-400 mb-2">Сектор (опционално — само за евиденција)</label>
                <select value={sectorId} onChange={e => setSectorId(e.target.value)} className="input text-sm">
                  <option value="">-- Не е применливо --</option>
                  {sectors.map(s => (
                    <optgroup key={s.id} label={s.name.mk}>
                      {s.subsectors?.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name.mk}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            <div className="glass rounded-xl p-4 border border-white/5 text-xs text-slate-500 leading-relaxed">
              📜 Класификацијата е индикативна. Финалната листа ја утврдува Владата на предлог на МДТ согласно Член 7 од ЗБМИС.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3">← Назад</button>
              <button onClick={handleStep2Next} disabled={!step2Valid}
                className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-40">
                {skipSizeStep ? "Класифицирај →" : "Продолжи →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Големина (само ако НЕ е auto-essential) ── */}
        {step === 3 && !skipSizeStep && (
          <div className="space-y-5">
            <div className="glass-md rounded-2xl p-6 border border-white/8">
              <div className="text-sm font-medium text-white mb-1">Големина на организацијата</div>
              <div className="text-xs text-slate-500 mb-4">
                Согласно Закон за трговски друштва — просек за последните 2 фискални години
              </div>
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
              <div className="text-sm font-medium text-white mb-4">
                Точни вредности <span className="text-slate-500 font-normal">(опционално — за прецизна класификација)</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { l: "Вработени",            v: employees, fn: setEmployees, ph: "пр. 120" },
                  { l: "Годишен приход (М€)",  v: turnover,  fn: setTurnover,  ph: "пр. 15.5" },
                  { l: "Биланс на состојба (М€)", v: balance, fn: setBalance, ph: "пр. 12" },
                ].map(f => (
                  <div key={f.l}>
                    <div className="text-xs text-slate-400 mb-2">{f.l}</div>
                    <input type="number" value={f.v} onChange={e => f.fn(e.target.value)}
                      placeholder={f.ph} className="input text-sm py-2.5" />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-white/5 text-xs text-slate-500 leading-relaxed">
              📜 Класификацијата е индикативна. Финалната листа ја утврдува Владата на предлог на МДТ согласно Член 7 од ЗБМИС (Сл. весник бр. 135, 4.7.2025).
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3">← Назад</button>
              <button onClick={handleClassify} disabled={size === ""}
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
