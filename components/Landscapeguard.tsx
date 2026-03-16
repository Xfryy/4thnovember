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

  // Pengecekan agar tidak SSR issue
  if (!isClient) {
    return <>{children}</>;
  }

  // Jika portrait dan layar sempit (seperti di HP vertikal),
  // kita ingin memaksanya rotate 90 derajat jadi seperti HP sedang horizontal
  const isMobilePortrait = blocked;

  return (
    <div
      style={{
        // Jika diputar 90 derajat, width container = tinggi layar HP, height container = lebar layar HP
        width: isMobilePortrait ? "100vh" : "100%",
        height: isMobilePortrait ? "100vw" : "100%",
        // Rotasikan layarnya
        transform: isMobilePortrait ? "rotate(90deg)" : "none",
        // Pivot rotasi di ujung kiri atas
        transformOrigin: isMobilePortrait ? "top left" : "unset",
        position: isMobilePortrait ? "absolute" : "relative",
        top: 0,
        // Setelah di putar 90deg di top-left, konten akan keluar viewport (ke kanan/atas dari sudut pandang).
        // Kita geser sejauh 100vw ke kanan (sebelum rotasi / dari perspektif browser default) untuk membawanya kembali masuk
        left: isMobilePortrait ? "100vw" : 0,
        overflow: "hidden",
      }}
    >
      {/* ── GAME CONTENT ────────────────────────────────────────── */}
      <div 
        style={{ 
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        {children}
      </div>
    </div>
  );
}