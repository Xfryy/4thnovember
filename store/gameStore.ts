import { create } from "zustand";
import { GameUser, Character, SaveData } from "@/types/game";
import type { SaveSlot } from "@/lib/saveSlots";

export interface GameSettings {
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  brightness: number;
  language: "id" | "en";
  textSpeed: number;
}

interface GameStore {
  // Auth State
  user: GameUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // User Data
  characterName: string;
  characterNameSet: boolean;

  // ── Save state (cached globally to prevent flash) ──
  saveData: SaveData | null;
  autoSaveSlot: SaveSlot | null;
  /** true while the initial auth + save load is in-flight */
  saveLoading: boolean;

  // Settings
  settings: GameSettings;

  // Game Progress
  currentAct: number;
  currentScene: number;
  choices: Record<string, any>;

  // Character Affection
  characters: Character[];

  // Actions
  setUser: (user: GameUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setCharacterName: (name: string) => void;
  setCharacterNameSet: (value: boolean) => void;
  setSaveData: (save: SaveData | null) => void;
  setAutoSaveSlot: (slot: SaveSlot | null) => void;
  setSaveLoading: (v: boolean) => void;
  setSettings: (settings: Partial<GameSettings>) => void;
  updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  resetSettings: () => void;
  loadSettings: (settings: GameSettings) => void;
  setGameProgress: (act: number, scene: number, choices: Record<string, any>) => void;
  setCharacterAffection: (characterId: string, affection: number) => void;
  unlockCharacter: (characterId: string) => void;
  unlockCG: (cgUrl: string) => void;
  resetGameState: () => void;
}

export const useGameStore = create<GameStore>((set) => {
  // Default settings
  const defaultSettings: GameSettings = {
    masterVolume: 80,
    bgmVolume: 70,
    sfxVolume: 75,
    voiceVolume: 80,
    brightness: 100,
    language: "id",
    textSpeed: 50,
  };

  return {
    // Auth State
    user: null,
    isAuthenticated: false,
    isLoading: true,

    // User Data
    characterName: "",
    characterNameSet: false,

    // Save state
    saveData: null,
    autoSaveSlot: null,
    saveLoading: true,

    // Settings
    settings: defaultSettings,

    // Game Progress
    currentAct: 1,
    currentScene: 1,
    choices: {},

    // Character Affection
    characters: [
      {
        id: "rinn",
        name: "Rinn",
        spritesPath: "/Image/Rinn",
        affection: 0,
      },
    ],

    // Actions
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setAuthenticated: (value) => set({ isAuthenticated: value }),
    setLoading: (value) => set({ isLoading: value }),
    setCharacterName: (name) => set({ characterName: name }),
    setCharacterNameSet: (value) => set({ characterNameSet: value }),
    setSaveData: (save) => set({ saveData: save }),
    setAutoSaveSlot: (slot) => set({ autoSaveSlot: slot }),
    setSaveLoading: (v) => set({ saveLoading: v }),

    // Settings actions
    setSettings: (newSettings) =>
      set((state) => ({ settings: { ...state.settings, ...newSettings } })),

    updateSetting: (key, value) =>
      set((state) => ({ settings: { ...state.settings, [key]: value } })),

    resetSettings: () => set({ settings: defaultSettings }),

    loadSettings: (settings) => set({ settings }),

    setGameProgress: (act, scene, choices) =>
      set({ currentAct: act, currentScene: scene, choices }),

    setCharacterAffection: (characterId, affection) =>
      set((state) => ({
        characters: state.characters.map((char) =>
          char.id === characterId ? { ...char, affection } : char
        ),
      })),

    unlockCharacter: (characterId) =>
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              unlockedCharacters: Array.from(new Set([...(state.user.unlockedCharacters || []), characterId])),
            }
          : null,
      })),

    unlockCG: (cgUrl) =>
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              unlockedCGs: Array.from(new Set([...(state.user.unlockedCGs || []), cgUrl])),
            }
          : null,
      })),

    resetGameState: () =>
      set({
        user: null,
        isAuthenticated: false,
        characterName: "",
        characterNameSet: false,
        currentAct: 1,
        currentScene: 1,
        choices: {},
        saveData: null,
        autoSaveSlot: null,
        saveLoading: true,
        settings: defaultSettings,
      }),
  };
});