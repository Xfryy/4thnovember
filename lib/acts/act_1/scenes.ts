import { Scene } from "@/types/game";

/**
 * Act 1: 新しい朝 — A New Morning
 * Introduction to the protagonist and Rinn
 * Establishes the mystery: Who is the protagonist? Why can't they remember?
 */

export const ACT_1_SCENES: Scene[] = [
  // ── Prologue ─────────────────────────────────────────────────────

  {
    id: "act1_s1",
    type: "transition",
    act: 1,
    sceneNumber: 1,
    text: "4th November.\nA morning like any other...",
    bg: { color: "#06020f" },
    duration: 3200,
    next: "act1_s2",
  },

  // ── Opening ──────────────────────────────────────────────────────

  {
    id: "act1_s2",
    type: "monologue",
    act: 1,
    sceneNumber: 2,
    text: "I open my eyes.\n\nEverything feels... ordinary. Like every other day.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s3",
  },

  {
    id: "act1_s3",
    type: "dialogue",
    act: 1,
    sceneNumber: 3,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "Ohayo~! Finally you're awake.",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
        animation: "enter-bottom",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    audio: { voice: "/audio/voice/act_1/act1_s3.mp3" },
    next: "act1_s4",
  },

  {
    id: "act1_s4",
    type: "monologue",
    act: 1,
    sceneNumber: 4,
    text: "A girl stands before me, smiling as if nothing is wrong.\n\nBut... who is she?",
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
    next: "act1_s5",
  },

  {
    id: "act1_s5",
    type: "dialogue",
    act: 1,
    sceneNumber: 5,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "I'm Rinn. You haven't forgotten, have you? We've known each other for so long.",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/anoo.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s6",
  },

  // ── First Choice ─────────────────────────────────────────────────

  {
    id: "act1_s6",
    type: "choice",
    act: 1,
    sceneNumber: 6,
    question: "How do you respond?",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/anoo.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" },
    options: [
      {
        id: "c1_opt1",
        text: "I'm sorry, I don't remember you.",
        next: "act1_s7a",
        affection: { character: "rinn", amount: -5 },
      },
      {
        id: "c1_opt2",
        text: "Of course I remember you, Rinn!",
        next: "act1_s7b",
        affection: { character: "rinn", amount: 10 },
      },
      {
        id: "c1_opt3",
        text: "Tell me more about us.",
        next: "act1_s7c",
        affection: { character: "rinn", amount: 5 },
      },
    ],
  },

  // ── Branch A ─────────────────────────────────────────────────────

  {
    id: "act1_s7a",
    type: "dialogue",
    act: 1,
    sceneNumber: 7,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "...I see.\n\nIt's fine. Maybe it's just been too long.",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/kecewa.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s8",
  },

  // ── Branch B ─────────────────────────────────────────────────────

  {
    id: "act1_s7b",
    type: "dialogue",
    act: 1,
    sceneNumber: 7,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "I knew it! You scared me for a moment.",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s8",
  },

  // ── Branch C ─────────────────────────────────────────────────────

  {
    id: "act1_s7c",
    type: "dialogue",
    act: 1,
    sceneNumber: 7,
    speaker: "Rinn",
    speakerId: "rinn",
    text: "Well... that's a long story. But there's no time now. Come on, we'll be late for school!",
    characters: [
      {
        id: "rinn",
        sprite: "/Image/Rinn/anoo.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s8",
  },

  // ── Convergence ─────────────────────────────────────────────────

  {
    id: "act1_s8",
    type: "monologue",
    act: 1,
    sceneNumber: 8,
    text: "She grabs my hand and pulls me along.\n\nI feel something... familiar. Yet strange. Like a memory just out of reach.",
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
    next: "act1_s10",
  },

  {
    id: "act1_s10",
    type: "cg",
    act: 1,
    sceneNumber: 10,
    image: "/Image/GameBG/Bg-1.jpg",
    caption: "You managed to piece together some memories.",
    next: "act1_ending_good",
  },

  // ── Endings ──────────────────────────────────────────────────────

  {
    id: "act1_ending_good",
    type: "ending",
    act: 1,
    sceneNumber: 11,
    endingType: "good",
    title: "Fragments of Memory",
    subtitle: "You remembered something about Rinn.",
    characterSprite: "/Image/Rinn/eye-close-smile.png",
    bg: { color: "#06020f" },
    next: "act2_s1",
  },
];