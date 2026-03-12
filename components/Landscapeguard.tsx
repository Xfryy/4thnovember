"use client";

import { useEffect, useState } from "react";

/**
 * LandscapeGuard
 * Memastikan game bisa dimainkan di HP dengan orientasi landscape.
 * 
 * Aturan:
 * - Jika lebar < tinggi (portrait) → block
 * - Jika lebar >= 600px (landscape) → allow, meskipun layarnya kecil
 * - Jika lebar >= 900px (desktop) → allow
 * - Hanya block jika benar-benar portrait dan layar terlalu kecil
 */

// Minimal lebar untuk landscape mode di HP
const MIN_LANDSCAPE_WIDTH = 600;
// Minimal tinggi untuk landscape mode
const MIN_LANDSCAPE_HEIGHT = 320;

export default function LandscapeGuard({ children }: { children: React.ReactNode }) {
  const [blocked, setBlocked] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Logika baru:
      // 1. Jika landscape (lebar > tinggi) DAN lebar cukup → OK
      // 2. Jika lebar >= 900 (desktop) → OK
      // 3. Jika portrait (tinggi > lebar) DAN lebar kecil → BLOCK
      
      const isPortrait = h > w;
      const isLandscapeButTooSmall = !isPortrait && w < MIN_LANDSCAPE_WIDTH;
      const isPortraitAndTooSmall = isPortrait && w < MIN_LANDSCAPE_WIDTH;
      
      // Block jika:
      // - Portrait dan layar kecil
      // - Landscape tapi layar terlalu kecil (jarang terjadi)
      setBlocked(isPortraitAndTooSmall || isLandscapeButTooSmall);
    };

    check();
    
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  // Jangan render overlay di server
  if (!isClient) {
    return <>{children}</>;
  }

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
              {/* phone body - rotated to landscape */}
              <rect x="8" y="18" width="48" height="28" rx="5" ry="5"
                stroke="#ec4899" strokeWidth="3" fill="none" />
              <line x1="18" y1="22" x2="46" y2="22" stroke="#ec4899" strokeWidth="2" />
              <line x1="18" y1="42" x2="46" y2="42" stroke="#ec4899" strokeWidth="2" />
              <circle cx="52" cy="32" r="2" fill="#ec4899" />
              {/* rotate arrow - menunjukkan putaran ke landscape */}
              <path d="M22 50 A18 18 0 0 1 42 14" stroke="#a855f7" strokeWidth="2.5"
                strokeLinecap="round" fill="none" />
              <polygon points="38,10 45,14 39,18" fill="#a855f7" />
            </svg>
          </div>

          {/* title */}
          <p style={styles.title}>
            Putar ke Mode&nbsp;
            <span style={{ color: "#ec4899" }}>Landscape</span>
          </p>

          {/* subtitle */}
          <p style={styles.sub}>
            Game ini dirancang untuk tampilan horizontal.
            <br />
            <strong style={{ color: "#fff" }}>Putar HP-mu ke samping</strong> untuk melanjutkan.
          </p>

          {/* info badge */}
          <div style={styles.badge}>
            <span style={styles.dot} />
            {window.innerWidth} × {window.innerHeight} px
          </div>

          {/* hint kecil */}
          <p style={styles.hint}>
            Landscape minimal {MIN_LANDSCAPE_WIDTH} × {MIN_LANDSCAPE_HEIGHT} px
          </p>

          <style>{`
            @keyframes lg-rotate-phone {
              0%,100% { transform: rotate(0deg); }
              30%,70% { transform: rotate(-90deg); }
            }
            @keyframes lg-pulse-dot {
              0%,100% { opacity: 1; }
              50%      { opacity: 0.2; }
            }
          `}</style>
        </div>
      )}

      {/* ── GAME CONTENT ────────────────────────────────────────── */}
      <div style={{ 
        display: blocked ? "none" : "block",
        width: "100%",
        height: "100%",
      }}>
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
    gap:            "20px",
    padding:        "24px 20px",
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
    width:        "280px",
    height:       "140px",
    borderRadius: "50%",
    background:   "radial-gradient(ellipse, rgba(236,72,153,0.15) 0%, transparent 70%)",
    filter:       "blur(32px)",
    pointerEvents:"none",
  },
  iconWrap: {
    width:     "76px",
    height:    "76px",
    animation: "lg-rotate-phone 2.2s ease-in-out infinite",
    position:  "relative",
    zIndex:    1,
    filter:    "drop-shadow(0 0 15px rgba(236,72,153,0.7))",
  },
  title: {
    fontFamily:  "'Sora', 'Inter', system-ui, sans-serif",
    fontWeight:  800,
    fontSize:    "clamp(20px, 6vw, 30px)",
    color:       "#fff",
    letterSpacing: "-0.3px",
    lineHeight:  1.2,
    margin:      0,
    position:    "relative",
    zIndex:      1,
  },
  sub: {
    fontFamily:  "'Inter', system-ui, sans-serif",
    fontSize:    "clamp(13px, 3vw, 15px)",
    color:       "rgba(255,255,255,0.6)",
    lineHeight:  1.6,
    margin:      "4px 0 0",
    maxWidth:    "320px",
    position:    "relative",
    zIndex:      1,
  },
  badge: {
    display:        "inline-flex",
    alignItems:     "center",
    gap:            "8px",
    background:     "rgba(236,72,153,0.08)",
    border:         "1px solid rgba(236,72,153,0.2)",
    borderRadius:   "999px",
    padding:        "6px 16px",
    fontFamily:     "monospace",
    fontSize:       "12px",
    color:          "#ec4899",
    letterSpacing:  "0.05em",
    position:       "relative",
    zIndex:         1,
    marginTop:      "8px",
  },
  dot: {
    display:      "inline-block",
    width:        "6px",
    height:       "6px",
    borderRadius: "50%",
    background:   "#ec4899",
    boxShadow:    "0 0 8px #ec4899",
    animation:    "lg-pulse-dot 1.3s ease-in-out infinite",
    flexShrink:   0,
  },
  hint: {
    fontFamily:  "monospace",
    fontSize:    "10px",
    color:       "rgba(255,255,255,0.2)",
    letterSpacing: "0.1em",
    margin:      "4px 0 0",
    position:    "relative",
    zIndex:      1,
  },
};