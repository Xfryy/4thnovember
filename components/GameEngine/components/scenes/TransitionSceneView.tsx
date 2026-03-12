"use client";

import React, { useEffect, useRef, useState } from "react";
import type { TransitionScene } from "@/types/game";
import { audioManager } from "@/lib/Audiomanager";

// Explicitly named & exported so TS never conflates it with ChoiceSceneViewProps
export interface TransitionSceneViewProps {
  scene: TransitionScene;
  onComplete: (nextSceneId: string) => Promise<void>;
}

type TransitionFadePhase = "fade-in" | "hold" | "fade-out";

const FADE_MS = 600;

// React.FC<T> forces TS to bind prop type at declaration — prevents identity collision
const TransitionSceneView: React.FC<TransitionSceneViewProps> = ({
  scene,
  onComplete,
}) => {
  const [phase, setPhase] = useState<TransitionFadePhase>("fade-in");
  const skippedRef = useRef(false);

  useEffect(() => {
    if (scene.audio?.bgm) audioManager.playBGM(scene.audio.bgm, 500);
  }, [scene.audio]);

  useEffect(() => {
    skippedRef.current = false;
    const duration = Math.max(scene.duration ?? 2000, FADE_MS * 2 + 100);

    // Timeline:
    //   0ms           → phase = "fade-in"  (CSS opacity 0→1 over FADE_MS)
    //   FADE_MS       → phase = "hold"     (fully visible)
    //   duration-FADE → phase = "fade-out" (CSS opacity 1→0 over FADE_MS)
    //   duration      → call onComplete

    const t1 = setTimeout(() => setPhase("hold"),     FADE_MS);
    const t2 = setTimeout(() => setPhase("fade-out"), duration - FADE_MS);
    const t3 = setTimeout(async () => {
      if (scene.next) await onComplete(scene.next);
    }, duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [scene, onComplete]);

  // ── Click to skip ─────────────────────────────────────────────────────────
  const handleClick = async () => {
    if (skippedRef.current || !scene.next) return;
    skippedRef.current = true;
    setPhase("fade-out");
    await new Promise((r) => setTimeout(r, FADE_MS));
    await onComplete(scene.next);
  };

  // Opacity: start hidden, animate to 1 via keyframe, then CSS transition handles fade-out
  const opacity = phase === "fade-out" ? 0 : 1;

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        inset: 0,
        background: scene.bg?.color ?? "#000000",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        cursor: "pointer",
        opacity,
        transition: `opacity ${FADE_MS}ms ease`,
        animation:
          phase === "fade-in"
            ? `tsv-fadein ${FADE_MS}ms ease forwards`
            : "none",
      }}
    >
      {/* BG overlay */}
      {scene.bg?.overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: scene.bg.overlay,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Scene text */}
      {scene.text && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.88)",
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              fontWeight: 300,
              letterSpacing: "0.22em",
              textAlign: "center",
              whiteSpace: "pre-line",
              lineHeight: 2,
              opacity: phase === "hold" ? 1 : 0,
              transform: phase === "hold" ? "none" : "translateY(8px)",
              transition: `opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s`,
            }}
          >
            {scene.text}
          </p>
        </div>
      )}

      <style>{`
        @keyframes tsv-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TransitionSceneView;