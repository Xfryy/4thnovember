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
  isRinUnlocked?: boolean;
}

export default function CharacterSprite({
  animated = true,
  compact = false,
  width = 260,
  height = 420,
  isRinUnlocked = false,
}: CharacterSpriteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    setIsVisible(true);
    
    // Calculate effective screen dimensions (compensating for LandscapeGuard 90deg rotation in portrait mode)
    const calculateEffectiveDims = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return {
        width: h > w ? h : w, // Effective Width
        height: h > w ? w : h // Effective Height
      };
    };

    const handleResize = () => {
      const { width, height } = calculateEffectiveDims();
      setWindowWidth(width);
      setWindowHeight(height);
    };
    
    handleResize(); // trigger once immediately
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RINN_SPRITES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [animated]);

  const isMobile = windowWidth < 640;

  // ── Compact mode ─────────────────────────────────────────────
  if (compact) {
    return (
      <div className="relative" style={{ width, height }}>
        <style>{`
          @keyframes spriteFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes spriteGlow {
            0%, 100% { filter: drop-shadow(0 4px 16px rgba(236,72,153,0.3)); }
            50% { filter: drop-shadow(0 8px 24px rgba(236,72,153,0.5)); }
          }
          
          .sprite-container {
            animation: spriteFloat 4s ease-in-out infinite,
                       spriteGlow 3s ease-in-out infinite;
          }
        `}</style>
        
        <div
          className="absolute inset-0 pointer-events-none sprite-container"
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
            className="object-contain transition-all duration-700 ease-in-out"
            style={{
              position: i === 0 ? "relative" : "absolute",
              top: 0, left: 0,
              opacity: i === currentIndex ? 1 : 0,
              transform: i === currentIndex ? 'scale(1)' : 'scale(0.95)',
              filter: `drop-shadow(0 4px ${isMobile ? 12 : 16}px rgba(236,72,153,0.3))`,
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
          0%   { transform: translate3d(0, 0, 0) scale3d(1, 1, 1); }
          30%  { transform: translate3d(0, -8px, 0) scale3d(0.998, 1, 1); }
          60%  { transform: translate3d(0, -12px, 0) scale3d(0.995, 1, 1); }
          100% { transform: translate3d(0, 0, 0) scale3d(1, 1, 1); }
        }
        @keyframes ground-pulse {
          0%, 100% { 
            opacity: 0.4; 
            transform: translate3d(-50%, 0, 0) scale3d(1, 1, 1);
          }
          50% { 
            opacity: 0.8; 
            transform: translate3d(-50%, 0, 0) scale3d(1.1, 1, 1);
          }
        }
        @keyframes name-badge-glow {
          0%, 100% { 
            box-shadow: 0 0 6px rgba(236,72,153,0.3);
            border-color: rgba(236,72,153,0.4);
          }
          50% { 
            box-shadow: 0 0 12px rgba(236,72,153,0.6);
            border-color: rgba(236,72,153,0.7);
          }
        }
        @keyframes spriteAppear {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0) scale3d(0.9, 0.9, 1);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
          }
        }
        
        .sprite-wrapper {
          animation: spriteAppear 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
          will-change: transform, opacity;
        }
        
        .name-badge {
          animation: name-badge-glow 3s ease-in-out infinite;
          will-change: box-shadow;
        }
        
        @media (max-width: 768px) {
          @keyframes breathing {
            0%   { transform: translate3d(0, 0, 0) scale3d(1, 1, 1); }
            30%  { transform: translate3d(0, -5px, 0) scale3d(0.998, 1, 1); }
            60%  { transform: translate3d(0, -8px, 0) scale3d(0.995, 1, 1); }
            100% { transform: translate3d(0, 0, 0) scale3d(1, 1, 1); }
          }
        }
      `}</style>

      <div
        className="sprite-wrapper relative w-full h-full pointer-events-none"
        style={{ minHeight: isMobile ? windowHeight * 0.4 : windowHeight * 0.6 }}
      >
        {/* Ground glow */}
        <div
          className="absolute bottom-0 left-1/2 pointer-events-none"
          style={{
            transform: "translateX(-50%)",
            width: isMobile ? "50%" : "70%",
            height: isMobile ? 40 : 60,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(236,72,153,0.35) 0%, transparent 70%)",
            filter: "blur(12px)",
            animation: "ground-pulse 4s ease-in-out infinite",
            zIndex: 1,
          }}
        />

        {/* Breathing wrapper */}
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
              sizes={isMobile ? "50vw" : "30vw"}
              className="object-contain object-bottom transition-all duration-700 ease-in-out"
              style={{
                opacity: i === currentIndex ? 1 : 0,
                transform: i === currentIndex ? 'scale(1)' : 'scale(0.98)',
                filter:
                  "drop-shadow(0 0 24px rgba(236,72,153,0.3)) drop-shadow(-8px 0 30px rgba(139,92,246,0.15))",
                position: "absolute",
              }}
            />
          ))}
        </div>

        {/* Name plate */}
        <div
          className="name-badge absolute bottom-4 left-1/2 z-10 px-4 py-1.5 
                     rounded-full flex items-center gap-2 whitespace-nowrap"
          style={{
            transform: "translateX(-50%)",
            background: "rgba(8, 5, 20, 0.7)",
            border: "1px solid rgba(236,72,153,0.4)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ fontSize: isMobile ? 6 : 8, color: "#ec4899" }}>◆</span>
          <span
            className="font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase"
            style={{
              background: "linear-gradient(135deg, #f9a8d4, #ec4899, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isRinUnlocked ? "-Rin Fuyutsuki-hime-" : "-???????-"}
          </span>
          <span style={{ fontSize: isMobile ? 6 : 8, color: "#a78bfa" }}>◆</span>
        </div>
      </div>
    </>
  );
}