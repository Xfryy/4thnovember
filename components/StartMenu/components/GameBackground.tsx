"use client";

import { useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SnowParticle {
  id: number; x: number; size: number; opacity: number;
  duration: number; delay: number; drift: number;
}
interface DiamondParticle {
  id: number; x: number; y: number; size: number; opacity: number;
  color: string; duration: number; delay: number;
}
interface Star {
  id: number; x: number; y: number; size: number; opacity: number; blink: number;
}
interface CapsuleParticle {
  id: number;
  width: number; height: number;
  // anchor position: 0 = left/top edge, 100 = right/bottom edge
  anchorX: number; anchorY: number;
  // how much to shift outside the container (negative = further outside)
  offsetX: number; offsetY: number;
  borderWidth: number;
  borderColor: string;
  duration: number; delay: number;
  direction: "normal" | "reverse";
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SNOW: SnowParticle[] = [
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
  { id:13, x:8,   size:1,   opacity:0.3,  duration:12, delay:2,   drift:45  },
  { id:14, x:23,  size:1.5, opacity:0.45, duration:8,  delay:5,   drift:-10 },
  { id:15, x:38,  size:2,   opacity:0.55, duration:7,  delay:0.7, drift:30  },
  { id:16, x:52,  size:1,   opacity:0.35, duration:10, delay:3.8, drift:-45 },
  { id:17, x:68,  size:2.5, opacity:0.5,  duration:6,  delay:1.8, drift:20  },
  { id:18, x:83,  size:1.5, opacity:0.4,  duration:9,  delay:0.2, drift:-20 },
  { id:19, x:15,  size:2,   opacity:0.45, duration:8,  delay:6,   drift:40  },
  { id:20, x:44,  size:1,   opacity:0.3,  duration:11, delay:2.2, drift:-30 },
  { id:21, x:60,  size:2,   opacity:0.5,  duration:7,  delay:4.2, drift:15  },
  { id:22, x:76,  size:3,   opacity:0.4,  duration:6,  delay:1.3, drift:-50 },
  { id:23, x:91,  size:1.5, opacity:0.55, duration:9,  delay:3.2, drift:25  },
  { id:24, x:32,  size:2.5, opacity:0.35, duration:8,  delay:0.9, drift:35  },
  { id:25, x:47,  size:1,   opacity:0.45, duration:10, delay:5.5, drift:-15 },
  { id:26, x:63,  size:2,   opacity:0.5,  duration:7,  delay:2.7, drift:45  },
  { id:27, x:4,   size:1.5, opacity:0.4,  duration:12, delay:1.7, drift:-35 },
  { id:28, x:55,  size:2.5, opacity:0.55, duration:6,  delay:7,   drift:20  },
  { id:29, x:71,  size:1,   opacity:0.3,  duration:9,  delay:0.6, drift:-25 },
];

const DIAMONDS: DiamondParticle[] = [
  { id:0, x:6,  y:14, size:44, opacity:0.18, color:"#ec4899", duration:7,  delay:0   },
  { id:1, x:86, y:18, size:28, opacity:0.22, color:"#818cf8", duration:9,  delay:1   },
  { id:2, x:91, y:58, size:55, opacity:0.13, color:"#ec4899", duration:8,  delay:2   },
  { id:3, x:4,  y:68, size:32, opacity:0.2,  color:"#a78bfa", duration:10, delay:0.5 },
  { id:4, x:50, y:4,  size:22, opacity:0.28, color:"#f9a8d4", duration:6,  delay:3   },
  { id:5, x:73, y:78, size:38, opacity:0.15, color:"#818cf8", duration:11, delay:1.5 },
  { id:6, x:30, y:86, size:24, opacity:0.22, color:"#ec4899", duration:7,  delay:4   },
  { id:7, x:61, y:42, size:16, opacity:0.32, color:"#c4b5fd", duration:6,  delay:2.5 },
  { id:8, x:17, y:43, size:65, opacity:0.09, color:"#ec4899", duration:14, delay:0   },
  { id:9, x:79, y:8,  size:20, opacity:0.25, color:"#a78bfa", duration:8,  delay:3.5 },
  { id:10,x:40, y:25, size:12, opacity:0.35, color:"#f9a8d4", duration:5,  delay:1   },
  { id:11,x:25, y:60, size:30, opacity:0.14, color:"#818cf8", duration:9,  delay:2.8 },
];

const STARS: Star[] = [
  { id:0,  x:10, y:8,  size:1.5, opacity:0.7, blink:3  },
  { id:1,  x:22, y:5,  size:1,   opacity:0.5, blink:4  },
  { id:2,  x:35, y:12, size:2,   opacity:0.8, blink:5  },
  { id:3,  x:48, y:3,  size:1,   opacity:0.6, blink:3  },
  { id:4,  x:60, y:9,  size:1.5, opacity:0.7, blink:6  },
  { id:5,  x:75, y:6,  size:1,   opacity:0.5, blink:4  },
  { id:6,  x:88, y:11, size:2,   opacity:0.8, blink:5  },
  { id:7,  x:15, y:18, size:1,   opacity:0.4, blink:7  },
  { id:8,  x:30, y:22, size:1.5, opacity:0.6, blink:3  },
  { id:9,  x:52, y:17, size:1,   opacity:0.5, blink:4  },
  { id:10, x:66, y:20, size:2,   opacity:0.7, blink:6  },
  { id:11, x:82, y:15, size:1,   opacity:0.45,blink:5  },
  { id:12, x:5,  y:30, size:1.5, opacity:0.55,blink:4  },
  { id:13, x:42, y:28, size:1,   opacity:0.5, blink:8  },
  { id:14, x:70, y:32, size:1.5, opacity:0.65,blink:3  },
  { id:15, x:92, y:25, size:1,   opacity:0.4, blink:6  },
  { id:16, x:20, y:38, size:2,   opacity:0.75,blink:5  },
  { id:17, x:57, y:35, size:1,   opacity:0.45,blink:4  },
  { id:18, x:78, y:40, size:1.5, opacity:0.6, blink:7  },
  { id:19, x:95, y:42, size:1,   opacity:0.35,blink:3  },
];

// Capsules: Dikurangi jadi 3 saja - pojok kiri atas (2) dan kanan bawah (1)
// Ukuran diperbesar, bentuk diubah jadi kapsul (persegi dengan ujung melengkung)
const CAPSULES: CapsuleParticle[] = [
  // ── Pojok kiri atas — 2 kapsul lebih besar ──

  {
    id: 1, width: 280, height: 110, // diperbesar dari 200x78
    anchorX: 0, anchorY: 0, offsetX: -70, offsetY: -90, // lebih keluar
    borderWidth: 8, borderColor: "rgba(236,72,153,0.25)",
    duration: 24, delay: 3, direction: "reverse",
  },

  // ── Pojok kanan bawah — 1 kapsul besar ──
  {
    id: 2, width: 320, height: 170, // diperbesar dari 320x122
    anchorX: 100, anchorY: 100, offsetX: -300, offsetY: -120, // lebih keluar
    borderWidth: 14, borderColor: "rgba(236,72,153,0.3)",
    duration: 15, delay: 1.5, direction: "normal",
  },
];

// ─── Helper: compute position string ─────────────────────────────────────────
function capsulePos(anchor: number, offset: number): string {
  if (anchor === 0)   return `${offset}px`;
  if (anchor === 100) return `calc(100% + ${offset}px)`;
  return `calc(${anchor}% + ${offset}px)`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GameBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(170deg, #04040f 0%, #0a0618 35%, #12052a 65%, #080d1e 100%)",
      }}
    >
      {/* ══ CAPSULES — bentuk kapsul (persegi panjang ujung melengkung) ═══════ */}
      {CAPSULES.map((cap) => (
        <div
          key={cap.id}
          className="absolute pointer-events-none"
          style={{
            left:   capsulePos(cap.anchorX, cap.offsetX),
            top:    capsulePos(cap.anchorY, cap.offsetY),
            width:  cap.width,
            height: cap.height,
            // Bentuk kapsul: persegi panjang dengan ujung melengkung
            borderRadius: "40px", // atau bisa pakai min(width, height)/2 untuk oval sempurna
            background: "transparent",
            border: `${cap.borderWidth}px solid ${cap.borderColor}`,
            boxShadow: `0 0 ${cap.borderWidth * 4}px ${cap.borderColor}`,
            animation: `capsule-spin ${cap.duration}s linear ${cap.delay}s infinite`,
            animationDirection: cap.direction,
            // subtle parallax — kapsul barely gerak, biar ga ganggu
            transform: `translate(${mouse.x * -4}px, ${mouse.y * -4}px)`,
            transition: "transform 1.4s ease-out",
          }}
        />
      ))}

      {/* ══ STARS ══════════════════════════════════════════════════════════════ */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            background: "white",
            opacity: s.opacity,
            animation: `star-blink ${s.blink}s ease-in-out ${s.id * 0.3}s infinite alternate`,
          }}
        />
      ))}

      {/* ══ AURORA BLOBS ═══════════════════════════════════════════════════════ */}
      <div className="absolute rounded-full pointer-events-none" style={{
        width:"70%", height:"65%", top:"-15%", left:"-15%",
        background:"radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)",
        filter:"blur(40px)",
        transform:`translate(${mouse.x * -25}px, ${mouse.y * -25}px)`,
        transition:"transform 0.6s ease-out",
      }}/>
      <div className="absolute rounded-full pointer-events-none" style={{
        width:"55%", height:"55%", bottom:"-15%", right:"-10%",
        background:"radial-gradient(circle, rgba(236,72,153,0.16) 0%, rgba(190,24,93,0.05) 50%, transparent 70%)",
        filter:"blur(40px)",
        transform:`translate(${mouse.x * 20}px, ${mouse.y * 20}px)`,
        transition:"transform 0.6s ease-out",
      }}/>
      <div className="absolute rounded-full pointer-events-none" style={{
        width:"35%", height:"35%", top:"25%", right:"18%",
        background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        filter:"blur(30px)",
        transform:`translate(${mouse.x * 12}px, ${mouse.y * 12}px)`,
        transition:"transform 0.7s ease-out",
      }}/>
      <div className="absolute rounded-full pointer-events-none" style={{
        width:"25%", height:"25%", top:"50%", left:"5%",
        background:"radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
        filter:"blur(25px)",
        transform:`translate(${mouse.x * -15}px, ${mouse.y * 10}px)`,
        transition:"transform 0.5s ease-out",
      }}/>

      {/* ══ DIAMONDS ═══════════════════════════════════════════════════════════ */}
      {DIAMONDS.map((d) => (
        <div key={d.id} className="absolute pointer-events-none" style={{
          left:`${d.x}%`, top:`${d.y}%`,
          transform:`translate(${mouse.x * -10}px, ${mouse.y * -10}px)`,
          transition:"transform 0.9s ease-out",
          animation:`diamond-float ${d.duration}s ease-in-out ${d.delay}s infinite alternate`,
        }}>
          <div style={{
            width:d.size*1.6, height:d.size*1.6,
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%, -50%) rotate(45deg)",
            background:d.color, opacity:d.opacity*0.3,
            filter:`blur(${d.size*0.5}px)`,
          }}/>
          <div style={{
            width:d.size, height:d.size,
            background:`linear-gradient(135deg, ${d.color}cc, ${d.color}44)`,
            opacity:d.opacity, transform:"rotate(45deg)",
            border:`1px solid ${d.color}88`,
            boxShadow:`0 0 ${d.size*0.6}px ${d.color}66, inset 0 0 ${d.size*0.3}px ${d.color}22`,
          }}/>
        </div>
      ))}

      {/* ══ SNOW ════════════════════════════════════════════════════════════════ */}
      {SNOW.map((flake) => (
        <div key={flake.id} className="absolute rounded-full pointer-events-none" style={{
          left:`${flake.x}%`, top:"-8px",
          width:flake.size, height:flake.size,
          background:"radial-gradient(circle, #ffffff 30%, rgba(255,255,255,0.4) 100%)",
          opacity:flake.opacity,
          animation:`snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
          "--drift":`${flake.drift}px`,
        } as React.CSSProperties}/>
      ))}

      {/* ══ VIGNETTES ══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height:"22%",
        background:"linear-gradient(to top, rgba(4,4,15,0.75) 0%, transparent 100%)",
      }}/>
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
        height:"12%",
        background:"linear-gradient(to bottom, rgba(4,4,15,0.5) 0%, transparent 100%)",
      }}/>

      {/* ══ KEYFRAMES ══════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes capsule-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes star-blink {
          from { opacity: 0.2; }
          to   { opacity: 1; }
        }
        @keyframes diamond-float {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-18px) rotate(8deg); }
        }
        @keyframes snowfall {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(100vh) translateX(var(--drift)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}