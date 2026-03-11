"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface DialogueBoxProps {
  speaker?: string;
  text: string;
  onAdvance: () => void;
}

function getTextSpeedMs(): number {
  if (typeof window === "undefined") return 40;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--text-speed-ms").trim();
  const parsed = parseInt(raw);
  return isNaN(parsed) ? 40 : parsed;
}

export default function DialogueBox({ speaker, text, onAdvance }: DialogueBoxProps) {
  const [displayed, setDisplayed] = useState("");
  const [finished, setFinished]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef    = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setFinished(false);
    indexRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    const speedMs = getTextSpeedMs();
    if (speedMs <= 15) {
      setDisplayed(text);
      setFinished(true);
      return;
    }

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        setFinished(true);
      }
    }, speedMs);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text]);

  const handleClick = useCallback(() => {
    if (!finished) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayed(text);
      setFinished(true);
    } else {
      onAdvance();
    }
  }, [finished, text, onAdvance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClick]);

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        zIndex: 20,
        padding: "0 24px 24px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Speaker name tag */}
      {speaker && (
        <div style={{ paddingLeft: 8, marginBottom: 0 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 18px 6px",
            borderRadius: "10px 10px 0 0",
            background: "rgba(10,5,25,0.92)",
            border: "1px solid rgba(236,72,153,0.4)",
            borderBottom: "none",
            position: "relative",
          }}>
            {/* Pink dot accent */}
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#ec4899",
              boxShadow: "0 0 6px #ec4899",
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
              {speaker}
            </span>
          </div>
        </div>
      )}

      {/* Main dialogue box */}
      <div style={{
        position: "relative",
        background: "rgba(6,2,18,0.86)",
        border: "1px solid rgba(236,72,153,0.18)",
        borderRadius: speaker ? "0 12px 12px 12px" : 12,
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
        {/* Subtle gradient shimmer on left edge */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0,
          width: 2,
          background: "linear-gradient(180deg, transparent, rgba(236,72,153,0.5) 40%, rgba(168,85,247,0.5) 70%, transparent)",
          borderRadius: "12px 0 0 12px",
        }} />

        <p style={{
          fontSize: "0.95rem",
          lineHeight: 1.85,
          color: "rgba(255,255,255,0.9)",
          fontWeight: 400,
          letterSpacing: "0.028em",
          margin: 0,
          whiteSpace: "pre-wrap",
          paddingLeft: 10,
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
        {finished && (
          <div style={{
            position: "absolute",
            bottom: 12, right: 16,
            display: "flex",
            alignItems: "center",
            gap: 4,
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
        @keyframes dlg-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dlg-bounce {
          from { transform: translateY(0); }
          to   { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}