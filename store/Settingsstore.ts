import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Settings {
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  brightness: number;
  language: "id" | "en";
  textSpeed: number; // 10 (slow) → 100 (fast)
}

const DEFAULT_SETTINGS: Settings = {
  masterVolume: 80,
  bgmVolume: 70,
  sfxVolume: 75,
  voiceVolume: 80,
  brightness: 100,
  language: "id",
  textSpeed: 50,
};

interface SettingsStore extends Settings {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
  /** ms per character for typewriter effect. Speed 10→100ms, Speed 100→10ms */
  getTextSpeedMs: () => number;
  /** 0.0 – 1.0 effective gain for BGM (master × bgm) */
  getEffectiveBgmVolume: () => number;
  getEffectiveSfxVolume: () => number;
  getEffectiveVoiceVolume: () => number;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,

      updateSetting: (key, value) =>
        set({ [key]: value } as Partial<SettingsStore>),

      resetSettings: () => set(DEFAULT_SETTINGS),

      getTextSpeedMs: () => {
        const { textSpeed } = get();
        // textSpeed 10 → 100 ms/char,  textSpeed 100 → 10 ms/char
        return Math.round(110 - textSpeed);
      },

      getEffectiveBgmVolume: () => {
        const { masterVolume, bgmVolume } = get();
        return (masterVolume / 100) * (bgmVolume / 100);
      },
      getEffectiveSfxVolume: () => {
        const { masterVolume, sfxVolume } = get();
        return (masterVolume / 100) * (sfxVolume / 100);
      },
      getEffectiveVoiceVolume: () => {
        const { masterVolume, voiceVolume } = get();
        return (masterVolume / 100) * (voiceVolume / 100);
      },
    }),
    {
      name: "4th-november-settings", // localStorage key
    }
  )
);