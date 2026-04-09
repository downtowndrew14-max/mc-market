"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
}

const COLORS = ["#ffc0cb", "#ffb3c6", "#ff85a1", "#ffd6e0", "#ffacc7", "#f9a8d4", "#fce7f3"];

function createPetal(W: number): Petal {
  return {
    x: Math.random() * W,
    y: -20,
    size: Math.random() * 10 + 6,
    speedY: Math.random() * 1.2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.6,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
    opacity: Math.random() * 0.5 + 0.3,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.025 + 0.008,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;

  ctx.beginPath();
  const s = p.size;
  // Simple oval petal shape
  ctx.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 4;
  ctx.fill();

  // Highlight
  ctx.beginPath();
  ctx.ellipse(-s * 0.1, -s * 0.2, s * 0.2, s * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();

  ctx.restore();
}

export default function CherryBlossoms() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let petals: Petal[]   = [];
    let animId: number;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Seed initial petals spread across the screen
    for (let i = 0; i < 60; i++) {
      const p = createPetal(W);
      p.y = Math.random() * H; // start spread out, not all at top
      petals.push(p);
    }

    let frame = 0;
    function tick() {
      ctx!.clearRect(0, 0, W, H);

      // Spawn new petals gradually
      if (frame % 12 === 0 && petals.length < 100) {
        petals.push(createPetal(W));
      }
      frame++;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.wobble += p.wobbleSpeed;
        p.x      += p.speedX + Math.sin(p.wobble) * 0.6;
        p.y      += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > H + 30) {
          petals.splice(i, 1);
          continue;
        }
        drawPetal(ctx!, p);
      }

      animId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}
