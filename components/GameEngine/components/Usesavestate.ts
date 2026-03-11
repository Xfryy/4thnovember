"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { SCENE_REGISTRY, getActForScene } from "@/lib/acts";
import {
  saveProgress, registerUnloadSave, loadProgress,
  AUTOSAVE_EVERY_N_SCENES, GameStateSnapshot,
} from "@/lib/saveSystem";
import { writeSlot, AUTO_SAVE_SLOT, SaveSlot } from "@/lib/saveSlots";
import { auth } from "@/lib/firebase";
import { setCachedAutoSlot } from "@/lib/Sessioncache";

async function captureSceneScreenshot(): Promise<string | undefined> {
  try {
    const sceneEl = document.querySelector('.game-scene') as HTMLElement;
    if (!sceneEl) return undefined;

    // Try using html2canvas library (install with: npm install html2canvas)
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(sceneEl, {
        backgroundColor: '#000',
        scale: 0.4, // smaller scale for file size
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      // Compress to JPEG with quality 0.5 for smaller file size
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      
      // Check size - limit to ~200KB to stay within Firestore limits
      if (dataUrl.length > 262144) {
        console.warn('Screenshot too large, using fallback');
        return undefined;
      }
      return dataUrl;
    } catch (e) {
      console.warn('html2canvas failed, trying fallback:', e);
      return undefined;
    }
  } catch (e) {
    console.warn('Screenshot capture failed:', e);
    return undefined;
  }
}

function buildSlotPreview(sceneId: string): Partial<SaveSlot> {
  const s = SCENE_REGISTRY[sceneId];
  if (!s) return {};

  let previewText  = "";
  let previewImage: string | undefined;

  if ("text" in s)          previewText  = (s.text as string).slice(0, 80);
  if ("dialogueText" in s)  previewText  = (s as any).dialogueText.slice(0, 80);
  if ("narrationText" in s) previewText  = (s as any).narrationText.slice(0, 80);
  if ("endingText" in s)    previewText  = (s as any).endingText.slice(0, 80);

  // New engine: characters array
  if ("characters" in s && Array.isArray((s as any).characters) && (s as any).characters.length > 0) {
    previewImage = (s as any).characters[0].sprite;
  }
  // Legacy: single characterSprite
  if (!previewImage && "characterSprite" in s && (s as any).characterSprite) {
    previewImage = (s as any).characterSprite;
  }

  const sceneLabel = `Act ${s.act} · Scene ${s.sceneNumber}`;

  // Strip undefined — Firestore rejects undefined values
  const result: Partial<SaveSlot> = { sceneLabel };
  if (previewText)  result.previewText  = previewText;
  if (previewImage) result.previewImage = previewImage;
  return result;
}

async function buildSlotPreviewWithScreenshot(sceneId: string): Promise<Partial<SaveSlot>> {
  const preview = buildSlotPreview(sceneId);
  const screenshot = await captureSceneScreenshot();
  if (screenshot) {
    preview.previewImage = screenshot;
  }
  return preview;
}

interface UseSaveStateOptions {
  actNumber: number;
  startSceneId: string;
}

export function useSaveState({ actNumber, startSceneId }: UseSaveStateOptions) {
  const [savedFlash, setSavedFlash] = useState(false);
  const [isSaving,   setIsSaving]   = useState(false);

  const saveStateRef = useRef<GameStateSnapshot>({
    actNumber,
    sceneId: startSceneId,
    choices: {},
    affection: {},
    sessionStartMs: Date.now(),
    savedPlayTime: 0,
  });
  const sceneAdvanceCountRef = useRef(0);

  useEffect(() => {
    loadProgress().then((save) => {
      if (save) {
        saveStateRef.current.savedPlayTime = save.playTimeSeconds;
        saveStateRef.current.choices       = save.choices   ?? {};
        saveStateRef.current.affection     = save.affection ?? {};
      }
    });
  }, []);

  useEffect(() => {
    const cleanup = registerUnloadSave(() => saveStateRef.current);
    return cleanup;
  }, []);

  const writeAutoSave = useCallback(async (nextSceneId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const playTimeSeconds =
      saveStateRef.current.savedPlayTime +
      (Date.now() - saveStateRef.current.sessionStartMs) / 1000;
    const preview = await buildSlotPreviewWithScreenshot(nextSceneId);
    const newAct  = getActForScene(nextSceneId);
    const slot: SaveSlot = {
      slotId:          AUTO_SAVE_SLOT,
      uid:             user.uid,
      currentAct:      newAct,
      currentSceneId:  nextSceneId,
      choices:         { ...saveStateRef.current.choices },
      affection:       { ...saveStateRef.current.affection },
      playTimeSeconds: Math.floor(playTimeSeconds),
      lastSaved:       Date.now(),
      ...preview,
    };
    setCachedAutoSlot(user.uid, slot);
    await writeSlot(slot);
  }, []);

  const handleManualSave = useCallback(async (slotId: number): Promise<void> => {
    const user = auth.currentUser;
    if (!user || slotId === AUTO_SAVE_SLOT) return;
    const playTimeSeconds =
      saveStateRef.current.savedPlayTime +
      (Date.now() - saveStateRef.current.sessionStartMs) / 1000;
    const preview = await buildSlotPreviewWithScreenshot(saveStateRef.current.sceneId);
    const slot: SaveSlot = {
      slotId,
      uid:             user.uid,
      currentAct:      saveStateRef.current.actNumber,
      currentSceneId:  saveStateRef.current.sceneId,
      choices:         { ...saveStateRef.current.choices  },
      affection:       { ...saveStateRef.current.affection },
      playTimeSeconds: Math.floor(playTimeSeconds),
      lastSaved:       Date.now(),
      ...preview,
    };
    await writeSlot(slot);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }, []);

  const onSceneAdvance = useCallback((nextSceneId: string, choiceSceneId?: string, choiceId?: string) => {
    const newAct = getActForScene(nextSceneId);
    if (choiceSceneId && choiceId) {
      saveStateRef.current = {
        ...saveStateRef.current,
        choices: { ...saveStateRef.current.choices, [choiceSceneId]: choiceId },
      };
    }
    saveStateRef.current = { ...saveStateRef.current, actNumber: newAct, sceneId: nextSceneId };
    sceneAdvanceCountRef.current += 1;
    if (sceneAdvanceCountRef.current % AUTOSAVE_EVERY_N_SCENES === 0) {
      saveProgress(saveStateRef.current);
    }
    writeAutoSave(nextSceneId);
  }, [writeAutoSave]);

  const exitSave = useCallback(async () => {
    setIsSaving(true);
    await saveProgress(saveStateRef.current);
    setIsSaving(false);
  }, []);

  const loadSlotIntoState = useCallback((slot: {
    currentAct: number;
    currentSceneId: string;
    choices?: Record<string, string>;
    affection?: Record<string, number>;
  }) => {
    saveStateRef.current = {
      ...saveStateRef.current,
      actNumber: slot.currentAct,
      sceneId:   slot.currentSceneId,
      choices:   slot.choices   ?? {},
      affection: slot.affection ?? {},
    };
  }, []);

  return { saveStateRef, savedFlash, isSaving, handleManualSave, onSceneAdvance, exitSave, loadSlotIntoState };
}