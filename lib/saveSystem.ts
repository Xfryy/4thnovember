import { SaveData } from "@/types/game";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ── Types ───────────────────────────────────────────────────────────────────────

export interface GameStateSnapshot {
  actNumber: number;
  sceneId: string;
  choices: Record<string, string>;
  affection: Record<string, number>;
  sessionStartMs: number;
  savedPlayTime: number;
}

// ── Config ──────────────────────────────────────────────────────────────────────

export const AUTOSAVE_EVERY_N_SCENES = 3; // Save every 3 scenes to reduce Firestore writes

// ── Save & Load ─────────────────────────────────────────────────────────────────

/**
 * Save current game progress to Firestore
 * Called every N scenes (AUTOSAVE_EVERY_N_SCENES) to avoid excessive writes
 */
export async function saveProgress(snapshot: GameStateSnapshot): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ saveProgress: No user logged in");
    return;
  }

  const playTimeSeconds =
    snapshot.savedPlayTime + (Date.now() - snapshot.sessionStartMs) / 1000;

  const saveData: SaveData = {
    uid: user.uid,
    currentAct: snapshot.actNumber,
    currentSceneId: snapshot.sceneId,
    choices: snapshot.choices,
    affection: snapshot.affection,
    playTimeSeconds: Math.floor(playTimeSeconds),
    lastSaved: Date.now(),
  };

  try {
    const saveRef = doc(db, "saves", user.uid);
    await setDoc(saveRef, saveData, { merge: true });
    console.log("✅ Saved progress:", saveData.currentSceneId);
  } catch (error) {
    console.error("❌ Save failed:", error);
  }
}

/**
 * Load the most recent game save from Firestore
 */
export async function loadProgress(): Promise<SaveData | null> {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ loadProgress: No user logged in");
    return null;
  }

  try {
    const saveRef = doc(db, "saves", user.uid);
    const saveSnap = await getDoc(saveRef);

    if (!saveSnap.exists()) {
      console.log("ℹ️ No previous save found");
      return null;
    }

    const saveData = saveSnap.data() as SaveData;
    console.log("✅ Loaded previous save:", saveData.currentSceneId);
    return saveData;
  } catch (error) {
    console.error("❌ Load failed:", error);
    return null;
  }
}

/**
 * Register a beforeunload handler to save progress when user leaves/closes tab
 * Returns cleanup function
 */
export function registerUnloadSave(
  getSnapshot: () => GameStateSnapshot
): () => void {
  const handleBeforeUnload = () => {
    // Fire-and-forget save
    const snapshot = getSnapshot();
    saveProgress(snapshot).catch((err) =>
      console.error("❌ Unload save failed:", err)
    );
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}

/**
 * Delete a save (for new game confirmation)
 */
export async function deleteSave(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const saveRef = doc(db, "saves", user.uid);
    await setDoc(saveRef, {}, { merge: true });
    console.log("✅ Save deleted");
  } catch (error) {
    console.error("❌ Delete save failed:", error);
  }
}
