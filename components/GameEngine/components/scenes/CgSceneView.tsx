"use client";

import React, { useCallback } from "react";
import { CgScene } from "@/types/game";

interface CgSceneViewProps {
  scene: CgScene;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

export default function CgSceneView({ scene, onAdvance }: CgSceneViewProps) {
  const handleClick = useCallback(async () => {
    if (scene.next) {
      await onAdvance(scene.next);
    }
  }, [scene, onAdvance]);

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#000",
        backgroundImage: `url(${scene.image})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {scene.caption && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontSize: "18px",
            textAlign: "center",
            maxWidth: "600px",
            padding: "20px",
            background: "rgba(0,0,0,0.6)",
            borderRadius: "8px",
            zIndex: 10,
          }}
        >
          {scene.caption}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: "rgba(255,255,255,0.5)",
          fontSize: "12px",
          zIndex: 10,
        }}
      >
        Click to continue
      </div>
    </div>
  );
}
