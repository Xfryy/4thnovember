"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useLocaleRegistry } from "@/lib/actRegistry";
import { useSettingsStore } from "@/store/Settingsstore";
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
  // Get language for reactivity
  const language = useSettingsStore((s) => s.language);
  
  // Use locale registry instead of static SCENE_REGISTRY
  const sceneRegistry = useLocaleRegistry();
  
  const [currentId, setCurrentId] = useState(initialSceneId);
  const [visible, setVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Store the current scene from registry - updates when language changes
  const [currentScene, setCurrentScene] = useState<Scene | undefined>(() => {
    return sceneRegistry[currentId];
  });

  // Update scene when language changes OR when currentId changes
  useEffect(() => {
    const newScene = sceneRegistry[currentId];
    if (newScene) {
      setCurrentScene(newScene);
    }
  }, [language, currentId, sceneRegistry]);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cleanup timers when the whole hook unmounts
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    }
  }, []);

  // Handle transition auto-advance
  useEffect(() => {
    if (!currentScene) return;
    
    if (currentScene.type === "transition" && currentScene.duration) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => goToScene(currentScene.next), currentScene.duration);
    }
    
    return () => { 
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); 
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, language]); // Re-run when language changes too

  const goToScene = useCallback((nextId?: string) => {
    if (isTransitioning) return;
    
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
    }, TRANSITION_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, onSceneAdvance, onNoNextScene, sceneRegistry]);

  const goToSceneWithChoice = useCallback((nextId: string, choiceSceneId: string, choiceId: string) => {
    if (isTransitioning) return;
    
    if (!sceneRegistry[nextId]) return;
    
    onSceneAdvance(nextId, choiceSceneId, choiceId);
    setIsTransitioning(true);
    setVisible(false);
    
    transitionTimerRef.current = setTimeout(() => { 
      setCurrentId(nextId); 
      setVisible(true); 
      setIsTransitioning(false); 
    }, TRANSITION_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, onSceneAdvance, sceneRegistry]);

  const jumpToScene = useCallback((nextId: string) => {
    setIsTransitioning(true);
    setVisible(false);
    
    transitionTimerRef.current = setTimeout(() => { 
      setCurrentId(nextId); 
      setVisible(true); 
      setIsTransitioning(false); 
    }, TRANSITION_MS);
  }, []);

  return {
    currentId,
    scene: currentScene, // Return the reactive scene
    visible,
    isTransitioning,
    goToScene,
    goToSceneWithChoice,
    jumpToScene,
    TRANSITION_MS,
  };
}