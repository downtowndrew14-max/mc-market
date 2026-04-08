"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Account } from "@/lib/db";

const TYPE_COLORS: Record<string, string> = {
  "OG":       "#f59e0b",
  "Semi-OG":  "#3b82f6",
  "Minecon":  "#a855f7",
  "3 Letter": "#06b6d4",
};

function isNew(createdAt: string | Date) {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

export default function AccountCard({ account }: { account: Account }) {
  const color = TYPE_COLORS[account.type] ?? "#d63771";
  const [faved, setFaved] = useState(false);

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("hm_favs") ?? "[]");
      setFaved(favs.includes(account.id));
    } catch {}
  }, [account.id]);

  function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("hm_favs") ?? "[]");
      const next = faved ? favs.filter((id) => id !== account.id) : [...favs, account.id];
      localStorage.setItem("hm_favs", JSON.stringify(next));
      setFaved(!faved);
    } catch {}
  }

  return (
    <Link href={`/account/${account.id}`} className="float-card" style={{ "--glow": color } as React.CSSProperties}>

      {/* Fav button */}
      <button
        onClick={toggleFav}
        title={faved ? "Remove from favorites" : "Add to favorites"}
        style={{
          position: "absolute", top: 8, right: 8,
          background: faved ? "rgba(214,55,113,0.15)" : "rgba(0,0,0,0.12)",
          border: `1px solid ${faved ? "rgba(214,55,113,0.4)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "50%", width: 28, height: 28,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "0.8rem",
          transition: "all 0.2s",
          zIndex: 2,
        }}
      >
        {faved ? "🤍" : "🖤"}
      </button>

      {/* New badge */}
      {isNew(account.createdAt) && (
        <div style={{
          position: "absolute", top: 8, left: 8,
          background: "var(--primary)",
          color: "#fff",
          fontSize: "0.58rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "3px 8px",
          borderRadius: 999,
          boxShadow: "0 0 10px rgba(214,55,113,0.6)",
          animation: "new-pulse 2s ease-in-out infinite",
          zIndex: 2,
        }}>
          NEW
        </div>
      )}

      {/* Floating character */}
      <div className="float-char-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc-heads.net/body/${account.username}/200`}
          alt={account.username}
          className="float-char"
          draggable={false}
        />
        <div className="float-platform" />
      </div>

      {/* Info */}
      <div className="float-info">
        <p className="float-username">{account.username}</p>
        <span className="float-type" style={{ background: `${color}22`, color, borderColor: `${color}44` }}>
          {account.type}
        </span>
        <div className="float-prices">
          <div className="float-price-item">
            <span className="float-price-label">C/O</span>
            <span className="float-price-val">
              {account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "—"}
            </span>
          </div>
          <div className="float-price-divider" />
          <div className="float-price-item">
            <span className="float-price-label">BIN</span>
            <span className="float-price-val">
              {account.price > 0 ? `$${account.price.toFixed(2)}` : "—"}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes new-pulse {
          0%,100% { box-shadow: 0 0 8px rgba(214,55,113,0.5); }
          50%      { box-shadow: 0 0 18px rgba(214,55,113,0.9); }
        }
      `}</style>
    </Link>
  );
}
