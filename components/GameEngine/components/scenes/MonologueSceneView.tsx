"use client";

import React, { useCallback } from "react";
import type { Scene, MonologueScene, SceneCharacter } from "@/types/game";
import DialogueBox from "../DialogueBox";
import {
  getPositionStyle,
  getCharSizeStyle,
  getAnimName,
  CHARACTER_KEYFRAMES,
} from "@/lib/Characterlayout";

interface MonologueSceneViewProps {
  scene: Scene;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

export default function MonologueSceneView({
  scene: _scene,
  onAdvance,
}: MonologueSceneViewProps) {
  const scene = _scene as MonologueScene;

  const handleAdvance = useCallback(async () => {
    if (scene.next) await onAdvance(scene.next);
  }, [scene.next, onAdvance]);

  const characters = (scene as any).characters as SceneCharacter[] | undefined;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: scene.bg?.color ?? "#000",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        overflow: "hidden",
      }}
    >
      {scene.bg?.overlay && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: scene.bg.overlay,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {characters && characters.length > 0 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
          {characters.map((char) => {
            const animName = getAnimName(char.animation);
            return (
              <div
                key={`${char.id}-${char.sprite}`}
                style={{
                  position: "absolute",
                  bottom: 0,
                  ...getPositionStyle(char.position),
                  zIndex: char.zIndex ?? 4,
                  opacity: char.dim ? 0.42 : 1,
                  filter: char.dim
                    ? "brightness(0.45) saturate(0.3)"
                    : "drop-shadow(0 16px 48px rgba(0,0,0,0.55))",
                  transition: "opacity 0.35s ease, filter 0.35s ease",
                  transform: char.flip ? "scaleX(-1)" : undefined,
                  animation: animName !== "none"
                    ? `${animName} 0.45s cubic-bezier(0.22,1,0.36,1) both`
                    : undefined,
                }}
              >
                <img
                  src={char.sprite}
                  alt={char.id}
                  style={{
                    ...getCharSizeStyle(char),
                    objectFit: "contain",
                    objectPosition: "bottom",
                    display: "block",
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      )}

      <DialogueBox
        speaker={undefined}
        text={scene.text}
        onAdvance={handleAdvance}
        italic
        sceneId={scene.id}
      />

      <style>{CHARACTER_KEYFRAMES}</style>
    </div>
  );
}