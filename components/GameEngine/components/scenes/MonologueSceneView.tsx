"use client";

import React, { useCallback, useEffect } from "react";
import { MonologueScene } from "@/types/game";
import DialogueBox from "../DialogueBox";

interface MonologueSceneViewProps {
  scene: MonologueScene;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

export default function MonologueSceneView({
  scene,
  onAdvance,
  onApplyEffect,
}: MonologueSceneViewProps) {
  useEffect(() => {
    if (scene.effect?.shake) {
      const element = document.querySelector(".game-scene");
      const target = element instanceof HTMLElement ? element : undefined;
      onApplyEffect("screenShake", target);
    }
  }, [scene, onApplyEffect]);

  const handleAdvance = useCallback(async () => {
    if (scene.next) {
      await onAdvance(scene.next);
    }
  }, [scene, onAdvance]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: scene.bg?.color || "transparent",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {scene.bg?.overlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: scene.bg.overlay,
            zIndex: 1,
          }}
        />
      )}

      <DialogueBox speaker={undefined} text={scene.text} onAdvance={handleAdvance} />
    </div>
  );
}
