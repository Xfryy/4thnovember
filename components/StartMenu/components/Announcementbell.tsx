"use client";

import { useState } from "react";

const ANNOUNCEMENTS = [
  {
    version: "v0.0.1",
    date: "March 2026",
    tag: "DEMO",
    tagColor: "#f59e0b",
    title: "Demo Release — Masih Dalam Pengembangan",
    badge: "NEW",
    warning: true,
    items: [
      "⚠️ Ini versi demo awal — masih banyak bug & lag, mohon dimaklumi",
      "🐢 Performa belum optimal, developer sedang terus improve",
      "🎭 Act 1 & Act 2 tersedia — tapi ini masih dummy story, bukan cerita aslinya",
      "📝 Cerita, karakter, dan aset final masih dalam proses pengerjaan",
      "🔮 Versi lengkap akan hadir dengan cerita asli dan semua fitur",
    ],
  },
];

const DEV_NOTES = [
  "Sistem save/load masih bisa tidak stabil",
  "Audio mungkin tidak keluar di beberapa browser",
  "Animasi bisa lag di perangkat yang kurang powerful",
  "Story Act 1 & 2 adalah placeholder — bukan cerita final",
];

export default function AnnouncementBell() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex items-center" style={{ position: "relative", zIndex: 40 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Icon button */}
      <button
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: open ? "rgba(245,158,11,0.18)" : "rgba(10,6,22,0.7)",
          border: open ? "1px solid rgba(245,158,11,0.55)" : "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(12px)",
          boxShadow: open
            ? "0 0 20px rgba(245,158,11,0.25), 0 4px 16px rgba(0,0,0,0.5)"
            : "0 4px 16px rgba(0,0,0,0.35)",
          transform: open ? "scale(1.06)" : "scale(1)",
          transition: "all 0.18s ease",
          cursor: "pointer",
        }}
      >
        {/* Megaphone icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: open ? "drop-shadow(0 0 5px rgba(245,158,11,0.7))" : "none",
            transition: "filter 0.2s ease",
          }}
        >
          <defs>
            <linearGradient id="annoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={open ? "#fcd34d" : "#f59e0b"} />
              <stop offset="100%" stopColor={open ? "#f59e0b" : "#d97706"} />
            </linearGradient>
          </defs>
          <path d="M3 10.5v3a1 1 0 001 1h2l4 3V6.5l-4 3H4a1 1 0 00-1 1z" fill="url(#annoGrad)" opacity="0.9" />
          <path d="M10 6.5l7-4v15l-7-4" stroke="url(#annoGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M19 8.5c.8.8 1.2 1.9 1.2 3s-.4 2.2-1.2 3"
            stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round"
            opacity={open ? 1 : 0.45}
            style={{ transition: "opacity 0.2s ease" }}
          />
        </svg>

        {/* Amber notification dot */}
        <div style={{
          position: "absolute", top: 7, right: 7,
          width: 6, height: 6, borderRadius: "50%",
          background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
          boxShadow: "0 0 6px rgba(245,158,11,0.9)",
          border: "1.5px solid rgba(8,5,18,0.9)",
          animation: "ann-ping 2.2s ease-in-out infinite",
        }} />
      </button>

      {/* Gap bridge */}
      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0,
          width: 340, height: 12,
          background: "transparent",
        }} />
      )}

      {/* ── Dropdown panel ── */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          width: 340,
          zIndex: 45,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-5px) scale(0.98)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.16s ease, transform 0.16s ease",
        }}
      >
        {/* Arrow */}
        <div style={{
          position: "absolute", top: -6, right: 13,
          width: 11, height: 11,
          background: "rgba(10,6,22,0.98)",
          border: "1px solid rgba(245,158,11,0.28)",
          borderBottom: "none", borderRight: "none",
          transform: "rotate(45deg)", zIndex: 1,
        }} />

        {/* Panel */}
        <div style={{
          borderRadius: 14,
          overflow: "hidden",
          background: "rgba(10,6,22,0.98)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,158,11,0.08)",
          backdropFilter: "blur(20px)",
        }}>

          {/* Top accent bar */}
          <div style={{
            height: 2,
            background: "linear-gradient(90deg, transparent, #f59e0b 30%, #ec4899 65%, #6366f1 90%, transparent)",
          }} />

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(245,158,11,0.04)",
          }}>
            <span style={{ fontSize: 13 }}>📢</span>
            <span style={{
              fontSize: "0.62rem", fontWeight: 900,
              letterSpacing: "0.25em", textTransform: "uppercase",
              background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Announcements
            </span>
            {/* Demo badge */}
            <span style={{
              marginLeft: "auto",
              fontSize: "0.48rem", fontWeight: 900,
              letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "2px 7px",
              borderRadius: 4,
              background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.35)",
              color: "#fcd34d",
            }}>
              DEMO BUILD
            </span>
          </div>

          {/* ── Warning banner ── */}
          <div style={{
            margin: "10px 12px 0",
            padding: "9px 12px",
            borderRadius: 9,
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.22)",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>⚠️</span>
            <div>
              <p style={{
                margin: "0 0 3px",
                fontSize: "0.62rem", fontWeight: 800,
                color: "#fcd34d", letterSpacing: "0.06em",
              }}>
                Masih Dalam Tahap Pengembangan
              </p>
              <p style={{
                margin: 0,
                fontSize: "0.58rem",
                color: "rgba(253,211,77,0.6)",
                lineHeight: 1.6,
                letterSpacing: "0.02em",
              }}>
                Mungkin ada bug, lag, atau fitur yang belum berfungsi. Developer akan terus improve ke depannya. Terima kasih atas pengertiannya! 🙏
              </p>
            </div>
          </div>

          {/* ── Main announcement ── */}
          {ANNOUNCEMENTS.map((ann, i) => (
            <div key={i} style={{
              padding: "12px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{
                  fontSize: "0.5rem", fontWeight: 900,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  padding: "2px 7px", borderRadius: 4,
                  background: `${ann.tagColor}22`,
                  border: `1px solid ${ann.tagColor}55`,
                  color: ann.tagColor,
                }}>
                  {ann.tag}
                </span>
                <span style={{
                  fontSize: "0.6rem", fontWeight: 800,
                  color: ann.tagColor, letterSpacing: "0.06em",
                }}>
                  {ann.version}
                </span>
                <span style={{
                  marginLeft: "auto",
                  fontSize: "0.52rem",
                  color: "rgba(167,139,250,0.45)",
                  letterSpacing: "0.05em",
                }}>
                  {ann.date}
                </span>
              </div>

              {/* Title */}
              <p style={{
                margin: "0 0 8px",
                fontSize: "0.75rem", fontWeight: 800,
                color: "#fff", letterSpacing: "0.02em",
                lineHeight: 1.4,
              }}>
                {ann.title}
              </p>

              {/* Items */}
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                {ann.items.map((item, j) => (
                  <li key={j} style={{
                    fontSize: "0.62rem",
                    color: "rgba(196,181,253,0.65)",
                    lineHeight: 1.6,
                    letterSpacing: "0.02em",
                    paddingLeft: 2,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Known issues section ── */}
          <div style={{ padding: "10px 14px 12px" }}>
            <p style={{
              fontSize: "0.52rem", fontWeight: 900,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(248,113,113,0.55)",
              marginBottom: 7,
            }}>
              Known Issues
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
              {DEV_NOTES.map((note, i) => (
                <li key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 6,
                  fontSize: "0.58rem",
                  color: "rgba(167,139,250,0.4)",
                  lineHeight: 1.6,
                  letterSpacing: "0.02em",
                }}>
                  <span style={{ color: "rgba(248,113,113,0.45)", flexShrink: 0 }}>—</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div style={{
            padding: "8px 14px 10px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}>
            <div style={{
              width: 20, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.3))",
            }} />
            <p style={{
              fontSize: "0.5rem",
              color: "rgba(107,70,193,0.45)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
            }}>
              4th November Visual Novel
            </p>
            <div style={{
              width: 20, height: 1,
              background: "linear-gradient(90deg, rgba(245,158,11,0.3), transparent)",
            }} />
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes ann-ping {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.35); opacity: 0.65; }
        }
      `}</style>
    </div>
  );
}