"use client";

import { useState, useRef, useEffect } from "react";

const TRACK_URL = "https://soundcloud.com/truedavi/treehouse-alex-g-slowed-and";
const EMBED_URL = `https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACK_URL)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&buying=false&liking=false&download=false&sharing=false&show_playcount=false&color=%23d63771`;

export default function EnterScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading]   = useState(false);
  const [muted, setMuted]     = useState(false);
  const iframeRef             = useRef<HTMLIFrameElement>(null);

  // Skip enter screen if already entered this session
  useEffect(() => {
    if (sessionStorage.getItem("hm_entered")) setVisible(false);
  }, []);

  function handleEnter() {
    sessionStorage.setItem("hm_entered", "1");
    // Start music
    setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: "play" }), "*"
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: "setVolume", value: 80 }), "*"
      );
    }, 400);
    // Fade out overlay
    setFading(true);
    setTimeout(() => setVisible(false), 800);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "setVolume", value: next ? 0 : 80 }), "*"
    );
  }

  return (
    <>
      {/* Hidden audio iframe — always present */}
      <iframe
        ref={iframeRef}
        src={EMBED_URL}
        allow="autoplay"
        style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", bottom: 0, right: 0, border: "none", zIndex: -1 }}
      />

      {/* Mute button — always visible after entering */}
      {!visible && (
        <button
          onClick={toggleMute}
          style={{
            position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 999,
            background: "var(--primary)", border: "none", borderRadius: 999,
            padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(214,55,113,0.4)",
            color: "#fff", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.03em",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ fontSize: "1rem" }}>{muted ? "🔇" : "🌸"}</span>
          {muted ? "Music Off" : "Music On"}
        </button>
      )}

      {/* Enter overlay */}
      {visible && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "#0a0106",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "2rem",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.8s ease",
          pointerEvents: fading ? "none" : "auto",
        }}>
          {/* Petals background */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${8 + Math.random() * 10}px`,
                height: `${14 + Math.random() * 14}px`,
                background: `rgba(214,55,113,${0.1 + Math.random() * 0.25})`,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `enter-float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
              }} />
            ))}
          </div>

          {/* Logo */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(52px, 10vw, 90px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
              textShadow: "0 0 20px #fff, 0 0 40px #ffb3cc, 0 0 80px #d63771, 0 0 120px #d63771",
              animation: "logo-pulse 3s ease-in-out infinite",
            }}>
              🤍 heart market
            </div>
            <p style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "clamp(11px, 1.5vw, 14px)",
              letterSpacing: "4px",
              textTransform: "uppercase",
              margin: "12px 0 0",
              fontFamily: "Inter, sans-serif",
            }}>
              minecraft account marketplace
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg, transparent, rgba(214,55,113,0.6), transparent)" }} />

          {/* Enter button */}
          <button
            onClick={handleEnter}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(214,55,113,0.6)",
              borderRadius: 999,
              padding: "14px 48px",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 0 20px rgba(214,55,113,0.2), inset 0 0 20px rgba(214,55,113,0.05)",
              transition: "all 0.3s ease",
              animation: "btn-breathe 2.5s ease-in-out infinite",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(214,55,113,0.15)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(214,55,113,0.5), inset 0 0 20px rgba(214,55,113,0.1)";
              e.currentTarget.style.borderColor = "rgba(214,55,113,1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(214,55,113,0.2), inset 0 0 20px rgba(214,55,113,0.05)";
              e.currentTarget.style.borderColor = "rgba(214,55,113,0.6)";
            }}
          >
            Enter
          </button>

          <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.7rem", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif" }}>
            🌸 music will play on enter
          </p>

          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;700&display=swap');
            @keyframes logo-pulse {
              0%,100% { text-shadow: 0 0 20px #fff, 0 0 40px #ffb3cc, 0 0 80px #d63771, 0 0 120px #d63771; }
              50%      { text-shadow: 0 0 10px #fff, 0 0 20px #ffb3cc, 0 0 50px #d63771; }
            }
            @keyframes btn-breathe {
              0%,100% { box-shadow: 0 0 20px rgba(214,55,113,0.2), inset 0 0 20px rgba(214,55,113,0.05); }
              50%      { box-shadow: 0 0 35px rgba(214,55,113,0.4), inset 0 0 20px rgba(214,55,113,0.08); }
            }
            @keyframes enter-float {
              0%,100% { transform: translateY(0px) rotate(0deg); }
              50%      { transform: translateY(-20px) rotate(15deg); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
