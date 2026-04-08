import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GlassBackground from "@/components/GlassBackground";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Glass Market",
  description: "A website to simplify selling and buying Minecraft accounts",
  openGraph: { title: "Glass Market", description: "A website to simplify selling and buying Minecraft accounts", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlassBackground />
        <Navbar />
        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
          {children}
        </main>
        <ThemeToggle />
      </body>
    </html>
  );
}
