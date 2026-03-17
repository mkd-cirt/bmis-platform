import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const stats = [
  { value:"12",  label:"Домени",   sub:"безбедносни области" },
  { value:"90",  label:"Контроли", sub:"ЗБМИС / NIS2" },
  { value:"3",   label:"Јазици",   sub:"МК · EN · SQ" },
];

const domains = [
  { id:"01", abbr:"GV", title:"Governance & Risk",     titleMk:"Управување и ризици" },
  { id:"02", abbr:"AM", title:"Asset Management",       titleMk:"Управување со средства" },
  { id:"03", abbr:"AC", title:"Access Control",         titleMk:"Контрола на пристап" },
  { id:"04", abbr:"CR", title:"Cryptography",           titleMk:"Криптографија" },
  { id:"05", abbr:"NS", title:"Network Security",       titleMk:"Мрежна безбедност" },
  { id:"06", abbr:"IM", title:"Incident Management",    titleMk:"Управување со инциденти" },
  { id:"07", abbr:"BC", title:"Business Continuity",    titleMk:"Континуитет на операции" },
  { id:"08", abbr:"SC", title:"Supply Chain",           titleMk:"Синџир на снабдување" },
  { id:"09", abbr:"SD", title:"Secure Development",     titleMk:"Безбеден развој" },
  { id:"10", abbr:"HR", title:"HR Security",            titleMk:"Безбедност на HR" },
  { id:"11", abbr:"PS", title:"Physical Security",      titleMk:"Физичка безбедност" },
  { id:"12", abbr:"CA", title:"Compliance & Audit",     titleMk:"Усогласеност и ревизија" },
];

const entityTypes = [
  {
    label:"Суштински субјекти",
    annex:"Анекс I",
    color:"text-red-400", borderColor:"border-red-500/15", bgColor:"bg-red-500/5",
    dotColor:"bg-red-400",
    desc:"Енергетика, транспорт, здравство, банкарство, дигитална инфраструктура, јавна администрација",
    sanctions:"до €10.000.000 или 2% од годишниот промет",
    deadline:"31 декември 2026",
  },
  {
    label:"Важни субјекти",
    annex:"Анекс II",
    color:"text-amber-400", borderColor:"border-amber-500/15", bgColor:"bg-amber-500/5",
    dotColor:"bg-amber-400",
    desc:"Поштенски услуги, управување со отпад, производство, хемикалии, храна, дигитални провајдери",
    sanctions:"до €7.000.000 или 1.4% од годишниот промет",
    deadline:"31 декември 2026",
  },
  {
    label:"ММСП",
    annex:"ENISA",
    color:"text-emerald-400", borderColor:"border-emerald-500/15", bgColor:"bg-emerald-500/5",
    dotColor:"bg-emerald-400",
    desc:"Микро, мали и средни претпријатија — доброволна проценка базирана на ENISA препораки",
    sanctions:"Доброволна усогласеност",
    deadline:"Нема законски рок",
  },
];

const steps = [
  { n:"01", title:"Класификација",       desc:"Одговорете на прашања за вашиот сектор, големина и тип. Алатката автоматски ве класифицира согласно ЗБМИС Чл.8." },
  { n:"02", title:"Проценка",             desc:"Детален контролен список приспособен на вашиот статус — 12 домени за опфатени субјекти или 6 домени за ММСП." },
  { n:"03", title:"Резултати и извештај", desc:"Визуелен приказ на усогласеноста, приоритетни недостатоци и план за подобрување со PDF извоз." },
];

const frameworks = ["ЗБМИС","NIS2 Directive","ISO 27001","ENISA Guidelines","CIS Controls","NIST CSF"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b1120]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-6">
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="opacity-0 animate-fade-up mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 bg-blue-500/8 border border-blue-500/15 px-3 py-1.5 rounded">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              MKD-CIRT · Република Северна Македонија
            </span>
          </div>

          <h1 className="opacity-0 animate-fade-up delay-1 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
            Алатка за самооценување
            <br />
            <span className="text-slate-400 text-[0.6em] font-semibold">
              Закон за безбедност на мрежни и информациски системи
            </span>
          </h1>

          <p className="opacity-0 animate-fade-up delay-2 text-base md:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Официјална алатка за проценка на усогласеноста со{" "}
            <span className="text-slate-200">ЗБМИС (Сл. весник бр. 135, 4.7.2025)</span>{" "}
            и NIS2 директивата. Со поддршка за ММСП базирана на ENISA препораки.
          </p>

          <div className="opacity-0 animate-fade-up delay-3 flex flex-wrap gap-3 mb-14">
            <Link href="/assessment" className="btn-primary px-6 py-3 text-base">
              Започни проценка
            </Link>
            <Link href="/assessment" className="btn-ghost px-6 py-3 text-base">
              Класифицирај субјект
            </Link>
          </div>

          {/* Stats row */}
          <div className="opacity-0 animate-fade-up delay-4 flex gap-8 border-t border-white/[0.06] pt-8">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label} · {s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENTITY TYPES ── */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="section-label">класификација</div>
            <h2 className="section-title">Типови на субјекти</h2>
            <p className="section-desc">Законот дефинира три категории организации со различни нивоа на обврски и надзор.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {entityTypes.map(e => (
              <div key={e.label} className={`card card-hover p-6 ${e.borderColor}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${e.dotColor}`} />
                  <span className={`text-xs font-mono font-medium ${e.color}`}>{e.annex}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{e.label}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{e.desc}</p>
                <div className="space-y-2 text-xs text-slate-500">
                  <div>Санкции: <span className={e.color}>{e.sanctions}</span></div>
                  <div>Рок: <span className="text-slate-300">{e.deadline}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="section-label">процес</div>
            <h2 className="section-title">Како функционира</h2>
            <p className="section-desc">Три чекори — од идентификување на статусот до добивање извештај.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {steps.map(s => (
              <div key={s.n} className="card card-hover p-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/8 border border-blue-500/15 flex items-center justify-center text-xs font-bold text-blue-400 mb-4">
                  {s.n}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS ── */}
      <section id="domains" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="section-label">покриеност</div>
            <h2 className="section-title">12 домени на проценка</h2>
            <p className="section-desc">Проценка базирана на NIS2 Чл.21, ISO 27001, ENISA насоки и ЗБМИС Чл.29.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {domains.map(d => (
              <div key={d.id} className="card card-hover p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="domain-icon">{d.abbr}</div>
                  <span className="font-mono text-[10px] text-slate-600">D{d.id}</span>
                </div>
                <div className="text-sm font-medium text-white leading-snug">{d.titleMk}</div>
                <div className="text-xs text-slate-500 mt-0.5">{d.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FRAMEWORKS ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="card p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="section-label">законска рамка</div>
                <h3 className="text-xl font-bold text-white mb-3">Усогласеност со стандарди</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Контролниот список е изграден врз основа на ЗБМИС и NIS2 директивата, со референци кон меѓународно признатите рамки за информациска безбедност.
                </p>
                <div className="flex flex-wrap gap-2">
                  {frameworks.map(f => (
                    <span key={f} className="badge badge-done">{f}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Клучни датуми</div>
                {[
                  { label:"Закон објавен", value:"4 јули 2025", sub:"Сл. весник бр. 135" },
                  { label:"Влегува во сила", value:"1 јануари 2026", sub:"Почеток на примена" },
                  { label:"Рок за приватен сектор", value:"31 декември 2026", sub:"Суштински и важни субјекти" },
                  { label:"Рок за јавен сектор", value:"31 декември 2027", sub:"Владини институции" },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <div>
                      <div className="text-sm text-slate-300">{d.label}</div>
                      <div className="text-xs text-slate-500">{d.sub}</div>
                    </div>
                    <div className="text-sm font-mono text-white">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Проверете ја вашата усогласеност
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Бесплатна и анонимна проценка. Без инсталација, без регистрација.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/assessment" className="btn-primary px-8 py-3 text-base">
              Започни проценка
            </Link>
            <Link href="/assessment" className="btn-ghost px-8 py-3 text-base">
              Класифицирај субјект
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs text-white">MK</div>
                <div>
                  <div className="font-bold text-white text-sm">MKD-CIRT</div>
                  <div className="text-[10px] text-slate-500 tracking-widest uppercase">Национален центар за одговор на компјутерски инциденти</div>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mt-3">
                Официјална алатка за самооценување на усогласеноста со Законот за безбедност на мрежни и информациски системи.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-300 text-sm mb-3">Платформа</div>
              <div className="space-y-2">
                {[{l:"Проценка",href:"/assessment"},{l:"Класификација",href:"/assessment/classify"},{l:"Најава",href:"/login"}].map(l=>(
                  <Link key={l.l} href={l.href} className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">{l.l}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-slate-300 text-sm mb-3">Регулатива</div>
              <div className="space-y-2">
                {["ЗБМИС (Сл. весник 135/2025)","NIS2 Директива 2022/2555","ISO/IEC 27001","ENISA насоки"].map(l=>(
                  <div key={l} className="text-sm text-slate-500">{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              © 2025 MKD-CIRT · Република Северна Македонија · Не претставува правен совет
            </div>
            <div className="flex gap-4">
              {["Приватност","Услови на користење"].map(l=>(
                <span key={l} className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
