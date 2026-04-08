"use client";

import { useState, useEffect, useCallback } from "react";
import AccountCard from "@/components/AccountCard";
import { Account, ACCOUNT_TYPES } from "@/lib/db";

const SORT_OPTIONS = [
  { value: "newest", label: "Date: Recent" },
  { value: "oldest", label: "Date: Oldest" },
  { value: "bin-asc", label: "BIN: Low to High" },
  { value: "bin-desc", label: "BIN: High to Low" },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-2">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{title}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`} viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default function BrowsePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceType, setPriceType] = useState("both");
  const [maxNameChanges, setMaxNameChanges] = useState(15);
  const [minUsernameLen, setMinUsernameLen] = useState("");
  const [maxUsernameLen, setMaxUsernameLen] = useState("");
  const [sort, setSort] = useState("newest");

  const toggleType = (t: string) =>
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    selectedTypes.forEach((t) => params.append("type", t));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (priceType !== "both") params.set("priceType", priceType);
    if (maxNameChanges < 15) params.set("maxNameChanges", String(maxNameChanges));
    if (minUsernameLen) params.set("minUsernameLen", minUsernameLen);
    if (maxUsernameLen) params.set("maxUsernameLen", maxUsernameLen);
    params.set("sort", sort);
    const res = await fetch(`/api/accounts?${params}`);
    setAccounts(await res.json());
    setLoading(false);
  }, [search, selectedTypes, minPrice, maxPrice, priceType, maxNameChanges, minUsernameLen, maxUsernameLen, sort]);

  useEffect(() => {
    const t = setTimeout(fetchAccounts, 200);
    return () => clearTimeout(t);
  }, [fetchAccounts]);

  return (
    <div className="flex gap-6 min-h-[80vh]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 sticky top-20 border border-gray-100">

          <FilterSection title="Sort By">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-200 text-sm text-gray-700 rounded-lg px-2.5 py-2 focus:outline-none bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FilterSection>

          <FilterSection title="Price Range">
            <div className="flex items-center gap-1.5">
              <input type="number" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-200 text-sm rounded-lg px-2.5 py-1.5 focus:outline-none bg-white placeholder-gray-400" />
              <span className="text-gray-300">-</span>
              <input type="number" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 text-sm rounded-lg px-2.5 py-1.5 focus:outline-none bg-white placeholder-gray-400" />
            </div>
          </FilterSection>

          <FilterSection title="Price Type">
            <select value={priceType} onChange={(e) => setPriceType(e.target.value)}
              className="w-full border border-gray-200 text-sm text-gray-700 rounded-lg px-2.5 py-2 focus:outline-none bg-white cursor-pointer">
              <option value="both">Both</option>
              <option value="bin">BIN Only</option>
              <option value="co">C/O Only</option>
            </select>
          </FilterSection>

          <FilterSection title="Account Type">
            <div className="flex flex-col gap-1.5">
              {ACCOUNT_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t)}
                    onChange={() => toggleType(t)}
                    className="w-3.5 h-3.5 accent-gray-900 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{t}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Name Changes">
            <div className="px-1">
              <input
                type="range" min={0} max={15} value={maxNameChanges}
                onChange={(e) => setMaxNameChanges(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>0</span>
                <span className="text-gray-600 font-medium">Max: {maxNameChanges >= 15 ? "15+" : maxNameChanges}</span>
                <span>15+</span>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Username Length" defaultOpen={false}>
            <div className="flex items-center gap-1.5">
              <input type="number" placeholder="Min" value={minUsernameLen} onChange={(e) => setMinUsernameLen(e.target.value)}
                className="w-full border border-gray-200 text-sm rounded-lg px-2.5 py-1.5 focus:outline-none bg-white placeholder-gray-400" />
              <span className="text-gray-300">-</span>
              <input type="number" placeholder="Max" value={maxUsernameLen} onChange={(e) => setMaxUsernameLen(e.target.value)}
                className="w-full border border-gray-200 text-sm rounded-lg px-2.5 py-1.5 focus:outline-none bg-white placeholder-gray-400" />
            </div>
          </FilterSection>

        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <input
          type="text" placeholder="Search by username..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 mb-5 focus:outline-none focus:border-gray-300 placeholder-gray-400 shadow-sm"
        />

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Minecraft Accounts</h1>
          <span className="text-sm text-gray-400">
            {loading ? "Loading..." : `${accounts.length} account${accounts.length !== 1 ? "s" : ""} found`}
          </span>
        </div>

        <div className="h-px bg-gray-200 mb-5" />

        {!loading && accounts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl font-bold mb-2">0</p>
            <p className="text-sm">No accounts match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((a) => <AccountCard key={a.id} account={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
