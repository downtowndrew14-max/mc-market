"use client";

import { useState, useEffect, useCallback } from "react";
import AccountCard from "@/components/AccountCard";
import { Account, ACCOUNT_TYPES } from "@/lib/db";

const SORT_OPTIONS = [
  { value: "newest", label: "Date: Recent" },
  { value: "oldest", label: "Date: Oldest" },
  { value: "bin-asc", label: "Price: Low → High" },
  { value: "bin-desc", label: "Price: High → Low" },
];

const PRICE_TYPES = [
  { value: "both", label: "Both" },
  { value: "co", label: "Current Offers" },
  { value: "bin", label: "BINs Only" },
];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <div className="filter-heading-row" onClick={() => setOpen(!open)}>
        <span className="filter-heading">{title}</span>
        <span className={`filter-chevron${open ? "" : " collapsed"}`}>
          <svg width="12" height="12" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </div>
      <div className={`filter-content${open ? "" : " collapsed"}`}>{children}</div>
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
  const [maxNC, setMaxNC] = useState(15);
  const [minLen, setMinLen] = useState("");
  const [maxLen, setMaxLen] = useState("");
  const [sort, setSort] = useState("newest");

  const toggleType = (t: string) =>
    setSelectedTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    selectedTypes.forEach((t) => p.append("type", t));
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (priceType !== "both") p.set("priceType", priceType);
    if (maxNC < 15) p.set("maxNameChanges", String(maxNC));
    if (minLen) p.set("minUsernameLen", minLen);
    if (maxLen) p.set("maxUsernameLen", maxLen);
    p.set("sort", sort);
    const res = await fetch(`/api/accounts?${p}`);
    setAccounts(await res.json());
    setLoading(false);
  }, [search, selectedTypes, minPrice, maxPrice, priceType, maxNC, minLen, maxLen, sort]);

  useEffect(() => {
    const t = setTimeout(fetchAccounts, 200);
    return () => clearTimeout(t);
  }, [fetchAccounts]);

  return (
    <div className="page-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <FilterSection title="Sort By">
          <select className="glass-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FilterSection>

        <FilterSection title="Price Range">
          <div className="filter-row">
            <input className="glass-input" type="number" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <span className="filter-separator">-</span>
            <input className="glass-input" type="number" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </FilterSection>

        <FilterSection title="Price Type">
          <select className="glass-select" value={priceType} onChange={(e) => setPriceType(e.target.value)}>
            {PRICE_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FilterSection>

        <FilterSection title="Account Type">
          <div className="checkbox-group">
            {ACCOUNT_TYPES.map((t) => (
              <label key={t} className="checkbox-label">
                <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)} />
                {t}
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Name Changes">
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--foreground-muted)", fontSize: ".9rem", fontWeight: 600 }}>
                Max: {maxNC >= 15 ? "15+" : maxNC}
              </span>
            </div>
            <input type="range" className="range-input" min={0} max={15} value={maxNC} onChange={(e) => setMaxNC(parseInt(e.target.value))} />
            <div className="range-labels">
              <span>0</span>
              <span>15+</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Username Length">
          <div className="filter-row">
            <input className="glass-input" type="number" placeholder="Min" value={minLen} onChange={(e) => setMinLen(e.target.value)} />
            <span className="filter-separator">-</span>
            <input className="glass-input" type="number" placeholder="Max" value={maxLen} onChange={(e) => setMaxLen(e.target.value)} />
          </div>
        </FilterSection>
      </aside>

      {/* Main */}
      <div className="grid-container">
        <div>
          <input
            className="search-bar"
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid-header">
          <h2>Minecraft Accounts</h2>
          <span className="grid-count">
            {loading ? "Loading..." : `${accounts.length} account${accounts.length !== 1 ? "s" : ""} found`}
          </span>
        </div>
        {!loading && accounts.length === 0 ? (
          <div className="grid-empty">No accounts found</div>
        ) : (
          <div className="accounts-grid">
            {accounts.map((a) => <AccountCard key={a.id} account={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
