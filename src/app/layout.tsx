import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MKD-CIRT BMIS Platform",
  description: "Self-Assessment Platform for BMIS/NIS2 Compliance - North Macedonia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mk">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
