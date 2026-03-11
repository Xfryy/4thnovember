"use client";

import React, { useEffect } from "react";
import { TransitionScene } from "@/types/game";
import { audioManager } from "@/lib/Audiomanager";

interface TransitionSceneViewProps {
  scene: TransitionScene;
  onComplete: (nextSceneId: string) => Promise<void>;
}

export default function TransitionSceneView({ scene, onComplete }: TransitionSceneViewProps) {
  // Play scene audio if exists
  useEffect(() => {
    if (scene.audio?.bgm) {
      audioManager.playBGM(scene.audio.bgm, 500);
    }
  }, [scene.audio]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scene.next) {
        onComplete(scene.next);
      }
    }, scene.duration || 3000);

    return () => clearTimeout(timer);
  }, [scene, onComplete]);

  return (
    <div
      onClick={() => scene.next && onComplete(scene.next)}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: scene.bg?.color ?? "#06020f",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Background overlay */}
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

      {/* Transition text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          animation: "tr-fade 0.9s ease both",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            fontWeight: 300,
            letterSpacing: "0.22em",
            textAlign: "center",
            whiteSpace: "pre-line",
            lineHeight: 1.9,
            animation: "tr-text 1s ease 0.35s both",
          }}
        >
          {scene.text}
        </p>
      </div>

      <style>{`
        @keyframes tr-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes tr-text {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
