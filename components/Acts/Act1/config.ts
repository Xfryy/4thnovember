/**
 * Act 1 Configuration — 目覚め (Awakening)
 */

import { ActConfig } from "@/components/Acts/BaseActConfig";

export const ACT_1_CONFIG: ActConfig = {
  actNumber: 1,
  title: "目覚め — Awakening",

  // ── Lifecycle Hooks ──────────────────────────────────────────────

  onActStart: async (engine) => {
    console.log("🎬 Act 1 Starting...");

    engine.setActData("intro_played", false);
    engine.setActData("rin_affection", 0);
    engine.setActData("rin_name_revealed", false);
  },

  onActEnd: async (engine, result) => {
    console.log(`✅ Act 1 Complete: ${result}`);

    const choices = engine.getChoices();
    const affection = engine.getAffection("rin");
    console.log("Player choices:", choices);
    console.log("Rin affection at end of Act 1:", affection);
  },

  onSceneLoad: async (sceneId, engine) => {
    console.log(`📖 Scene: ${sceneId}`);

    // Special scene triggers
    if (sceneId === "act1_s1") {
      const element = document.querySelector(".game-scene");
      engine.triggerEffect("fadeIn", element instanceof HTMLElement ? element : undefined);
    }

    // Reveal Rin's name when she introduces herself
    if (sceneId === "act1_s32") {
      engine.setActData("rin_name_revealed", true);
    }
  },

  // ── Character Interactions ───────────────────────────────────────

  characterInteractions: {
    rin: async (engine) => {
      const affection = engine.getAffection("rin");
      engine.updateAffection("rin", 1);
      console.log(`Rin affection: ${affection}`);
    },
    rin_unknown: async (engine) => {
      engine.updateAffection("rin", 1);
    },
    doctor: async () => {
      console.log("Doctor NPC clicked.");
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

    screenShake: async (target) => {
      if (target) {
        target.style.animation = "screenShake 0.5s ease-in-out";
      }
    },

    flash: async (target) => {
      const el = target ?? document.body;
      const flash = document.createElement("div");
      flash.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: white;
        z-index: 99999;
        pointer-events: none;
        animation: flashOut 0.5s ease-out forwards;
      `;
      el.appendChild(flash);

      const style = document.createElement("style");
      style.innerText = `@keyframes flashOut { from { opacity: 0.8; } to { opacity: 0; } }`;
      document.head.appendChild(style);

      setTimeout(() => {
        flash.remove();
        style.remove();
      }, 500);
    },

    textEffect: async (target) => {
      if (target) {
        target.style.animation = "textGlow 1.5s ease-in-out infinite";
      }
    },
  },

  // ── Assets ───────────────────────────────────────────────────────

  preloadAssets: {
    images: [
      // Backgrounds
      "/Image/GameBG/Bg-1.jpg",

      // Scene Images (CG)
      "/Image/scenes/Act_1/scene_1.jpeg",
      "/Image/scenes/Act_1/scene_1-2.jpeg",
      "/Image/scenes/Act_1/scene-doctor.jpeg",

      // Rin Sprites
      "/Image/Rinn/eye-close-smile.png",
      "/Image/Rinn/anoo.png",
      "/Image/Rinn/kecewa.png",
      "/Image/Rinn/cemberut.png",
      "/Image/Rinn/cemberut-nengok.png",
      "/Image/Rinn/kaget-santay.png",
      "/Image/Rinn/mikir.png",
      "/Image/Rinn/pointing.png",
      "/Image/Rinn/defal-smile-Photoroom.png",
      "/Image/Rinn/hai.png",

      // NPCs
      "/Image/NPC/doctor/doctor.png",
    ],
    audio: [
      "/audio/bgm/act_1.mp3",
      "/audio/sfx/knocking-door.mp3",
      
      "/audio/voice/act_1/act1_s3.mp3",
    ],
  },
};

export default ACT_1_CONFIG;