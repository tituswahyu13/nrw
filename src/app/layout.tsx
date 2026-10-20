import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIMPADU · Monitoring Meter Air & Foto Pelanggan",
  description: "Aplikasi monitoring data pelanggan dan foto meteran air 5 bulan terakhir SIMPADU PDAM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
