"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SparkleData {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

const SPARKLE_COLORS = [
  "#f9a8d4", "#ec4899", "#a5b4fc",
  "#818cf8", "#fde68a", "#ffffff", "#a855f7",
];

export default function SparkleProvider() {
  const [sparkles, setSparkles] = useState<SparkleData[]>([]);
  const sparkleId = useRef(0);
  const lastSparkle = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastSparkle.current < 80) return; // throttle ~12/s
    lastSparkle.current = now;

    const id = sparkleId.current++;
    const color = SPARKLE_COLORS[id % SPARKLE_COLORS.length];

    setSparkles((prev) => [
      ...prev.slice(-16),
      {
        id,
        x: e.clientX,
        y: e.clientY,
        color,
        size: 10 + Math.random() * 12,
      },
    ]);

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 700);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      <style>{`
        @keyframes sparkle-pop {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          60%  { opacity: 0.7; transform: translate(-50%, -60%) scale(1.3) rotate(20deg); }
          100% { opacity: 0; transform: translate(-50%, -80%) scale(0.4) rotate(40deg); }
        }
      `}</style>

      {sparkles.map((s) => (
        <span
          key={s.id}
          className="pointer-events-none font-black leading-none select-none"
          style={{
            position: "fixed",
            left: s.x,
            top: s.y,
            fontSize: s.size,
            color: s.color,
            transform: "translate(-50%, -50%)",
            animation: "sparkle-pop 0.7s ease-out forwards",
            textShadow: `0 0 8px ${s.color}`,
            zIndex: 9999,
          }}
        >
          ✦
        </span>
      ))}
    </>
  );
}