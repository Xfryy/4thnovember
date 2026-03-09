"use client";

import { useEffect, useState, useRef } from "react";
import { preloadAssetsForScene, LoadProgress } from "@/lib/assetLoader";

interface PreloaderProps {
  actNumber: number;
  startSceneId?: string;
  onReady: () => void;   // called when all assets loaded
  onCancel?: () => void; // ← Menu button
}

const QUOTES = [
  "Setiap cerita dimulai dari satu langkah kecil...",
  "Kenangan adalah cermin yang tidak pernah berbohong.",
  "Ada yang menunggumu di sisi lain layar ini.",
  "4th November — hari yang mengubah segalanya.",
  "Waktu tidak bisa diputar, tapi bisa dirasakan kembali.",
];

const PRELOAD_DEPTH = 10; // How many scenes ahead to preload

export default function Preloader({ actNumber, startSceneId, onReady, onCancel }: PreloaderProps) {
  const [progress, setProgress] = useState<LoadProgress>({
    loaded: 0, current: "Mempersiapkan...", total: 0, done: 0,
  });
  const [quote]      = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [fadeOut, setFadeOut] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !startSceneId) return;
    loadedRef.current = true;

    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;

    preloadAssetsForScene(startSceneId, PRELOAD_DEPTH, setProgress).then(() => {
      // Brief pause so the bar reaches 100% visibly before fading
      timer1 = setTimeout(() => {
        setFadeOut(true);
        timer2 = setTimeout(onReady, 500); // match fade-out duration
      }, 350);
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  }, [startSceneId, onReady]);

  const pct = progress.loaded;

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #04040f 0%, #0a0618 45%, #12052a 100%)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease",
        userSelect: "none",
      }}
    >
      {/* Back to menu — top left */}
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            position: "absolute", top: 20, left: 20,
            padding: "6px 14px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            e.currentTarget.style.borderColor = "rgba(236,72,153,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          ← Menu
        </button>
      )}

      {/* Act label */}
      <p
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(236,72,153,0.6)",
          marginBottom: 16,
          fontWeight: 700,
        }}
      >
        Act {actNumber}
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "0.05em",
          marginBottom: 48,
          background: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 45%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        4th November
      </h1>

      {/* Progress bar container */}
      <div style={{ width: "min(420px, 78vw)", marginBottom: 16 }}>
        {/* Track */}
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Fill */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: `${pct}%`,
              borderRadius: 99,
              background: "linear-gradient(90deg, #ec4899, #a855f7)",
              transition: "width 0.25s ease",
              boxShadow: "0 0 12px rgba(236,72,153,0.6)",
            }}
          />
          {/* Shimmer */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              animation: pct < 100 ? "shimmer-bar 1.4s linear infinite" : "none",
            }}
          />
        </div>

        {/* Percentage + current file */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              color: "rgba(167,139,250,0.7)",
              letterSpacing: "0.06em",
              maxWidth: "70%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {pct === 100 ? "✓ Siap!" : progress.current}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              color: pct === 100 ? "#ec4899" : "rgba(196,181,253,0.8)",
              letterSpacing: "0.05em",
              transition: "color 0.3s ease",
            }}
          >
            {pct}%
          </span>
        </div>

        {/* Asset count */}
        {progress.total > 0 && (
          <p style={{
            fontSize: "0.6rem",
            color: "rgba(107,70,193,0.6)",
            letterSpacing: "0.1em",
            marginTop: 4,
            textAlign: "right",
          }}>
            {progress.done} / {progress.total} assets
          </p>
        )}
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: "0.78rem",
          fontStyle: "italic",
          color: "rgba(167,139,250,0.45)",
          letterSpacing: "0.04em",
          maxWidth: 360,
          textAlign: "center",
          lineHeight: 1.7,
          marginTop: 12,
          animation: "fade-up 0.8s ease 0.2s both",
        }}
      >
        "{quote}"
      </p>

      {/* Dots indicator */}
      <div style={{ display: "flex", gap: 6, marginTop: 40 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "rgba(236,72,153,0.5)",
              animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shimmer-bar {
          from { transform: translateX(-100%); }
          to   { transform: translateX(350%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}