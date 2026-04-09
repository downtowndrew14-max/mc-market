"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Account, getCapeList, getCapeImageUrl } from "@/lib/db";
import SkinViewer from "@/components/SkinViewer";
import PriceHistory from "@/components/PriceHistory";
import { useToast } from "@/components/Toast";

function ncLabel(n: number) {
  if (n === 0) return "Prename";
  if (n >= 15) return "15+";
  return String(n);
}

const TYPE_COLORS: Record<string, string> = {
  "OG": "#f59e0b", "Semi-OG": "#3b82f6", "Minecon": "#a855f7", "3 Letter": "#06b6d4",
};

function OfferModal({ account, onClose, onSuccess }: { account: Account; onClose: () => void; onSuccess: () => void }) {
  const [offerAmount, setOfferAmount]   = useState("");
  const [buyerDiscord, setBuyerDiscord] = useState("");
  const [buyerTelegram, setBuyerTelegram] = useState("");
  const [message, setMessage]           = useState("");
  const [state, setState]               = useState<"idle"|"loading"|"error">("idle");
  const [errorMsg, setErrorMsg]         = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: account.id, offerAmount, buyerDiscord, buyerTelegram, message }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed"); }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, padding: "10px 14px", color: "var(--foreground)", fontSize: "0.9rem",
    outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: "0.08em", color: "var(--foreground-subtle)", marginBottom: 6, display: "block",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Make an Offer</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", margin: "4px 0 0" }}>
              on <strong>{account.username}</strong>
              {account.price > 0 && <span style={{ color: "var(--foreground-subtle)" }}> · BIN ${account.price.toFixed(2)}</span>}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--foreground-muted)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={lbl}>Your Offer (USD) *</label>
            <input type="number" min="0.01" step="0.01" placeholder="e.g. 2.50" value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} required style={inp} />
            {account.currentOffer > 0 && <p style={{ fontSize: "0.75rem", color: "var(--foreground-subtle)", marginTop: 4 }}>Current best: ${account.currentOffer.toFixed(2)}</p>}
          </div>
          <div><label style={lbl}>Your Discord</label><input type="text" placeholder="username" value={buyerDiscord} onChange={(e) => setBuyerDiscord(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Your Telegram</label><input type="text" placeholder="@username" value={buyerTelegram} onChange={(e) => setBuyerTelegram(e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Message (optional)</label><textarea placeholder="Any notes..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} style={{ ...inp, resize: "none" }} /></div>
          {!buyerDiscord && !buyerTelegram && <p style={{ fontSize: "0.75rem", color: "#f59e0b", margin: 0 }}>Provide at least one contact method.</p>}
          {state === "error" && <p style={{ fontSize: "0.8rem", color: "#ef4444", margin: 0 }}>{errorMsg}</p>}
          <button type="submit" disabled={state === "loading" || !offerAmount || (!buyerDiscord && !buyerTelegram)}
            style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", opacity: state === "loading" ? 0.7 : 1 }}>
            {state === "loading" ? "Sending..." : "Send Offer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { id }          = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [faved, setFaved] = useState(false);
  const { showToast }   = useToast();

  useEffect(() => {
    fetch(`/api/accounts/${id}`).then((r) => r.json()).then(setAccount);
  }, [id]);

  useEffect(() => {
    if (!account) return;
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("hm_favs") ?? "[]");
      setFaved(favs.includes(account.id));
    } catch {}
  }, [account]);

  function toggleFav() {
    if (!account) return;
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("hm_favs") ?? "[]");
      const next = faved ? favs.filter((x) => x !== account.id) : [...favs, account.id];
      localStorage.setItem("hm_favs", JSON.stringify(next));
      setFaved(!faved);
      showToast(faved ? "Removed from favorites" : "Added to favorites", faved ? "🖤" : "🤍");
    } catch {}
  }

  function share() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Link copied to clipboard!", "🔗");
    });
  }

  if (!account) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="card-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  const capes    = getCapeList(account.capes);
  const typeColor = TYPE_COLORS[account.type] ?? "#d63771";

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: 960, margin: "0 auto" }}>
      {showOffer && (
        <OfferModal
          account={account}
          onClose={() => setShowOffer(false)}
          onSuccess={() => showToast("Offer sent! The seller has been notified.", "🌸")}
        />
      )}

      {/* Back */}
      <Link href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", color: "var(--foreground-muted)", fontSize: ".9rem", fontWeight: 600, marginBottom: "2rem", textDecoration: "none" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to Browse
      </Link>

      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>

        {/* Left — skin */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: 260 }}>
          <div className="glass" style={{ borderRadius: "var(--radius)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", height: 400, width: "100%" }}>
            <SkinViewer username={account.username} width={260} height={380} />
          </div>

          {/* Capes */}
          {capes.length > 0 && (
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "center" }}>
              {capes.map((cape) => {
                const img = getCapeImageUrl(cape);
                return (
                  <div key={cape} className="glass" style={{ borderRadius: 12, padding: ".4rem .65rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
                    {img && <img src={img} alt={cape} style={{ width: 20, height: 20, objectFit: "contain", imageRendering: "pixelated" }} />}
                    <span style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--foreground-muted)" }}>{cape}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-.04em", margin: 0, color: "var(--foreground)" }}>{account.username}</h1>
              <span style={{ display: "inline-block", marginTop: 6, fontSize: "0.75rem", fontWeight: 700, padding: "3px 12px", borderRadius: 999, background: `${typeColor}22`, color: typeColor, border: `1px solid ${typeColor}44`, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {account.type}
              </span>
            </div>
            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={toggleFav} title="Favorite" style={{ background: faved ? "rgba(214,55,113,0.1)" : "var(--glass-bg)", border: `1px solid ${faved ? "rgba(214,55,113,0.4)" : "var(--glass-border)"}`, borderRadius: 12, padding: "8px 14px", cursor: "pointer", fontSize: "1rem", color: faved ? "var(--primary)" : "var(--foreground-muted)", transition: "all 0.2s" }}>
                {faved ? "🤍" : "🖤"}
              </button>
              <button onClick={share} title="Copy link" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "8px 14px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, color: "var(--foreground-muted)", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                🔗 Share
              </button>
            </div>
          </div>

          {/* Description */}
          {account.description && (
            <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.25rem" }}>
              <p style={{ fontSize: ".95rem", color: "var(--foreground-muted)", lineHeight: 1.6, margin: 0 }}>{account.description}</p>
            </div>
          )}

          {/* Stats grid */}
          <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: ".25rem", margin: 0 }}>Name Changes</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)", margin: ".25rem 0 0" }}>{ncLabel(account.nameChanges)}</p>
            </div>
            <div>
              <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: ".25rem", margin: 0 }}>Type</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: typeColor, margin: ".25rem 0 0" }}>{account.type}</p>
            </div>
          </div>

          {/* Pricing + actions */}
          <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, margin: "0 0 .25rem" }}>Current Offer</p>
                <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--foreground)", margin: 0 }}>
                  {account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "—"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: ".65rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, margin: "0 0 .25rem" }}>Buy It Now</p>
                <p style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)", margin: 0 }}>
                  {account.price > 0 ? `$${account.price.toFixed(2)}` : "—"}
                </p>
              </div>
            </div>

            <button onClick={() => setShowOffer(true)} style={{ display: "block", width: "100%", background: "var(--primary)", color: "#fff", textAlign: "center", fontWeight: 800, fontSize: ".95rem", letterSpacing: ".08em", padding: "1rem", borderRadius: "1rem", border: "none", cursor: "pointer", transition: "opacity .2s", textTransform: "uppercase", boxShadow: "0 4px 20px rgba(214,55,113,0.3)" }}>
              🤍 Make an Offer
            </button>

            {account.price > 0 && account.discord && (
              <a href={`https://discord.com/users/${account.discord}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", width: "100%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--foreground-muted)", textAlign: "center", fontWeight: 600, fontSize: ".85rem", padding: ".75rem", borderRadius: "1rem", textDecoration: "none", transition: "all .2s" }}>
                Buy Now · ${account.price.toFixed(2)}
              </a>
            )}

            {/* Contact */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {account.discord && (
                <a href={`https://discord.com/users/${account.discord}`} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", background: "rgba(88,101,242,0.1)", border: "1px solid rgba(88,101,242,0.25)", borderRadius: 10, color: "#a8b0ff", fontSize: ".8rem", fontWeight: 600, textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                  Discord
                </a>
              )}
              {account.telegram && (
                <a href={`https://t.me/${account.telegram}`} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", background: "rgba(0,136,204,0.1)", border: "1px solid rgba(0,136,204,0.25)", borderRadius: 10, color: "#60a5fa", fontSize: ".8rem", fontWeight: 600, textDecoration: "none" }}>
                  ✈️ Telegram
                </a>
              )}
              {account.oguser && (
                <a href={account.oguser} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, color: "var(--foreground-muted)", fontSize: ".8rem", fontWeight: 600, textDecoration: "none" }}>
                  🌐 OGUsers
                </a>
              )}
            </div>
          </div>

          {/* Price History */}
          <PriceHistory accountId={account.id} />
        </div>
      </div>
    </div>
  );
}
