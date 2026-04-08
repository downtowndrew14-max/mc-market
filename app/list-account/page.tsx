"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MinecraftViewer = dynamic(() => import("@/components/MinecraftViewer"), { ssr: false });

const ACCOUNT_TYPES = ["Full Access", "OG Name", "Hypixel", "Rare Name"];
const CAPE_TYPES = ["Migrator", "Vanilla", "Optifine", "Lunar", "Other"];

export default function ListAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    price: "",
    type: "Full Access",
    hasCape: false,
    capeType: "",
    nameChanges: "0",
    description: "",
    discord: "",
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Something went wrong");
      setLoading(false);
      return;
    }
    router.push("/browse");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 text-white">List an Account</h1>
      <p className="text-sm text-gray-500 mb-8">Buyers will contact you via Discord.</p>

      <div className="flex gap-6">
        {/* Preview */}
        <div className="hidden md:flex flex-col items-center gap-3 w-40 shrink-0">
          <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl w-full flex flex-col items-center pt-4 pb-3 overflow-hidden">
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-green-500/10 blur-xl rounded-full" />
              {form.username ? (
                <MinecraftViewer username={form.username} width={100} height={150} animation="idle" />
              ) : (
                <div className="w-[100px] h-[150px] flex items-center justify-center text-gray-700 text-xs text-center px-2">
                  Preview will appear here
                </div>
              )}
            </div>
            <p className="text-xs font-semibold text-white mt-1 truncate max-w-full px-2">
              {form.username || "Username"}
            </p>
            <p className="text-sm font-bold text-green-400 mt-0.5">
              {form.price ? `$${parseFloat(form.price).toFixed(2)}` : "$0.00"}
            </p>
          </div>
          <p className="text-[10px] text-gray-600 text-center">Live preview</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="flex-1 bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">Minecraft Username *</label>
              <input
                type="text" required value={form.username}
                onChange={(e) => set("username", e.target.value)}
                placeholder="e.g. Notch"
                className="w-full bg-[#141414] border border-white/[0.06] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/30 placeholder-gray-700"
              />
            </div>
            <div className="w-28">
              <label className="block text-xs text-gray-500 mb-1.5">Price (USD) *</label>
              <input
                type="number" required min="0.01" step="0.01" value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#141414] border border-white/[0.06] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/30 placeholder-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Account Type</label>
            <div className="flex flex-wrap gap-2">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t} type="button"
                  onClick={() => set("type", t)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    form.type === t
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "border-white/[0.06] text-gray-500 hover:text-gray-300 bg-transparent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set("hasCape", !form.hasCape)}
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  form.hasCape ? "bg-green-500 border-green-500" : "border-white/20 bg-transparent"
                }`}
              >
                {form.hasCape && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-400">Has Cape</span>
            </label>
            {form.hasCape && (
              <select
                value={form.capeType}
                onChange={(e) => set("capeType", e.target.value)}
                className="flex-1 bg-[#141414] border border-white/[0.06] text-white text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="">Select cape type</option>
                {CAPE_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Name Changes Used</label>
            <input
              type="number" min="0" value={form.nameChanges}
              onChange={(e) => set("nameChanges", e.target.value)}
              className="w-24 bg-[#141414] border border-white/[0.06] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/30"
            />
            <p className="text-[11px] text-gray-700 mt-1">0 = original name, never changed</p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3} placeholder="Any extra details..."
              className="w-full bg-[#141414] border border-white/[0.06] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/30 placeholder-gray-700 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Discord *</label>
            <input
              type="text" required value={form.discord}
              onChange={(e) => set("discord", e.target.value)}
              placeholder="username or user ID"
              className="w-full bg-[#141414] border border-white/[0.06] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/30 placeholder-gray-700"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-900/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm py-2.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,222,128,0.25)] mt-1"
          >
            {loading ? "Listing..." : "List Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
