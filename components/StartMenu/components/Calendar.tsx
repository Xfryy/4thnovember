"use client";

import { useState, useEffect } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    setCurrentDate(new Date());
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--)
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++)
    calendarDays.push({ day: i, isCurrentMonth: true, isToday: i === today });
  
  // Next month days
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++)
    calendarDays.push({ day: i, isCurrentMonth: false });

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const pinSize = isMobile ? 20 : 28;

  return (
    <div style={{ 
      paddingTop: isMobile ? 16 : 24, 
      position: "relative",
      width: '100%',
      maxWidth: isMobile ? 300 : isTablet ? 360 : 400,
      margin: '0 auto'
    }}>
      <style>{`
        @keyframes pin-sway {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(3deg); }
        }
        @keyframes pin-glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(236,72,153,0.5)) drop-shadow(0 0 8px rgba(168,85,247,0.2)); }
          50%       { filter: drop-shadow(0 0 8px rgba(236,72,153,0.8)) drop-shadow(0 0 16px rgba(168,85,247,0.4)); }
        }
        @keyframes calendar-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }
        @keyframes today-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236,72,153,0.3), inset 0 0 6px rgba(236,72,153,0.2); }
          50%       { box-shadow: 0 0 0 3px rgba(236,72,153,0.1), inset 0 0 10px rgba(236,72,153,0.3); }
        }
        @keyframes calendarAppear {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .calendar-card {
          animation: calendarAppear 0.4s cubic-bezier(0.2, 0.9, 0.3, 1) forwards,
                     calendar-float 5s ease-in-out infinite 0.5s;
        }
      `}</style>

      {/* PIN - Simplified for mobile */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? -3 : 0,
          left: isMobile ? 12 : 28,
          zIndex: 10,
          transformOrigin: "50% 100%",
          animation: "pin-sway 4s ease-in-out infinite",
        }}
      >
        <div style={{
          width: 1.5,
          height: isMobile ? 12 : 16,
          background: "linear-gradient(180deg, rgba(236,72,153,0.8), rgba(168,85,247,0.3))",
          margin: "0 auto",
          borderRadius: 2,
        }} />

        <div style={{ animation: "pin-glow-pulse 2.5s ease-in-out infinite" }}>
          <svg width={pinSize} height={pinSize + 4} viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="pinHead" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="40%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#9d174d" />
              </radialGradient>
              <filter id="pinShadow">
                <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" floodColor="rgba(0,0,0,0.5)" />
              </filter>
            </defs>
            <circle cx="16" cy="14" r="12" fill="url(#pinHead)" filter="url(#pinShadow)" />
            <circle cx="16" cy="14" r="9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <path
              d="M16 9 L17 12.5 L21 14 L17 15.5 L16 19 L15 15.5 L11 14 L15 12.5 Z"
              fill="rgba(255,255,255,0.8)"
            />
            <path d="M15 26 L16 36 L17 26 Z" fill="#94a3b8" filter="url(#pinShadow)" />
          </svg>
        </div>
      </div>

      {/* CALENDAR CARD */}
      <div
        className="calendar-card"
        style={{
          background: "rgba(10, 6, 25, 0.85)",
          border: "1px solid rgba(236,72,153,0.25)",
          borderRadius: isMobile ? 14 : 18,
          padding: isMobile ? "14px 10px 10px" : "20px 16px 16px",
          backdropFilter: "blur(16px)",
          boxShadow: `
            0 8px 24px rgba(0,0,0,0.5),
            0 0 0 1px rgba(168,85,247,0.1),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top edge glow line */}
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.5), rgba(168,85,247,0.5), transparent)",
        }} />

        {/* Corner decorations - simplified for mobile */}
        {!isMobile && [
          { top: 6, left: 6 },
          { top: 6, right: 6 },
          { bottom: 6, left: 6 },
          { bottom: 6, right: 6 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(236,72,153,0.4)" : "rgba(168,85,247,0.4)",
            boxShadow: `0 0 4px ${i % 2 === 0 ? "rgba(236,72,153,0.5)" : "rgba(168,85,247,0.5)"}`,
          }} />
        ))}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 10 : 16 }}>
          <h2 style={{
            fontSize: isMobile ? "1rem" : "1.3rem",
            fontWeight: 800,
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg, #f9a8d4, #ec4899, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 2,
          }}>
            {monthNames[month]} {year}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 4 : 8 }}>
            <div style={{ height: 1, width: isMobile ? 12 : 20, background: "linear-gradient(to right, transparent, rgba(236,72,153,0.4))" }} />
            <p style={{ fontSize: isMobile ? "0.5rem" : "0.6rem", color: "rgba(196,181,253,0.6)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {isMobile ? dayNames[currentDate.getDay()] : `Today is ${dayNames[currentDate.getDay()]}`}
            </p>
            <div style={{ height: 1, width: isMobile ? 12 : 20, background: "linear-gradient(to left, transparent, rgba(236,72,153,0.4))" }} />
          </div>
        </div>

        {/* Day names */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)", 
          gap: isMobile ? 1 : 3, 
          marginBottom: isMobile ? 4 : 6,
          padding: "0 2px"
        }}>
          {dayNames.map((d) => (
            <div key={d} style={{
              textAlign: "center",
              fontSize: isMobile ? "0.5rem" : "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "rgba(236,72,153,0.55)",
            }}>{isMobile ? d.charAt(0) : d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)", 
          gap: isMobile ? 1 : 3,
          padding: "0 2px"
        }}>
          {calendarDays.map((item, idx) => (
            <div
              key={idx}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: isMobile ? 3 : 6,
                fontSize: isMobile ? "0.65rem" : "0.75rem",
                fontWeight: item.isCurrentMonth ? 600 : 400,
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
                transform: item.isToday ? (isMobile ? "scale(1.03)" : "scale(1.05)") : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (item.isCurrentMonth && !item.isToday && !isMobile) {
                  e.currentTarget.style.background = "rgba(236,72,153,0.25)";
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.border = "1px solid rgba(236,72,153,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (item.isCurrentMonth && !item.isToday && !isMobile) {
                  e.currentTarget.style.background = "rgba(139,92,246,0.12)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.border = "1px solid rgba(236,72,153,0.12)";
                }
              }}
            >
              {item.day}
            </div>
          ))}
        </div>

        {/* Footer - Simplified */}
        <div style={{
          marginTop: isMobile ? 10 : 14,
          paddingTop: isMobile ? 6 : 10,
          borderTop: "1px solid rgba(236,72,153,0.1)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: isMobile ? "0.55rem" : "0.65rem", color: "rgba(167,139,250,0.6)" }}>
            ✦ {monthNames[month]} {today}, {year} ✦
          </p>
        </div>
      </div>
    </div>
  );
}