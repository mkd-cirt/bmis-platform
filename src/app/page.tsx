import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const domains = [
  { id: "01", title: "Governance & Risk", icon: "🏛️" },
  { id: "02", title: "Asset Management", icon: "📦" },
  { id: "03", title: "Access Control", icon: "🔐" },
  { id: "04", title: "Cryptography", icon: "🔒" },
  { id: "05", title: "Network Security", icon: "🌐" },
  { id: "06", title: "Incident Response", icon: "🚨" },
  { id: "07", title: "Business Continuity", icon: "♻️" },
  { id: "08", title: "Supply Chain", icon: "🔗" },
  { id: "09", title: "Secure Development", icon: "💻" },
  { id: "10", title: "HR Security", icon: "👥" },
  { id: "11", title: "Physical Security", icon: "🏢" },
  { id: "12", title: "Compliance & Audit", icon: "📋" },
];

const steps = [
  {
    num: "01",
    title: "Определи го твојот статус",
    desc: "Одговори на прашања за твојот сектор и големина за да утврдиме дали си Суштински или Важен субјект.",
  },
  {
    num: "02",
    title: "Направи самооценување",
    desc: "Добиј детален список со контролни прашања за 12 домени или поедноставена проценка за ММСП.",
  },
  {
    num: "03",
    title: "Анализирај ги резултатите",
    desc: "Прегледај ја твојата усогласеност визуелно, идентификувај недостатоци и добиј план за подобрување.",
  },
];

const tracks = [
  {
    label: "Суштински субјекти",
    badge: "Анекс I",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: "🏛️",
    desc: "Организации во критична инфраструктура — енергетика, транспорт, здравство, банкарство, дигитална инфраструктура.",
    features: ["12 домени со 87 контроли", "Технички и организациски мерки", "Законски барања за известување"],
    cta: "Започни BMIS проценка",
    href: "/assessment/bmis",
  },
  {
    label: "Важни субјекти",
    badge: "Анекс II",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: "🏢",
    desc: "Пошта, управување со отпад, производство, дигитални провајдери и истражувачки организации.",
    features: ["12 домени прилагодени за Анекс II", "Пропорционални мерки", "Упатства за усогласеност"],
    cta: "Започни BMIS проценка",
    href: "/assessment/bmis",
  },
  {
    label: "ММСП",
    badge: "ENISA",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    icon: "🏪",
    desc: "Микро, мали и средни претпријатија кои не се директно опфатени со законот но сакаат да ја подобрат безбедноста.",
    features: ["6 поедноставени домени", "3 нивоа на зрелост", "Практични препораки од ENISA"],
    cta: "Започни ММСП проценка",
    href: "/assessment/sme",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a1628] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        {/* background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl" />
          {/* grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{backgroundImage: "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="opacity-0 animate-fade-up inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-blue-300 mb-8 border border-blue-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Официјална алатка на MKD-CIRT · Република Северна Македонија
          </div>

          <h1 className="opacity-0 animate-fade-up delay-100 font-display text-5xl md:text-7xl font-800 text-white leading-tight mb-6">
            BMIS
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Самооценување
            </span>
          </h1>

          <p className="opacity-0 animate-fade-up delay-200 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Бесплатна алатка за определување на статусот и самооценување на
            усогласеноста со{" "}
            <span className="text-blue-300 font-medium">
              Законот за безбедност на мрежни и информациски системи
            </span>{" "}
            (ЗБМИС / NIS2).
          </p>

          <div className="opacity-0 animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="group bg-accent hover:bg-blue-500 text-white font-display font-600 text-lg px-8 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Започни проценка
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
            <Link
              href="#how"
              className="glass glass-hover text-white font-medium text-lg px-8 py-4 rounded-xl transition-all"
            >
              Дознај повеќе
            </Link>
          </div>

          <div className="opacity-0 animate-fade-up delay-400 mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[["12", "Домени"], ["87", "Контроли"], ["3", "Јазици"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-800 text-white">{num}</div>
                <div className="text-xs text-muted mt-1 tracking-wide uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-display text-xs tracking-widest uppercase text-blue-400 mb-3">Процес</div>
            <h2 className="font-display text-4xl font-700 text-white">Како функционира?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="glass glass-hover rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-4 right-4 font-display text-6xl font-800 text-white/5 group-hover:text-white/8 transition-colors">
                  {step.num}
                </div>
                <div className="w-10 h-10 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center text-blue-300 font-display font-700 text-sm mb-6">
                  {step.num}
                </div>
                <h3 className="font-display font-600 text-white text-lg mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRACKS ───────────────────────────────── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-display text-xs tracking-widest uppercase text-blue-400 mb-3">Патеки</div>
            <h2 className="font-display text-4xl font-700 text-white">За кого е наменета?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div key={track.label} className="glass glass-hover rounded-2xl p-8 flex flex-col group">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-3xl">{track.icon}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${track.badgeColor}`}>
                    {track.badge}
                  </span>
                </div>
                <h3 className="font-display font-700 text-white text-xl mb-3">{track.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{track.desc}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {track.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={track.href}
                  className="w-full text-center glass glass-hover border border-white/10 hover:border-blue-500/40 text-white text-sm font-medium py-3 rounded-xl transition-all group-hover:bg-accent/10"
                >
                  {track.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS GRID ─────────────────────────── */}
      <section id="domains" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-display text-xs tracking-widest uppercase text-blue-400 mb-3">Покриеност</div>
            <h2 className="font-display text-4xl font-700 text-white">12 домени на проценка</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm">
              Сеопфатна проценка базирана на NIS2, ISO 27001 и ENISA насоки
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {domains.map((d) => (
              <div key={d.id} className="glass glass-hover rounded-xl p-5 group cursor-default">
                <div className="text-2xl mb-3">{d.icon}</div>
                <div className="font-display text-xs text-blue-400 mb-1">D{d.id}</div>
                <div className="text-sm font-medium text-white">{d.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
            <h2 className="relative font-display text-4xl font-700 text-white mb-4">
              Готови ли сте да започнете?
            </h2>
            <p className="relative text-slate-400 mb-8 max-w-md mx-auto">
              Проценката е бесплатна, анонимна и трае помалку од 30 минути.
            </p>
            <Link
              href="/assessment"
              className="relative inline-flex items-center gap-2 bg-accent hover:bg-blue-500 text-white font-display font-600 text-lg px-10 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Започни сега →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-xs text-white">MK</div>
            <span className="text-sm text-muted">MKD-CIRT · BMIS Self-Assessment Platform</span>
          </div>
          <div className="text-xs text-slate-600 text-center">
            Оваа алатка не претставува правен совет. · © 2025 MKD-CIRT
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted hover:text-white transition-colors">Приватност</Link>
            <Link href="/terms" className="text-xs text-muted hover:text-white transition-colors">Услови</Link>
            <a href="https://cirt.mk" target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-white transition-colors">cirt.mk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
