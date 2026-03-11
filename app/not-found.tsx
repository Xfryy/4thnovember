"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(160deg, #03030d 0%, #090515 50%, #110420 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      overflow: "hidden",
      position: "relative",
    }}>

      {/* Ambient glows */}
      <div style={{
        position: "absolute",
        top: "15%", right: "8%",
        width: 480, height: 480,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.09) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "nf-float 7s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%", left: "5%",
        width: 360, height: 360,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "nf-float 9s ease-in-out infinite reverse",
        pointerEvents: "none",
      }} />

      {/* Scanline texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        textAlign: "center",
        maxWidth: 480,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>

        {/* Top label */}
        <p style={{
          fontSize: "0.55rem",
          fontWeight: 800,
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "rgba(236,72,153,0.5)",
          marginBottom: 20,
          animation: "nf-up 0.6s ease 0.1s both",
        }}>
          4th November — Error
        </p>

        {/* 404 */}
        <div style={{ position: "relative", marginBottom: 8, lineHeight: 1 }}>
          {/* Glow behind number */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 260, height: 120,
            background: "radial-gradient(ellipse, rgba(236,72,153,0.22) 0%, transparent 70%)",
            filter: "blur(24px)",
            pointerEvents: "none",
          }} />
          <h1 style={{
            fontSize: "clamp(5rem, 18vw, 8.5rem)",
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            margin: 0,
            background: "linear-gradient(135deg, #fce7f3 0%, #ec4899 40%, #a855f7 75%, #6366f1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "nf-up 0.6s ease 0.15s both",
            lineHeight: 1,
          }}>
            404
          </h1>
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          margin: "18px auto 20px",
          width: "fit-content",
          animation: "nf-up 0.6s ease 0.25s both",
        }}>
          <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.4))" }} />
          <span style={{
            fontSize: "0.58rem",
            fontWeight: 800,
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
          }}>Page Not Found</span>
          <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(236,72,153,0.4), transparent)" }} />
        </div>

        {/* Description */}
        <p style={{
          fontSize: "0.85rem",
          color: "rgba(167,139,250,0.55)",
          lineHeight: 1.85,
          letterSpacing: "0.03em",
          marginBottom: 36,
          animation: "nf-up 0.6s ease 0.32s both",
        }}>
          Hmm... sepertinya halaman yang kamu cari tidak ada.
          <br />Mungkin kamu sesat dalam cerita ini?
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 40,
          animation: "nf-up 0.6s ease 0.4s both",
        }}>
          <NfBtn onClick={() => router.back()} variant="outline">
            ← Kembali
          </NfBtn>
          <NfBtn href="/" variant="filled">
            Ke Beranda
          </NfBtn>
        </div>

        {/* Quote */}
        <div style={{
          padding: "16px 20px",
          borderRadius: 10,
          border: "1px solid rgba(236,72,153,0.1)",
          background: "rgba(255,255,255,0.02)",
          animation: "nf-up 0.6s ease 0.5s both",
        }}>
          <p style={{
            fontSize: "0.68rem",
            fontStyle: "italic",
            color: "rgba(107,70,193,0.55)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            margin: 0,
          }}>
            "Setiap cerita memiliki jalan yang salah...<br />tapi tidak semua jalan menuju ke sini."
          </p>
        </div>

      </div>

      <style>{`
        @keyframes nf-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-28px); }
        }
        @keyframes nf-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:none; }
        }
      `}</style>
    </div>
  );
}

// ── Button helper ──────────────────────────────────────────────────────────────

function NfBtn({
  onClick, href, variant, children,
}: {
  onClick?: () => void;
  href?: string;
  variant: "outline" | "filled";
  children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);

  const base: React.CSSProperties = {
    padding: "11px 28px",
    borderRadius: 9,
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.16s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    userSelect: "none",
  };

  const outlineStyle: React.CSSProperties = {
    ...base,
    border: `1px solid ${hov ? "rgba(236,72,153,0.55)" : "rgba(236,72,153,0.22)"}`,
    background: hov ? "rgba(236,72,153,0.1)" : "rgba(255,255,255,0.03)",
    color: hov ? "#f9a8d4" : "rgba(236,72,153,0.65)",
    boxShadow: hov ? "0 0 20px rgba(236,72,153,0.1)" : "none",
  };

  const filledStyle: React.CSSProperties = {
    ...base,
    border: "1px solid rgba(236,72,153,0.4)",
    background: hov
      ? "linear-gradient(135deg, rgba(236,72,153,0.45), rgba(168,85,247,0.35))"
      : "linear-gradient(135deg, rgba(236,72,153,0.28), rgba(168,85,247,0.22))",
    color: hov ? "#fff" : "#f9a8d4",
    boxShadow: hov ? "0 0 24px rgba(236,72,153,0.2)" : "none",
    transform: hov ? "translateY(-1px)" : "none",
  };

  const style = variant === "outline" ? outlineStyle : filledStyle;

  if (href) {
    return (
      <Link href={href} style={style}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} style={style}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}