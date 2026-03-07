import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const stats = [
  { value:"12",  label:"Домени",    sub:"на проценка" },
  { value:"87+", label:"Контроли",  sub:"ЗБМИС + NIS2" },
  { value:"3",   label:"Јазици",    sub:"МК · EN · SQ" },
  { value:"100%",label:"Бесплатно", sub:"секогаш" },
];

const domains = [
  { id:"01", icon:"🏛️", title:"Governance & Risk",     titleMk:"Управување и ризици" },
  { id:"02", icon:"📦", title:"Asset Management",       titleMk:"Управување со средства" },
  { id:"03", icon:"🔐", title:"Access Control",         titleMk:"Контрола на пристап" },
  { id:"04", icon:"🔒", title:"Cryptography",           titleMk:"Криптографија" },
  { id:"05", icon:"🌐", title:"Network Security",       titleMk:"Мрежна безбедност" },
  { id:"06", icon:"🚨", title:"Incident Management",    titleMk:"Управување со инциденти" },
  { id:"07", icon:"♻️", title:"Business Continuity",    titleMk:"Континуитет" },
  { id:"08", icon:"🔗", title:"Supply Chain",           titleMk:"Синџир на снабдување" },
  { id:"09", icon:"💻", title:"Secure Development",     titleMk:"Безбеден развој" },
  { id:"10", icon:"👥", title:"HR Security",            titleMk:"HR Безбедност" },
  { id:"11", icon:"🏢", title:"Physical Security",      titleMk:"Физичка безбедност" },
  { id:"12", icon:"📋", title:"Compliance & Audit",     titleMk:"Усогласеност" },
];

const tracks = [
  {
    annex:"Анекс I", ac:"text-red-400 bg-red-500/10 border-red-500/20 badge",
    icon:"🏛️", bc:"hover:border-red-500/25 border-white/5",
    title:"Суштински субјекти",
    desc:"Организации во критична инфраструктура — енергетика, транспорт, здравство, банкарство, дигитална инфраструктура.",
    features:[
      "12 домени со 87+ детални контроли",
      "Технички и организациски контроли",
      "Законски обврски за известување до MKD-CIRT",
      "Пондерирано бодирање по критичност",
      "Извештај со план за подобрување",
    ],
    penalty:"до 10.000.000 EUR или 2% промет",
    penaltyColor:"text-red-400",
    cta:"Започни со БМИС идентификација", ctaDirect:"Премини директно",
    href:"/assessment",
  },
  {
    annex:"Анекс II", ac:"text-amber-400 bg-amber-500/10 border-amber-500/20 badge",
    icon:"🏢", bc:"hover:border-amber-500/25 border-white/5",
    title:"Важни субјекти",
    desc:"Пошта, управување со отпад, производство, дигитални провајдери и истражувачки организации.",
    features:[
      "12 домени прилагодени за Анекс II",
      "Пропорционални безбедносни мерки",
      "Реактивен надзор (само по инцидент)",
      "Постепена патека за усогласеност",
      "PDF извештај за регулатор",
    ],
    penalty:"до 7.000.000 EUR или 1.4% промет",
    penaltyColor:"text-amber-400",
    cta:"Започни БМИС проценка", ctaDirect:"Директна проценка",
    href:"/assessment",
  },
  {
    annex:"ENISA ММСП", ac:"text-green-400 bg-green-500/10 border-green-500/20 badge",
    icon:"🏪", bc:"hover:border-green-500/25 border-white/5",
    title:"ММСП",
    desc:"Микро, мали и средни претпријатија кои сакаат да ја подобрат сајбер-безбедноста.",
    features:[
      "6 поедноставени домени",
      "3 нивоа: Основно / Напредно / Експертско",
      "Практични препораки од ENISA",
      "Без технички предзнаења потребни",
      "Брза проценка за 15-20 минути",
    ],
    penalty:"Доброволна усогласеност",
    penaltyColor:"text-green-400",
    cta:"Започни ММСП проценка", ctaDirect:"",
    href:"/assessment",
  },
];

const steps = [
  { n:"01", icon:"🎯", title:"Определување на статус", desc:"Одговорете на прашања за вашиот сектор и големина. Алатката автоматски ве класифицира како Суштински, Важен субјект или ММСП." },
  { n:"02", icon:"📋", title:"Проценка на усогласеност", desc:"Добивате детален контролен список приспособен на вашиот статус — 12 домени за субјекти опфатени со ЗБМИС или 6 домени за ММСП." },
  { n:"03", icon:"📊", title:"Анализа на резултати", desc:"Визуелен приказ на усогласеноста, идентификација на недостатоци подредени по критичност и индивидуален план за подобрување со PDF извоз." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080f1e]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/5  w-[600px] h-[600px] bg-blue-700/10  rounded-full blur-[130px] animate-pulse-orb" />
          <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[110px] animate-pulse-orb delay-3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-blue-500/4 rounded-full animate-spin-slow" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="opacity-0 animate-fade-up inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-blue-300 mb-8 border border-blue-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" style={{animation:"pulse 2s infinite"}} />
            Официјална алатка на MKD-CIRT · Република Северна Македонија · v13.0
          </div>

          {/* Title */}
          <h1 className="opacity-0 animate-fade-up delay-1 font-display leading-[1.05] mb-6"
              style={{fontSize:"clamp(2.8rem,7.5vw,5.5rem)",fontWeight:800}}>
            <span className="text-white">Алатка за </span>
            <span className="gradient-text">самооценување</span>
            <br />
            <span className="text-slate-300" style={{fontSize:"60%",fontWeight:600}}>
              Закон за БМИС / NIS2
            </span>
          </h1>

          <p className="opacity-0 animate-fade-up delay-2 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Сеопфатна алатка за самостојна проценка на усогласеноста со{" "}
            <span className="text-slate-200 font-medium">Законот за безбедност на мрежни и информациски системи</span>{" "}
            (ЗБМИС / NIS2), со поддршка за ММСП базирана на ENISA препораки.
          </p>

          <div className="opacity-0 animate-fade-up delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/assessment" className="btn-primary text-base px-8 py-4 glow-blue">
              Започни проценка →
            </Link>
            <a href="#how" className="btn-ghost text-base px-8 py-4">
              Дознај повеќе ↓
            </a>
          </div>

          {/* Stats */}
          <div className="opacity-0 animate-fade-up delay-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center border border-white/5">
                <div className="font-display text-3xl font-800 text-white mb-1">{s.value}</div>
                <div className="text-xs font-medium text-slate-300">{s.label}</div>
                <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-blue-500 tracking-widest uppercase mb-3">// процес</div>
            <h2 className="font-display text-4xl font-700 text-white mb-4">Како функционира проценката?</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">Три фази — од идентификување на вашиот статус до добивање на детален план за подобрување</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="glass glass-hover rounded-2xl p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 border border-white/5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl mb-5">{s.icon}</div>
                <div className="font-mono text-xs text-blue-500 mb-2 uppercase tracking-widest">Фаза {s.n}</div>
                <h3 className="font-display font-700 text-white text-lg mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRACKS ── */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-blue-500 tracking-widest uppercase mb-3">// патеки</div>
            <h2 className="font-display text-4xl font-700 text-white mb-4">За кого е наменета?</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">Изберете ја патеката соодветна за вашата организација</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tracks.map(t => (
              <div key={t.title}
                className={`glass rounded-2xl p-8 flex flex-col border ${t.bc} transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl">{t.icon}</span>
                  <span className={t.ac}>{t.annex}</span>
                </div>
                <h3 className="font-display font-700 text-white text-xl mb-3">{t.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{t.desc}</p>
                <ul className="space-y-2.5 mb-5 flex-1">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Penalty */}
                <div className={`text-xs ${t.penaltyColor} glass rounded-lg px-3 py-2 border border-white/5 mb-5`}>
                  ⚠️ Санкции: {t.penalty}
                </div>
                <div className="space-y-2">
                  <Link href={t.href} className="btn-primary w-full justify-center text-sm py-3">{t.cta} →</Link>
                  {t.ctaDirect && (
                    <Link href={t.href} className="btn-ghost w-full text-center text-sm py-2.5">{t.ctaDirect}</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS ── */}
      <section id="domains" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-blue-500 tracking-widest uppercase mb-3">// покриеност</div>
            <h2 className="font-display text-4xl font-700 text-white mb-4">12 домени на проценка</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">Сеопфатна проценка базирана на NIS2, ISO 27001, ENISA насоки и ЗБМИС</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {domains.map((d, i) => (
              <div key={d.id} className="glass glass-hover rounded-xl p-5 group transition-all duration-200 hover:-translate-y-0.5 border border-white/5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{d.icon}</span>
                  <span className="font-mono text-xs text-blue-500/70">D{d.id}</span>
                </div>
                <div className="text-sm font-medium text-white leading-snug">{d.titleMk}</div>
                <div className="text-xs text-slate-600 mt-0.5">{d.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NIS2 CONTEXT ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 border border-blue-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="font-mono text-xs text-blue-400 mb-3 uppercase tracking-widest">// законска рамка</div>
                <h3 className="font-display text-3xl font-700 text-white mb-4">Закон за БМИС / NIS2</h3>
                <p className="text-slate-400 leading-relaxed mb-4 text-sm">
                  Законот за безбедност на мрежни и информациски системи (ЗБМИС) ги транспонира барањата на NIS2 директивата во националното законодавство на Република Северна Македонија.
                </p>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                  Контролниот список опфаќа организациски (политики и процедури), технички (софтверски и хардверски) и физички контроли (заштита на опрема и објекти).
                </p>
                <div className="flex flex-wrap gap-2">
                  {["NIS2 Directive","ISO 27001","ENISA Guidelines","ЗБМИС","CIS Controls"].map(t=>(
                    <span key={t} className="badge badge-done">{t}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { icon:"🔴", title:"Суштински субјекти (Анекс I)",  desc:"Задолжителна регистрација, строг надзор, до €10М санкции" },
                  { icon:"🟡", title:"Важни субјекти (Анекс II)",      desc:"Пропорционални мерки, реактивен надзор, до €7М санкции" },
                  { icon:"🟢", title:"ММСП",                          desc:"Доброволна проценка со ENISA поддршка" },
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-medium text-white text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
                <div className="glass rounded-xl p-4 border border-amber-500/15">
                  <div className="text-xs text-amber-300/80 leading-relaxed">
                    ⚠️ По усвојување на подзаконските акти поврзани со ЗБМИС можни се измени во алатката, домените и контролите.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 md:p-16 border border-blue-500/15 relative overflow-hidden glow-blue">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-indigo-600/5 pointer-events-none" />
            <div className="relative">
              <div className="font-mono text-xs text-blue-400 mb-4 uppercase tracking-widest">// започнете денес</div>
              <h2 className="font-display text-4xl md:text-5xl font-800 text-white mb-4">
                Проверете ја <span className="gradient-text">усогласеноста</span>
              </h2>
              <p className="text-slate-400 mb-4 max-w-md mx-auto leading-relaxed">
                Бесплатна, анонимна проценка без инсталација. Резултати за помалку од 30 минути.
              </p>
              <p className="text-xs text-slate-600 mb-10">
                Продолжи со зачуван прогрес: <span className="text-slate-500">Прикачете претходно зачуван JSON фајл во алатката.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/assessment" className="btn-primary text-lg px-10 py-4 glow-blue">
                  Започни сега →
                </Link>
                <Link href="/register" className="btn-ghost text-lg px-10 py-4">
                  Создај сметка
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-display font-bold text-sm text-white">MK</div>
                <div>
                  <div className="font-display font-700 text-white text-sm">MKD-CIRT</div>
                  <div className="text-xs text-blue-400 tracking-widest uppercase">BMIS Platform v13.0</div>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Официјална алатка на MKD-CIRT за самооценување на усогласеноста со ЗБМИС/NIS2. Бесплатна и анонимна.
              </p>
            </div>
            <div>
              <div className="font-display font-600 text-slate-300 text-sm mb-4">Платформа</div>
              <div className="space-y-2">
                {[{l:"Почетна",href:"/"},{l:"Проценка",href:"/assessment"},{l:"Регистрација",href:"/register"},{l:"Најава",href:"/login"}].map(l=>(
                  <Link key={l.l} href={l.href} className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">{l.l}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="font-display font-600 text-slate-300 text-sm mb-4">Ресурси</div>
              <div className="space-y-2">
                {["ЗБМИС","NIS2 Директива","ENISA Guidelines","ISO 27001","CIS Controls"].map(l=>(
                  <div key={l} className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              © 2025 MKD-CIRT · Оваа алатка не претставува правен совет · v13.0
            </div>
            <div className="flex gap-6">
              {["Приватност","Услови","cirt.mk"].map(l=>(
                <span key={l} className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
