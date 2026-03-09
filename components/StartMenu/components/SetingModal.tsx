"use client";

import { useSettingsStore } from "@/store/Settingsstore";
import styles from "./Css/Settings.module.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SliderRowProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min = 0, max = 100, unit = "%", onChange }: SliderRowProps) {
  return (
    <div className={styles.slider}>
      <label>{label}</label>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={styles.sliderInput}
        />
        <span className={styles.value}>
          {value}{unit}
        </span>
      </div>
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Pull everything from the persistent store — changes auto-save to localStorage
  const {
    masterVolume,
    bgmVolume,
    sfxVolume,
    voiceVolume,
    brightness,
    language,
    textSpeed,
    updateSetting,
    resetSettings,
  } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>⚙ Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Scrollable Content */}
        <div className={styles.content}>

          {/* ── Language ── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Language</h3>
            <div className={styles.languageButtons}>
              <button
                className={`${styles.langBtn} ${language === "id" ? styles.active : ""}`}
                onClick={() => updateSetting("language", "id")}
              >
                🇮🇩 Bahasa Indonesia
              </button>
              <button
                className={`${styles.langBtn} ${language === "en" ? styles.active : ""}`}
                onClick={() => updateSetting("language", "en")}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          {/* ── Audio ── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Audio</h3>

            <SliderRow
              label="Master Volume"
              value={masterVolume}
              onChange={(v) => updateSetting("masterVolume", v)}
            />
            <SliderRow
              label="Background Music"
              value={bgmVolume}
              onChange={(v) => updateSetting("bgmVolume", v)}
            />
            <SliderRow
              label="Sound Effects"
              value={sfxVolume}
              onChange={(v) => updateSetting("sfxVolume", v)}
            />
            <SliderRow
              label="Voice Volume"
              value={voiceVolume}
              onChange={(v) => updateSetting("voiceVolume", v)}
            />

            {/* Live effective volume hint */}
            <p style={{
              fontSize: "0.65rem",
              color: "rgba(167,139,250,0.5)",
              marginTop: 4,
              letterSpacing: "0.05em",
            }}>
              Effective BGM: {Math.round((masterVolume / 100) * bgmVolume)}% &nbsp;·&nbsp;
              SFX: {Math.round((masterVolume / 100) * sfxVolume)}% &nbsp;·&nbsp;
              Voice: {Math.round((masterVolume / 100) * voiceVolume)}%
            </p>
          </div>

          {/* ── Display ── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Display</h3>

            <SliderRow
              label="Brightness"
              value={brightness}
              min={50}
              max={150}
              onChange={(v) => updateSetting("brightness", v)}
            />

            {/* Live brightness preview chip */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 4,
            }}>
              <div style={{
                width: 40, height: 14, borderRadius: 6,
                background: `rgba(255,255,255,${brightness / 100 * 0.9})`,
                border: "1px solid rgba(236,72,153,0.3)",
                transition: "background 0.15s ease",
              }} />
              <span style={{ fontSize: "0.65rem", color: "rgba(167,139,250,0.6)" }}>
                {brightness < 100 ? "Dimmed" : brightness > 100 ? "Brightened" : "Normal"}
              </span>
            </div>
          </div>

          {/* ── Text & Story ── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Text & Story</h3>

            <SliderRow
              label="Text Speed"
              value={textSpeed}
              min={10}
              max={100}
              onChange={(v) => updateSetting("textSpeed", v)}
            />

            {/* Speed label */}
            <p style={{
              fontSize: "0.65rem",
              color: "rgba(167,139,250,0.5)",
              marginTop: 4,
              letterSpacing: "0.05em",
            }}>
              {textSpeed <= 25 ? "🐢 Slow" : textSpeed <= 60 ? "🚶 Normal" : textSpeed <= 85 ? "🏃 Fast" : "⚡ Instant"}
              &nbsp;— {Math.round(110 - textSpeed)}ms per character
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.resetBtn}
            onClick={resetSettings}
          >
            🔄 Reset to Default
          </button>
          <button className={styles.closeMainBtn} onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}