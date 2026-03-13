"use client";

/**
 * ChoiceSceneView
 * FIX: Pass isMobile ke getCharWrapperStyle agar ukuran karakter responsif
 */

import React, { useCallback, useState } from "react";
import type { Scene, ChoiceScene, ChoiceOption, SceneCharacter } from "@/types/game";
import type { GameEngineContext } from "@/components/Acts/BaseActConfig";
import {
  getCharWrapperStyle,
  getCharImgStyle,
  CHARACTER_KEYFRAMES,
} from "@/lib/Characterlayout";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ChoiceSceneViewProps {
  scene: Scene;
  context: GameEngineContext;
  onChoose: (nextSceneId: string, choiceData: any) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

const CHOICE_ICONS = ["①", "②", "③", "④", "⑤"];

export default function ChoiceSceneView({
  scene: _scene,
  onChoose,
  onCharacterClick,
}: ChoiceSceneViewProps) {
  const scene    = _scene as ChoiceScene;
  const [chosen, setChosen] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleChoice = useCallback(
    async (optionId: string, nextSceneId: string) => {
      if (chosen) return;
      setChosen(optionId);
      await onChoose(nextSceneId, { choiceSceneId: scene.id, choiceId: optionId });
    },
    [chosen, scene.id, onChoose],
  );

  return (
    <div style={{
      position:        "absolute",
      inset:           0,
      background:      scene.bg?.color || "#0e0a1a",
      backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
      backgroundSize:  "cover",
      backgroundPosition: "center",
      overflow:        "hidden",
    }}>
      {scene.bg?.overlay && (
        <div style={{
          position:      "absolute",
          inset:         0,
          background:    scene.bg.overlay,
          zIndex:        1,
          pointerEvents: "none",
        }} />
      )}

      {/* Characters */}
      {scene.characters && scene.characters.length > 0 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          {scene.characters.map((char: SceneCharacter) => (
            <div
              key={char.id}
              style={getCharWrapperStyle(char, isMobile)}
              onClick={() => onCharacterClick(char.id)}
            >
              <img
                src={char.sprite}
                alt={char.id}
                style={getCharImgStyle(char)}
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position:      "absolute",
        inset:         0,
        background:    `linear-gradient(180deg, transparent 0%, rgba(0,0,0,${isMobile ? "0.7" : "0.6"}) 100%)`,
        zIndex:        10,
        pointerEvents: "none",
      }} />

      {/* Choice box */}
      <div style={{
        position: "absolute",
        bottom:   0,
        left:     0,
        right:    0,
        zIndex:   25,
        padding:  isMobile ? "0 12px 12px" : "0 24px 24px",
      }}>
        <div style={{
          background:     "rgba(6,2,18,0.88)",
          border:         "1px solid rgba(236,72,153,0.18)",
          borderRadius:   12,
          padding:        isMobile ? "12px 16px" : "16px 20px",
          backdropFilter: "blur(20px)",
        }}>
          {scene.question && (
            <div style={{ marginBottom: isMobile ? 12 : 16 }}>
              <p style={{
                fontSize: isMobile ? "0.85rem" : "0.95rem",
                color:    "rgba(255,255,255,0.9)",
                margin:   0,
              }}>
                {scene.question}
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 6 : 8 }}>
            {(scene.options as ChoiceOption[]).map((opt, i) => (
              <button
                key={opt.id}
                onClick={() => handleChoice(opt.id, opt.next)}
                disabled={!!chosen}
                style={{
                  padding:     isMobile ? "10px 12px" : "10px 14px",
                  borderRadius: 8,
                  border:      chosen === opt.id
                    ? "1.5px solid rgba(236,72,153,0.7)"
                    : "1px solid rgba(236,72,153,0.15)",
                  background:  chosen === opt.id ? "rgba(236,72,153,0.12)" : "transparent",
                  color:       chosen && chosen !== opt.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.88)",
                  fontSize:    isMobile ? "0.82rem" : "0.88rem",
                  textAlign:   "left",
                  display:     "flex",
                  alignItems:  "center",
                  gap:         isMobile ? 8 : 12,
                  width:       "100%",
                  cursor:      chosen ? "default" : "pointer",
                }}
              >
                <span style={{
                  width:           isMobile ? 22 : 24,
                  height:          isMobile ? 22 : 24,
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  borderRadius:    6,
                  background:      "rgba(236,72,153,0.08)",
                  color:           "#ec4899",
                  fontSize:        isMobile ? "0.68rem" : "0.75rem",
                  flexShrink:      0,
                }}>
                  {CHOICE_ICONS[i] ?? i + 1}
                </span>
                <span style={{ flex: 1 }}>{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{CHARACTER_KEYFRAMES}</style>
    </div>
  );
}