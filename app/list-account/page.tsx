"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/browse");
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-1">List an Account</h1>
      <p className="text-sm text-gray-500 mb-6">Fill in the details below. Buyers will contact you via Discord.</p>

      <form onSubmit={submit} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 flex flex-col gap-4">
        {/* Username */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Minecraft Username *</label>
          <input
            type="text"
            required
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            placeholder="e.g. Notch"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/50 placeholder-gray-600"
          />
        </div>

        {/* Price + Type */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Price (USD) *</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/50 placeholder-gray-600"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Account Type</label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cape */}
        <div className="flex items-start gap-4">
          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasCape}
              onChange={(e) => set("hasCape", e.target.checked)}
              className="accent-green-500 w-4 h-4"
            />
            <span className="text-sm text-gray-300">Has Cape</span>
          </label>
          {form.hasCape && (
            <div className="flex-1">
              <select
                value={form.capeType}
                onChange={(e) => set("capeType", e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="">Select cape type</option>
                {CAPE_TYPES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Name changes */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Name Changes Used</label>
          <input
            type="number"
            min="0"
            value={form.nameChanges}
            onChange={(e) => set("nameChanges", e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/50"
          />
          <p className="text-xs text-gray-600 mt-1">0 = original name, never changed</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            placeholder="Any extra details about the account..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/50 placeholder-gray-600 resize-none"
          />
        </div>

        {/* Discord */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Discord *</label>
          <input
            type="text"
            required
            value={form.discord}
            onChange={(e) => set("discord", e.target.value)}
            placeholder="yourname or user ID"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500/50 placeholder-gray-600"
          />
          <p className="text-xs text-gray-600 mt-1">Buyers will contact you here</p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm py-2.5 rounded-lg transition-colors mt-1"
        >
          {loading ? "Listing..." : "List Account"}
        </button>
      </form>
    </div>
  );
}
