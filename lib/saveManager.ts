/**
 * saveManager.ts - DEPRECATED
 *
 * ⚠️ This file is deprecated. Use saveSlots.ts instead.
 *
 * Previously used for storing "current game progress" in the "saves" collection.
 * This has been consolidated into the saveSlots system where:
 *   - Slot 0: Auto-save (current game state)
 *   - Slots 1-9: Manual saves
 *
 * The "saves" collection is no longer used but remains for backward compatibility.
 * Do NOT add new functionality to this file.
 *
 * If you need to migrate old saves data:
 * 1. Read from saves/{uid}
 * 2. Convert to SaveSlot and write to save_slots/{uid}_s0
 * 3. Update users/{uid} totalPlayTime / totalPlays
 * 4. Delete old saves/{uid} document
 *
 * See: lib/saveSlots.ts for the active save system
 * See: DATABASE_SCHEMA.md for schema documentation
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

/** @deprecated Use saveSlots.writeSlot() instead */
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

/** @deprecated Use saveSlots.writeSlot() instead */
export function writeSaveDebounced(save: SaveData): void {
  clearDebounce();
  debounceTimer = setTimeout(() => {
    writeSaveNow(save);
  }, DEBOUNCE_MS);
}

/** @deprecated Use saveSlots functions instead */
export function flushSave(save: SaveData): Promise<void> {
  clearDebounce();
  return writeSaveNow(save);
}

// ── Read ───────────────────────────────────────────────────────────────────────

/** @deprecated Use saveSlots.readSlot() instead */
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

/** @deprecated Use saveSlots.clearSlot() instead */
export async function deleteSave(uid: string): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION, uid), { deleted: true, uid, lastSaved: Date.now() });
  } catch (e) {
    console.error("[SaveManager] Failed to delete save:", e);
  }
}

