import { ActManifest } from "@/lib/acts";
import { ACT_2_SCENES } from "./scenes";
import { Scene } from "@/types/game";

function extractSprites(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((s) => {
    if ("characterSprite" in s && s.characterSprite) paths.add(s.characterSprite);
  });
  return Array.from(paths);
}

export const ACT_2_ASSETS: ActManifest = {
  actNumber: 2,
  images: [
    ...extractSprites(ACT_2_SCENES),
    // "/Image/BG/school_hallway.jpg",
  ],
  audio: [
    // "/audio/bgm/act2_theme.ogg",
  ],
  minigames: [],
};
