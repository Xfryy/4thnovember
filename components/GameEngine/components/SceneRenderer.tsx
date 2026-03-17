"use client";

import React from "react";
import type {
  Scene,
  DialogueScene,
  MonologueScene,
  ChoiceScene,
  TransitionScene,
  CgScene,
  EndingScene,
  MinigameScene,
  ExamineScene,
} from "@/types/game";
import type { ActConfig, GameEngineContext } from "@/components/Acts/BaseActConfig";

import DialogueSceneView   from "./scenes/DialogueSceneView";
import MonologueSceneView  from "./scenes/MonologueSceneView";
import ChoiceSceneView     from "./scenes/ChoiceSceneView";
import TransitionSceneView from "./scenes/TransitionSceneView";
import CgSceneView         from "./scenes/CgSceneView";
import EndingSceneView     from "./scenes/EndingSceneView";
import MinigameSceneView   from "./scenes/MinigameSceneView";
import ExamineSceneView    from "./scenes/ExamineSceneView";

interface SceneRendererProps {
  scene:            Scene;
  actConfig:        ActConfig;
  context:          GameEngineContext;
  onSceneAdvance:   (nextSceneId: string, choiceData?: any) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
  onApplyEffect:    (effectName: string, target?: HTMLElement) => Promise<void>;
}

function makeAdvance(
  fn: (id: string, data?: any) => Promise<void>
): (nextSceneId: string) => Promise<void> {
  return (nextSceneId: string) => fn(nextSceneId);
}

function makeChoose(
  fn: (id: string, data?: any) => Promise<void>
): (nextSceneId: string, choiceData: any) => Promise<void> {
  return (nextSceneId: string, choiceData: any) => fn(nextSceneId, choiceData);
}

export default function SceneRenderer({
  scene,
  actConfig,
  context,
  onSceneAdvance,
  onCharacterClick,
  onApplyEffect,
}: SceneRendererProps) {
  const advance = makeAdvance(onSceneAdvance);
  const choose  = makeChoose(onSceneAdvance);

  // Gunakan type guard yang benar
  if (scene.type === "dialogue") {
    return (
      <DialogueSceneView
        scene={scene as DialogueScene}
        onAdvance={advance}
        onCharacterClick={onCharacterClick}
      />
    );
  }

  if (scene.type === "monologue") {
    return (
      <MonologueSceneView
        scene={scene as MonologueScene}
        onAdvance={advance}
        onApplyEffect={onApplyEffect}
      />
    );
  }

  if (scene.type === "choice") {
    return (
      <ChoiceSceneView
        scene={scene as ChoiceScene}
        context={context}
        onChoose={choose}
        onCharacterClick={onCharacterClick}
        onApplyEffect={onApplyEffect}
      />
    );
  }

  // Perbaiki: pisahkan transition dan cg dengan jelas
  if (scene.type === "transition") {
    return (
      <TransitionSceneView
        scene={scene as TransitionScene}
        onComplete={advance}
      />
    );
  }

  if (scene.type === "cg") {
    return (
      <CgSceneView
        scene={scene as CgScene}
        onAdvance={advance}
      />
    );
  }

  if (scene.type === "ending") {
    return (
      <EndingSceneView
        scene={scene as EndingScene}
        onAdvance={advance}
        onApplyEffect={onApplyEffect}
      />
    );
  }

  if (scene.type === "minigame") {
    return (
      <MinigameSceneView
        scene={scene as MinigameScene}
        actConfig={actConfig}
        context={context}
        onResult={choose}
      />
    );
  }

  if (scene.type === "examine") {
    return (
      <ExamineSceneView
        scene={scene as ExamineScene}
        onAdvance={advance}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#000", color: "#ff6b6b", fontSize: 18,
      }}
    >
      ❌ Unknown scene type: {(scene as any).type}
    </div>
  );
}