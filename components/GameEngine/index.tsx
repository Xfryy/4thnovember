"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SCENE_REGISTRY, getActForScene } from "@/lib/acts";
import SceneRenderer from "./SceneRenderer";
import {
  saveProgress,
  registerUnloadSave,
  loadProgress,
  AUTOSAVE_EVERY_N_SCENES,
  GameStateSnapshot,
} from "@/lib/saveSystem";

const TRANSITION_MS = 280;

interface GameEngineProps {
  actNumber?: number;
  startSceneId?: string;
  onBackToMenu?: () => void;
}

export default function GameEngine({
  actNumber = 1,
  startSceneId,
  onBackToMenu,
}: GameEngineProps) {
  const [currentId, setCurrentId]             = useState(startSceneId ?? `act${actNumber}_s1`);
  const [visible, setVisible]                 = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSaving, setIsSaving]               = useState(false);

  const saveStateRef = useRef<GameStateSnapshot>({
    actNumber,
    sceneId: startSceneId ?? `act${actNumber}_s1`,
    choices: {},
    affection: {},
    sessionStartMs: Date.now(),
    savedPlayTime: 0,
  });
  const sceneAdvanceCountRef = useRef(0);

  // Load cumulative play time on mount
  useEffect(() => {
    loadProgress().then((save) => {
      if (save) {
        saveStateRef.current.savedPlayTime = save.playTimeSeconds;
        saveStateRef.current.choices       = save.choices ?? {};
        saveStateRef.current.affection     = save.affection ?? {};
      }
    });
  }, []);

  // beforeunload — fire-and-forget save on tab close / refresh
  useEffect(() => {
    const cleanup = registerUnloadSave(() => saveStateRef.current);
    return cleanup;
  }, []);

  // Auto-advance transition scenes
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scene = SCENE_REGISTRY[currentId];

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
      handleExitToMenu();
      return;
    }

    const newAct = getActForScene(nextId);
    saveStateRef.current = { ...saveStateRef.current, actNumber: newAct, sceneId: nextId };

    sceneAdvanceCountRef.current += 1;
    if (sceneAdvanceCountRef.current % AUTOSAVE_EVERY_N_SCENES === 0) {
      saveProgress(saveStateRef.current);
    }

    setIsTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setCurrentId(nextId);
      setVisible(true);
      setIsTransitioning(false);
    }, TRANSITION_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning]);

  const recordChoice = useCallback((choiceSceneId: string, optionId: string) => {
    saveStateRef.current = {
      ...saveStateRef.current,
      choices: { ...saveStateRef.current.choices, [choiceSceneId]: optionId },
    };
  }, []);

  const handleSceneAdvance = useCallback((nextSceneId?: string) => {
    if (scene?.type === "choice" && nextSceneId) {
      // For choice scenes, record which option was selected
      const choiceIndex = (scene as any).options?.findIndex(
        (opt: any) => opt.nextScene === nextSceneId
      );
      if (choiceIndex !== -1) {
        recordChoice(scene.id, (scene as any).options[choiceIndex]?.id ?? "");
      }
    }
    goToScene(nextSceneId);
  }, [scene, recordChoice, goToScene]);

  const handleExitToMenu = useCallback(async () => {
    setIsSaving(true);
    await saveProgress(saveStateRef.current);
    onBackToMenu?.();
    setIsSaving(false);
  }, [onBackToMenu]);

  if (!scene) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh" }}>
        <p style={{ color:"#ec4899" }}>Scene "{currentId}" not found.</p>
      </div>
    );
  }

  return (
    <div style={{ width:"100%", height:"100vh", overflow:"hidden", position:"relative",
      opacity: visible ? 1 : 0, transition:`opacity ${TRANSITION_MS}ms ease` }}>

      {/* ← Menu button */}
      <button
        onClick={handleExitToMenu}
        disabled={isSaving}
        style={{
          position:"absolute", top:14, left:14, zIndex:50,
          padding:"6px 14px", borderRadius:8,
          background:"rgba(255,255,255,0.7)", border:"1px solid rgba(236,72,153,0.2)",
          color: isSaving ? "#a78bfa" : "#9d174d",
          fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em",
          cursor: isSaving ? "not-allowed" : "pointer",
          backdropFilter:"blur(8px)", transition:"all 0.2s ease",
          display:"flex", alignItems:"center", gap:6,
        }}
      >
        {isSaving
          ? <><span style={{ animation:"spin 0.7s linear infinite", display:"inline-block" }}>⟳</span> Saving...</>
          : "← Menu"
        }
      </button>

      {/* Act · Scene indicator */}
      <div style={{
        position:"absolute", top:14, right:14, zIndex:50,
        padding:"4px 12px", borderRadius:8,
        background:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)",
        border:"1px solid rgba(236,72,153,0.15)",
        fontSize:"0.65rem", color:"rgba(157,23,77,0.7)",
        fontWeight:600, letterSpacing:"0.12em",
      }}>
        Act {scene.act} · Scene {scene.sceneNumber}
      </div>

      {/* Scene renderer */}
      <SceneRenderer
        scene={scene}
        onAdvance={handleSceneAdvance}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}