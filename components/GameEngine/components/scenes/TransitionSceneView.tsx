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
const FADE_OUT_MS = 1200; // Lebih lambat untuk efek bangun tidur

const TransitionSceneView: React.FC<TransitionSceneViewProps> = ({
  scene,
  onComplete,
}) => {
  const [phase, setPhase] = useState<TransitionPhase>("fade-in");
  const [darkenOpacity, setDarkenOpacity] = useState(0);
  const skippedRef = useRef(false);

  useEffect(() => {
    if (scene.audio?.bgm) audioManager.playBGM(scene.audio.bgm, 500);
  }, [scene.audio]);

  useEffect(() => {
    skippedRef.current = false;
    const duration = Math.max(scene.duration ?? 800, FADE_MS + FADE_OUT_MS);

    const t1 = setTimeout(() => {
      setPhase("hold");
      // Start darkening effect during hold phase - fade to black
      setDarkenOpacity(1);
    }, FADE_MS);
    const t2 = setTimeout(() => setPhase("fade-out"), duration - FADE_OUT_MS);
    const t3 = setTimeout(async () => {
      if (scene.next) await onComplete(scene.next);
    }, duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [scene, onComplete]);

  // Skip transition disabled based on user preference
  // Transition scenes are meant to be unskippable delays.

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
      style={{
        position: "absolute",
        inset: 0,
        background: scene.bg?.color ?? "#000000",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        opacity: getOpacity(),
        transition: phase === "fade-out" ? `opacity ${FADE_OUT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none",
        animation: phase === "fade-in"
          ? `tsv-fadein ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
          : "none",
      }}
    >
      {/* Darken overlay with smooth transition - fade to black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: darkenOpacity,
          pointerEvents: "none",
          zIndex: 1,
          transition: `opacity ${FADE_MS * 2}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />

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
              color: "#ffffff",
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              fontWeight: 400,
              letterSpacing: "0.22em",
              textAlign: "center",
              whiteSpace: "pre-line",
              lineHeight: 2,
              opacity: phase === "hold" ? 1 : 0,
              transform: phase === "hold" ? "none" : "translateY(8px)",
              transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              // Text shadow untuk kontras maksimal pada background gelap
              textShadow: `
                0 0 10px rgba(0, 0, 0, 0.8),
                0 0 20px rgba(0, 0, 0, 0.6),
                0 0 30px rgba(0, 0, 0, 0.4),
                0 2px 4px rgba(0, 0, 0, 0.5),
                0 4px 8px rgba(0, 0, 0, 0.3)
              `,
              // Fallback stroke untuk keterbacaan ekstra
              WebkitTextStroke: "1px rgba(0, 0, 0, 0.5)",
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