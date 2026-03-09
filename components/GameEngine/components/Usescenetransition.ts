"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SCENE_REGISTRY } from "@/lib/acts";
import { Scene } from "@/types/game";

const TRANSITION_MS = 280;

interface UseSceneTransitionOptions {
  initialSceneId: string;
  onSceneAdvance: (nextSceneId: string, choiceSceneId?: string, choiceId?: string) => void;
  onNoNextScene: () => void;
}

export function useSceneTransition({
  initialSceneId,
  onSceneAdvance,
  onNoNextScene,
}: UseSceneTransitionOptions) {
  const [currentId, setCurrentId]             = useState(initialSceneId);
  const [visible, setVisible]                 = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scene = SCENE_REGISTRY[currentId] as Scene | undefined;

  // Auto-advance transition scenes
  useEffect(() => {
    if (!scene) return;
    if (scene.type === "transition" && scene.duration) {
      autoAdvanceRef.current = setTimeout(() => goToScene(scene.nextScene), scene.duration);
    }
    return () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  const goToScene = useCallback((nextId?: string) => {
    if (isTransitioning) return;

    if (!nextId || !SCENE_REGISTRY[nextId]) {
      onNoNextScene();
      return;
    }

    onSceneAdvance(nextId);

    setIsTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setCurrentId(nextId);
      setVisible(true);
      setIsTransitioning(false);
    }, TRANSITION_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, onSceneAdvance, onNoNextScene]);

  const goToSceneWithChoice = useCallback((nextId: string, choiceSceneId: string, choiceId: string) => {
    if (isTransitioning) return;
    if (!SCENE_REGISTRY[nextId]) return;

    onSceneAdvance(nextId, choiceSceneId, choiceId);

    setIsTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setCurrentId(nextId);
      setVisible(true);
      setIsTransitioning(false);
    }, TRANSITION_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, onSceneAdvance]);

  // Jump to scene directly (e.g. when loading a save)
  const jumpToScene = useCallback((nextId: string) => {
    setIsTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setCurrentId(nextId);
      setVisible(true);
      setIsTransitioning(false);
    }, TRANSITION_MS);
  }, []);

  return {
    currentId,
    scene,
    visible,
    isTransitioning,
    goToScene,
    goToSceneWithChoice,
    jumpToScene,
    TRANSITION_MS,
  };
}