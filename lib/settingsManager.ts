/**
 * settingsManager.ts
 * Handles persisting game settings to localStorage
 */

import type { GameSettings } from "@/store/gameStore";

const SETTINGS_KEY = "4thnovember_settings";

export const settingsManager = {
  /**
   * Save settings to localStorage
   */
  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  },

  /**
   * Load settings from localStorage
   * Returns null if not found or corrupted
   */
  loadSettings(): GameSettings | null {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as GameSettings;
    } catch (error) {
      console.error("Failed to load settings:", error);
      return null;
    }
  },

  /**
   * Clear settings from localStorage
   */
  clearSettings(): void {
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error("Failed to clear settings:", error);
    }
  },
};
