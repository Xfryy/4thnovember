"use client";

/**
 * GameEngine — Main game loop and lifecycle manager
 */

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { getActForScene, getActFirstScene } from "@/components/Acts/acts";
import { useSaveState } from "./components/Usesavestate";
import { useSceneTransition } from "./components/Usescenetransition";
import { audioManager } from "@/lib/Audiomanager";
import GameToolbar from "./components/Gametoolbar";
import SceneRenderer from "./components/SceneRenderer";
import SaveSlotsModal from "../StartMenu/components/SaveslotsModal";
import SettingsModal from "../StartMenu/components/SettingsModal";
import type { SceneAudio } from "@/types/game";
import type { SaveSlot } from "@/lib/saveSlots";
import type {
  ActConfig,
  GameEngineContext,
} from "@/components/Acts/BaseActConfig";
import HistoryLog from "./components/scenes/HistoryLog";
import { useLocaleRegistry } from "@/components/Acts/actRegistry";
import { useSettingsStore } from "@/store/Settingsstore";

// ── Player name substitution ──────────────────────────────────────────────────
function substitutePlayerName<T extends Record<string, any>>(
  scene: T,
  name: string
): T {
  if (!name) return scene;
  const replace = (v: any): any => {
    if (typeof v === "string") return v.replace(/\{playerName\}/g, name);
    if (Array.isArray(v)) return v.map(replace);
    if (v && typeof v === "object") {
      const out: Record<string, any> = {};
      for (const k of Object.keys(v)) out[k] = replace(v[k]);
      return out;
    }
    return v;
  };
  return replace(scene) as T;
}

interface GameEngineProps {
  actNumber: number;
  startSceneId?: string;
  characterName?: string;
  onBackToMenu: () => void;
  onActComplete?: (actNumber: number) => void;
}

export default function GameEngine({
  actNumber,
  startSceneId,
  characterName = "",
  onBackToMenu,
  onActComplete,
}: GameEngineProps) {
  // ── Get language for reactivity ───────────────────────────────────────────
  const language = useSettingsStore((s) => s.language);
  
  // ── Core refs ──────────────────────────────────────────────────────────────
  const actConfigRef = useRef<ActConfig | null>(null);
  const actDataRef = useRef<Record<string, any>>({});

  // ── UI state ───────────────────────────────────────────────────────────────
  const [actConfig, setActConfig] = useState<ActConfig | null>(null);
  const [isActLoading, setIsActLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ── Locale-aware scene registry ───────────────────────────────────────────
  const SCENE_REGISTRY = useLocaleRegistry(actNumber);
  const sceneRegistryRef = useRef(SCENE_REGISTRY);

  // selalu sync ref ke registry terbaru (ikut bahasa)
  useEffect(() => {
    sceneRegistryRef.current = SCENE_REGISTRY;
  }, [SCENE_REGISTRY]);

  // ── Save state ─────────────────────────────────────────────────────────────
  const initialSceneId = startSceneId || getActFirstScene(actNumber);

  const {
    saveStateRef,
    savedFlash,
    isSaving,
    handleManualSave,
    onSceneAdvance: persistSceneAdvance,
    exitSave,
    loadSlotIntoState,
  } = useSaveState({ actNumber, startSceneId: initialSceneId });

  // ── Scene transition hook ──────────────────────────────────────────────────
  const {
    currentId: currentSceneId,
    scene: currentScene,
    visible,
    isTransitioning,
    goToScene,
    goToSceneWithChoice,
    jumpToScene,
    TRANSITION_MS,
  } = useSceneTransition({
    initialSceneId,
    onSceneAdvance: (nextId, choiceSceneId, choiceId) => {
      persistSceneAdvance(nextId, choiceSceneId, choiceId);
    },
    onNoNextScene: () => {
      onActComplete?.(saveStateRef.current.actNumber);
    },
  });

  // ── Play audio when scene changes or language changes ─────────────────────
  useEffect(() => {
    if (currentScene && "audio" in currentScene && currentScene.audio) {
      playSceneAudio(currentScene.audio as SceneAudio);
    }
  }, [currentScene, language]); // Re-run when scene or language changes

  // ── Stable GameEngineContext ───────────────────────────────────────────────
  // Semua akses data via ref → tidak stale, tidak trigger rerender
  const gameContext = useMemo<GameEngineContext>(
    () => ({
      get currentScene() {
        return sceneRegistryRef.current[saveStateRef.current.sceneId];
      },
      get currentAct() {
        return saveStateRef.current.actNumber;
      },
      get currentSceneId() {
        return saveStateRef.current.sceneId;
      },

      advanceScene: async (nextSceneId, choiceData) => {
        await handleSceneAdvanceRef.current(nextSceneId, choiceData);
      },

      updateAffection: (characterId, delta) => {
        saveStateRef.current.affection = {
          ...saveStateRef.current.affection,
          [characterId]:
            (saveStateRef.current.affection[characterId] ?? 0) + delta,
        };
      },

      getAffection: (characterId) => {
        return saveStateRef.current.affection[characterId] ?? 0;
      },

      triggerEffect: async (effectName, target) => {
        await applyEffectRef.current(effectName, target);
      },

      playAudio: async (path, type) => {
        if (type === "bgm") await audioManager.playBGM(path);
        else if (type === "voice") await audioManager.playVoice(path);
        else await audioManager.playSFX(path);
      },

      stopAudio: () => audioManager.stopAll(),

      getChoices: () => ({ ...saveStateRef.current.choices }),
      getChoice: (sceneId) => saveStateRef.current.choices[sceneId],

      setActData: (key, value) => {
        actDataRef.current[key] = value;
      },
      getActData: (key) => actDataRef.current[key],

      loadAsset: async (path) => path,
      preloadAssets: async () => {},
    }),
    // sengaja kosong: semua data dibaca dari ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Forward-refs untuk circular references ─────────────────────────────────
  const handleSceneAdvanceRef = useRef<
    (nextId: string, choiceData?: { choiceSceneId: string; choiceId: string }) => Promise<void>
  >(async () => {});
  const applyEffectRef = useRef<
    (effectName: string, target?: HTMLElement) => Promise<void>
  >(async () => {});

  // ── Audio helper ───────────────────────────────────────────────────────────
  const playSceneAudio = useCallback(async (audio: SceneAudio) => {
    if (audio.bgmStop) {
      audioManager.stopAll();
      return;
    }
    if (audio.bgm)
      await audioManager.playBGM(
        audio.bgm,
        audio.bgmFade !== false ? 1000 : 0
      );
    if (audio.voice) await audioManager.playVoice(audio.voice);
    if (audio.sfx) await audioManager.playSFX(audio.sfx);
  }, []);

  // ── Effect handler ─────────────────────────────────────────────────────────
  const applyEffect = useCallback(async (effectName: string, target?: HTMLElement) => {
    const el: HTMLElement =
      target ??
      (document.querySelector(".game-scene") as HTMLElement) ??
      document.body;

    function runAnimation(
      element: HTMLElement,
      animation: string,
      durationMs: number
    ): Promise<void> {
      return new Promise((resolve) => {
        element.style.animation = "none";
        void element.offsetHeight;
        element.style.animation = animation;
        setTimeout(() => {
          element.style.animation = "";
          resolve();
        }, durationMs);
      });
    }

    switch (effectName) {
      case "screenShake":
        await runAnimation(el, "fx-screen-shake 0.5s ease-in-out", 500);
        return;
      case "fadeIn":
        el.style.opacity = "0";
        void el.offsetHeight;
        el.style.transition = "opacity 0.8s ease";
        el.style.opacity = "1";
        await new Promise((r) => setTimeout(r, 800));
        el.style.transition = "";
        return;
      case "fadeOut":
        el.style.transition = "opacity 0.6s ease";
        el.style.opacity = "0";
        await new Promise((r) => setTimeout(r, 600));
        el.style.transition = "";
        el.style.opacity = "1";
        return;
      case "flash": {
        const overlay = document.createElement("div");
        overlay.style.cssText =
          "position:fixed;inset:0;background:#fff;z-index:99999;pointer-events:none;opacity:0.85;transition:opacity 0.45s ease;";
        document.body.appendChild(overlay);
        void overlay.offsetHeight;
        overlay.style.opacity = "0";
        await new Promise((r) => setTimeout(r, 500));
        overlay.remove();
        return;
      }
      case "textEffect":
        await runAnimation(
          el,
          "fx-text-glow 1.5s ease-in-out 3",
          4500
        );
        return;
      default: {
        const cfg = actConfigRef.current;
        if (cfg?.effectHandlers?.[effectName]) {
          await cfg.effectHandlers[effectName](el);
        } else {
          console.warn(`⚠️ Effect not found: ${effectName}`);
        }
      }
    }
  }, []);

  useEffect(() => {
    applyEffectRef.current = applyEffect;
  }, [applyEffect]);

  // ── Scene hooks (lifecycle) ───────────────────────────────────────
  const runSceneHooks = useCallback(
    async (sceneId: string) => {
      const cfg = actConfigRef.current;
      if (!cfg) return;
      if (cfg.onSceneLoad) await cfg.onSceneLoad(sceneId, gameContext);
    },
    [gameContext]
  );

  useEffect(() => {
    runSceneHooks(currentSceneId);
  }, [currentSceneId, runSceneHooks]);

  // ── Scene advance handler ──────────────────────────────────────────────────
  const handleSceneAdvance = useCallback(
    async (
      nextSceneId: string,
      choiceData?: { choiceSceneId: string; choiceId: string }
    ) => {
      if (isTransitioning) return;

      // pakai registry ref (ikut bahasa terbaru)
      const nextScene = sceneRegistryRef.current[nextSceneId];
      if (!nextScene) {
        console.error(`❌ Scene not found: ${nextSceneId}`);
        return;
      }

      const nextAct = getActForScene(nextSceneId);
      if (nextAct !== saveStateRef.current.actNumber) {
        await handleActChange(nextAct, nextSceneId);
        return;
      }

      if (choiceData) {
        goToSceneWithChoice(
          nextSceneId,
          choiceData.choiceSceneId,
          choiceData.choiceId
        );
      } else {
        goToScene(nextSceneId);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTransitioning, goToScene, goToSceneWithChoice]
  );

  useEffect(() => {
    handleSceneAdvanceRef.current = handleSceneAdvance;
  }, [handleSceneAdvance]);

  // ── Act change ─────────────────────────────────────────────────────────────
  const handleActChange = useCallback(
    async (newActNumber: number, firstSceneId: string) => {
      if (actConfigRef.current?.onActEnd) {
        await actConfigRef.current.onActEnd(gameContext, "complete");
      }
      audioManager.stopAll();

      try {
        const module = await import(
          `@/components/Acts/Act${newActNumber}/config`
        );
        const newCfg = module.default as ActConfig;
        actConfigRef.current = newCfg;
        actDataRef.current = {};
        setActConfig(newCfg);

        if (newCfg.onActStart) await newCfg.onActStart(gameContext);
        onActComplete?.(newActNumber);
        jumpToScene(firstSceneId);
      } catch (err) {
        console.error("❌ Failed to load new act:", err);
        setError(String(err));
      }
    },
    [gameContext, jumpToScene, onActComplete]
  );

  // ── Initial act load ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setIsActLoading(true);
    setError(null);

    (async () => {
      try {
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;

        const module = await import(
          `@/components/Acts/Act${actNumber}/config`
        );
        const cfg = module.default as ActConfig;
        actConfigRef.current = cfg;
        actDataRef.current = {};

        if (!cancelled) {
          setActConfig(cfg);
          setIsActLoading(false);
          if (cfg.onActStart) await cfg.onActStart(gameContext);
          await runSceneHooks(initialSceneId);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("❌ Failed to load act config:", err);
          setError(String(err));
          setIsActLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      audioManager.stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actNumber]);

  // ── Back to menu ───────────────────────────────────────────────────────────
  const handleBackToMenu = useCallback(async () => {
    if (actConfigRef.current?.onActEnd) {
      await actConfigRef.current.onActEnd(gameContext, "exit");
    }
    await exitSave();
    audioManager.stopAll();
    onBackToMenu();
  }, [gameContext, exitSave, onBackToMenu]);

  // ── Character click ────────────────────────────────────────────────────────
  const handleCharacterClick = useCallback(
    async (characterId: string) => {
      const cfg = actConfigRef.current;
      if (!cfg?.characterInteractions?.[characterId]) return;
      await cfg.characterInteractions[characterId](gameContext);
    },
    [gameContext]
  );

  // ── Load slot ──────────────────────────────────────────────────────────────
  const handleLoadSlot = useCallback(
    async (slot: SaveSlot) => {
      loadSlotIntoState(slot);
      if (slot.currentAct !== saveStateRef.current.actNumber) {
        await handleActChange(slot.currentAct, slot.currentSceneId);
      } else {
        jumpToScene(slot.currentSceneId);
      }
    },
    [handleActChange, jumpToScene, loadSlotIntoState, saveStateRef]
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div style={fullScreenCenteredStyle}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          Game Engine Error
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#d4d4d8",
            marginBottom: 32,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          {error}
        </p>
        <MenuButton onClick={handleBackToMenu}>Back to Menu</MenuButton>
      </div>
    );
  }

  if (isActLoading || !actConfig) {
    return (
      <div style={fullScreenCenteredStyle}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "3px solid rgba(236,72,153,0.2)",
            borderTopColor: "#ec4899",
            animation: "spin 1s linear infinite",
            marginBottom: 24,
          }}
        />
        <h3
          style={{
            fontSize: 20,
            color: "#fff",
            fontWeight: 600,
            marginBottom: 8,
            letterSpacing: "0.1em",
          }}
        >
          Loading Game
        </h3>
        <p style={{ fontSize: 14, color: "#a1a1a1" }}>
          Initializing Act {actNumber}...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div style={fullScreenCenteredStyle}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Scene Not Found
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#d4d4d8",
            marginBottom: 32,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          Scene{" "}
          <code
            style={{
              color: "#ec4899",
              fontFamily: "monospace",
            }}
          >
            {currentSceneId}
          </code>{" "}
          could not be loaded.
        </p>
        <MenuButton onClick={handleBackToMenu}>Back to Menu</MenuButton>
      </div>
    );
  }

  return (
    <div
      className="game-engine"
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        overflow: "hidden",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        className="game-scene"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          opacity: visible ? 1 : 0,
          transition: `opacity ${TRANSITION_MS}ms ease`,
          pointerEvents: isTransitioning ? "none" : "auto",
        }}
      >
        <SceneRenderer
          scene={substitutePlayerName(currentScene, characterName)}
          actConfig={actConfig}
          context={gameContext}
          onSceneAdvance={handleSceneAdvance}
          onCharacterClick={handleCharacterClick}
          onApplyEffect={applyEffect}
        />
      </div>

      <GameToolbar
        actNumber={saveStateRef.current.actNumber}
        sceneNumber={currentScene.sceneNumber}
        isSaving={isSaving}
        isLoading={isActLoading}
        savedFlash={savedFlash}
        onMenu={handleBackToMenu}
        onQuickSave={() => handleManualSave(1)}
        onSave={() => setShowSaveModal(true)}
        onLoad={() => setShowLoadModal(true)}
        onSettings={() => setShowSettingsModal(true)}
      />

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
          onLoad={async (slot) => {
            await handleLoadSlot(slot);
            setShowLoadModal(false);
          }}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      <HistoryLog />

      <style>{`
        @keyframes fx-screen-shake {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          10%  { transform: translate(-6px,-3px) rotate(-0.8deg); }
          20%  { transform: translate(6px,3px) rotate(0.8deg); }
          30%  { transform: translate(-5px,4px) rotate(-0.5deg); }
          40%  { transform: translate(5px,-4px) rotate(0.5deg); }
          50%  { transform: translate(-4px,2px) rotate(-0.3deg); }
          60%  { transform: translate(4px,-2px) rotate(0.3deg); }
          70%  { transform: translate(-2px,-2px) rotate(-0.2deg); }
          80%  { transform: translate(2px,2px) rotate(0.2deg); }
          90%  { transform: translate(-1px,0) rotate(0deg); }
        }
        @keyframes fx-text-glow {
          0%,100% { filter: brightness(1); }
          50%     { filter: brightness(1.4) drop-shadow(0 0 8px rgba(236,72,153,0.8)); }
        }
        @keyframes fadeOut { from{opacity:1} to{opacity:0} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  );
}

// ── Shared UI helpers ──────────────────────────────────────────────────────────

const fullScreenCenteredStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background:
    "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(10,5,30,0.95))",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  color: "#fff",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

function MenuButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        marginTop: 20,
        padding: "14px 32px",
        background: "linear-gradient(135deg, #ec4899, #a855f7)",
        color: "white",
        border: "none",
        borderRadius: 12,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: "0.1em",
        boxShadow: hov
          ? "0 12px 36px rgba(236,72,153,0.5), 0 0 60px rgba(168,85,247,0.3)"
          : "0 8px 28px rgba(236,72,153,0.4), 0 0 40px rgba(168,85,247,0.2)",
        transform: hov ? "scale(1.05) translateY(-2px)" : "none",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {children}
    </button>
  );
}