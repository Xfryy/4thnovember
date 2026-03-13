/**
 * Characterlayout.ts
 *
 * RESPONSIVE FIX:
 * - Separate size tables for mobile vs desktop (clamp dengan vw agar benar-benar responsif)
 * - clamp(min, idealVw, max) — ideal pakai vw sehingga mengikuti lebar layar
 * - getCharWrapperStyle menerima isMobile: boolean (default false)
 * - Semua scene view tinggal pass isMobile dari useIsMobile()
 */

import type React from "react";
import type { CharacterPosition, CharacterSize, SceneCharacter } from "@/types/game";

// ── Position anchors ──────────────────────────────────────────────────────

export const POSITION_MAP: Record<CharacterPosition, React.CSSProperties> = {
  "far-left":     { left: "0%",  right: "auto" },
  "left":         { left: "5%",  right: "auto" },
  "center-left":  { left: "20%", right: "auto" },
  "center":       { left: "50%", transform: "translateX(-50%)" },
  "center-right": { right: "20%", left: "auto" },
  "right":        { right: "5%",  left: "auto" },
  "far-right":    { right: "0%",  left: "auto" },
};

export function getPositionStyle(position?: CharacterPosition): React.CSSProperties {
  return POSITION_MAP[position ?? "center"] ?? POSITION_MAP["center"];
}

// ── Size tables ────────────────────────────────────────────────────────────
//
//  Mobile  → target ~390-480px wide viewport
//  Desktop → target ~1024-1920px wide viewport
//
//  Formula: clamp(hardMin, X vw, hardMax)
//  — hardMin prevents character collapsing on tiny screens
//  — vw value drives natural scaling within the device tier
//  — hardMax prevents characters from becoming absurdly large
//
//  Aspect ratios (height/width) kept at ~1.9 for full-body sprites

interface SizeDef { w: string; h: string }

const MOBILE_SIZES: Record<CharacterSize, SizeDef> = {
  //          w: clamp(min, vw,  max)          h: clamp(min*1.9, vw*1.9, max*1.9)
  small:  { w: "clamp( 70px, 19vw, 110px)", h: "clamp(133px, 36vw, 209px)" },
  medium: { w: "clamp( 95px, 26vw, 140px)", h: "clamp(181px, 49vw, 266px)" },
  large:  { w: "clamp(115px, 33vw, 165px)", h: "clamp(219px, 63vw, 314px)" },
  xl:     { w: "clamp(140px, 38vw, 190px)", h: "clamp(266px, 72vw, 361px)" },
  full:   { w: "clamp(160px, 43vw, 215px)", h: "clamp(304px, 82vw, 409px)" },
};

const DESKTOP_SIZES: Record<CharacterSize, SizeDef> = {
  //           w: clamp(min,  vw,   max)         h: clamp(min*1.9, vw*1.9, max*1.9)
  small:  { w: "clamp(160px, 12vw, 230px)", h: "clamp(304px, 23vw, 437px)" },
  medium: { w: "clamp(230px, 17vw, 320px)", h: "clamp(437px, 32vw, 608px)" },
  large:  { w: "clamp(310px, 23vw, 430px)", h: "clamp(589px, 44vw, 817px)" },
  xl:     { w: "clamp(370px, 27vw, 510px)", h: "clamp(703px, 51vw, 969px)" },
  full:   { w: "clamp(430px, 31vw, 580px)", h: "clamp(817px, 59vw,1102px)" },
};

// ── Responsive size resolver ──────────────────────────────────────────────

function getResponsiveSize(
  size: CharacterSize = "large",
  isMobile: boolean,
  customSize?: { width?: number; height?: number },
): SizeDef {
  // Custom size dari scene data selalu dipakai apa adanya
  if (customSize?.width && customSize?.height) {
    return {
      w: `${customSize.width}px`,
      h: `${customSize.height}px`,
    };
  }
  const table = isMobile ? MOBILE_SIZES : DESKTOP_SIZES;
  return table[size] ?? table["large"];
}

// ── Wrapper style ─────────────────────────────────────────────────────────

/**
 * @param char      - SceneCharacter dari scene data
 * @param isMobile  - dari useIsMobile() di scene view
 */
export function getCharWrapperStyle(
  char: SceneCharacter,
  isMobile: boolean = false,
): React.CSSProperties {
  const posStyle = getPositionStyle(char.position);

  const sanitizedCustomSize = char.customSize
    ? {
        width:  typeof char.customSize.width  === "string" ? parseInt(char.customSize.width,  10) : char.customSize.width,
        height: typeof char.customSize.height === "string" ? parseInt(char.customSize.height, 10) : char.customSize.height,
      }
    : undefined;

  const { w: width, h: height } = getResponsiveSize(char.size, isMobile, sanitizedCustomSize);

  // Bottom / offsetY
  const bottom =
    char.bottom !== undefined
      ? typeof char.bottom === "number"
        ? `${char.bottom}px`
        : char.bottom
      : char.offsetY
      ? `${char.offsetY}px`
      : "0px";

  // Transform — preserve translate from posStyle, add flip / offsetX
  let transform = posStyle.transform ?? "";
  if (char.flip) transform += " scaleX(-1)";
  if (char.offsetX) {
    if (char.position === "center") {
      transform = `translateX(calc(-50% + ${char.offsetX}px))${char.flip ? " scaleX(-1)" : ""}`;
    } else {
      transform = `translateX(${char.offsetX}px)${char.flip ? " scaleX(-1)" : ""}`;
    }
  }

  return {
    position: "absolute",
    bottom,
    ...posStyle,
    transform: transform || undefined,

    width,
    height,

    background:    "transparent",
    border:        "none",
    outline:       "none",
    overflow:      "visible",
    pointerEvents: "auto",
    zIndex:        char.zIndex ?? 5,

    // Dim — karakter non-speaker
    opacity: char.dim ? 0.45 : 1,
    filter:  char.dim ? "brightness(0.45) saturate(0.6)" : "none",

    // Animasi masuk
    animation:
      char.animation && char.animation !== "none"
        ? `${getAnimName(char.animation)} 0.45s cubic-bezier(0.22,1,0.36,1) both`
        : undefined,
  };
}

// ── Image style ───────────────────────────────────────────────────────────

export function getCharImgStyle(_char: SceneCharacter): React.CSSProperties {
  return {
    width:          "100%",
    height:         "100%",
    objectFit:      "contain",
    objectPosition: "bottom center",
    background:     "transparent",
    display:        "block",
    userSelect:     "none",
    pointerEvents:  "none",
  };
}

// ── Animation helpers ─────────────────────────────────────────────────────

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