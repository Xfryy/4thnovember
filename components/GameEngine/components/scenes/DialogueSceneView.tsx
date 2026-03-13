"use client";

/**
 * DialogueSceneView
 * FIX: Pass isMobile ke getCharWrapperStyle agar ukuran karakter responsif
 */

import React, { useCallback } from "react";
import type { Scene, DialogueScene, SceneCharacter } from "@/types/game";
import DialogueBox from "../DialogueBox";
import {
  getCharWrapperStyle,
  getCharImgStyle,
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
        background:         scene.bg?.color || "#000",
        backgroundImage:    scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize:     scene.bg?.size ?? "cover",
        backgroundPosition: scene.bg?.position ?? "center top",
        overflow:           "hidden",
      }}
    >
      {/* Overlay */}
      {scene.bg?.overlay && (
        <div
          style={{
            position:      "absolute",
            inset:         0,
            background:    scene.bg.overlay,
            zIndex:        1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Characters */}
      {scene.characters?.map((char: SceneCharacter) => {
        const isSpeaking = char.id === scene.speakerId;

        const charWithDim = {
          ...char,
          dim: char.dim ?? (!!scene.speakerId && !isSpeaking),
        };

        return (
          <div
            key={`${char.id}-${char.sprite}`}
            style={getCharWrapperStyle(charWithDim, isMobile)}
            onClick={() => onCharacterClick(char.id)}
          >
            <img
              src={char.sprite}
              alt={char.id}
              style={getCharImgStyle(charWithDim)}
              draggable={false}
            />
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