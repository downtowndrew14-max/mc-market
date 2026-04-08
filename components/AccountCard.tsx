"use client";

import Link from "next/link";
import { Account, getCapeList, getCapeImageUrl } from "@/lib/db";

function ncLabel(n: number) {
  if (n === 0) return "PRENAME";
  if (n >= 15) return "15+ NAME CHANGES";
  return `${n} NAME CHANGE${n !== 1 ? "S" : ""}`;
}

function CapeIcon({ name }: { name: string }) {
  const imgUrl = getCapeImageUrl(name);
  return (
    <div className="cape-icon" style={{ width: 28, height: 28, background: "rgba(0,0,0,.08)" }} title={name}>
      {imgUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }} />
      ) : (
        <span style={{ color: "#fff", fontSize: "8px", fontWeight: 900, fontFamily: "monospace" }}>
          {name.replace(/[^A-Z0-9]/gi, "").slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function AccountCard({ account }: { account: Account }) {
  const capes = getCapeList(account.capes);

  return (
    <Link href={`/account/${account.id}`} className="account-card">
      {/* Character render */}
      <div className="card-image-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc-heads.net/body/${account.username}/200`}
          alt={account.username}
          className="card-skin-img"
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
