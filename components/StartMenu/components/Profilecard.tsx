"use client";

import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";

interface ProfileCardProps {
  characterName: string;
  email: string;
  onLogout: () => void;
  isLoading: boolean;
}

interface UserStats {
  totalPlays: number;
  totalPlayTime: number; // in minutes
}

export default function ProfileCard({
  characterName,
  email,
  onLogout,
  isLoading,
}: ProfileCardProps) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<UserStats>({ totalPlays: 0, totalPlayTime: 0 });
  const [discordLinked, setDiscordLinked] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const db = getFirestore();
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setStats({
            totalPlays: data.totalPlays ?? 0,
            totalPlayTime: data.totalPlayTime ?? 0,
          });
        }
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      }
    };
    if (open) fetchStats();
  }, [open]);

  // Avatar initial
  const initial = characterName?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      {/* ── Profile pill button (top-right) ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all hover:scale-105 active:scale-95"
        style={{
          background: "rgba(15, 10, 35, 0.65)",
          border: "1px solid rgba(236,72,153,0.35)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(236,72,153,0.15)",
        }}
      >
        {/* Name */}
        <div className="text-right hidden sm:block">
          <p
            className="text-sm font-bold leading-none mb-0.5 max-w-[120px] truncate"
            style={{
              background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {characterName}
          </p>
          <p className="text-xs text-purple-400 leading-none">
            ⏱ {stats.totalPlayTime}m &nbsp;·&nbsp; 🏆 {stats.totalPlays}
          </p>
        </div>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-base flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #ec4899, #a855f7)",
            boxShadow: "0 0 12px rgba(236,72,153,0.5)",
          }}
        >
          {initial}
        </div>
      </button>

      {/* ── Modal overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden"
            style={{
              background: "rgba(12, 8, 28, 0.95)",
              border: "1px solid rgba(236,72,153,0.25)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(236,72,153,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)" }}
            />

            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(236,72,153,0.1)" }}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)" }}
              >
                <span style={{ fontSize: 18 }}>👤</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none mb-0.5">Profile Settings</p>
                <p className="text-purple-400 text-xs tracking-widest uppercase">Profile</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-purple-400 hover:text-white transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 flex flex-col gap-5">

              {/* Name + edit hint */}
              <div className="text-center">
                <h2 className="text-white font-black text-xl leading-tight mb-1">
                  {characterName}
                </h2>
                <p className="text-purple-400 text-xs tracking-widest uppercase">Profile Settings</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.15)" }}
                >
                  <span className="text-2xl block mb-1">🏆</span>
                  <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">Total Plays</p>
                  <p className="text-white font-black text-2xl">{stats.totalPlays}</p>
                </div>
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
                >
                  <span className="text-2xl block mb-1">⏱</span>
                  <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">Total Play Time</p>
                  <p className="text-white font-black text-2xl">{stats.totalPlayTime}m</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Email</p>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="text-purple-400">✉</span>
                  <span className="text-white text-sm flex-1 truncate">{email}</span>
                  <span style={{ color: "#22c55e", fontSize: 16 }}>✓</span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                ⎋ &nbsp;Logout
              </button>

              {/* Footer */}
              <p className="text-center text-purple-700 text-xs tracking-widest uppercase">
                4th November Profile System
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}