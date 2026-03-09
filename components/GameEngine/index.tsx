"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { SCENE_REGISTRY } from "@/lib/acts";
import SceneRenderer from "./components/SceneRenderer";
import GameToolbar from "./components/Gametoolbar";
import { useSaveState } from "./components/Usesavestate";
import { useSceneTransition } from "./components/Usescenetransition";

// Lazy-load modals — zero cost until opened
const SaveSlotsModal = dynamic(() => import("@/components/StartMenu/components/SaveslotsModal"), { ssr: false });
const SettingsModal  = dynamic(() => import("@/components/StartMenu/components/SettingsModal"),  { ssr: false });

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
  const initialSceneId = startSceneId ?? `act${actNumber}_s1`;

  // ── Modal state ────────────────────────────────────────────────────────────
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSettings,  setShowSettings]  = useState(false);

  // ── Save / load logic ──────────────────────────────────────────────────────
  const {
    savedFlash,
    isSaving,
    handleManualSave,
    onSceneAdvance,
    exitSave,
    loadSlotIntoState,
  } = useSaveState({ actNumber, startSceneId: initialSceneId });

  // ── Exit to menu ───────────────────────────────────────────────────────────
  const handleExitToMenu = useCallback(async () => {
    await exitSave();
    onBackToMenu?.();
  }, [exitSave, onBackToMenu]);

  // ── Scene transition logic ─────────────────────────────────────────────────
  const {
    scene,
    visible,
    TRANSITION_MS,
    goToScene,
    goToSceneWithChoice,
    jumpToScene,
  } = useSceneTransition({
    initialSceneId,
    onSceneAdvance,
    onNoNextScene: handleExitToMenu,
  });

  // ── SceneRenderer advance handler ──────────────────────────────────────────
  const handleSceneAdvance = useCallback((nextSceneId?: string) => {
    if (!nextSceneId) { goToScene(undefined); return; }

    // If current scene is a choice, record which option was picked
    if (scene?.type === "choice") {
      const opt = (scene as any).options?.find((o: any) => o.nextScene === nextSceneId);
      if (opt) {
        goToSceneWithChoice(nextSceneId, scene.id, opt.id ?? "");
        return;
      }
    }

    goToScene(nextSceneId);
  }, [scene, goToScene, goToSceneWithChoice]);

  // ── Load a save slot ───────────────────────────────────────────────────────
  const handleLoadSlot = useCallback((slot: any) => {
    setShowLoadModal(false);
    const nextId = slot.currentSceneId;
    if (SCENE_REGISTRY[nextId]) {
      loadSlotIntoState(slot);
      jumpToScene(nextId);
    }
  }, [loadSlotIntoState, jumpToScene]);

  if (!scene) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ color: "#ec4899" }}>Scene not found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%", height: "100vh",
        overflow: "hidden",
        position: "relative",
        opacity: visible ? 1 : 0,
        transition: `opacity ${TRANSITION_MS}ms ease`,
      }}
    >
      <SceneRenderer scene={scene} onAdvance={handleSceneAdvance} />

      {/* ── Toolbar — always visible ── */}
      <GameToolbar
        actNumber={scene.act}
        sceneNumber={scene.sceneNumber}
        isSaving={isSaving}
        savedFlash={savedFlash}
        onMenu={handleExitToMenu}
        onQuickSave={() => handleManualSave(1)}
        onSave={() => setShowSaveModal(true)}
        onLoad={() => setShowLoadModal(true)}
        onSettings={() => setShowSettings(true)}
      />

      {/* ── Modals ── */}
      {showSaveModal && (
        <SaveSlotsModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleManualSave}
        />
      )}

      {showLoadModal && (
        <SaveSlotsModal
          isOpen={showLoadModal}
          onClose={() => setShowLoadModal(false)}
          onLoad={handleLoadSlot}
        />
      )}

      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}