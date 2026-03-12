/**
 * characterLayout.ts
 * Shared position/size/offset helpers for all scene views.
 *
 * SceneCharacter customisation fields:
 *   size        — "small" | "medium" | "large" | "xl" | "full"  (preset)
 *   customSize  — { width?: string|number, height?: string|number }  (override, px or any CSS unit)
 *   offsetX     — shift left/right from anchor position in px  (+ = right)
 *   offsetY     — shift up/down in px  (+ = up,  – = down / crop into floor)
 *   bottom      — explicit bottom value in px, overrides offsetY entirely
 *   flip        — mirror sprite horizontally
 *   dim         — darken sprite (inactive character)
 */

import type React from "react";
import type { CharacterPosition, CharacterSize, SceneCharacter } from "@/types/game";

// ── Position anchors ───────────────────────────────────────────────────────────
// These set the horizontal anchor. Vertical is always bottom-aligned (bottom:0 default).

export const POSITION_MAP: Record<CharacterPosition, React.CSSProperties> = {
  "far-left":     { left: "-3%",  right: "auto" },
  "left":         { left: "3%",   right: "auto" },
  "center-left":  { left: "15%",  right: "auto" },
  "center":       { left: "50%",  transform: "translateX(-50%)" },
  "center-right": { right: "15%", left: "auto"  },
  "right":        { right: "3%",  left: "auto"  },
  "far-right":    { right: "-3%", left: "auto"  },
};

export function getPositionStyle(position?: CharacterPosition): React.CSSProperties {
  return POSITION_MAP[position ?? "center"] ?? POSITION_MAP["center"];
}

// ── Size presets ───────────────────────────────────────────────────────────────

export const SIZE_MAP: Record<CharacterSize, { width: number; height: number }> = {
  small:  { width: 220, height: 380 },
  medium: { width: 320, height: 520 },
  large:  { width: 440, height: 700 },
  xl:     { width: 560, height: 860 },
  full:   { width: 500, height: 860 },
};

function toCSS(val: string | number): string {
  return typeof val === "number" ? `${val}px` : val;
}

/** Get width/height style, respecting customSize override */
export function getCharSizeStyle(char: SceneCharacter): React.CSSProperties {
  const preset = SIZE_MAP[char.size ?? "large"];
  return {
    width:  toCSS(char.customSize?.width  ?? preset.width),
    height: toCSS(char.customSize?.height ?? preset.height),
  };
}

// ── Full wrapper style (position + offset + size) ─────────────────────────────
/**
 * Returns the complete style for the character wrapper <div>.
 * The wrapper is position:absolute, bottom-anchored, transparent background.
 *
 * offsetY: positive = shift UP (increase bottom), negative = shift DOWN (crop feet)
 * offsetX: positive = shift RIGHT (increase left / decrease right)
 * bottom:  if set, used directly instead of offsetY
 */
export function getCharWrapperStyle(char: SceneCharacter): React.CSSProperties {
  const posStyle   = getPositionStyle(char.position);
  const sizeStyle  = getCharSizeStyle(char);

  // Compute bottom
  const bottomVal =
    char.bottom !== undefined
      ? char.bottom
      : (char.offsetY ?? 0); // offsetY positive = up = larger bottom

  // Compute horizontal shift on top of anchor
  const offsetX = char.offsetX ?? 0;

  // Build transform — combine position center transform with offsetX
  const isCentered = (char.position ?? "center") === "center";
  const transform = isCentered
    ? `translateX(calc(-50% + ${offsetX}px))`
    : offsetX !== 0
    ? `translateX(${offsetX}px)`
    : undefined;

  return {
    position: "absolute",
    bottom: bottomVal,
    ...posStyle,
    ...(transform ? { transform } : {}),
    ...sizeStyle,
    // CRITICAL: no background, no border — wrapper must be fully transparent
    background: "transparent",
    border: "none",
    outline: "none",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: char.zIndex ?? 5,
  };
}

/** Style for the <img> inside the wrapper */
export function getCharImgStyle(char: SceneCharacter): React.CSSProperties {
  return {
    width:  "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "bottom center",
    // transparent — img itself has no background
    background: "transparent",
    display: "block",
    transform: char.flip ? "scaleX(-1)" : undefined,
    filter: char.dim
      ? "brightness(0.45) saturate(0.6)"
      : "none",
    userSelect: "none",
    pointerEvents: "none",
  };
}

// ── Animation name helper ─────────────────────────────────────────────────────

export function getAnimName(animation?: SceneCharacter["animation"]): string {
  switch (animation ?? "enter-bottom") {
    case "enter-left":  return "char-from-left";
    case "enter-right": return "char-from-right";
    case "fade":
    case "fade-in":     return "char-fade";
    case "none":
    case "fade-out":    return "none";
    default:            return "char-from-bottom";
  }
}

// ── Shared keyframe CSS ───────────────────────────────────────────────────────

export const CHARACTER_KEYFRAMES = `
  @keyframes char-from-bottom {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes char-from-left {
    from { opacity: 0; transform: translateX(-36px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes char-from-right {
    from { opacity: 0; transform: translateX(36px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes char-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;