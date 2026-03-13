"use client";

import { useState, useEffect } from "react";
import type { SaveData } from "@/types/game";
import type { SaveSlot } from "@/lib/saveSlots";
import GameBackground from "./GameBackground";
import CharacterSprite from "../components/Charactersprite";
import MenuButtons from "../components/Menubuttons";
import Calendar from "../components/Calendar";
import ProfileCard from "../components/Profilecard";
import AnnouncementBell from "../components/Announcementbell";
import SupportBanner from "../components/Supportbanner";
import SettingsModal from "../components/SettingsModal";
import SaveSlotsModal from "../components/SaveslotsModal";

const ADMIN_EMAIL = "faricandra5@gmail.com";

interface MainMenuProps {
  characterName: string;
  email: string;
  isLoading: boolean;
  saveData: SaveData | null;
  autoSaveSlot: SaveSlot | null;
  onStartNew: () => void;
  onContinue: () => void;
  onLoadSlot: (slot: SaveSlot) => void;
  onSettings: () => void;
  onLogout: () => void;
  onNameChange?: (newName: string) => void;
}

export default function MainMenu({
  characterName,
  email,
  isLoading,
  autoSaveSlot,
  onStartNew,
  onContinue,
  onLoadSlot,
  onSettings,
  onLogout,
  onNameChange,
}: MainMenuProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSaves,    setShowSaves]    = useState(false);
  const [displayName,  setDisplayName]  = useState(characterName);
  const [windowWidth,  setWindowWidth]  = useState(1200);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasPlayed = !!autoSaveSlot;
  const isAdmin   = email === ADMIN_EMAIL;

  const isMobile  = windowWidth < 768;
  const isTablet  = windowWidth >= 768 && windowWidth < 1024;

  const handleSettingsClick = () => {
    setShowSettings(true);
    onSettings();
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <GameBackground />

      {/* Top-right: Announcement + Profile Card + Admin Button */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 10 : 20,
          right: isMobile ? 10 : 20,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 8 }}>
          <AnnouncementBell />
          <ProfileCard
            characterName={characterName}
            email={email}
            onLogout={onLogout}
            isLoading={isLoading}
            onNameChange={(newName) => {
              setDisplayName(newName);
              onNameChange?.(newName);
            }}
          />
        </div>

        {isAdmin && (
          <button
            onClick={() => console.log("Admin page — implement navigation here")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 12,
              padding: isMobile ? "6px 10px" : "8px 14px",
              fontSize: isMobile ? "0.7rem" : "0.85rem",
              fontWeight: 700,
              background:    "rgba(15, 10, 35, 0.65)",
              border:        "1px solid rgba(234,179,8,0.45)",
              backdropFilter:"blur(12px)",
              boxShadow:     "0 4px 20px rgba(234,179,8,0.2)",
              color:         "#eab308",
              cursor: "pointer",
            }}
          >
            <span>🛡</span>
            <span>Admin</span>
            <span style={{
              fontSize: "9px",
              background: "rgba(234,179,8,0.2)",
              border: "1px solid rgba(234,179,8,0.4)",
              borderRadius: "4px",
              padding: "1px 5px",
            }}>ADMIN</span>
          </button>
        )}
      </div>

      {/* ── MOBILE LAYOUT ── */}
      {isMobile && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 60,
            paddingBottom: 50,
          }}
        >
          {/* Character sprite - compact at top */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 16,
            height: "35vh",
            flexShrink: 0,
          }}>
            <div style={{ position: "relative", width: 140, height: "100%" }}>
              <CharacterSprite animated />
            </div>
          </div>

          {/* Menu buttons - scrollable bottom area */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            padding: "0 20px 8px",
            overflowY: "auto",
          }}>
            <div style={{ width: "100%" }}>
              <MenuButtons
                characterName={displayName}
                hasPlayed={hasPlayed}
                onStart={onStartNew}
                onContinue={onContinue}
                onSaves={() => setShowSaves(true)}
                onSettings={handleSettingsClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TABLET LAYOUT ── */}
      {isTablet && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "stretch",
            paddingBottom: 44,
          }}
        >
          {/* LEFT — Menu Buttons (50%) */}
          <div style={{
            flex: "0 0 50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}>
            <div style={{ width: "100%" }}>
              <MenuButtons
                characterName={displayName}
                hasPlayed={hasPlayed}
                onStart={onStartNew}
                onContinue={onContinue}
                onSaves={() => setShowSaves(true)}
                onSettings={handleSettingsClick}
              />
            </div>
          </div>

          {/* RIGHT — Character Sprite (50%) */}
          <div style={{
            flex: "0 0 50%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}>
            <div style={{ position: "relative", width: "100%", height: "85vh" }}>
              <CharacterSprite animated />
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP LAYOUT ── */}
      {!isMobile && !isTablet && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "stretch",
            paddingBottom: 40,
          }}
        >
          {/* LEFT — Menu Buttons (32%) */}
          <div style={{
            flex: "0 0 32%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ width: "100%", padding: "0 40px 0 56px" }}>
              <MenuButtons
                characterName={displayName}
                hasPlayed={hasPlayed}
                onStart={onStartNew}
                onContinue={onContinue}
                onSaves={() => setShowSaves(true)}
                onSettings={handleSettingsClick}
              />
            </div>
          </div>

          {/* CENTER — Calendar (36%) */}
          <div style={{
            flex: "0 0 36%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "100%",
              maxWidth: 380,
              filter: "drop-shadow(0 0 32px rgba(236, 72, 153, 0.2))",
            }}>
              <Calendar />
            </div>
          </div>

          {/* RIGHT — Character Sprite (32%) */}
          <div style={{
            flex: "0 0 32%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}>
            <div style={{ position: "relative", width: "100%", height: "90vh" }}>
              <CharacterSprite animated />
            </div>
          </div>
        </div>
      )}

      <SupportBanner />

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <SaveSlotsModal
        isOpen={showSaves}
        onClose={() => setShowSaves(false)}
        onLoad={(slot) => { setShowSaves(false); onLoadSlot(slot); }}
      />
    </div>
  );
}