import { ACT_1_SCENES } from "./acts/act_1/scenes";
import { ACT_2_SCENES } from "./acts/act_2/scenes";
import { Scene } from "@/types/game";

// Re-export ActManifest for use in act assets files
export interface ActManifest {
  actNumber: number;
  images: string[];
  audio: string[];
  minigames: Array<() => Promise<any>>;
}

// ── Registry ────────────────────────────────────────────────────────────────────

const ALL_SCENES = [
  ...ACT_1_SCENES,
  ...ACT_2_SCENES,
  // Add ACT_3_SCENES, etc. as they're created
];

/**
 * Global scene registry for O(1) lookup
 * Keyed by scene.id (e.g., "act1_scene1")
 */
export const SCENE_REGISTRY: Record<string, Scene> = ALL_SCENES.reduce(
  (acc, scene) => {
    acc[scene.id] = scene;
    return acc;
  },
  {} as Record<string, Scene>
);

// ── Utilities ───────────────────────────────────────────────────────────────────

/**
 * Extract act number from scene ID
 * Example: "act1_scene1" → 1
 */
export function getActForScene(sceneId: string): number {
  const match = sceneId.match(/^act(\d+)_/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Get first scene ID for a given act number
 * Example: getActFirstScene(1) → "act1_scene1"
 */
export function getActFirstScene(actNumber: number): string {
  const firstScene = ALL_SCENES.find((s) => s.act === actNumber);
  if (!firstScene) {
    console.warn(`⚠️ No scenes found for act ${actNumber}, defaulting to act1_scene1`);
    return "act1_scene1";
  }
  return firstScene.id;
}

/**
 * Get all scenes for a given act
 */
export function getActScenes(actNumber: number): Scene[] {
  return ALL_SCENES.filter((s) => s.act === actNumber);
}

/**
 * Get total count of scenes for an act
 */
export function getActSceneCount(actNumber: number): number {
  return getActScenes(actNumber).length;
}
