/**
 * BaseActConfig - Interface definitions for Act customization
 * Every Act must implement this interface to integrate with the game engine
 */

import type { Scene } from "@/types/game";

/**
 * Context passed to Act handlers - provides access to engine methods
 */
export interface GameEngineContext {
  // Current state
  readonly currentScene: Scene;
  readonly currentAct: number;
  readonly currentSceneId: string;

  // Scene navigation
  advanceScene: (
    nextSceneId: string,
    choiceData?: { choiceSceneId: string; choiceId: string }
  ) => Promise<void>;

  // Character interaction
  updateAffection: (characterId: string, delta: number) => void;
  getAffection: (characterId: string) => number;

  // Effects
  triggerEffect: (effectName: string, target?: HTMLElement) => Promise<void>;

  // Audio
  playAudio: (path: string, type: "bgm" | "voice" | "sfx") => Promise<void>;
  stopAudio: () => void;

  // State access
  getChoices: () => Record<string, string>;
  getChoice: (sceneId: string) => string | undefined;
  setActData: (key: string, value: any) => void;
  getActData: (key: string) => any;

  // Utilities
  loadAsset: (path: string) => Promise<string>;
  preloadAssets: (paths: string[]) => Promise<void>;
}

/**
 * Props passed to minigame components
 */
export interface MinigameProps {
  title?: string;
  description?: string;
  background?: string;
  audio?: { bgm?: string; sfx?: string };
  onResult: (result: "win" | "lose" | "quit", data?: Record<string, any>) => void;
  playerData?: Record<string, any>; // Access game state
}

/**
 * Main Act configuration
 * Implement this in each Act's config.ts file
 */
export interface ActConfig {
  // Metadata
  actNumber: number;
  title: string;

  // Lifecycle hooks
  onActStart?: (context: GameEngineContext) => Promise<void> | void;
  onActEnd?: (context: GameEngineContext, result: string) => Promise<void> | void;
  onSceneLoad?: (sceneId: string, context: GameEngineContext) => Promise<void> | void;

  // Character interactions (when player clicks character)
  characterInteractions?: {
    [characterId: string]: (context: GameEngineContext) => Promise<void> | void;
  };

  // Registered minigames
  minigames?: {
    [gameId: string]: React.ComponentType<MinigameProps>;
  };

  // Custom effect handlers
  effectHandlers?: {
    [effectName: string]: (target: HTMLElement, context?: GameEngineContext) => Promise<void> | void;
  };

  // Assets to preload for this act
  preloadAssets?: {
    images?: string[];
    audio?: string[];
  };
}

/**
 * Result from a minigame
 */
export interface MinigameResult {
  gameId: string;
  result: "win" | "lose" | "quit";
  data?: Record<string, any>;
}

/**
 * Game engine options
 */
export interface GameEngineOptions {
  acts: {
    [actNumber: number]: () => Promise<{ default: ActConfig }>;
  };
  onExitGame?: () => void;
  onActChange?: (oldAct: number, newAct: number) => void;
}
