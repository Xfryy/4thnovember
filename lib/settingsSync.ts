/**
 * settingsSync.ts
 *
 * ── Firestore Settings Persistence ──
 * 
 * Syncs game settings between:
 *   1. Local Zustand Store + localStorage (fast, offline-first)
 *   2. Firestore "settings/{uid}" (backup, cross-device sync)
 * 
 * Usage:
 *   - On app init: loadSettingsFromFirestore() → populate Zustand
 *   - On setting change: auto-sync via setupSettingsSync()
 *   - On logout/tab close: flushSettings() → save immediately
 */

import { auth, getSettings, saveSettings, GameSettings } from "@/lib/firebase";
import { useSettingsStore, Settings } from "@/store/Settingsstore";

// ── Load from Firestore ────────────────────────────────────────────────────────

/**
 * Load settings from Firestore into Zustand store.
 * Called on app initialization after user login.
 * 
 * Flow:
 *   1. Fetch settings/{uid} from Firestore
 *   2. If exists, merge into Zustand (Firestore is server truth)
 *   3. If not exists, use localStorage default (new user)
 *   4. Sync back to Firestore on next change
 */
export async function loadSettingsFromFirestore(): Promise<Settings | null> {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ loadSettingsFromFirestore: No user logged in");
    return null;
  }

  try {
    const firestoreSettings = await getSettings(user.uid);
    
    if (firestoreSettings) {
      // Update store with Firestore values (server-of-truth)
      const { updateSetting } = useSettingsStore.getState();
      
      Object.entries(firestoreSettings).forEach(([key, value]) => {
        if (key !== "uid" && key !== "lastModified") {
          updateSetting(key as keyof Settings, value);
        }
      });

      console.log("✅ Loaded settings from Firestore:", firestoreSettings);
      return firestoreSettings as Settings;
    } else {
      console.log("ℹ️ No settings in Firestore (new user), using localStorage default");
      // Settings already loaded from localStorage, sync them to Firestore
      await flushSettings();
      return null;
    }
  } catch (error) {
    console.error("❌ Failed to load settings from Firestore:", error);
    // Gracefully continue with localStorage settings
    return null;
  }
}

// ── Save to Firestore (Debounced) ──────────────────────────────────────────────

let settingsSyncTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced sync to Firestore (3 seconds).
 * Called on every setting change via store subscription.
 */
function debouncedSyncSettings(): void {
  if (settingsSyncTimer) {
    clearTimeout(settingsSyncTimer);
  }

  settingsSyncTimer = setTimeout(() => {
    flushSettings();
  }, 3000);
}

/**
 * Immediately write settings to Firestore.
 * Use for critical moments: logout, tab close, manual sync.
 */
export async function flushSettings(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ flushSettings: No user logged in");
    return;
  }

  try {
    const settings = useSettingsStore.getState();
    
    const settingsData = {
      masterVolume: settings.masterVolume,
      bgmVolume: settings.bgmVolume,
      sfxVolume: settings.sfxVolume,
      voiceVolume: settings.voiceVolume,
      brightness: settings.brightness,
      language: settings.language,
      textSpeed: settings.textSpeed,
    };

    await saveSettings(user.uid, settingsData);
    console.log("✅ Settings synced to Firestore");
  } catch (error) {
    console.error("❌ Failed to sync settings to Firestore:", error);
  }
}

// ── Setup Auto-Sync ───────────────────────────────────────────────────────────

/**
 * Setup Zustand subscription to auto-sync settings on change.
 * Call this once in your app initialization (e.g., after login).
 * 
 * Returns unsubscribe function for cleanup.
 */
export function setupSettingsSync(): () => void {
  // Subscribe to all changes in the settings store
  const unsubscribe = useSettingsStore.subscribe(() => {
    // This callback fires on every state change
    debouncedSyncSettings();
  });

  console.log("📝 Settings auto-sync enabled");

  return unsubscribe;
}

// ── Cleanup ────────────────────────────────────────────────────────────────────

/**
 * Call on user logout or app shutdown.
 * Flushes any pending debounced sync and cleans up listeners.
 */
export function cleanupSettingsSync(): Promise<void> {
  if (settingsSyncTimer) {
    clearTimeout(settingsSyncTimer);
    settingsSyncTimer = null;
  }
  
  // Immediate flush on cleanup
  return flushSettings();
}

// ── Export types ───────────────────────────────────────────────────────────────

export type { Settings, GameSettings };
