"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const langs = [{ code:"mk", label:"МК" },{ code:"en", label:"EN" },{ code:"sq", label:"SQ" }];
const navLinks = [{ href:"#about", label:"Класификација" },{ href:"#how", label:"Процес" },{ href:"#domains", label:"Домени" }];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("mk");
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "bg-[#0b1120]/95 backdrop-blur-md border-b border-white/[0.06] shadow-lg shadow-black/20" : "bg-transparent"}`}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-[11px] text-white">MK</div>
          <div className="hidden sm:block">
            <div className="font-bold text-white text-sm leading-none">MKD-CIRT</div>
            <div className="text-[9px] text-slate-500 tracking-[.12em] uppercase mt-0.5">BMIS Platform</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-md hover:bg-white/[0.04] transition-all">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-white/[0.03] border border-white/[0.06] rounded-md p-0.5 gap-0.5">
            {langs.map(l => (
              <button key={l.code} onClick={() => setActiveLang(l.code)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${activeLang === l.code ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}>
                {l.label}
              </button>
            ))}
          </div>
          <Link href="/assessment" className="btn-primary text-xs py-2 px-4">Проценка</Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md border border-white/[0.08] bg-white/[0.03]">
            <div className={`w-4 h-0.5 bg-slate-300 mb-1 transition-all ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-4 h-0.5 bg-slate-300 mb-1 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <div className={`w-4 h-0.5 bg-slate-300 transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0b1120]/95 backdrop-blur-md border-t border-white/[0.06] px-6 py-3 space-y-1 animate-fade-in">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-300 hover:text-white">{l.label}</a>
          ))}
          <div className="pt-2 border-t border-white/[0.06]">
            <Link href="/assessment" className="btn-primary w-full justify-center py-2 text-sm mt-2">Проценка</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
