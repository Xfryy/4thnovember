"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

interface InventoryItemDef {
  id: string;
  name: string;
  image: string;
  description: string;
}

// Global dictionary for mapping item IDs to display info
const ITEM_DICTIONARY: Record<string, InventoryItemDef> = {
  medicine: {
    id: "medicine",
    name: "Pill Obat",
    image: "/Image/scenes/Obat-pill.png",
    description: "Satu tablet per hari — jangan sampai terlewat, dan jangan dihentikan sendiri tanpa konsultasi.\n\nIni akan membantu proses pemulihan ingatan berjalan secara bertahap.",
  },
  // Add future items here
};

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryIds: string[];
}

export default function InventoryModal({ isOpen, onClose, inventoryIds }: InventoryModalProps) {
  const isMobile = useIsMobile();
  const [selectedItem, setSelectedItem] = useState<InventoryItemDef | null>(null);

  if (!isOpen) return null;

  // Map possessed IDs to full item definitions
  const items = inventoryIds
    .map((id) => ITEM_DICTIONARY[id])
    .filter(Boolean); // Filter out any unknown items

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fade-in 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? "90vw" : "70vw",
          height: isMobile ? "80vh" : "75vh",
          maxWidth: 900,
          background: "linear-gradient(145deg, rgba(17,10,38,0.9), rgba(4,2,12,0.98))",
          border: "1px solid rgba(236,72,153,0.3)",
          borderRadius: 20,
          boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(236,72,153,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "0.1em", margin: 0 }}>
              INVENTORY
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              {items.length === 0 ? "You have no items." : `Showing ${items.length} item(s)`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(236,72,153,0.2)";
              e.currentTarget.style.borderColor = "rgba(236,72,153,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div style={{
          display: "flex",
          flex: 1,
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
        }}>
          
          {/* Item Grid */}
          <div style={{
            flex: isMobile ? "none" : 1.2,
            height: isMobile ? "45%" : "100%",
            borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
            borderBottom: isMobile ? "1px solid rgba(255,255,255,0.08)" : "none",
            padding: 24,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: 16,
            alignContent: "start",
          }}>
            {items.map((item) => {
              const isActive = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    aspectRatio: "1",
                    background: isActive ? "linear-gradient(145deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(236,72,153,0.5)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 12,
                    padding: 8,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 0 20px rgba(236,72,153,0.2) inset" : "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }
                  }}
                >
                  <div style={{ position: "relative", width: "80%", height: "80%" }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      style={{ objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}
                    />
                  </div>
                </button>
              );
            })}
            
            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, 15 - items.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  aspectRatio: "1",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px dashed rgba(255,255,255,0.05)",
                  borderRadius: 12,
                }}
              />
            ))}
          </div>

          {/* Item Details Panel */}
          <div style={{
            flex: 1,
            padding: 32,
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
          }}>
            {selectedItem ? (
              <div style={{ width: "100%", animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                <div style={{ 
                  position: "relative", 
                  width: "100%", 
                  height: isMobile ? 160 : 240,
                  marginBottom: 24,
                  background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)"
                }}>
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    fill
                    unoptimized
                    style={{ objectFit: "contain", filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.6))" }}
                  />
                </div>
                <h3 style={{ 
                  fontSize: 24, 
                  fontWeight: 800, 
                  background: "linear-gradient(to right, #fff, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: "0 0 16px 0",
                  textAlign: "center"
                }}>
                  {selectedItem.name}
                </h3>
                <div style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  padding: 20,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {selectedItem.description}
                </div>
              </div>
            ) : (
              <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.3)",
                fontSize: 14,
                letterSpacing: "0.05em",
                height: "100%",
              }}>
                Select an item to view details
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
