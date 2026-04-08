"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ACCOUNT_TYPES, ALL_CAPES } from "@/lib/db";

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
      setError("Please confirm ownership and agree to the proxy fee.");
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
        type: form.types[0] ?? "Other",
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

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "2rem", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-.04em", color: "var(--foreground)", marginBottom: ".25rem" }}>List Your Account</h1>
      <p style={{ fontSize: ".9rem", color: "var(--foreground-subtle)", marginBottom: "2rem" }}>Fill out the form below to submit your account for listing.</p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Username */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <label style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
            Account Username <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            className="glass-input"
            type="text"
            required
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            placeholder="e.g. Reprising, R****se"
            style={{ width: "100%" }}
          />
        </div>

        {/* Account Type */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <label style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
            Account Type <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div className="checkbox-group" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: ".5rem" }}>
            {ACCOUNT_TYPES.map((t) => (
              <label key={t} className="checkbox-label">
                <input type="checkbox" checked={form.types.includes(t)} onChange={() => toggleType(t)} />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* Name Changes */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <label style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
            Name Changes <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--foreground)" }}>
              {form.nameChanges === 0 ? "Prename (0)" : form.nameChanges >= 15 ? "15+" : form.nameChanges}
            </span>
          </div>
          <input
            type="range"
            className="range-input"
            min={0}
            max={15}
            value={form.nameChanges}
            onChange={(e) => setForm((p) => ({ ...p, nameChanges: parseInt(e.target.value) }))}
          />
          <div className="range-labels">
            <span>Prename (0)</span>
            <span>15+</span>
          </div>
        </div>

        {/* Description */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <label style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
            Description <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={4}
            placeholder="Include OGO, stats, bans, cosmetics, etc."
            style={{
              width: "100%",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
              padding: ".75rem 1rem",
              fontSize: ".9rem",
              color: "var(--foreground)",
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* BIN + C/O */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <label style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
              BIN (Buy It Now) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              className="glass-input"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              placeholder="0 if no BIN"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <label style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>
              C/O (Current Offer) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              className="glass-input"
              type="number"
              min="0"
              step="0.01"
              value={form.currentOffer}
              onChange={(e) => setForm((p) => ({ ...p, currentOffer: e.target.value }))}
              placeholder="0 if no offer"
            />
          </div>
        </div>

        {/* Capes */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <label style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Capes (Optional)</label>
          <div className="checkbox-group" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: ".5rem" }}>
            {ALL_CAPES.map((c) => (
              <label key={c} className="checkbox-label">
                <input type="checkbox" checked={form.capes.includes(c)} onChange={() => toggleCape(c)} />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: ".7rem", color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: ".25rem" }}>Contact Information</p>
            <p style={{ fontSize: ".8rem", color: "var(--foreground-subtle)" }}>Provide at least one contact method.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: ".4rem" }}>OGUser Profile Link</label>
              <input
                className="glass-input"
                type="text"
                value={form.oguser}
                onChange={(e) => setForm((p) => ({ ...p, oguser: e.target.value }))}
                placeholder="https://oguser.com/..."
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: ".4rem" }}>Discord User ID</label>
              <input
                className="glass-input"
                type="text"
                value={form.discord}
                onChange={(e) => setForm((p) => ({ ...p, discord: e.target.value }))}
                placeholder="Discord user ID (numbers)"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: ".4rem" }}>Telegram Username</label>
              <input
                className="glass-input"
                type="text"
                value={form.telegram}
                onChange={(e) => setForm((p) => ({ ...p, telegram: e.target.value }))}
                placeholder="username (without @)"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Agreements */}
        <div className="glass" style={{ borderRadius: "var(--radius)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <label className="checkbox-label" style={{ padding: ".75rem 1rem", borderRadius: 12, border: "1px solid var(--glass-border)", cursor: "pointer" }}>
            <input type="checkbox" checked={form.ownerConfirm} onChange={(e) => setForm((p) => ({ ...p, ownerConfirm: e.target.checked }))} />
            <span>I am the owner of this account. <span style={{ color: "#ef4444" }}>*</span></span>
          </label>
          <label className="checkbox-label" style={{ padding: ".75rem 1rem", borderRadius: 12, border: "1px solid var(--glass-border)", cursor: "pointer" }}>
            <input type="checkbox" checked={form.feeConfirm} onChange={(e) => setForm((p) => ({ ...p, feeConfirm: e.target.checked }))} />
            <span>I agree with the 4% proxy fee if the site finds a buyer. <span style={{ color: "#ef4444" }}>*</span></span>
          </label>
        </div>

        {error && (
          <p style={{ fontSize: ".85rem", color: "#ef4444", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, padding: ".75rem 1rem" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: "var(--foreground)",
            color: "var(--background)",
            border: "none",
            borderRadius: "1rem",
            padding: "1rem",
            fontSize: ".9rem",
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "opacity .2s",
          }}
        >
          {loading ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}
