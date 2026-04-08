"use client";

import { useEffect, useRef } from "react";

interface Props {
  username: string;
  width?: number;
  height?: number;
  animation?: "walk" | "idle";
}

export default function MinecraftViewer({
  username,
  width = 120,
  height = 180,
  animation = "walk",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let viewer: any;
    let disposed = false;

    import("skinview3d").then((skinview3d) => {
      if (disposed || !canvasRef.current) return;

      viewer = new skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width,
        height,
      });

      viewer.loadSkin(`https://crafatar.com/skins/${username}?overlay`);
      viewer.renderer.setClearColor(0x000000, 0);
      viewer.controls.enabled = false;
      viewer.camera.position.set(0, 15, 50);

      if (animation === "walk") {
        const anim = viewer.animations.add(skinview3d.WalkingAnimation);
        anim.speed = 0.7;
      } else {
        const anim = viewer.animations.add(skinview3d.IdleAnimation);
        anim.speed = 0.5;
      }

      // Slow auto-rotate
      viewer.autoRotate = true;
      viewer.autoRotateSpeed = 0.4;
    });

    return () => {
      disposed = true;
      viewer?.dispose();
    };
  }, [username, width, height, animation]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ background: "transparent" }}
    />
  );
}
