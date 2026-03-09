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
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
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
      });
    } else {
      // Returning user - update last played
      await updateDoc(userDocRef, {
        lastPlayed: Date.now(),
      });
    }
    
    return user;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
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

export const getUserProfile = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);
  return userDocSnap.data();
};

export const saveGameProgress = async (
  uid: string,
  act: number,
  scene: number,
  choices: Record<string, any>
) => {
  const progressDocRef = doc(db, "progress", uid);
  await setDoc(progressDocRef, {
    uid,
    currentAct: act,
    currentScene: scene,
    choices,
    lastUpdated: Date.now(),
  });
};

export const getGameProgress = async (uid: string) => {
  const progressDocRef = doc(db, "progress", uid);
  const progressDocSnap = await getDoc(progressDocRef);
  return progressDocSnap.data() || null;
};
