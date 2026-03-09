"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useEffect } from "react";
import { SCENE_REGISTRY } from "@/lib/acts";
import { audioManager } from "@/lib/Audiomanager";
import { getBgmForScene } from "@/lib/Audioutils";
import SceneRenderer from "./components/SceneRenderer";
import GameToolbar from "./components/Gametoolbar";
import { useSaveState } from "./components/Usesavestate";
import { useSceneTransition } from "./components/Usescenetransition";

const SaveSlotsModal = dynamic(
  () => import("@/components/StartMenu/components/SaveslotsModal"),
  { ssr: false }
);
const SettingsModal = dynamic(
  () => import("@/components/StartMenu/components/SettingsModal"),
  { ssr: false }
);

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

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSettings,  setShowSettings]  = useState(false);

  // ── Audio init on mount ────────────────────────────────────────────────────
  //
  // This is the KEY FIX for "BGM silent after returning from menu":
  // Every time GameEngine mounts (new game OR load), we scan backwards
  // through the act's scenes to find the correct BGM for this position
  // and start playing it.  SceneRenderer's useSceneAudio will then skip
  // re-playing if the same URL is already active.
  //
  useEffect(() => {
    audioManager.resume();

    const bgm = getBgmForScene(initialSceneId);
    if (bgm) {
      audioManager.playBgm(bgm);
    }

    return () => {
      audioManager.stopBgm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs only on mount

  // Belt-and-suspenders: also resume on any click inside the game viewport
  const handleUserInteraction = useCallback(() => {
    audioManager.resume();
  }, []);

  // ── Save state ─────────────────────────────────────────────────────────────
  const {
    savedFlash,
    isSaving,
    handleManualSave,
    onSceneAdvance,
    exitSave,
    loadSlotIntoState,
  } = useSaveState({ actNumber, startSceneId: initialSceneId });

  // ── Exit ───────────────────────────────────────────────────────────────────
  const handleExitToMenu = useCallback(async () => {
    await exitSave();
    onBackToMenu?.();
  }, [exitSave, onBackToMenu]);

  // ── Scene transitions ──────────────────────────────────────────────────────
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

  const handleSceneAdvance = useCallback(
    (nextSceneId?: string) => {
      audioManager.resume();

      if (!nextSceneId) { goToScene(undefined); return; }

      if (scene?.type === "choice") {
        const opt = scene.options?.find((o) => o.next === nextSceneId);
        if (opt) {
          goToSceneWithChoice(nextSceneId, scene.id, opt.id ?? "");
          return;
        }
      }

      goToScene(nextSceneId);
    },
    [scene, goToScene, goToSceneWithChoice]
  );

  // ── Load slot ──────────────────────────────────────────────────────────────
  const handleLoadSlot = useCallback(
    (slot: any) => {
      setShowLoadModal(false);
      const nextId = slot.currentSceneId;
      if (!SCENE_REGISTRY[nextId]) return;

      loadSlotIntoState(slot);

      // Restore BGM for the loaded scene before jumping to it
      const bgm = getBgmForScene(nextId);
      if (bgm) audioManager.playBgm(bgm);
      else      audioManager.stopBgm();

      jumpToScene(nextId);
    },
    [loadSlotIntoState, jumpToScene]
  );

  if (!scene) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#06020f",
        }}
      >
        <p style={{ color: "#ec4899", letterSpacing: "0.1em" }}>
          Scene not found.
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={handleUserInteraction}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        opacity: visible ? 1 : 0,
        transition: `opacity ${TRANSITION_MS}ms ease`,
        background: "#06020f",
      }}
    >
      <SceneRenderer scene={scene} onAdvance={handleSceneAdvance} />

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