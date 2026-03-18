"use client";

/**
 * GameToolbar — Full VN HUD dengan responsive design
 *
 * Fixes:
 * - REMOVED global touchstart listener that toggled toolbar on every tap
 *   (this was firing on dialogue taps, choice taps, etc — major UX bug)
 * - Replaced with dedicated toggle button visible on mobile
 * - Uses shared useIsMobile hook
 * - Memoized style computations
 */

import { useState, useEffect, useCallback } from "react";
import { useVNControls } from "@/store/Usevncontrols";
import { useIsMobile } from "@/hooks/useIsMobile";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface GameToolbarProps {
  actNumber: number;
  sceneNumber: string | number;
  isSaving: boolean;
  isLoading?: boolean;
  savedFlash: boolean;
  characterName?: string;
  onMenu: () => void;
  onQuickSave: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSettings: () => void;
  onInventory?: () => void;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
  onAdminNavigate?: (direction: 'prev' | 'next') => void;
  onActChange?: (actNumber: number) => void;
  currentSceneId?: string;
  isAdmin?: boolean;
}

export default function GameToolbar({
  actNumber,
  sceneNumber,
  isSaving,
  isLoading,
  savedFlash,
  onMenu,
  onQuickSave,
  onSave,
  onLoad,
  onSettings,
  onInventory,
  isAdminMode = false,
  onToggleAdminMode,
  onAdminNavigate,
  onActChange,
  currentSceneId = '',
  isAdmin = false,
}: GameToolbarProps) {
  const {
    autoPlay, skipMode, hideUI,
    toggleAutoPlay, toggleSkip, toggleHideUI, toggleLog,
  } = useVNControls();

  const isMobile = useIsMobile();
  // On mobile the extended save/config buttons are hidden behind a collapsed state
  const [expanded, setExpanded] = useState(false);
  const [showActSelector, setShowActSelector] = useState(false);
  const [selectedAct, setSelectedAct] = useState<number>(actNumber);
  const [sceneInput, setSceneInput] = useState<string>("");
  const [, setStats] = useState<{ totalPlays: number; totalPlayTime: number }>({
    totalPlays: 0,
    totalPlayTime: 0,
  });


  const fetchStats = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const snap = await getDoc(doc(getFirestore(), "users", user.uid));
      if (!snap.exists()) return;
      const d = snap.data() as any;
      setStats({
        totalPlays: d.totalPlays ?? 0,
        totalPlayTime: d.totalPlayTime ?? 0,
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, 60000);
    return () => clearInterval(t);
  }, [fetchStats]);

  // Collapse when switching to desktop
  useEffect(() => {
    if (!isMobile) setExpanded(false);
  }, [isMobile]);

  // Keyboard shortcuts (desktop only)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.code === "KeyH" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleLog(); }
      if (e.code === "KeyA" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleAutoPlay(); }
      if (e.code === "KeyF" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleSkip(); }
      if (e.code === "KeyV" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleHideUI(); }
      if (e.code === "KeyI" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); onInventory?.(); }
      // Admin mode toggle: Ctrl+Shift+A - Only for admin users
      if (e.code === "KeyA" && e.ctrlKey && e.shiftKey && isAdmin) {
        e.preventDefault();
        onToggleAdminMode?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleAutoPlay, toggleSkip, toggleHideUI, toggleLog, onToggleAdminMode, onInventory, isAdmin]);

  const handleToggleExpand = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // stopPropagation so the tap doesn't also fire dialogue advance
    e.stopPropagation();
    setExpanded((p) => !p);
  }, []);

  const handleActSelect = () => {
    if (!onActChange) return;
    
    // If scene number is specified, jump to that scene
    if (sceneInput.trim()) {
      const sceneNum = parseInt(sceneInput.trim(), 10);
      if (!isNaN(sceneNum) && sceneNum > 0) {
        const sceneId = `act${selectedAct}_s${sceneNum}`;
        // Store scene ID in sessionStorage for GameEngine to pick up
        sessionStorage.setItem("jumpToScene", sceneId);
      }
    }
    
    onActChange(selectedAct);
    setShowActSelector(false);
    setSceneInput("");
  };

  // ── Hidden UI mode ────────────────────────────────────────────────────────
  if (hideUI) {
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 3 : 6,
          padding: isMobile ? "8px 10px" : "10px 14px",
          animation: "hint-in 0.25s ease both",
          flexWrap: "wrap",
        }}>
          {([
            { key: "A", label: "Auto",    color: "#4ade80", action: toggleAutoPlay },
            { key: "F", label: "Skip",    color: "#f59e0b", action: toggleSkip    },
            { key: "H", label: "History", color: "#a5b4fc", action: toggleLog     },
            { key: "V", label: "Show UI", color: "#94a3b8", action: toggleHideUI  },
            { key: "I", label: "Items",   color: "#3b82f6", action: onInventory || (() => {}) },
          ] as const).map(({ key, label, color, action }, i) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: isMobile ? 3 : 5 }}>
              {i > 0 && <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.5rem" }}>·</span>}
              <button
                onClick={(e) => { e.stopPropagation(); action(); }}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: isMobile ? 28 : 18,
                  height: isMobile ? 28 : 18,
                  borderRadius: 4,
                  background: `${color}15`,
                  border: `1px solid ${color}40`,
                  color: color,
                  fontSize: isMobile ? "0.65rem" : "0.6rem",
                  fontWeight: 900,
                  fontFamily: "monospace",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {key}
              </button>
              {!isMobile && (
                <span style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", fontWeight: 600 }}>
                  {label}
                </span>
              )}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes hint-in {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ── Normal toolbar ────────────────────────────────────────────────────────
  return (
    <>
      <div
        // stopPropagation so toolbar taps don't bubble to game scene
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 3 : 5,
          padding: isMobile ? "8px 10px" : "10px 14px",
          background: "linear-gradient(180deg, rgba(4,2,12,0.85) 0%, rgba(4,2,12,0.4) 80%, transparent 100%)",
          backdropFilter: "blur(8px)",
          flexWrap: "nowrap",
          overflowX: isMobile ? "auto" : "visible",
        }}
      >
        {/* Menu */}
        <ToolbarBtn
          onClick={onMenu}
          disabled={isSaving}
          accent="#ec4899"
          icon={isSaving ? "⟳" : "←"}
          spin={isSaving}
          label="Menu"
          compact={isMobile}
        />

        <Divider compact={isMobile} />

        {/* VN Controls — always visible */}
        <ToolbarBtn onClick={toggleAutoPlay} accent="#4ade80" icon="▶" label="Auto" tooltip="Auto [A]" active={autoPlay} compact={isMobile} />
        <ToolbarBtn onClick={toggleSkip}     accent="#f59e0b" icon="⏩" label="Skip" tooltip="Skip [F]" active={skipMode} compact={isMobile} />
        <ToolbarBtn onClick={toggleLog}      accent="#a5b4fc" icon="📜" label="Log"  tooltip="History [H]" compact={isMobile} />
        <ToolbarBtn onClick={toggleHideUI}   accent="#94a3b8" icon="👁" label="Hide" tooltip="Hide [V]" compact={isMobile} />
        <ToolbarBtn onClick={() => onInventory?.()} accent="#3b82f6" icon="🎒" label="Items" tooltip="Inventory [I]" compact={isMobile} />

        {/* Spacer */}
        <div style={{ marginLeft: "auto" }} />

        {/* Admin Navigation - Only visible for admin users */}
        {isAdmin && isAdminMode && (
          <>
            <Divider compact={isMobile} />
            <ToolbarBtn
              onClick={() => onAdminNavigate?.('prev')}
              accent="#ef4444"
              icon="◀"
              label="Prev"
              tooltip="Previous Scene [←]"
              compact={isMobile}
            />
            <ToolbarBtn
              onClick={() => onAdminNavigate?.('next')}
              accent="#22c55e"
              icon="▶"
              label="Next"
              tooltip="Next Scene [→]"
              compact={isMobile}
            />
          </>
        )}

        <Divider compact={isMobile} />

        {/* Admin Mode Toggle - Only visible for admin users */}
        {isAdmin && (
          <ToolbarBtn
            onClick={() => onToggleAdminMode?.()}
            accent={isAdminMode ? "#f97316" : "#6b7280"}
            icon=""
            label="Admin"
            tooltip="Toggle Admin Mode [Ctrl+Shift+A]"
            active={isAdminMode}
            compact={isMobile}
          />
        )}

        {/* Admin Act Selector */}
        {isAdmin && isAdminMode && (
          <>
            <Divider compact={isMobile} />
            <ToolbarBtn
              onClick={() => setShowActSelector(true)}
              accent="#8b5cf6"
              icon="📖"
              label="Act"
              tooltip="Select Act"
              compact={isMobile}
            />
          </>
        )}

        <Divider compact={isMobile} />

        {/* Spacer */}
        <div style={{ flex: 1, minWidth: 0 }} />

        {/* Saved flash */}
        {savedFlash && (
          <span style={{
            fontSize: isMobile ? "0.5rem" : "0.6rem",
            fontWeight: 800,
            color: "#4ade80",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            animation: "tb-flash 1.8s ease both",
            marginRight: 4,
            whiteSpace: "nowrap",
          }}>
            ✓ Saved!
          </span>
        )}

        {/* Act · Scene badge */}
        <div style={{
          padding: isMobile ? "2px 6px" : "3px 10px",
          borderRadius: 6,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          marginRight: 4,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: isMobile ? "0.5rem" : "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", fontWeight: 600 }}>
            ACT {actNumber}
          </span>
          <span style={{ fontSize: isMobile ? "0.5rem" : "0.55rem", color: "rgba(236,72,153,0.5)", letterSpacing: "0.1em", fontWeight: 600, margin: "0 4px" }}>·</span>
          <span style={{ fontSize: isMobile ? "0.5rem" : "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", fontWeight: 600 }}>
            {sceneNumber}
          </span>
        </div>

        {/* Admin Mode - Scene ID Display */}
        {isAdmin && isAdminMode && currentSceneId && (
          <div style={{
            padding: isMobile ? "2px 6px" : "3px 10px",
            borderRadius: 6,
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.3)",
            marginRight: 4,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: isMobile ? "0.5rem" : "0.55rem", color: "#f97316", letterSpacing: "0.1em", fontWeight: 600 }}>
              ID: {currentSceneId}
            </span>
          </div>
        )}

        <Divider compact={isMobile} />

        {/* Save/Load/Config — desktop: always shown; mobile: behind expand toggle */}
        {isMobile ? (
          <>
            <ToolbarBtn
              onClick={handleToggleExpand}
              accent="#6366f1"
              icon={expanded ? "✕" : "⚙"}
              label={expanded ? "" : ""}
              tooltip="More options"
              active={expanded}
              compact
            />
            {expanded && (
              <>
                <Divider compact />
                <ToolbarBtn onClick={onQuickSave} accent="#38bdf8" icon="💾" label="Quick" compact />
                <ToolbarBtn onClick={onSave}      accent="#a855f7" icon="📁" label="Save"  compact />
                <ToolbarBtn
                  onClick={onLoad}
                  disabled={isLoading}
                  accent="#f59e0b"
                  icon={isLoading ? "⟳" : "📂"}
                  label={isLoading ? "…" : "Load"}
                  spin={isLoading}
                  compact
                />
                <ToolbarBtn onClick={onSettings} accent="#6366f1" icon="⚙" label="Config" compact />
              </>
            )}
          </>
        ) : (
          <>
            <ToolbarBtn onClick={onQuickSave} accent="#38bdf8" icon="💾" label="Quick" tooltip="Quick Save" />
            <ToolbarBtn onClick={onSave}      accent="#a855f7" icon="📁" label="Save"  tooltip="Save Slots" />
            <ToolbarBtn
              onClick={onLoad}
              disabled={isLoading}
              accent="#f59e0b"
              icon={isLoading ? "⟳" : "📂"}
              label={isLoading ? "Loading…" : "Load"}
              tooltip="Load Slots"
              spin={isLoading}
            />
            <ToolbarBtn onClick={onSettings} accent="#6366f1" icon="⚙" label="Config" tooltip="Settings" />
          </>
        )}
      </div>

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes tb-flash {
          0%   { opacity: 0; transform: translateY(-3px); }
          12%  { opacity: 1; transform: none; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      {/* Act Selector Modal */}
      {showActSelector && (
        <div
          onClick={() => setShowActSelector(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(17,10,38,0.95), rgba(4,2,12,0.98))",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 16,
              padding: 24,
              minWidth: 320,
              boxShadow: "0 20px 60px rgba(139,92,246,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>
                📖 Select Act & Scene
              </h3>
              <button
                onClick={() => setShowActSelector(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  fontSize: 20,
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>
    
            {/* Act Selection */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 8, letterSpacing: "0.05em" }}>
                SELECT ACT
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[1, 2].map((actNum) => (
                  <button
                    key={actNum}
                    onClick={() => setSelectedAct(actNum)}
                    style={{
                      padding: "12px 16px",
                      background: selectedAct === actNum
                        ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2))"
                        : "rgba(255,255,255,0.05)",
                      border: selectedAct === actNum
                        ? "1px solid rgba(139,92,246,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      color: selectedAct === actNum ? "#a78bfa" : "#d1d5db",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = selectedAct === actNum
                        ? "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(168,85,247,0.3))"
                        : "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = selectedAct === actNum
                        ? "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2))"
                        : "rgba(255,255,255,0.05)";
                    }}
                  >
                    {actNum === 1 ? "Act 1 — The Beginning" : "Act 2 — 帰還 (Homecoming)"}
                    {selectedAct === actNum && (
                      <span style={{ float: "right", fontSize: 12, opacity: 0.7 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
    
            {/* Scene Number Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 8, letterSpacing: "0.05em" }}>
                SCENE NUMBER (optional)
              </label>
              <input
                type="number"
                min="1"
                value={sceneInput}
                onChange={(e) => setSceneInput(e.target.value)}
                placeholder="e.g., 20 for scene 20"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                  e.currentTarget.style.background = "rgba(139,92,246,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              />
              <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
                Leave empty to start from first scene
              </p>
            </div>
    
            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setShowActSelector(false);
                  setSceneInput("");
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#9ca3af",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleActSelect}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2))",
                  border: "1px solid rgba(139,92,246,0.5)",
                  borderRadius: 8,
                  color: "#a78bfa",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Jump to Act {selectedAct}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Divider({ compact }: { compact?: boolean }) {
  return <div style={{ width: 1, height: compact ? 14 : 18, background: "rgba(255,255,255,0.07)", margin: "0 2px", flexShrink: 0 }} />;
}

interface ToolbarBtnProps {
  onClick: ((e: React.MouseEvent | React.TouchEvent) => void) | (() => void);
  disabled?: boolean;
  accent: string;
  icon: string;
  label: string;
  tooltip?: string;
  spin?: boolean;
  active?: boolean;
  compact?: boolean;
}

export function ToolbarBtn({ onClick, disabled, accent, icon, label, tooltip, spin, active, compact }: ToolbarBtnProps) {
  const [hov, setHov] = useState(false);
  const lit = active || hov;

  return (
    <button
      onClick={onClick as React.MouseEventHandler}
      disabled={disabled}
      title={tooltip ?? label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 2 : 4,
        padding: compact ? "4px 7px" : "4px 9px",
        borderRadius: 7,
        border: `1px solid ${lit ? accent + "88" : "rgba(255,255,255,0.09)"}`,
        background: lit ? `${accent}22` : "rgba(0,0,0,0.3)",
        color: lit ? accent : "rgba(255,255,255,0.5)",
        fontSize: compact ? "0.52rem" : "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.09em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.14s ease",
        backdropFilter: "blur(8px)",
        opacity: disabled ? 0.45 : 1,
        userSelect: "none",
        boxShadow: active ? `0 0 8px ${accent}44` : "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
        // Minimum touch target size for mobile accessibility
        minHeight: compact ? 32 : "auto",
        minWidth: compact ? 32 : "auto",
        justifyContent: "center",
      }}
    >
      <span style={{
        fontSize: compact ? "0.75rem" : "0.78rem",
        display: "inline-block",
        animation: spin ? "spin 0.7s linear infinite" : "none",
        lineHeight: 1,
      }}>
        {icon}
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}