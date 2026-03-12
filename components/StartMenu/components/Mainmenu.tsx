"use client";

import { useState } from "react";
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

  const hasPlayed = !!autoSaveSlot;
  const isAdmin   = email === ADMIN_EMAIL;

  const handleSettingsClick = () => {
    setShowSettings(true);
    onSettings();
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">

      <GameBackground />

      {/* Top-right: Announcement + Profile Card + Admin Button */}
      <div className="absolute top-5 right-5 z-30 flex flex-col items-end gap-2">

        {/* Row: bell + profile */}
        <div className="flex items-center gap-2">
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

        {/* Admin button — only visible for admin account */}
        {isAdmin && (
          <button
            onClick={() => console.log("Admin page — implement navigation here")}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background:    "rgba(15, 10, 35, 0.65)",
              border:        "1px solid rgba(234,179,8,0.45)",
              backdropFilter:"blur(12px)",
              boxShadow:     "0 4px 20px rgba(234,179,8,0.2)",
              color:         "#eab308",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(234,179,8,0.45)";
              e.currentTarget.style.borderColor = "rgba(234,179,8,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(234,179,8,0.2)";
              e.currentTarget.style.borderColor = "rgba(234,179,8,0.45)";
            }}
          >
            <span>🛡</span>
            <span>Admin Page</span>
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

      {/* 3-column layout: Menu | Calendar | Character */}
      <div className="absolute inset-0 z-20 flex items-stretch" style={{ paddingBottom: 40 }}>

        {/* LEFT — Menu Buttons (32%) */}
        <div className="flex-none flex items-center justify-center" style={{ width: "32%" }}>
          <div className="w-full px-10 md:px-14">
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
        <div className="flex-none flex items-center justify-center" style={{ width: "36%" }}>
          <div className="w-full max-w-sm" style={{
            filter: "drop-shadow(0 0 32px rgba(236, 72, 153, 0.2))"
          }}>
            <Calendar />
          </div>
        </div>

        {/* RIGHT — Character Sprite (32%) */}
        <div className="flex-none flex items-end justify-center" style={{ width: "32%" }}>
          <div className="relative w-full" style={{ height: "90vh" }}>
            <CharacterSprite animated />
          </div>
        </div>

      </div>

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