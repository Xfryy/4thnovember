"use client";

import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  signInWithGoogle,
  updateCharacterName,
  getUserProfile,
  signOut,
} from "@/lib/firebase";
import { useGameStore } from "@/store/gameStore";
import { audioManager } from "@/lib/Audiomanager";
import { loadProgress } from "@/lib/saveSystem";
import { readSlot, AUTO_SAVE_SLOT, SaveSlot } from "@/lib/saveSlots";
import type { SaveData } from "@/types/game";
import {
  getCachedProfile,
  setCachedProfile,
  getCachedAutoSlot,
  setCachedAutoSlot,
  getCachedSaveData,
  setCachedSaveData,
  clearUserCache,
} from "@/lib/Sessioncache";

import LoadingScreen      from "../StartMenu/components/Loadingscreen";
import LoginScreen        from "../StartMenu/components/Loginscreen";
import CharacterNameInput from "../StartMenu/components/Characternameinput";
import MainMenu           from "../StartMenu/components/Mainmenu";

interface StartMenuProps {
  onGameStart?: (act?: number, sceneId?: string) => void | Promise<void>;
}

export default function StartMenu({ onGameStart }: StartMenuProps) {
  const {
    user,
    setUser,
    setLoading,
    characterName,
    setCharacterName,
    setCharacterNameSet,
    isLoading,
  } = useGameStore();

  const [showCharacterInput, setShowCharacterInput] = useState(false);
  const [saveData,     setSaveData]     = useState<SaveData | null>(null);
  const [autoSaveSlot, setAutoSaveSlot] = useState<SaveSlot | null>(null);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const email = firebaseUser.email || "";

        // ── STEP 1: Apply cache INSTANTLY ─────────────────────────────────
        // Zero Firestore wait — user sees their menu in <100ms if returning user
        const cachedProfile  = getCachedProfile(uid);
        const cachedAutoSlot = getCachedAutoSlot(uid);
        const cachedSaveData = getCachedSaveData(uid);

        if (cachedProfile) {
          setUser({
            uid,
            email: cachedProfile.email || email,
            characterName: cachedProfile.characterName,
            createdAt: Date.now(),
            lastPlayed: Date.now(),
          });
          setCharacterName(cachedProfile.characterName);

          if (cachedProfile.characterName) {
            setCharacterNameSet(true);
            setShowCharacterInput(false);
          } else {
            setShowCharacterInput(true);
          }

          if (cachedAutoSlot) setAutoSaveSlot(cachedAutoSlot);
          if (cachedSaveData) setSaveData(cachedSaveData);

          // Show menu IMMEDIATELY — no spinner for returning users
          setLoading(false);
        }

        // ── STEP 2: Sync Firestore in background ──────────────────────────
        // Runs in parallel — doesn't block the UI that was shown from cache
        try {
          const [profile, save, slot0] = await Promise.all([
            getUserProfile(uid),
            loadProgress(),
            readSlot(uid, AUTO_SAVE_SLOT),
          ]);

          const characterNameFromDB = profile?.characterName || "";

          const userData = {
            uid,
            email,
            characterName: characterNameFromDB,
            createdAt: profile?.createdAt || Date.now(),
            lastPlayed: profile?.lastPlayed || Date.now(),
          };

          // Silently update state with fresh Firestore data
          setUser(userData);
          setCharacterName(characterNameFromDB);

          if (characterNameFromDB) {
            setCharacterNameSet(true);
            setShowCharacterInput(false);
          } else {
            // Only show input if really no name (not just cache miss)
            if (!cachedProfile?.characterName) setShowCharacterInput(true);
          }

          // Update save state — won't cause visual flash since menu is already shown
          if (save) {
            setSaveData(save);
            setCachedSaveData(uid, save);
          }

          // Critical: update autoSaveSlot from Firestore
          // If slot0 exists and differs from cache, update — this keeps "Continue" accurate
          if (slot0) {
            setAutoSaveSlot(slot0);
            setCachedAutoSlot(uid, slot0);
          }

          // Keep profile cache fresh
          setCachedProfile(uid, { uid, email, characterName: characterNameFromDB });

        } catch (error) {
          console.error("Background Firestore sync error:", error);
          // Cache data is still showing — graceful degradation
        }

        // First-time user (no cache) — Firestore done, turn off loading
        if (!cachedProfile) setLoading(false);

      } else {
        // Logged out state
        setUser(null);
        setCharacterNameSet(false);
        setShowCharacterInput(false);
        setSaveData(null);
        setAutoSaveSlot(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    audioManager.resume();
    setLoading(true);
    try {
      await signInWithGoogle();
      // onAuthStateChanged handles everything after login
    } catch (error) {
      console.error("Login error:", error);
      alert("Login gagal. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleSetCharacterName = async (name: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateCharacterName(user.uid, name);
      setCharacterName(name);
      setCharacterNameSet(true);
      setShowCharacterInput(false);
      // Update cache immediately
      setCachedProfile(user.uid, { uid: user.uid, email: user.email, characterName: name });
    } catch (error) {
      console.error("Error setting character name:", error);
      alert("Gagal menetapkan nama karakter. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (user) clearUserCache(user.uid);
      await signOut();
      setUser(null);
      setCharacterName("");
      setCharacterNameSet(false);
      setShowCharacterInput(false);
      setSaveData(null);
      setAutoSaveSlot(null);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  /** Start brand-new game */
  const handleStartNewGame = () => {
    audioManager.resume();
    onGameStart?.(1, undefined);
  };

  /** Continue from auto-save (slot 0) */
  const handleContinue = () => {
    audioManager.resume();
    if (autoSaveSlot) {
      onGameStart?.(autoSaveSlot.currentAct, autoSaveSlot.currentSceneId);
    } else if (saveData) {
      onGameStart?.(saveData.currentAct, saveData.currentSceneId);
    } else {
      handleStartNewGame();
    }
  };

  /** Load from a specific manual save slot */
  const handleLoadSlot = (slot: SaveSlot) => {
    audioManager.resume();
    onGameStart?.(slot.currentAct, slot.currentSceneId);
  };

  const handleSettings = () => {};

  // ── Render ─────────────────────────────────────────────────────────────────

  // Only show full loading screen on very first visit (no cache, no user resolved yet)
  if (isLoading && !user) return <LoadingScreen />;
  if (!user)              return <LoginScreen isLoading={isLoading} onLogin={handleLogin} />;
  if (showCharacterInput) return <CharacterNameInput isLoading={isLoading} onSubmit={handleSetCharacterName} />;

  return (
    <MainMenu
      characterName={characterName}
      email={user.email}
      isLoading={isLoading}
      saveData={saveData}
      autoSaveSlot={autoSaveSlot}
      onStartNew={handleStartNewGame}
      onContinue={handleContinue}
      onLoadSlot={handleLoadSlot}
      onSettings={handleSettings}
      onLogout={handleLogout}
    />
  );
}