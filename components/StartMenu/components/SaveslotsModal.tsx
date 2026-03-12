"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { SaveSlot, AUTO_SAVE_SLOT, TOTAL_SLOTS } from "@/lib/saveSlots";
import { auth } from "@/lib/firebase";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SaveSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (slotId: number) => Promise<void>;
  onLoad?: (slot: SaveSlot) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatPlayTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${pad2(m)}:${pad2(s)}`;
  return `${pad2(m)}:${pad2(s)}`;
}
function pad2(n: number) { return String(n).padStart(2, "0"); }

// ── Slot Row — proper VN style ─────────────────────────────────────────────────

interface SlotRowProps {
  slotId: number;
  slot: SaveSlot | null;
  isLoading: boolean;
  isSaving: boolean;
  mode: "load" | "save";
  isActive: boolean;           // highlighted (selected / hovered)
  onSelect: () => void;
  onLoad: () => void;
  onSave: () => void;
  onDelete: () => void;
}

function SlotRow({
  slotId, slot, isLoading, isSaving, mode,
  isActive, onSelect, onLoad, onSave, onDelete,
}: SlotRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isAuto    = slotId === AUTO_SAVE_SLOT;
  const isEmpty   = !slot;
  const isWorking = isLoading || isSaving;

  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  const slotLabel = isAuto ? "AUTO" : `${slotId}`;

  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        gap: 0,
        height: "auto",
        minHeight: 80,
        borderRadius: 10,
        overflow: "hidden",
        border: isActive
          ? isAuto
            ? "1.5px solid rgba(236,72,153,0.8)"
            : "1.5px solid rgba(139,92,246,0.7)"
          : "1.5px solid rgba(255,255,255,0.06)",
        background: isActive
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.015)",
        cursor: isEmpty && mode === "load" ? "default" : "pointer",
        transition: "border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
        boxShadow: isActive
          ? isAuto
            ? "0 0 20px rgba(236,72,153,0.15), inset 0 0 0 1px rgba(236,72,153,0.08)"
            : "0 0 20px rgba(139,92,246,0.15), inset 0 0 0 1px rgba(139,92,246,0.06)"
          : "none",
        flexShrink: 0,
      }}
    >
      {/* ── Slot number tab (left strip) ── */}
      <div style={{
        width: 40,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        background: isAuto
          ? isActive
            ? "linear-gradient(180deg, rgba(236,72,153,0.35), rgba(168,85,247,0.25))"
            : "linear-gradient(180deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))"
          : isActive
          ? "rgba(139,92,246,0.2)"
          : "rgba(139,92,246,0.07)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.15s ease",
      }}>
        <span style={{
          fontSize: isAuto ? "0.4rem" : "0.8rem",
          fontWeight: 900,
          letterSpacing: isAuto ? "0.1em" : "0",
          color: isAuto
            ? (isActive ? "#ec4899" : "rgba(236,72,153,0.6)")
            : (isActive ? "#c4b5fd" : "rgba(139,92,246,0.5)"),
          lineHeight: 1,
          transition: "color 0.15s ease",
        }}>
          {slotLabel}
        </span>
        {isAuto && (
          <div style={{
            width: 4, height: 4, borderRadius: "50%",
            background: isActive ? "#ec4899" : "rgba(236,72,153,0.3)",
            transition: "background 0.15s ease",
          }} />
        )}
      </div>

      {/* ── Screenshot preview ── */}
      <div style={{
        width: 60,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        background: "#06020f",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}>
        {slot?.previewImage ? (
          <>
            {slot.previewImage.startsWith('data:') ? (
              // Data URL (screenshot) — use regular img tag
              <img
                src={slot.previewImage}
                alt="save preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  opacity: 0.85,
                  display: 'block',
                }}
              />
            ) : (
              // URL image (sprite) — use Next.js Image component
              <Image
                src={slot.previewImage}
                alt="save preview"
                fill
                sizes="60px"
                style={{ objectFit: "cover", objectPosition: "top center", opacity: 0.85 }}
              />
            )}
            {/* Subtle vignette */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, transparent 60%, rgba(6,2,15,0.6))",
            }} />
          </>
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem",
            color: "rgba(139,92,246,0.12)",
          }}>
            {isEmpty ? "✦" : "🎭"}
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "8px 10px",
        minWidth: 0,
      }}>
        {isEmpty ? (
          /* ── Empty state ── */
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center", gap: 6,
          }}>
            <p style={{
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.12)",
              fontStyle: "italic",
              letterSpacing: "0.08em",
            }}>
              — No Data —
            </p>
            {mode === "save" && (
              <button
                onClick={(e) => { e.stopPropagation(); onSave(); }}
                disabled={isWorking}
                style={{
                  alignSelf: "flex-start",
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: isWorking ? "not-allowed" : "pointer",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "#a5b4fc",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.3)";
                  e.currentTarget.style.color = "#c7d2fe";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.15)";
                  e.currentTarget.style.color = "#a5b4fc";
                }}
              >
                {isSaving ? "Saving…" : "+ New Save"}
              </button>
            )}
          </div>
        ) : (
          /* ── Filled state ── */
          <>
            {/* Top row: scene label + act badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{
                fontSize: "0.5rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: isAuto ? "#ec4899" : "rgba(167,139,250,0.7)",
                whiteSpace: "nowrap",
              }}>
                {slot?.sceneLabel ?? `Act ${slot?.currentAct}`}
              </span>
              {isAuto && (
                <span style={{
                  fontSize: "0.4rem", fontWeight: 900,
                  letterSpacing: "0.12em",
                  padding: "1px 4px",
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #ec4899, #a855f7)",
                  color: "#fff",
                }}>AUTO</span>
              )}
            </div>

            {/* Preview text */}
            <p style={{
              fontSize: "0.65rem",
              color: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.55)",
              lineHeight: 1.5,
              letterSpacing: "0.02em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              margin: 0,
              flex: 1,
              transition: "color 0.15s ease",
            }}>
              {slot?.previewText || "—"}
            </p>

            {/* Bottom row: date + time */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 4,
              flexWrap: "wrap",
            }}>
              <span style={{
                fontSize: "0.45rem",
                color: "rgba(107,70,193,0.65)",
                letterSpacing: "0.05em",
                fontFamily: "monospace",
              }}>
                {formatDate(slot!.lastSaved)}
              </span>
              <span style={{
                fontSize: "0.45rem",
                color: "rgba(107,70,193,0.5)",
                letterSpacing: "0.05em",
                fontFamily: "monospace",
              }}>
                {formatPlayTime(slot!.playTimeSeconds)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Action buttons (right side) — only for filled slots ── */}
      {!isEmpty && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "8px 8px 8px 0",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {/* Primary: Load / Save */}
          {mode === "load" ? (
            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onLoad(); }}
              disabled={isWorking}
              color="#ec4899"
              label={isLoading ? "…" : "LOAD"}
              primary
            />
          ) : (
            <ActionBtn
              onClick={(e) => { e.stopPropagation(); onSave(); }}
              disabled={isWorking}
              color="#a855f7"
              label={isSaving ? "…" : "SAVE"}
              primary
            />
          )}

          {/* Delete (manual slots only) */}
          {!isAuto && (
            confirmDelete ? (
              <ActionBtn
                onClick={(e) => { e.stopPropagation(); onDelete(); setConfirmDelete(false); }}
                color="#ef4444"
                label="OK?"
                danger
              />
            ) : (
              <ActionBtn
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                color="#6b6b6b"
                label="🗑"
                small
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

// ── Micro action button ────────────────────────────────────────────────────────

function ActionBtn({
  onClick, disabled, color, label, primary, danger, small,
}: {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  color: string;
  label: string;
  primary?: boolean;
  danger?: boolean;
  small?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: primary ? "4px 10px" : small ? "3px 6px" : "3px 8px",
        borderRadius: 5,
        fontSize: primary ? "0.55rem" : "0.5rem",
        fontWeight: 800,
        letterSpacing: "0.14em",
        cursor: disabled ? "not-allowed" : "pointer",
        border: `1px solid ${hov ? color + "cc" : color + "55"}`,
        background: hov
          ? danger
            ? `rgba(239,68,68,0.25)`
            : `${color}25`
          : "rgba(0,0,0,0.3)",
        color: hov ? "#fff" : `${color}cc`,
        transition: "all 0.12s ease",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.4 : 1,
        minWidth: primary ? 50 : 28,
        textAlign: "center",
      }}
    >
      {label}
    </button>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────

export default function SaveSlotsModal({ isOpen, onClose, onSave, onLoad }: SaveSlotsModalProps) {
  const [slots,       setSlots]       = useState<(SaveSlot | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const [fetching,    setFetching]    = useState(false);
  const [loadingSlot, setLoadingSlot] = useState<number | null>(null);
  const [savingSlot,  setSavingSlot]  = useState<number | null>(null);
  const [activeSlot,  setActiveSlot]  = useState<number | null>(null);

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

  useEffect(() => { if (isOpen) fetchSlots(); }, [isOpen, fetchSlots]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

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
    setSlots(prev => { const n = [...prev]; n[slotId] = null; return n; });
  };

  // Split auto-save from manual slots
  const autoSlot  = slots[AUTO_SAVE_SLOT];
  const manualSlots = Array.from({ length: TOTAL_SLOTS - 1 }, (_, i) => i + 1);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(12px)",
          animation: "sm-bg 0.25s ease both",
        }}
      />

      {/* ── Panel — outer div only handles centering, never animated ── */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          width: "min(600px, calc(100vw - 24px))",
          maxHeight: "min(700px, calc(100vh - 40px))",
          /* No animation here — transform must never be overridden */
        }}
      >
      {/* inner div gets the scale/fade animation — no transform conflict */}
      <div
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "min(700px, calc(100vh - 40px))",
          display: "flex",
          flexDirection: "column",
          borderRadius: 14,
          overflow: "hidden",
          background: "rgba(8, 4, 20, 0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(236,72,153,0.12)",
          animation: "sm-in 0.28s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* ── Top accent bar ── */}
        <div style={{
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, #ec4899 25%, #a855f7 60%, #6366f1 85%, transparent 100%)",
          flexShrink: 0,
        }} />

        {/* ── Header ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
          gap: 10,
        }}>
          {/* Mode icon */}
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
            background: mode === "save"
              ? "rgba(168,85,247,0.15)"
              : "rgba(236,72,153,0.15)",
            border: mode === "save"
              ? "1px solid rgba(168,85,247,0.3)"
              : "1px solid rgba(236,72,153,0.3)",
          }}>
            {mode === "save" ? "💾" : "📂"}
          </div>

          <div>
            <h2 style={{
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#fff",
            }}>
              {mode === "save" ? "Save Game" : "Load Game"}
            </h2>
            <p style={{
              margin: 0,
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(167,139,250,0.45)",
              marginTop: 1,
            }}>
              {mode === "save" ? "Select slot to save" : "Select slot to load"}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              width: 28, height: 28, borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Slot list ── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}>
          {fetching ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 10, minHeight: 200,
            }}>
              <div style={{
                width: 26, height: 26,
                border: "2px solid rgba(236,72,153,0.15)",
                borderTopColor: "#ec4899",
                borderRadius: "50%",
                animation: "sm-spin 0.8s linear infinite",
              }} />
              <p style={{
                fontSize: "0.6rem",
                color: "rgba(167,139,250,0.4)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}>
                Loading saves…
              </p>
            </div>
          ) : (
            <>
              {/* ── AUTO SAVE (slot 0) ── */}
              <SlotRow
                slotId={AUTO_SAVE_SLOT}
                slot={autoSlot}
                isLoading={loadingSlot === AUTO_SAVE_SLOT}
                isSaving={savingSlot === AUTO_SAVE_SLOT}
                mode={mode}
                isActive={activeSlot === AUTO_SAVE_SLOT}
                onSelect={() => setActiveSlot(AUTO_SAVE_SLOT)}
                onLoad={() => handleLoad(AUTO_SAVE_SLOT)}
                onSave={() => handleSave(AUTO_SAVE_SLOT)}
                onDelete={() => handleDelete(AUTO_SAVE_SLOT)}
              />

              {/* Divider */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "4px 2px",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                <span style={{
                  fontSize: "0.45rem", letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "rgba(107,70,193,0.4)",
                }}>
                  Manual
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              </div>

              {/* ── MANUAL SLOTS ── */}
              {manualSlots.map(i => (
                <SlotRow
                  key={i}
                  slotId={i}
                  slot={slots[i]}
                  isLoading={loadingSlot === i}
                  isSaving={savingSlot === i}
                  mode={mode}
                  isActive={activeSlot === i}
                  onSelect={() => setActiveSlot(i)}
                  onLoad={() => handleLoad(i)}
                  onSave={() => handleSave(i)}
                  onDelete={() => handleDelete(i)}
                />
              ))}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "8px 14px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <p style={{
            fontSize: "0.48rem",
            color: "rgba(107,70,193,0.35)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: 0,
          }}>
            {TOTAL_SLOTS - 1} manual slots
          </p>
          <button
            onClick={onClose}
            style={{
              padding: "4px 15px",
              borderRadius: 6,
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.22)",
              color: "rgba(196,181,253,0.7)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(139,92,246,0.22)";
              e.currentTarget.style.color = "#c4b5fd";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(139,92,246,0.12)";
              e.currentTarget.style.color = "rgba(196,181,253,0.7)";
            }}
          >
            Close
          </button>
        </div>
      </div>  {/* ← close inner animated div */}
      </div>  {/* ← close outer positioning wrapper */}

      <style>{`
        @keyframes sm-bg  { from{opacity:0} to{opacity:1} }
        @keyframes sm-in  {
          from { opacity:0; transform:scale(0.95) translateY(6px); }
          to   { opacity:1; transform:scale(1)    translateY(0);   }
        }
        @keyframes sm-spin{ to{transform:rotate(360deg)} }
        
        @media (max-width: 480px) {
          .sm-in {
            animation-duration: 0.2s;
          }
        }
      `}</style>
    </>
  );
}