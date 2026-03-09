"use client";

import { useState } from "react";

const ANNOUNCEMENTS = [
  {
    version: "v0.3.0",
    date: "March 8, 2026",
    tag: "UPDATE",
    tagColor: "#ec4899",
    title: "Main Menu Overhaul",
    items: [
      "🗓 Calendar sekarang tampil di tengah main menu",
      "👤 Profile card baru — klik untuk lihat stats kamu",
      "📢 Announcement panel (yang lagi kamu baca ini!)",
      "✨ Pin dekorasi di kalender",
    ],
  },
  {
    version: "v0.2.0",
    date: "February 14, 2026",
    tag: "STORY",
    tagColor: "#a855f7",
    title: "Act 1 — First Encounter",
    items: [
      "📖 Act 1 Scene 1–3 sekarang bisa dimainkan",
      "💬 Sistem dialogue pertama dengan Rinn",
      "🎭 Sprite Rinn animasi breathing effect",
      "🎵 Background music & ambient sound",
    ],
  },
  {
    version: "v0.1.0",
    date: "January 1, 2026",
    tag: "LAUNCH",
    tagColor: "#6366f1",
    title: "Early Access Launch",
    items: [
      "🚀 4th November Visual Novel dirilis!",
      "🔐 Login dengan Google account",
      "🧑 Sistem karakter & nama player",
      "🌌 Main menu dengan background animasi",
    ],
  },
];

export default function AnnouncementBell() {
  const [open, setOpen] = useState(false);

  return (
    // ── Satu wrapper besar — mouse leave dari sini baru nutup ──
    <div
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Icon button */}
      <button
        className="flex items-center justify-center transition-all active:scale-90 relative"
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: open ? "rgba(236,72,153,0.2)" : "rgba(15, 10, 35, 0.65)",
          border: open ? "1px solid rgba(236,72,153,0.6)" : "1px solid rgba(236,72,153,0.25)",
          backdropFilter: "blur(12px)",
          boxShadow: open
            ? "0 0 18px rgba(236,72,153,0.35), 0 4px 16px rgba(0,0,0,0.4)"
            : "0 4px 16px rgba(0,0,0,0.3)",
          transform: open ? "scale(1.08)" : "scale(1)",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: open ? "drop-shadow(0 0 6px rgba(236,72,153,0.8))" : "none",
            transition: "filter 0.2s ease",
          }}
        >
          <defs>
            <linearGradient id="megaGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path d="M3 10.5v3a1 1 0 001 1h2l4 3V6.5l-4 3H4a1 1 0 00-1 1z" fill="url(#megaGrad2)" />
          <path d="M10 6.5l7-4v15l-7-4" stroke="url(#megaGrad2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M19 8.5c.8.8 1.2 1.9 1.2 3s-.4 2.2-1.2 3" stroke="#ec4899" strokeWidth="1.6" strokeLinecap="round"
            opacity={open ? 1 : 0.5} style={{ transition: "opacity 0.2s ease" }} />
        </svg>

        {/* Notification dot */}
        <div style={{
          position: "absolute", top: 7, right: 7,
          width: 7, height: 7, borderRadius: "50%",
          background: "linear-gradient(135deg, #ec4899, #f472b6)",
          boxShadow: "0 0 6px rgba(236,72,153,0.9)",
          border: "1.5px solid rgba(12,8,28,0.9)",
          animation: "ping-dot 2s ease-in-out infinite",
        }} />
      </button>

      {/* Gap bridge — ngisi celah antara button dan panel biar mouse ga "keluar" */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            width: 320,
            height: 12, // tinggi = gap antara button dan panel
            background: "transparent",
          }}
        />
      )}

      {/* ── Dropdown panel ── */}
      <div
        className="absolute z-50"
        style={{
          top: "calc(100% + 10px)",
          right: 0,
          width: 320,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.15s ease, transform 0.15s ease",
        }}
      >
        {/* Arrow atas */}
        <div style={{
          position: "absolute", top: -6, right: 14,
          width: 12, height: 12,
          background: "rgba(12, 8, 28, 0.97)",
          border: "1px solid rgba(236,72,153,0.3)",
          borderBottom: "none", borderRight: "none",
          transform: "rotate(45deg)", zIndex: 1,
        }} />

        {/* Panel card */}
        <div className="rounded-2xl overflow-hidden" style={{
          background: "rgba(12, 8, 28, 0.97)",
          border: "1px solid rgba(236,72,153,0.25)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 0 32px rgba(236,72,153,0.1)",
          backdropFilter: "blur(20px)",
        }}>
          <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)" }} />

          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(236,72,153,0.1)" }}>
            <span style={{ fontSize: 14 }}>📢</span>
            <span className="font-black text-sm tracking-widest uppercase" style={{
              background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Announcements
            </span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{
              background: "rgba(236,72,153,0.15)",
              border: "1px solid rgba(236,72,153,0.3)",
              color: "#f472b6",
            }}>
              {ANNOUNCEMENTS.length} updates
            </span>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
            {ANNOUNCEMENTS.map((ann, i) => (
              <div key={i} className="px-4 py-4 border-b" style={{
                borderColor: "rgba(236,72,153,0.08)",
                background: i === 0 ? "rgba(236,72,153,0.04)" : "transparent",
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md tracking-wider" style={{
                    background: `${ann.tagColor}22`,
                    border: `1px solid ${ann.tagColor}55`,
                    color: ann.tagColor,
                  }}>
                    {ann.tag}
                  </span>
                  <span className="text-xs font-bold" style={{ color: ann.tagColor }}>{ann.version}</span>
                  <span className="text-purple-600 text-xs ml-auto">{ann.date}</span>
                </div>

                <p className="text-white font-bold text-sm mb-2">
                  {i === 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded mr-1 font-black" style={{
                      background: "rgba(236,72,153,0.2)", color: "#ec4899",
                      border: "1px solid rgba(236,72,153,0.4)",
                    }}>NEW</span>
                  )}
                  {ann.title}
                </p>

                <ul className="flex flex-col gap-1">
                  {ann.items.map((item, j) => (
                    <li key={j} className="text-xs leading-relaxed" style={{ color: "#a78bfa" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 text-center">
            <p className="text-purple-700 text-xs tracking-widest uppercase">4th November Visual Novel</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}