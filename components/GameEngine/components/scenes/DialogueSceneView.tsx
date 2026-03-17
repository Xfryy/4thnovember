"use client";

/**
 * DialogueSceneView
 * FIX: Pass isMobile ke getCharWrapperStyle agar ukuran karakter responsif
 */

import React, { useCallback } from "react";
import type { Scene, DialogueScene, SceneCharacter } from "@/types/game";
import DialogueBox from "../DialogueBox";
import SceneBackground from "../SceneBackground";
import SceneCharacterSprite from "../SceneCharacterSprite";
import {
  getCharWrapperStyle,
  CHARACTER_KEYFRAMES,
} from "@/lib/Characterlayout";
import { useIsMobile } from "@/hooks/useIsMobile";

interface DialogueSceneViewProps {
  scene: Scene;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
}

export default function DialogueSceneView({
  scene: _scene,
  onAdvance,
  onCharacterClick,
}: DialogueSceneViewProps) {
  const scene    = _scene as DialogueScene;
  const isMobile = useIsMobile();

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
      {scene.characters?.map((char: SceneCharacter) => {
        const isSpeaking = char.id === scene.speakerId;

        const charWithDim = {
          ...char,
          dim: char.dim ?? (!!scene.speakerId && !isSpeaking),
        };

        return (
          <div
            key={char.id}
            style={{
              ...getCharWrapperStyle(charWithDim, isMobile),
              willChange: "transform, opacity",
              transition:
                "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease",
            }}
            onClick={() => onCharacterClick(char.id)}
          >
            <SceneCharacterSprite char={charWithDim} />
          </div>
        );
      })}

      <DialogueBox
        speaker={scene.speaker}
        text={scene.text}
        onAdvance={handleAdvance}
        sceneId={scene.id}
      />

      <style>{CHARACTER_KEYFRAMES}</style>
    </div>
  );
}