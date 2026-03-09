/**
 * saveManager.ts
 *
 * Handles reading and writing SaveData to Firestore.
 * Auto-save is debounced — rapid scene changes won't spam Firebase.
 *
 * Triggers wired in GameEngine:
 *   - beforeunload  (close tab / browser)
 *   - visibilitychange hidden  (switch tab / minimize)
 *   - ← Menu button click
 *   - Every scene advance (debounced 3s)
 */

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SaveData } from "@/types/game";

const COLLECTION = "saves";
const DEBOUNCE_MS = 3000;

// ── Debounce ───────────────────────────────────────────────────────────────────

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function clearDebounce() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

// ── Write ──────────────────────────────────────────────────────────────────────

/** Immediate write — use for critical moments (tab close, menu exit) */
export async function writeSaveNow(save: SaveData): Promise<void> {
  clearDebounce();
  try {
    await setDoc(doc(db, COLLECTION, save.uid), {
      ...save,
      lastSaved: Date.now(),
    });
  } catch (e) {
    console.error("[SaveManager] Failed to write save:", e);
  }
}

/** Debounced write — use on every scene advance to avoid spamming Firebase */
export function writeSaveDebounced(save: SaveData): void {
  clearDebounce();
  debounceTimer = setTimeout(() => {
    writeSaveNow(save);
  }, DEBOUNCE_MS);
}

/** Flush any pending debounced save immediately (call before unmounting engine) */
export function flushSave(save: SaveData): Promise<void> {
  clearDebounce();
  return writeSaveNow(save);
}

// ── Read ───────────────────────────────────────────────────────────────────────

/** Returns SaveData if the user has a save, null if new player */
export async function readSave(uid: string): Promise<SaveData | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION, uid));
    if (!snap.exists()) return null;
    return snap.data() as SaveData;
  } catch (e) {
    console.error("[SaveManager] Failed to read save:", e);
    return null;
  }
}

/** Delete save (for "New Game" feature) */
export async function deleteSave(uid: string): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION, uid), { deleted: true, uid, lastSaved: Date.now() });
  } catch (e) {
    console.error("[SaveManager] Failed to delete save:", e);
  }
}
