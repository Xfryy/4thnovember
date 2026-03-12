"use client";

/**
 * GameToolbar — Full VN HUD dengan responsive design
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

  const [isMobile, setIsMobile] = useState(false);
  const [showFullToolbar, setShowFullToolbar] = useState(true);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Toggle toolbar on mobile with tap
  useEffect(() => {
    if (!isMobile) return;
    
    const handleTap = () => {
      setShowFullToolbar(prev => !prev);
    };
    
    // Tap anywhere to show/hide toolbar on mobile
    window.addEventListener("touchstart", handleTap);
    return () => window.removeEventListener("touchstart", handleTap);
  }, [isMobile]);

  // Keyboard shortcuts
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
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
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
            { key: "A", label: "Auto", color: "#4ade80" },
            { key: "F", label: "Skip", color: "#f59e0b" },
            { key: "H", label: "History", color: "#a5b4fc" },
            { key: "V", label: "Show UI", color: "#94a3b8" },
          ] as const).map(({ key, label, color }, i) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: isMobile ? 3 : 5 }}>
              {i > 0 && (
                <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.5rem" }}>·</span>
              )}
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: isMobile ? 16 : 18,
                height: isMobile ? 16 : 18,
                borderRadius: 4,
                background: `${color}15`,
                border: `1px solid ${color}40`,
                color: color,
                fontSize: isMobile ? "0.5rem" : "0.6rem",
                fontWeight: 900,
                fontFamily: "monospace",
              }}>
                {key}
              </span>
              {!isMobile && (
                <span style={{
                  fontSize: "0.58rem",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}>
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

  return (
    <>
      {/* Toolbar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 3 : 5,
        padding: isMobile ? "8px 10px" : "10px 14px",
        background: "linear-gradient(180deg, rgba(4,2,12,0.85) 0%, rgba(4,2,12,0.4) 80%, transparent 100%)",
        backdropFilter: "blur(8px)",
        transform: isMobile && !showFullToolbar ? "translateY(-80%)" : "none",
        transition: "transform 0.3s ease",
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}>
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

        {/* VN Controls */}
        <ToolbarBtn
          onClick={toggleAutoPlay}
          accent="#4ade80"
          icon="▶"
          label="Auto"
          tooltip="Auto [A]"
          active={autoPlay}
          compact={isMobile}
        />
        <ToolbarBtn
          onClick={toggleSkip}
          accent="#f59e0b"
          icon="⏩"
          label="Skip"
          tooltip="Skip [F]"
          active={skipMode}
          compact={isMobile}
        />
        <ToolbarBtn
          onClick={toggleLog}
          accent="#a5b4fc"
          icon="📜"
          label="Log"
          tooltip="History [H]"
          compact={isMobile}
        />
        <ToolbarBtn
          onClick={toggleHideUI}
          accent="#94a3b8"
          icon="👁"
          label="Hide"
          tooltip="Hide [V]"
          compact={isMobile}
        />

        <Divider compact={isMobile} />

        <div style={{ flex: 1 }} />

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

        {/* Act · Scene badge - hide on very small screens */}
        {(!isMobile || window.innerWidth > 480) && (
          <div style={{
            padding: isMobile ? "2px 6px" : "3px 10px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            marginRight: 4,
            whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: isMobile ? "0.5rem" : "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", fontWeight: 600 }}>
              ACT {actNumber}
            </span>
            <span style={{ fontSize: isMobile ? "0.5rem" : "0.55rem", color: "rgba(236,72,153,0.5)", letterSpacing: "0.1em", fontWeight: 600, margin: "0 4px" }}>·</span>
            <span style={{ fontSize: isMobile ? "0.5rem" : "0.55rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", fontWeight: 600 }}>
              {sceneNumber}
            </span>
          </div>
        )}

        <Divider compact={isMobile} />

        {/* Save/Load buttons - hide on very small screens */}
        {(!isMobile || window.innerWidth > 560) && (
          <>
            <ToolbarBtn onClick={onQuickSave} accent="#38bdf8" icon="💾" label="Quick" tooltip="Quick Save" compact={isMobile} />
            <ToolbarBtn onClick={onSave}      accent="#a855f7" icon="📁" label="Save"  tooltip="Save Slots" compact={isMobile} />
            <ToolbarBtn
              onClick={onLoad}
              disabled={isLoading}
              accent="#f59e0b"
              icon={isLoading ? "⟳" : "📂"}
              label={isLoading ? "Loading…" : "Load"}
              tooltip="Load Slots"
              spin={isLoading}
              compact={isMobile}
            />
            <ToolbarBtn onClick={onSettings} accent="#6366f1" icon="⚙" label="Config" tooltip="Settings" compact={isMobile} />
          </>
        )}
      </div>

      {/* Mobile hint */}
      {isMobile && !showFullToolbar && (
        <div style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(236,72,153,0.2)",
          border: "1px solid rgba(236,72,153,0.3)",
          borderRadius: 20,
          padding: "4px 12px",
          color: "#ec4899",
          fontSize: "0.55rem",
          letterSpacing: "0.1em",
          zIndex: 51,
          pointerEvents: "none",
          animation: "pulse 1.5s infinite",
        }}>
          TAP TO SHOW MENU
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes tb-flash {
          0%   { opacity: 0; transform: translateY(-3px); }
          12%  { opacity: 1; transform: none; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Divider({ compact }: { compact?: boolean }) {
  return <div style={{ width: 1, height: compact ? 14 : 18, background: "rgba(255,255,255,0.07)", margin: "0 2px" }} />;
}

interface ToolbarBtnProps {
  onClick: () => void;
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
      onClick={onClick}
      disabled={disabled}
      title={tooltip ?? label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 2 : 4,
        padding: compact ? "3px 6px" : "4px 9px",
        borderRadius: 7,
        border: `1px solid ${lit ? accent + "88" : "rgba(255,255,255,0.09)"}`,
        background: lit ? `${accent}22` : "rgba(0,0,0,0.3)",
        color: lit ? accent : "rgba(255,255,255,0.5)",
        fontSize: compact ? "0.5rem" : "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.09em",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.14s ease",
        backdropFilter: "blur(8px)",
        opacity: disabled ? 0.45 : 1,
        userSelect: "none",
        boxShadow: active ? `0 0 8px ${accent}44` : "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{
        fontSize: compact ? "0.7rem" : "0.78rem",
        display: "inline-block",
        animation: spin ? "spin 0.7s linear infinite" : "none",
        lineHeight: 1,
      }}>
        {icon}
      </span>
      {(!compact || (compact && label.length <= 4)) && <span>{label}</span>}
    </button>
  );
}