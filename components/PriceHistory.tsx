"use client";

import { useEffect, useState } from "react";

interface PricePoint {
  date: string;
  price: number;
}

export default function PriceHistory({ accountId }: { accountId: string }) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}/price-history`)
      .then((r) => r.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [accountId]);

  if (loading) return <div style={{ padding: "1rem", color: "var(--foreground-muted)" }}>Loading price history...</div>;
  if (history.length === 0) return null;

  const maxPrice = Math.max(...history.map((p) => p.price));
  const minPrice = Math.min(...history.map((p) => p.price));
  const range = maxPrice - minPrice || 1;

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "1rem",
      padding: "1.5rem",
      marginTop: "1.5rem",
    }}>
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 800, color: "var(--foreground)" }}>
        Price History
      </h3>

      <div style={{ position: "relative", height: 200, display: "flex", alignItems: "flex-end", gap: 8 }}>
        {history.map((point, i) => {
          const height = ((point.price - minPrice) / range) * 100;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: "100%",
                  height: `${height}%`,
                  background: "linear-gradient(180deg, var(--primary) 0%, var(--accent) 100%)",
                  borderRadius: "4px 4px 0 0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                }}
                title={`$${point.price} on ${new Date(point.date).toLocaleDateString()}`}
              >
                <div style={{
                  position: "absolute",
                  top: -25,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  whiteSpace: "nowrap",
                }}>
                  ${point.price}
                </div>
              </div>
              <span style={{ fontSize: "0.65rem", color: "var(--foreground-subtle)", whiteSpace: "nowrap" }}>
                {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
