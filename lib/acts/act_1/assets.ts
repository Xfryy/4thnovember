import { ActManifest } from "@/lib/acts";
import { ACT_1_SCENES } from "./scenes";
import { Scene } from "@/types/game";

/** Auto-extract all sprite paths from this act's scenes */
function extractSprites(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((s) => {
    if ("characterSprite" in s && s.characterSprite) paths.add(s.characterSprite);
  });
  return Array.from(paths);
}

export const ACT_1_ASSETS: ActManifest = {
  actNumber: 1,
  images: [
    ...extractSprites(ACT_1_SCENES),
    // Add background images here as you create them:
    // "/Image/BG/school_morning.jpg",
  ],
  audio: [
    // "/audio/bgm/act1_theme.ogg",
    // "/audio/sfx/click.ogg",
  ],
  minigames: [
    // () => import("@/minigames/Act1Puzzle"),
  ],
};
