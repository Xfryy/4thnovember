"use client";

/**
 * DialogueBox — Full VN-standard dialogue box
 *
 * Features:
 * - Typewriter effect (speed from settings)
 * - Click/tap/keyboard to skip typewriter or advance
 * - Auto-play mode (advance after configurable delay)
 * - Skip mode (instant display, auto-advance)
 * - {playerName} token resolution
 * - Appends every completed line to history log
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { useSettingsStore } from "@/store/Settingsstore";
import { useVNControls } from "@/store/Usevncontrols";

interface DialogueBoxProps {
  speaker?: string;
  text: string;
  onAdvance: () => void;
  italic?: boolean;
  sceneId?: string;
}

function resolveTokens(str: string, playerName: string): string {
  if (!str) return str;
  return str.replace(/\{playerName\}/gi, playerName || "???");
}

export default function DialogueBox({
  speaker,
  text,
  onAdvance,
  italic = false,
  sceneId = "",
}: DialogueBoxProps) {
  const characterName  = useGameStore((s) => s.characterName);
  const getTextSpeedMs = useSettingsStore((s) => s.getTextSpeedMs);

  const { autoPlay, autoPlayDelay, skipMode, hideUI, addLogEntry } = useVNControls();

  const resolvedSpeaker = speaker ? resolveTokens(speaker, characterName) : undefined;
  const resolvedText    = resolveTokens(text, characterName);

  const [displayed, setDisplayed] = useState("");
  const [finished,  setFinished]  = useState(false);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggedRef     = useRef(false);   // prevent double-logging per line
  const indexRef      = useRef(0);

  // ── Clear timers helper ───────────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    if (intervalRef.current)   { clearInterval(intervalRef.current);  intervalRef.current = null; }
    if (autoPlayTimer.current) { clearTimeout(autoPlayTimer.current); autoPlayTimer.current = null; }
  }, []);

  // ── Show full text immediately ────────────────────────────────────────────
  const showInstant = useCallback(() => {
    clearTimers();
    setDisplayed(resolvedText);
    setFinished(true);
  }, [resolvedText, clearTimers]);

  // ── Log entry (only once per text change) ────────────────────────────────
  const logEntry = useCallback(() => {
    if (loggedRef.current) return;
    loggedRef.current = true;
    addLogEntry({ speaker: resolvedSpeaker, text: resolvedText, sceneId });
  }, [resolvedSpeaker, resolvedText, sceneId, addLogEntry]);

  // ── Typewriter effect ─────────────────────────────────────────────────────
  useEffect(() => {
    clearTimers();
    setDisplayed("");
    setFinished(false);
    indexRef.current = 0;
    loggedRef.current = false;

    const speedMs = getTextSpeedMs();
    const instant = skipMode || speedMs <= 15;

    if (instant) {
      setDisplayed(resolvedText);
      setFinished(true);
      return;
    }

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(resolvedText.slice(0, indexRef.current));
      if (indexRef.current >= resolvedText.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setFinished(true);
      }
    }, speedMs);

    return clearTimers;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedText, skipMode]);

  // ── When finished: log + start auto-play timer ───────────────────────────
  useEffect(() => {
    if (!finished) return;

    logEntry();

    if (autoPlay || skipMode) {
      const delay = skipMode ? 80 : autoPlayDelay;
      autoPlayTimer.current = setTimeout(() => {
        onAdvance();
      }, delay);
    }

    return () => {
      if (autoPlayTimer.current) { clearTimeout(autoPlayTimer.current); autoPlayTimer.current = null; }
    };
  }, [finished, autoPlay, skipMode, autoPlayDelay, onAdvance, logEntry]);

  // ── Manual advance (click / tap) ─────────────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (!finished) {
      showInstant();
    } else {
      clearTimers();
      onAdvance();
    }
  }, [finished, showInstant, clearTimers, onAdvance]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight") {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAdvance]);

  // ── Hidden UI mode ────────────────────────────────────────────────────────
  if (hideUI) return null;

  return (
    <div
      onClick={handleAdvance}
      style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        zIndex: 20,
        padding: "0 24px 24px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Auto / Skip indicator badge */}
      {(autoPlay || skipMode) && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% - 16px)",
          right: 30,
          display: "flex",
          gap: 6,
          zIndex: 21,
        }}>
          {autoPlay && (
            <span style={{
              fontSize: "0.52rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: "#4ade80",
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 5,
              padding: "2px 8px",
              animation: "badge-pulse 1.2s ease-in-out infinite",
            }}>
              AUTO
            </span>
          )}
          {skipMode && (
            <span style={{
              fontSize: "0.52rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: "#f59e0b",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 5,
              padding: "2px 8px",
              animation: "badge-pulse 0.6s ease-in-out infinite",
            }}>
              SKIP
            </span>
          )}
        </div>
      )}

      {/* Speaker name tag */}
      {resolvedSpeaker && (
        <div style={{ paddingLeft: 8 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 18px 6px",
            borderRadius: "10px 10px 0 0",
            background: "rgba(10,5,25,0.92)",
            border: "1px solid rgba(236,72,153,0.4)",
            borderBottom: "none",
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#ec4899", boxShadow: "0 0 6px #ec4899",
              flexShrink: 0,
            }} />
            <span style={{
              fontWeight: 800,
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              background: "linear-gradient(135deg, #fce7f3, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {resolvedSpeaker}
            </span>
          </div>
        </div>
      )}

      {/* Main box */}
      <div style={{
        position: "relative",
        background: "rgba(6,2,18,0.88)",
        border: "1px solid rgba(236,72,153,0.18)",
        borderRadius: resolvedSpeaker ? "0 12px 12px 12px" : 12,
        padding: "16px 50px 16px 20px",
        minHeight: 100,
        backdropFilter: "blur(20px)",
        boxShadow: [
          "0 -2px 40px rgba(236,72,153,0.05)",
          "inset 0 1px 0 rgba(255,255,255,0.04)",
          "inset 0 0 40px rgba(168,85,247,0.03)",
        ].join(", "),
        overflow: "hidden",
      }}>
        {/* Left accent */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0, width: 2,
          background: "linear-gradient(180deg, transparent, rgba(236,72,153,0.5) 40%, rgba(168,85,247,0.5) 70%, transparent)",
          borderRadius: "12px 0 0 12px",
        }} />

        {/* Text */}
        <p style={{
          fontSize: "0.95rem",
          lineHeight: 1.85,
          color: "rgba(255,255,255,0.9)",
          fontWeight: 400,
          fontStyle: italic ? "italic" : "normal",
          letterSpacing: italic ? "0.04em" : "0.028em",
          margin: 0,
          whiteSpace: "pre-wrap",
          paddingLeft: 10,
        }}>
          {displayed}
          {!finished && (
            <span style={{
              display: "inline-block",
              width: 2, height: "1em",
              background: "#ec4899",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              animation: "dlg-blink 0.65s step-end infinite",
            }} />
          )}
        </p>

        {/* Continue arrow — hidden during auto/skip */}
        {finished && !autoPlay && !skipMode && (
          <div style={{
            position: "absolute",
            bottom: 12, right: 16,
            display: "flex", alignItems: "center", gap: 4,
            animation: "dlg-bounce 0.9s ease-in-out infinite alternate",
          }}>
            <span style={{
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              color: "rgba(236,72,153,0.5)",
              fontWeight: 700,
            }}>TAP</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dlg-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dlg-bounce  { from{transform:translateY(0)} to{transform:translateY(4px)} }
        @keyframes badge-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}