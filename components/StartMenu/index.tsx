"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  signInWithGoogle,
  updateCharacterName,
  getUserProfile,
  signOut,
  updateUserPlaytime,
} from "@/lib/firebase";
import { loadSettingsFromFirestore, setupSettingsSync, cleanupSettingsSync } from "@/lib/settingsSync";
import { useGameStore } from "@/store/gameStore";
import { audioManager } from "@/lib/Audiomanager";
import { loadProgress } from "@/lib/saveSystem";
import { readSlot, AUTO_SAVE_SLOT, SaveSlot, calculateTotalPlaytime } from "@/lib/saveSlots";
import { settingsManager } from "@/lib/settingsManager";
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
    loadSettings,
  } = useGameStore();

  const [showCharacterInput, setShowCharacterInput] = useState(false);
  const [saveData,     setSaveData]     = useState<SaveData | null>(null);
  const [autoSaveSlot, setAutoSaveSlot] = useState<SaveSlot | null>(null);
  const [bgmStarted, setBgmStarted] = useState(false);
  const [settingsSyncUnsubscribe, setSettingsSyncUnsubscribe] = useState<(() => void) | null>(null);

  // ── Initialize settings on mount ──────────────────────────────────────────
  useEffect(() => {
    const savedSettings = settingsManager.loadSettings();
    if (savedSettings) {
      loadSettings(savedSettings);
      // Apply brightness on startup
      document.documentElement.style.filter = `brightness(${savedSettings.brightness}%)`;
      // Apply audio volumes
      audioManager.setMasterVolume(savedSettings.masterVolume);
      audioManager.setBgmVolume(savedSettings.bgmVolume);
      audioManager.setSfxVolume(savedSettings.sfxVolume);
      audioManager.setVoiceVolume(savedSettings.voiceVolume);
    }
  }, [loadSettings]);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User just signed in - play BGM
        if (!bgmStarted) {
          audioManager.playBGM("/audio/start-menu.mp3", 500);
          setBgmStarted(true);
        }
        
        const uid = firebaseUser.uid;
        const email = firebaseUser.email || "";

        // ── STEP 1: Apply cache INSTANTLY ─────────────────────────────────
        // Zero Firestore wait — user sees their menu in <100ms if returning user
        const cachedProfile  = getCachedProfile(uid);
        const cachedAutoSlot = getCachedAutoSlot(uid);
        const cachedSaveData = getCachedSaveData(uid);

        if (cachedProfile) {
          // Show brief loading for returning users too
          setLoading(true);
          
          // ⚠️ REMOVED 800ms delay — was causing character name input flash!
          // Load from cache immediately
          
          setUser({
            uid,
            email: cachedProfile.email || email,
            characterName: cachedProfile.characterName,
            createdAt: Date.now(),
            lastPlayed: Date.now(),
          });
          setCharacterName(cachedProfile.characterName);

          // Character name check: only show input if name is ACTUALLY empty
          if (cachedProfile.characterName && cachedProfile.characterName.trim()) {
            setCharacterNameSet(true);
            setShowCharacterInput(false);
          } else {
            // Will be corrected by Firestore sync below
            setShowCharacterInput(false);
          }

          if (cachedAutoSlot) setAutoSaveSlot(cachedAutoSlot);
          if (cachedSaveData) setSaveData(cachedSaveData);

          // Show menu immediately (no delay)
          setLoading(false);
        } else {
          // New user - show loading while fetching from Firestore
          setLoading(true);
        }

        // ── STEP 2: Sync Firestore in background ──────────────────────────
        // Runs in parallel — doesn't block the UI that was shown from cache
        try {
          const [profile, save, slot0, playtimeStats] = await Promise.all([
            getUserProfile(uid),
            loadProgress(),
            readSlot(uid, AUTO_SAVE_SLOT),
            calculateTotalPlaytime(uid),
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

          // Update user profile with actual total playtime
          if (playtimeStats) {
            await updateUserPlaytime(uid, playtimeStats.totalMinutes, playtimeStats.totalPlays);
          }

          // Keep profile cache fresh
          setCachedProfile(uid, { uid, email, characterName: characterNameFromDB });

          // ── Load settings from Firestore and sync ─────────────────────
          // This loads Firestore settings into Zustand store
          await loadSettingsFromFirestore();

          // Setup auto-sync for any future settings changes
          if (settingsSyncUnsubscribe) {
            settingsSyncUnsubscribe();
          }
          const unsubscribe = setupSettingsSync();
          setSettingsSyncUnsubscribe(() => unsubscribe);

        } catch (error) {
          console.error("Background Firestore sync error:", error);
          // Cache data is still showing — graceful degradation
        }

        // First-time user (no cache) — Firestore done, turn off loading
        if (!cachedProfile) {
          setLoading(false);
        }

      } else {
        // Logged out state
        setUser(null);
        setCharacterNameSet(false);
        setShowCharacterInput(false);
        setSaveData(null);
        setAutoSaveSlot(null);
        setLoading(false);

        // Cleanup settings sync on logout
        if (settingsSyncUnsubscribe) {
          await cleanupSettingsSync();
          settingsSyncUnsubscribe();
          setSettingsSyncUnsubscribe(null);
        }
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // Cleanup settings sync on component unmount
      if (settingsSyncUnsubscribe) {
        cleanupSettingsSync().catch(err => 
          console.error("Error cleaning up settings sync:", err)
        );
        settingsSyncUnsubscribe();
      }
    };
  }, [settingsSyncUnsubscribe]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      // onAuthStateChanged handles everything after login
    } catch (error) {
      console.error("Login error:", error);
      alert("Login gagal. Silakan coba lagi.");
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
      audioManager.stopAll();
      setUser(null);
      setCharacterName("");
      setCharacterNameSet(false);
      setShowCharacterInput(false);
      setSaveData(null);
      setAutoSaveSlot(null);
      setBgmStarted(false);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  /** Start brand-new game */
  const handleStartNewGame = () => {
    // Fade out main menu BGM over 0.5s before transitioning into game
    audioManager.stopBGM(500);
    audioManager.resume();
    onGameStart?.(1, undefined);
  };

  /** Continue from auto-save (slot 0) */
  const handleContinue = () => {
    // Fade out main menu BGM over 0.5s before transitioning into game
    audioManager.stopBGM(500);
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
    // Fade out main menu BGM over 0.5s before transitioning into game
    audioManager.stopBGM(500);
    audioManager.resume();
    onGameStart?.(slot.currentAct, slot.currentSceneId);
  };

  const handleSettings = () => {};

  // ── Refresh save data on mount/focus ───────────────────────────────────────
  // This ensures when user comes back from game, autoSaveSlot is updated
  useEffect(() => {
    if (!user) return;

    const refreshSaveData = async () => {
      try {
        const [saveData, slot0, playtimeStats] = await Promise.all([
          loadProgress(),
          readSlot(user.uid, AUTO_SAVE_SLOT),
          calculateTotalPlaytime(user.uid),
        ]);

        if (saveData) {
          setSaveData(saveData);
          setCachedSaveData(user.uid, saveData);
        }

        if (slot0) {
          setAutoSaveSlot(slot0);
          setCachedAutoSlot(user.uid, slot0);
        }

        // Update user profile with actual total playtime
        if (playtimeStats) {
          await updateUserPlaytime(user.uid, playtimeStats.totalMinutes, playtimeStats.totalPlays);
        }
      } catch (error) {
        console.error("Error refreshing save data:", error);
      }
    };

    // Refresh on component mount/visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshSaveData();
      }
    };

    // Listen to page visibility (tab focus)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also refresh immediately on mount (in case user just came back from game)
    refreshSaveData();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

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