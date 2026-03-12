/**
 * actRegistry.ts — single source of truth for all acts.
 *
 * ✅ Cara tambah act baru:
 *   1. Buat folder: lib/acts/act_2/
 *   2. Buat: scenes.ts, index.ts (export ACT_2_SCENES, ACT_2_META)
 *   3. Import di sini dan tambah ke ALL_SCENES + ACT_META
 */

import { Scene } from "@/types/game";
import { ACT_1_SCENES, ACT_1_META } from "./acts/act_1";

// ── Register scenes dari semua act ─────────────────────────────────────────────

const ALL_SCENES: Scene[] = [
  ...ACT_1_SCENES,
  // ...ACT_2_SCENES,  ← tambah act baru di sini
];

// ── Act metadata registry ──────────────────────────────────────────────────────

export const ACT_META: Record<number, { actNumber: number; title: string; firstSceneId: string }> = {
  1: ACT_1_META,
  // 2: ACT_2_META,   ← tambah act baru di sini
};

// ── Scene registry — O(1) lookup by scene ID ──────────────────────────────────

export const SCENE_REGISTRY: Record<string, Scene> = ALL_SCENES.reduce(
  (acc, scene) => {
    acc[scene.id] = scene;
    return acc;
  },
  {} as Record<string, Scene>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getActFirstScene(actNumber: number): string {
  return ACT_META[actNumber]?.firstSceneId ?? "act1_s1";
}

export function getActForScene(sceneId: string): number {
  return SCENE_REGISTRY[sceneId]?.act ?? 1;
}