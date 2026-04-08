"use client";

import { useEffect, useState, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type AccountStatus = "pending" | "approved" | "rejected";

interface Account {
  id: string;
  username: string;
  price: number;
  currentOffer: number;
  type: string;
  capes: string;
  nameChanges: number;
  description: string;
  discord: string;
  oguser: string;
  telegram: string;
  status: AccountStatus;
  createdAt: string;
}

type Tab = "all" | AccountStatus;

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<AccountStatus, string> = {
  pending: "#f59e0b",
  approved: "#22c55e",
  rejected: "#ef4444",
};

const STATUS_BG: Record<AccountStatus, string> = {
  pending: "rgba(245,158,11,.15)",
  approved: "rgba(34,197,94,.15)",
  rejected: "rgba(239,68,68,.15)",
};

// ── Admin Panel Page ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(false);

  // On mount: check localStorage for saved admin key
  useEffect(() => {
    const saved = localStorage.getItem("adminKey");
    if (saved) {
      setAdminKey(saved);
    }
  }, []);

  // Fetch accounts whenever adminKey is set
  const fetchAccounts = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const data: Account[] = await res.json();
        setAccounts(data);
      } else if (res.status === 401) {
        // Key became invalid — log out
        localStorage.removeItem("adminKey");
        setAdminKey(null);
        setAuthError("Session expired. Please log in again.");
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      fetchAccounts(adminKey);
    }
  }, [adminKey, fetchAccounts]);

  // ── Login ─────────────────────────────────────────────────────────────────

  async function handleLogin() {
    setAuthError("");
    if (!passwordInput.trim()) return;
    const res = await fetch("/api/admin/accounts", {
      headers: { Authorization: `Bearer ${passwordInput}` },
    });
    if (res.ok) {
      localStorage.setItem("adminKey", passwordInput);
      setAdminKey(passwordInput);
      setPasswordInput("");
    } else {
      setAuthError("Wrong password. Please try again.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminKey");
    setAdminKey(null);
    setAccounts([]);
    setPasswordInput("");
    setAuthError("");
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async function doAction(
    id: string,
    action: "approve" | "reject" | "delete"
  ) {
    if (!adminKey) return;

    if (action === "delete") {
      const ok = window.confirm(
        "Are you sure you want to permanently delete this listing? This cannot be undone."
      );
      if (!ok) return;

      await fetch("/api/admin/accounts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ id }),
      });
    } else {
      const status = action === "approve" ? "approved" : "rejected";
      await fetch("/api/admin/accounts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ id, status }),
      });
    }

    // Re-fetch to reflect updated state
    await fetchAccounts(adminKey);
  }

  // ── Filtered accounts for current tab ────────────────────────────────────

  const filtered =
    tab === "all" ? accounts : accounts.filter((a) => a.status === tab);

  const counts = {
    all: accounts.length,
    pending: accounts.filter((a) => a.status === "pending").length,
    approved: accounts.filter((a) => a.status === "approved").length,
    rejected: accounts.filter((a) => a.status === "rejected").length,
  };

  // ── Login Screen ──────────────────────────────────────────────────────────

  if (!adminKey) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
          padding: "2rem",
        }}
      >
        <div
          className="glass"
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "2.5rem",
            borderRadius: "var(--radius)",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌸</div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--primary)",
              marginBottom: "0.25rem",
            }}
          >
            Admin Panel
          </h1>
          <p
            style={{
              color: "var(--foreground-muted)",
              fontSize: "0.9rem",
              marginBottom: "1.75rem",
            }}
          >
            Enter your admin password to continue.
          </p>

          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1.5px solid var(--glass-border-bright)",
              background: "var(--input-bg)",
              color: "var(--foreground)",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "1rem",
            }}
          />

          {authError && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {authError}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        padding: "0 0 4rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--nav-border)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "var(--primary)",
          }}
        >
          🌸 Admin Panel
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: "0.625rem",
            border: "1.5px solid var(--glass-border-bright)",
            background: "transparent",
            color: "var(--foreground-muted)",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem 0" }}>
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          {(["all", "pending", "approved", "rejected"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "2rem",
                border:
                  tab === t
                    ? "1.5px solid var(--primary)"
                    : "1.5px solid var(--glass-border)",
                background:
                  tab === t ? "var(--primary)" : "var(--glass-bg)",
                color: tab === t ? "#fff" : "var(--foreground-muted)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.15s",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span
                style={{
                  background:
                    tab === t
                      ? "rgba(255,255,255,.25)"
                      : "var(--primary-glow)",
                  color: tab === t ? "#fff" : "var(--primary)",
                  borderRadius: "1rem",
                  padding: "0 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  minWidth: "1.4rem",
                  textAlign: "center",
                }}
              >
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--foreground-muted)",
            }}
          >
            Loading listings...
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--foreground-muted)",
            }}
          >
            No listings found for this filter.
          </div>
        )}

        {/* Account cards grid */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filtered.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onAction={doAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Account Card Component ────────────────────────────────────────────────────

interface AccountCardProps {
  account: Account;
  onAction: (id: string, action: "approve" | "reject" | "delete") => Promise<void>;
}

function AccountCard({ account, onAction }: AccountCardProps) {
  const status = account.status as AccountStatus;
  const capeList = account.capes
    ? account.capes
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  const contactParts: string[] = [];
  if (account.discord) contactParts.push(`Discord: ${account.discord}`);
  if (account.oguser) contactParts.push(`OGUser: ${account.oguser}`);
  if (account.telegram) contactParts.push(`Telegram: ${account.telegram}`);

  const nameChangesLabel =
    account.nameChanges === 0
      ? "Pre-name"
      : account.nameChanges >= 15
      ? "15+ changes"
      : `${account.nameChanges} changes`;

  return (
    <div
      className="glass"
      style={{
        borderRadius: "var(--radius)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Header row: username + badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Mini avatar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc-heads.net/head/${account.username}/40`}
            alt={account.username}
            width={36}
            height={36}
            style={{ borderRadius: "0.375rem", imageRendering: "pixelated" }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "var(--foreground)",
            }}
          >
            {account.username}
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          {/* Type badge */}
          <span
            style={{
              background: "var(--primary-glow)",
              color: "var(--primary)",
              borderRadius: "0.375rem",
              padding: "0.2rem 0.6rem",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {account.type}
          </span>
          {/* Status badge */}
          <span
            style={{
              background: STATUS_BG[status],
              color: STATUS_COLORS[status],
              borderRadius: "0.375rem",
              padding: "0.2rem 0.6rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Prices */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {account.price > 0 && (
          <span style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
            BIN:{" "}
            <strong style={{ color: "var(--primary)" }}>
              ${account.price.toFixed(2)}
            </strong>
          </span>
        )}
        {account.currentOffer > 0 && (
          <span style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
            C/O:{" "}
            <strong style={{ color: "var(--foreground)" }}>
              ${account.currentOffer.toFixed(2)}
            </strong>
          </span>
        )}
      </div>

      {/* Description */}
      {account.description && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--foreground-muted)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
          }}
        >
          {account.description}
        </p>
      )}

      {/* Details row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          fontSize: "0.8rem",
          color: "var(--foreground-subtle)",
        }}
      >
        <span>🔄 {nameChangesLabel}</span>
        {capeList.length > 0 && (
          <span>🧥 {capeList.length} cape{capeList.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Contact info */}
      {contactParts.length > 0 && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--foreground-muted)",
            background: "var(--glass-bg)",
            borderRadius: "0.625rem",
            padding: "0.5rem 0.75rem",
            lineHeight: 1.6,
          }}
        >
          {contactParts.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
      )}

      {/* Listing ID + date */}
      <div
        style={{
          fontSize: "0.72rem",
          color: "var(--foreground-subtle)",
          fontFamily: "monospace",
        }}
      >
        ID: {account.id} &middot;{" "}
        {new Date(account.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
        {status === "pending" && (
          <>
            <ActionButton
              label="✅ Approve"
              color="#22c55e"
              onClick={() => onAction(account.id, "approve")}
            />
            <ActionButton
              label="❌ Reject"
              color="#ef4444"
              onClick={() => onAction(account.id, "reject")}
            />
          </>
        )}
        {status === "approved" && (
          <>
            <ActionButton
              label="❌ Reject"
              color="#ef4444"
              onClick={() => onAction(account.id, "reject")}
            />
            <ActionButton
              label="🗑 Delete"
              color="#6b7280"
              onClick={() => onAction(account.id, "delete")}
            />
          </>
        )}
        {status === "rejected" && (
          <>
            <ActionButton
              label="✅ Approve"
              color="#22c55e"
              onClick={() => onAction(account.id, "approve")}
            />
            <ActionButton
              label="🗑 Delete"
              color="#6b7280"
              onClick={() => onAction(account.id, "delete")}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ── Small button helper ───────────────────────────────────────────────────────

function ActionButton({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.45rem 0.9rem",
        borderRadius: "0.625rem",
        border: `1.5px solid ${color}30`,
        background: `${color}18`,
        color: color,
        fontSize: "0.82rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = `${color}30`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = `${color}18`;
      }}
    >
      {label}
    </button>
  );
}
