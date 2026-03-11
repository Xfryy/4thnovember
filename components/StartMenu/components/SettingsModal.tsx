"use client";

import { useSettingsStore } from "@/store/Settingsstore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── CSS-native slider — zero JS overhead on drag ────────────────────────────

interface SliderRowProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  accentVar: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min = 0, max = 100, unit = "%", accentVar, onChange }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={`stg-slider stg-slider--${accentVar}`}>
      <div className="stg-slider__head">
        <span className="stg-slider__label">{label}</span>
        <span className="stg-slider__val">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        onChange={e => onChange(parseInt(e.target.value))}
        className="stg-range"
      />
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="stg-section">
      <div className="stg-section__hd">
        <span className="stg-section__icon">{icon}</span>
        <span className="stg-section__title">{title}</span>
      </div>
      <div className="stg-section__body">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <div className="stg-chip">{children}</div>;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    masterVolume, bgmVolume, sfxVolume, voiceVolume,
    brightness, language, textSpeed,
    updateSetting, resetSettings,
  } = useSettingsStore();

  if (!isOpen) return null;

  const speedLabel =
    textSpeed <= 25 ? "🐢 Slow" :
    textSpeed <= 60 ? "🚶 Normal" :
    textSpeed <= 85 ? "🏃 Fast" : "⚡ Instant";

  return (
    <>
      <div className="stg-backdrop" onClick={onClose} />

      <div className="stg-shell">
        <div className="stg-panel">

          <div className="stg-bar" />

          <div className="stg-header">
            <div className="stg-header__icon">⚙</div>
            <div>
              <p className="stg-header__title">Settings</p>
              <p className="stg-header__sub">Game Configuration</p>
            </div>
            <button className="stg-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div className="stg-body">

            <Section icon="🌐" title="Language">
              <div className="stg-lang">
                {(["id", "en"] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => updateSetting("language", lang)}
                    className={`stg-lang__btn${language === lang ? " stg-lang__btn--on" : ""}`}
                  >
                    {lang === "id" ? "🇮🇩  Bahasa Indonesia" : "🇺🇸  English"}
                  </button>
                ))}
              </div>
            </Section>

            <Section icon="🎵" title="Audio">
              <SliderRow label="Master Volume"    value={masterVolume} accentVar="pink"   onChange={v => updateSetting("masterVolume", v)} />
              <SliderRow label="Background Music" value={bgmVolume}    accentVar="purple" onChange={v => updateSetting("bgmVolume", v)} />
              <SliderRow label="Sound Effects"    value={sfxVolume}    accentVar="indigo" onChange={v => updateSetting("sfxVolume", v)} />
              <SliderRow label="Voice"            value={voiceVolume}  accentVar="sky"    onChange={v => updateSetting("voiceVolume", v)} />
              <Chip>
                <b>Effective</b>&nbsp;—&nbsp;
                BGM: <em>{Math.round((masterVolume / 100) * bgmVolume)}%</em>&nbsp;·&nbsp;
                SFX: <em>{Math.round((masterVolume / 100) * sfxVolume)}%</em>&nbsp;·&nbsp;
                Voice: <em>{Math.round((masterVolume / 100) * voiceVolume)}%</em>
              </Chip>
            </Section>

            <Section icon="🖥" title="Display">
              <SliderRow label="Brightness" value={brightness} min={50} max={150} accentVar="amber" onChange={v => updateSetting("brightness", v)} />
              <div className="stg-bright-preview" style={{ filter: `brightness(${brightness / 100})` }}>
                <span className="stg-bright-preview__label">
                  {brightness < 90 ? "🌙 Dimmed" : brightness > 110 ? "☀ Brightened" : "⚖ Normal"} — {brightness}%
                </span>
              </div>
            </Section>

            <Section icon="💬" title="Text & Story">
              <SliderRow label="Text Speed" value={textSpeed} min={10} max={100} unit="" accentVar="green" onChange={v => updateSetting("textSpeed", v)} />
              <Chip>
                {speedLabel}&nbsp;&nbsp;<em>{Math.round(110 - textSpeed)}ms</em> per character
                {textSpeed >= 90 && <span className="stg-chip__warn">&nbsp;⚡ Instant</span>}
              </Chip>
            </Section>

          </div>

          <div className="stg-footer">
            <button className="stg-footer__reset" onClick={resetSettings}>🔄 Reset</button>
            <button className="stg-footer__close" onClick={onClose}>Close</button>
          </div>

        </div>
      </div>

      <style>{`
        .stg-backdrop {
          position:fixed; inset:0; z-index:1000;
          background:rgba(0,0,0,.75);
          backdrop-filter:blur(12px);
          animation:stg-bg .22s ease both;
        }
        @keyframes stg-bg { from{opacity:0} to{opacity:1} }

        .stg-shell {
          position:fixed; top:50%; left:50%;
          transform:translate(-50%,-50%);
          z-index:1001;
          width:min(500px,calc(100vw - 32px));
          max-height:min(84vh,700px);
          display:flex; flex-direction:column;
        }

        .stg-panel {
          display:flex; flex-direction:column;
          max-height:min(84vh,700px);
          border-radius:14px; overflow:hidden;
          background:rgba(8,4,20,0.98);
          border:1px solid rgba(255,255,255,.07);
          box-shadow:0 28px 70px rgba(0,0,0,.9),0 0 0 1px rgba(236,72,153,.08);
          animation:stg-in .26s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes stg-in {
          from{opacity:0;transform:scale(.96) translateY(5px)}
          to{opacity:1;transform:scale(1) translateY(0)}
        }

        .stg-bar {
          height:2px; flex-shrink:0;
          background:linear-gradient(90deg,transparent,#ec4899 25%,#a855f7 60%,#6366f1 88%,transparent);
        }

        .stg-header {
          display:flex; align-items:center; gap:10px;
          padding:12px 15px 11px; flex-shrink:0;
          border-bottom:1px solid rgba(255,255,255,.05);
        }
        .stg-header__icon {
          width:30px; height:30px; border-radius:7px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:.85rem;
          background:rgba(139,92,246,.15);
          border:1px solid rgba(139,92,246,.28);
        }
        .stg-header__title {
          margin:0; font-size:.88rem; font-weight:900;
          letter-spacing:.06em; color:#fff;
        }
        .stg-header__sub {
          margin:0; font-size:.48rem; letter-spacing:.2em;
          text-transform:uppercase; color:rgba(167,139,250,.32); margin-top:1px;
        }
        .stg-close {
          margin-left:auto; width:26px; height:26px;
          border-radius:6px; border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.04); color:rgba(255,255,255,.38);
          font-size:.72rem; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all .15s ease;
        }
        .stg-close:hover {
          background:rgba(239,68,68,.18);
          border-color:rgba(239,68,68,.4);
          color:#f87171;
        }

        .stg-body {
          flex:1; overflow-y:auto;
          padding:11px 13px;
          display:flex; flex-direction:column; gap:8px;
          scrollbar-width:thin;
          scrollbar-color:rgba(236,72,153,.28) transparent;
        }
        .stg-body::-webkit-scrollbar{width:4px}
        .stg-body::-webkit-scrollbar-thumb{
          background:rgba(236,72,153,.28);border-radius:99px
        }

        .stg-section {
          border-radius:9px; overflow:hidden;
          border:1px solid rgba(255,255,255,.05);
          background:rgba(255,255,255,.02);
        }
        .stg-section__hd {
          display:flex; align-items:center; gap:7px;
          padding:7px 13px;
          background:rgba(236,72,153,.04);
          border-bottom:1px solid rgba(255,255,255,.04);
        }
        .stg-section__icon{font-size:.78rem;line-height:1}
        .stg-section__title {
          font-size:.52rem; font-weight:900;
          letter-spacing:.24em; text-transform:uppercase;
          color:rgba(236,72,153,.62);
        }
        .stg-section__body {
          padding:12px 13px;
          display:flex; flex-direction:column; gap:11px;
        }

        .stg-lang{display:grid;grid-template-columns:1fr 1fr;gap:7px}
        .stg-lang__btn {
          padding:8px 10px; border-radius:7px; cursor:pointer;
          font-size:.7rem; font-weight:400; letter-spacing:.02em;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.03);
          color:rgba(196,181,253,.42);
          transition:all .15s ease;
        }
        .stg-lang__btn:hover {
          border-color:rgba(236,72,153,.28);
          color:rgba(196,181,253,.72);
          background:rgba(255,255,255,.05);
        }
        .stg-lang__btn--on {
          border:1.5px solid rgba(236,72,153,.65)!important;
          background:rgba(236,72,153,.1)!important;
          color:#f9a8d4!important;
          font-weight:700;
          box-shadow:0 0 10px rgba(236,72,153,.1);
        }

        .stg-slider{display:flex;flex-direction:column;gap:5px}
        .stg-slider__head{display:flex;justify-content:space-between;align-items:baseline}
        .stg-slider__label{
          font-size:.7rem;font-weight:600;
          color:rgba(196,181,253,.72);letter-spacing:.03em;
        }
        .stg-slider__val{
          font-size:.65rem;font-weight:800;
          font-family:monospace;letter-spacing:.05em;
        }

        .stg-slider--pink   .stg-slider__val{color:#ec4899}
        .stg-slider--purple .stg-slider__val{color:#a855f7}
        .stg-slider--indigo .stg-slider__val{color:#818cf8}
        .stg-slider--sky    .stg-slider__val{color:#38bdf8}
        .stg-slider--amber  .stg-slider__val{color:#fbbf24}
        .stg-slider--green  .stg-slider__val{color:#34d399}

        /* CSS-only gradient fill using --pct custom property set inline */
        .stg-range {
          -webkit-appearance:none; appearance:none;
          width:100%; height:4px; border-radius:99px;
          outline:none; cursor:pointer; border:none; display:block;
          background:linear-gradient(
            to right,
            var(--accent-a) 0%,
            var(--accent-b) var(--pct),
            rgba(255,255,255,.07) var(--pct),
            rgba(255,255,255,.07) 100%
          );
        }
        .stg-range::-webkit-slider-thumb {
          -webkit-appearance:none; appearance:none;
          width:14px; height:14px; border-radius:50%;
          background:#fff;
          box-shadow:0 0 0 2px rgba(0,0,0,.6),0 0 8px var(--accent-b);
          cursor:pointer;
          transition:transform .1s ease,box-shadow .1s ease;
        }
        .stg-range::-webkit-slider-thumb:hover{
          transform:scale(1.28);
          box-shadow:0 0 0 2px rgba(0,0,0,.6),0 0 14px var(--accent-b);
        }
        .stg-range::-moz-range-thumb{
          width:14px;height:14px;border-radius:50%;
          background:#fff;border:none;
          box-shadow:0 0 0 2px rgba(0,0,0,.6),0 0 8px var(--accent-b);
          cursor:pointer;
        }

        .stg-slider--pink   .stg-range{--accent-a:#ec489966;--accent-b:#ec4899}
        .stg-slider--purple .stg-range{--accent-a:#a855f766;--accent-b:#a855f7}
        .stg-slider--indigo .stg-range{--accent-a:#818cf866;--accent-b:#818cf8}
        .stg-slider--sky    .stg-range{--accent-a:#38bdf866;--accent-b:#38bdf8}
        .stg-slider--amber  .stg-range{--accent-a:#fbbf2466;--accent-b:#fbbf24}
        .stg-slider--green  .stg-range{--accent-a:#34d39966;--accent-b:#34d399}

        .stg-bright-preview {
          height:22px;border-radius:7px;overflow:hidden;position:relative;
          border:1px solid rgba(255,255,255,.06);
          background:linear-gradient(90deg,#06020f 0%,#2a1050 35%,#ec4899 70%,#fff 100%);
          transition:filter .08s linear;
        }
        .stg-bright-preview__label {
          position:absolute;inset:0;
          display:flex;align-items:center;justify-content:center;
          font-size:.52rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
          color:rgba(255,255,255,.78);text-shadow:0 1px 4px rgba(0,0,0,.9);
        }

        .stg-chip {
          padding:5px 10px;
          background:rgba(139,92,246,.06);
          border:1px solid rgba(139,92,246,.12);
          border-radius:7px;
          font-size:.58rem;
          color:rgba(167,139,250,.5);
          letter-spacing:.03em;line-height:1.7;
        }
        .stg-chip b{color:rgba(236,72,153,.72);font-weight:700}
        .stg-chip em{color:rgba(196,181,253,.82);font-style:normal;font-weight:700}
        .stg-chip__warn{color:rgba(251,191,36,.68)}

        .stg-footer {
          display:flex;gap:8px;
          padding:10px 13px;
          border-top:1px solid rgba(255,255,255,.04);
          flex-shrink:0;
        }
        .stg-footer__reset {
          flex:0 0 auto;padding:8px 13px;border-radius:7px;cursor:pointer;
          font-size:.65rem;font-weight:700;letter-spacing:.07em;
          background:rgba(239,68,68,.07);
          border:1px solid rgba(239,68,68,.18);
          color:rgba(252,165,165,.55);
          transition:all .15s ease;
        }
        .stg-footer__reset:hover{
          background:rgba(239,68,68,.17);
          border-color:rgba(239,68,68,.38);
          color:#fca5a5;
        }
        .stg-footer__close {
          flex:1;padding:8px 13px;border-radius:7px;cursor:pointer;
          font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
          background:linear-gradient(135deg,rgba(236,72,153,.2),rgba(168,85,247,.16));
          border:1px solid rgba(236,72,153,.3);
          color:#f9a8d4;
          transition:all .15s ease;
        }
        .stg-footer__close:hover{
          background:linear-gradient(135deg,rgba(236,72,153,.35),rgba(168,85,247,.28));
          box-shadow:0 0 14px rgba(236,72,153,.16);
          color:#fff;
        }
      `}</style>
    </>
  );
}