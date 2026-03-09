import { Act, Scene } from "@/types/game";

/**
 * Act 1: The Beginning
 * 
 * This is where the story starts. The player wakes up and meets Rinn.
 * Scene structure follows the game engine specifications.
 */

export const ACT_1_SCENES: Scene[] = [
  // Scene 1: Opening Transition
  {
    id: "act1_scene1",
    type: "transition",
    act: 1,
    sceneNumber: 1,
    narrationText: "4th November, Morning...\n\nA new chapter begins.",
    nextScene: "act1_scene2",
    duration: 3000,
    backgroundColor: "#0f0f1e",
  },

  // Scene 2: Monologue - MC waking up
  {
    id: "act1_scene2",
    type: "monologue",
    act: 1,
    sceneNumber: 2,
    dialogueText: "Apa ini? Dimana aku?\n\nLast thing I remember was... falling asleep in my bed.",
    backgroundColor: "#2a2a4e",
    nextScene: "act1_scene3",
  },

  // Scene 3: Character Dialogue - Meet Rinn
  {
    id: "act1_scene3",
    type: "dialogue",
    act: 1,
    sceneNumber: 3,
    character: "Rinn",
    characterSprite: "/Image/Rinn/SchoolFIT/frame_0.png",
    dialogueText: "Ohayo! Kamu akhirnya bangun!\n\nAku sudah menunggu lama...",
    backgroundColor: "#e8b4d0",
    nextScene: "act1_scene4",
  },

  // Scene 4: MC Response (Monologue)
  {
    id: "act1_scene4",
    type: "monologue",
    act: 1,
    sceneNumber: 4,
    dialogueText: "A girl in a school uniform is standing in front of me.\n\nI have no idea who she is.",
    backgroundColor: "#e8b4d0",
    nextScene: "act1_scene5",
  },

  // Scene 5: Dialogue - Rinn explains
  {
    id: "act1_scene5",
    type: "dialogue",
    act: 1,
    sceneNumber: 5,
    character: "Rinn",
    characterSprite: "/Image/Rinn/SchoolFIT/frame_1.png",
    dialogueText: "Aku Rinn. Kita sudah bertemu sebelumnya, ingat?\n\nWalaupun... Aku ragu kau benar-benar ingat aku.",
    backgroundColor: "#e8b4d0",
    nextScene: "act1_scene6",
  },

  // Scene 6: First Choice
  {
    id: "act1_scene6",
    type: "choice",
    act: 1,
    sceneNumber: 6,
    questionText: "Bagaimana kamu merespons?",
    backgroundColor: "#e8b4d0",
    options: [
      {
        id: "choice1_opt1",
        text: "Aku tidak ingat. Siapa kamu?",
        nextScene: "act1_scene7_choice1",
        affection: {
          character: "rinn",
          amount: -5,
        },
      },
      {
        id: "choice1_opt2",
        text: "Tentu aku ingat! Rinn!",
        nextScene: "act1_scene7_choice2",
        affection: {
          character: "rinn",
          amount: 10,
        },
      },
      {
        id: "choice1_opt3",
        text: "Hmm, ceritakan aku tentang kita.",
        nextScene: "act1_scene7_choice3",
        affection: {
          character: "rinn",
          amount: 5,
        },
      },
    ],
  },

  // Scene 7 - Choice 1 Path (negative)
  {
    id: "act1_scene7_choice1",
    type: "dialogue",
    act: 1,
    sceneNumber: 7,
    character: "Rinn",
    characterSprite: "/Image/Rinn/SchoolFIT/frame_2.png",
    dialogueText: "Ah... Seperti itu.\n\nBaik, mungkin sudah terlalu lama.",
    backgroundColor: "#e8b4d0",
    nextScene: "act1_scene8",
  },

  // Scene 7 - Choice 2 Path (positive)
  {
    id: "act1_scene7_choice2",
    type: "dialogue",
    act: 1,
    sceneNumber: 7,
    character: "Rinn",
    characterSprite: "/Image/Rinn/SchoolFIT/frame_1.png",
    dialogueText: "Yay! Kamu ingat!\n\nAku khawatir kamu sudah lupa aku selamanya...",
    backgroundColor: "#e8b4d0",
    nextScene: "act1_scene8",
  },

  // Scene 7 - Choice 3 Path (neutral)
  {
    id: "act1_scene7_choice3",
    type: "dialogue",
    act: 1,
    sceneNumber: 7,
    character: "Rinn",
    characterSprite: "/Image/Rinn/SchoolFIT/frame_0.png",
    dialogueText: "Kami sudah menjalin hubungan yang dalam selama ini.\n\nTapi semuanya berubah saat hari November ke-4...",
    backgroundColor: "#e8b4d0",
    nextScene: "act1_scene8",
  },

  // Scene 8: End of Act 1
  {
    id: "act1_scene8",
    type: "ending",
    act: 1,
    sceneNumber: 8,
    endingType: "act",
    characterSprite: "/Image/Rinn/SchoolFIT/frame_1.png",
    endingText: "To be continued...",
    nextScene: "act2_scene1", // Will be in Act 2
  },
];

/**
 * Export the complete Act 1
 */
export const ACT_1: Act = {
  actNumber: 1,
  title: "新しい朝 (A New Morning)",
  scenes: ACT_1_SCENES,
};

/**
 * Scene Registry
 * Maps scene IDs to their data for quick lookup
 */
export const SCENE_REGISTRY: Record<string, Scene> = ACT_1_SCENES.reduce(
  (acc, scene) => {
    acc[scene.id] = scene;
    return acc;
  },
  {} as Record<string, Scene>
);
