"use client";

/**
 * SceneRenderer - Routes scene to appropriate viewer component based on type
 */

import React, { useMemo } from "react";
import {
  Scene,
  DialogueScene,
  MonologueScene,
  ChoiceScene,
  TransitionScene,
  CgScene,
  EndingScene,
  MinigameScene,
} from "@/types/game";
import { ActConfig, GameEngineContext } from "@/components/Acts/BaseActConfig";
import DialogueSceneView from "./scenes/DialogueSceneView";
import MonologueSceneView from "./scenes/MonologueSceneView";
import ChoiceSceneView from "./scenes/ChoiceSceneView";
import TransitionSceneView from "./scenes/TransitionSceneView";
import CgSceneView from "./scenes/CgSceneView";
import EndingSceneView from "./scenes/EndingSceneView";
import MinigameSceneView from "./scenes/MinigameSceneView";

interface SceneRendererProps {
  scene: Scene;
  actConfig: ActConfig;
  context: GameEngineContext;
  onSceneAdvance: (nextSceneId: string, choiceData?: any) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
  onApplyEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
}

export default function SceneRenderer({
  scene,
  actConfig,
  context,
  onSceneAdvance,
  onCharacterClick,
  onApplyEffect,
}: SceneRendererProps) {
  const renderer = useMemo(() => {
    switch (scene.type) {
      case "dialogue":
        return (
          <DialogueSceneView
            scene={scene as DialogueScene}
            context={context}
            onAdvance={onSceneAdvance}
            onCharacterClick={onCharacterClick}
            onApplyEffect={onApplyEffect}
          />
        );

      case "monologue":
        return (
          <MonologueSceneView
            scene={scene as MonologueScene}
            onAdvance={onSceneAdvance}
            onApplyEffect={onApplyEffect}
          />
        );

      case "choice":
        return (
          <ChoiceSceneView
            scene={scene as ChoiceScene}
            context={context}
            onChoose={onSceneAdvance}
            onCharacterClick={onCharacterClick}
            onApplyEffect={onApplyEffect}
          />
        );

      case "transition":
        return (
          <TransitionSceneView
            scene={scene as TransitionScene}
            onComplete={onSceneAdvance}
          />
        );

      case "cg":
        return (
          <CgSceneView
            scene={scene as CgScene}
            onAdvance={onSceneAdvance}
            onApplyEffect={onApplyEffect}
          />
        );

      case "ending":
        return (
          <EndingSceneView
            scene={scene as EndingScene}
            onAdvance={onSceneAdvance}
            onApplyEffect={onApplyEffect}
          />
        );

      case "minigame":
        return (
          <MinigameSceneView
            scene={scene as MinigameScene}
            actConfig={actConfig}
            context={context}
            onResult={onSceneAdvance}
          />
        );

      default:
        return <div>Unknown scene type: {(scene as any).type}</div>;
    }
  }, [scene, actConfig, context, onSceneAdvance, onCharacterClick, onApplyEffect]);

  return <>{renderer}</>;
}
