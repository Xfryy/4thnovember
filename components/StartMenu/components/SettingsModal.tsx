"use client";

import { useState } from "react";
import styles from "./Css/Settings.module.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    masterVolume: 80,
    bgmVolume: 70,
    sfxVolume: 75,
    voiceVolume: 80,
    brightness: 100,
    language: "id", // 'id' for Indonesian, 'en' for English
    textSpeed: 50,
  });

  const handleVolumeChange = (key: string, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = (lang: string) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const resetSettings = () => {
    setSettings({
      masterVolume: 80,
      bgmVolume: 70,
      sfxVolume: 75,
      voiceVolume: 80,
      brightness: 100,
      language: "id",
      textSpeed: 50,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>⚙ Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className={styles.content}>
          {/* Language Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Language</h3>
            <div className={styles.languageButtons}>
              <button
                className={`${styles.langBtn} ${
                  settings.language === "id" ? styles.active : ""
                }`}
                onClick={() => handleLanguageChange("id")}
              >
                🇮🇩 Bahasa Indonesia
              </button>
              <button
                className={`${styles.langBtn} ${
                  settings.language === "en" ? styles.active : ""
                }`}
                onClick={() => handleLanguageChange("en")}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          {/* Audio Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Audio</h3>

            {/* Master Volume */}
            <div className={styles.slider}>
              <label>Master Volume</label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume}
                  onChange={(e) =>
                    handleVolumeChange("masterVolume", parseInt(e.target.value))
                  }
                  className={styles.sliderInput}
                />
                <span className={styles.value}>{settings.masterVolume}%</span>
              </div>
            </div>

            {/* BGM Volume */}
            <div className={styles.slider}>
              <label>Background Music</label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.bgmVolume}
                  onChange={(e) =>
                    handleVolumeChange("bgmVolume", parseInt(e.target.value))
                  }
                  className={styles.sliderInput}
                />
                <span className={styles.value}>{settings.bgmVolume}%</span>
              </div>
            </div>

            {/* SFX Volume */}
            <div className={styles.slider}>
              <label>Sound Effects</label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sfxVolume}
                  onChange={(e) =>
                    handleVolumeChange("sfxVolume", parseInt(e.target.value))
                  }
                  className={styles.sliderInput}
                />
                <span className={styles.value}>{settings.sfxVolume}%</span>
              </div>
            </div>

            {/* Voice Volume */}
            <div className={styles.slider}>
              <label>Voice Volume</label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.voiceVolume}
                  onChange={(e) =>
                    handleVolumeChange("voiceVolume", parseInt(e.target.value))
                  }
                  className={styles.sliderInput}
                />
                <span className={styles.value}>{settings.voiceVolume}%</span>
              </div>
            </div>
          </div>

          {/* Display Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Display</h3>

            {/* Brightness */}
            <div className={styles.slider}>
              <label>Brightness</label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.brightness}
                  onChange={(e) =>
                    handleVolumeChange("brightness", parseInt(e.target.value))
                  }
                  className={styles.sliderInput}
                />
                <span className={styles.value}>{settings.brightness}%</span>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Text & Story</h3>

            {/* Text Speed */}
            <div className={styles.slider}>
              <label>Text Speed</label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.textSpeed}
                  onChange={(e) =>
                    handleVolumeChange("textSpeed", parseInt(e.target.value))
                  }
                  className={styles.sliderInput}
                />
                <span className={styles.value}>{settings.textSpeed}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={resetSettings}>
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
