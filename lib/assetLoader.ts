/**
 * assetLoader.ts
 *
 * Preloads all assets for a given scene up to a certain depth in parallel.
 * Reports granular progress (0–100) via a callback.
 */
import { getReachableScenes } from "@/lib/sceneGraph";
import { extractAudioForScenes, extractImagesForScenes } from "@/lib/assetManifest";

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

// ── Audio preloader (native fetch — no AudioManager dependency) ───────────────

function preloadAudio(src: string): Promise<void> {
  return fetch(src, { method: "GET" })
    .then((res) => {
      if (!res.ok) console.warn(`[AssetLoader] Audio not found: ${src}`);
    })
    .catch(() => {
      console.warn(`[AssetLoader] Audio failed to preload: ${src}`);
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
  const audio  = extractAudioForScenes(scenesToLoad);

  // Skip mp3 streaming — preload only short sfx/voice files
  const audioToPreload = audio.filter((src) => !src.endsWith(".mp3"));

  const total = images.length + audioToPreload.length;

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

  const tasks: Promise<void>[] = [
    // Images
    ...images.map((src) =>
      preloadImage(src).then(() => report(src.split("/").pop() ?? src))
    ),

    // Audio
    ...audioToPreload.map((src) =>
      preloadAudio(src).then(() => report(src.split("/").pop() ?? src))
    ),
  ];

  await Promise.all(tasks);
}