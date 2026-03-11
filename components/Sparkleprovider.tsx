"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#f9a8d4","#ec4899","#a5b4fc","#818cf8","#fde68a","#ffffff","#a855f7"];

interface Sparkle {
  x: number; y: number;
  color: string; size: number;
  life: number; maxLife: number;
  vx: number; vy: number;
  rotation: number; rotSpeed: number;
}

/** Smooth cubic ease-out — no sudden jumps */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function SparkleProvider() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sparkles   = useRef<Sparkle[]>([]);
  const lastTime   = useRef(0);
  const lastSpawn  = useRef(0);
  const rafId      = useRef<number>(0);
  const mousePos   = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnSparkle = (x: number, y: number) => {
      // Spawn 2-3 sparkles per event for density without lag
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        sparkles.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          color:    COLORS[Math.floor(Math.random() * COLORS.length)],
          size:     8 + Math.random() * 10,
          life:     0,
          // Vary lifetime so they don't all vanish at once
          maxLife:  500 + Math.random() * 600,
          vx:       (Math.random() - 0.5) * 0.6,
          vy:       -0.5 - Math.random() * 0.7,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.12,
        });
      }
      // Cap total sparkles
      if (sparkles.current.length > 60) {
        sparkles.current.splice(0, sparkles.current.length - 60);
      }
    };

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastSpawn.current < 60) return;
      lastSpawn.current = now;
      spawnSparkle(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", onMove);

    const loop = (ts: number) => {
      // Guard: clamp dt so first frame / tab-switch don't spike
      const rawDt = ts - lastTime.current;
      const dt    = lastTime.current === 0 ? 16 : Math.min(rawDt, 50);
      lastTime.current = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Remove dead sparkles
      sparkles.current = sparkles.current.filter(s => s.life < s.maxLife);

      for (const s of sparkles.current) {
        s.life     += dt;
        s.x        += s.vx * (dt / 16);
        s.y        += s.vy * (dt / 16);
        s.rotation += s.rotSpeed * (dt / 16);

        const progress = Math.min(s.life / s.maxLife, 1);

        // ── Smooth opacity curve ──────────────────────────────────────────
        // Fade IN fast (0 → 0.15), hold, then ease-out slowly (0.4 → 1.0)
        // easeOutCubic makes the tail fade silky — no flash.
        let opacity: number;
        if (progress < 0.15) {
          // Quick fade-in
          opacity = progress / 0.15;
        } else {
          // Slow smooth fade-out using cubic ease
          const fadeProgress = (progress - 0.15) / 0.85;
          opacity = 1 - easeOutCubic(fadeProgress);
        }

        // Clamp to avoid any sub-zero flicker
        opacity = Math.max(0, Math.min(1, opacity));

        // Size pulses slightly then shrinks at end
        const scale = progress < 0.5
          ? 1 + progress * 0.4
          : 1.2 - (progress - 0.5) * 0.6;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.scale(scale, scale);
        ctx.font         = `${s.size}px serif`;
        ctx.fillStyle    = s.color;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        // Softer shadow so glow doesn't cause its own flicker
        ctx.shadowColor  = s.color;
        ctx.shadowBlur   = 6;
        ctx.fillText("✦", 0, 0);
        ctx.restore();
      }

      rafId.current = requestAnimationFrame(loop);
    };

    // Start with lastTime = 0 so first frame dt clamp kicks in
    lastTime.current = 0;
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