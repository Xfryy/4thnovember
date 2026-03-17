"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LegalRoute = "/terms" | "/privacy" | "/copyright";

export default function LegalWarningModal() {
  const router = useRouter();

  const storageKey = useMemo(() => "4th-november-legal-warning-v1", []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey);
      if (!seen) setOpen(true);
    } catch {
      // ignore (privacy mode)
      setOpen(true);
    }
  }, [storageKey]);

  const close = () => {
    try {
      localStorage.setItem(storageKey, "seen");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  const go = (path: LegalRoute) => {
    close();
    router.push(path);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.68)",
        backdropFilter: "blur(10px)",
      }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Development warning and legal notice"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 96vw)",
          borderRadius: 22,
          overflow: "hidden",
          background: "rgba(12, 8, 28, 0.98)",
          border: "1px solid rgba(236,72,153,0.22)",
          boxShadow:
            "0 28px 90px rgba(0,0,0,0.75), 0 0 46px rgba(168,85,247,0.16)",
        }}
      >
        {/* Accent */}
        <div
          style={{
            height: 3,
            background:
              "linear-gradient(90deg, #f59e0b, #ec4899 45%, #a855f7 75%, #6366f1)",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(245,158,11,0.06)",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(245,158,11,0.14)",
              border: "1px solid rgba(245,158,11,0.28)",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 18 }}>⚠️</span>
          </div>

          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: "#fff", fontWeight: 900, fontSize: "0.95rem" }}>
              Peringatan — Build Pengembangan
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(253,230,138,0.75)",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              4th November Visual Novel
            </p>
          </div>

          <button
            onClick={close}
            style={{
              marginLeft: "auto",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(0,0,0,0.25)",
              color: "rgba(255,255,255,0.85)",
              borderRadius: 12,
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "0.75rem",
            }}
          >
            Tutup
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              borderRadius: 14,
              padding: "12px 12px",
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.16)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(233,213,255,0.92)",
                fontSize: "0.78rem",
                lineHeight: 1.7,
              }}
            >
              Game ini <b>masih dalam tahap pengembangan</b>. Kamu mungkin menemukan bug, lag,
              perubahan UI/cerita, atau fitur yang belum final. Terima kasih sudah main dan mohon
              dimaklumi.
            </p>
          </div>

          <div
            style={{
              borderRadius: 14,
              padding: "12px 12px",
              background: "rgba(236,72,153,0.07)",
              border: "1px solid rgba(236,72,153,0.14)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(251,207,232,0.9)",
                fontSize: "0.73rem",
                lineHeight: 1.7,
              }}
            >
              <b>Catatan hukum</b>: semua aset yang dipakai ditujukan untuk penggunaan yang aman dan
              sesuai lisensi. Kalau ada pihak yang merasa keberatan atas konten/aset tertentu, silakan
              hubungi developer untuk penanganan (takedown/perubahan).
            </p>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button
                onClick={() => go("/terms")}
                style={linkBtnStyle}
              >
                Terms of Use
              </button>
              <button
                onClick={() => go("/privacy")}
                style={linkBtnStyle}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => go("/copyright")}
                style={linkBtnStyle}
              >
                Copyright / Assets
              </button>
            </div>

            <button
              onClick={close}
              style={{
                borderRadius: 14,
                padding: "10px 14px",
                background: "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(168,85,247,0.25))",
                border: "1px solid rgba(236,72,153,0.40)",
                color: "#fff",
                fontWeight: 900,
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              Saya Mengerti
            </button>
          </div>

          <p style={{ margin: 0, fontSize: "0.6rem", color: "rgba(167,139,250,0.5)", lineHeight: 1.6 }}>
            Dengan menutup pesan ini, kamu menyatakan sudah membaca ringkasan peringatan. Detail lengkap
            ada di halaman Terms/Privacy/Copyright.
          </p>
        </div>
      </div>
    </div>
  );
}

const linkBtnStyle: React.CSSProperties = {
  borderRadius: 14,
  padding: "10px 12px",
  background: "rgba(10,6,22,0.55)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.92)",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "0.75rem",
};

