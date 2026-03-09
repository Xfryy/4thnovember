import { create } from "zustand";
import { GameUser, GameProgress, Character, SaveData } from "@/types/game";
import type { SaveSlot } from "@/lib/saveSlots";

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
  setGameProgress: (act: number, scene: number, choices: Record<string, any>) => void;
  setCharacterAffection: (characterId: string, affection: number) => void;
  resetGameState: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
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

  setGameProgress: (act, scene, choices) =>
    set({ currentAct: act, currentScene: scene, choices }),

  setCharacterAffection: (characterId, affection) =>
    set((state) => ({
      characters: state.characters.map((char) =>
        char.id === characterId ? { ...char, affection } : char
      ),
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
    }),
}));