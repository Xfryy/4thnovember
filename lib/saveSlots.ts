/**
 * saveSlots.ts
 *
 * 10-slot save system:
 *   Slot 0  — Auto-save (updated every scene advance)
 *   Slot 1–9 — Manual saves
 *
 * Each slot stores current state + preview image + text snippet
 * so the Save/Load screen can render a meaningful thumbnail.
 */

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SaveSlot {
  slotId: number;           // 0 = auto, 1–9 = manual
  uid: string;
  currentAct: number;
  currentSceneId: string;   // scene to resume AT
  choices: Record<string, string>;
  affection: Record<string, number>;
  unlockedCharacters?: string[];
  unlockedCGs?: string[];
  playTimeSeconds: number;
  lastSaved: number;        // timestamp ms
  cleared?: boolean;        // tombstone flag — slot was soft-deleted
  // Preview metadata
  previewImage?: string;    // character sprite URL from that scene
  previewText?: string;     // first ~60 chars of dialogue/narration
  sceneLabel?: string;      // "Act 1 · Scene 3"
}

// ── Config ─────────────────────────────────────────────────────────────────────

export const AUTO_SAVE_SLOT = 0;
export const TOTAL_SLOTS    = 10; // 0..9
const COLLECTION            = "save_slots";

// ── Helpers ────────────────────────────────────────────────────────────────────

function docId(uid: string, slotId: number): string {
  return `${uid}_s${slotId}`;
}

// ── CRUD ───────────────────────────────────────────────────────────────────────

export async function writeSlot(slot: SaveSlot): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTION, docId(slot.uid, slot.slotId)), {
      ...slot,
      lastSaved: Date.now(),
    });
  } catch (e) {
    console.error("[SaveSlots] writeSlot failed:", e);
  }
}

export async function readSlot(uid: string, slotId: number): Promise<SaveSlot | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION, docId(uid, slotId)));
    if (!snap.exists()) return null;
    const data = snap.data() as SaveSlot;
    // Ignore tombstone records
    if (data.cleared) return null;
    return data;
  } catch (e) {
    console.error("[SaveSlots] readSlot failed:", e);
    return null;
  }
}

/** Reads all 10 slots in parallel — never throws, missing slots = null */
export async function readAllSlots(uid: string): Promise<(SaveSlot | null)[]> {
  const results = await Promise.allSettled(
    Array.from({ length: TOTAL_SLOTS }, (_, i) => readSlot(uid, i))
  );
  return results.map((r) => (r.status === "fulfilled" ? r.value : null));
}

/** Soft-delete a manual slot (write tombstone) */
export async function clearSlot(uid: string, slotId: number): Promise<void> {
  if (slotId === AUTO_SAVE_SLOT) return; // never clear auto-save this way
  try {
    await setDoc(doc(db, COLLECTION, docId(uid, slotId)), {
      cleared: true,
      slotId,
      uid,
      lastSaved: Date.now(),
    } satisfies Partial<SaveSlot>);
  } catch (e) {
    console.error("[SaveSlots] clearSlot failed:", e);
  }
}

/** Calculate total playtime in minutes from all save slots */
export async function calculateTotalPlaytime(uid: string): Promise<{ totalMinutes: number; totalPlays: number }> {
  try {
    const slots = await readAllSlots(uid);
    let totalSeconds = 0;
    let totalPlays   = 0;

    slots.forEach((slot) => {
      if (slot && !slot.cleared) {
        totalSeconds += slot.playTimeSeconds || 0;
        totalPlays++;
      }
    });

    return { totalMinutes: Math.floor(totalSeconds / 60), totalPlays };
  } catch (e) {
    console.error("[SaveSlots] calculateTotalPlaytime failed:", e);
    return { totalMinutes: 0, totalPlays: 0 };
  }
}