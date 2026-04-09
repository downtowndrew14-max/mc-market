"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Activity {
  id: string;
  type: "listing" | "price_change";
  username: string;
  accountId: string;
  price?: number;
  oldPrice?: number;
  timestamp: string;
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then(setActivities)
      .catch(console.error);

    const interval = setInterval(() => {
      fetch("/api/activity")
        .then((r) => r.json())
        .then(setActivities)
        .catch(console.error);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0 || !isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "5rem",
      left: "1.5rem",
      width: 320,
      maxHeight: 400,
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "1rem",
      boxShadow: "var(--shadow-lg)",
      overflow: "hidden",
      zIndex: 50,
    }}>
      <div style={{
        padding: "1rem",
        borderBottom: "1px solid var(--card-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            animation: "blink 1.5s ease-in-out infinite",
          }} />
          <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "var(--foreground)" }}>
            Live Activity
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--foreground-muted)",
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: 0,
            lineHeight: 1,
          }}
          title="Close"
        >
          ×
        </button>
      </div>

      <div style={{ maxHeight: 340, overflowY: "auto", padding: "0.5rem" }}>
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={`/account/${activity.accountId}`}
            style={{
              display: "block",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              transition: "background 0.2s",
              marginBottom: "0.25rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: "1rem" }}>
                {activity.type === "listing" ? "🆕" : "💰"}
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--foreground)" }}>
                {activity.username}
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "var(--foreground-muted)",
              lineHeight: 1.4,
            }}>
              {activity.type === "listing" ? (
                <>New listing at ${activity.price}</>
              ) : (
                <>Price changed: ${activity.oldPrice} → ${activity.price}</>
              )}
            </p>
            <span style={{ fontSize: "0.65rem", color: "var(--foreground-subtle)" }}>
              {getTimeAgo(activity.timestamp)}
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
