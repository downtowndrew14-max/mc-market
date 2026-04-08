"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ACCOUNT_TYPES, ALL_CAPES, getCapeImageUrl } from "@/lib/db";

export default function ListAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    price: "",
    currentOffer: "",
    types: [] as string[],
    capes: [] as string[],
    nameChanges: 0,
    description: "",
    discord: "",
    oguser: "",
    telegram: "",
    ownerConfirm: false,
    feeConfirm: false,
  });

  function toggleType(t: string) {
    setForm((p) => ({
      ...p,
      types: p.types.includes(t) ? p.types.filter((x) => x !== t) : [...p.types, t],
    }));
  }

  function toggleCape(c: string) {
    setForm((p) => ({
      ...p,
      capes: p.capes.includes(c) ? p.capes.filter((x) => x !== c) : [...p.capes, c],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.ownerConfirm || !form.feeConfirm) {
      setError("Please confirm both boxes before submitting.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        price: form.price || "0",
        currentOffer: form.currentOffer || "0",
        type: form.types[0] ?? "OG",
        capes: form.capes,
        nameChanges: form.nameChanges,
        description: form.description,
        discord: form.discord,
        oguser: form.oguser,
        telegram: form.telegram,
      }),
    });
    if (!res.ok) { setError((await res.json()).error ?? "Error"); setLoading(false); return; }
    router.push("/browse");
  }

  const card: React.CSSProperties = { borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" };
  const sectionLabel: React.CSSProperties = { fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 };

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "2rem", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-.04em", color: "var(--foreground)", marginBottom: ".25rem" }}>List Your Account</h1>
      <p style={{ fontSize: ".9rem", color: "var(--foreground-subtle)", marginBottom: "2rem" }}>Fill out the form below to submit your account for listing.</p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Username */}
        <div className="glass" style={card}>
          <label style={sectionLabel}>Account Username <span style={{ color: "#ef4444" }}>*</span></label>
          <input className="glass-input" type="text" required value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            placeholder="e.g. Reprising, R****se" style={{ width: "100%" }} />
        </div>

        {/* Account Type */}
        <div className="glass" style={card}>
          <label style={sectionLabel}>Account Type <span style={{ color: "#ef4444" }}>*</span></label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: ".5rem" }}>
            {ACCOUNT_TYPES.map((t) => (
              <label key={t} className="checkbox-label" style={{
                padding: ".6rem .9rem",
                borderRadius: 10,
                border: `1px solid ${form.types.includes(t) ? "var(--primary)" : "var(--card-border)"}`,
                background: form.types.includes(t) ? "rgba(214,55,113,.08)" : "transparent",
                transition: "all .2s",
              }}>
                <input type="checkbox" checked={form.types.includes(t)} onChange={() => toggleType(t)} />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* Name Changes */}
        <div className="glass" style={card}>
          <label style={sectionLabel}>Name Changes <span style={{ color: "#ef4444" }}>*</span></label>
          <span style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--foreground)" }}>
            {form.nameChanges === 0 ? "Prename (0)" : form.nameChanges >= 15 ? "15+" : form.nameChanges}
          </span>
          <input type="range" className="range-input" min={0} max={15} value={form.nameChanges}
            onChange={(e) => setForm((p) => ({ ...p, nameChanges: parseInt(e.target.value) }))} />
          <div className="range-labels"><span>Prename (0)</span><span>15+</span></div>
        </div>

        {/* Description */}
        <div className="glass" style={card}>
          <label style={sectionLabel}>Description <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea required value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={4} placeholder="Include OGO, stats, bans, cosmetics, etc."
            style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--card-border)", borderRadius: 12, padding: ".75rem 1rem", fontSize: ".9rem", color: "var(--foreground)", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
        </div>

        {/* BIN + C/O */}
        <div className="glass" style={{ ...card, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", flexDirection: undefined }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <label style={sectionLabel}>BIN (Buy It Now) <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="glass-input" type="number" min="0" step="0.01" value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0 if no BIN" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <label style={sectionLabel}>C/O (Current Offer) <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="glass-input" type="number" min="0" step="0.01" value={form.currentOffer}
              onChange={(e) => setForm((p) => ({ ...p, currentOffer: e.target.value }))} placeholder="0 if no offer" />
          </div>
        </div>

        {/* Capes */}
        <div className="glass" style={card}>
          <label style={sectionLabel}>Capes (Optional)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: ".5rem" }}>
            {ALL_CAPES.map((c) => {
              const imgUrl = getCapeImageUrl(c);
              const selected = form.capes.includes(c);
              return (
                <label key={c} onClick={() => toggleCape(c)} style={{
                  display: "flex", alignItems: "center", gap: ".65rem",
                  padding: ".5rem .75rem", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${selected ? "var(--primary)" : "var(--card-border)"}`,
                  background: selected ? "rgba(214,55,113,.08)" : "transparent",
                  transition: "all .2s",
                }}>
                  <input type="checkbox" checked={selected} onChange={() => toggleCape(c)}
                    style={{ accentColor: "var(--primary)", width: 15, height: 15, flexShrink: 0 }} />
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgUrl} alt={c} style={{ width: 28, height: 28, objectFit: "contain", imageRendering: "pixelated", flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 28, height: 28, borderRadius: 4, background: "var(--card-border)", flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: ".85rem", color: selected ? "var(--primary)" : "var(--foreground-muted)", fontWeight: selected ? 700 : 500, lineHeight: 1.2 }}>{c}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <div className="glass" style={card}>
          <div>
            <p style={sectionLabel}>Contact Information</p>
            <p style={{ fontSize: ".8rem", color: "var(--foreground-subtle)", marginTop: ".25rem" }}>Provide at least one contact method.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: ".4rem" }}>OGUser Profile Link</label>
              <input className="glass-input" type="text" value={form.oguser}
                onChange={(e) => setForm((p) => ({ ...p, oguser: e.target.value }))}
                placeholder="https://oguser.com/..." style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: ".4rem" }}>Discord User ID</label>
              <input className="glass-input" type="text" value={form.discord}
                onChange={(e) => setForm((p) => ({ ...p, discord: e.target.value }))}
                placeholder="Discord user ID (numbers)" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: ".4rem" }}>Telegram Username</label>
              <input className="glass-input" type="text" value={form.telegram}
                onChange={(e) => setForm((p) => ({ ...p, telegram: e.target.value }))}
                placeholder="username (without @)" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Agreements */}
        <div className="glass" style={card}>
          <label onClick={() => setForm(p => ({ ...p, ownerConfirm: !p.ownerConfirm }))} style={{
            display: "flex", alignItems: "flex-start", gap: ".75rem",
            padding: ".85rem 1rem", borderRadius: 12,
            border: `1px solid ${form.ownerConfirm ? "var(--primary)" : "var(--card-border)"}`,
            background: form.ownerConfirm ? "rgba(214,55,113,.06)" : "transparent",
            cursor: "pointer", transition: "all .2s",
          }}>
            <input type="checkbox" checked={form.ownerConfirm} onChange={(e) => setForm((p) => ({ ...p, ownerConfirm: e.target.checked }))}
              style={{ accentColor: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: ".9rem", color: "var(--foreground-muted)" }}>
              I confirm that I am the owner of this account. <span style={{ color: "#ef4444" }}>*</span>
            </span>
          </label>

          <label onClick={() => setForm(p => ({ ...p, feeConfirm: !p.feeConfirm }))} style={{
            display: "flex", alignItems: "flex-start", gap: ".75rem",
            padding: ".85rem 1rem", borderRadius: 12,
            border: `1px solid ${form.feeConfirm ? "var(--primary)" : "var(--card-border)"}`,
            background: form.feeConfirm ? "rgba(214,55,113,.06)" : "transparent",
            cursor: "pointer", transition: "all .2s",
          }}>
            <input type="checkbox" checked={form.feeConfirm} onChange={(e) => setForm((p) => ({ ...p, feeConfirm: e.target.checked }))}
              style={{ accentColor: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: ".9rem", color: "var(--foreground-muted)" }}>
              I understand that listing is <strong style={{ color: "var(--primary)" }}>currently free</strong>. A small fee may be introduced in the future. <span style={{ color: "#ef4444" }}>*</span>
            </span>
          </label>
        </div>

        {error && (
          <p style={{ fontSize: ".85rem", color: "#ef4444", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, padding: ".75rem 1rem" }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%", background: "var(--primary)", color: "#fff", border: "none",
          borderRadius: "1rem", padding: "1rem", fontSize: ".9rem", fontWeight: 800,
          letterSpacing: ".1em", textTransform: "uppercase",
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, transition: "opacity .2s",
        }}>
          {loading ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}
