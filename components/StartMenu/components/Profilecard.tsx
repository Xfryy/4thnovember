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

function formatPlaytime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function ProfileCard({ characterName, email, onLogout, isLoading, onNameChange }: ProfileCardProps) {
  const [open,          setOpen]          = useState(false);
  const [displayName,   setDisplayName]   = useState(characterName);
  const [stats,         setStats]         = useState<UserStats>(DEFAULT_STATS);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName,    setEditedName]    = useState(characterName);
  const [isSavingName,  setIsSavingName]  = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStats = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const snap = await getDoc(doc(getFirestore(), "users", user.uid));
      if (!snap.exists()) return;
      const d = snap.data();
      setStats({ totalPlays: d.totalPlays ?? 0, totalPlayTime: d.totalPlayTime ?? 0 });
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    intervalRef.current = setInterval(fetchStats, 60000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => { if (open) fetchStats(); }, [open]);

  useEffect(() => {
    setEditedName(characterName);
    setDisplayName(characterName);
  }, [characterName]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSaveName = async () => {
    if (!editedName.trim()) { setEditedName(characterName); setIsEditingName(false); return; }
    const user = auth.currentUser;
    if (!user) return;
    try {
      setIsSavingName(true);
      await updateCharacterName(user.uid, editedName.trim());
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

  const handleCancelEdit = () => { setEditedName(characterName); setIsEditingName(false); };
  const initial = displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      {/* ── Profile pill ── */}
      <button
        onClick={() => setOpen(true)}
        className="profile-pill-btn"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 16,
          padding: "7px 10px",
          background: "rgba(15, 10, 35, 0.65)",
          border: "1px solid rgba(236,72,153,0.35)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(236,72,153,0.15)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          minWidth: 54,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {/* Name + stats — hidden on very small screens */}
        <div style={{
          textAlign: "right",
          display: "none",
          minWidth: 0,
        }}
          className="profile-pill-text"
        >
          <p style={{
            margin: 0,
            fontSize: "0.8rem",
            fontWeight: 800,
            lineHeight: 1.2,
            background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>{displayName}</p>
          <p style={{
            margin: 0,
            fontSize: "0.65rem",
            color: "#a855f7",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}>
            🏆 {stats.totalPlays} · ⏱ {formatPlaytime(stats.totalPlayTime)}
          </p>
        </div>
        {/* Avatar */}
        <div style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          color: "white",
          fontSize: "0.9rem",
          flexShrink: 0,
          background: "linear-gradient(135deg, #ec4899, #a855f7)",
          boxShadow: "0 0 12px rgba(236,72,153,0.5)",
        }} className="profile-pill-avatar">{initial}</div>
      </button>

      {/* ── Inline style to show pill text on sm+ ── */}
      <style>{`
        @media (min-width: 480px) {
          .profile-pill-text { display: block !important; }
        }
        @media (min-width: 768px) {
          .profile-pill-btn {
            padding: 8px 12px !important;
            gap: 10px !important;
          }
          .profile-pill-avatar {
            width: 38px !important;
            height: 38px !important;
            font-size: 1rem !important;
          }
        }
        @media (min-width: 1024px) {
          /* Desktop polish: make pill roomier and easier to read */
          .profile-pill-text p:first-child { max-width: 220px !important; }
          .profile-pill-btn {
            padding: 10px 14px !important;
            gap: 12px !important;
          }
          .profile-pill-avatar {
            width: 42px !important;
            height: 42px !important;
            font-size: 1.05rem !important;
          }
        }
      `}</style>

      {/* ── Modal ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100, // Background overlay
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            // On larger screens, center vertically
            padding: 0,
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              .profile-modal-positioner {
                align-items: center !important;
                padding: 24px !important;
              }
              .profile-modal-panel {
                border-radius: 24px !important;
                max-height: calc(100% - 48px) !important;
              }
            }
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes fadeScale {
              from { transform: scale(0.95); opacity: 0; }
              to   { transform: scale(1);    opacity: 1; }
            }
          `}</style>

          {/* Positioner — bottom sheet on mobile, centered on desktop */}
          <div
            className="profile-modal-positioner"
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: 0,
              zIndex: 101, // Panel itself
            }}
            onClick={() => setOpen(false)}
          >
            <div
              className="profile-modal-panel"
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 480,
                maxHeight: "90%",
                overflowY: "auto",
                background: "rgba(12, 8, 28, 0.98)",
                border: "1px solid rgba(236,72,153,0.2)",
                borderBottom: "none",
                borderRadius: "20px 20px 0 0",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 0 40px rgba(236,72,153,0.08)",
                animation: "slideUp 0.32s cubic-bezier(0.22,1,0.36,1) both",
                /* Custom scrollbar */
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(236,72,153,0.3) transparent",
              }}
            >
              {/* Top gradient bar */}
              <div style={{
                height: 3,
                background: "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)",
                borderRadius: "20px 20px 0 0",
              }} />

              {/* Drag handle (mobile visual hint) */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px 0 4px",
              }}>
                <div style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.15)",
                }} />
              </div>

              {/* Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 20px 14px",
                borderBottom: "1px solid rgba(236,72,153,0.1)",
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(236,72,153,0.15)",
                  border: "1px solid rgba(236,72,153,0.3)",
                  flexShrink: 0,
                  fontSize: 16,
                }}>👤</div>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.3 }}>Profile</p>
                  <p style={{ margin: 0, color: "#a855f7", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>4th November</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    marginLeft: "auto",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                    e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
                    e.currentTarget.style.color = "#f87171";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >✕</button>
              </div>

              {/* Body */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 18 }}>

                {/* ── Name section ── */}
                <div style={{ textAlign: "center" }}>
                  {isEditingName ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <input
                        type="text"
                        value={editedName}
                        onChange={e => setEditedName(e.target.value)}
                        placeholder="Enter your name..."
                        autoFocus
                        maxLength={32}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: 10,
                          textAlign: "center",
                          fontWeight: 900,
                          fontSize: "1.1rem",
                          color: "#fff",
                          background: "rgba(236,72,153,0.1)",
                          border: "1.5px solid rgba(236,72,153,0.4)",
                          outline: "none",
                          /* Larger touch target */
                          minHeight: 48,
                          boxSizing: "border-box",
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = "rgba(236,72,153,0.7)";
                          e.currentTarget.style.background = "rgba(236,72,153,0.15)";
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = "rgba(236,72,153,0.4)";
                          e.currentTarget.style.background = "rgba(236,72,153,0.1)";
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleSaveName}
                          disabled={isSavingName}
                          style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: 10,
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: isSavingName ? "not-allowed" : "pointer",
                            opacity: isSavingName ? 0.6 : 1,
                            background: "rgba(34,197,94,0.15)",
                            border: "1px solid rgba(34,197,94,0.45)",
                            color: "#22c55e",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {isSavingName ? "Saving..." : "✓ Save"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSavingName}
                          style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: 10,
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: isSavingName ? "not-allowed" : "pointer",
                            opacity: isSavingName ? 0.6 : 1,
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.45)",
                            color: "#f87171",
                            transition: "all 0.15s ease",
                          }}
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <h2 style={{
                        margin: 0,
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "clamp(1.1rem, 5vw, 1.4rem)",
                        lineHeight: 1.2,
                        wordBreak: "break-word",
                        maxWidth: "calc(100% - 52px)",
                      }}>
                        {displayName}
                      </h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: "rgba(236,72,153,0.1)",
                          border: "1px solid rgba(236,72,153,0.25)",
                          color: "#ec4899",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          flexShrink: 0,
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(236,72,153,0.2)";
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(236,72,153,0.1)";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        title="Edit name"
                      >✎</button>
                    </div>
                  )}
                  <p style={{
                    margin: "8px 0 0",
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(167,139,250,0.5)",
                  }}>Player Profile</p>
                </div>

                {/* ── Stats grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    {
                      icon: "🏆",
                      label: "Sessions",
                      value: String(stats.totalPlays),
                      bg: "rgba(236,72,153,0.07)",
                      border: "rgba(236,72,153,0.15)",
                    },
                    {
                      icon: "⏱",
                      label: "Play Time",
                      value: formatPlaytime(stats.totalPlayTime),
                      bg: "rgba(99,102,241,0.07)",
                      border: "rgba(99,102,241,0.15)",
                    },
                  ].map(({ icon, label, value, bg, border }) => (
                    <div key={label} style={{
                      borderRadius: 14,
                      padding: "14px 12px",
                      textAlign: "center",
                      background: bg,
                      border: `1px solid ${border}`,
                    }}>
                      <span style={{ fontSize: 22, display: "block", marginBottom: 4 }}>{icon}</span>
                      <p style={{
                        margin: "0 0 4px",
                        fontSize: "0.55rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(167,139,250,0.5)",
                      }}>{label}</p>
                      <p style={{
                        margin: 0,
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: "clamp(1.1rem, 5vw, 1.5rem)",
                        lineHeight: 1,
                      }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* ── Email ── */}
                <div>
                  <p style={{
                    margin: "0 0 6px",
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(167,139,250,0.5)",
                  }}>Email</p>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 10,
                    padding: "11px 14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <span style={{ color: "#a855f7", fontSize: 14, flexShrink: 0 }}>✉</span>
                    <span style={{
                      color: "#fff",
                      fontSize: "0.8rem",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}>{email}</span>
                    <span style={{ color: "#22c55e", fontSize: 14, flexShrink: 0 }}>✓</span>
                  </div>
                </div>

                {/* ── Logout button ── */}
                <button
                  onClick={() => { setOpen(false); onLogout(); }}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                    transition: "all 0.15s ease",
                    /* Minimum touch target */
                    minHeight: 48,
                  }}
                  onMouseEnter={e => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                      e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                    e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                  }}
                >
                  ⎋ &nbsp;Logout
                </button>

                {/* ── Footer text ── */}
                <p style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(107,70,193,0.4)",
                  paddingBottom: 4,
                }}>
                  4th November Profile System
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}