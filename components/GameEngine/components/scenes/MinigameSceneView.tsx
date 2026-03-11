"use client";

import React, { useMemo } from "react";
import { MinigameScene } from "@/types/game";
import type { ActConfig, GameEngineContext } from "@/components/Acts/BaseActConfig";

interface MinigameSceneViewProps {
  scene: MinigameScene;
  actConfig: ActConfig;
  context: GameEngineContext;
  onResult: (nextSceneId: string, choiceData?: any) => Promise<void>;
}

export default function MinigameSceneView({
  scene,
  actConfig,
  context,
  onResult,
}: MinigameSceneViewProps) {
  const GameComponent = useMemo(() => {
    if (!actConfig.minigames?.[scene.gameId]) {
      console.error(`❌ Minigame not found: ${scene.gameId}`);
      return null;
    }
    return actConfig.minigames[scene.gameId];
  }, [scene.gameId, actConfig]);

  const handleMinigameResult = async (result: "win" | "lose" | "quit", data?: Record<string, any>) => {
    // Determine next scene based on result
    let nextSceneId: string;

    if (result === "win" && scene.onWinNext) {
      nextSceneId = scene.onWinNext;
    } else {
      // Default fallback
      nextSceneId = scene.next || scene.id;
    }

    await onResult(nextSceneId, {
      minigameId: scene.gameId,
      minigameResult: result,
      minigameData: data,
    });
  };

  if (!GameComponent) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff6b6b",
          fontSize: "18px",
          zIndex: 50,
        }}
      >
        ❌ Minigame "{scene.gameId}" not found
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: scene.bg?.color || "rgba(0,0,0,0.95)",
        backgroundImage: scene.bg?.image ? `url(${scene.bg.image})` : undefined,
        backgroundSize: "cover",
        zIndex: 50,
      }}
    >
      <GameComponent
        title={scene.title}
        description={scene.description}
        background={scene.bg?.image}
        audio={scene.audio}
        onResult={handleMinigameResult}
        playerData={{
          choices: context.getChoices(),
          affection: {},
        }}
      />
    </div>
  );
}
