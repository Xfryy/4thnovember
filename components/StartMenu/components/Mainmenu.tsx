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

interface MainMenuProps {
  characterName: string;
  email: string;
  isLoading: boolean;
  saveData: SaveData | null;
  autoSaveSlot: SaveSlot | null;   // slot 0 — tells us if player has played before
  onStartNew: () => void;
  onContinue: () => void;          // load from auto-save (slot 0)
  onLoadSlot: (slot: SaveSlot) => void; // load from any slot
  onSettings: () => void;
  onLogout: () => void;
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
}: MainMenuProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSaves,    setShowSaves]    = useState(false);
  const [displayName,  setDisplayName]  = useState(characterName);

  const hasPlayed = !!autoSaveSlot;

  const handleSettingsClick = () => {
    setShowSettings(true);
    onSettings();
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">

      <GameBackground />

      {/* Top-right: Announcement + Profile Card */}
      <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
        <AnnouncementBell />
        <ProfileCard
          characterName={characterName}
          email={email}
          onLogout={onLogout}
          isLoading={isLoading}
          onNameChange={setDisplayName}
        />
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

      {/* Bottom support banner */}
      <SupportBanner />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Save Slots Modal — load-only from main menu */}
      <SaveSlotsModal
        isOpen={showSaves}
        onClose={() => setShowSaves(false)}
        onLoad={(slot) => {
          setShowSaves(false);
          onLoadSlot(slot);
        }}
      />

    </div>
  );
}