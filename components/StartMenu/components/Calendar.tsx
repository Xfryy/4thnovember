"use client";

import { useState, useEffect } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const calendarDays: { day: number; isCurrentMonth: boolean; isToday?: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  for (let i = 1; i <= daysInMonth; i++)
    calendarDays.push({ day: i, isCurrentMonth: true, isToday: i === today });
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++)
    calendarDays.push({ day: i, isCurrentMonth: false });

  return (
    <div style={{ paddingTop: 28, position: "relative" }}>
      <style>{`
        @keyframes pin-sway {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(4deg); }
        }
        @keyframes pin-glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(236,72,153,0.6)) drop-shadow(0 0 12px rgba(168,85,247,0.3)); }
          50%       { filter: drop-shadow(0 0 12px rgba(236,72,153,0.9)) drop-shadow(0 0 24px rgba(168,85,247,0.6)); }
        }
        @keyframes calendar-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes today-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236,72,153,0.4), inset 0 0 8px rgba(236,72,153,0.2); }
          50%       { box-shadow: 0 0 0 4px rgba(236,72,153,0.1), inset 0 0 12px rgba(236,72,153,0.3); }
        }
      `}</style>

      {/* ── PIN ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 32,
          zIndex: 10,
          transformOrigin: "50% 100%",
          animation: "pin-sway 4s ease-in-out infinite",
        }}
      >
        <div style={{
          width: 1.5,
          height: 18,
          background: "linear-gradient(180deg, rgba(236,72,153,0.8), rgba(168,85,247,0.3))",
          margin: "0 auto",
          borderRadius: 2,
        }} />

        <div style={{ animation: "pin-glow-pulse 2.5s ease-in-out infinite" }}>
          <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="pinHead" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="40%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#9d174d" />
              </radialGradient>
              <radialGradient id="pinShine" cx="30%" cy="25%" r="40%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <linearGradient id="pinNeedle" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <filter id="pinShadow">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
              </filter>
            </defs>
            <circle cx="16" cy="14" r="13" fill="url(#pinHead)" filter="url(#pinShadow)" />
            <circle cx="16" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx="16" cy="14" r="13" fill="url(#pinShine)" />
            <path
              d="M16 8 L17.2 12.8 L22 14 L17.2 15.2 L16 20 L14.8 15.2 L10 14 L14.8 12.8 Z"
              fill="rgba(255,255,255,0.9)"
            />
            <path d="M15 26 L16 38 L17 26 Z" fill="url(#pinNeedle)" filter="url(#pinShadow)" />
            <line x1="16" y1="27" x2="16" y2="36" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* ── CALENDAR CARD ── */}
      <div
        style={{
          background: "rgba(10, 6, 25, 0.75)",
          border: "1px solid rgba(236,72,153,0.25)",
          borderRadius: 20,
          padding: "24px 20px 20px",
          backdropFilter: "blur(20px)",
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.5),
            0 0 0 1px rgba(168,85,247,0.1),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          animation: "calendar-float 6s ease-in-out infinite",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top edge glow line */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.6), rgba(168,85,247,0.6), transparent)",
        }} />

        {/* Corner decorations */}
        {[
          { top: 8, left: 8 },
          { top: 8, right: 8 },
          { bottom: 8, left: 8 },
          { bottom: 8, right: 8 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 6, height: 6,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(236,72,153,0.4)" : "rgba(168,85,247,0.4)",
            boxShadow: `0 0 6px ${i % 2 === 0 ? "rgba(236,72,153,0.6)" : "rgba(168,85,247,0.6)"}`,
          }} />
        ))}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{
            fontSize: "1.4rem",
            fontWeight: 900,
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg, #f9a8d4, #ec4899, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 4,
          }}>
            {monthNames[month]} {year}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ height: 1, width: 24, background: "linear-gradient(to right, transparent, rgba(236,72,153,0.5))" }} />
            <p style={{ fontSize: "0.65rem", color: "rgba(196,181,253,0.7)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
              Today is {dayNames[currentDate.getDay()]}
            </p>
            <div style={{ height: 1, width: 24, background: "linear-gradient(to left, transparent, rgba(236,72,153,0.5))" }} />
          </div>
        </div>

        {/* Day names */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {dayNames.map((d) => (
            <div key={d} style={{
              textAlign: "center",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(236,72,153,0.55)",
            }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {calendarDays.map((item, idx) => (
            <div
              key={idx}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                fontSize: "0.8rem",
                fontWeight: item.isCurrentMonth ? 700 : 400,
                position: "relative",
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: item.isToday
                  ? "linear-gradient(135deg, #ec4899, #a855f7)"
                  : item.isCurrentMonth
                  ? "rgba(139,92,246,0.12)"
                  : "rgba(139,92,246,0.04)",
                color: item.isToday
                  ? "#fff"
                  : item.isCurrentMonth
                  ? "#c4b5fd"
                  : "rgba(107,114,128,0.5)",
                border: item.isToday
                  ? "1px solid rgba(236,72,153,0.8)"
                  : item.isCurrentMonth
                  ? "1px solid rgba(236,72,153,0.12)"
                  : "1px solid transparent",
                animation: item.isToday ? "today-pulse 2s ease-in-out infinite" : "none",
                transform: item.isToday ? "scale(1.08)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (item.isCurrentMonth && !item.isToday) {
                  e.currentTarget.style.background = "rgba(236,72,153,0.25)";
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.border = "1px solid rgba(236,72,153,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (item.isCurrentMonth && !item.isToday) {
                  e.currentTarget.style.background = "rgba(139,92,246,0.12)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.border = "1px solid rgba(236,72,153,0.12)";
                }
              }}
            >
              {item.day}
              {item.isToday && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 8,
                  background: "linear-gradient(135deg, #ec4899, #a855f7)",
                  opacity: 0.3, filter: "blur(8px)", zIndex: -1,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: "1px solid rgba(236,72,153,0.1)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(167,139,250,0.7)", letterSpacing: "0.1em" }}>
            ✦ &nbsp;
            <span style={{ fontWeight: 700, color: "rgba(196,181,253,0.9)" }}>
              {monthNames[month]} {today}, {year}
            </span>
            &nbsp; ✦
          </p>
        </div>
      </div>
    </div>
  );
}