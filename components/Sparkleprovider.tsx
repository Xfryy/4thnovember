"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#f9a8d4","#ec4899","#a5b4fc","#818cf8","#fde68a","#ffffff","#a855f7"];

interface Sparkle {
  x: number; y: number;
  color: string; size: number;
  life: number; maxLife: number;
  vy: number; rotation: number;
}

export default function SparkleProvider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparkles  = useRef<Sparkle[]>([]);
  const lastTime  = useRef(0);
  const lastSpawn = useRef(0);
  const rafId     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse → spawn sparkles (throttled via lastSpawn)
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn.current < 80) return;
      lastSpawn.current = now;
      sparkles.current.push({
        x: e.clientX, y: e.clientY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 10 + Math.random() * 12,
        life: 0, maxLife: 700,
        vy: -0.6 - Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
      });
      // cap at 20
      if (sparkles.current.length > 20) sparkles.current.shift();
    };
    window.addEventListener("mousemove", onMove);

    // RAF loop — draw on canvas, zero React re-renders
    const loop = (ts: number) => {
      const dt = ts - lastTime.current;
      lastTime.current = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparkles.current = sparkles.current.filter(s => s.life < s.maxLife);

      for (const s of sparkles.current) {
        s.life += dt;
        s.y    += s.vy * (dt / 16);
        s.rotation += 0.05;

        const progress = s.life / s.maxLife;
        const opacity  = progress < 0.1
          ? progress / 0.1
          : 1 - (progress - 0.1) / 0.9;
        const scale = 1 + progress * 0.3;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.scale(scale, scale);
        ctx.font         = `${s.size}px serif`;
        ctx.fillStyle    = s.color;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor  = s.color;
        ctx.shadowBlur   = 8;
        ctx.fillText("✦", 0, 0);
        ctx.restore();
      }

      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 9999 }}
    />
  );
}