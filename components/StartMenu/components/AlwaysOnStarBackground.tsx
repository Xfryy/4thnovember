'use client';

import { useEffect, useRef } from 'react';

export default function LightGrokStarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId     = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Config ────────────────────────────────────────────────
    const STAR_COUNT     = 380;
    const MAX_SHOOTERS   = 2;
    // 0.018 per frame check ≈ shooting star every 3–8 seconds
    const SHOOT_CHANCE   = 0.018;

    // ── Star types for variety ────────────────────────────────
    type Star = {
      x: number; y: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      // tiny drift
      vx: number; vy: number;
    };

    type Shooter = {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      tailLen: number;
      alpha: number;
    };

    let stars:    Star[]    = [];
    let shooters: Shooter[] = [];

    // ── Resize ───────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => {
        const size = Math.random();               // 0-1 → determines star tier
        return {
          x:            Math.random() * canvas.width,
          y:            Math.random() * canvas.height,
          // tiny = 0.3-0.6, small = 0.6-1.0, medium = 1.0-1.6
          size:         size < 0.6 ? 0.3 + Math.random() * 0.3
                      : size < 0.9 ? 0.6 + Math.random() * 0.4
                      :              1.0 + Math.random() * 0.6,
          baseAlpha:    0.35 + Math.random() * 0.55,
          alpha:        0,
          // twinkle — faster & wider swing so it's clearly visible
          twinkleSpeed: 0.002 + Math.random() * 0.004,
          twinkleOffset: Math.random() * Math.PI * 2,
          // extremely slow drift — feels alive but not rotating
          vx:           (Math.random() - 0.5) * 0.008,
          vy:           (Math.random() - 0.5) * 0.008,
        };
      });
    };

    const spawnShooter = () => {
      // Always starts somewhere along the top 30% of screen, random x
      const x   = Math.random() * canvas.width;
      const y   = -10;
      // Angle: mostly downward, slight left or right lean
      const ang = (Math.PI / 2) + (Math.random() - 0.5) * 0.7; // ~90° ± 40°
      const spd = 10 + Math.random() * 8;
      shooters.push({
        x, y,
        vx:      Math.cos(ang) * spd,
        vy:      Math.sin(ang) * spd,
        life:    0,
        maxLife: 45 + Math.random() * 40,
        tailLen: 140 + Math.random() * 100,
        alpha:   1,
      });
    };

    resize();
    window.addEventListener('resize', resize);

    let last = performance.now();

    // ── Draw loop ────────────────────────────────────────────
    const animate = (now: number) => {
      const delta = (now - last) / 16.67; // normalised to 60fps
      last = now;

      // Hard clear every frame — no trail fade on stars, keeps bg bright
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Stars ─────────────────────────────────────────────
      stars.forEach((s) => {
        // drift (wraps around)
        s.x = (s.x + s.vx * delta + canvas.width)  % canvas.width;
        s.y = (s.y + s.vy * delta + canvas.height) % canvas.height;

        // twinkle — swing ±60% of baseAlpha so the pulse is clearly visible
        const tw = Math.sin(now * s.twinkleSpeed + s.twinkleOffset);
        s.alpha  = Math.max(0.05, s.baseAlpha + tw * s.baseAlpha * 0.65);

        // Glow for medium+ stars — scales with twinkle
        if (s.size > 0.9) {
          const glowR = s.size * 5 * (0.7 + (tw + 1) * 0.3);
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
          grd.addColorStop(0, `rgba(180,200,255,${s.alpha * 0.55})`);
          grd.addColorStop(1, 'rgba(180,200,255,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot
        ctx.fillStyle = `rgba(230,235,255,${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Spawn shooter ─────────────────────────────────────
      if (shooters.length < MAX_SHOOTERS && Math.random() < SHOOT_CHANCE) {
        spawnShooter();
      }

      // ── Draw shooters ──────────────────────────────────────
      shooters = shooters.filter((s) => {
        s.life += delta;
        if (s.life > s.maxLife) return false;

        const p     = s.life / s.maxLife;
        // fade in fast, fade out slow
        const alpha = p < 0.15
          ? p / 0.15
          : 1 - ((p - 0.15) / 0.85);

        s.x += s.vx * delta;
        s.y += s.vy * delta;

        // Tail gradient
        const tx = s.x - s.vx * (s.tailLen / Math.hypot(s.vx, s.vy));
        const ty = s.y - s.vy * (s.tailLen / Math.hypot(s.vx, s.vy));

        const grd = ctx.createLinearGradient(s.x, s.y, tx, ty);
        grd.addColorStop(0, `rgba(255,252,240,${alpha})`);
        grd.addColorStop(0.25, `rgba(210,230,255,${alpha * 0.5})`);
        grd.addColorStop(1,  'rgba(180,200,255,0)');

        ctx.save();
        ctx.strokeStyle = grd;
        ctx.lineWidth   = 1.5 * (1 - p * 0.6);
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Bright head
        ctx.fillStyle = `rgba(255,255,245,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8 * (1 - p * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Tiny glow around head
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        hg.addColorStop(0, `rgba(200,220,255,${alpha * 0.3})`);
        hg.addColorStop(1, 'rgba(200,220,255,0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return true;
      });

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        // Space gradient — deep purple-blue, NOT pitch black
        background: 'radial-gradient(ellipse at 50% 40%, #0d0628 0%, #080318 45%, #04010f 100%)',
      }}
    />
  );
}