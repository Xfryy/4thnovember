"use client";

import { useEffect, useState } from "react";
import GameBackground from "./GameBackground";
import GameTitle from "./GameTitle";
import CharacterSprite from "./Charactersprite";
import { getAuth } from "firebase/auth";

interface LoginScreenProps {
  isLoading: boolean;
  onLogin: () => void;
}

export default function LoginScreen({ isLoading, onLogin }: LoginScreenProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  // ── Pre-warm Firebase Auth on mount so the popup opens instantly ──────────
  useEffect(() => {
    try {
      // Just calling getAuth() forces Firebase to initialise the auth module
      // and pre-fetch Google's OAuth endpoint in the background.
      getAuth();
    } catch {
      // silently ignore — this is purely a performance hint
    }
  }, []);

  const busy = isLoading || localLoading;

  const handleClick = async () => {
    if (busy) return;
    setLocalLoading(true);
    try {
      await onLogin();
    } finally {
      // Keep spinner until the parent flips isLoading to false
      // (onLogin resolves → parent re-renders with isLoading=false)
      setLocalLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      overflow: "hidden",
    }}>
      <GameBackground />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        width: "100%",
        maxWidth: 860,
        flexWrap: "wrap",
      }}>

        {/* Left — Title & CTA */}
        <div style={{
          flex: "1 1 280px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0,
          animation: "ls-left 0.7s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <GameTitle />

          {/* Tagline */}
          <p style={{
            margin: "16px 0 32px",
            fontSize: "0.8rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(167,139,250,0.55)",
            fontWeight: 500,
          }}>
            A visual novel experience
          </p>

          {/* Sign-in button */}
          <button
            onClick={handleClick}
            disabled={busy}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "13px 28px",
              borderRadius: 12,
              border: busy
                ? "1px solid rgba(236,72,153,0.25)"
                : hovered
                  ? "1px solid rgba(236,72,153,0.7)"
                  : "1px solid rgba(236,72,153,0.4)",
              background: busy
                ? "rgba(236,72,153,0.12)"
                : hovered
                  ? "linear-gradient(135deg, rgba(236,72,153,0.35), rgba(168,85,247,0.28))"
                  : "linear-gradient(135deg, rgba(236,72,153,0.22), rgba(168,85,247,0.18))",
              boxShadow: hovered && !busy
                ? "0 0 28px rgba(236,72,153,0.25), 0 8px 24px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.3)",
              color: busy ? "rgba(249,168,212,0.55)" : "#f9a8d4",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.14em",
              cursor: busy ? "not-allowed" : "pointer",
              transition: "all 0.18s ease",
              transform: hovered && !busy ? "translateY(-1px)" : "none",
              backdropFilter: "blur(12px)",
              minWidth: 220,
              overflow: "hidden",
            }}
          >
            {/* Shimmer on hover */}
            {hovered && !busy && (
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
                animation: "ls-shimmer 1.2s ease infinite",
                pointerEvents: "none",
              }} />
            )}

            {busy ? (
              /* Spinner */
              <>
                <svg
                  width="15" height="15"
                  viewBox="0 0 24 24" fill="none"
                  style={{ animation: "ls-spin 0.75s linear infinite", flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" stroke="rgba(249,168,212,0.25)" strokeWidth="2.5" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span>Signing in…</span>
              </>
            ) : (
              <>
                {/* Google icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#f9a8d4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#f9a8d4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity=".7"/>
                  <path fill="#f9a8d4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" opacity=".5"/>
                  <path fill="#f9a8d4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity=".3"/>
                </svg>
                <span>SIGN IN WITH GOOGLE</span>
              </>
            )}
          </button>

          {/* Sub-hint */}
          <p style={{
            marginTop: 14,
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            color: "rgba(167,139,250,0.38)",
            fontWeight: 500,
          }}>
            Sign in to save your progress
          </p>
        </div>

        {/* Right — Character */}
        <div style={{
          flex: "0 0 auto",
          display: "flex",
          justifyContent: "center",
          animation: "ls-right 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both",
          opacity: busy ? 0.6 : 1,
          transition: "opacity 0.3s ease",
        }}>
          <CharacterSprite compact width={300} height={500} animated={false} />
        </div>

      </div>

      <style>{`
        @keyframes ls-left {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes ls-right {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes ls-spin    { to { transform:rotate(360deg); } }
        @keyframes ls-shimmer {
          from { transform:translateX(-100%); }
          to   { transform:translateX(200%); }
        }
      `}</style>
    </div>
  );
}