"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const langs = [{ code:"mk", label:"МК", flag:"🇲🇰" },{ code:"en", label:"EN", flag:"🇬🇧" },{ code:"sq", label:"SQ", flag:"🇦🇱" }];
const navLinks = [{ href:"#about", label:"За платформата" },{ href:"#how", label:"Процес" },{ href:"#domains", label:"Домени" }];

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/5 shadow-xl shadow-black/30" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-600 rounded-xl group-hover:opacity-90 transition-opacity" />
            <span className="relative font-display font-800 text-sm text-white">MK</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-700 text-white text-sm leading-none">MKD-CIRT</div>
            <div className="text-[10px] text-blue-400 tracking-[.15em] uppercase mt-0.5">BMIS Platform</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center glass rounded-lg p-1 gap-0.5">
            {langs.map(l => (
              <button key={l.code} onClick={() => setActiveLang(l.code)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${activeLang === l.code ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <Link href="/login" className="hidden sm:block text-sm text-slate-400 hover:text-white px-3 py-2 transition-colors">Најава</Link>
          <Link href="/assessment" className="btn-primary text-sm py-2 px-5">Започни →</Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden glass border border-white/10 p-2 rounded-lg">
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 px-6 py-4 space-y-2 animate-fade-in">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-300 hover:text-white">{l.label}</a>
          ))}
          <div className="pt-2 flex gap-2">
            <Link href="/login"    className="flex-1 text-center btn-ghost py-2 text-sm">Најава</Link>
            <Link href="/register" className="flex-1 text-center btn-primary py-2 text-sm">Регистрирај се</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
