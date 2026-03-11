"use client";

/**
 * DialogueSceneView - Render dialogue with characters, background, and dialogue box
 */

import React, { useCallback, useEffect } from "react";
import { DialogueScene, SceneCharacter, CharacterPosition, CharacterSize } from "@/types/game";
import { GameEngineContext } from "@/components/Acts/BaseActConfig";
import DialogueBox from "../DialogueBox";

interface DialogueSceneViewProps {
  scene: DialogueScene;
  context: GameEngineContext;
  onAdvance: (nextSceneId: string) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

export default function DialogueSceneView({
  scene,
  onAdvance,
  onCharacterClick,
  onApplyEffect,
}: DialogueSceneViewProps) {

  // Apply effects if specified
  useEffect(() => {
    const element = document.querySelector(".game-scene");
    const target = element instanceof HTMLElement ? element : undefined;
    
    if (scene.effect?.shake && target) {
      onApplyEffect("screenShake", target);
    }
    if (scene.effect?.flash && target) {
      onApplyEffect("flashEffect", target);
    }
  }, [scene, onApplyEffect]);

  const handleAdvance = useCallback(async () => {
    if (scene.next) {
      await onAdvance(scene.next);
    }
  }, [scene, onAdvance]);

  const handleCharacterClick = useCallback(
    async (characterId: string) => {
      await onCharacterClick(characterId);
    },
    [onCharacterClick]
  );

  const getPositionStyle = (position?: CharacterPosition): React.CSSProperties => {
    const positions: Record<CharacterPosition, React.CSSProperties> = {
      "far-left": { left: "-3%", right: "auto" },
      left: { left: "3%", right: "auto" },
      "center-left": { left: "18%", right: "auto" },
      center: { left: "50%", right: "auto", marginLeft: -240 },
      "center-right": { right: "18%", left: "auto" },
      right: { right: "3%", left: "auto" },
      "far-right": { right: "-3%", left: "auto" },
    };
    return positions[position || "center"] || positions.center;
  };

  const getSizeStyle = (size?: CharacterSize) => {
    const sizes: Record<CharacterSize, { width: number; height: number }> = {
      small: { width: 240, height: 360 },
      medium: { width: 340, height: 510 },
      large: { width: 480, height: 720 },
      xl: { width: 600, height: 900 },
      full: { width: 540, height: 860 },
    };
    const s = sizes[size || "large"];
    return {
      width: s.width,
      height: s.height,
      maxHeight: "90vh",
    };
  };

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
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay */}
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

      {/* Characters */}
      {scene.characters && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            padding: "40px 20px",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          {scene.characters.map((char: SceneCharacter) => {
            const isSpeaking = char.id === scene.speakerId;
            const hasActiveSpeaker = !!scene.speakerId;
            const dim = char.dim || (hasActiveSpeaker && !isSpeaking);

            const animName = (() => {
              switch (char.animation ?? "enter-bottom") {
                case "enter-left":
                  return "char-from-left";
                case "enter-right":
                  return "char-from-right";
                case "fade":
                  return "char-fade";
                case "none":
                  return "none";
                default:
                  return "char-from-bottom";
              }
            })();

            return (
              <div
                key={`${char.id}-${char.sprite}`}
                style={{
                  position: "absolute",
                  bottom: 110,
                  ...getPositionStyle(char.position),
                  zIndex: char.zIndex ?? (isSpeaking ? 5 : 4),
                  opacity: dim ? 0.42 : 1,
                  filter: dim
                    ? "brightness(0.45) saturate(0.3)"
                    : "drop-shadow(0 16px 48px rgba(0,0,0,0.55))",
                  transition: "opacity 0.35s ease, filter 0.35s ease",
                  transform: char.flip ? "scaleX(-1)" : undefined,
                  animation:
                    animName !== "none"
                      ? `${animName} 0.45s cubic-bezier(0.22,1,0.36,1) both`
                      : undefined,
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
                onClick={() => handleCharacterClick(char.id)}
              >
                <img
                  src={char.sprite}
                  alt={char.id}
                  style={{
                    ...getSizeStyle(char.size),
                    objectFit: "contain",
                    objectPosition: "bottom",
                    display: "block",
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Dialogue box */}
      <DialogueBox
        speaker={scene.speaker}
        text={scene.text}
        onAdvance={handleAdvance}
      />

      {/* Character animations */}
      <style>{`
        @keyframes char-from-bottom {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes char-from-left {
          from {
            opacity: 0;
            transform: translateX(-36px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes char-from-right {
          from {
            opacity: 0;
            transform: translateX(36px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes char-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fx-shake {
          0%, 100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-7px);
          }
          40% {
            transform: translateX(7px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
}
