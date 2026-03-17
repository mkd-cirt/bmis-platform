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
        <meta name="theme-color" content="#0a0f1a" />
      </head>
      <body className="bg-[#0a0f1a] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
