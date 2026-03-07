import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const stats = [
  { value:"12",   label:"Домени",    sub:"на проценка" },
  { value:"87",   label:"Контроли",  sub:"BMIS + NIS2" },
  { value:"3",    label:"Јазици",    sub:"МК · EN · SQ" },
  { value:"100%", label:"Бесплатно", sub:"без регистрација" },
];

const domains = [
  { id:"01", title:"Governance & Risk",   icon:"🏛️" },
  { id:"02", title:"Asset Management",    icon:"📦" },
  { id:"03", title:"Access Control",      icon:"🔐" },
  { id:"04", title:"Cryptography",        icon:"🔒" },
  { id:"05", title:"Network Security",    icon:"🌐" },
  { id:"06", title:"Incident Response",   icon:"🚨" },
  { id:"07", title:"Business Continuity", icon:"♻️" },
  { id:"08", title:"Supply Chain",        icon:"🔗" },
  { id:"09", title:"Secure Development",  icon:"💻" },
  { id:"10", title:"HR Security",         icon:"👥" },
  { id:"11", title:"Physical Security",   icon:"🏢" },
  { id:"12", title:"Compliance & Audit",  icon:"📋" },
];

const tracks = [
  {
    annex:"Анекс I", ac:"text-red-400 bg-red-500/10 border-red-500/20",
    icon:"🏛️", bc:"hover:border-red-500/25",
    title:"Суштински субјекти",
    desc:"Организации во критична инфраструктура — енергетика, транспорт, здравство, банкарство, дигитална инфраструктура.",
    features:["12 домени, 87 детални контроли","Технички и организациски мерки","Законско известување до MKD-CIRT","Пондерирано бодирање по критичност"],
    cta:"Започни BMIS проценка", href:"/assessment",
  },
  {
    annex:"Анекс II", ac:"text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon:"🏢", bc:"hover:border-amber-500/25",
    title:"Важни субјекти",
    desc:"Пошта, управување со отпад, производство, дигитални провајдери и истражувачки организации.",
    features:["12 домени прилагодени за Анекс II","Пропорционални безбедносни мерки","Постепена патека за усогласеност","Извештај за регулаторна усогласеност"],
    cta:"Започни BMIS проценка", href:"/assessment",
  },
  {
    annex:"ENISA", ac:"text-green-400 bg-green-500/10 border-green-500/20",
    icon:"🏪", bc:"hover:border-green-500/25",
    title:"ММСП",
    desc:"Микро, мали и средни претпријатија кои сакаат да ја подобрат сајбер-безбедноста.",
    features:["6 поедноставени домени","3 нивоа: Основно / Напредно / Експертско","Практични препораки од ENISA","Без технички предзнаења"],
    cta:"Започни ММСП проценка", href:"/assessment",
  },
];

const steps = [
  { n:"01", title:"Определи го статусот", desc:"Одговори на прашања за секторот и големината за да утврдиме дали си Суштински или Важен субјект.", icon:"🎯" },
  { n:"02", title:"Направи самооценување", desc:"Добиј детален контролен список за 12 домени или поедноставена проценка за ММСП.", icon:"📋" },
  { n:"03", title:"Анализирај ги резултатите", desc:"Прегледај ја усогласеноста визуелно, идентификувај недостатоци и добиј план за подобрување.", icon:"📊" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080f1e]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-700/12 rounded-full blur-[120px] animate-pulse-orb" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse-orb delay-3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/5 rounded-full animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400/4 rounded-full" style={{animation:"spinSlow 35s linear infinite reverse"}} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="opacity-0 animate-fade-up inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-blue-300 mb-8 border border-blue-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full" style={{animation:"pulse 2s infinite"}} />
            Официјална алатка на MKD-CIRT · Република Северна Македонија · v1.0
          </div>

          <h1 className="opacity-0 animate-fade-up delay-1 font-display leading-tight mb-6" style={{fontSize:"clamp(3rem,8vw,6rem)",fontWeight:800}}>
            <span className="text-white">BMIS </span>
            <span className="gradient-text text-glow">Самооценување</span>
          </h1>

          <p className="opacity-0 animate-fade-up delay-2 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Бесплатна алатка за определување на статусот и самооценување на усогласеноста со{" "}
            <span className="text-slate-200 font-medium">Законот за безбедност на мрежни и информациски системи</span>{" "}
            (ЗБМИС / NIS2).
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
                <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
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
            <h2 className="font-display text-4xl font-700 text-white">Како функционира?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent hidden md:block" />
            {steps.map((s, i) => (
              <div key={s.n} className="glass glass-hover rounded-2xl p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl mb-5">{s.icon}</div>
                <div className="font-mono text-xs text-blue-500 mb-2">ФАЗА {s.n}</div>
                <h3 className="font-display font-600 text-white text-lg mb-3">{s.title}</h3>
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
            <h2 className="font-display text-4xl font-700 text-white">За кого е наменета?</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Изберете ја патеката соодветна за вашата организација</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tracks.map(t => (
              <div key={t.title} className={`glass rounded-2xl p-8 flex flex-col border border-white/5 ${t.bc} transition-all duration-300 hover:-translate-y-1 group`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl">{t.icon}</span>
                  <span className={`badge ${t.ac}`}>{t.annex}</span>
                </div>
                <h3 className="font-display font-700 text-white text-xl mb-3">{t.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{t.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={t.href} className="btn-primary w-full justify-center text-sm py-3">
                  {t.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS GRID ── */}
      <section id="domains" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-xs text-blue-500 tracking-widest uppercase mb-3">// покриеност</div>
            <h2 className="font-display text-4xl font-700 text-white">12 домени на проценка</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
              Базирано на NIS2, ISO 27001, ENISA насоки и Законот за БМИС
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {domains.map((d, i) => (
              <div key={d.id} className="glass glass-hover rounded-xl p-5 group cursor-default transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{d.icon}</span>
                  <span className="font-mono text-xs text-blue-500/70">D{d.id}</span>
                </div>
                <div className="text-sm font-medium text-white leading-snug">{d.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NIS2 INFO BANNER ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 border border-blue-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="font-mono text-xs text-blue-400 mb-3 uppercase tracking-widest">// законска рамка</div>
                <h3 className="font-display text-3xl font-700 text-white mb-4">Закон за БМИС / NIS2</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Законот за безбедност на мрежни и информациски системи (ЗБМИС) ги транспонира барањата на европската NIS2 директива во националното законодавство на Република Северна Македонија.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="badge badge-done">NIS2 Directive</span>
                  <span className="badge badge-done">ISO 27001</span>
                  <span className="badge badge-done">ENISA Guidelines</span>
                  <span className="badge badge-done">ЗБМИС</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon:"🔴", title:"Суштински субјекти", desc:"Задолжителна регистрација и проценка" },
                  { icon:"🟡", title:"Важни субјекти",    desc:"Усогласеност со основни мерки" },
                  { icon:"🟢", title:"ММСП",              desc:"Доброволна проценка со ENISA поддршка" },
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-medium text-white text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
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
                Проверете ја вашата <span className="gradient-text">усогласеност</span>
              </h2>
              <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                Бесплатна, анонимна проценка. Без инсталација. Резултати за помалку од 30 минути.
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
                  <div className="text-xs text-blue-400 tracking-widest uppercase">BMIS Platform</div>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Официјална алатка на MKD-CIRT за самооценување на усогласеноста со ЗБМИС/NIS2.
              </p>
            </div>
            <div>
              <div className="font-display font-600 text-slate-300 text-sm mb-4">Платформа</div>
              <div className="space-y-2">
                {["Почетна","Проценка","Регистрација","Најава"].map(l => (
                  <div key={l} className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-display font-600 text-slate-300 text-sm mb-4">Ресурси</div>
              <div className="space-y-2">
                {["ЗБМИС","NIS2 Директива","ENISA Guidelines","ISO 27001"].map(l => (
                  <div key={l} className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              © 2025 MKD-CIRT · Оваа алатка не претставува правен совет
            </div>
            <div className="flex gap-6">
              {["Приватност","Услови за користење","cirt.mk"].map(l => (
                <span key={l} className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
