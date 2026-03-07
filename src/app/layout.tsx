import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MKD-CIRT BMIS Platform", template: "%s | MKD-CIRT BMIS" },
  description: "Официјална алатка за самооценување на усогласеноста со ЗБМИС/NIS2 — MKD-CIRT, Република Северна Македонија",
  keywords: ["BMIS","NIS2","MKD-CIRT","cybersecurity","North Macedonia","ЗБМИС"],
  openGraph: {
    title: "MKD-CIRT BMIS Self-Assessment Platform",
    description: "Free NIS2/BMIS compliance self-assessment tool for North Macedonia",
    url: "https://bmis-platform.vercel.app",
    siteName: "MKD-CIRT BMIS",
    locale: "mk_MK",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mk" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#080f1e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080f1e] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
