import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Space_Grotesk, Space_Mono } from "next/font/google";
import { getFacts } from "@/data/profile";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const display = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

// A function rather than a `metadata` const so the year count is worked out per render, not once at module load.
export function generateMetadata(): Metadata {
  const { yearsInIT } = getFacts(new Date());
  return {
    title: "Jake Abella · Technical Lead, E-Trading",
    description: `Jake Abella: Vice President and Technical/Functional Lead for Global Markets e-trading systems at UOB, Singapore. ${yearsInIT} years in software.`,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8e7" },
    { media: "(prefers-color-scheme: dark)", color: "#15132a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline theme script sets data-theme before React hydrates.
    <html
      lang="en"
      data-theme="light"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
