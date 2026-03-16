import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Firebase Configuration - Update with your credentials
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKey",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "4th-november.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "4th-november",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "4th-november.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:abc123",
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Firebase Auth Functions
export const signInWithGoogle = async () => {
  try {
    // Use popup for authentication - stays on same page
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return await handleUserAfterAuth(user);
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

// Helper function to handle user setup after authentication
const handleUserAfterAuth = async (user: any) => {
  // Check if user document exists, if not create it
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  
  if (!userDocSnap.exists()) {
    // New user - will be prompted to set character name
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      characterName: "",
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      unlockedCharacters: [],
      unlockedCGs: [],
      totalPlayTime: 0,        // seconds
      totalPlays: 0,           // count of saves
    });
  } else {
    // Returning user - update last played
    await updateDoc(userDocRef, {
      lastPlayed: Date.now(),
    });
  }
  
  return user;
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

// Firestore Operations
export const createUserProfile = async (
  uid: string,
  email: string,
  characterName: string
) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, {
    uid,
    email,
    characterName,
    createdAt: Date.now(),
    lastPlayed: Date.now(),
  });
};

export const updateCharacterName = async (uid: string, characterName: string) => {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, {
    characterName,
  });
};

export const unlockCharacterGlobally = async (uid: string, characterId: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const currentUnlocks = Array.isArray(data.unlockedCharacters) ? data.unlockedCharacters : [];
    
    if (!currentUnlocks.includes(characterId)) {
      await updateDoc(userDocRef, {
        unlockedCharacters: [...currentUnlocks, characterId],
      });
    }
  } catch (error) {
    console.error("Error globally unlocking character:", error);
  }
};

export const unlockCGGlobally = async (uid: string, cgUrl: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const currentUnlocks = Array.isArray(data.unlockedCGs) ? data.unlockedCGs : [];
    
    if (!currentUnlocks.includes(cgUrl)) {
      await updateDoc(userDocRef, {
        unlockedCGs: [...currentUnlocks, cgUrl],
      });
    }
  } catch (error) {
    console.error("Error globally unlocking CG:", error);
  }
};

export const updateUserPlaytime = async (uid: string, totalPlayTimeMinutes: number, totalPlays: number) => {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, {
    totalPlayTime: totalPlayTimeMinutes,
    totalPlays: totalPlays,
    lastPlayed: Date.now(),
  });
};

export const getUserProfile = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);
  return userDocSnap.data();
};

// ── Settings Functions (Firestore Persistence) ──────────────────────────────

export interface GameSettings {
  uid: string;
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  brightness: number;
  language: "id" | "en";
  textSpeed: number;
  lastModified: number;
}

export const saveSettings = async (uid: string, settings: Omit<GameSettings, "uid" | "lastModified">) => {
  const settingsDocRef = doc(db, "settings", uid);
  try {
    await setDoc(settingsDocRef, {
      uid,
      ...settings,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Failed to save settings:", error);
    throw error;
  }
};

export const getSettings = async (uid: string): Promise<GameSettings | null> => {
  const settingsDocRef = doc(db, "settings", uid);
  const settingsDocSnap = await getDoc(settingsDocRef);
  return settingsDocSnap.exists() ? (settingsDocSnap.data() as GameSettings) : null;
};

// ── Deprecated: Progress Collection ──────────────────────────────────────────
// NOTE: Game progress is now stored in save_slots collection (slot 0 for auto-save)
// and aggregated playtime in users collection. The old "progress" collection
// is kept for backward compatibility but should not be used for new features.
// 
// To migrate existing data:
// 1. Read from progress/{uid}
// 2. Merge into save_slots/{uid}_s0 (auto-save)
// 3. Delete progress/{uid}

export const getGameProgress = async (uid: string) => {
  const progressDocRef = doc(db, "progress", uid);
  const progressDocSnap = await getDoc(progressDocRef);
  return progressDocSnap.data() || null;
};
