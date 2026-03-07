import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MKD-CIRT BMIS Platform",
  description: "Официјална алатка за самооценување на усогласеноста со Законот за безбедност на мрежни и информациски системи (ЗБМИС/NIS2) — MKD-CIRT",
  keywords: ["BMIS", "NIS2", "MKD-CIRT", "cybersecurity", "North Macedonia", "самооценување"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mk">
      <body>{children}</body>
    </html>
  );
}
