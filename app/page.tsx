"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(target);
        };
        requestAnimationFrame(tick);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { val, ref };
}

function StatCard({ value, label, icon }: { value: number; label: string; icon: string }) {
  const { val, ref } = useCountUp(value);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      padding: "1.5rem 2rem",
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: 20,
      minWidth: 140,
    }}>
      <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      <span ref={ref} style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)", letterSpacing: "-0.04em" }}>{val}</span>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
    </div>
  );
}

export default function Home() {
  const [counts, setCounts] = useState({ total: 0, og: 0, minecon: 0, letter3: 0 });

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((accounts: { type: string }[]) => {
        console.log("Fetched accounts:", accounts);
        setCounts({
          total:   accounts.length,
          og:      accounts.filter((a) => a.type === "OG").length,
          minecon: accounts.filter((a) => a.type === "Minecon").length,
          letter3: accounts.filter((a) => a.type === "3 Letter").length,
        });
      })
      .catch((err) => console.error("Failed to fetch accounts:", err));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "85vh", paddingTop: "6rem", gap: "3rem" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "clamp(52px, 10vw, 96px)",
          fontWeight: 700,
          color: "var(--foreground)",
          lineHeight: 1,
          letterSpacing: "-2px",
          filter: "drop-shadow(0 0 30px rgba(214,55,113,0.3))",
          animation: "hero-float 4s ease-in-out infinite",
        }}>
          🤍 heart market
        </div>

        <p style={{
          color: "var(--foreground-muted)",
          fontSize: "clamp(14px, 2vw, 18px)",
          maxWidth: 460,
          lineHeight: 1.6,
          margin: 0,
        }}>
          The cleanest marketplace for rare Minecraft accounts.<br />
          OG · Semi-OG · Minecon · 3-Letter
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
          <Link href="/browse" style={{
            background: "var(--primary)",
            color: "#fff",
            padding: "14px 36px",
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "0.95rem",
            textDecoration: "none",
            letterSpacing: "0.05em",
            boxShadow: "0 4px 24px rgba(214,55,113,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(214,55,113,0.5)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(214,55,113,0.4)"; }}
          >
            Browse Listings
          </Link>
          <Link href="/list-account" style={{
            background: "transparent",
            color: "var(--primary)",
            padding: "14px 36px",
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "0.95rem",
            textDecoration: "none",
            letterSpacing: "0.05em",
            border: "1.5px solid rgba(214,55,113,0.4)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(214,55,113,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(214,55,113,0.8)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(214,55,113,0.4)"; }}
          >
            Sell Account
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, rgba(214,55,113,0.5), transparent)" }} />

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <StatCard value={counts.total}   label="Listed"    icon="📋" />
        <StatCard value={counts.og}      label="OG"        icon="⭐" />
        <StatCard value={counts.minecon} label="Minecon"   icon="🎭" />
        <StatCard value={counts.letter3} label="3-Letter"  icon="🔤" />
      </div>

      {/* Free badge */}
      <div style={{
        background: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.25)",
        borderRadius: 999,
        padding: "8px 20px",
        fontSize: "0.8rem",
        fontWeight: 700,
        color: "#22c55e",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}>
        ✅ Free to list — no fees, no commissions
      </div>

      {/* Discord */}
      <a href="https://discord.gg/PzUD4skrJn" target="_blank" rel="noopener noreferrer" style={{
        display: "flex", alignItems: "center", gap: 8,
        color: "var(--foreground-muted)", fontSize: "0.85rem", fontWeight: 600,
        textDecoration: "none", opacity: 0.7, transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
        Join our Discord community
      </a>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        @keyframes hero-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
