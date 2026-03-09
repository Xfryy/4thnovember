"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import StartMenu from "@/components/StartMenu";
import Preloader from "@/components/GameEngine/Preloader";
import { loadProgress } from "@/lib/saveSystem";
import { getActFirstScene } from "@/lib/acts";

const GameEngine = dynamic(() => import("@/components/GameEngine"), { ssr: false });

type Phase = "menu" | "preloading" | "game";

export default function Home() {
  const [phase, setPhase]           = useState<Phase>("menu");
  const [targetAct, setTargetAct]   = useState(1);
  const [startSceneId, setStartSceneId] = useState<string | undefined>(undefined);

  const handleGameStart = async (act = 1) => {
    // Load save to find where to resume
    const save = await loadProgress();
    if (save && save.currentAct === act) {
      // Resume from saved scene
      setStartSceneId(save.currentSceneId);
      setTargetAct(save.currentAct);
    } else {
      // New game or different act — start from act's first scene
      setStartSceneId(getActFirstScene(act));
      setTargetAct(act);
    }
    setPhase("preloading");
  };

  if (phase === "preloading") {
    return (
      <Preloader
        actNumber={targetAct}
        onReady={() => setPhase("game")}
        onCancel={() => setPhase("menu")}
      />
    );
  }

  if (phase === "game") {
    return (
      <GameEngine
        startSceneId={startSceneId}
        onBackToMenu={() => setPhase("menu")}
      />
    );
  }

  return (
    <main className="w-full h-screen">
      <StartMenu onGameStart={handleGameStart} />
    </main>
  );
}