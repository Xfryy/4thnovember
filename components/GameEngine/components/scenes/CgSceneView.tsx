"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CgScene } from "@/types/game";

interface CgSceneViewProps {
  scene: CgScene;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onApplyEffect?: (effectName: string, target?: HTMLElement) => Promise<void>;
}

const FADE_IN_DELAY = 50;
const FADE_OUT_MS   = 400;

export default function CgSceneView({ scene, onAdvance }: CgSceneViewProps) {
  const [visible, setVisible]     = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fade-in on mount
  useEffect(() => {
    setVisible(false);
    setAdvancing(false);
    const t = setTimeout(() => setVisible(true), FADE_IN_DELAY);
    return () => clearTimeout(t);
  }, [scene.id]);

  // Advance handler
  const handleAdvance = useCallback(async () => {
    if (advancing || !scene.next) return;
    setAdvancing(true);
    setVisible(false);
    await new Promise((r) => setTimeout(r, FADE_OUT_MS));
    await onAdvance(scene.next);
  }, [advancing, scene.next, onAdvance]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight") {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAdvance]);

  return (
    <div
      onClick={handleAdvance}
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        cursor: advancing ? "default" : "pointer",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Fullscreen CG image */}
      <img
        src={scene.image}
        alt="CG"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: isMobile ? "contain" : "cover",
          objectPosition: "center",
          display: "block",
        }}
        draggable={false}
      />

      {/* Vignette - lebih subtle di mobile */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.6) 100%)"
            : "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Caption - responsive */}
      {scene.caption && (
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 40 : 60,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            maxWidth: isMobile ? "90%" : 580,
            width: "auto",
            textAlign: "center",
            padding: isMobile ? "10px 16px" : "14px 24px",
            background: "rgba(4,2,14,0.78)",
            border: "1px solid rgba(236,72,153,0.2)",
            borderRadius: 10,
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.88)",
            fontSize: isMobile ? "0.85rem" : "1rem",
            lineHeight: isMobile ? 1.6 : 1.75,
            letterSpacing: "0.03em",
            animation: "cg-up 0.6s ease 0.3s both",
          }}
        >
          {scene.caption}
        </div>
      )}

      {/* Continue hint - responsive */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? 12 : 18,
          right: isMobile ? 15 : 20,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 5,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease 0.6s",
          animation: visible ? "cg-bounce 1s ease-in-out infinite alternate" : "none",
        }}
      >
        <span
          style={{
            fontSize: isMobile ? "0.45rem" : "0.5rem",
            letterSpacing: "0.2em",
            color: "rgba(236,72,153,0.5)",
            fontWeight: 700,
          }}
        >
          {isMobile ? "TAP" : "TAP"}
        </span>
        <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 20 20" fill="none">
          <path
            d="M5 8l5 5 5-5"
            stroke="#ec4899"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <style>{`
        @keyframes cg-up {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes cg-bounce {
          from { transform: translateY(0); }
          to   { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}