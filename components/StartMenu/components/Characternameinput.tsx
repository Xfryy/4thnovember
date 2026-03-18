"use client";

import { useState, useEffect, useRef } from "react";
import GameBackground from "./GameBackground";
import { useIsMobile } from "@/hooks/useIsMobile";

interface CharacterNameInputProps {
  isLoading: boolean;
  onSubmit: (name: string) => void;
}

export default function CharacterNameInput({ isLoading, onSubmit }: CharacterNameInputProps) {
  const [inputValue,  setInputValue]  = useState("");
  const [isFocused,   setIsFocused]   = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  // true when the short side of the device is < 480px (rotated-mobile landscape)
  const [isCompact,   setIsCompact]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkCompact = () => {
      // After LandscapeGuard rotates the screen, the effective rendered height
      // equals the device's physical width (100vw). We use the smaller dimension
      // of the physical screen to detect "short viewport" mode.
      setIsCompact(Math.min(window.innerWidth, window.innerHeight) < 480);
    };

    checkCompact();
    window.addEventListener("resize", checkCompact);
    window.addEventListener("orientationchange", checkCompact);

    const t = setTimeout(() => setMounted(true), 30);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", checkCompact);
      window.removeEventListener("orientationchange", checkCompact);
    };
  }, []);

  const handleSubmit = () => {
    const name = inputValue.trim();
    if (!name) {
      inputRef.current?.focus();
      inputRef.current?.classList.add("cni-shake");
      setTimeout(() => inputRef.current?.classList.remove("cni-shake"), 500);
      return;
    }
    onSubmit(name);
  };

  // ── Responsive values ────────────────────────────────────────────────────
  const cardPadding   = isCompact ? "14px 16px" : isMobile ? "24px 20px" : "32px 28px";
  const titleFontSize = isCompact ? "1.1rem"    : isMobile ? "1.35rem"   : "1.6rem";
  const titleMarginB  = isCompact ? 10           : isMobile ? 18          : 24;
  const subtitleSize  = isCompact ? "0.65rem"   : isMobile ? "0.72rem"   : "0.78rem";
  const inputPadding  = isCompact ? "8px 12px"  : isMobile ? "10px 14px" : "11px 16px";
  const inputFontSize = isCompact ? "0.88rem"   : isMobile ? "0.9rem"    : "0.95rem";
  const inputMarginB  = isCompact ? 8            : isMobile ? 14          : 18;
  const btnPadding    = isCompact ? "9px"        : isMobile ? "11px"      : "13px";
  const btnFontSize   = isCompact ? "0.82rem"   : isMobile ? "0.88rem"   : "0.95rem";

  return (
    // ── Outer wrapper — fills the entire rotated/normal container ──────────
    <div
      style={{
        position: "absolute",
        inset:    0,
        overflow: "hidden",
      }}
    >
      <GameBackground />

      {/* ── Main card — always centered via translate trick ── */}
      <div
        style={{
          position:  "absolute",
          top:       "50%",
          left:      "50%",
          transform: mounted
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -44%) scale(0.97)",
          zIndex:         10,
          width:          `calc(100% - ${isCompact ? 24 : isMobile ? 32 : 48}px)`,
          maxWidth:       isCompact ? 500 : 400,
          borderRadius:   isCompact ? 14 : 20,
          padding:        cardPadding,
          background:     "rgba(10,6,24,0.88)",
          backdropFilter: "blur(24px)",
          border:         "1px solid rgba(139,92,246,0.28)",
          boxShadow:      "0 12px 60px rgba(0,0,0,0.65), 0 0 40px rgba(139,92,246,0.12)",
          boxSizing:      "border-box",
          // Enter animation
          opacity:    mounted ? 1 : 0,
          transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position:   "absolute",
          top: 0, left: "10%", right: "10%",
          height:     2,
          borderRadius: "0 0 4px 4px",
          background: "linear-gradient(90deg, transparent, #ec4899 30%, #a855f7 70%, transparent)",
        }} />

        {/* ── Compact landscape: horizontal row (avatar inline with title) ── */}
        {isCompact ? (
          <div style={{
            display:        "flex",
            flexDirection:  "row",
            alignItems:     "center",
            gap:            14,
            marginBottom:   10,
            opacity:        mounted ? 1 : 0,
            transform:      mounted ? "translateY(0)" : "translateY(12px)",
            transition:     "opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s",
          }}>
            {/* Small avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                position:   "absolute",
                inset:      -3,
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, #ec4899, #a855f7, #6366f1, #ec4899)",
                animation:  "cni-spin 4s linear infinite",
                zIndex:     0,
              }} />
              <div style={{
                position:   "absolute",
                inset:      -1,
                borderRadius: "50%",
                background: "rgba(10,6,24,0.95)",
                zIndex:     1,
              }} />
              <div style={{
                position:     "relative",
                zIndex:       2,
                width:        52,
                height:       52,
                borderRadius: "50%",
                overflow:     "hidden",
                border:       "2px solid rgba(139,92,246,0.4)",
              }}>
                {!avatarError ? (
                  <img
                    src="/Image/Player.jpg"
                    alt="Player"
                    onError={() => setAvatarError(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    draggable={false}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))",
                    fontSize: 22,
                  }}>👤</div>
                )}
              </div>
            </div>

            {/* Title beside avatar */}
            <div>
              <h2 style={{
                margin:     "0 0 2px",
                fontSize:   titleFontSize,
                fontWeight: 900,
                letterSpacing: "0.04em",
                background: "linear-gradient(135deg, #f9a8d4, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                4th November
              </h2>
              <p style={{
                margin:    0,
                fontSize:  subtitleSize,
                color:     "rgba(167,139,250,0.7)",
                letterSpacing: "0.02em",
              }}>
                Masukkan nama karaktermu
              </p>
            </div>
          </div>

        ) : (
          <>
            {/* ── Normal: avatar centered ── */}
            <div style={{
              display:        "flex",
              justifyContent: "center",
              marginBottom:   isMobile ? 16 : 20,
              opacity:        mounted ? 1 : 0,
              transform:      mounted ? "translateY(0)" : "translateY(12px)",
              transition:     "opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s",
            }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position:   "absolute",
                  inset:      -4,
                  borderRadius: "50%",
                  background: "conic-gradient(from 0deg, #ec4899, #a855f7, #6366f1, #ec4899)",
                  animation:  "cni-spin 4s linear infinite",
                  zIndex:     0,
                }} />
                <div style={{
                  position:   "absolute",
                  inset:      -1,
                  borderRadius: "50%",
                  background: "rgba(10,6,24,0.95)",
                  zIndex:     1,
                }} />
                <div style={{
                  position:     "relative",
                  zIndex:       2,
                  width:        isMobile ? 80 : 96,
                  height:       isMobile ? 80 : 96,
                  borderRadius: "50%",
                  overflow:     "hidden",
                  border:       "2px solid rgba(139,92,246,0.4)",
                }}>
                  {!avatarError ? (
                    <img
                      src="/Image/Player.jpg"
                      alt="Player"
                      onError={() => setAvatarError(true)}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                      draggable={false}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2))",
                      fontSize: isMobile ? 28 : 34,
                    }}>👤</div>
                  )}
                </div>
              </div>
            </div>

            {/* Normal title */}
            <div style={{
              textAlign:    "center",
              marginBottom: titleMarginB,
              opacity:      mounted ? 1 : 0,
              transform:    mounted ? "translateY(0)" : "translateY(10px)",
              transition:   "opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s",
            }}>
              <h2 style={{
                margin:     "0 0 6px",
                fontSize:   titleFontSize,
                fontWeight: 900,
                letterSpacing: "0.04em",
                background: "linear-gradient(135deg, #f9a8d4, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                4th November
              </h2>
              <p style={{
                margin:    0,
                fontSize:  subtitleSize,
                color:     "rgba(167,139,250,0.7)",
                letterSpacing: "0.02em",
              }}>
                Selamat datang! Masukkan nama karaktermu
              </p>
            </div>
          </>
        )}

        {/* ── Input ── */}
        <div style={{
          marginBottom: inputMarginB,
          opacity:      mounted ? 1 : 0,
          transform:    mounted ? "translateY(0)" : "translateY(10px)",
          transition:   "opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.22s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.22s",
        }}>
          <label style={{
            display:       "block",
            marginBottom:  isCompact ? 5 : 8,
            fontSize:      isCompact ? "0.65rem" : isMobile ? "0.7rem" : "0.75rem",
            fontWeight:    700,
            color:         "rgba(196,181,253,0.8)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Nama Karakter
          </label>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Masukkan nama Anda..."
            disabled={isLoading}
            autoFocus={!isMobile}
            className="cni-input"
            style={{
              width:      "100%",
              boxSizing:  "border-box",
              padding:    inputPadding,
              borderRadius: 10,
              border:     isFocused
                ? "1.5px solid rgba(236,72,153,0.65)"
                : "1px solid rgba(139,92,246,0.35)",
              background: "rgba(139,92,246,0.1)",
              color:      "#fff",
              fontSize:   inputFontSize,
              outline:    "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              boxShadow:  isFocused
                ? "0 0 0 3px rgba(236,72,153,0.12), 0 0 18px rgba(236,72,153,0.1)"
                : "none",
            }}
          />
          {/* "Press Enter" hint — hidden in compact to save vertical space */}
          {!isCompact && (
            <div style={{
              height:    18,
              marginTop: 5,
              marginLeft: 4,
              fontSize:  "0.65rem",
              color:     "rgba(167,139,250,0.5)",
              opacity:   isFocused ? 1 : 0,
              transform: isFocused ? "translateY(0)" : "translateY(-4px)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}>
              Tekan Enter untuk melanjutkan
            </div>
          )}
        </div>

        {/* ── Button ── */}
        <div style={{
          opacity:   mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s",
        }}>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !inputValue.trim()}
            className="cni-btn"
            style={{
              position:   "relative",
              width:      "100%",
              padding:    btnPadding,
              borderRadius: 12,
              border:     "none",
              background: "linear-gradient(135deg, #ec4899, #a855f7)",
              color:      "#fff",
              fontSize:   btnFontSize,
              fontWeight: 800,
              letterSpacing: "0.06em",
              cursor:     "pointer",
              overflow:   "hidden",
              boxShadow:  "0 0 24px rgba(236,72,153,0.3)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
              opacity:    isLoading || !inputValue.trim() ? 0.42 : 1,
            }}
          >
            <span className="cni-shimmer" />
            {isLoading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg style={{ animation: "cni-spin-slow 0.9s linear infinite", width: 16, height: 16 }} viewBox="0 0 24 24">
                  <circle opacity=".25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Setting...
              </span>
            ) : (
              "Mulai Game"
            )}
          </button>
        </div>

        {/* ── Footer hint — hidden in compact ── */}
        {!isCompact && (
          <p style={{
            textAlign:  "center",
            marginTop:  14,
            marginBottom: 0,
            fontSize:   "0.62rem",
            color:      "rgba(139,92,246,0.4)",
            letterSpacing: "0.12em",
            opacity:    mounted ? 1 : 0,
            transition: "opacity 0.5s ease 0.45s",
          }}>
            ✦ Nama ini akan terlihat oleh pemain lain ✦
          </p>
        )}
      </div>

      {/* ── Decorative blobs ── */}
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)",
        filter: "blur(30px)",
        animation: "cni-blob 6s ease-in-out infinite alternate",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
        filter: "blur(30px)",
        animation: "cni-blob 6s ease-in-out infinite alternate-reverse",
        pointerEvents: "none",
      }} />

      <style>{`
        @keyframes cni-spin      { to { transform: rotate(360deg); } }
        @keyframes cni-spin-slow { to { transform: rotate(360deg); } }
        @keyframes cni-blob {
          from { transform: scale(1) translate(0,0); }
          to   { transform: scale(1.12) translate(16px,-12px); }
        }
        @keyframes cni-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        .cni-shake { animation: cni-shake 0.45s ease both; }
        .cni-input::placeholder { color: rgba(139,92,246,0.45); }
        .cni-btn:not(:disabled):hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 0 34px rgba(236,72,153,0.45) !important;
        }
        .cni-btn:not(:disabled):active {
          transform: scale(0.97);
          box-shadow: 0 0 14px rgba(236,72,153,0.25) !important;
        }
        .cni-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
          transform: translateX(-100%);
          transition: none;
        }
        .cni-btn:not(:disabled):hover .cni-shimmer {
          transform: translateX(100%);
          transition: transform 0.6s ease;
        }
      `}</style>
    </div>
  );
}