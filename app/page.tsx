"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import StartMenu from "@/components/StartMenu";
import Preloader from "@/components/GameEngine/components/Preloader"; // Path ini harus sesuai
import { getActFirstScene } from "@/components/Acts/acts";

const GameEngine = dynamic(() => import("@/components/GameEngine"), { ssr: false });

type Phase = "interaction" | "menu" | "preloading" | "game";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("interaction");
  const [targetAct, setTargetAct] = useState(1);
  const [startSceneId, setStartSceneId] = useState<string | undefined>(undefined);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleInteractionStart = () => {
    setIsTransitioning(true);
    // Silent audio context unlock
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      ctx.resume().then(() => ctx.close());
    }
    setTimeout(() => {
      setPhase("menu");
    }, 500); // match fade out duration
  };

  const handleGameStart = (act = 1, sceneId?: string) => {
    setTargetAct(act);
    setStartSceneId(sceneId ?? getActFirstScene(act));
    setPhase("preloading");
  };

  const handleBackToMenu = useCallback(() => {
    setPhase("menu");
  }, []);

  // Render berdasarkan phase
  if (phase === "interaction") {
    return (
      <main
        className="w-full h-screen flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={handleInteractionStart}
        style={{
          background: "linear-gradient(160deg, #03030d 0%, #090515 50%, #110420 100%)",
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, fontStyle: "italic",
          letterSpacing: "0.2em", marginBottom: 40, textAlign: "center",
          background: "linear-gradient(135deg, #fce7f3 0%, #ec4899 40%, #6366f1 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          4th November
        </h1>
        <p className="animate-pulse" style={{
          fontSize: "0.85rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
        }}>
          Tap anywhere to start
        </p>
      </main>
    );
  }

  if (phase === "preloading") {
    return (
      <Preloader
        actNumber={targetAct}
        startSceneId={startSceneId}
        onReady={() => setPhase("game")}
        onCancel={() => setPhase("menu")}
      />
    );
  }

  if (phase === "game") {
    return (
      <GameEngine
        actNumber={targetAct}
        startSceneId={startSceneId}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // phase === "menu"
  return (
    <main className="w-full h-screen">
      <StartMenu onGameStart={handleGameStart} />
    </main>
  );
}