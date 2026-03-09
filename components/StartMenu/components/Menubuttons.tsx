"use client";

import { useState } from "react";
import GameTitle from "./GameTitle";
import styles from "../components/Css/Menubuttons.module.css";

interface MenuButtonsProps {
  characterName: string;
  onStart: () => void;
  onSaves: () => void;
  onSettings: () => void;
}

// ─── START button ──────────────────────────────────────────────────────────────

function StartButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={styles.startOuter}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.startInner}>
        {hovered && <span className={styles.startShimmer} />}

        {/* Play icon in circle */}
        <div className={styles.startIconWrap}>
          <span className={styles.startIcon}>▶</span>
        </div>

        {/* Text */}
        <span className={styles.startTextWrap}>
          <span className={styles.startLabel}>Start Game</span>
          <span className={styles.startSub}>Begin your journey</span>
        </span>

        {/* Arrow */}
        <span className={styles.startArrow}>›</span>
      </div>
    </button>
  );
}

// ─── Card button ───────────────────────────────────────────────────────────────

interface CardBtnProps {
  icon: string;
  label: string;
  sub: string;
  accentFrom: string;
  accentTo: string;
  spinIcon?: boolean;
  onClick: () => void;
}

function CardButton({ icon, label, sub, accentFrom, accentTo, spinIcon, onClick }: CardBtnProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={styles.cardOuter}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 8px 28px ${accentFrom}44, 0 0 40px ${accentFrom}22`
          : "0 2px 16px rgba(0,0,0,0.4)",
      }}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardTopRow}>
          <span
            className={styles.cardIcon}
            style={{
              background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: hovered ? `drop-shadow(0 0 8px ${accentFrom})` : "none",
              animation: spinIcon && hovered ? "icon-spin 0.5s linear" : "none",
            }}
          >
            {icon}
          </span>
          <div
            className={styles.cardBar}
            style={{
              background: hovered
                ? `linear-gradient(to right, ${accentFrom}, ${accentTo})`
                : "rgba(139,92,246,0.25)",
            }}
          />
        </div>
        <span className={styles.cardLabel}>{label}</span>
        <span className={styles.cardSub}>{sub}</span>
      </div>
    </button>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function MenuButtons({
  characterName,
  onStart,
  onSaves,
  onSettings,
}: MenuButtonsProps) {
  return (
    <div className={styles.wrapper}>
      <div className="mb-5">
        <GameTitle />
      </div>

      <p className={styles.welcome}>
        Welcome back, <span className={styles.welcomeName}>{characterName}</span>!
      </p>

      <div className={styles.buttonStack}>
        <StartButton onClick={onStart} />
        <div className={styles.secondaryRow}>
          <CardButton
            icon="◈" label="Saves" sub="Continue story"
            accentFrom="#38bdf8" accentTo="#6366f1"
            onClick={onSaves}
          />
          <CardButton
            icon="⚙" label="Config" sub="Settings"
            accentFrom="#a78bfa" accentTo="#ec4899"
            spinIcon onClick={onSettings}
          />
        </div>
      </div>

      <p className={styles.footer}>
        Made by Xfryy &nbsp;|&nbsp; 4th November Visual Novel
      </p>
    </div>
  );
}