"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          overflow: "hidden",
        }}
      >
        {/* Fallback gradient background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #fce7f3 0%, #fff1f2 50%, #ffe4e6 100%)",
          }}
        />

        {/* GIF background */}
        <img
          src="/blossoms.gif"
          alt="Cherry blossoms background"
          onLoad={() => setVideoLoaded(true)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            opacity: videoLoaded ? 0.4 : 0,
            transition: "opacity 1s ease",
          }}
        />

        {/* Overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,248,250,0.7) 0%, rgba(255,240,246,0.8) 100%)",
            backdropFilter: "blur(2px)",
          }}
        />
      </div>
    </>
  );
}
