/**
 * Act 2 Configuration
 * Demonstrates act-specific customization for "Fateful Choices"
 */

import { ActConfig } from "@/components/Acts/BaseActConfig";
import QuizGame from "./minigames/QuizGame";

export const ACT_2_CONFIG: ActConfig = {
  actNumber: 2,
  title: "運命の選択 — Fateful Choices",

  // ── Lifecycle Hooks ──────────────────────────────────────────────

  onActStart: async (engine) => {
    console.log("🎬 Act 2 Starting...");

    // Initialize act-specific state
    engine.setActData("cycle_discovered", false);
    engine.setActData("rinn_affection", 0);

    // Could preload assets here if needed
    // await engine.preloadAssets([...]);
  },

  onActEnd: async (engine, result) => {
    console.log(`✅ Act 2 Complete with result: ${result}`);

    // Cleanup act-specific resources
    const playersChoices = engine.getChoices();
    console.log("Player's choices:", playersChoices);
  },

  onSceneLoad: async (sceneId, engine) => {
    console.log(`📖 Loaded scene: ${sceneId}`);

    // Example: Trigger special effect on specific scene
    if (sceneId === "act2_s1") {
      // Intro scene - could fade in
      const element = document.querySelector(".game-scene");
      engine.triggerEffect("fadeIn", element instanceof HTMLElement ? element : undefined);
    }

    // Special effect for choice scenes
    if (sceneId === "act2_s4") {
      const element = document.querySelector(".game-scene");
      engine.triggerEffect("textEffect", element instanceof HTMLElement ? element : undefined);
    }
  },

  // ── Character Interactions ──────────────────────────────────────

  characterInteractions: {
    rinn: async (engine) => {
      console.log("💬 Player clicked on Rinn!");

      const affection = engine.getAffection("rinn");
      console.log(`Rinn affection: ${affection}`);

      // Update affection
      engine.updateAffection("rinn", 1);

      // Could trigger additional dialogue or effects
      // engine.triggerEffect("characterGlow", element);
    },
  },

  // ── Registered Minigames ────────────────────────────────────────

  minigames: {
    "quiz-game": QuizGame,
  },

  // ── Custom Effects ──────────────────────────────────────────────

  effectHandlers: {
    fadeIn: async (target) => {
      target.style.animation = "fadeIn 1s ease-out forwards";
    },

    fadeOut: async (target) => {
      target.style.animation = "fadeOut 1s ease-in forwards";
    },

    screenShake: async (target) => {
      target.style.animation = "screenShake 0.5s ease-in-out";
    },

    cycleFlash: async () => {
      const flash = document.createElement("div");
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(167,139,250,0.8), rgba(236,72,153,0.8));
        z-index: 99999;
        animation: flashOut 0.8s ease-out forwards;
      `;
      document.body.appendChild(flash);

      setTimeout(() => {
        document.body.removeChild(flash);
      }, 800);
    },

    textEffect: async (target) => {
      target.style.animation = "textGlow 1.5s ease-in-out infinite";
    },

    pulseEffect: async (target) => {
      target.style.animation = "pulse 1.5s ease-in-out infinite";
    },
  },

  // ── Assets to preload ───────────────────────────────────────────

  preloadAssets: {
    images: ["/Image/GameBG/Bg-1.jpg", "/Image/Rinn/*.png"],
    audio: ["/audio/bgm/act_2.mp3"],
  },
};

export default ACT_2_CONFIG;
