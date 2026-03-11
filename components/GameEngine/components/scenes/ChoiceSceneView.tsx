"use client";

import React, { useCallback, useState } from "react";
import { ChoiceScene, SceneCharacter, CharacterPosition, CharacterSize } from "@/types/game";
import { GameEngineContext } from "@/components/Acts/BaseActConfig";

interface ChoiceSceneViewProps {
  scene: ChoiceScene;
  context: GameEngineContext;
  onChoose: (nextSceneId: string, choiceData: any) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

const CHOICE_ICONS = ["①", "②", "③", "④", "⑤"];

export default function ChoiceSceneView({ scene, onChoose, onCharacterClick }: ChoiceSceneViewProps) {
  const [chosen, setChosen] = useState<string | null>(null);

  const handleChoice = useCallback(async (optionId: string, nextSceneId: string) => {
    if (chosen) return; // prevent double-click
    setChosen(optionId);
    await onChoose(nextSceneId, { choiceSceneId: scene.id, choiceId: optionId });
  }, [scene, onChoose, chosen]);

  const getPositionStyle = (position?: CharacterPosition): React.CSSProperties => {
    const positions: Record<CharacterPosition, React.CSSProperties> = {
      "far-left":    { left: "-3%", right: "auto" },
      left:          { left: "3%", right: "auto" },
      "center-left": { left: "18%", right: "auto" },
      center:        { left: "50%", right: "auto", marginLeft: -240 },
      "center-right":{ right: "18%", left: "auto" },
      right:         { right: "3%", left: "auto" },
      "far-right":   { right: "-3%", left: "auto" },
    };
    return positions[position || "center"] || positions.center;
  };

  const getSizeStyle = (size?: CharacterSize) => {
    const sizes: Record<CharacterSize, { width: number; height: number }> = {
      small:  { width: 240, height: 360 },
      medium: { width: 340, height: 510 },
      large:  { width: 480, height: 720 },
      xl:     { width: 600, height: 900 },
      full:   { width: 540, height: 860 },
    };
    const s = sizes[size || "large"];
    return { width: s.width, height: s.height, maxHeight: "90vh" };
  };

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: scene.bg?.color || "#0e0a1a",
      backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      overflow: "hidden",
    }}>
      {/* BG overlay */}
      {scene.bg?.overlay && (
        <div style={{
          position: "absolute", inset: 0,
          background: scene.bg.overlay,
          zIndex: 1, pointerEvents: "none",
        }} />
      )}

      {/* Characters */}
      {scene.characters && scene.characters.length > 0 && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
          {scene.characters.map((char: SceneCharacter) => (
            <div
              key={char.id}
              style={{
                position: "absolute",
                bottom: 110,
                ...getPositionStyle(char.position),
                zIndex: char.zIndex ?? 4,
                opacity: char.dim ? 0.42 : 1,
                filter: char.dim
                  ? "brightness(0.45) saturate(0.3)"
                  : "drop-shadow(0 16px 48px rgba(0,0,0,0.55))",
                transition: "opacity 0.35s ease, filter 0.35s ease",
                transform: char.flip ? "scaleX(-1)" : undefined,
                animation: "char-from-bottom 0.45s cubic-bezier(0.22,1,0.36,1) both",
              }}
              onClick={() => onCharacterClick(char.id)}
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
          ))}
        </div>
      )}

      {/* Dim overlay for choices */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.42)",
        zIndex: 10,
      }} />

      {/* Choice UI — Dialog box style at bottom */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        zIndex: 25,
        padding: "0 24px 24px",
        userSelect: "none",
      }}>
        {/* Main choice container */}
        <div style={{
          position: "relative",
          background: "rgba(6,2,18,0.86)",
          border: "1px solid rgba(236,72,153,0.18)",
          borderRadius: 12,
          padding: "16px 20px",
          backdropFilter: "blur(20px)",
          boxShadow: [
            "0 -2px 40px rgba(236,72,153,0.05)",
            "inset 0 1px 0 rgba(255,255,255,0.04)",
            "inset 0 0 40px rgba(168,85,247,0.03)",
          ].join(", "),
          overflow: "hidden",
        }}>
          {/* Subtle gradient shimmer on left edge */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            width: 2,
            background: "linear-gradient(180deg, transparent, rgba(236,72,153,0.5) 40%, rgba(168,85,247,0.5) 70%, transparent)",
            borderRadius: "12px 0 0 12px",
          }} />

          {/* Question header */}
          {scene.question && (
            <div style={{
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: "1px solid rgba(236,72,153,0.1)",
              animation: "ch-in 0.4s ease both",
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0 0 0 8px",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#ec4899",
                  boxShadow: "0 0 6px #ec4899",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  letterSpacing: "0.12em",
                  background: "linear-gradient(135deg, #fce7f3, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  DECISION
                </span>
              </span>
              <p style={{
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.9)",
                fontWeight: 400,
                letterSpacing: "0.028em",
                margin: "8px 0 0 0",
                whiteSpace: "pre-wrap",
              }}>
                {scene.question}
              </p>
            </div>
          )}

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scene.options.map((opt, i) => {
              const isChosen = chosen === opt.id;
              const isOther  = chosen && !isChosen;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id, opt.next)}
                  disabled={!!chosen}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: isChosen
                      ? "1.5px solid rgba(236,72,153,0.7)"
                      : "1px solid rgba(236,72,153,0.15)",
                    background: isChosen
                      ? "rgba(236,72,153,0.12)"
                      : "transparent",
                    backdropFilter: "blur(8px)",
                    color: isOther
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(255,255,255,0.88)",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    letterSpacing: "0.03em",
                    cursor: chosen ? "default" : "pointer",
                    transition: "all 0.18s ease",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    animation: `ch-in 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.07 + 0.12}s both`,
                    opacity: isOther ? 0.45 : 1,
                    boxShadow: isChosen
                      ? "0 0 15px rgba(236,72,153,0.12)"
                      : "none",
                  }}
                  onMouseEnter={e => {
                    if (!chosen) {
                      (e.target as HTMLButtonElement).style.background = "rgba(236,72,153,0.1)";
                      (e.target as HTMLButtonElement).style.borderColor = "rgba(236,72,153,0.4)";
                      (e.target as HTMLButtonElement).style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!chosen) {
                      (e.target as HTMLButtonElement).style.background = "transparent";
                      (e.target as HTMLButtonElement).style.borderColor = "rgba(236,72,853,0.15)";
                      (e.target as HTMLButtonElement).style.transform = "none";
                    }
                  }}
                >
                  {/* Number badge */}
                  <span style={{
                    flexShrink: 0,
                    width: 24, height: 24,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 6,
                    background: isChosen ? "rgba(236,72,153,0.2)" : "rgba(236,72,153,0.08)",
                    border: "1px solid rgba(236,72,153,0.15)",
                    color: "#ec4899",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    transition: "all 0.18s ease",
                  }}>
                    {CHOICE_ICONS[i] ?? `${i + 1}`}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ch-char { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes ch-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}