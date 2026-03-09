// Game Session & User Data Types
export interface GameUser {
  uid: string;
  email: string;
  characterName: string;
  createdAt: number;
  lastPlayed: number;
}

export interface GameProgress {
  uid: string;
  currentAct: number;
  currentScene: number;
  choices: Record<string, any>;
  playTime: number;
  lastUpdated: number;
}

// Scene Structure Types
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
  characterSprite: string; // Path ke sprite character
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
  affection?: {
    character: string;
    amount: number;
  };
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
  duration: number; // in milliseconds
}

export interface EndingScene extends BaseScene {
  type: "ending";
  endingType: "act" | "game"; // act = next act comes, game = end of all
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

// Act Structure
export interface Act {
  actNumber: number;
  title: string;
  scenes: Scene[];
}

// Character Data
export interface Character {
  id: string;
  name: string;
  spritesPath: string; // e.g., "/Image/Rinn"
  affection: number; // 0-100
}
