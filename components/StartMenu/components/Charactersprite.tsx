"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const RINN_SPRITES = [
  "/Image/Rinn/SchoolFIT/frame_0.png",
  "/Image/Rinn/SchoolFIT/frame_1.png",
  "/Image/Rinn/SchoolFIT/frame_2.png",
  "/Image/Rinn/SchoolFIT/frame_3.png",
  "/Image/Rinn/SchoolFIT/frame_4.png",
];

interface CharacterSpriteProps {
  animated?: boolean;
  compact?: boolean;
  width?: number;
  height?: number;
}

export default function CharacterSprite({
  animated = true,
  compact = false,
  width = 260,
  height = 420,
}: CharacterSpriteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RINN_SPRITES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [animated]);

  // ── Compact mode ─────────────────────────────────────────────
  if (compact) {
    return (
      <div className="relative" style={{ width, height }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(236,72,153,0.15) 0%, transparent 70%)",
            filter: "blur(16px)",
          }}
        />
        {RINN_SPRITES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Rinn"
            width={width}
            height={height}
            priority={i === 0}
            className="object-contain"
            style={{
              position: i === 0 ? "relative" : "absolute",
              top: 0, left: 0,
              opacity: i === currentIndex ? 1 : 0,
              transition: "opacity 0.8s ease",
              filter: "drop-shadow(0 4px 16px rgba(236,72,153,0.3))",
            }}
          />
        ))}
      </div>
    );
  }

  // ── Full-screen mode (MainMenu) ───────────────────────────────
  return (
    <>
      <style>{`
        @keyframes breathing {
          0%   { transform: translateY(0px) scaleX(1); }
          30%  { transform: translateY(-10px) scaleX(0.995); }
          60%  { transform: translateY(-14px) scaleX(0.99); }
          100% { transform: translateY(0px) scaleX(1); }
        }
        @keyframes ground-pulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scaleX(1.08); }
        }
        @keyframes name-badge-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(236,72,153,0.3); }
          50%       { box-shadow: 0 0 18px rgba(236,72,153,0.6); }
        }
      `}</style>

      <div
        className="relative w-full h-full pointer-events-none"
        style={{ minHeight: "60vh" }}
      >
        {/* Ground glow — stays still, breathing hanya sprite */}
        <div
          className="absolute bottom-0 left-1/2 pointer-events-none"
          style={{
            transform: "translateX(-50%)",
            width: "70%",
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(236,72,153,0.35) 0%, transparent 70%)",
            filter: "blur(12px)",
            animation: "ground-pulse 4s ease-in-out infinite",
            zIndex: 1,
          }}
        />

        {/* Breathing wrapper — hanya sprite yang bergerak */}
        <div
          className="absolute inset-0"
          style={{
            animation: animated ? "breathing 4s ease-in-out infinite" : "none",
            transformOrigin: "bottom center",
          }}
        >
          {RINN_SPRITES.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="Rinn"
              fill
              priority={i === 0}
              sizes="30vw"
              className="object-contain object-bottom"
              style={{
                opacity: i === currentIndex ? 1 : 0,
                transition: "opacity 0.8s ease",
                filter:
                  "drop-shadow(0 0 24px rgba(236,72,153,0.3)) drop-shadow(-8px 0 30px rgba(139,92,246,0.15))",
                position: "absolute",
              }}
            />
          ))}
        </div>

        {/* Name plate — di luar breathing wrapper biar ga ikut gerak */}
        <div
          className="absolute bottom-4 left-1/2 z-10 px-5 py-1.5 rounded-full flex items-center gap-2"
          style={{
            transform: "translateX(-50%)",
            background: "rgba(8, 5, 20, 0.65)",
            border: "1px solid rgba(236,72,153,0.4)",
            backdropFilter: "blur(10px)",
            animation: "name-badge-glow 3s ease-in-out infinite",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 8, color: "#ec4899" }}>◆</span>
          <span
            className="font-bold tracking-[0.3em] text-xs uppercase"
            style={{
              background: "linear-gradient(135deg, #f9a8d4, #ec4899, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            -???????-
          </span>
          <span style={{ fontSize: 8, color: "#a78bfa" }}>◆</span>
        </div>
      </div>
    </>
  );
}