"use client";

import { useState } from "react";
import styles from "../components/Css/Gametitle.module.css";

interface LetterProps {
  char: string;
  gradFrom: string;
  gradTo: string;
  shadowColor: string;
  delay: number;
}

function AnimatedLetter({ char, gradFrom, gradTo, shadowColor, delay }: LetterProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={styles.letter}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: `linear-gradient(170deg, ${gradFrom} 0%, ${gradTo} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "5px rgba(255,255,255,0.95)",
        filter: hovered
          ? `drop-shadow(0 0 14px ${shadowColor}) drop-shadow(0 6px 0 ${shadowColor}55)`
          : `drop-shadow(0 4px 0 ${shadowColor}66) drop-shadow(0 0 6px ${shadowColor}33)`,
        transform: hovered
          ? `scale(1.3) translateY(-6px) rotate(${delay % 2 === 0 ? -3 : 3}deg)`
          : "scale(1) translateY(0)",
      }}
    >
      {char}
    </span>
  );
}

export default function GameTitle() {
  const letters4th = ["4", "t", "h"];
  const lettersNov = ["N", "o", "v", "e", "m", "b", "e", "r"];

  return (
    <div className={styles.wrapper}>
      {/* Japanese subtitle */}
      <div className={styles.subtitleRow}>
        <div className={`${styles.subtitleLine} ${styles.subtitleLineLeft}`} />
        <span className={styles.subtitleText}>ビジュアル・ノベル</span>
        <div className={`${styles.subtitleLine} ${styles.subtitleLineRight}`} />
      </div>

      {/* "4th" */}
      <div className={`${styles.letterRow} ${styles.letterRow4th}`}>
        {letters4th.map((ch, i) => (
          <AnimatedLetter
            key={i} char={ch}
            gradFrom="#ffb3d1" gradTo="#d81b60"
            shadowColor="#ec4899" delay={i}
          />
        ))}
      </div>

      {/* "November" */}
      <div className={styles.letterRow}>
        {lettersNov.map((ch, i) => (
          <AnimatedLetter
            key={i} char={ch}
            gradFrom="#c7d2fe" gradTo="#3730a3"
            shadowColor="#818cf8" delay={i}
          />
        ))}
      </div>
    </div>
  );
}