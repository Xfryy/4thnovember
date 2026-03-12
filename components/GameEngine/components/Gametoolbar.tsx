"use client";

/**
 * GameToolbar — Full VN HUD
 *
 * New buttons vs original:
 * - AUTO  — toggle auto-play
 * - SKIP  — toggle skip mode
 * - HIDE  — hide UI (H key)
 * - LOG   — open history (H key)
 */

import { useState, useEffect } from "react";
import { useVNControls } from "@/store/Usevncontrols";

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

  // H key → toggle history log
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyH" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleLog();
      }
      if (e.code === "KeyA" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleAutoPlay();
      }
      if (e.code === "KeyF" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleSkip();
      }
      if (e.code === "KeyV" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleHideUI();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleAutoPlay, toggleSkip, toggleHideUI, toggleLog]);

  if (hideUI) {
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none" }}>
        {/* Floating shortcut hint — top bar style, no background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "10px 14px",
          animation: "hint-in 0.25s ease both",
        }}>
          {([
            { key: "A", label: "Auto-play", color: "#4ade80" },
            { key: "F", label: "Skip",      color: "#f59e0b" },
            { key: "H", label: "History",   color: "#a5b4fc" },
            { key: "V", label: "Show UI",   color: "#94a3b8" },
          ] as const).map(({ key, label, color }, i) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {i > 0 && (
                <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.6rem" }}>·</span>
              )}
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18,
                borderRadius: 4,
                background: `${color}15`,
                border: `1px solid ${color}40`,
                color: color,
                fontSize: "0.6rem",
                fontWeight: 900,
                fontFamily: "monospace",
              }}>
                {key}
              </span>
              <span style={{
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}>
                {label}
              </span>
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

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "10px 14px",
      background: "linear-gradient(180deg, rgba(4,2,12,0.75) 0%, transparent 100%)",
      backdropFilter: "blur(8px)",
    }}>
      {/* Menu */}
      <ToolbarBtn
        onClick={onMenu}
        disabled={isSaving}
        accent="#ec4899"
        icon={isSaving ? "⟳" : "←"}
        spin={isSaving}
        label={isSaving ? "Saving…" : "Menu"}
      />

      <Divider />

      {/* VN Playback Controls */}
      <ToolbarBtn
        onClick={toggleAutoPlay}
        accent="#4ade80"
        icon="▶"
        label="Auto"
        tooltip="Auto-play [A]"
        active={autoPlay}
      />
      <ToolbarBtn
        onClick={toggleSkip}
        accent="#f59e0b"
        icon="⏩"
        label="Skip"
        tooltip="Skip mode [F]"
        active={skipMode}
      />
      <ToolbarBtn
        onClick={toggleLog}
        accent="#a5b4fc"
        icon="📜"
        label="Log"
        tooltip="History [H]"
      />
      <ToolbarBtn
        onClick={toggleHideUI}
        accent="#94a3b8"
        icon="👁"
        label="Hide"
        tooltip="Hide UI [V]"
      />

      <Divider />

      <div style={{ flex: 1 }} />

      {/* Saved flash */}
      {savedFlash && (
        <span style={{
          fontSize: "0.6rem",
          fontWeight: 800,
          color: "#4ade80",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          animation: "tb-flash 1.8s ease both",
          marginRight: 4,
        }}>
          ✓ Saved!
        </span>
      )}

      {/* Act · Scene badge */}
      <div style={{
        padding: "3px 10px",
        borderRadius: 6,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        marginRight: 4,
      }}>
        <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", fontWeight: 600 }}>
          ACT {actNumber}
        </span>
        <span style={{ fontSize: "0.55rem", color: "rgba(236,72,153,0.5)", letterSpacing: "0.1em", fontWeight: 600, margin: "0 4px" }}>·</span>
        <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", fontWeight: 600 }}>
          {sceneNumber}
        </span>
      </div>

      <Divider />

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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes tb-flash {
          0%   { opacity: 0; transform: translateY(-3px); }
          12%  { opacity: 1; transform: none; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.07)", margin: "0 2px" }} />;
}

interface ToolbarBtnProps {
  onClick: () => void;
  disabled?: boolean;
  accent: string;
  icon: string;
  label: string;
  tooltip?: string;
  spin?: boolean;
  active?: boolean;   // toggle-on state
}

export function ToolbarBtn({ onClick, disabled, accent, icon, label, tooltip, spin, active }: ToolbarBtnProps) {
  const [hov, setHov] = useState(false);
  const lit = active || hov;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip ?? label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 9px",
        borderRadius: 7,
        border: `1px solid ${lit ? accent + "88" : "rgba(255,255,255,0.09)"}`,
        background: lit ? `${accent}22` : "rgba(0,0,0,0.3)",
        color: lit ? accent : "rgba(255,255,255,0.5)",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.09em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.14s ease",
        backdropFilter: "blur(8px)",
        opacity: disabled ? 0.45 : 1,
        userSelect: "none",
        boxShadow: active ? `0 0 8px ${accent}44` : "none",
      }}
    >
      <span style={{
        fontSize: "0.78rem",
        display: "inline-block",
        animation: spin ? "spin 0.7s linear infinite" : "none",
        lineHeight: 1,
      }}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}