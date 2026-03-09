// ── User ───────────────────────────────────────────────────────────────────────

export interface GameUser {
  uid: string;
  email: string;
  characterName: string;
  createdAt: number;
  lastPlayed: number;
}

// ── Save system ────────────────────────────────────────────────────────────────

export interface SaveData {
  uid: string;
  currentAct: number;
  currentSceneId: string;
  /** Choices made: { [choiceSceneId]: selectedOptionId } */
  choices: Record<string, string>;
  /** Affection per character: { rinn: 10 } */
  affection: Record<string, number>;
  playTimeSeconds: number;
  lastSaved: number; // timestamp
}

export interface GameProgress {
  uid: string;
  currentAct: number;
  currentScene: number;
  choices: Record<string, any>;
  playTime: number;
  lastUpdated: number;
}

// ── Asset manifest ─────────────────────────────────────────────────────────────

export interface MinigameModule { default: unknown }

export interface ActManifest {
  actNumber: number;
  images: string[];
  audio: string[];
  minigames: Array<() => Promise<MinigameModule>>;
}

// ── Scene types ────────────────────────────────────────────────────────────────

export type SceneType = "dialogue" | "monologue" | "choice" | "minigame" | "transition" | "ending";

export interface BaseScene {
  id: string;
  type: SceneType;
  act: number;
  sceneNumber: number;
}

export interface DialogueScene extends BaseScene {
  type: "dialogue";
  character: string;
  characterSprite: string;
  dialogueText: string;
  backgroundColor: string;
  nextScene?: string;
}

export interface MonologueScene extends BaseScene {
  type: "monologue";
  dialogueText: string;
  backgroundColor: string;
  nextScene?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  nextScene: string;
  affection?: { character: string; amount: number };
}

export interface ChoiceScene extends BaseScene {
  type: "choice";
  questionText: string;
  options: ChoiceOption[];
  backgroundColor: string;
}

export interface TransitionScene extends BaseScene {
  type: "transition";
  narrationText: string;
  nextScene: string;
  duration: number;
  backgroundColor?: string;
}

export interface EndingScene extends BaseScene {
  type: "ending";
  endingType: "act" | "game";
  endingText: string;
  characterSprite?: string;
  nextScene?: string;
}

export type Scene =
  | DialogueScene
  | MonologueScene
  | ChoiceScene
  | TransitionScene
  | EndingScene;

// ── Act ────────────────────────────────────────────────────────────────────────

export interface Act {
  actNumber: number;
  title: string;
  scenes: Scene[];
}

// ── Character ──────────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  spritesPath: string;
  affection: number; // 0–100
}