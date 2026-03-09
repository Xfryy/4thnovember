import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    } as any),
  });
}

const db   = getFirestore();
const auth = getAuth();

/**
 * POST /api/save
 * Called by navigator.sendBeacon on beforeunload.
 * Body: SaveData JSON (no auth header available from beacon, so we
 * trust the uid in the body and verify it exists in Firebase Auth).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, currentAct, currentSceneId, choices, affection, playTimeSeconds } = body;

    if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

    // Verify user exists in Auth (lightweight check)
    await auth.getUser(uid);

    await db.collection("saves").doc(uid).set({
      uid,
      currentAct: currentAct ?? 1,
      currentSceneId: currentSceneId ?? "act1_s1",
      choices: choices ?? {},
      affection: affection ?? {},
      playTimeSeconds: playTimeSeconds ?? 0,
      lastSaved: Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/save error:", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
