"use client";

import { useState, useRef, useEffect } from "react";

const TRACK_URL = "https://soundcloud.com/truedavi/treehouse-alex-g-slowed-and";
const EMBED_URL = `https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACK_URL)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&buying=false&liking=false&download=false&sharing=false&show_playcount=false&color=%23d63771`;

export default function MusicPlayer() {
  const [muted, setMuted]       = useState(false);
  const [started, setStarted]   = useState(false);
  const [hint, setHint]         = useState(true);   // show "click anywhere" hint
  const iframeRef               = useRef<HTMLIFrameElement>(null);

  // On first user interaction anywhere → start music
  useEffect(() => {
    const start = () => {
      if (started) return;
      setStarted(true);
      setHint(false);
      // Tell SoundCloud widget to play + set volume
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ method: "play" }), "*"
        );
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ method: "setVolume", value: 80 }), "*"
        );
      }, 600);
    };
    window.addEventListener("click",     start, { once: true });
    window.addEventListener("touchstart", start, { once: true });
    return () => {
      window.removeEventListener("click",     start);
      window.removeEventListener("touchstart", start);
    };
  }, [started]);

  // Mute/unmute
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: "setVolume", value: muted ? 0 : 80 }), "*"
      );
    }, 200);
    return () => clearTimeout(t);
  }, [muted, started]);

  return (
    <>
      {/* Hidden iframe — always mounted */}
      <iframe
        ref={iframeRef}
        src={EMBED_URL}
        allow="autoplay"
        style={{
          position: "fixed", width: 1, height: 1,
          opacity: 0, pointerEvents: "none",
          bottom: 0, right: 0, border: "none",
        }}
      />

      {/* "Click anywhere" hint — fades out after first interaction */}
      {hint && (
        <div style={{
          position: "fixed",
          bottom: "5rem",
          right: "1.5rem",
          zIndex: 998,
          background: "rgba(0,0,0,0.55)",
          color: "rgba(255,255,255,0.75)",
          fontSize: "0.72rem",
          fontWeight: 600,
          padding: "6px 12px",
          borderRadius: 999,
          letterSpacing: "0.04em",
          pointerEvents: "none",
          animation: "hint-pulse 2s ease-in-out infinite",
        }}>
          🌸 click anywhere to play music
        </div>
      )}

      {/* Mute toggle button */}
      <button
        onClick={() => setMuted(!muted)}
        title={muted ? "Unmute music" : "Mute music"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 999,
          background: "var(--primary)",
          border: "none",
          borderRadius: 999,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(214,55,113,0.4)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.8rem",
          letterSpacing: "0.03em",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span style={{ fontSize: "1rem" }}>{muted ? "🔇" : "🌸"}</span>
        {muted ? "Music Off" : "Music On"}
      </button>

      <style>{`
        @keyframes hint-pulse {
          0%, 100% { opacity: 0.6; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}
