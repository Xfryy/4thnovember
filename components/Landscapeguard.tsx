"use client";

import { useEffect, useState } from "react";

/**
 * LandscapeGuard
 * Blocks the game jika:
 * - Layar terlalu kecil (< 900px lebar atau < 500px tinggi)
 * - Orientasi portrait (tinggi > lebar) — HP/tablet di-vertical
 *
 * Cara pakai: Wrap di layout.tsx atau page.tsx
 * <LandscapeGuard>{children}</LandscapeGuard>
 */

const MIN_WIDTH  = 900;
const MIN_HEIGHT = 500;

export default function LandscapeGuard({ children }: { children: React.ReactNode }) {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isPortrait  = h > w;
      const isTooSmall  = w < MIN_WIDTH || h < MIN_HEIGHT;
      setBlocked(isPortrait || isTooSmall);
    };

    check();
    window.addEventListener("resize",             check);
    window.addEventListener("orientationchange",  check);
    return () => {
      window.removeEventListener("resize",            check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return (
    <>
      {/* ── OVERLAY ─────────────────────────────────────────────── */}
      {blocked && (
        <div style={styles.overlay}>
          {/* scanlines texture */}
          <div style={styles.scanlines} />

          {/* ambient glow */}
          <div style={styles.glow} />

          {/* rotating phone icon */}
          <div style={styles.iconWrap}>
            <svg viewBox="0 0 64 64" fill="none" style={{ width: "100%", height: "100%" }}>
              {/* phone body */}
              <rect x="18" y="8" width="28" height="48" rx="5" ry="5"
                stroke="#ec4899" strokeWidth="3" fill="none" />
              <line x1="18" y1="18" x2="46" y2="18" stroke="#ec4899" strokeWidth="2" />
              <line x1="18" y1="46" x2="46" y2="46" stroke="#ec4899" strokeWidth="2" />
              <circle cx="32" cy="52" r="2" fill="#ec4899" />
              {/* rotate arrow */}
              <path d="M50 22 A18 18 0 0 1 14 42" stroke="#a855f7" strokeWidth="2.5"
                strokeLinecap="round" fill="none" />
              <polygon points="10,38 14,45 18,39" fill="#a855f7" />
            </svg>
          </div>

          {/* title */}
          <p style={styles.title}>
            Putar Layarmu ke&nbsp;
            <span style={{ color: "#ec4899" }}>Landscape</span>
          </p>

          {/* subtitle */}
          <p style={styles.sub}>
            Game ini dirancang untuk tampilan <strong style={{ color: "#fff" }}>horizontal</strong>.
            <br />
            Silakan putar perangkatmu atau perlebar jendela browser.
          </p>

          {/* badge */}
          <div style={styles.badge}>
            <span style={styles.dot} />
            Direkomendasikan: minimal {MIN_WIDTH} × {MIN_HEIGHT} px
          </div>

          <style>{`
            @keyframes lg-wiggle {
              0%,100% { transform: rotate(0deg); }
              25%      { transform: rotate(-85deg); }
              55%      { transform: rotate(-85deg); }
              80%      { transform: rotate(0deg); }
            }
            @keyframes lg-pulse-dot {
              0%,100% { opacity: 1; }
              50%      { opacity: 0.2; }
            }
          `}</style>
        </div>
      )}

      {/* ── GAME CONTENT ────────────────────────────────────────── */}
      <div style={{ visibility: blocked ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
}

// ── Inline styles ────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position:       "fixed",
    inset:          0,
    zIndex:         99999,
    background:     "#000",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "28px",
    padding:        "40px 24px",
    textAlign:      "center",
    userSelect:     "none",
  },
  scanlines: {
    position:        "absolute",
    inset:           0,
    pointerEvents:   "none",
    backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
  },
  glow: {
    position:     "absolute",
    top:          "35%",
    left:         "50%",
    transform:    "translate(-50%, -50%)",
    width:        "320px",
    height:       "160px",
    borderRadius: "50%",
    background:   "radial-gradient(ellipse, rgba(236,72,153,0.12) 0%, transparent 70%)",
    filter:       "blur(32px)",
    pointerEvents:"none",
  },
  iconWrap: {
    width:     "88px",
    height:    "88px",
    animation: "lg-wiggle 2.6s ease-in-out infinite",
    position:  "relative",
    zIndex:    1,
    filter:    "drop-shadow(0 0 12px rgba(236,72,153,0.6))",
  },
  title: {
    fontFamily:  "'Sora', 'Inter', system-ui, sans-serif",
    fontWeight:  800,
    fontSize:    "clamp(18px, 5vw, 28px)",
    color:       "#fff",
    letterSpacing: "-0.3px",
    lineHeight:  1.2,
    margin:      0,
    position:    "relative",
    zIndex:      1,
  },
  sub: {
    fontFamily:  "'Inter', system-ui, sans-serif",
    fontSize:    "clamp(12px, 2.5vw, 14px)",
    color:       "rgba(255,255,255,0.45)",
    lineHeight:  1.75,
    margin:      0,
    maxWidth:    "340px",
    position:    "relative",
    zIndex:      1,
  },
  badge: {
    display:        "inline-flex",
    alignItems:     "center",
    gap:            "8px",
    background:     "rgba(255,255,255,0.04)",
    border:         "1px solid rgba(255,255,255,0.08)",
    borderRadius:   "999px",
    padding:        "8px 18px",
    fontFamily:     "monospace",
    fontSize:       "11px",
    color:          "rgba(236,72,153,0.8)",
    letterSpacing:  "0.07em",
    textTransform:  "uppercase",
    position:       "relative",
    zIndex:         1,
  },
  dot: {
    display:      "inline-block",
    width:        "6px",
    height:       "6px",
    borderRadius: "50%",
    background:   "#ec4899",
    boxShadow:    "0 0 6px #ec4899",
    animation:    "lg-pulse-dot 1.3s ease-in-out infinite",
    flexShrink:   0,
  },
};