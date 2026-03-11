"use client";

import { useState } from "react";

interface GameToolbarProps {
  actNumber: number;
  sceneNumber: string | number;
  isSaving: boolean;
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
  savedFlash,
  onMenu,
  onQuickSave,
  onSave,
  onLoad,
  onSettings,
}: GameToolbarProps) {
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "10px 14px",
      background: "linear-gradient(180deg, rgba(4,2,12,0.75) 0%, transparent 100%)",
      backdropFilter: "blur(8px)",
    }}>
      {/* ← Menu */}
      <ToolbarBtn
        onClick={onMenu}
        disabled={isSaving}
        accent="#ec4899"
        icon={isSaving ? "⟳" : "←"}
        spin={isSaving}
        label={isSaving ? "Saving…" : "Menu"}
      />

      {/* Separator */}
      <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.07)", margin: "0 2px" }} />

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
        <span style={{
          fontSize: "0.55rem",
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.14em",
          fontWeight: 600,
        }}>
          ACT {actNumber}
        </span>
        <span style={{
          fontSize: "0.55rem",
          color: "rgba(236,72,153,0.5)",
          letterSpacing: "0.1em",
          fontWeight: 600,
          margin: "0 4px",
        }}>·</span>
        <span style={{
          fontSize: "0.55rem",
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.1em",
          fontWeight: 600,
        }}>
          {sceneNumber}
        </span>
      </div>

      <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.07)", margin: "0 2px" }} />

      <ToolbarBtn onClick={onQuickSave} accent="#38bdf8" icon="💾" label="Quick" tooltip="Quick Save" />
      <ToolbarBtn onClick={onSave}      accent="#a855f7" icon="📁" label="Save"  tooltip="Save Slots" />
      <ToolbarBtn onClick={onLoad}      accent="#f59e0b" icon="📂" label="Load"  tooltip="Load Slots" />
      <ToolbarBtn onClick={onSettings}  accent="#6366f1" icon="⚙"  label="Config" tooltip="Settings" />

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
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

// ── Toolbar Button ─────────────────────────────────────────────────────────────

interface ToolbarBtnProps {
  onClick: () => void;
  disabled?: boolean;
  accent: string;
  icon: string;
  label: string;
  tooltip?: string;
  spin?: boolean;
}

export function ToolbarBtn({ onClick, disabled, accent, icon, label, tooltip, spin }: ToolbarBtnProps) {
  const [hov, setHov] = useState(false);

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
        border: `1px solid ${hov ? accent + "66" : "rgba(255,255,255,0.09)"}`,
        background: hov ? `${accent}1a` : "rgba(0,0,0,0.3)",
        color: hov ? accent : "rgba(255,255,255,0.5)",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.09em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.14s ease",
        backdropFilter: "blur(8px)",
        opacity: disabled ? 0.45 : 1,
        userSelect: "none",
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