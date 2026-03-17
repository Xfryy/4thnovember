"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SupportBanner() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculateEffectiveWidth = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return h > w ? h : w;
    };
    const update = () => setIsMobile(calculateEffectiveWidth() < 640);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return (
    <>
      {/* ── Bottom Strip Banner ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 0,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: isMobile ? "calc(12px + env(safe-area-inset-left, 0px))" : "calc(24px + env(safe-area-inset-left, 0px))",
          paddingRight: isMobile ? "calc(12px + env(safe-area-inset-right, 0px))" : "calc(24px + env(safe-area-inset-right, 0px))",
          height: isMobile ? "calc(36px + env(safe-area-inset-bottom, 0px))" : "calc(40px + env(safe-area-inset-bottom, 0px))",
          background: "linear-gradient(90deg, rgba(10,5,25,0.85) 0%, rgba(236,72,153,0.12) 40%, rgba(168,85,247,0.12) 60%, rgba(10,5,25,0.85) 100%)",
          borderTop: "1px solid rgba(236,72,153,0.15)",
          backdropFilter: "blur(12px)",
          gap: 12,
        }}
      >
        {/* Left — Made by (hidden on very small screens) */}
        {!isMobile && (
          <p style={{
            fontSize: "0.55rem",
            color: "rgba(76,29,149,0.7)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            Made by Xfryy
          </p>
        )}

        {/* Center — scrolling marquee text */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
          minWidth: 0,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            animation: "marquee 18s linear infinite",
            whiteSpace: "nowrap",
          }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{
                fontSize: isMobile ? "0.55rem" : "0.62rem",
                color: "rgba(236,72,153,0.5)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                ✦ &nbsp; Support the author &nbsp; ✦ &nbsp; Scan QR to donate &nbsp; ✦ &nbsp; Your support means everything &nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Right — Support button */}
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 4 : 6,
            padding: isMobile ? "4px 10px" : "5px 14px",
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.25))",
            border: "1px solid rgba(236,72,153,0.45)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 12px rgba(236,72,153,0.2)",
            cursor: "pointer",
            animation: "support-glow 2.5s ease-in-out infinite",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: isMobile ? 10 : 12 }}>💖</span>
          <span style={{
            fontSize: isMobile ? "0.55rem" : "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            whiteSpace: "nowrap",
          }}>
            {isMobile ? "Support" : "Support Author"}
          </span>
        </button>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            padding: 16,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 360,
              borderRadius: 24,
              overflow: "hidden",
              background: "rgba(12, 8, 28, 0.97)",
              border: "1px solid rgba(236,72,153,0.25)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(236,72,153,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div style={{
              height: 4,
              background: "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)",
            }} />

            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              borderBottom: "1px solid rgba(236,72,153,0.1)",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(236,72,153,0.12)",
                border: "1px solid rgba(236,72,153,0.25)",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 18 }}>💖</span>
              </div>
              <div>
                <p style={{ margin: 0, color: "#fff", fontWeight: 900, fontSize: "0.9rem" }}>Support Author</p>
                <p style={{ margin: 0, color: "#a855f7", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>4th November</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: "#a855f7",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: 4,
                }}
              >✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Description */}
              <div style={{
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                background: "rgba(236,72,153,0.06)",
                border: "1px solid rgba(236,72,153,0.12)",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>💖</span>
                <p style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  lineHeight: 1.7,
                  color: "rgba(167,139,250,0.85)",
                }}>
                  Sponsorship supports the author's work. No real rewards, but you can
                  leave feature requests in messages.
                </p>
              </div>

              {/* QR Code */}
              <div>
                <p style={{
                  textAlign: "center",
                  fontSize: "0.6rem",
                  marginBottom: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(167,139,250,0.5)",
                }}>
                  Scan to support
                </p>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{
                    position: "relative",
                    borderRadius: 16,
                    padding: 16,
                    background: "white",
                    boxShadow: "0 0 32px rgba(236,72,153,0.35), 0 0 64px rgba(168,85,247,0.15)",
                  }}>
                    <div style={{
                      position: "relative",
                      width: 200,
                      height: 200,
                      borderRadius: 12,
                      overflow: "hidden"
                    }}>
                      <Image
                        src="/My_QRCODE.jpeg"
                        alt="Support QR Code"
                        fill
                        unoptimized
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <a
                    href="/My_QRCODE.jpeg"
                    download="Support_4thNovember_QR.jpeg"
                    style={{
                      background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))",
                      border: "1px solid rgba(236,72,153,0.4)",
                      color: "#f9a8d4",
                      padding: "8px 16px",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "0 4px 12px rgba(236,72,153,0.15)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(236,72,153,0.35), rgba(168,85,247,0.35))";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))";
                      e.currentTarget.style.color = "#f9a8d4";
                    }}
                  >
                    <span>📥</span> Download QR Code
                  </a>
                </div>

                <p style={{
                  textAlign: "center",
                  fontSize: "0.6rem",
                  marginTop: 10,
                  color: "rgba(236,72,153,0.45)",
                }}>
                  Thank you for playing!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "0 20px 16px", textAlign: "center" }}>
              <p style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(107,70,193,0.5)",
                margin: 0,
              }}>
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