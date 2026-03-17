"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import GalleryModal from "../components/GalleryModal";
import LegalWarningModal from "../components/LegalWarningModal";

const ADMIN_EMAIL = "faricandra5@gmail.com";

interface MainMenuProps {
  characterName: string;
  email: string;
  unlockedCharacters?: string[];
  unlockedCGs?: string[];
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
  unlockedCharacters = [],
  unlockedCGs = [],
  isLoading,
  autoSaveSlot,
  onStartNew,
  onContinue,
  onLoadSlot,
  onSettings,
  onLogout,
  onNameChange,
}: MainMenuProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showSaves,    setShowSaves]    = useState(false);
  const [showGallery,  setShowGallery]  = useState(false);
  const [displayName,  setDisplayName]  = useState(characterName);
  const [windowWidth,  setWindowWidth]  = useState(1200);
  const [windowHeight, setWindowHeight] = useState(800);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // We need to calculate the *effective* width because if the user is in portrait
    // and LandscapeGuard forces rotation, the effective width is actually the window's height.
    const calculateEffectiveWidth = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return h > w ? h : w; // If portrait, width becomes height due to 90deg rotation
    };

    const calculateEffectiveHeight = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return h > w ? w : h; // If portrait, height becomes width
    };

    const updateDimensions = () => {
      setWindowWidth(calculateEffectiveWidth());
      setWindowHeight(calculateEffectiveHeight());
      document.documentElement.style.setProperty("--vh", `${calculateEffectiveHeight() * 0.01}px`);
    };
    
    updateDimensions(); // trigger once to set --vh

    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, []);

  const hasPlayed = !!autoSaveSlot;
  const isAdmin   = email === ADMIN_EMAIL;
  
  // Ambil state 'unlockedCharacters' dari profil global (System Save)
  const isRinUnlocked = unlockedCharacters.includes("rin");

  // LAYOUT LOGIC BASED ON ASPECT RATIO
  // True Mobile (Portrait) only if effectiveHeight > effectiveWidth
  // But wait! LandscapeGuard already forces effectiveWidth > effectiveHeight.
  // So 'isMobile' (vertical stack) should ONLY trigger if the user's screen is somehow
  // still physically tall, OR if they are on a very tiny resolution.
  // Let's ensure that if w > h (landscape), we NEVER use the vertical mobile layout.
  
  const isLandscape = windowWidth > windowHeight;
  const isPhoneLandscape = isLandscape && windowHeight < 640;
  const isMobile = !isLandscape && windowWidth < 600 && !isPhoneLandscape;
  const isTablet = (isLandscape && windowWidth < 1024) || isPhoneLandscape;

  const handleSettingsClick = () => {
    setShowSettings(true);
    onSettings();
  };

  if (!mounted) return null;

  return (
    <div 
      className="w-full relative overflow-hidden" 
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <GameBackground />
      <LegalWarningModal />

      {/* Top-right: Announcement + Profile Card + Admin Button */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "calc(10px + env(safe-area-inset-top))" : "calc(20px + env(safe-area-inset-top))",
          right: isMobile ? "calc(10px + env(safe-area-inset-right))" : "calc(20px + env(safe-area-inset-right))",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 12 }}>
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
            onClick={() => router.push("/admin")}
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
            height: "calc(var(--vh, 1vh) * 35)",
            flexShrink: 0,
          }}>
            <div style={{ position: "relative", width: 140, height: "100%" }}>
              <CharacterSprite animated isRinUnlocked={isRinUnlocked} />
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
                onGallery={() => setShowGallery(true)}
                onSettings={handleSettingsClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TABLET LAYOUT (Also used for Rotated Phones) ── */}
      {isTablet && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "stretch",
            paddingBottom: windowWidth < 768 ? 20 : 44,
          }}
        >
          {/* LEFT — Menu Buttons (50%) */}
          <div style={{
            flex: "0 0 50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: windowWidth < 768 ? "0 16px" : "0 24px",
          }}>
            <div style={{ width: "100%" }}>
              <MenuButtons
                characterName={displayName}
                hasPlayed={hasPlayed}
                onStart={onStartNew}
                onContinue={onContinue}
                onSaves={() => setShowSaves(true)}
                onGallery={() => setShowGallery(true)}
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
            <div style={{ position: "relative", width: "100%", height: "calc(var(--vh, 1vh) * 85)", maxWidth: windowWidth < 768 ? 300 : "100%" }}>
              <CharacterSprite animated isRinUnlocked={isRinUnlocked} />
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
                onGallery={() => setShowGallery(true)}
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
            <div style={{ position: "relative", width: "100%", height: "calc(var(--vh, 1vh) * 90)" }}>
              <CharacterSprite animated isRinUnlocked={isRinUnlocked} />
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
      
      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        unlockedCGs={unlockedCGs}
      />
    </div>
  );
}