"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { SCENE_REGISTRY, getActForScene } from "@/components/Acts/acts";
import {
  saveProgress,
  registerUnloadSave,
  loadProgress,
  AUTOSAVE_EVERY_N_SCENES,
  GameStateSnapshot,
} from "@/lib/saveSystem";
import { writeSlot, AUTO_SAVE_SLOT, SaveSlot } from "@/lib/saveSlots";
import { auth } from "@/lib/firebase";
import { setCachedAutoSlot } from "@/lib/Sessioncache";

// ── Screenshot helper ─────────────────────────────────────────────────────────

async function captureSceneScreenshot(): Promise<string | undefined> {
  try {
    const sceneEl = document.querySelector(".game-scene") as HTMLElement | null;
    if (!sceneEl) return undefined;

    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(sceneEl, {
      backgroundColor: "#000",
      scale: 0.4,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
    // Reject if too large for Firestore (~200 KB)
    return dataUrl.length > 262144 ? undefined : dataUrl;
  } catch {
    return undefined;
  }
}

// ── Slot preview builder ──────────────────────────────────────────────────────

function buildSlotPreview(sceneId: string): Partial<SaveSlot> {
  const s = SCENE_REGISTRY[sceneId];
  if (!s) return {};

  let previewText  = "";
  let previewImage: string | undefined;

  if ("text"          in s) previewText  = (s as any).text.slice(0, 80);
  if ("dialogueText"  in s) previewText  = (s as any).dialogueText.slice(0, 80);
  if ("narrationText" in s) previewText  = (s as any).narrationText.slice(0, 80);
  if ("endingText"    in s) previewText  = (s as any).endingText.slice(0, 80);

  if ("characters" in s && Array.isArray((s as any).characters) && (s as any).characters.length > 0) {
    previewImage = (s as any).characters[0].sprite;
  } else if ("characterSprite" in s) {
    previewImage = (s as any).characterSprite;
  }

  const result: Partial<SaveSlot> = { sceneLabel: `Act ${s.act} · Scene ${s.sceneNumber}` };
  if (previewText)  result.previewText  = previewText;
  if (previewImage) result.previewImage = previewImage;
  return result;
}

async function buildSlotPreviewWithScreenshot(sceneId: string): Promise<Partial<SaveSlot>> {
  const preview    = buildSlotPreview(sceneId);
  const screenshot = await captureSceneScreenshot();
  if (screenshot) preview.previewImage = screenshot;
  return preview;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseSaveStateOptions {
  actNumber:    number;
  startSceneId: string;
}

export function useSaveState({ actNumber, startSceneId }: UseSaveStateOptions) {
  const [savedFlash, setSavedFlash] = useState(false);
  const [isSaving,   setIsSaving]   = useState(false);
  const [isLoading,  setIsLoading]  = useState(false); // for load-slot feedback

  const saveStateRef = useRef<GameStateSnapshot>({
    actNumber,
    sceneId: startSceneId,
    choices: {},
    affection: {},
    unlockedCharacters: [],
    unlockedCGs: [],
    inventory: [],
    sessionStartMs: Date.now(),
    savedPlayTime: 0,
  });
  const sceneAdvanceCountRef = useRef(0);

  useEffect(() => {
    loadProgress().then((save) => {
      if (save) {
        saveStateRef.current.savedPlayTime      = save.playTimeSeconds;
        saveStateRef.current.choices            = save.choices   ?? {};
        saveStateRef.current.affection          = save.affection ?? {};
        saveStateRef.current.unlockedCharacters = save.unlockedCharacters ?? [];
        saveStateRef.current.unlockedCGs        = save.unlockedCGs ?? [];
        saveStateRef.current.inventory          = save.inventory ?? [];
      }
    });
  }, []);

  useEffect(() => {
    return registerUnloadSave(() => saveStateRef.current);
  }, []);

  const getPlayTime = useCallback(() =>
    saveStateRef.current.savedPlayTime +
    (Date.now() - saveStateRef.current.sessionStartMs) / 1000,
  []);

  const writeAutoSave = useCallback(async (nextSceneId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    // Update state FIRST before saving
    const newAct = getActForScene(nextSceneId);
    saveStateRef.current = {
      ...saveStateRef.current,
      actNumber: newAct,
      sceneId:   nextSceneId,
    };

    // Use screenshot for auto-save just like manual save
    const preview = await buildSlotPreviewWithScreenshot(nextSceneId);
    const slot: SaveSlot = {
      slotId:          AUTO_SAVE_SLOT,
      uid:             user.uid,
      currentAct:      newAct,
      currentSceneId:  nextSceneId,
      choices:         { ...saveStateRef.current.choices },
      affection:       { ...saveStateRef.current.affection },
      unlockedCharacters: [...(saveStateRef.current.unlockedCharacters || [])],
      unlockedCGs:        [...(saveStateRef.current.unlockedCGs || [])],
      inventory:          [...(saveStateRef.current.inventory || [])],
      playTimeSeconds: Math.floor(getPlayTime()),
      lastSaved:       Date.now(),
      ...preview,
    };
    
    // Update cache AND save to Firestore
    setCachedAutoSlot(user.uid, slot);
    await writeSlot(slot);
    
    console.log(`💾 Auto-saved: Act ${newAct} - Scene ${nextSceneId}`);
  }, [getPlayTime]);

  const handleManualSave = useCallback(async (slotId: number): Promise<void> => {
    const user = auth.currentUser;
    if (!user || slotId === AUTO_SAVE_SLOT) return;
    const preview = await buildSlotPreviewWithScreenshot(saveStateRef.current.sceneId);
    const slot: SaveSlot = {
      slotId,
      uid:             user.uid,
      currentAct:      saveStateRef.current.actNumber,
      currentSceneId:  saveStateRef.current.sceneId,
      choices:         { ...saveStateRef.current.choices },
      affection:       { ...saveStateRef.current.affection },
      unlockedCharacters: [...(saveStateRef.current.unlockedCharacters || [])],
      unlockedCGs:        [...(saveStateRef.current.unlockedCGs || [])],
      inventory:          [...(saveStateRef.current.inventory || [])],
      playTimeSeconds: Math.floor(getPlayTime()),
      lastSaved:       Date.now(),
      ...preview,
    };
    setIsSaving(true);
    await writeSlot(slot);
    setIsSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }, [getPlayTime]);

  const onSceneAdvance = useCallback(
    (nextSceneId: string, choiceSceneId?: string, choiceId?: string) => {
      const newAct = getActForScene(nextSceneId);
      const prevAct = saveStateRef.current.actNumber;
      
      const unlocked = new Set(saveStateRef.current.unlockedCharacters || []);
      const unlockedCGTracker = new Set(saveStateRef.current.unlockedCGs || []);
      
      // If player reaches the scene where Rin introduces herself, unlock her name
      if (nextSceneId === "act1_s32" || nextSceneId === "act1_s33" || nextSceneId === "act1_s34") {
         if (!unlocked.has("rin")) {
           unlocked.add("rin");
           const user = auth.currentUser;
           if (user) {
             import("@/lib/firebase").then(({ unlockCharacterGlobally }) => {
               unlockCharacterGlobally(user.uid, "rin");
             });
             import("@/store/gameStore").then(({ useGameStore }) => {
               useGameStore.getState().unlockCharacter("rin");
             });
             import("@/lib/Sessioncache").then(({ getCachedProfile, setCachedProfile }) => {
               const p = getCachedProfile(user.uid);
               if (p) {
                 setCachedProfile(user.uid, { ...p, unlockedCharacters: Array.from(unlocked) });
               }
             });
           }
         }
      }

      // Check current scene for CG unlocks
      const currentSceneConfig = SCENE_REGISTRY[nextSceneId];
      if (currentSceneConfig) {
        let cgToUnlock: string | null = null;
        
        // Match Background Images
        if ((currentSceneConfig as any).bg?.image) {
          cgToUnlock = (currentSceneConfig as any).bg.image;
        }
        
        // Match standalone CG Scenes
        if (currentSceneConfig.type === "cg" && (currentSceneConfig as any).image) {
           cgToUnlock = (currentSceneConfig as any).image;
        }

        if (cgToUnlock && !unlockedCGTracker.has(cgToUnlock)) {
           unlockedCGTracker.add(cgToUnlock);
           const user = auth.currentUser;
           if (user) {
             import("@/lib/firebase").then(({ unlockCGGlobally }) => {
               unlockCGGlobally(user.uid, cgToUnlock!);
             });
             import("@/store/gameStore").then(({ useGameStore }) => {
               useGameStore.getState().unlockCG(cgToUnlock!);
             });
             import("@/lib/Sessioncache").then(({ getCachedProfile, setCachedProfile }) => {
               const p = getCachedProfile(user.uid);
               if (p) {
                 setCachedProfile(user.uid, { ...p, unlockedCGs: Array.from(unlockedCGTracker) });
               }
             });
           }
        }
      }

      // Reset counter when act changes to prevent sync issues
      if (newAct !== prevAct) {
        sceneAdvanceCountRef.current = 0;
        console.log(`🔄 Act changed from ${prevAct} to ${newAct}, reset auto-save counter`);
      }

      // Update state IMMEDIATELY
      saveStateRef.current = {
        ...saveStateRef.current,
        actNumber: newAct,
        sceneId:   nextSceneId,
        unlockedCharacters: Array.from(unlocked),
        unlockedCGs: Array.from(unlockedCGTracker),
        inventory: [...(saveStateRef.current.inventory || [])],
        choices: choiceSceneId && choiceId
          ? { ...saveStateRef.current.choices, [choiceSceneId]: choiceId }
          : saveStateRef.current.choices,
      };
      
      sceneAdvanceCountRef.current += 1;
      
      // Auto-save every N scenes
      if (sceneAdvanceCountRef.current % AUTOSAVE_EVERY_N_SCENES === 0) {
        console.log(`⏰ Auto-save triggered (scene count: ${sceneAdvanceCountRef.current})`);
        saveProgress(saveStateRef.current);
        writeAutoSave(nextSceneId);
      }
    },
    [writeAutoSave],
  );

  const exitSave = useCallback(async () => {
    setIsSaving(true);
    await saveProgress(saveStateRef.current);
    setIsSaving(false);
  }, []);

  const loadSlotIntoState = useCallback((slot: {
    currentAct:    number;
    currentSceneId: string;
    choices?:      Record<string, string>;
    affection?:    Record<string, number>;
    unlockedCharacters?: string[];
    unlockedCGs?: string[];
    inventory?: string[];
  }) => {
    setIsLoading(true);
    
    // Reset scene counter when loading a save to prevent auto-save sync issues
    sceneAdvanceCountRef.current = 0;
    
    saveStateRef.current = {
      ...saveStateRef.current,
      actNumber: slot.currentAct,
      sceneId:   slot.currentSceneId,
      choices:   slot.choices   ?? {},
      affection: slot.affection ?? {},
      unlockedCharacters: slot.unlockedCharacters ?? [],
      unlockedCGs: slot.unlockedCGs ?? [],
      inventory: slot.inventory ?? [],
    };
    
    console.log(`📥 Loaded save: Act ${slot.currentAct} - Scene ${slot.currentSceneId}`);
  }, []);

  const clearLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    saveStateRef,
    savedFlash,
    isSaving,
    isLoading,
    setIsLoading,
    handleManualSave,
    onSceneAdvance,
    exitSave,
    loadSlotIntoState,
    clearLoading,
  };
}