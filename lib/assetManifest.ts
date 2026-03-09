/**
 * assetManifest.ts — auto-sync version
 * Extracts ALL assets (sprites, backgrounds, audio) directly from scene data.
 * This version supports granular extraction for streaming preloading.
 */

import { Scene } from "@/types/game";

/**
 * Extracts all unique image paths from an array of scenes.
 * @param scenes The scenes to extract assets from.
 * @returns An array of unique image asset paths.
 */
export function extractImagesForScenes(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((scene: Scene) => {
    // New engine: characters array
    if ("characters" in scene && Array.isArray((scene as any).characters)) {
      for (const c of (scene as any).characters) {
        if (c?.sprite) paths.add(c.sprite);
      }
    }

    // New engine: bg.image
    if ("bg" in scene && (scene as any).bg?.image) {
      paths.add((scene as any).bg.image);
    }

    // Legacy: characterSprite
    if ("characterSprite" in scene && (scene as any).characterSprite) {
      paths.add((scene as any).characterSprite);
    }

    // CG scene image
    if (scene.type === "cg" && (scene as any).image) {
      paths.add((scene as any).image);
    }

    // Ending sprite
    if (scene.type === "ending" && (scene as any).characterSprite) {
      paths.add((scene as any).characterSprite);
    }
  });
  return Array.from(paths);
}

/**
 * Extracts all unique audio paths from an array of scenes.
 * @param scenes The scenes to extract assets from.
 * @returns An array of unique audio asset paths.
 */
export function extractAudioForScenes(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((scene: Scene) => {
    const audio = (scene as any).audio;
    if (!audio) return;
    if (audio.bgm)   paths.add(audio.bgm);
    if (audio.sfx)   paths.add(audio.sfx);
    if (audio.voice) paths.add(audio.voice);
  });
  return Array.from(paths);
}