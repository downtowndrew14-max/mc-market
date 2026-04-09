import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GlassBackground from "@/components/GlassBackground";
import ThemeToggle from "@/components/ThemeToggle";
import CherryBlossoms from "@/components/CherryBlossoms";
import EnterScreen from "@/components/EnterScreen";
import CustomCursor from "@/components/CustomCursor";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import ParticleEffect from "@/components/ParticleEffect";
import PageTransition from "@/components/PageTransition";
import FloatingButtons from "@/components/FloatingButtons";
import SoundEffects from "@/components/SoundEffects";

export const metadata: Metadata = {
  title: "Heart Market",
  description: "A website to simplify selling and buying Minecraft accounts",
  openGraph: { title: "Heart Market", description: "A website to simplify selling and buying Minecraft accounts", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EnterScreen />
        <CustomCursor />
        <GlassBackground />
        <CherryBlossoms />
        <ParticleEffect />
        <SoundEffects />
        <Navbar />
        <PageTransition>
          <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
            {children}
          </main>
        </PageTransition>
        <LiveActivityFeed />
        <FloatingButtons />
        <ThemeToggle />
      </body>
    </html>
  );
}
