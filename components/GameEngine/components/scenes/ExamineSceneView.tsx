"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { ExamineScene, SceneCharacter } from "@/types/game";
import { useIsMobile } from "@/hooks/useIsMobile";
import SceneBackground from "../SceneBackground";
import SceneCharacterSprite from "../SceneCharacterSprite";
import {
  getCharWrapperStyle,
  CHARACTER_KEYFRAMES,
} from "@/lib/Characterlayout";

interface ExamineSceneProps {
  scene: ExamineScene;
  onAdvance: (nextSceneId: string) => void;
}

export default function ExamineSceneView({
  scene,
  onAdvance,
}: ExamineSceneProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add tiny delay before showing the image so it pops nicely
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleNext = () => {
    if (scene.next) onAdvance(scene.next);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <SceneBackground bg={scene.bg} />

      {/* Characters */}
      {scene.characters?.map((char: SceneCharacter) => {
        const charWithDim = {
          ...char,
          dim: char.dim ?? true, // Always default to dim during examine so focus is on object
        };

        return (
          <div
            key={char.id}
            style={{
              ...getCharWrapperStyle(charWithDim, isMobile),
              zIndex: 2,
              willChange: "transform, opacity",
              transition:
                "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease",
            }}
          >
            <SceneCharacterSprite char={charWithDim} />
          </div>
        );
      })}

      {/* Examine Overlay Layer */}
      <div
        onClick={handleNext}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
      <div
        style={{
          position: "relative",
          width: isMobile ? "85vw" : "60vw",
          height: isMobile ? "60vh" : "75vh",
          maxWidth: 800,
          maxHeight: 1000,
          transform: mounted ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
        }}
      >
        <Image
          src={scene.image}
          alt={scene.caption || "Examine Item"}
          fill
          unoptimized
          style={{ objectFit: "contain" }}
        />
      </div>

      {scene.caption && (
        <div
          style={{
            marginTop: 24,
            padding: "12px 24px",
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "white",
            fontSize: isMobile ? "0.9rem" : "1.1rem",
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            opacity: mounted ? 1 : 0,
            transition: "all 0.5s ease 0.2s",
            textAlign: "center",
            maxWidth: "80%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {scene.caption}
        </div>
      )}
      
      {/* Click to continue hint */}
      <div style={{
          position: "absolute",
          bottom: "10%",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          animation: "blink 2s infinite ease-in-out",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 1s",
      }}>
          Tap to put away
      </div>
      
      </div> {/* Close Examine Overlay Layer */}
      
      <style>{`
          @keyframes blink {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 0.8; }
          }
          ${CHARACTER_KEYFRAMES}
      `}</style>
    </div>
  );
}
