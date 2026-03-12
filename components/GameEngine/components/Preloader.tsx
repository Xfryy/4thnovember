"use client";

import { useEffect, useState, useRef } from "react";
import { preloadAllAssets, PreloadProgress } from "@/lib/assetPreloader";
import { ASSET_LIST } from '@/lib/assetList';

interface PreloaderProps {
  actNumber: number;
  startSceneId?: string;
  onReady: () => void;
  onCancel?: () => void;
}

const QUOTES = [
  "Setiap cerita dimulai dari satu langkah kecil...",
  "Kenangan adalah cermin yang tidak pernah berbohong.",
  "Ada yang menunggumu di sisi lain layar ini.",
  "4th November — hari yang mengubah segalanya.",
  "Waktu tidak bisa diputar, tapi bisa dirasakan kembali.",
  "Memuat gambar... sedikit sabar ya~",
  "Mempersiapkan pengalaman terbaik untukmu.",
  "Hampir siap...",
];
export async function getAllPublicAssets(): Promise<string[]> {
  return ASSET_LIST;
}

export default function Preloader({ actNumber, onReady, onCancel }: PreloaderProps) {
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 100,
    current: "Mempersiapkan...",
    percentage: 0,
  });
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [fadeOut, setFadeOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    // Preload SEMUA aset, bukan hanya scene tertentu
    preloadAllAssets(setProgress)
      .then(() => {
        console.log('✅ All assets preloaded successfully');
        t1 = setTimeout(() => {
          setFadeOut(true);
          t2 = setTimeout(onReady, 500);
        }, 350);
      })
      .catch((err) => {
        console.error('❌ Failed to preload assets:', err);
        setError(err.message);
        
        // Tetap lanjut meskipun error, kasih delay lebih lama
        t1 = setTimeout(() => {
          setFadeOut(true);
          t2 = setTimeout(onReady, 500);
        }, 2000);
      });

    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
    };
  }, [onReady]);

  const pct = progress.percentage;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #03030d 0%, #090515 50%, #110420 100%)",
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.5s ease",
      userSelect: "none",
      overflow: "hidden",
    }}>

      {/* Ambient background glow */}
      <div style={{
        position: "absolute",
        top: "30%", left: "50%",
        transform: "translateX(-50%)",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Back to menu */}
      {onCancel && !fadeOut && (
        <button
          onClick={onCancel}
          style={{
            position: "absolute", top: 18, left: 18,
            padding: "5px 13px",
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 101,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.75)";
            e.currentTarget.style.borderColor = "rgba(236,72,153,0.35)";
            e.currentTarget.style.background = "rgba(236,72,153,0.06)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.35)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >
          ← Menu
        </button>
      )}

      {/* Error message jika ada */}
      {error && (
        <div style={{
          position: "absolute", bottom: 20,
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 8,
          padding: "8px 16px",
          color: "#f87171",
          fontSize: "0.75rem",
          maxWidth: "80%",
          textAlign: "center",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Act label */}
      <p style={{
        fontSize: "0.58rem",
        letterSpacing: "0.5em",
        textTransform: "uppercase",
        color: "rgba(236,72,153,0.5)",
        marginBottom: 14,
        fontWeight: 700,
        animation: "pl-up 0.7s ease both",
      }}>
        Act {actNumber}
      </p>

      {/* Title */}
      <h1 style={{
        fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
        fontWeight: 900,
        fontStyle: "italic",
        letterSpacing: "0.04em",
        marginBottom: 56,
        margin: "0 0 56px",
        background: "linear-gradient(135deg, #fce7f3 0%, #ec4899 40%, #a855f7 80%, #6366f1 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "pl-up 0.7s ease 0.1s both",
      }}>
        4th November
      </h1>

      {/* Progress section */}
      <div style={{
        width: "min(400px, 76vw)",
        animation: "pl-up 0.7s ease 0.2s both",
      }}>
        {/* Bar */}
        <div style={{
          height: 3,
          borderRadius: 99,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
          position: "relative",
          marginBottom: 10,
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0,
            width: `${pct}%`,
            borderRadius: 99,
            background: "linear-gradient(90deg, #ec4899, #a855f7, #6366f1)",
            transition: "width 0.22s ease",
            boxShadow: "0 0 10px rgba(236,72,153,0.55)",
          }} />
          {pct < 100 && (
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: "35%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              animation: "pl-shimmer 1.5s linear infinite",
            }} />
          )}
        </div>

        {/* Status row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontSize: "0.62rem",
            color: "rgba(167,139,250,0.55)",
            letterSpacing: "0.05em",
            maxWidth: "68%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {pct === 100 ? "✓ Siap!" : progress.current}
          </span>
          <span style={{
            fontSize: "0.65rem",
            fontWeight: 800,
            fontFamily: "monospace",
            color: pct === 100 ? "#ec4899" : "rgba(196,181,253,0.7)",
            letterSpacing: "0.06em",
            transition: "color 0.3s ease",
          }}>
            {pct}%
          </span>
        </div>

        {progress.total > 0 && (
          <p style={{
            fontSize: "0.52rem",
            color: "rgba(107,70,193,0.45)",
            letterSpacing: "0.12em",
            marginTop: 5,
            textAlign: "right",
            margin: "5px 0 0",
          }}>
            {progress.loaded} / {progress.total} aset
          </p>
        )}
      </div>

      {/* Quote */}
      <p style={{
        fontSize: "0.72rem",
        fontStyle: "italic",
        color: "rgba(167,139,250,0.38)",
        letterSpacing: "0.04em",
        maxWidth: 340,
        textAlign: "center",
        lineHeight: 1.8,
        marginTop: 36,
        animation: "pl-up 0.8s ease 0.4s both",
      }}>
        "{quote}"
      </p>

      {/* Animated dots */}
      <div style={{ display: "flex", gap: 7, marginTop: 44 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "rgba(236,72,153,0.45)",
            animation: `pl-dot 1.4s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes pl-up {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes pl-shimmer {
          from { transform:translateX(-100%); }
          to   { transform:translateX(380%); }
        }
        @keyframes pl-dot {
          0%,100% { opacity:0.25; transform:scale(0.75); }
          50%     { opacity:1;    transform:scale(1.35); }
        }
      `}</style>
    </div>
  );
}