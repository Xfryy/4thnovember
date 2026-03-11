/**
 * actRegistry.ts — single source of truth for all acts.
 * To add a new act: create lib/acts/act_N/, then import + register below.
 */

import { Scene, ActManifest } from "@/types/game";
import { ACT_1_SCENES, ACT_1_ASSETS, ACT_1_META } from "./acts/act_1";
import { ACT_2_SCENES, ACT_2_ASSETS, ACT_2_META } from "./acts/act_2";

// ── Register acts ──────────────────────────────────────────────────────────────

const ALL_SCENES: Scene[] = [
  ...ACT_1_SCENES,
  ...ACT_2_SCENES,
];

export const ACT_MANIFESTS: Record<number, ActManifest> = {
  1: ACT_1_ASSETS,
  2: ACT_2_ASSETS,
};

export const ACT_META: Record<number, { actNumber: number; title: string; firstSceneId: string }> = {
  1: ACT_1_META,
  2: ACT_2_META,
};

// ── Scene registry — O(1) lookup ───────────────────────────────────────────────
export const SCENE_REGISTRY: Record<string, Scene> = ALL_SCENES.reduce(
  (acc, scene) => { acc[scene.id] = scene; return acc; },
  {} as Record<string, Scene>
);

export function getActFirstScene(actNumber: number): string {
  return ACT_META[actNumber]?.firstSceneId ?? "act1_s1";
}

export function getActFromSceneId(sceneId: string): number {
  return SCENE_REGISTRY[sceneId]?.act ?? 1;
}