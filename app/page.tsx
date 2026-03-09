"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import StartMenu from "@/components/StartMenu";
import Preloader from "@/components/GameEngine/Preloader";
import { getActFirstScene } from "@/lib/acts";

const GameEngine = dynamic(() => import("@/components/GameEngine"), { ssr: false });

type Phase = "menu" | "preloading" | "game";

export default function Home() {
  const [phase, setPhase]               = useState<Phase>("menu");
  const [targetAct, setTargetAct]       = useState(1);
  const [startSceneId, setStartSceneId] = useState<string | undefined>(undefined);

  /**
   * onGameStart(act, sceneId?)
   * - act      : which act to preload
   * - sceneId  : specific scene to resume (from save slot); undefined = first scene of act
   */
  const handleGameStart = (act = 1, sceneId?: string) => {
    setTargetAct(act);
    setStartSceneId(sceneId ?? getActFirstScene(act));
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
        actNumber={targetAct}
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