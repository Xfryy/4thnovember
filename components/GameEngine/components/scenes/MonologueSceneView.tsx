"use client";

/**
 * MonologueSceneView
 * FIX: Pass isMobile ke getCharWrapperStyle agar ukuran karakter responsif
 */

import React, { useCallback } from "react";
import type { Scene, MonologueScene, SceneCharacter } from "@/types/game";
import DialogueBox from "../DialogueBox";
import SceneBackground from "../SceneBackground";
import SceneCharacterSprite from "../SceneCharacterSprite";
import {
  getCharWrapperStyle,
  CHARACTER_KEYFRAMES,
} from "@/lib/Characterlayout";
import { useIsMobile } from "@/hooks/useIsMobile";

interface MonologueSceneViewProps {
  scene: Scene;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

export default function MonologueSceneView({
  scene: _scene,
  onAdvance,
}: MonologueSceneViewProps) {
  const scene      = _scene as MonologueScene;
  const characters = (scene as any).characters as SceneCharacter[] | undefined;
  const isMobile   = useIsMobile();

  const handleAdvance = useCallback(async () => {
    if (scene.next) await onAdvance(scene.next);
  }, [scene.next, onAdvance]);

  return (
    <div
      style={{
        position:           "absolute",
        inset:              0,
        width:              "100%",
        height:             "100%",
        overflow:           "hidden",
      }}
    >
      <SceneBackground bg={scene.bg} />

      {/* Characters */}
      {characters && characters.length > 0 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
          {characters.map((char) => (
            <div
              key={char.id}
              style={{
                ...getCharWrapperStyle(char, isMobile),
                willChange: "transform, opacity",
                transition:
                  "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease",
              }}
            >
              <SceneCharacterSprite char={char} />
            </div>
          ))}
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