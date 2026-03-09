"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/Settingsstore";
import { audioManager } from "@/lib/Audiomanager";

/**
 * SettingsProvider
 *
 * Wraps the entire game and:
 * 1. Applies brightness as a CSS filter on the root wrapper
 * 2. Syncs all volume settings to the AudioManager whenever they change
 * 3. Exposes --text-speed-ms as a CSS custom property for dialogue components
 *
 * Add to app/layout.tsx around {children}.
 */
export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const brightness    = useSettingsStore((s) => s.brightness);
  const masterVolume  = useSettingsStore((s) => s.masterVolume);
  const bgmVolume     = useSettingsStore((s) => s.bgmVolume);
  const sfxVolume     = useSettingsStore((s) => s.sfxVolume);
  const voiceVolume   = useSettingsStore((s) => s.voiceVolume);
  const textSpeed     = useSettingsStore((s) => s.textSpeed);

  // Sync volumes to Web Audio API whenever settings change
  useEffect(() => { audioManager.setMasterVolume(masterVolume); }, [masterVolume]);
  useEffect(() => { audioManager.setBgmVolume(bgmVolume);       }, [bgmVolume]);
  useEffect(() => { audioManager.setSfxVolume(sfxVolume);       }, [sfxVolume]);
  useEffect(() => { audioManager.setVoiceVolume(voiceVolume);   }, [voiceVolume]);

  // Expose text speed as a CSS variable (ms per character)
  // Dialogue components can use: style={{ animationDuration: `var(--text-speed-ms)` }}
  useEffect(() => {
    const ms = Math.round(110 - textSpeed); // 10→100ms, 100→10ms
    document.documentElement.style.setProperty("--text-speed-ms", `${ms}ms`);
  }, [textSpeed]);

  return (
    <div
      id="settings-brightness-wrapper"
      style={{
        filter: `brightness(${brightness}%)`,
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        // Pass brightness as variable too for components that need it
        // e.g. --brightness: 0.85
        ["--brightness" as string]: `${brightness / 100}`,
      }}
    >
      {children}
    </div>
  );
}