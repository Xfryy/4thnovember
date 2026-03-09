"use client";

import { useState, useEffect } from "react";
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
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            characterName: profile?.characterName || "",
            createdAt: profile?.createdAt || Date.now(),
            lastPlayed: profile?.lastPlayed || Date.now(),
          };
          setUser(userData);
          setCharacterName(userData.characterName);

          // Load legacy save + auto-save slot in parallel
          const [save, slot0] = await Promise.all([
            loadProgress(),
            readSlot(firebaseUser.uid, AUTO_SAVE_SLOT),
          ]);
          setSaveData(save);
          setAutoSaveSlot(slot0);

          if (userData.characterName) {
            setCharacterNameSet(true);
            setShowCharacterInput(false);
          } else {
            setShowCharacterInput(true);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        setUser(null);
        setCharacterNameSet(false);
        setShowCharacterInput(false);
        setSaveData(null);
        setAutoSaveSlot(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setCharacterName, setCharacterNameSet, setLoading]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    audioManager.resume();
    setLoading(true);
    try {
      await signInWithGoogle();
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
      await signOut();
      setUser(null);
      setCharacterName("");
      setCharacterNameSet(false);
      setShowCharacterInput(false);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  /** Start brand-new game — always act 1, first scene */
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
      // Fallback to legacy save
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

  const handleSettings = () => console.log("Opening settings...");

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading)          return <LoadingScreen />;
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