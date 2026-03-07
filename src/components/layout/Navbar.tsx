"use client";
import { useState } from "react";
import Link from "next/link";

const langs = ["МК", "EN", "SQ"];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("МК");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-sm text-white">
            MK
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-700 text-white text-sm leading-tight">MKD-CIRT</div>
            <div className="text-[10px] text-muted leading-tight tracking-widest uppercase">BMIS Platform</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#about" className="text-sm text-muted hover:text-white transition-colors">За платформата</Link>
          <Link href="#how" className="text-sm text-muted hover:text-white transition-colors">Како функционира</Link>
          <Link href="#domains" className="text-sm text-muted hover:text-white transition-colors">Домени</Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 glass rounded-lg p-1">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeLang === l
                    ? "bg-accent text-white"
                    : "text-muted hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link
            href="/assessment"
            className="bg-accent hover:bg-accent-bright text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
          >
            Започни
          </Link>
        </div>
      </div>
    </nav>
  );
}
