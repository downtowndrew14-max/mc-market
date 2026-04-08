"use client";

import { useState, useEffect, useCallback } from "react";
import AccountCard from "@/components/AccountCard";
import { Account } from "@/lib/db";

const ACCOUNT_TYPES = ["all", "Full Access", "OG Name", "Hypixel", "Rare Name"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
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

    const res = await fetch(`/api/accounts?${params.toString()}`);
    const data = await res.json();
    setAccounts(data);
    setLoading(false);
  }, [search, type, hasCape, minPrice, maxPrice, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchAccounts, 200);
    return () => clearTimeout(timer);
  }, [fetchAccounts]);

  return (
    <div className="flex gap-6">
      {/* Sidebar filters */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-5 sticky top-20">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Type</p>
            <div className="flex flex-col gap-1">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`text-left text-sm px-2 py-1 rounded-md transition-colors capitalize ${
                    type === t
                      ? "bg-green-500/10 text-green-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t === "all" ? "All Types" : t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Price (USD)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white rounded-md px-2 py-1.5 focus:outline-none focus:border-green-500/50"
              />
              <span className="text-gray-600">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white rounded-md px-2 py-1.5 focus:outline-none focus:border-green-500/50"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCape}
                onChange={(e) => setHasCape(e.target.checked)}
                className="accent-green-500 w-4 h-4"
              />
              <span className="text-sm text-gray-300">Has Cape</span>
            </label>
          </div>

          <button
            onClick={() => {
              setType("all");
              setHasCape(false);
              setMinPrice("");
              setMaxPrice("");
              setSearch("");
              setSort("newest");
            }}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors text-left"
          >
            Clear filters
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Search + sort bar */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Search username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#111] border border-[#1f1f1f] text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-green-500/50 placeholder-gray-600"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#111] border border-[#1f1f1f] text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-600 mb-4">
          {loading ? "Loading..." : `${accounts.length} listing${accounts.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Grid */}
        {!loading && accounts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-4xl mb-3">0</p>
            <p className="text-sm">No accounts match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {accounts.map((a) => (
              <AccountCard key={a.id} account={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
