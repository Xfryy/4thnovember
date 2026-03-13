"use client";

/**
 * EndingSceneView
 * Fix: replaced manual resize listener with useIsMobile hook
 */

import React, { useCallback, useEffect, useState } from "react";
import { EndingScene } from "@/types/game";
import { audioManager } from "@/lib/Audiomanager";
import { useIsMobile } from "@/hooks/useIsMobile";

interface EndingSceneViewProps {
  scene: EndingScene;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

const ENDING_CONFIG: Record<string, { color: string; label: string; glow: string }> = {
  act:  { color: "#ec4899", label: "END OF ACT",   glow: "rgba(236,72,153,0.4)" },
  good: { color: "#4ade80", label: "GOOD ENDING",  glow: "rgba(74,222,128,0.4)" },
  bad:  { color: "#f87171", label: "BAD ENDING",   glow: "rgba(248,113,113,0.4)" },
  true: { color: "#c084fc", label: "TRUE ENDING",  glow: "rgba(192,132,252,0.45)" },
};

export default function EndingSceneView({ scene, onAdvance }: EndingSceneViewProps) {
  const [canContinue, setCanContinue] = useState(false);
  const [showHint,    setShowHint]    = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (scene.audio?.bgm) audioManager.playBGM(scene.audio.bgm, 800);
  }, [scene.audio]);

  useEffect(() => {
    const t1 = setTimeout(() => setCanContinue(true), 2000);
    const t2 = setTimeout(() => setShowHint(true),    2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleContinue = useCallback(async () => {
    if (!canContinue || !scene.next) return;
    await onAdvance(scene.next);
  }, [canContinue, scene, onAdvance]);

  const cfg = ENDING_CONFIG[scene.endingType] ?? ENDING_CONFIG.act;

  return (
    <div
      onClick={handleContinue}
      style={{ position: "absolute", inset: 0, cursor: canContinue ? "pointer" : "default", overflow: "hidden" }}
    >
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: scene.bg?.color ?? "#06020f",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover", backgroundPosition: "center", zIndex: 0,
      }} />

      {scene.bg?.overlay && (
        <div style={{ position: "absolute", inset: 0, background: scene.bg.overlay, zIndex: 1, pointerEvents: "none" }} />
      )}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: isMobile
          ? "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)"
          : "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Character sprite */}
      {scene.characterSprite && (
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? 280 : 380, height: isMobile ? 420 : 580,
          opacity: isMobile ? 0.3 : 0.45, zIndex: 3,
          animation: "end-char 1.4s ease 0.2s both",
          pointerEvents: "none",
        }}>
          <img src={scene.characterSprite} alt="character"
            style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom", display: "block" }} />
        </div>
      )}

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: isMobile ? 200 : 300, height: isMobile ? 150 : 200,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${cfg.glow} 0%, transparent 70%)`,
        zIndex: 4, pointerEvents: "none",
        animation: "end-glow 2s ease both", filter: "blur(20px)",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: isMobile ? 6 : 10,
        padding: isMobile ? "0 20px" : 0,
      }}>
        <p style={{ fontSize: isMobile ? "0.45rem" : "0.55rem", fontWeight: 800, letterSpacing: "0.45em", textTransform: "uppercase", color: `${cfg.color}88`, animation: "end-in 1s ease 0.3s both", margin: 0, textAlign: "center" }}>
          {cfg.label}
        </p>

        <div style={{ width: isMobile ? 30 : 36, height: 1, background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`, animation: "end-in 1s ease 0.45s both" }} />

        <p style={{
          fontSize: isMobile ? "clamp(1.2rem, 6vw, 1.8rem)" : "clamp(1.5rem, 3.5vw, 2.2rem)",
          fontWeight: 900, letterSpacing: "0.1em", color: cfg.color,
          textShadow: `0 0 40px ${cfg.glow}, 0 0 80px ${cfg.glow}55`,
          animation: "end-in 1s ease 0.5s both", textAlign: "center", margin: 0, lineHeight: 1.2, wordBreak: "break-word",
        }}>
          {scene.title}
        </p>

        {scene.subtitle && (
          <p style={{ fontSize: isMobile ? "0.6rem" : "0.72rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", animation: "end-in 1s ease 0.75s both", margin: "4px 0 0", textAlign: "center" }}>
            {scene.subtitle}
          </p>
        )}

        <div style={{
          marginTop: isMobile ? 20 : 28,
          display: "flex", alignItems: "center", gap: isMobile ? 4 : 8,
          opacity: showHint ? 1 : 0, transition: "opacity 0.6s ease",
          animation: showHint ? "end-hint 1.8s ease-in-out infinite alternate" : "none",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <div style={{ width: isMobile ? 16 : 24, height: 1, background: `linear-gradient(90deg, transparent, ${cfg.color}55)` }} />
          <span style={{ fontSize: isMobile ? "0.4rem" : "0.48rem", letterSpacing: "0.35em", color: `${cfg.color}60`, fontWeight: 700, whiteSpace: "nowrap" }}>
            {isMobile ? "TAP" : "CLICK TO CONTINUE"}
          </span>
          <div style={{ width: isMobile ? 16 : 24, height: 1, background: `linear-gradient(90deg, ${cfg.color}55, transparent)` }} />
        </div>
      </div>

      <style>{`
        @keyframes end-in   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes end-char { from{opacity:0;transform:translateX(-50%) translateY(22px)} to{opacity:0.45;transform:translateX(-50%)} }
        @keyframes end-glow { from{opacity:0;transform:translate(-50%,-50%) scale(0.7)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes end-hint { from{opacity:0.4} to{opacity:0.85} }
      `}</style>
    </div>
  );
}