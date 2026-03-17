/**
 * Act 2 Configuration — 帰還 (Homecoming)
 */

import { ActConfig } from "@/components/Acts/BaseActConfig";

export const ACT_2_CONFIG: ActConfig = {
  actNumber: 2,
  title: "帰還 — Homecoming",

  // ── Lifecycle Hooks ──────────────────────────────────────────────

  onActStart: async (engine) => {
    console.log("🎬 Act 2 Starting...");

    engine.setActData("dream_played", false);
    engine.setActData("hospital_exit", false);
    engine.setActData("packing_done", false);
  },

  onActEnd: async (engine, result) => {
    console.log(`✅ Act 2 Complete: ${result}`);

    const choices = engine.getChoices();
    const affection = engine.getAffection("rin");
    console.log("Player choices:", choices);
    console.log("Rin affection at end of Act 2:", affection);
  },

  onSceneLoad: async (sceneId, engine) => {
    console.log(`📖 Scene: ${sceneId}`);

    // Special scene triggers
    if (sceneId === "act2_s1") {
      const element = document.querySelector(".game-scene");
      engine.triggerEffect("fadeIn", element instanceof HTMLElement ? element : undefined);
    }

    // Track dream sequence
    if (sceneId === "act2_s1") {
      engine.setActData("dream_played", true);
    }

    // Track hospital exit
    if (sceneId === "act2_packing") {
      engine.setActData("hospital_exit", true);
    }
  },

  // ── Character Interactions ───────────────────────────────────────

  characterInteractions: {
    rin: async (engine) => {
      const affection = engine.getAffection("rin");
      engine.updateAffection("rin", 1);
      console.log(`Rin affection: ${affection}`);
    },
    doctor: async () => {
      console.log("Doctor NPC clicked.");
    },
    receptionist: async () => {
      console.log("Receptionist NPC clicked.");
    },
  },

  // ── Minigames ────────────────────────────────────────────────────

  minigames: {},

  // ── Custom Effects ───────────────────────────────────────────────

  effectHandlers: {
    fadeIn: async (target) => {
      if (target) {
        target.style.animation = "fadeIn 1.2s ease-out forwards";
      }
    },

    fadeOut: async (target) => {
      if (target) {
        target.style.animation = "fadeOut 1s ease-in forwards";
      }
    },

    // screenShake & flash effects disabled - removed screen flash on every click

    textEffect: async (target) => {
      if (target) {
        target.style.animation = "textGlow 1.5s ease-in-out infinite";
      }
    },
  },

  // ── Assets ──────────────────────────────────────────────────────

  preloadAssets: {
    images: [
      // Backgrounds
      "/Image/GameBG/Bg-1.jpg",
      "/Image/GameBG/Exit.png",
      "/Image/GameBG/Hallway.png",
      "/Image/GameBG/road.jpg",

      // Scene Images (CG) - Act 2
      "/Image/scenes/Act_2/scene_1.png",
      "/Image/scenes/Act_2/scene_2.png",
      "/Image/scenes/Act_2/scene_3.png",
      "/Image/scenes/Act_2/scene_4.png",

      // Rin Sprites
      "/Image/Rinn/eye-close-smile.png",
      "/Image/Rinn/defal-smile-Photoroom.png",
      "/Image/Rinn/kaget-santay.png",
      "/Image/Rinn/mikir.png",
      "/Image/Rinn/cemberut.png",
      "/Image/Rinn/cemberut-nengok.png",
      "/Image/Rinn/hai.png",
      "/Image/Rinn/pointing.png",

      // NPCs
      "/Image/NPC/doctor/doctor.png",
      "/Image/NPC/doctor/Reception.png",
    ],
    audio: [
      "/audio/sfx/bag.mp3",
      "/audio/sfx/page-turn.mp3",
      "/audio/sfx/zipper.mp3",
    ],
  },
};

export default ACT_2_CONFIG;
