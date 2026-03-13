"use client";

import { useState, useEffect } from "react";
import styles from "../components/Css/Gametitle.module.css";

interface LetterProps {
  char: string;
  gradFrom: string;
  gradTo: string;
  shadowColor: string;
  delay: number;
  strokeWidth: string;
}

function AnimatedLetter({ char, gradFrom, gradTo, shadowColor, delay, strokeWidth }: LetterProps) {
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
        WebkitTextStroke: strokeWidth,
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
  const [strokeWidth, setStrokeWidth] = useState("4px rgba(255,255,255,0.95)");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setStrokeWidth("3px rgba(255,255,255,0.95)");
      } else if (w < 768) {
        setStrokeWidth("4px rgba(255,255,255,0.95)");
      } else {
        setStrokeWidth("5px rgba(255,255,255,0.95)");
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
            strokeWidth={strokeWidth}
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
            strokeWidth={strokeWidth}
          />
        ))}
      </div>
    </div>
  );
}