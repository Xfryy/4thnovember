import { ActManifest } from "@/lib/acts";
import { ACT_2_SCENES } from "./scenes";
import { Scene } from "@/types/game";

/** Auto-extract all sprite paths from this act's scenes */
function extractSprites(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((s) => {
    if ("characterSprite" in s && s.characterSprite) paths.add(s.characterSprite);
    if ("characters" in s && s.characters) {
      s.characters.forEach((c) => {
        if (c.sprite) paths.add(c.sprite);
      });
    }
  });
  return Array.from(paths);
}

export const ACT_2_ASSETS: ActManifest = {
  actNumber: 2,
  images: [
    ...extractSprites(ACT_2_SCENES),
    "/Image/GameBG/Bg-1.jpg",
  ],
  audio: [
    // BGM and audio files
  ],
  minigames: [
    // Minigames for Act 2
  ],
};
