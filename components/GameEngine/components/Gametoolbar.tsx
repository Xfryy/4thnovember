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

interface GameToolbarProps {
  actNumber: number;
  sceneNumber: string | number;
  isSaving: boolean;
  isLoading?: boolean;
  savedFlash: boolean;
  onMenu: () => void;
  onQuickSave: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSettings: () => void;
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
}: GameToolbarProps) {
  const {
    autoPlay, skipMode, hideUI,
    toggleAutoPlay, toggleSkip, toggleHideUI, toggleLog,
  } = useVNControls();

  const isMobile = useIsMobile();
  // On mobile the extended save/config buttons are hidden behind a collapsed state
  const [expanded, setExpanded] = useState(false);

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
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleAutoPlay, toggleSkip, toggleHideUI, toggleLog]);

  const handleToggleExpand = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // stopPropagation so the tap doesn't also fire dialogue advance
    e.stopPropagation();
    setExpanded((p) => !p);
  }, []);

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