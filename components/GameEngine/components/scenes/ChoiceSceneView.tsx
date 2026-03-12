"use client";

import React, { useCallback, useState } from "react";
import type { Scene, ChoiceScene, ChoiceOption as ChoiceOptionType, SceneCharacter } from "@/types/game";
import type { GameEngineContext } from "@/components/Acts/BaseActConfig";
import {
  getPositionStyle,
  getCharSizeStyle,
  CHARACTER_KEYFRAMES,
} from "@/lib/Characterlayout";

interface ChoiceSceneViewProps {
  scene: Scene;
  context: GameEngineContext;
  onChoose: (nextSceneId: string, choiceData: any) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

const CHOICE_ICONS = ["①", "②", "③", "④", "⑤"];

function ChoiceOption({
  icon, text, chosen, isChosen, index, onClick,
}: {
  icon: string;
  text: string;
  chosen: boolean;
  isChosen: boolean;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isOther = chosen && !isChosen;
  const active  = isChosen || (!chosen && hovered);

  return (
    <button
      onClick={onClick}
      disabled={chosen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        border: isChosen
          ? "1.5px solid rgba(236,72,153,0.7)"
          : active
          ? "1px solid rgba(236,72,153,0.4)"
          : "1px solid rgba(236,72,153,0.15)",
        background: isChosen
          ? "rgba(236,72,153,0.12)"
          : active
          ? "rgba(236,72,153,0.08)"
          : "transparent",
        backdropFilter: "blur(8px)",
        color: isOther ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.88)",
        fontWeight: 500,
        fontSize: "0.88rem",
        letterSpacing: "0.03em",
        cursor: chosen ? "default" : "pointer",
        transition: "all 0.18s ease",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 12,
        animation: `ch-in 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.07 + 0.12}s both`,
        opacity: isOther ? 0.45 : 1,
        boxShadow: isChosen ? "0 0 15px rgba(236,72,153,0.12)" : "none",
        transform: !chosen && hovered ? "translateX(4px)" : "none",
      }}
    >
      <span
        style={{
          flexShrink: 0, width: 24, height: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 6,
          background: isChosen ? "rgba(236,72,153,0.2)" : "rgba(236,72,153,0.08)",
          border: "1px solid rgba(236,72,153,0.15)",
          color: "#ec4899", fontWeight: 800, fontSize: "0.75rem",
          transition: "all 0.18s ease",
        }}
      >
        {icon}
      </span>
      {text}
    </button>
  );
}

export default function ChoiceSceneView({
  scene: _scene,
  onChoose,
  onCharacterClick,
}: ChoiceSceneViewProps) {
  const scene = _scene as ChoiceScene;
  const [chosen, setChosen] = useState<string | null>(null);

  const handleChoice = useCallback(
    async (optionId: string, nextSceneId: string) => {
      if (chosen) return;
      setChosen(optionId);
      await onChoose(nextSceneId, { choiceSceneId: scene.id, choiceId: optionId });
    },
    [chosen, scene.id, onChoose],
  );

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        background: scene.bg?.color || "#0e0a1a",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {scene.bg?.overlay && (
        <div style={{ position: "absolute", inset: 0, background: scene.bg.overlay, zIndex: 1, pointerEvents: "none" }} />
      )}

      {scene.characters && scene.characters.length > 0 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          {scene.characters.map((char: SceneCharacter) => (
            <div
              key={char.id}
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
                animation: "char-from-bottom 0.45s cubic-bezier(0.22,1,0.36,1) both",
                cursor: "pointer",
              }}
              onClick={() => onCharacterClick(char.id)}
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
          ))}
        </div>
      )}

      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 10, pointerEvents: "none" }} />

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 25, padding: "0 24px 24px", userSelect: "none" }}>
        <div
          style={{
            position: "relative",
            background: "rgba(6,2,18,0.88)",
            border: "1px solid rgba(236,72,153,0.18)",
            borderRadius: 12,
            padding: "16px 20px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 -2px 40px rgba(236,72,153,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 2,
            background: "linear-gradient(180deg, transparent, rgba(236,72,153,0.5) 40%, rgba(168,85,247,0.5) 70%, transparent)",
            borderRadius: "12px 0 0 12px",
          }} />

          {scene.question && (
            <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(236,72,153,0.1)", animation: "ch-in 0.4s ease both" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingLeft: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ec4899", boxShadow: "0 0 6px #ec4899", flexShrink: 0 }} />
                <span style={{ fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.12em", background: "linear-gradient(135deg, #fce7f3, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  DECISION
                </span>
              </span>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(255,255,255,0.9)", fontWeight: 400, letterSpacing: "0.028em", margin: "8px 0 0", whiteSpace: "pre-wrap" }}>
                {scene.question}
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(scene.options as ChoiceOptionType[]).map((opt, i) => (
              <ChoiceOption
                key={opt.id}
                icon={CHOICE_ICONS[i] ?? `${i + 1}`}
                text={opt.text}
                chosen={!!chosen}
                isChosen={chosen === opt.id}
                index={i}
                onClick={() => handleChoice(opt.id, opt.next)}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        ${CHARACTER_KEYFRAMES}
        @keyframes ch-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}