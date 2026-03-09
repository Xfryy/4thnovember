"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface DialogueBoxProps {
  characterName?: string; // undefined = monologue (no nameplate)
  text: string;
  onAdvance: () => void;  // called when player clicks after text is fully shown
}

function getTextSpeedMs(): number {
  if (typeof window === "undefined") return 50;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--text-speed-ms")
    .trim();
  const parsed = parseInt(raw);
  return isNaN(parsed) ? 50 : parsed;
}

export default function DialogueBox({ characterName, text, onAdvance }: DialogueBoxProps) {
  const [displayed, setDisplayed]   = useState("");
  const [finished, setFinished]     = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef    = useRef(0);

  // Reset + start typewriter whenever text changes
  useEffect(() => {
    setDisplayed("");
    setFinished(false);
    indexRef.current = 0;

    // Clear any running interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    const speedMs = getTextSpeedMs();

    // If speed is near instant (≥ 95ms speed setting → ≤ 15ms), just show all
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

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  // Click: if typing → skip to end; if finished → advance
  const handleClick = useCallback(() => {
    if (!finished) {
      // Skip typewriter
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayed(text);
      setFinished(true);
    } else {
      onAdvance();
    }
  }, [finished, text, onAdvance]);

  // Keyboard: Space / Enter also advances
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
        padding: "0 32px 28px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Nameplate */}
      {characterName && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
            paddingLeft: 4,
          }}
        >
          <div
            style={{
              padding: "4px 18px",
              borderRadius: "8px 8px 0 0",
              background: "rgba(255, 255, 255, 0.92)",
              border: "1.5px solid rgba(236,72,153,0.35)",
              borderBottom: "none",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "0.9rem",
                letterSpacing: "0.08em",
                background: "linear-gradient(135deg, #ec4899, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {characterName}
            </span>
          </div>
        </div>
      )}

      {/* Text box */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          border: "1.5px solid rgba(236,72,153,0.25)",
          borderRadius: characterName ? "0 12px 12px 12px" : 12,
          padding: "20px 24px",
          boxShadow: "0 -4px 32px rgba(236,72,153,0.08), 0 8px 24px rgba(0,0,0,0.06)",
          minHeight: 100,
          position: "relative",
        }}
      >
        {/* Text */}
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "#1a1030",
            fontWeight: 500,
            letterSpacing: "0.02em",
            margin: 0,
            whiteSpace: "pre-wrap",
            minHeight: "3.5em",
          }}
        >
          {displayed}
          {/* Blinking cursor while typing */}
          {!finished && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: "#ec4899",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                animation: "blink 0.7s step-end infinite",
              }}
            />
          )}
        </p>

        {/* Advance arrow — only shown when text is done */}
        {finished && (
          <div
            style={{
              position: "absolute",
              bottom: 14, right: 20,
              animation: "bounce-arrow 0.8s ease-in-out infinite alternate",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 8l5 5 5-5"
                stroke="#ec4899"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes bounce-arrow {
          from { transform: translateY(0); }
          to   { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
}