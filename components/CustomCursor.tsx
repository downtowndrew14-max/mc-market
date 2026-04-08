"use client";

import { useEffect, useRef } from "react";

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
  color: string;
}

const COLORS = ["#d63771", "#ff85a1", "#ffb3cc", "#fff", "#f9a8d4"];

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const mouse     = useRef({ x: -200, y: -200 });
  const ring      = useRef({ x: -200, y: -200 });

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const dot    = dotRef.current!;
    const ringEl = ringRef.current!;

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const sparks: Spark[] = [];
    let lastX = -200, lastY = -200;
    let animId: number;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Spawn sparks on movement
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.sqrt(dx*dx + dy*dy) > 6) {
        for (let i = 0; i < 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd   = Math.random() * 1.5 + 0.3;
          sparks.push({
            x: e.clientX, y: e.clientY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 0.5,
            alpha: 0.8,
            size: Math.random() * 3 + 1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
        lastX = e.clientX; lastY = e.clientY;
      }
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd   = Math.random() * 3 + 1;
        sparks.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 1,
          alpha: 1,
          size: Math.random() * 4 + 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    function tick() {
      ctx.clearRect(0, 0, W, H);

      // Smooth ring follow
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;

      // Move DOM elements
      dot.style.transform    = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      ringEl.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`;

      // Draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x     += s.vx;
        s.y     += s.vy;
        s.vy    += 0.05;
        s.alpha -= 0.025;
        if (s.alpha <= 0) { sparks.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle    = s.color;
        ctx.shadowColor  = s.color;
        ctx.shadowBlur   = 6;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    }

    window.addEventListener("resize",    onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("click",     onClick);
    document.body.style.cursor = "none";
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click",     onClick);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99998 }} />
      {/* Dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0,
        width: 8, height: 8,
        background: "#d63771",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 99999,
        boxShadow: "0 0 8px #d63771, 0 0 16px #d63771",
        transition: "transform 0.05s linear",
        willChange: "transform",
      }} />
      {/* Ring */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0,
        width: 32, height: 32,
        border: "1.5px solid rgba(214,55,113,0.5)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 99998,
        willChange: "transform",
      }} />
    </>
  );
}
