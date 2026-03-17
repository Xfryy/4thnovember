export interface GameUser {
  uid: string;
  email: string;
  characterName: string;
  unlockedCharacters?: string[];
  unlockedCGs?: string[];
  createdAt: number;
  lastPlayed: number;
}

export interface SaveData {
  uid: string;
  currentAct: number;
  currentSceneId: string;
  choices: Record<string, string>;
  affection: Record<string, number>;
  unlockedCharacters?: string[];
  unlockedCGs?: string[];
  inventory?: string[];
  playTimeSeconds: number;
  lastSaved: number;
}

export interface GameProgress {
  uid: string;
  currentAct: number;
  currentScene: number;
  choices: Record<string, any>;
  playTime: number;
  lastUpdated: number;
}

export interface MinigameModule { default: unknown }

export interface ActManifest {
  actNumber: number;
  images: string[];
  audio: string[];
  minigames: Array<() => Promise<MinigameModule>>;
}

// ── Character config per scene ─────────────────────────────────────────────────

export type CharacterPosition =
  | "far-left" | "left" | "center-left" | "center"
  | "center-right" | "right" | "far-right";

export type CharacterSize = "small" | "medium" | "large" | "xl" | "full";

export type CharacterAnimation =
  | "enter-bottom" | "enter-left" | "enter-right" | "fade" | "none" | "fade-in" | "fade-out";

export interface SceneCharacter {
  id: string;
  sprite: string;
  position?: CharacterPosition;
  size?: CharacterSize;
  flip?: boolean;
  dim?: boolean;
  zIndex?: number;
  animation?: CharacterAnimation;

  /**
   * Override ukuran sprite secara bebas.
   * Contoh: customSize: { width: "35vw", height: "90vh" }
   *         customSize: { width: 500 }          — angka = px
   */
  customSize?: {
    width?:  string | number;
    height?: string | number;
  };

  /**
   * Geser posisi dari titik anchor (bottom + horizontal position).
   * offsetX: geser kiri/kanan dalam px (positif = kanan, negatif = kiri)
   * offsetY: geser atas/bawah dalam px (positif = naik, negatif = turun)
   * Contoh: offsetY: 80  → karakter naik 80px dari posisi normal
   */
  offsetX?: number;
  offsetY?: number;

  /**
   * Override posisi bottom secara eksplisit (px).
   * Kalau diset, menggantikan offsetY sepenuhnya.
   * Contoh: bottom: -40  → karakter turun 40px ke bawah layar (crop kaki)
   */
  bottom?: number;
}


// ── Background config ──────────────────────────────────────────────────────────

export interface SceneBg {
  image?: string;
  color?: string;
  filter?: string;
  overlay?: string;
  size?: string;
  position?: string;
}

// ── Audio config ───────────────────────────────────────────────────────────────

export interface SceneAudio {
  bgm?: string;
  bgmStop?: boolean;
  bgmFade?: boolean;
  sfx?: string;
  voice?: string;
}

// ── Screen effect config ───────────────────────────────────────────────────────

export type SceneEffect = string;

// ── Scene types ────────────────────────────────────────────────────────────────

export type SceneType =
  | "dialogue" | "monologue" | "choice"
  | "transition" | "cg" | "ending" | "minigame" | "examine";

export interface BaseScene {
  id: string;
  type: SceneType;
  act: number;
  sceneNumber: number;
  next?: string;
}

export interface DialogueScene extends BaseScene {
  type: "dialogue";
  speaker: string;
  speakerId?: string;
  text: string;
  characters?: SceneCharacter[];
  bg?: SceneBg;
  audio?: SceneAudio;
  effect?: SceneEffect;
}

export interface MonologueScene extends BaseScene {
  type: "monologue";
  text: string;
  characters?: SceneCharacter[];
  bg?: SceneBg;
  audio?: SceneAudio;
  effect?: SceneEffect;
}

export interface ChoiceOption {
  id: string;
  text: string;
  next: string;
  affection?: { character: string; amount: number };
}

export interface ChoiceScene extends BaseScene {
  type: "choice";
  question?: string;
  options: ChoiceOption[];
  characters?: SceneCharacter[];
  bg?: SceneBg;
  effect?: SceneEffect;
}

export interface TransitionScene extends BaseScene {
  type: "transition";
  text: string;
  bg?: SceneBg;
  duration?: number;
  audio?: SceneAudio;
  effect?: SceneEffect;
}

export interface CgScene extends BaseScene {
  type: "cg";
  image: string;
  caption?: string;
  audio?: SceneAudio;
  effect?: SceneEffect;
}

export interface EndingScene extends BaseScene {
  type: "ending";
  endingType: "act" | "good" | "bad" | "true";
  title: string;
  subtitle?: string;
  characterSprite?: string;
  bg?: SceneBg;
  audio?: SceneAudio;
  effect?: SceneEffect;
  next?: string;
}

export interface MinigameScene extends BaseScene {
  type: "minigame";
  gameId: string;
  title?: string;
  description?: string;
  bg?: SceneBg;
  audio?: SceneAudio;
  effect?: SceneEffect;
  onWinNext?: string;
}

export interface ExamineScene extends BaseScene {
  type: "examine";
  image: string;
  caption?: string;
  characters?: SceneCharacter[];
  bg?: SceneBg;
  audio?: SceneAudio;
  effect?: SceneEffect;
}

export type Scene =
  | DialogueScene
  | MonologueScene
  | ChoiceScene
  | TransitionScene
  | CgScene
  | EndingScene
  | MinigameScene
  | ExamineScene;

export interface Act {
  actNumber: number;
  title: string;
  scenes: Scene[];
}

export interface Character {
  id: string;
  name: string;
  spritesPath: string;
  affection: number;
}