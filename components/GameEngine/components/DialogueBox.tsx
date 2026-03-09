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
        padding: "0 32px 28px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {speaker && (
        <div style={{ display: "inline-flex", marginBottom: 0, paddingLeft: 4 }}>
          <div
            style={{
              padding: "5px 20px",
              borderRadius: "8px 8px 0 0",
              background: "rgba(15,10,30,0.88)",
              border: "1.5px solid rgba(236,72,153,0.45)",
              borderBottom: "none",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "0.88rem",
                letterSpacing: "0.1em",
                background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {speaker}
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          background: "rgba(15,10,30,0.82)",
          border: "1.5px solid rgba(236,72,153,0.22)",
          borderRadius: speaker ? "0 12px 12px 12px" : 12,
          padding: "18px 52px 18px 24px",
          boxShadow: "0 -4px 40px rgba(236,72,153,0.06), 0 0 0 1px rgba(255,255,255,0.04) inset",
          height: 110,
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.92)",
            fontWeight: 400,
            letterSpacing: "0.025em",
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {displayed}
          {!finished && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: "#ec4899",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                animation: "dlg-blink 0.7s step-end infinite",
              }}
            />
          )}
        </p>

        {finished && (
          <div
            style={{
              position: "absolute",
              bottom: 14, right: 18,
              animation: "dlg-bounce 0.8s ease-in-out infinite alternate",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#ec4899" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dlg-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dlg-bounce { from{transform:translateY(0)} to{transform:translateY(5px)} }
      `}</style>
    </div>
  );
}