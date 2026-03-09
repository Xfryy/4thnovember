/**
 * sessionCache.ts
 * In-memory + sessionStorage cache for user profile, auto-save slot, and save data.
 * Keeps the UI instant on return visits — no Firestore round-trip needed.
 */

import type { SaveSlot } from "@/lib/saveSlots";
import type { SaveData } from "@/types/game";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CachedProfile {
  uid: string;
  email: string;
  characterName: string;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const profileKey    = (uid: string) => `sc_profile_${uid}`;
const autoSlotKey   = (uid: string) => `sc_autoslot_${uid}`;
const saveDataKey   = (uid: string) => `sc_savedata_${uid}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function read<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage quota or SSR — silently ignore
  }
}

function remove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function getCachedProfile(uid: string): CachedProfile | null {
  return read<CachedProfile>(profileKey(uid));
}

export function setCachedProfile(uid: string, profile: CachedProfile): void {
  write(profileKey(uid), profile);
}

// ─── Auto-save slot ───────────────────────────────────────────────────────────

export function getCachedAutoSlot(uid: string): SaveSlot | null {
  return read<SaveSlot>(autoSlotKey(uid));
}

export function setCachedAutoSlot(uid: string, slot: SaveSlot): void {
  write(autoSlotKey(uid), slot);
}

// ─── Save data ────────────────────────────────────────────────────────────────

export function getCachedSaveData(uid: string): SaveData | null {
  return read<SaveData>(saveDataKey(uid));
}

export function setCachedSaveData(uid: string, save: SaveData): void {
  write(saveDataKey(uid), save);
}

// ─── Clear all cache for a user (on logout) ───────────────────────────────────

export function clearUserCache(uid: string): void {
  remove(profileKey(uid));
  remove(autoSlotKey(uid));
  remove(saveDataKey(uid));
}