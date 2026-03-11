"use client";

/**
 * GameEngine - Main game loop and lifecycle manager
 * Handles: scene progression, save/load, audio lifecycle, effect triggers, act transitions
 */

import React, { useEffect, useRef, useCallback, useState } from "react";
import { SCENE_REGISTRY, getActForScene, getActFirstScene } from "@/lib/acts";
import { useSaveState } from "./components/Usesavestate";
import { audioManager } from "@/lib/Audiomanager";
import GameToolbar from "./components/Gametoolbar";
import SceneRenderer from "./components/SceneRenderer";
import SaveSlotsModal from "../StartMenu/components/SaveslotsModal";
import SettingsModal from "../StartMenu/components/SettingsModal";
import type { SceneAudio } from "@/types/game";
import { ActConfig, GameEngineContext, MinigameResult } from "@/components/Acts/BaseActConfig";


interface GameEngineProps {
  actNumber: number;
  startSceneId?: string;
  onBackToMenu: () => void;
  onActComplete?: (actNumber: number) => void;
}

interface GameEngineState {
  currentSceneId: string;
  currentActNumber: number;
  actConfig: ActConfig | null;
  isLoading: boolean;
  error: string | null;
  lastMinigameResult: MinigameResult | null;
}

export default function GameEngine({
  actNumber,
  startSceneId,
  onBackToMenu,
  onActComplete,
}: GameEngineProps) {
  const engineStateRef = useRef<GameEngineState>({
    currentSceneId: startSceneId || getActFirstScene(actNumber),
    currentActNumber: actNumber,
    actConfig: null,
    isLoading: true,
    error: null,
    lastMinigameResult: null,
  });

  const [state, setState] = useState<GameEngineState>(engineStateRef.current);
  const actDataRef = useRef<Record<string, any>>({});
  const { savedFlash, isSaving, onSceneAdvance, handleManualSave } = useSaveState({
    actNumber,
    startSceneId: engineStateRef.current.currentSceneId,
  });

  // Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ────────────────────────────────────────────────────────────────────
  // 1. LOAD ACT CONFIG ON MOUNT
  // ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const loadActConfig = async () => {
      try {
        // Add slight delay for loading feel (800ms)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Dynamically import act config
        const module = await import(`@/components/Acts/Act${actNumber}/config`);
        const actConfig = module.default as ActConfig;

        // Update state
        engineStateRef.current.actConfig = actConfig;
        engineStateRef.current.isLoading = false;
        actDataRef.current = {};

        setState({ ...engineStateRef.current });

        // Call onActStart hook
        if (actConfig.onActStart) {
          await actConfig.onActStart(createGameEngineContext());
        }

        // Load first scene
        await loadScene(engineStateRef.current.currentSceneId, actConfig);
      } catch (err) {
        console.error("❌ Failed to load act config:", err);
        engineStateRef.current.error = String(err);
        engineStateRef.current.isLoading = false;
        setState({ ...engineStateRef.current });
      }
    };

    loadActConfig();

    // Cleanup on unmount
    return () => {
      // Stop all audio
      audioManager.stopAll();
      // Could add more cleanup here
    };
  }, [actNumber]);

  // ────────────────────────────────────────────────────────────────────
  // 2. CREATE GAME ENGINE CONTEXT (available to act handlers)
  // ────────────────────────────────────────────────────────────────────

  const createGameEngineContext = useCallback((): GameEngineContext => {
    const currentScene = SCENE_REGISTRY[engineStateRef.current.currentSceneId];

    return {
      currentScene,
      currentAct: engineStateRef.current.currentActNumber,
      currentSceneId: engineStateRef.current.currentSceneId,

      advanceScene: async (nextSceneId, choiceData) => {
        await handleSceneAdvance(nextSceneId, choiceData);
      },

      updateAffection: (characterId: string, delta: number) => {
        // Implement if using affection system
        console.log(`💕 ${characterId} affection +${delta}`);
      },

      getAffection: () => {
        // Return stored affection
        return 0; // Placeholder
      },

      triggerEffect: async (effectName: string, target?: HTMLElement) => {
        await applyEffect(effectName, target);
      },

      playAudio: async (path: string, type: "bgm" | "voice" | "sfx") => {
        if (type === "bgm") {
          await audioManager.playBGM(path);
        } else if (type === "voice") {
          await audioManager.playVoice(path);
        } else {
          await audioManager.playSFX(path);
        }
      },

      stopAudio: () => {
        audioManager.stopAll();
      },

      getChoices: () => {
        // Return from useSaveState
        return {};
      },

      getChoice: () => {
        return undefined;
      },

      setActData: (key: string, value: any) => {
        actDataRef.current[key] = value;
      },

      getActData: (key: string) => {
        return actDataRef.current[key];
      },

      loadAsset: async (path: string) => {
        return path; // Could implement actual asset loading
      },

      preloadAssets: async () => {
        // Could implement asset preloading
      },
    };
  }, []);

  // ────────────────────────────────────────────────────────────────────
  // 3. LOAD SCENE AND TRIGGER HOOKS
  // ────────────────────────────────────────────────────────────────────

  const loadScene = useCallback(
    async (sceneId: string, actConfig: ActConfig) => {
      const scene = SCENE_REGISTRY[sceneId];
      if (!scene) {
        console.error(`❌ Scene not found: ${sceneId}`);
        return;
      }

      // Call onSceneLoad hook
      if (actConfig.onSceneLoad) {
        const context = createGameEngineContext();
        await actConfig.onSceneLoad(sceneId, context);
      }

      // Play scene audio (only if scene has audio property)
      if ("audio" in scene && (scene as any).audio) {
        await playSceneAudio((scene as any).audio);
      }

      // Update state
      engineStateRef.current.currentSceneId = sceneId;
      setState({ ...engineStateRef.current });
    },
    [createGameEngineContext]
  );

  // ────────────────────────────────────────────────────────────────────
  // 4. HANDLE SCENE ADVANCEMENT
  // ────────────────────────────────────────────────────────────────────

  const handleSceneAdvance = useCallback(
    async (nextSceneId: string, choiceData?: { choiceSceneId: string; choiceId: string }) => {
      // Update save state through useSaveState
      onSceneAdvance(nextSceneId, choiceData?.choiceSceneId, choiceData?.choiceId);

      // Load next scene
      if (engineStateRef.current.actConfig) {
        await loadScene(nextSceneId, engineStateRef.current.actConfig);
      }

      // Check if act is complete
      const newAct = getActForScene(nextSceneId);
      if (newAct !== engineStateRef.current.currentActNumber) {
        // Act change detected
        await handleActChange(newAct, nextSceneId);
      }
    },
    [onSceneAdvance, loadScene]
  );

  // ────────────────────────────────────────────────────────────────────
  // 5. HANDLE ACT CHANGE
  // ────────────────────────────────────────────────────────────────────

  const handleActChange = useCallback(async (newActNumber: number, firstSceneId: string) => {
    console.log(`🎬 Changing act: ${engineStateRef.current.currentActNumber} → ${newActNumber}`);

    // Call onActEnd for current act
    if (engineStateRef.current.actConfig?.onActEnd) {
      const context = createGameEngineContext();
      await engineStateRef.current.actConfig.onActEnd(context, "complete");
    }

    // Stop all audio from previous act
    audioManager.stopAll();

    // Load new act
    try {
      const module = await import(`@/components/Acts/Act${newActNumber}/config`);
      const newActConfig = module.default as ActConfig;

      // Update state
      engineStateRef.current.currentActNumber = newActNumber;
      engineStateRef.current.currentSceneId = firstSceneId;
      engineStateRef.current.actConfig = newActConfig;
      actDataRef.current = {};

      setState({ ...engineStateRef.current });

      // Call onActStart
      if (newActConfig.onActStart) {
        const context = createGameEngineContext();
        await newActConfig.onActStart(context);
      }

      onActComplete?.(engineStateRef.current.currentActNumber);
    } catch (err) {
      console.error("❌ Failed to load new act:", err);
    }
  }, [createGameEngineContext, onActComplete]);

  // ────────────────────────────────────────────────────────────────────
  // 6. HANDLE AUDIO PLAYBACK FOR SCENE
  // ────────────────────────────────────────────────────────────────────

  const playSceneAudio = useCallback(async (audio: SceneAudio) => {
    if (audio.bgmStop) {
      audioManager.stopAll();
      return;
    }

    if (audio.bgm) {
      const fade = audio.bgmFade !== false; // Default to fade
      const duration = fade ? 1000 : 0;
      await audioManager.playBGM(audio.bgm, duration);
    }

    if (audio.voice) {
      await audioManager.playVoice(audio.voice);
    }

    if (audio.sfx) {
      await audioManager.playSFX(audio.sfx);
    }
  }, []);

  // ────────────────────────────────────────────────────────────────────
  // 7. APPLY EFFECTS
  // ────────────────────────────────────────────────────────────────────

  const applyEffect = useCallback(
    async (effectName: string, target?: HTMLElement) => {
      const { actConfig } = engineStateRef.current;
      if (!actConfig?.effectHandlers?.[effectName]) {
        console.warn(`⚠️ Effect not found: ${effectName}`);
        return;
      }

      let element = target;
      if (!element) {
        const el = document.querySelector(".game-scene");
        element = el instanceof HTMLElement ? el : undefined;
      }

      if (!element) {
        console.warn("⚠️ No target element for effect");
        return;
      }

      await actConfig.effectHandlers[effectName](element);
    },
    []
  );

  // ────────────────────────────────────────────────────────────────────
  // 8. HANDLE CHARACTER INTERACTIONS
  // ────────────────────────────────────────────────────────────────────

  const handleCharacterClick = useCallback(
    async (characterId: string) => {
      const { actConfig } = engineStateRef.current;
      if (!actConfig?.characterInteractions?.[characterId]) {
        return;
      }

      const context = createGameEngineContext();
      await actConfig.characterInteractions[characterId](context);
    },
    [createGameEngineContext]
  );

  // ────────────────────────────────────────────────────────────────────
  // 9. HANDLE EXIT/BACK TO MENU
  // ────────────────────────────────────────────────────────────────────

  const handleBackToMenu = useCallback(async () => {
    // Call onActEnd
    if (engineStateRef.current.actConfig?.onActEnd) {
      const context = createGameEngineContext();
      await engineStateRef.current.actConfig.onActEnd(context, "exit");
    }

    // Stop all audio
    audioManager.stopAll();

    // Go back
    onBackToMenu();
  }, [createGameEngineContext, onBackToMenu]);

  // ────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────

  if (state.error) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(10,5,30,0.95))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", textAlign: "center", maxWidth: "600px" }}>Game Engine Error</h2>
        <p style={{ fontSize: "16px", color: "#d4d4d8", marginBottom: "32px", textAlign: "center", maxWidth: "600px", lineHeight: "1.6" }}>{state.error}</p>
        <button
          onClick={handleBackToMenu}
          style={{
            marginTop: "20px",
            padding: "14px 32px",
            background: "linear-gradient(135deg, #ec4899, #a855f7)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "16px",
            letterSpacing: "0.1em",
            boxShadow: "0 8px 28px rgba(236, 72, 153, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(236, 72, 153, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(236, 72, 153, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)";
          }}
        >
          Back to Menu
        </button>
      </div>
    );
  }

  if (state.isLoading || !state.actConfig) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(10,5,30,0.95))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "3px solid rgba(236, 72, 153, 0.2)",
            borderTopColor: "#ec4899",
            animation: "spin 1s linear infinite",
            marginBottom: "24px",
          }}
        />
        <h3 style={{ fontSize: "20px", color: "#fff", fontWeight: "600", marginBottom: "8px", letterSpacing: "0.1em" }}>Loading Game</h3>
        <p style={{ fontSize: "14px", color: "#a1a1a1", textAlign: "center" }}>Initializing Act {state.currentActNumber}...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const currentScene = SCENE_REGISTRY[state.currentSceneId];
  if (!currentScene) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(10,5,30,0.95))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", textAlign: "center" }}>Scene Not Found</h2>
        <p style={{ fontSize: "16px", color: "#d4d4d8", marginBottom: "32px", textAlign: "center", maxWidth: "600px", lineHeight: "1.6" }}>The scene "<code style={{ color: "#ec4899", fontFamily: "monospace" }}>{state.currentSceneId}</code>" could not be loaded. Please check the scene configuration.</p>
        <button
          onClick={handleBackToMenu}
          style={{
            marginTop: "20px",
            padding: "14px 32px",
            background: "linear-gradient(135deg, #ec4899, #a855f7)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "16px",
            letterSpacing: "0.1em",
            boxShadow: "0 8px 28px rgba(236, 72, 153, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(236, 72, 153, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(236, 72, 153, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)";
          }}
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div
      className="game-engine"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#000",
        overflow: "hidden",
        fontFamily: "monospace",
      }}
    >
      {/* Game scene renderer */}
      <div className="game-scene" style={{ width: "100%", height: "100%" }}>
        <SceneRenderer
          scene={currentScene}
          actConfig={state.actConfig}
          context={createGameEngineContext()}
          onSceneAdvance={handleSceneAdvance}
          onCharacterClick={handleCharacterClick}
          onApplyEffect={applyEffect}
        />
      </div>

      {/* Game toolbar (HUD) */}
      <GameToolbar
        actNumber={state.currentActNumber}
        sceneNumber={currentScene.sceneNumber}
        isSaving={isSaving}
        savedFlash={savedFlash}
        onMenu={handleBackToMenu}
        onQuickSave={() => handleManualSave(1)}
        onSave={() => setShowSaveModal(true)}
        onLoad={() => setShowLoadModal(true)}
        onSettings={() => setShowSettingsModal(true)}
      />

      {/* Save/Load Modals */}
      {showSaveModal && (
        <SaveSlotsModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={async (slotId) => {
            await handleManualSave(slotId);
            setShowSaveModal(false);
          }}
        />
      )}

      {showLoadModal && (
        <SaveSlotsModal
          isOpen={showLoadModal}
          onClose={() => setShowLoadModal(false)}
          onLoad={() => {
            // Load from slot (handled by SaveSlotsModal)
            setShowLoadModal(false);
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* CSS for animations */}
      <style>{`
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, -2px) rotate(0.5deg); }
          20% { transform: translate(2px, 2px) rotate(-0.5deg); }
          30% { transform: translate(-2px, 2px) rotate(0.5deg); }
          40% { transform: translate(2px, -2px) rotate(-0.5deg); }
          50% { transform: translate(-1px, 1px) rotate(0.5deg); }
          60% { transform: translate(1px, -1px) rotate(-0.5deg); }
          70% { transform: translate(-1px, -1px) rotate(0.5deg); }
          80% { transform: translate(1px, 1px) rotate(-0.5deg); }
          90% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .game-engine {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      `}</style>
    </div>
  );
}
