"use client";

/**
 * HistoryLog — Scrollable dialogue history overlay
 * Standard VN feature: shows all seen lines in reverse order (newest at bottom)
 */

import { useEffect, useRef } from "react";
import { useVNControls, LogEntry } from "@/store/Usevncontrols";

export default function HistoryLog() {
  const { showLog, log, toggleLog } = useVNControls();
  const bottomRef = useRef<HTMLDivElement>(null);

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
        animation: "log-in 0.22s ease both",
      }}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(680px, 92vw)",
          height: "80vh",
          marginTop: "10vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(6,2,18,0.96)",
          border: "1px solid rgba(236,72,153,0.18)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(168,85,247,0.12)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(236,72,153,0.1)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(236,72,153,0.7)", letterSpacing: "0.25em", fontWeight: 800 }}>
              HISTORY
            </span>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
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
              fontSize: "0.65rem",
              padding: "4px 12px",
              cursor: "pointer",
              letterSpacing: "0.1em",
              fontWeight: 700,
            }}
          >
            CLOSE  [H]
          </button>
        </div>

        {/* Log entries */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {log.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem", textAlign: "center", marginTop: 40 }}>
              No history yet.
            </p>
          ) : (
            log.map((entry: LogEntry) => (
              <div key={entry.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {entry.speaker && (
                  <span style={{
                    fontSize: "0.72rem",
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
                  fontSize: "0.88rem",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.72)",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontStyle: entry.speaker ? "normal" : "italic",
                  letterSpacing: "0.025em",
                  paddingLeft: entry.speaker ? 10 : 0,
                  borderLeft: entry.speaker ? "2px solid rgba(236,72,153,0.2)" : "none",
                }}>
                  {entry.text}
                </p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer hint */}
        <div style={{
          padding: "10px 20px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.12em" }}>
            Click outside or press [ESC] / [H] to close
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