"use client";

import { useState } from "react";

export default function SupportBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Bottom Strip Banner ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-6"
        style={{
          height: 40,
          background: "linear-gradient(90deg, rgba(10,5,25,0.85) 0%, rgba(236,72,153,0.12) 40%, rgba(168,85,247,0.12) 60%, rgba(10,5,25,0.85) 100%)",
          borderTop: "1px solid rgba(236,72,153,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left — Made by */}
        <p style={{
          fontSize: "0.6rem",
          color: "rgba(76,29,149,0.7)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}>
          Made by Xfryy &nbsp;|&nbsp; 4th November Visual Novel
        </p>

        {/* Center — scrolling marquee text */}
        <div style={{ flex: 1, overflow: "hidden", margin: "0 24px", position: "relative" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            animation: "marquee 18s linear infinite",
            whiteSpace: "nowrap",
          }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{
                fontSize: "0.62rem",
                color: "rgba(236,72,153,0.5)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}>
                ✦ &nbsp; Support the author to keep this story alive &nbsp; ✦ &nbsp; Scan QR to donate &nbsp; ✦ &nbsp; Your support means everything &nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Right — Support button */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 transition-all active:scale-95"
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.25))",
            border: "1px solid rgba(236,72,153,0.45)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 12px rgba(236,72,153,0.2)",
            cursor: "pointer",
            animation: "support-glow 2.5s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 12 }}>💖</span>
          <span style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Support Author
          </span>
        </button>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden"
            style={{
              background: "rgba(12, 8, 28, 0.97)",
              border: "1px solid rgba(236,72,153,0.25)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(236,72,153,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full" style={{
              background: "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)"
            }} />

            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b" style={{
              borderColor: "rgba(236,72,153,0.1)"
            }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
                background: "rgba(236,72,153,0.12)",
                border: "1px solid rgba(236,72,153,0.25)",
              }}>
                <span style={{ fontSize: 18 }}>💖</span>
              </div>
              <div>
                <p className="text-white font-black text-sm">Support Author</p>
                <p className="text-purple-400 text-xs tracking-widest uppercase">4th November</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-purple-400 hover:text-white transition-colors text-lg"
              >✕</button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 flex flex-col gap-4">
              {/* Description card */}
              <div className="rounded-xl p-4 flex gap-3 items-start" style={{
                background: "rgba(236,72,153,0.06)",
                border: "1px solid rgba(236,72,153,0.12)",
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: "rgba(236,72,153,0.12)",
                }}>
                  <span style={{ fontSize: 18 }}>💖</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(167,139,250,0.85)" }}>
                  Sponsorship supports the author's work. No real rewards, but you can
                  leave feature requests in messages. The author will consider them.
                </p>
              </div>

              {/* QR Code */}
              <div>
                <p className="text-xs text-center mb-3 tracking-widest uppercase" style={{
                  color: "rgba(167,139,250,0.5)"
                }}>
                  Scan to support
                </p>

                <div className="flex justify-center">
                  <div className="relative rounded-2xl p-4" style={{
                    background: "white",
                    boxShadow: "0 0 32px rgba(236,72,153,0.35), 0 0 64px rgba(168,85,247,0.15)",
                  }}>
                    {/* Dummy QR */}
                    <div style={{
                      width: 160, height: 160,
                      display: "grid",
                      gridTemplateColumns: "repeat(11, 1fr)",
                      gap: 1.5,
                    }}>
                      {Array.from({ length: 121 }).map((_, i) => {
                        const row = Math.floor(i / 11);
                        const col = i % 11;
                        const topLeft = (row <= 3 && col <= 3) || (row === 4 && col <= 2) || (col === 4 && row <= 2);
                        const topRight = (row <= 3 && col >= 7) || (row === 4 && col >= 8) || (col === 6 && row <= 2);
                        const bottomLeft = (row >= 7 && col <= 3) || (row === 6 && col <= 2) || (col === 4 && row >= 8);
                        const isCorner = topLeft || topRight || bottomLeft;
                        const seed = (row * 11 + col) * 2654435761;
                        const isData = !isCorner && ((seed % 100) > 45);
                        return (
                          <div key={i} style={{
                            borderRadius: 1.5,
                            background: isCorner
                              ? `linear-gradient(135deg, #ec4899, #a855f7)`
                              : isData ? "#1a0a2e" : "transparent",
                          }} />
                        );
                      })}
                    </div>

                    {/* Center heart */}
                    <div style={{
                      position: "absolute",
                      top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 34, height: 34,
                      borderRadius: 10,
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>
                      <span style={{ fontSize: 18 }}>💖</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs mt-3" style={{ color: "rgba(236,72,153,0.45)" }}>
                  Replace with your real QR code
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 text-center">
              <p className="text-purple-800 text-xs tracking-widest uppercase">
                4th November Visual Novel
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        @keyframes support-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(236,72,153,0.2); }
          50%       { box-shadow: 0 0 20px rgba(236,72,153,0.5), 0 0 40px rgba(168,85,247,0.2); }
        }
      `}</style>
    </>
  );
}