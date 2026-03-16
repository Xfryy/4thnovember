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

export default function LandscapeGuard({ children }: { children: React.ReactNode }) {
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const check = () => {
      // Simply rotate if the device is held vertically (height > width)
      // This synchronizes perfectly with MainMenu and GameEngine effective dimension calculations
      setIsMobilePortrait(window.innerHeight > window.innerWidth);
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
    return (
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        {children}
      </div>
    );
  }

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