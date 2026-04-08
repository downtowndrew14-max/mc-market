"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Account, getCapeList } from "@/lib/db";
import SkinViewer from "@/components/SkinViewer";

function ncLabel(n: number) {
  if (n === 0) return "Prename (0)";
  if (n >= 15) return "15+";
  return String(n);
}

const CAPE_COLORS: Record<string, string> = {
  "Migrator": "#4f46e5", "Vanilla": "#10b981", "MineCon 2011": "#f59e0b",
  "MineCon 2012": "#ef4444", "MineCon 2013": "#8b5cf6", "MineCon 2015": "#06b6d4",
  "MineCon 2016": "#f97316", "Founder's": "#eab308", "Mojang Office": "#dc2626",
  "Purple Heart": "#7c3aed", "Cherry Blossom": "#ec4899", "Common": "#6b7280",
  "Copper": "#b45309", "Home": "#2563eb", "Menace": "#991b1b",
};

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetch(`/api/accounts/${id}`).then((r) => r.json()).then(setAccount);
  }, [id]);

  if (!account) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="card-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  const capes = getCapeList(account.capes);

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <Link href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", color: "var(--foreground-muted)", fontSize: ".9rem", fontWeight: 600, marginBottom: "2rem", transition: "color .2s" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to Browse
      </Link>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Left */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "1rem", width: 280 }}>
          <div className="glass" style={{ borderRadius: "var(--radius)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", height: 420 }}>
            <SkinViewer username={account.username} width={280} height={400} />
          </div>
          {capes.length > 0 && (
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {capes.map((cape) => (
                <div key={cape} className="glass" style={{ borderRadius: 12, padding: ".5rem .75rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: CAPE_COLORS[cape] ?? "#6b7280", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: "8px", fontWeight: 900 }}>{cape.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--foreground-muted)" }}>{cape}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-.04em", color: "var(--foreground)" }}>{account.username}</h1>

          <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.25rem" }}>
            <p style={{ fontSize: ".95rem", color: "var(--foreground-muted)", lineHeight: 1.6 }}>
              {account.description || "No description provided."}
            </p>
          </div>

          <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: ".25rem" }}>NAME CHANGES</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)" }}>{ncLabel(account.nameChanges)}</p>
            </div>
            <div>
              <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: ".25rem" }}>TYPE</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)" }}>{account.type}</p>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: ".25rem" }}>CURRENT OFFER</p>
                <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--foreground)" }}>
                  {account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "-"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: ".25rem" }}>BUY IT NOW</p>
                <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--foreground)" }}>
                  {account.price > 0 ? `$${account.price.toFixed(2)}` : "-"}
                </p>
              </div>
            </div>

            {account.discord && (
              <a href={`https://discord.com/users/${account.discord}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", width: "100%", background: "var(--foreground)", color: "var(--background)", textAlign: "center", fontWeight: 800, fontSize: ".9rem", letterSpacing: ".1em", padding: "1rem", borderRadius: "1rem", transition: "opacity .2s", textTransform: "uppercase" }}>
                PURCHASE / BID
              </a>
            )}
            {account.telegram && (
              <a href={`https://t.me/${account.telegram}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", width: "100%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--foreground-muted)", textAlign: "center", fontWeight: 600, fontSize: ".85rem", padding: ".75rem", borderRadius: "1rem", transition: "all .2s" }}>
                Telegram: @{account.telegram}
              </a>
            )}
            {account.oguser && (
              <a href={account.oguser} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", width: "100%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--foreground-muted)", textAlign: "center", fontWeight: 600, fontSize: ".85rem", padding: ".75rem", borderRadius: "1rem", transition: "all .2s" }}>
                OGUser Profile
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
