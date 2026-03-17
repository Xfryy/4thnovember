import { ACT_1_SCENES } from "@/lib/acts/act_1/scenes";
import { ACT_2_SCENES } from "@/lib/acts/act_2/scenes";
import { Scene } from "@/types/game";

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
];

export const SCENE_REGISTRY: Record<string, Scene> = ALL_SCENES.reduce(
  (acc, scene) => {
    acc[scene.id] = scene;
    return acc;
  },
  {} as Record<string, Scene>
);

// ── Utilities ───────────────────────────────────────────────────────────────────

export function getActForScene(sceneId: string): number {
  const match = sceneId.match(/^act(\d+)_/);
  return match ? parseInt(match[1], 10) : 1;
}

export function getActFirstScene(actNumber: number): string {
  const firstScene = ALL_SCENES.find((s) => s.act === actNumber);
  if (!firstScene) {
    console.warn(`⚠️ No scenes found for act ${actNumber}, defaulting to act1_s1`);
    return "act1_s1";
  }
  return firstScene.id;
}

export function getActScenes(actNumber: number): Scene[] {
  return ALL_SCENES.filter((s) => s.act === actNumber);
}

export function getActSceneCount(actNumber: number): number {
  return getActScenes(actNumber).length;
}