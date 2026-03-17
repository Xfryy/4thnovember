"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SceneBg } from "@/types/game";

type Layer = {
  key: string;
  bg?: SceneBg;
};

function keyOf(bg?: SceneBg): string {
  if (!bg) return "none";
  return JSON.stringify({
    image: bg.image ?? null,
    color: bg.color ?? null,
    overlay: bg.overlay ?? null,
    size: bg.size ?? null,
    position: bg.position ?? null,
    filter: bg.filter ?? null,
  });
}

export default function SceneBackground({
  bg,
  className,
  style,
}: {
  bg?: SceneBg;
  className?: string;
  style?: React.CSSProperties;
}) {
  const nextKey = useMemo(() => keyOf(bg), [bg]);
  const [front, setFront] = useState<Layer>(() => ({ key: nextKey, bg }));
  const [back, setBack] = useState<Layer | null>(null);
  const [fading, setFading] = useState(false);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (front.key === nextKey) return;

    // Prepare: current becomes back, new becomes front (but start transparent)
    setBack(front);
    setFront({ key: nextKey, bg });
    setFading(false);

    // next frame -> start fade
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setFading(true);
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setBack(null);
    }, 360);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextKey]);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Back layer (previous bg) */}
      {back && (
        <LayerView
          bg={back.bg}
          style={{
            opacity: fading ? 0 : 1,
            transition: "opacity 360ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      )}

      {/* Front layer (current bg) */}
      <LayerView
        bg={front.bg}
        style={{
          opacity: back ? (fading ? 1 : 0) : 1,
          transition: back
            ? "opacity 360ms cubic-bezier(0.4, 0, 0.2, 1)"
            : undefined,
        }}
      />
    </div>
  );
}

function LayerView({
  bg,
  style,
}: {
  bg?: SceneBg;
  style?: React.CSSProperties;
}) {
  const color = bg?.color ?? "#000";
  const image = bg?.image;
  const size = bg?.size ?? "cover";
  const position = bg?.position ?? "center top";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: size,
        backgroundPosition: position,
        backgroundRepeat: "no-repeat",
        filter: bg?.filter,
        ...style,
      }}
    >
      {bg?.overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: bg.overlay,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

