"use client";

import { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, updateCharacterName } from "@/lib/firebase";

interface ProfileCardProps {
  characterName: string;
  email: string;
  onLogout: () => void;
  isLoading: boolean;
  onNameChange?: (newName: string) => void;
}

interface UserStats { totalPlays: number; totalPlayTime: number; }

const DEFAULT_STATS: UserStats = { totalPlays: 0, totalPlayTime: 0 };

/** Format playtime in minutes to human-readable format (e.g., "2h 30m" or "45m") */
function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function ProfileCard({ characterName, email, onLogout, isLoading, onNameChange }: ProfileCardProps) {
  const [open,  setOpen]  = useState(false);
  const [displayName, setDisplayName] = useState(characterName);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(characterName);
  const [isSavingName, setIsSavingName] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── Fetch user stats from Firestore ──────────────────────────────────────
  const fetchStats = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const snap = await getDoc(doc(getFirestore(), "users", user.uid));
      if (!snap.exists()) return;
      const d = snap.data();
      setStats({
        totalPlays:    d.totalPlays    ?? 0,
        totalPlayTime: d.totalPlayTime ?? 0,
      });
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    }
  };

  // ── Fetch on component mount and setup auto-refresh every 1 minute ────────
  useEffect(() => {
    // Fetch immediately when component mounts
    fetchStats();

    // Setup interval to refresh every 60 seconds
    intervalRef.current = setInterval(() => {
      fetchStats();
    }, 60000); // 1 minute = 60000ms

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // ── Additional fetch when modal opens ────────────────────────────────────
  useEffect(() => {
    if (open) {
      fetchStats();
    }
  }, [open]);
  // ── Update editedName and displayName when characterName changes ─────────
  useEffect(() => {
    setEditedName(characterName);
    setDisplayName(characterName);
  }, [characterName]);

  // ── Save character name to Firestore ─────────────────────────────────────
  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setEditedName(characterName);
      setIsEditingName(false);
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      setIsSavingName(true);
      await updateCharacterName(user.uid, editedName.trim());
      // Update display immediately and notify parent
      setDisplayName(editedName.trim());
      onNameChange?.(editedName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating character name:", error);
      setEditedName(characterName);
    } finally {
      setIsSavingName(false);
    }
  };

  // ── Cancel edit and revert to original ────────────────────────────────────
  const handleCancelEdit = () => {
    setEditedName(characterName);
    setIsEditingName(false);
  };
  const initial = displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      {/* ── Profile pill ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 sm:gap-3 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 transition-all hover:scale-105 active:scale-95"
        style={{
          background:    "rgba(15, 10, 35, 0.65)",
          border:        "1px solid rgba(236,72,153,0.35)",
          backdropFilter:"blur(12px)",
          boxShadow:     "0 4px 20px rgba(236,72,153,0.15)",
        }}
      >
        <div className="text-right hidden sm:block max-w-[150px] md:max-w-xs" style={{ minWidth: 0 }}>
          <p className="text-xs md:text-sm font-bold leading-none mb-0.5 truncate"
            style={{
              background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >{displayName}</p>
          <p className="text-[10px] md:text-xs text-purple-400 leading-none whitespace-nowrap">
            🏆 {stats.totalPlays} &nbsp;·&nbsp; ⏱ {formatPlaytime(stats.totalPlayTime)}
          </p>
        </div>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-white text-sm md:text-base flex-shrink-0"
          style={{ background:"linear-gradient(135deg, #ec4899, #a855f7)", boxShadow:"0 0 12px rgba(236,72,153,0.5)" }}
        >{initial}</div>
      </button>

      {/* ── Modal — only mounted when open ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden"
            style={{
              background: "rgba(12, 8, 28, 0.95)",
              border:     "1px solid rgba(236,72,153,0.25)",
              boxShadow:  "0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(236,72,153,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full" style={{ background:"linear-gradient(90deg, #ec4899, #a855f7, #6366f1)" }} />

            <div className="flex items-center gap-3 px-4 sm:px-6 pt-5 pb-4 border-b" style={{ borderColor:"rgba(236,72,153,0.1)" }}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:"rgba(236,72,153,0.15)", border:"1px solid rgba(236,72,153,0.3)" }}>
                <span style={{ fontSize:16 }}>👤</span>
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm leading-none mb-0.5">Profile</p>
                <p className="text-purple-400 text-[10px] sm:text-xs tracking-widest uppercase">4th November</p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-purple-400 hover:text-white transition-colors text-base sm:text-lg">✕</button>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
              {/* Name section with edit capability */}
              <div className="text-center">
                {isEditingName ? (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter your name..."
                      autoFocus
                      maxLength={32}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg text-center font-black text-base sm:text-lg text-white"
                      style={{
                        background: "rgba(236,72,153,0.1)",
                        border: "1px solid rgba(236,72,153,0.3)",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(236,72,153,0.6)";
                        e.currentTarget.style.background = "rgba(236,72,153,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(236,72,153,0.3)";
                        e.currentTarget.style.background = "rgba(236,72,153,0.1)";
                      }}
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSaveName}
                        disabled={isSavingName}
                        className="px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all"
                        style={{
                          background: "rgba(34,197,94,0.2)",
                          border: "1px solid rgba(34,197,94,0.5)",
                          color: "#22c55e",
                          cursor: isSavingName ? "not-allowed" : "pointer",
                          opacity: isSavingName ? 0.6 : 1,
                        }}
                      >
                        {isSavingName ? "Saving..." : "✓ Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSavingName}
                        className="px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all"
                        style={{
                          background: "rgba(239,68,68,0.2)",
                          border: "1px solid rgba(239,68,68,0.5)",
                          color: "#f87171",
                          cursor: isSavingName ? "not-allowed" : "pointer",
                          opacity: isSavingName ? 0.6 : 1,
                        }}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-white font-black text-lg sm:text-xl leading-tight">{displayName}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 rounded-lg transition-all hover:scale-110 active:scale-95"
                      style={{
                        background: "rgba(236,72,153,0.1)",
                        border: "1px solid rgba(236,72,153,0.25)",
                        color: "#ec4899",
                        cursor: "pointer",
                      }}
                      title="Edit name"
                    >
                      ✎
                    </button>
                  </div>
                )}
                <p className="text-purple-400 text-[10px] sm:text-xs tracking-widest uppercase mt-2">Player Profile</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { icon:"🏆", label:"Total Sessions", value: stats.totalPlays, color:"rgba(236,72,153,0.08)", border:"rgba(236,72,153,0.15)" },
                  { icon:"⏱", label:"Total Play Time", value: formatPlaytime(stats.totalPlayTime), color:"rgba(99,102,241,0.08)", border:"rgba(99,102,241,0.15)" },
                ].map(({ icon, label, value, color, border }) => (
                  <div key={label} className="rounded-2xl p-3 sm:p-4 text-center"
                    style={{ background:color, border:`1px solid ${border}` }}>
                    <span className="text-xl sm:text-2xl block mb-1">{icon}</span>
                    <p className="text-purple-400 text-[10px] sm:text-xs tracking-widest uppercase mb-1">{label}</p>
                    <p className="text-white font-black text-xl sm:text-2xl">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-purple-400 text-[10px] sm:text-xs tracking-widest uppercase mb-2">Email</p>
                <div className="flex items-center gap-3 rounded-xl px-3 sm:px-4 py-2 sm:py-3"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-purple-400 text-sm">✉</span>
                  <span className="text-white text-xs sm:text-sm flex-1 truncate">{email}</span>
                  <span style={{ color:"#22c55e", fontSize:14 }}>✓</span>
                </div>
              </div>

              <button
                onClick={() => { setOpen(false); onLogout(); }}
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171" }}
              >
                ⎋ &nbsp;Logout
              </button>

              <p className="text-center text-purple-700 text-[10px] sm:text-xs tracking-widest uppercase">
                4th November Profile System
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}