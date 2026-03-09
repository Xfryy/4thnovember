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
    <div
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "linear-gradient(180deg, rgba(0,0,0,0.60) 0%, transparent 100%)",
        backdropFilter: "blur(6px)",
        // Removed all transform/transition — toolbar is always visible now
      }}
    >
      {/* ← Menu */}
      <ToolbarBtn
        onClick={onMenu}
        disabled={isSaving}
        accent="#ec4899"
        icon={isSaving ? "⟳" : "←"}
        spin={isSaving}
        label={isSaving ? "Saving..." : "Menu"}
      />

      <div style={{ flex: 1 }} />

      {/* Saved! flash */}
      {savedFlash && (
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            color: "#4ade80",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            animation: "fade-in-out 1.8s ease both",
          }}
        >
          ✓ Saved!
        </span>
      )}

      {/* Act · Scene indicator */}
      <span
        style={{
          fontSize: "0.6rem",
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.12em",
          fontWeight: 600,
          marginRight: 8,
        }}
      >
        Act {actNumber} · {sceneNumber}
      </span>

      <ToolbarBtn
        onClick={onQuickSave}
        accent="#38bdf8"
        icon="💾"
        label="Quick Save"
        tooltip="Save to Slot 1"
      />
      <ToolbarBtn
        onClick={onSave}
        accent="#a855f7"
        icon="📁"
        label="Save"
        tooltip="Save Slots"
      />
      <ToolbarBtn
        onClick={onLoad}
        accent="#f59e0b"
        icon="📂"
        label="Load"
        tooltip="Load Slots"
      />
      <ToolbarBtn
        onClick={onSettings}
        accent="#6366f1"
        icon="⚙"
        label="Config"
        tooltip="Settings"
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fade-in-out {
          0%   { opacity: 0; transform: translateY(-4px); }
          15%  { opacity: 1; transform: none; }
          75%  { opacity: 1; }
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
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip ?? label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 8,
        border: `1px solid ${hovered ? accent + "88" : "rgba(255,255,255,0.12)"}`,
        background: hovered ? `${accent}22` : "rgba(0,0,0,0.35)",
        color: hovered ? accent : "rgba(255,255,255,0.65)",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        backdropFilter: "blur(8px)",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
      }}
    >
      <span
        style={{
          fontSize: "0.8rem",
          display: "inline-block",
          animation: spin ? "spin 0.7s linear infinite" : "none",
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: "0.65rem" }}>{label}</span>
    </button>
  );
}