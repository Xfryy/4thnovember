"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedCGs: string[];
}

export default function GalleryModal({ isOpen, onClose, unlockedCGs }: GalleryModalProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Render a 3x3 placeholder grid, filling unlocked ones
  const totalSlots = Math.max(9, Math.ceil(unlockedCGs.length / 3) * 3);
  const slots = Array.from({ length: totalSlots }, (_, i) => unlockedCGs[i] || null);

  return (
    <>
      <div 
        onClick={onClose} 
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
        }}
      />
      <div 
        style={{ 
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 201, background: "rgba(8, 4, 20, 0.97)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
          boxShadow: "0 32px 80px rgba(0,0,0,0.9)", display: "flex", flexDirection: "column",
          maxWidth: "800px", width: "min(800px, 95%)", maxHeight: "90%"
        }}
      >
        
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.5rem" }}>⌘</span>
            <h2 style={{ margin: 0, fontSize: "1.1rem", color: "white" }}>CG Gallery</h2>
          </div>
          <button 
            style={{
              marginLeft: "auto", width: 28, height: 28, borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div 
          style={{ 
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
            gap: "16px", padding: "20px", overflowY: "auto", flex: 1,
            alignContent: "flex-start" 
          }}
        >
          {slots.map((cgUrl, idx) => (
            <div 
              key={idx} 
              style={{
                aspectRatio: "16/9",
                cursor: cgUrl ? "pointer" : "default",
                opacity: cgUrl ? 1 : 0.4,
                position: "relative",
                overflow: "hidden",
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => {
                if (cgUrl) e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                if (cgUrl) e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => cgUrl && setFullscreenImage(cgUrl)}
            >
              {cgUrl ? (
                <>
                  <Image 
                    src={cgUrl} 
                    alt={`Unlocked CG ${idx + 1}`} 
                    fill 
                    style={{ objectFit: "cover" }}
                    unoptimized 
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: "white"
                  }}>
                    CG {idx + 1}
                  </div>
                </>
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.4)",
                  fontSize: "2rem"
                }}>
                  🔒
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.9em" }}>
            {unlockedCGs.length} Unlocked out of ???
          </p>
        </div>
      </div>

      {/* Fullscreen CG Viewer */}
      {fullscreenImage && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out"
          }}
          onClick={() => setFullscreenImage(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={fullscreenImage} 
            alt="Fullscreen CG"
            style={{ 
              maxWidth: "100%", 
              maxHeight: "100%", 
              objectFit: "contain",
              boxShadow: "0 0 40px rgba(0,0,0,0.5)"
            }} 
          />
          <button 
           style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "white", fontSize: "2rem", cursor: "pointer", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
           onClick={() => setFullscreenImage(null)}
          >
           ✕
          </button>
        </div>
      )}
    </>
  );
}
