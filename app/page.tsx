"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import StartMenu from "@/components/StartMenu";
import Preloader from "@/components/GameEngine/components/Preloader"; // Path ini harus sesuai
import { getActFirstScene } from "@/lib/acts";

const GameEngine = dynamic(() => import("@/components/GameEngine"), { ssr: false });

type Phase = "menu" | "preloading" | "game";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [targetAct, setTargetAct] = useState(1);
  const [startSceneId, setStartSceneId] = useState<string | undefined>(undefined);

  const handleGameStart = (act = 1, sceneId?: string) => {
    setTargetAct(act);
    setStartSceneId(sceneId ?? getActFirstScene(act));
    setPhase("preloading");
  };

  const handleBackToMenu = useCallback(() => {
    setPhase("menu");
  }, []);

  // Render berdasarkan phase
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
        characterName="Player" // Tambahkan ini
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