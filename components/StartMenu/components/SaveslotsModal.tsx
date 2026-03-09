"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { SaveSlot, readAllSlots, clearSlot, AUTO_SAVE_SLOT, TOTAL_SLOTS } from "@/lib/saveSlots";
import { auth } from "@/lib/firebase";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SaveSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided, clicking a slot SAVES to it (in-game mode). Otherwise it LOADS. */
  onSave?: (slotId: number) => Promise<void>;
  /** Called when player wants to LOAD from a slot */
  onLoad?: (slot: SaveSlot) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatPlayTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ── Slot Card ──────────────────────────────────────────────────────────────────

interface SlotCardProps {
  slotId: number;
  slot: SaveSlot | null;
  isLoading: boolean;
  isSaving: boolean;
  mode: "load" | "save";
  onLoad: () => void;
  onSave: () => void;
  onDelete: () => void;
}

function SlotCard({ slotId, slot, isLoading, isSaving, mode, onLoad, onSave, onDelete }: SlotCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isAuto     = slotId === AUTO_SAVE_SLOT;
  const isEmpty    = !slot;
  const isWorking  = isLoading || isSaving;

  // Auto-reset confirm state
  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        borderRadius: 14,
        border: isAuto
          ? "1px solid rgba(236,72,153,0.45)"
          : isEmpty
          ? "1px dashed rgba(139,92,246,0.2)"
          : "1px solid rgba(139,92,246,0.3)",
        background: isAuto
          ? "rgba(236,72,153,0.06)"
          : isEmpty
          ? "rgba(255,255,255,0.02)"
          : "rgba(139,92,246,0.06)",
        padding: "10px 12px",
        transition: "all 0.2s ease",
        minHeight: 88,
      }}
    >
      {/* ── Preview Image ── */}
      <div
        style={{
          width: 64,
          height: 88,
          borderRadius: 10,
          overflow: "hidden",
          flexShrink: 0,
          background: isEmpty
            ? "rgba(255,255,255,0.04)"
            : "linear-gradient(160deg, #1a0a2e, #0a0618)",
          border: "1px solid rgba(236,72,153,0.15)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {slot?.previewImage ? (
          <Image
            src={slot.previewImage}
            alt="preview"
            fill
            sizes="64px"
            style={{ objectFit: "cover", objectPosition: "top", opacity: 0.9 }}
          />
        ) : (
          <div style={{
            fontSize: isEmpty ? 22 : 18,
            opacity: 0.25,
          }}>
            {isEmpty ? "✦" : "🎭"}
          </div>
        )}

        {/* Auto badge */}
        {isAuto && !isEmpty && (
          <div style={{
            position: "absolute",
            bottom: 3, left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.45rem",
            fontWeight: 900,
            letterSpacing: "0.15em",
            color: "#fff",
            background: "linear-gradient(135deg, #ec4899, #a855f7)",
            borderRadius: 4,
            padding: "2px 5px",
            whiteSpace: "nowrap",
          }}>
            AUTO
          </div>
        )}
      </div>

      {/* ── Slot Info ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <div>
          {/* Slot label */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{
              fontSize: "0.6rem",
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: isAuto ? "#ec4899" : "rgba(196,181,253,0.5)",
            }}>
              {isAuto ? "✦ Auto Save" : `Slot ${slotId}`}
            </span>
            {!isEmpty && slot && (
              <span style={{
                fontSize: "0.55rem",
                color: "rgba(107,70,193,0.7)",
                letterSpacing: "0.08em",
              }}>
                {slot.sceneLabel ?? `Act ${slot.currentAct}`}
              </span>
            )}
          </div>

          {/* Preview text or empty state */}
          {isEmpty ? (
            <p style={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.15)",
              fontStyle: "italic",
              letterSpacing: "0.05em",
            }}>
              — empty —
            </p>
          ) : (
            <p style={{
              fontSize: "0.7rem",
              color: "rgba(196,181,253,0.8)",
              lineHeight: 1.4,
              letterSpacing: "0.02em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              marginBottom: 4,
            }}>
              {slot!.previewText || "…"}
            </p>
          )}

          {/* Date + playtime */}
          {slot && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: "0.55rem", color: "rgba(107,70,193,0.7)" }}>
                🕐 {formatDate(slot.lastSaved)}
              </span>
              <span style={{ fontSize: "0.55rem", color: "rgba(107,70,193,0.7)" }}>
                ⏱ {formatPlayTime(slot.playTimeSeconds)}
              </span>
            </div>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {/* Load / Save primary action */}
          {mode === "load" && !isEmpty && (
            <button
              onClick={onLoad}
              disabled={isWorking}
              style={{
                flex: 1,
                padding: "5px 10px",
                borderRadius: 8,
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                cursor: isWorking ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(168,85,247,0.3))",
                border: "1px solid rgba(236,72,153,0.4)",
                color: "#f9a8d4",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(236,72,153,0.5), rgba(168,85,247,0.5))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(168,85,247,0.3))";
              }}
            >
              {isLoading ? "Loading..." : "▶ Load"}
            </button>
          )}

          {mode === "save" && (
            <button
              onClick={onSave}
              disabled={isWorking}
              style={{
                flex: 1,
                padding: "5px 10px",
                borderRadius: 8,
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                cursor: isWorking ? "not-allowed" : "pointer",
                background: isEmpty
                  ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))"
                  : "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(168,85,247,0.3))",
                border: `1px solid ${isEmpty ? "rgba(99,102,241,0.4)" : "rgba(236,72,153,0.4)"}`,
                color: isEmpty ? "#a5b4fc" : "#f9a8d4",
                transition: "all 0.15s ease",
              }}
            >
              {isSaving ? "Saving..." : isEmpty ? "+ New Save" : "💾 Overwrite"}
            </button>
          )}

          {/* Delete — only for non-auto, non-empty manual slots */}
          {!isAuto && !isEmpty && (
            confirmDelete ? (
              <button
                onClick={() => { onDelete(); setConfirmDelete(false); }}
                style={{
                  padding: "5px 8px",
                  borderRadius: 8,
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  background: "rgba(239,68,68,0.3)",
                  border: "1px solid rgba(239,68,68,0.5)",
                  color: "#fca5a5",
                  animation: "pulse-red 0.4s ease",
                }}
              >
                Sure?
              </button>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  padding: "5px 8px",
                  borderRadius: 8,
                  fontSize: "0.6rem",
                  cursor: "pointer",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "rgba(252,165,165,0.5)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                  e.currentTarget.style.color = "#fca5a5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                  e.currentTarget.style.color = "rgba(252,165,165,0.5)";
                }}
              >
                🗑
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────

export default function SaveSlotsModal({ isOpen, onClose, onSave, onLoad }: SaveSlotsModalProps) {
  const [slots, setSlots]               = useState<(SaveSlot | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const [fetching, setFetching]         = useState(false);
  const [loadingSlot, setLoadingSlot]   = useState<number | null>(null);
  const [savingSlot, setSavingSlot]     = useState<number | null>(null);

  const mode: "load" | "save" = onSave ? "save" : "load";

  const fetchSlots = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    setFetching(true);
    try {
      const { readAllSlots } = await import("@/lib/saveSlots");
      const result = await readAllSlots(user.uid);
      setSlots(result);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchSlots();
  }, [isOpen, fetchSlots]);

  if (!isOpen) return null;

  const handleLoad = async (slotId: number) => {
    const slot = slots[slotId];
    if (!slot || !onLoad) return;
    setLoadingSlot(slotId);
    onLoad(slot);
    setLoadingSlot(null);
    onClose();
  };

  const handleSave = async (slotId: number) => {
    if (!onSave) return;
    setSavingSlot(slotId);
    await onSave(slotId);
    setSavingSlot(null);
    await fetchSlots();
  };

  const handleDelete = async (slotId: number) => {
    const user = auth.currentUser;
    if (!user) return;
    const { clearSlot } = await import("@/lib/saveSlots");
    await clearSlot(user.uid, slotId);
    setSlots((prev) => {
      const next = [...prev];
      next[slotId] = null;
      return next;
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "88vh",
          borderRadius: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "rgba(10, 6, 25, 0.98)",
          border: "1px solid rgba(236,72,153,0.25)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(236,72,153,0.08)",
          animation: "modal-in 0.25s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Top accent */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)", flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid rgba(236,72,153,0.1)",
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(236,72,153,0.12)",
            border: "1px solid rgba(236,72,153,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            {mode === "save" ? "💾" : "📂"}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: "1rem", margin: 0 }}>
              {mode === "save" ? "Save Game" : "Load Game"}
            </p>
            <p style={{ color: "rgba(167,139,250,0.6)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              {mode === "save" ? "Choose a slot to save" : "Choose a slot to load"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.9rem", cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          >
            ✕
          </button>
        </div>

        {/* Slot list */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          {fetching ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <div style={{
                fontSize: "0.7rem",
                color: "rgba(167,139,250,0.5)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                animation: "pulse 1.5s ease infinite",
              }}>
                Loading saves...
              </div>
            </div>
          ) : (
            Array.from({ length: TOTAL_SLOTS }, (_, i) => (
              <SlotCard
                key={i}
                slotId={i}
                slot={slots[i]}
                isLoading={loadingSlot === i}
                isSaving={savingSlot === i}
                mode={mode}
                onLoad={() => handleLoad(i)}
                onSave={() => handleSave(i)}
                onDelete={() => handleDelete(i)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "10px 20px",
          borderTop: "1px solid rgba(236,72,153,0.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <p style={{ fontSize: "0.6rem", color: "rgba(107,70,193,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Slot 0 = Auto Save &nbsp;·&nbsp; Slots 1–9 = Manual
          </p>
          <button
            onClick={onClose}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#c4b5fd",
              fontSize: "0.7rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity:0; transform:scale(0.94) translateY(12px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes pulse {
          0%,100% { opacity:0.5; }
          50%      { opacity:1;   }
        }
        @keyframes pulse-red {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.05); }
        }
      `}</style>
    </div>
  );
}