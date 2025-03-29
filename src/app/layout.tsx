import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AosInit } from './_components/aos-init';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IMPULSIONE_WEB",
  description: "Site profissional",
  icons: {
    icon: "/Green-and-White-Simple-Technology-Logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <header>
      <link rel="icon" href="/Green-and-White-Simple-Technology-Logo.ico" />
      </header>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AosInit />
      </body>
    </html>
  );
}
