"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SceneCharacter } from "@/types/game";
import { getCharImgStyle } from "@/lib/Characterlayout";

const FADE_MS = 240;

export default function SceneCharacterSprite({
  char,
}: {
  char: SceneCharacter;
}) {
  const [prevSprite, setPrevSprite] = useState<string | null>(null);
  const prevRef = useRef<string | null>(null);
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const next = char.sprite;
    const prev = prevRef.current;

    if (!prev) {
      prevRef.current = next;
      return;
    }

    if (prev === next) return;

    // Hold previous sprite briefly so we can crossfade.
    setPrevSprite(prev);
    prevRef.current = next;

    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = setTimeout(() => {
      setPrevSprite(null);
    }, FADE_MS + 40);

    return () => {
      if (tRef.current) clearTimeout(tRef.current);
    };
  }, [char.sprite]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Previous sprite fading out */}
      {prevSprite && (
        <img
          src={prevSprite}
          alt={char.id}
          draggable={false}
          style={{
            ...getCharImgStyle(char),
            position: "absolute",
            inset: 0,
            opacity: 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
          onLoad={(e) => {
            const img = e.currentTarget;
            // next frame -> fade out
            requestAnimationFrame(() => {
              img.style.opacity = "0";
            });
          }}
        />
      )}

      {/* Current sprite */}
      <img
        src={char.sprite}
        alt={char.id}
        draggable={false}
        style={{
          ...getCharImgStyle(char),
          position: "absolute",
          inset: 0,
          opacity: prevSprite ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
        onLoad={(e) => {
          // When swapping, ensure the new sprite actually fades in after it's loaded.
          if (!prevSprite) return;
          const img = e.currentTarget;
          // force reflow
          void img.offsetHeight;
          img.style.opacity = "1";
        }}
      />
    </div>
  );
}

