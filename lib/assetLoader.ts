/**
 * assetLoader.ts
 *
 * Preloads all assets for a given scene up to a certain depth in parallel.
 * Reports granular progress (0–100) via a callback.
 */
import { getReachableScenes } from "@/lib/sceneGraph";
import { extractAudioForScenes, extractImagesForScenes } from "@/lib/assetManifest";
import { audioManager } from "@/lib/Audiomanager";

export interface LoadProgress {
  loaded: number;   // 0–100
  current: string;  // label of whatever is loading right now
  total: number;    // total asset count
  done: number;     // assets completed so far
}

type ProgressCallback = (p: LoadProgress) => void;

// ── Image preloader ────────────────────────────────────────────────────────────

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload  = () => resolve();
    img.onerror = () => {
      console.warn(`[AssetLoader] Image not found: ${src}`);
      resolve(); // non-fatal
    };
    img.src = src;
  });
}

// ── Main loader ────────────────────────────────────────────────────────────────

export async function preloadAssetsForScene(
  startSceneId: string,
  preloadDepth: number,
  onProgress?: ProgressCallback
): Promise<void> {
  if (!startSceneId) {
    console.warn("[AssetLoader] No startSceneId provided.");
    onProgress?.({ loaded: 100, current: "Done", total: 0, done: 0 });
    return;
  }

  const scenesToLoad = getReachableScenes(startSceneId, preloadDepth);
  const images = extractImagesForScenes(scenesToLoad);
  const audio = extractAudioForScenes(scenesToLoad);
  // TODO: Add minigame extraction if needed in the future
  const minigames: any[] = [];

  const audioToPreload = audio.filter(src => !src.endsWith('.mp3'));
  const total = images.length + audioToPreload.length + minigames.length;

  if (total === 0) {
    onProgress?.({ loaded: 100, current: "Ready", total: 0, done: 0 });
    return;
  }

  let done = 0;

  const report = (label: string) => {
    done++;
    onProgress?.({
      loaded: Math.round((done / total) * 100),
      current: label,
      total,
      done,
    });
  };

  // Build task list — each returns a promise
  const tasks: Promise<void>[] = [
    // Images
    ...images.map((src) =>
      preloadImage(src).then(() =>
        report(src.split("/").pop() ?? src)
      )
    ),

    // Audio (decoded into AudioManager buffer cache)
    ...audioToPreload.map((src) =>
      audioManager.fetchBuffer(src)
        .then(() => report(src.split("/").pop() ?? src))
        .catch(() => {
          // This is non-fatal, just report it
          report(src.split("/").pop() ?? src);
        })
    ),

    // Minigame dynamic imports
    ...minigames.map((loader, i) =>
      loader()
        .then(() => report(`Minigame ${i + 1}`))
        .catch(() => {
          console.warn(`[AssetLoader] Minigame ${i + 1} failed to load`);
          report(`Minigame ${i + 1}`);
        })
    ),
  ];

  // Run everything in parallel
  await Promise.all(tasks);
}