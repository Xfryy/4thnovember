"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { useSettingsStore } from "@/store/Settingsstore";
import { useVNControls } from "@/store/Usevncontrols";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile       = useIsMobile();

  const { autoPlay, autoPlayDelay, skipMode, hideUI, addLogEntry, toggleSkip, toggleAutoPlay } = useVNControls();

  const resolvedSpeaker = speaker ? resolveTokens(speaker, characterName) : undefined;
  const resolvedText    = resolveTokens(text, characterName);

  const [displayed, setDisplayed] = useState("");
  const [finished,  setFinished]  = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlayTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggedRef      = useRef(false);
  const indexRef       = useRef(0);
  const advanceLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current)   { clearInterval(intervalRef.current);  intervalRef.current = null; }
    if (autoPlayTimer.current) { clearTimeout(autoPlayTimer.current); autoPlayTimer.current = null; }
    if (advanceLockRef.current) { clearTimeout(advanceLockRef.current); advanceLockRef.current = null; }
  }, []);

  const showInstant = useCallback(() => {
    clearTimers();
    setDisplayed(resolvedText);
    setFinished(true);
  }, [resolvedText, clearTimers]);

  const logEntry = useCallback(() => {
    if (loggedRef.current) return;
    loggedRef.current = true;
    addLogEntry({ speaker: resolvedSpeaker, text: resolvedText, sceneId });
  }, [resolvedSpeaker, resolvedText, sceneId, addLogEntry]);

  // Typewriter
  useEffect(() => {
    clearTimers();
    setDisplayed("");
    setFinished(false);
    setIsAdvancing(false);
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
  }, [resolvedText, skipMode, getTextSpeedMs]);

  // Auto-play
  useEffect(() => {
    if (!finished) return;
    logEntry();
    if (autoPlay || skipMode) {
      const delay = skipMode ? 10 : autoPlayDelay;
      autoPlayTimer.current = setTimeout(onAdvance, delay);
    }
    return () => {
      if (autoPlayTimer.current) { clearTimeout(autoPlayTimer.current); autoPlayTimer.current = null; }
    };
  }, [finished, autoPlay, skipMode, autoPlayDelay, onAdvance, logEntry]);

  const handleAdvance = useCallback(() => {
    if (isAdvancing) return;
    if (skipMode) toggleSkip();
    if (autoPlay) toggleAutoPlay();
    if (!finished) showInstant();
    else {
      // Anti spam-click: lock singkat biar animasi UI nggak kepotong dan terasa lebih smooth.
      setIsAdvancing(true);
      clearTimers();
      advanceLockRef.current = setTimeout(() => setIsAdvancing(false), 140);
      onAdvance();
    }
  }, [isAdvancing, finished, showInstant, clearTimers, onAdvance, skipMode, autoPlay, toggleSkip, toggleAutoPlay]);

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

  if (hideUI) return null;

  return (
    <div
      onClick={handleAdvance}
      style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        zIndex: 20,
        // Padding responsif: lebih kecil di mobile
        padding: isMobile ? "0 8px 8px" : "0 24px 24px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Auto / Skip badge */}
      {(autoPlay || skipMode) && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% - 16px)",
          right: isMobile ? 12 : 30,
          display: "flex", gap: 6, zIndex: 21,
        }}>
          {autoPlay && (
            <span style={{
              fontSize: isMobile ? "0.42rem" : "0.52rem",
              fontWeight: 800, letterSpacing: "0.18em",
              color: "#4ade80",
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 5,
              padding: isMobile ? "2px 5px" : "2px 8px",
              animation: "badge-pulse 1.2s ease-in-out infinite",
            }}>AUTO</span>
          )}
          {skipMode && (
            <span style={{
              fontSize: isMobile ? "0.42rem" : "0.52rem",
              fontWeight: 800, letterSpacing: "0.18em",
              color: "#f59e0b",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 5,
              padding: isMobile ? "2px 5px" : "2px 8px",
              animation: "badge-pulse 0.6s ease-in-out infinite",
            }}>SKIP</span>
          )}
        </div>
      )}

      {/* Speaker name */}
      {resolvedSpeaker && (
        <div style={{ paddingLeft: isMobile ? 4 : 8 }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            gap: isMobile ? 5 : 8,
            // clamp: min 28px, ideal 5vw, max 36px
            padding: isMobile ? "3px 10px 4px" : "5px 18px 6px",
            borderRadius: "10px 10px 0 0",
            background: "rgba(10,5,25,0.92)",
            border: "1px solid rgba(236,72,153,0.4)",
            borderBottom: "none",
          }}>
            <span style={{
              width: isMobile ? 4 : 5, height: isMobile ? 4 : 5,
              borderRadius: "50%", background: "#ec4899",
              boxShadow: "0 0 6px #ec4899", flexShrink: 0,
            }} />
            <span style={{
              fontWeight: 800,
              // clamp font size: kecil di mobile, besar di desktop
              fontSize: "clamp(0.6rem, 2.5vw, 0.82rem)",
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

      {/* Main dialogue box */}
      <div style={{
        position: "relative",
        background: "rgba(6,2,18,0.88)",
        border: "1px solid rgba(236,72,153,0.18)",
        borderRadius: resolvedSpeaker ? "0 12px 12px 12px" : 12,
        // Padding responsif — lebih compact di mobile
        padding: isMobile ? "8px 32px 8px 12px" : "16px 50px 16px 20px",
        // Tinggi minimum responsif
        minHeight: isMobile ? 60 : 100,
        // KUNCI: batasi tinggi max agar tidak makan terlalu banyak layar
        maxHeight: isMobile ? "28vh" : "35vh",
        overflowY: "auto",
        backdropFilter: "blur(20px)",
        boxShadow: "0 -2px 40px rgba(236,72,153,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
        overflow: "hidden",
        transform: finished ? "translateY(0)" : "translateY(2px)",
        opacity: isAdvancing ? 0.92 : 1,
        filter: isAdvancing ? "blur(0.3px)" : "none",
        transition:
          "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, filter 180ms ease",
      }}>
        {/* Left accent bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0, width: 2,
          background: "linear-gradient(180deg, transparent, rgba(236,72,153,0.5) 40%, rgba(168,85,247,0.5) 70%, transparent)",
          borderRadius: "12px 0 0 12px",
        }} />

        {/* Dialogue text — font size responsif pakai clamp */}
        <p style={{
          // clamp(min, ideal, max): 0.78rem mobile → 0.95rem desktop
          fontSize: "clamp(0.75rem, 2.8vw, 0.95rem)",
          lineHeight: isMobile ? 1.6 : 1.85,
          color: "rgba(255,255,255,0.9)",
          fontWeight: 400,
          fontStyle: italic ? "italic" : "normal",
          letterSpacing: italic ? "0.04em" : "0.028em",
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          paddingLeft: isMobile ? 6 : 10,
        }}>
          {displayed}
          {!finished && (
            <span style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              background: "#ec4899",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              animation: "dlg-blink 0.65s step-end infinite",
            }} />
          )}
        </p>

        {/* Continue arrow */}
        {finished && !autoPlay && !skipMode && (
          <div style={{
            position: "absolute",
            bottom: isMobile ? 6 : 12,
            right: isMobile ? 8 : 16,
            display: "flex", alignItems: "center", gap: 4,
            animation: "dlg-bounce 0.9s ease-in-out infinite alternate",
          }}>
            <span style={{
              fontSize: isMobile ? "0.4rem" : "0.5rem",
              letterSpacing: "0.2em",
              color: "rgba(236,72,153,0.5)",
              fontWeight: 700,
            }}>TAP</span>
            <svg width={isMobile ? "12" : "16"} height={isMobile ? "12" : "16"} viewBox="0 0 20 20" fill="none">
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