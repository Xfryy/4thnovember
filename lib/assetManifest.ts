/**
 * assetManifest.ts
 *
 * Declares every asset each act needs loaded before it starts.
 * Auto-sync: images are extracted directly from SCENE_REGISTRY so
 * you never have to update this manually when adding scenes.
 *
 * To add a minigame: add a `minigames` array with dynamic imports.
 * The preloader will await them all before starting.
 */

import { SCENE_REGISTRY } from "@/lib/acts";
import { Scene } from "@/types/game";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface MinigameModule {
  // whatever your minigame exports — loader just imports the chunk
  default: unknown;
}

export interface ActManifest {
  actNumber: number;
  /** Image paths to preload into browser cache */
  images: string[];
  /** Audio file paths to decode into AudioBuffer cache */
  audio: string[];
  /** Dynamic imports for minigame chunks — loaded in parallel */
  minigames: Array<() => Promise<MinigameModule>>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pull every unique sprite path from all scenes in the registry for a given act */
function spritesFromScenes(actNumber: number): string[] {
  const paths = new Set<string>();
  Object.values(SCENE_REGISTRY).forEach((scene: Scene) => {
    if (scene.act !== actNumber) return;
    if ("characterSprite" in scene && scene.characterSprite)
      paths.add(scene.characterSprite);
    if ("endingType" in scene && "characterSprite" in scene && (scene as any).characterSprite)
      paths.add((scene as any).characterSprite);
  });
  return Array.from(paths);
}

// ── Manifests ──────────────────────────────────────────────────────────────────
// Add more acts as you write them.

export const ACT_MANIFESTS: Record<number, ActManifest> = {
  1: {
    actNumber: 1,
    images: [
      // Auto-extracted from scenes — always up to date
      ...spritesFromScenes(1),

      // Extra BG images for this act (add as you create them)
      // "/Image/BG/school_morning.jpg",
    ],
    audio: [
      // BGM and SFX used in Act 1 (add when you have the files)
      // "/audio/bgm/act1_theme.ogg",
      // "/audio/sfx/click.ogg",
      // "/audio/sfx/page_turn.ogg",
    ],
    minigames: [
      // Example — when Act 1 gets a minigame:
      // () => import("@/minigames/Act1Puzzle"),
    ],
  },

  // 2: {
  //   actNumber: 2,
  //   images: [...spritesFromScenes(2), "/Image/BG/..."],
  //   audio: ["/audio/bgm/act2_theme.ogg"],
  //   minigames: [],
  // },
};