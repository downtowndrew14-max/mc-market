"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  username: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export default function SkinViewer({ username, width = 260, height = 340, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<{ dispose: () => void } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mounted = true;

    import("skinview3d").then((mod) => {
      if (!mounted || !canvas) return;

      // Dispose any previous instance
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sv = new mod.SkinViewer({
        canvas,
        width,
        height,
        skin: `https://minotar.net/skin/${username}`,
      } as any);

      // Walking animation — always on
      const anim = new mod.WalkingAnimation();
      (anim as unknown as { speed: number }).speed = 0.7;
      sv.animation = anim;

      // Slow auto-rotate
      sv.autoRotate = true;
      sv.autoRotateSpeed = 0.5;

      // Lighting
      sv.globalLight.intensity = 2;
      sv.cameraLight.intensity = 0.8;

      // Zoom / FOV
      sv.fov = 65;
      sv.zoom = 0.9;

      viewerRef.current = sv;
      setReady(true);
    });

    return () => {
      mounted = false;
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [username, width, height]);

  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {!ready && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div className="card-spinner" style={{ width: 32, height: 32 }} />
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: "block", opacity: ready ? 1 : 0, transition: "opacity .4s ease" }}
      />
    </div>
  );
}
