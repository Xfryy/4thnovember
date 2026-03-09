"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, updateCharacterName, getUserProfile, signOut } from "@/lib/firebase";
import { useGameStore } from "@/store/gameStore";

import LoadingScreen       from "../StartMenu/components/Loadingscreen";
import LoginScreen         from "../StartMenu/components//Loginscreen";
import CharacterNameInput  from "../StartMenu/components/Characternameinput";
import MainMenu            from "../StartMenu/components/Mainmenu";

export default function StartMenu() {
  const {
    user,
    setUser,
    setAuthenticated,
    setLoading,
    characterName,
    setCharacterName,
    setCharacterNameSet,
    isLoading,
  } = useGameStore();

  const [showCharacterInput, setShowCharacterInput] = useState(false);

  // ── Auth listener ──────────────────────────────────────────────
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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setCharacterName, setCharacterNameSet, setLoading]);

  // ── Handlers ───────────────────────────────────────────────────
  const handleLogin = async () => {
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

  const handleStartGame = () => {
    // TODO: Navigate to Act 1, Scene 1
    console.log("Starting game with character:", characterName);
  };

  const handleSaves = () => {
    // TODO: Open saves screen
    console.log("Opening saves...");
  };

  const handleSettings = () => {
    // TODO: Open settings screen
    console.log("Opening settings...");
  };

  // ── Render ─────────────────────────────────────────────────────
  if (isLoading)           return <LoadingScreen />;
  if (!user)               return <LoginScreen isLoading={isLoading} onLogin={handleLogin} />;
  if (showCharacterInput)  return <CharacterNameInput isLoading={isLoading} onSubmit={handleSetCharacterName} />;

  return (
    <MainMenu
      characterName={characterName}
      isLoading={isLoading}
      onStart={handleStartGame}
      onSaves={handleSaves}
      onSettings={handleSettings}
      onLogout={handleLogout}
    />
  );
}