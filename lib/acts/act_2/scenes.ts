import { Scene } from "@/types/game";

/**
 * Act 2: 運命の選択 — Fateful Choices
 * The mystery deepens as more clues emerge
 * Rinn's true nature hints at the nature of this world
 */

export const ACT_2_SCENES: Scene[] = [
  // ── Prologue ─────────────────────────────────────────────────────

  {
    id: "act2_s1",
    type: "transition",
    act: 2,
    sceneNumber: 1,
    text: "Hours later...\nOn the way to school.",
    bg: { color: "#06020f" },
    duration: 3000,
    next: "act2_s2",
  },

  // ── Opening ──────────────────────────────────────────────────────

  {
    id: "act2_s2",
    type: "monologue",
    act: 2,
    sceneNumber: 2,
    text: "I walk alongside her.\n\nStrange. It feels like I've walked this path with her before... but when?",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s3",
  },

  {
    id: "act2_s3",
    type: "dialogue",
    act: 2,
    sceneNumber: 3,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "Hey, why are you so quiet?\n\nIs something on your mind?",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s4",
  },

  // ── Choice Point ─────────────────────────────────────────────────

  {
    id: "act2_s4",
    type: "choice",
    act: 2,
    sceneNumber: 4,
    question: "You answer...",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" },
    options: [
      {
        id: "c2_opt1",
        text: "Nothing, I'm just tired.",
        next: "act2_s5a",
        affection: { character: "rinn", amount: 0 },
      },
      {
        id: "c2_opt2",
        text: "Actually, I was thinking about you.",
        next: "act2_s5b",
        affection: { character: "rinn", amount: 15 },
      },
      {
        id: "c2_opt3",
        text: "I feel like I'm missing something important.",
        next: "act2_s5c",
        affection: { character: "rinn", amount: 5 },
      },
    ],
  },

  // ── Branch A ─────────────────────────────────────────────────────

  {
    id: "act2_s5a",
    type: "dialogue",
    act: 2,
    sceneNumber: 5,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "I see. Well, you should get more sleep then.\n\nCome on, we'll be late!",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/anoo.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s6",
  },

  // ── Branch B ─────────────────────────────────────────────────────

  {
    id: "act2_s5b",
    type: "dialogue",
    act: 2,
    sceneNumber: 5,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "...Me? Well, that's... I'm happy you were thinking of me.",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/fully-smile.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s6",
  },

  // ── Branch C ─────────────────────────────────────────────────────

  {
    id: "act2_s5c",
    type: "dialogue",
    act: 2,
    sceneNumber: 5,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "Missing something? What do you mean?",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/kaget.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s6",
  },

  // ── Convergence ─────────────────────────────────────────────────

  {
    id: "act2_s6",
    type: "monologue",
    act: 2,
    sceneNumber: 6,
    text: "She holds my hand.\n\nHer grip is warm, reassuring. But there's something else in her eyes. A sadness I can't quite understand.",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s7",
  },

  {
    id: "act2_s7",
    type: "dialogue",
    act: 2,
    sceneNumber: 7,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "No matter what happens... you just need to remember one thing.\n\nI'm always with you. Even if time resets.",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/snyum-seri.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s8",
  },

  // ── The Truth Unfolds ────────────────────────────────────────────

  {
    id: "act2_s8",
    type: "monologue",
    act: 2,
    sceneNumber: 8,
    text: "Those words... they carry weight. As if she's speaking from experience.\n\nWhat does she mean by 'time resets'?",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/snyum-seri.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act2_s9",
  },

  // ── Minigame Interlude ───────────────────────────────────────────

  {
    id: "act2_s9",
    type: "minigame",
    act: 2,
    sceneNumber: 9,
    gameId: "quiz-game",
    title: "Truth Challenge",
    description: "Rinn's memories flow into you. Can you understand the truth?",
    bg: { color: "#06020f" },
    next: "act2_s10",
    onWinNext: "act2_s10",
  },

  {
    id: "act2_s10",
    type: "cg",
    act: 2,
    sceneNumber: 10,
    image: "/Image/GameBG/Bg-1.jpg",
    caption: "You saw something... something impossible. A cycle repeating endlessly.",
    next: "act2_ending_mystery",
  },

  {
    id: "act2_s11",
    type: "cg",
    act: 2,
    sceneNumber: 11,
    image: "/Image/GameBG/Bg-1.jpg",
    caption: "The truth slips away before you can grasp it.",
    next: "act2_ending_confused",
  },

  {
    id: "act2_ending_mystery",
    type: "ending",
    act: 2,
    sceneNumber: 12,
    endingType: "good",
    title: "The Cycle Revealed",
    subtitle: "You glimpsed the truth. Time loops. Rinn is trapped.",
    characterSprite: "/Image/Rinn/snyum-seri.png",
    bg: { color: "#06020f" },
    // No next scene - player returns to menu
  },

  // ── Transition ───────────────────────────────────────────────────

  {
    id: "game_continues",
    type: "transition",
    act: 2,
    sceneNumber: 13,
    text: "Act 2 Complete\n\nStory Continues...",
    bg: { color: "#06020f" },
    duration: 3000,
    next: "menu",
  },
];