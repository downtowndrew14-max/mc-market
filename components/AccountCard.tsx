"use client";

import Link from "next/link";
import { useState } from "react";
import { Account, getCapeList } from "@/lib/db";

function ncLabel(n: number) {
  if (n === 0) return "PRENAME";
  if (n >= 15) return "15+ NAME CHANGES";
  return `${n} NAME CHANGE${n !== 1 ? "S" : ""}`;
}

// Map cape names to short abbreviations for the pixel icons
function CapeIcon({ name }: { name: string }) {
  const abbr = name.replace(/[^A-Z0-9]/gi, "").slice(0, 2).toUpperCase();
  const colors: Record<string, string> = {
    "Migrator": "#4f46e5", "Vanilla": "#10b981", "MineCon 2011": "#f59e0b",
    "MineCon 2012": "#ef4444", "MineCon 2013": "#8b5cf6", "MineCon 2015": "#06b6d4",
    "MineCon 2016": "#f97316", "Founder's": "#eab308", "Mojang Office": "#dc2626",
    "Purple Heart": "#7c3aed", "Cherry Blossom": "#ec4899", "Common": "#6b7280",
    "Copper": "#b45309", "Home": "#2563eb", "Menace": "#991b1b",
    "Pan": "#d97706", "Translator": "#0891b2", "Yearn": "#7c2d12",
    "Zombie Horse": "#4d7c0f", "15th Anniversary": "#b45309",
    "Follower's": "#6366f1", "MCC 15th Year": "#db2777",
    "Realms Mapmaker": "#0369a1", "Minecraft Experience": "#16a34a",
  };
  const bg = colors[name] ?? "#6b7280";

  return (
    <div className="cape-icon" style={{ background: bg, width: 32, height: 32 }} title={name}>
      <span style={{ color: "#fff", fontSize: "9px", fontWeight: 900, fontFamily: "monospace" }}>{abbr}</span>
    </div>
  );
}

export default function AccountCard({ account }: { account: Account }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const capes = getCapeList(account.capes);

  return (
    <Link href={`/account/${account.id}`} className="account-card">
      {/* Image */}
      <div className="card-image-container">
        {!imgLoaded && <div className="card-spinner" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc-heads.net/body/${account.username}/200`}
          alt={account.username}
          onLoad={() => setImgLoaded(true)}
          style={{ height: "100%", objectFit: "contain", display: imgLoaded ? "block" : "none" }}
        />
        {capes.length > 0 && (
          <div className="card-capes-overlay">
            {capes.slice(0, 4).map((c) => <CapeIcon key={c} name={c} />)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="card-content">
        <div className="card-title-row">
          <h3 className="card-username">{account.username}</h3>
          <span className="card-nc">{ncLabel(account.nameChanges)}</span>
        </div>
        <p className="card-description">{account.description || " "}</p>
        <div className="card-meta">
          <div className="card-prices">
            <div className="price-item">
              <span className="price-label">C/O</span>
              <span className="price-value">{account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "-"}</span>
            </div>
            <div className="price-item">
              <span className="price-label">BIN</span>
              <span className="price-value">{account.price > 0 ? `$${account.price.toFixed(2)}` : "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
