"use client";

import React, { useEffect, useRef, useState } from "react";
import type { TransitionScene } from "@/types/game";
import { audioManager } from "@/lib/Audiomanager";

export interface TransitionSceneViewProps {
  scene: TransitionScene;
  onComplete: (nextSceneId: string) => Promise<void>;
}

type TransitionPhase = "fade-in" | "hold" | "fade-out";

const FADE_MS = 400; // Lebih cepat untuk efek kedip

const TransitionSceneView: React.FC<TransitionSceneViewProps> = ({
  scene,
  onComplete,
}) => {
  const [phase, setPhase] = useState<TransitionPhase>("fade-in");
  const skippedRef = useRef(false);

  useEffect(() => {
    if (scene.audio?.bgm) audioManager.playBGM(scene.audio.bgm, 500);
  }, [scene.audio]);

  useEffect(() => {
    skippedRef.current = false;
    const duration = Math.max(scene.duration ?? 800, FADE_MS * 2);

    const t1 = setTimeout(() => setPhase("hold"), FADE_MS);
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

  const handleClick = async () => {
    if (skippedRef.current || !scene.next) return;
    skippedRef.current = true;
    setPhase("fade-out");
    await new Promise((r) => setTimeout(r, FADE_MS));
    await onComplete(scene.next);
  };

  // Efek transisi yang lebih smooth - menggunakan opacity dengan easing yang tepat
  const getOpacity = () => {
    switch (phase) {
      case "fade-in": return 1; // CSS animation handle from 0 to 1
      case "hold": return 1;
      case "fade-out": return 0;
      default: return 1;
    }
  };

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
        opacity: getOpacity(),
        transition: phase === "fade-out" ? `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none",
        animation: phase === "fade-in" 
          ? `tsv-fadein ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards` 
          : "none",
      }}
    >
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
              transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {scene.text}
          </p>
        </div>
      )}

      <style>{`
        @keyframes tsv-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TransitionSceneView;