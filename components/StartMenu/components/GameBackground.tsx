"use client";

import { useRef, useCallback } from "react";

// ─── All particle data is static (defined once, never causes re-render) ───────

const SNOW = [
  { id:0,  x:5,   size:2.5, opacity:0.55, duration:7,  delay:0,   drift:30  },
  { id:1,  x:12,  size:1.5, opacity:0.35, duration:9,  delay:1.2, drift:-20 },
  { id:2,  x:20,  size:3,   opacity:0.45, duration:6,  delay:0.5, drift:40  },
  { id:3,  x:28,  size:2,   opacity:0.5,  duration:8,  delay:3,   drift:-35 },
  { id:4,  x:35,  size:1.5, opacity:0.4,  duration:10, delay:0.8, drift:25  },
  { id:5,  x:42,  size:2.5, opacity:0.6,  duration:7,  delay:2,   drift:-15 },
  { id:6,  x:50,  size:2,   opacity:0.4,  duration:9,  delay:4,   drift:50  },
  { id:7,  x:57,  size:3,   opacity:0.5,  duration:6,  delay:1,   drift:-40 },
  { id:8,  x:65,  size:1.5, opacity:0.35, duration:11, delay:2.5, drift:20  },
  { id:9,  x:73,  size:2,   opacity:0.55, duration:8,  delay:0.3, drift:-25 },
  { id:10, x:80,  size:2.5, opacity:0.45, duration:7,  delay:3.5, drift:35  },
  { id:11, x:88,  size:1.5, opacity:0.4,  duration:9,  delay:1.5, drift:-30 },
  { id:12, x:95,  size:2,   opacity:0.5,  duration:6,  delay:4.5, drift:15  },
  // Removed a few particles to improve paint time on weak hardware
];

const DIAMONDS = [
  { id:0, x:6,  y:14, size:44, opacity:0.18, color:"#ec4899", duration:7,  delay:0   },
  { id:1, x:86, y:18, size:28, opacity:0.22, color:"#818cf8", duration:9,  delay:1   },
  { id:2, x:91, y:58, size:55, opacity:0.13, color:"#ec4899", duration:8,  delay:2   },
  { id:3, x:4,  y:68, size:32, opacity:0.2,  color:"#a78bfa", duration:10, delay:0.5 },
  { id:4, x:50, y:4,  size:22, opacity:0.28, color:"#f9a8d4", duration:6,  delay:3   },
  { id:5, x:73, y:78, size:38, opacity:0.15, color:"#818cf8", duration:11, delay:1.5 },
  { id:6, x:30, y:86, size:24, opacity:0.22, color:"#ec4899", duration:7,  delay:4   },
  { id:7, x:61, y:42, size:16, opacity:0.32, color:"#c4b5fd", duration:6,  delay:2.5 },
];

const STARS = [
  { id:0,  x:10, y:8,  size:1.5, opacity:0.7, blink:3  },
  { id:1,  x:22, y:5,  size:1,   opacity:0.5, blink:4  },
  { id:2,  x:35, y:12, size:2,   opacity:0.8, blink:5  },
  { id:3,  x:48, y:3,  size:1,   opacity:0.6, blink:3  },
  { id:4,  x:60, y:9,  size:1.5, opacity:0.7, blink:6  },
  { id:5,  x:75, y:6,  size:1,   opacity:0.5, blink:4  },
  { id:6,  x:88, y:11, size:2,   opacity:0.8, blink:5  },
];

const SHOOTING_STARS = [
  { id:0, delay: 2,  duration: 4, top: 10, left: 80, angle: 45 },
  { id:1, delay: 7,  duration: 6, top: 25, left: 90, angle: 35 },
  { id:2, delay: 15, duration: 5, top: 5,  left: 60, angle: 50 },
];

const CAPSULES = [
  {
    id: 1, width: 280, height: 110,
    anchorX: 0, anchorY: 0, offsetX: -70, offsetY: -90,
    borderWidth: 8, borderColor: "rgba(236,72,153,0.25)",
    duration: 24, delay: 3, direction: "reverse",
  },
  {
    id: 2, width: 320, height: 170,
    anchorX: 100, anchorY: 100, offsetX: -300, offsetY: -120,
    borderWidth: 14, borderColor: "rgba(236,72,153,0.3)",
    duration: 15, delay: 1.5, direction: "normal",
  },
] as const;

function capsulePos(anchor: number, offset: string): string {
  if (anchor === 0) return offset;
  if (anchor === 100) return `calc(100% + ${offset})`;
  return `calc(${anchor}% + ${offset})`;
}

// ─── Component ─────────────────────────────────────────────────────────────────
// Key optimization: mousemove uses RAF + CSS custom properties on the container
// instead of setState → zero re-renders on mouse move

export default function GameBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const pendingMouse = useRef<{ x: number; y: number } | null>(null);

  // Throttle via RAF — only 1 DOM update per frame max
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    pendingMouse.current = {
      x: (e.clientX - rect.left) / rect.width  - 0.5,
      y: (e.clientY - rect.top)  / rect.height - 0.5,
    };
    if (rafRef.current) return; // already scheduled
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const m = pendingMouse.current;
      if (!m || !containerRef.current) return;
      // Write directly to DOM via CSS vars — NO setState, NO re-render
      containerRef.current.style.setProperty("--mx", String(m.x));
      containerRef.current.style.setProperty("--my", String(m.y));
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="gb-root absolute inset-0 overflow-hidden"
    >
      {/* ── Capsules ── */}
      {CAPSULES.map((cap) => (
        <div
          key={cap.id}
          className="gb-capsule absolute pointer-events-none"
          style={{
            left:         capsulePos(cap.anchorX, `${cap.offsetX}px`),
            top:          capsulePos(cap.anchorY, `${cap.offsetY}px`),
            width:        cap.width,
            height:       cap.height,
            borderRadius: "40px",
            border:       `${cap.borderWidth}px solid ${cap.borderColor}`,
            boxShadow:    `0 0 ${cap.borderWidth * 3}px ${cap.borderColor}`, // Reduced box-shadow size
            animationName:      "gb-capsule-spin",
            animationDuration:  `${cap.duration}s`,
            animationDelay:     `${cap.delay}s`,
            animationDirection: cap.direction,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        />
      ))}

      {/* ── Stars ── */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left:      `${s.x}%`,
            top:       `${s.y}%`,
            width:     s.size,
            height:    s.size,
            background:"white",
            opacity:   s.opacity,
            animationName:           "gb-star-blink",
            animationDuration:       `${s.blink}s`,
            animationDelay:          `${s.id * 0.3}s`,
            animationDirection:      "alternate",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
        />
      ))}

      {/* ── Shooting Stars ── */}
      {SHOOTING_STARS.map((s) => (
        <div
          key={`shooting-${s.id}`}
          className="absolute pointer-events-none"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: "100px",
            height: "2px",
            background: "linear-gradient(90deg, rgba(255,255,255,0.8), transparent)",
            transform: `rotate(-${s.angle}deg) translateX(200px) translateZ(0)`,
            opacity: 0,
            animationName: "gb-shooting-star",
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* ── Aurora blobs — parallax via CSS vars, no JS state ── */}
      <div className="gb-blob gb-blob-1 absolute rounded-full pointer-events-none" />
      <div className="gb-blob gb-blob-2 absolute rounded-full pointer-events-none" />
      <div className="gb-blob gb-blob-3 absolute rounded-full pointer-events-none" />
      <div className="gb-blob gb-blob-4 absolute rounded-full pointer-events-none" />

      {/* ── Diamonds ── */}
      {DIAMONDS.map((d) => (
        <div
          key={d.id}
          className="gb-diamond absolute pointer-events-none"
          style={{
            left: `${d.x}%`,
            top:  `${d.y}%`,
            animationName:           "gb-diamond-float",
            animationDuration:       `${d.duration}s`,
            animationDelay:          `${d.delay}s`,
            animationDirection:      "alternate",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <div style={{
            width: d.size * 1.6, height: d.size * 1.6,
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%) rotate(45deg) translateZ(0)",
            background: d.color, opacity: d.opacity * 0.2, // Reduced base opacity slightly
            filter: `blur(${d.size * 0.3}px)`, // Reduced blur dramatically for performance
            willChange: "transform",
          }}/>
          <div style={{
            width: d.size, height: d.size,
            background: `linear-gradient(135deg, ${d.color}cc, ${d.color}44)`,
            opacity: d.opacity, 
            transform: "rotate(45deg) translateZ(0)",
            border: `1px solid ${d.color}88`,
            boxShadow: `0 0 ${d.size * 0.4}px ${d.color}66`, // Reduced shadow size
          }}/>
        </div>
      ))}

      {/* ── Snow ── */}
      {SNOW.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left:    `${f.x}%`,
            top:     "-8px",
            width:   f.size,
            height:  f.size,
            background: "radial-gradient(circle, #fff 30%, rgba(255,255,255,0.4) 100%)",
            opacity: f.opacity,
            animationName:           "gb-snowfall",
            animationDuration:       `${f.duration}s`,
            animationDelay:          `${f.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
            "--drift": `${f.drift}px`,
            willChange: "transform",
            transform: "translateZ(0)",
          } as React.CSSProperties}
        />
      ))}

      {/* ── Vignettes ── */}
      <div className="gb-vignette-bottom absolute bottom-0 left-0 right-0 pointer-events-none" />
      <div className="gb-vignette-top    absolute top-0    left-0 right-0 pointer-events-none" />
    </div>
  );
}