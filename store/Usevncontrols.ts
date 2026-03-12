"use client";

/**
 * useVNControls — Central state for all Visual Novel playback controls
 *
 * Features:
 * - Auto-play (advance automatically after text finishes)
 * - Skip mode (advance instantly, skip typewriter)
 * - History log (stores all seen dialogue/monologue lines)
 * - Hide UI (hide dialogue box & toolbar for screenshots)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LogEntry {
  id: string;          // unique id
  speaker?: string;    // resolved speaker name (or undefined for monologue)
  text: string;        // resolved full text
  sceneId: string;
  timestamp: number;
}

interface VNControlsStore {
  // ── Playback ────────────────────────────────────────────────────────────────
  autoPlay: boolean;
  autoPlayDelay: number; // ms to wait after text finishes before advancing (default 1500)
  skipMode: boolean;     // advance instantly through seen/all text
  hideUI: boolean;       // hide dialogue box + toolbar

  // ── History ─────────────────────────────────────────────────────────────────
  log: LogEntry[];
  showLog: boolean;

  // ── Actions ─────────────────────────────────────────────────────────────────
  toggleAutoPlay: () => void;
  toggleSkip: () => void;
  toggleHideUI: () => void;
  toggleLog: () => void;
  setAutoPlayDelay: (ms: number) => void;
  addLogEntry: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
  clearLog: () => void;
}

export const useVNControls = create<VNControlsStore>()(
  persist(
    (set,) => ({
      autoPlay: false,
      autoPlayDelay: 1500,
      skipMode: false,
      hideUI: false,
      log: [],
      showLog: false,

      toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay, skipMode: false })),
      toggleSkip:     () => set((s) => ({ skipMode: !s.skipMode, autoPlay: false })),
      toggleHideUI:   () => set((s) => ({ hideUI: !s.hideUI })),
      toggleLog:      () => set((s) => ({ showLog: !s.showLog })),
      setAutoPlayDelay: (ms) => set({ autoPlayDelay: ms }),

      addLogEntry: (entry) => {
        const newEntry: LogEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: Date.now(),
        };
        set((s) => ({
          // keep last 200 entries
          log: [...s.log.slice(-199), newEntry],
        }));
      },

      clearLog: () => set({ log: [] }),
    }),
    {
      name: "vn-controls",
      // only persist log and delay — mode toggles reset on reload (intentional)
      partialize: (s) => ({ log: s.log, autoPlayDelay: s.autoPlayDelay }),
    }
  )
);