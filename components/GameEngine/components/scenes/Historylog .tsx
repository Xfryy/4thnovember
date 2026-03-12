"use client";

/**
 * HistoryLog — Scrollable dialogue history overlay
 * Dengan responsive design untuk mobile
 */

import { useEffect, useRef, useState } from "react";
import { useVNControls, LogEntry } from "@/store/Usevncontrols";

export default function HistoryLog() {
  const { showLog, log, toggleLog } = useVNControls();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (showLog && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showLog, log.length]);

  // Close on Escape or H key
  useEffect(() => {
    if (!showLog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape" || e.code === "KeyH") toggleLog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLog, toggleLog]);

  if (!showLog) return null;

  return (
    <div
      onClick={toggleLog}
      style={{
        position: "fixed", inset: 0,
        zIndex: 200,
        background: "rgba(2,1,10,0.82)",
        backdropFilter: "blur(18px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "log-in 0.22s ease both",
        padding: isMobile ? "10px" : 0,
      }}
    >
      {/* Panel - responsive */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? "100%" : "min(680px, 92vw)",
          height: isMobile ? "90vh" : "80vh",
          maxWidth: isMobile ? "100%" : "680px",
          display: "flex",
          flexDirection: "column",
          background: "rgba(6,2,18,0.96)",
          border: "1px solid rgba(236,72,153,0.18)",
          borderRadius: isMobile ? 12 : 16,
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(168,85,247,0.12)",
        }}
      >
        {/* Header - responsive */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "12px 16px" : "14px 20px",
          borderBottom: "1px solid rgba(236,72,153,0.1)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10 }}>
            <span style={{ 
              fontSize: isMobile ? "0.65rem" : "0.7rem", 
              color: "rgba(236,72,153,0.7)", 
              letterSpacing: "0.25em", 
              fontWeight: 800 
            }}>
              HISTORY
            </span>
            <span style={{ 
              fontSize: isMobile ? "0.55rem" : "0.6rem", 
              color: "rgba(255,255,255,0.2)", 
              letterSpacing: "0.1em" 
            }}>
              {log.length} lines
            </span>
          </div>
          <button
            onClick={toggleLog}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "rgba(255,255,255,0.5)",
              fontSize: isMobile ? "0.6rem" : "0.65rem",
              padding: isMobile ? "3px 10px" : "4px 12px",
              cursor: "pointer",
              letterSpacing: "0.1em",
              fontWeight: 700,
            }}
          >
            CLOSE {!isMobile && "[H]"}
          </button>
        </div>

        {/* Log entries - responsive */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: isMobile ? "10px 12px 16px" : "12px 20px 20px", 
          display: "flex", 
          flexDirection: "column", 
          gap: isMobile ? 12 : 16 
        }}>
          {log.length === 0 ? (
            <p style={{ 
              color: "rgba(255,255,255,0.2)", 
              fontSize: isMobile ? "0.75rem" : "0.8rem", 
              textAlign: "center", 
              marginTop: 40 
            }}>
              No history yet.
            </p>
          ) : (
            log.map((entry: LogEntry) => (
              <div key={entry.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {entry.speaker && (
                  <span style={{
                    fontSize: isMobile ? "0.68rem" : "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    background: "linear-gradient(135deg, #fce7f3, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    {entry.speaker}
                  </span>
                )}
                <p style={{
                  fontSize: isMobile ? "0.8rem" : "0.88rem",
                  lineHeight: isMobile ? 1.6 : 1.75,
                  color: "rgba(255,255,255,0.72)",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontStyle: entry.speaker ? "normal" : "italic",
                  letterSpacing: "0.025em",
                  paddingLeft: entry.speaker ? (isMobile ? 6 : 10) : 0,
                  borderLeft: entry.speaker ? `2px solid rgba(236,72,153,0.2)` : "none",
                }}>
                  {entry.text}
                </p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer hint - responsive */}
        <div style={{
          padding: isMobile ? "8px 16px" : "10px 20px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex", 
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ 
            fontSize: isMobile ? "0.5rem" : "0.58rem", 
            color: "rgba(255,255,255,0.15)", 
            letterSpacing: "0.12em",
            textAlign: "center",
          }}>
            {isMobile ? "Tap outside or press H to close" : "Click outside or press [ESC] / [H] to close"}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes log-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}