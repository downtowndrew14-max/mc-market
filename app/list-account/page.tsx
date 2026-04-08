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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">List Your Account</h1>
        <p className="text-sm text-gray-400 mb-8">Fill out the form below to submit your account for listing approval.</p>

        <form onSubmit={submit} className="flex flex-col gap-7">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Account Username <span className="text-red-500">*</span>
            </label>
            <input type="text" required value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="Enter the account username (e.g. Reprising, R****se)"
              className="w-full border border-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400" />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ACCOUNT_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" checked={form.types.includes(t)} onChange={() => toggleType(t)} className="w-3.5 h-3.5 accent-gray-900" />
                  <span className="text-sm text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Name Changes */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Number of Name Changes: {form.nameChanges === 0 ? "Prename" : form.nameChanges >= 15 ? "15+" : form.nameChanges} <span className="text-red-500">*</span>
            </label>
            <input type="range" min={0} max={15} value={form.nameChanges}
              onChange={(e) => setForm((p) => ({ ...p, nameChanges: parseInt(e.target.value) }))}
              className="w-full" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Prename (0)</span>
              <span>15+</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4} placeholder="Include OGO, stats, bans, cosmetics, etc."
              className="w-full border border-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400 resize-none" />
          </div>

          {/* BIN + C/O */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                BIN (Buy It Now) <span className="text-red-500">*</span>
              </label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="Put 0 if you don't have a set BIN"
                className="w-full border border-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                C/O (Current Offer) <span className="text-red-500">*</span>
              </label>
              <input type="number" min="0" step="0.01" value={form.currentOffer} onChange={(e) => setForm((p) => ({ ...p, currentOffer: e.target.value }))}
                placeholder="Put 0 if no current offer"
                className="w-full border border-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400" />
            </div>
          </div>

          {/* Capes */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Capes (Optional)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_CAPES.map((c) => (
                <label key={c} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={form.capes.includes(c)} onChange={() => toggleCape(c)} className="w-3.5 h-3.5 accent-gray-900 shrink-0" />
                  <span className="text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-0.5">Contact Information</h2>
            <p className="text-xs text-gray-400 mb-3">Provide at least one contact method. Leave blank if you don't have that social.</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OGUser Profile Link</label>
                <input type="text" value={form.oguser} onChange={(e) => setForm((p) => ({ ...p, oguser: e.target.value }))}
                  placeholder="https://oguser.com/..."
                  className="w-full border border-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discord Username</label>
                <input type="text" value={form.discord} onChange={(e) => setForm((p) => ({ ...p, discord: e.target.value }))}
                  placeholder="username"
                  className="w-full border border-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                <input type="text" value={form.telegram} onChange={(e) => setForm((p) => ({ ...p, telegram: e.target.value }))}
                  placeholder="username"
                  className="w-full border border-gray-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400" />
              </div>
            </div>
          </div>

          {/* Agreements */}
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-3 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={form.ownerConfirm} onChange={(e) => setForm((p) => ({ ...p, ownerConfirm: e.target.checked }))}
                className="w-4 h-4 accent-gray-900 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700">I am the owner of this account. <span className="text-red-500">*</span></span>
            </label>
            <label className="flex items-start gap-3 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={form.feeConfirm} onChange={(e) => setForm((p) => ({ ...p, feeConfirm: e.target.checked }))}
                className="w-4 h-4 accent-gray-900 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700">I agree with the 4% proxy fee that will be taken if the site finds a buyer. <span className="text-red-500">*</span></span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl transition-colors tracking-wide uppercase">
            {loading ? "Submitting..." : "Submit Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
