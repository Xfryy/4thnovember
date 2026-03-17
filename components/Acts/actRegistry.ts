/**
 * useLocaleRegistry
 *
 * Drop-in replacement untuk SCENE_REGISTRY yang aware terhadap bahasa.
 * Setiap kali user ganti language di Settings, registry otomatis update
 * dan GameEngine akan baca scene dalam bahasa yang benar.
 *
 * ── Cara integrasi di index.tsx ───────────────────────────────────────
 *
 * BEFORE:
 *   import { SCENE_REGISTRY } from "@/lib/acts";
 *   // ... lalu pakai SCENE_REGISTRY[sceneId] di mana-mana
 *
 * AFTER:
 *   import { useLocaleRegistry } from "@/lib/useLocaleRegistry";
 *   // di dalam component:
 *   const SCENE_REGISTRY = useLocaleRegistry(actNumber);
 *   // sisanya tidak perlu diubah sama sekali
 */

import { useMemo } from "react";
import { useSettingsStore } from "@/store/Settingsstore";
import type { Scene } from "@/types/game";

// ── Import semua scene files ───────────────────────────────────────────────────

import { ACT_1_SCENES }    from "@/lib/acts/act_1/scenes";
import { ACT_2_SCENES }    from "@/lib/acts/act_2/scenes";

import { ACT_1_SCENES_EN } from "@/lib/acts/act_1/scenes.en";
import { ACT_2_SCENES_EN } from "@/lib/acts/act_2/scenes.en";

// Tambah act baru di sini:
// import { ACT_3_SCENES }    from "@/lib/acts/act_3/scenes";
// import { ACT_3_SCENES_EN } from "@/lib/acts/act_3/scenes.en";

// ── Registry map ──────────────────────────────────────────────────────────────

type SceneRegistry = Record<string, Scene>;

function buildRegistry(scenes: Scene[]): SceneRegistry {
  return Object.fromEntries(scenes.map((s) => [s.id, s]));
}
// Pre-build registries sekali (tidak rebuild tiap render)
const REGISTRIES: Record<number, Record<string, SceneRegistry>> = {
  1: {
    id: buildRegistry(ACT_1_SCENES),
    en: buildRegistry(ACT_1_SCENES_EN),
  },
  2: {
    id: buildRegistry(ACT_2_SCENES),
    en: buildRegistry(ACT_2_SCENES_EN),
  },
};

// Gabungan semua act — untuk akses global tanpa tahu act number
export const ALL_REGISTRIES: Record<string, Record<string, Scene>> = {
  id: Object.assign({}, ...Object.values(REGISTRIES).map((r) => r.id)),
  en: Object.assign({}, ...Object.values(REGISTRIES).map((r) => r.en ?? r.id)),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Gunakan ini jika GameEngine butuh registry untuk satu act.
 * Return value stabil (tidak recreate setiap render).
 */
export function useLocaleRegistry(actNumber?: number): SceneRegistry {
  const language = useSettingsStore((s) => s.language);

  return useMemo(() => {
    if (actNumber !== undefined && REGISTRIES[actNumber]) {
      return REGISTRIES[actNumber][language] ?? REGISTRIES[actNumber]["id"];
    }
    // Fallback: return semua scenes dari semua act
    return ALL_REGISTRIES[language] ?? ALL_REGISTRIES["id"];
  }, [actNumber, language]);
}

/**
 * Gunakan ini kalau kamu butuh lookup single scene tanpa hook
 * (misal di server component atau utility function).
 */
export function getSceneLocale(sceneId: string, language: string): Scene | undefined {
  const reg = ALL_REGISTRIES[language] ?? ALL_REGISTRIES["id"];
  return reg[sceneId];
}