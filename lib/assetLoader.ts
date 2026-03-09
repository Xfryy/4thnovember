/**
 * assetLoader.ts
 *
 * Preloads all assets for a given act in parallel.
 * Reports granular progress (0–100) via a callback.
 *
 * Images  → loaded into browser cache via Image()
 * Audio   → decoded into AudioManager's buffer cache
 * Minigames → dynamic-imported (webpack chunk prefetch)
 *
 * Individual failures are silently tolerated — a missing file
 * won't crash the whole load; it just logs a warning.
 */

import { ACT_MANIFESTS } from "@/lib/assetManifest";
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

export async function preloadAct(
  actNumber: number,
  onProgress?: ProgressCallback
): Promise<void> {
  const manifest = ACT_MANIFESTS[actNumber];
  if (!manifest) {
    console.warn(`[AssetLoader] No manifest for Act ${actNumber}`);
    onProgress?.({ loaded: 100, current: "Done", total: 0, done: 0 });
    return;
  }

  const { images, audio, minigames } = manifest;
  const total = images.length + audio.length + minigames.length;

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
    ...audio.map((src) =>
      audioManager.fetchBuffer(src)
        .then(() => report(src.split("/").pop() ?? src))
        .catch(() => {
          console.warn(`[AssetLoader] Audio not found: ${src}`);
          report(src.split("/").pop() ?? src);
        })
    ),

    // Minigame dynamic imports (webpack chunk prefetch)
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