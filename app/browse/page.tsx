"use client";

import { useState, useEffect, useCallback } from "react";
import AccountCard from "@/components/AccountCard";
import { Account } from "@/lib/db";

const ACCOUNT_TYPES = ["all", "Full Access", "OG Name", "Hypixel", "Rare Name"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

export default function BrowsePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [hasCape, setHasCape] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type !== "all") params.set("type", type);
    if (hasCape) params.set("hasCape", "true");
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("sort", sort);
    const res = await fetch(`/api/accounts?${params}`);
    setAccounts(await res.json());
    setLoading(false);
  }, [search, type, hasCape, minPrice, maxPrice, sort]);

  useEffect(() => {
    const t = setTimeout(fetchAccounts, 200);
    return () => clearTimeout(t);
  }, [fetchAccounts]);

  return (
    <div className="flex gap-6 min-h-[80vh]">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 hidden md:flex flex-col gap-1">
        <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-4 sticky top-20 flex flex-col gap-5">

          {/* Type filter */}
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 font-medium">Type</p>
            <div className="flex flex-col gap-0.5">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-left text-sm px-2.5 py-1.5 rounded-lg transition-all duration-150 ${
                    type === t
                      ? "bg-green-500/10 text-green-400 font-medium"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                  }`}
                >
                  {t === "all" ? "All Types" : t}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 font-medium">Price (USD)</p>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-[#141414] border border-white/[0.06] text-sm text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-green-500/30 placeholder-gray-700"
              />
              <span className="text-gray-700 text-xs">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#141414] border border-white/[0.06] text-sm text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-green-500/30 placeholder-gray-700"
              />
            </div>
          </div>

          {/* Cape filter */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setHasCape(!hasCape)}
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                hasCape ? "bg-green-500 border-green-500" : "border-white/20 bg-transparent"
              }`}
            >
              {hasCape && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors select-none">Has Cape</span>
          </label>

          {/* Clear */}
          <button
            onClick={() => { setType("all"); setHasCape(false); setMinPrice(""); setMaxPrice(""); setSearch(""); setSort("newest"); }}
            className="text-xs text-gray-700 hover:text-gray-400 transition-colors text-left"
          >
            Clear filters
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Search + sort */}
        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-white/[0.06] text-white text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-white/[0.12] placeholder-gray-700"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#0f0f0f] border border-white/[0.06] text-gray-400 text-sm rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Count */}
        <p className="text-xs text-gray-700 mb-4">
          {loading ? "Loading..." : `${accounts.length} listing${accounts.length !== 1 ? "s" : ""}`}
        </p>

        {/* Grid */}
        {!loading && accounts.length === 0 ? (
          <div className="text-center py-24 text-gray-700">
            <p className="text-5xl font-bold mb-3">0</p>
            <p className="text-sm">No accounts match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {accounts.map((a) => (
              <AccountCard key={a.id} account={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
