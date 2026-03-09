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
  const [currentId, setCurrentId]         = useState(initialSceneId);
  const [visible, setVisible]             = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scene = SCENE_REGISTRY[currentId] as Scene | undefined;

  useEffect(() => {
    // Cleanup timers when the whole hook unmounts
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!scene) return;
    if (scene.type === "transition" && scene.duration) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); // clear previous before setting new
      autoAdvanceRef.current = setTimeout(() => goToScene(scene.next), scene.duration);
    }
    return () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  const goToScene = useCallback((nextId?: string) => {
    if (isTransitioning) return;
    if (!nextId || !SCENE_REGISTRY[nextId]) { onNoNextScene(); return; }
    onSceneAdvance(nextId);
    setIsTransitioning(true);
    setVisible(false);
    transitionTimerRef.current = setTimeout(() => { setCurrentId(nextId); setVisible(true); setIsTransitioning(false); }, TRANSITION_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, onSceneAdvance, onNoNextScene]);

  const goToSceneWithChoice = useCallback((nextId: string, choiceSceneId: string, choiceId: string) => {
    if (isTransitioning) return;
    if (!SCENE_REGISTRY[nextId]) return;
    onSceneAdvance(nextId, choiceSceneId, choiceId);
    setIsTransitioning(true);
    setVisible(false);
    transitionTimerRef.current = setTimeout(() => { setCurrentId(nextId); setVisible(true); setIsTransitioning(false); }, TRANSITION_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, onSceneAdvance]);

  const jumpToScene = useCallback((nextId: string) => {
    setIsTransitioning(true);
    setVisible(false);
    transitionTimerRef.current = setTimeout(() => { setCurrentId(nextId); setVisible(true); setIsTransitioning(false); }, TRANSITION_MS);
  }, []);

  return {
    currentId, scene, visible, isTransitioning,
    goToScene, goToSceneWithChoice, jumpToScene, TRANSITION_MS,
  };
}