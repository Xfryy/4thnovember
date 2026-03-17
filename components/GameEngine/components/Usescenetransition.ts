"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useLocaleRegistry } from "@/components/Acts/actRegistry";
import { useSettingsStore } from "@/store/Settingsstore";
import { Scene } from "@/types/game";

// Fade hanya untuk jumpToScene (efek khusus blink/transisi layar)
// Dialog normal tidak pakai fade sama sekali
const FADE_MS = 280;

// Lock singkat untuk mencegah double-advance tanpa bikin layar gelap
const ADVANCE_LOCK_MS = 15;

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
  const language = useSettingsStore((s) => s.language);
  const sceneRegistry = useLocaleRegistry();

  const [currentId, setCurrentId] = useState(initialSceneId);
  const [visible, setVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [currentScene, setCurrentScene] = useState<Scene | undefined>(() => {
    return sceneRegistry[currentId];
  });

  // Update scene ketika bahasa berubah atau currentId berubah
  useEffect(() => {
    const newScene = sceneRegistry[currentId];
    if (newScene) {
      setCurrentScene(newScene);
    }
  }, [language, currentId, sceneRegistry]);

  const autoAdvanceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current)    clearTimeout(autoAdvanceRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  /**
   * goToScene — pindah scene TANPA fade.
   * Dipakai untuk advance dialog/monolog normal supaya tidak ada layar gelap.
   */
  const goToScene = useCallback((nextId?: string) => {
    if (isTransitioning) return;

    if (!nextId || !sceneRegistry[nextId]) {
      onNoNextScene();
      return;
    }

    onSceneAdvance(nextId);

    // Lock singkat tanpa fade agar tidak double-advance
    setIsTransitioning(true);
    setCurrentId(nextId);

    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, ADVANCE_LOCK_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, onSceneAdvance, onNoNextScene, sceneRegistry]);

  /**
   * goToSceneWithChoice — pindah scene pilihan TANPA fade.
   */
  const goToSceneWithChoice = useCallback(
    (nextId: string, choiceSceneId: string, choiceId: string) => {
      if (isTransitioning) return;
      if (!sceneRegistry[nextId]) return;

      onSceneAdvance(nextId, choiceSceneId, choiceId);

      setIsTransitioning(true);
      setCurrentId(nextId);

      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, ADVANCE_LOCK_MS);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isTransitioning, onSceneAdvance, sceneRegistry]
  );

  /**
   * jumpToScene — DENGAN fade (layar gelap).
   * Gunakan ini hanya untuk efek khusus: blink mata, lompat chapter, load save, dll.
   */
  const jumpToScene = useCallback((nextId: string) => {
    setIsTransitioning(true);
    setVisible(false);

    transitionTimerRef.current = setTimeout(() => {
      setCurrentId(nextId);
      setVisible(true);
      setIsTransitioning(false);
    }, FADE_MS);
  }, []);

  /**
   * goToSceneWithFade — internal, untuk transition scene saja.
   */
  const goToSceneWithFade = useCallback((nextId?: string) => {
    if (!nextId || !sceneRegistry[nextId]) {
      onNoNextScene();
      return;
    }
    onSceneAdvance(nextId);
    setIsTransitioning(true);
    setVisible(false);

    transitionTimerRef.current = setTimeout(() => {
      setCurrentId(nextId);
      setVisible(true);
      setIsTransitioning(false);
    }, FADE_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSceneAdvance, onNoNextScene, sceneRegistry]);

  // Auto-advance untuk transition scene (pakai fade karena memang efek khusus)
  useEffect(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    if (!currentScene) return;

    // HANYA transition scene yang auto-advance dengan fade.
    // Ini penting supaya dialog/monolog normal tidak ikut "kedip hitam".
    if (currentScene.type === "transition" && currentScene.duration) {
      autoAdvanceRef.current = setTimeout(() => {
        goToSceneWithFade(currentScene.next);
      }, currentScene.duration);
    }

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, [currentScene, goToSceneWithFade]);

  return {
    currentId,
    scene: currentScene,
    visible,
    isTransitioning,
    goToScene,
    goToSceneWithChoice,
    jumpToScene,
    TRANSITION_MS: FADE_MS,
  };
}