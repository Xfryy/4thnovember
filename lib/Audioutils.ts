/**
 * audioUtils.ts — Audio helper utilities
 *
 * getBgmForScene(sceneId):
 *   Given any scene ID, walks backwards through the act's scene list to find
 *   the most recent BGM that was set. This is used when loading a save or
 *   resuming the game so that the correct BGM is always playing — even when
 *   the starting scene doesn't have its own `audio.bgm` field.
 *
 * Usage (in GameEngine on mount):
 *   const bgm = getBgmForScene(initialSceneId);
 *   if (bgm) audioManager.playBgm(bgm);
 */

import { SCENE_REGISTRY } from "@/lib/acts";
import { Scene } from "@/types/game";

type AudioField = {
  bgm?: string;
  bgmStop?: boolean;
  bgmFade?: boolean;
};

function getAudio(scene: Scene): AudioField | undefined {
  return (scene as any).audio as AudioField | undefined;
}

/**
 * Find what BGM should be playing at `sceneId` by scanning backwards through
 * all scenes in the same act with a lower (or equal) sceneNumber.
 *
 * Returns:
 *  - A BGM URL string  → play this track
 *  - null              → BGM was explicitly stopped / no BGM in this act yet
 */
export function getBgmForScene(sceneId: string): string | null {
  const target = SCENE_REGISTRY[sceneId] as Scene | undefined;
  if (!target) return null;

  // Sort scenes in the same act from newest to oldest
  const precedingScenes = Object.values(SCENE_REGISTRY)
    .filter((s): s is Scene =>
      s.act === target.act && s.sceneNumber <= target.sceneNumber
    )
    .sort((a, b) => b.sceneNumber - a.sceneNumber); // newest first

  for (const scene of precedingScenes) {
    const audio = getAudio(scene);
    if (!audio) continue;
    if (audio.bgm) return audio.bgm;          // found a BGM — use it
    if (audio.bgmStop || audio.bgmFade) return null; // explicitly silenced
  }

  return null; // no BGM defined in this act up to this point
}