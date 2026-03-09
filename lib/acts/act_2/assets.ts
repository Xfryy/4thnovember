import { ActManifest } from "@/lib/acts";
import { ACT_2_SCENES } from "./scenes";
import { Scene } from "@/types/game";

function extractSprites(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((s) => {
    if ("characters" in s && Array.isArray((s as any).characters)) {
      (s as any).characters.forEach((c: any) => { if (c.sprite) paths.add(c.sprite); });
    }
  });
  return Array.from(paths);
}

function extractBgs(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((s) => {
    if ("bg" in s && (s as any).bg?.image) paths.add((s as any).bg.image);
  });
  return Array.from(paths);
}

function extractAudio(scenes: Scene[]): string[] {
  const paths = new Set<string>();
  scenes.forEach((s) => {
    if ("audio" in s && (s as any).audio) {
      const a = (s as any).audio;
      if (a.bgm)   paths.add(a.bgm);
      if (a.sfx)   paths.add(a.sfx);
      if (a.voice) paths.add(a.voice);
    }
  });
  return Array.from(paths);
}

export const ACT_2_ASSETS: ActManifest = {
  actNumber: 2,
  images: [...extractSprites(ACT_2_SCENES), ...extractBgs(ACT_2_SCENES)],
  audio:  [...extractAudio(ACT_2_SCENES)],
  minigames: [],
};