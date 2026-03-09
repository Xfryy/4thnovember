"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  Scene, SceneCharacter, SceneBg, SceneAudio, SceneEffect,
  DialogueScene, MonologueScene, ChoiceScene,
  TransitionScene, CgScene, EndingScene,
} from "@/types/game";
import { audioManager } from "@/lib/Audiomanager";
import DialogueBox from "./DialogueBox";

interface SceneRendererProps {
  scene: Scene;
  onAdvance: (nextSceneId?: string) => void;
}

// ── Size map ───────────────────────────────────────────────────────────────────

const SIZE_MAP = {
  small:  { width: 240, height: 360 },
  medium: { width: 340, height: 510 },
  large:  { width: 480, height: 720 },
  xl:     { width: 600, height: 900 },
  full:   { width: 540, height: 860 },
};

// ── Position map ───────────────────────────────────────────────────────────────

function getCharPos(position: SceneCharacter["position"] = "right"): React.CSSProperties {
  switch (position) {
    case "far-left":     return { left: "-3%",  right: "auto" };
    case "left":         return { left: "3%",   right: "auto" };
    case "center-left":  return { left: "18%",  right: "auto" };
    case "center":       return { left: "50%",  right: "auto", marginLeft: -240 };
    case "center-right": return { right: "18%", left: "auto"  };
    case "right":        return { right: "3%",  left: "auto"  };
    case "far-right":    return { right: "-3%", left: "auto"  };
    default:             return { right: "3%",  left: "auto"  };
  }
}

// ── Audio hook ─────────────────────────────────────────────────────────────────
//
// Fires whenever `audio` content changes (JSON-compared).
// GameEngine already handles BGM on first mount; this hook handles BGM
// *changes* mid-story (e.g. a new track starting in act2) and one-shot
// SFX / voice lines attached to individual scenes.
//
function useSceneAudio(audio?: SceneAudio) {
  useEffect(() => {
    if (!audio) return;

    audioManager.resume();

    if (audio.bgmStop)       { audioManager.stopBgm(); }
    else if (audio.bgmFade)  { audioManager.fadeBgm(); }
    else if (audio.bgm)      { audioManager.playBgm(audio.bgm); }

    // SFX and voice fire every time this scene is shown
    if (audio.sfx)   audioManager.playSfx(audio.sfx);
    if (audio.voice) audioManager.playVoice(audio.voice);

  // JSON.stringify so we only re-run when audio content actually changes,
  // not just when the parent re-renders with a new object reference.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(audio)]);
}

// ── Screen effect hook ─────────────────────────────────────────────────────────

function useSceneEffect(
  effect?: SceneEffect,
  ref?: React.RefObject<HTMLDivElement>
) {
  useEffect(() => {
    if (!effect?.shake || !ref?.current) return;
    const el = ref.current;
    el.style.animation = "fx-shake 0.4s ease both";
    const t = setTimeout(() => { el.style.animation = ""; }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect?.shake]);
}

// ── Background layer ───────────────────────────────────────────────────────────

function BgLayer({ bg }: { bg?: SceneBg }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg?.color ?? "#0e0a1a",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {bg?.image && (
        <Image
          src={bg.image}
          alt="background"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: bg.size === "contain" ? "contain" : "cover",
            objectPosition: bg.position ?? "center",
            filter: bg.filter,
          }}
        />
      )}
      {bg?.overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: bg.overlay,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}

// ── Character sprite ───────────────────────────────────────────────────────────

function CharSprite({
  char,
  isSpeaking,
  hasActiveSpeaker,
}: {
  char: SceneCharacter;
  isSpeaking: boolean;
  hasActiveSpeaker: boolean;
}) {
  const size = SIZE_MAP[char.size ?? "large"];
  const pos  = getCharPos(char.position);
  const dim  = char.dim || (hasActiveSpeaker && !isSpeaking);

  const animName = (() => {
    switch (char.animation ?? "enter-bottom") {
      case "enter-left":  return "char-from-left";
      case "enter-right": return "char-from-right";
      case "fade":        return "char-fade";
      case "none":        return "none";
      default:            return "char-from-bottom";
    }
  })();

  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 110,
          width: size.width,
          height: size.height,
          zIndex: char.zIndex ?? (isSpeaking ? 5 : 4),
          opacity: dim ? 0.42 : 1,
          filter: dim
            ? "brightness(0.45) saturate(0.3)"
            : "drop-shadow(0 16px 48px rgba(0,0,0,0.55))",
          transition: "opacity 0.35s ease, filter 0.35s ease",
          transform: char.flip ? "scaleX(-1)" : undefined,
          animation:
            animName !== "none"
              ? `${animName} 0.45s cubic-bezier(0.22,1,0.36,1) both`
              : undefined,
          ...pos,
        }}
      >
        <Image
          src={char.sprite}
          alt={char.id}
          fill
          priority
          sizes={`${size.width}px`}
          style={{ objectFit: "contain", objectPosition: "bottom" }}
        />
      </div>
      <style>{`
        @keyframes char-from-bottom { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes char-from-left   { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:none} }
        @keyframes char-from-right  { from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:none} }
        @keyframes char-fade        { from{opacity:0} to{opacity:1} }
        @keyframes fx-shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-7px)} 40%{transform:translateX(7px)}
          60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
        }
      `}</style>
    </>
  );
}

function CharactersLayer({
  characters = [],
  speakerId,
}: {
  characters?: SceneCharacter[];
  speakerId?: string;
}) {
  const hasActiveSpeaker = !!speakerId;
  return (
    <>
      {characters.map((char) => (
        <CharSprite
          key={`${char.id}-${char.sprite}`}
          char={char}
          isSpeaking={char.id === speakerId}
          hasActiveSpeaker={hasActiveSpeaker}
        />
      ))}
    </>
  );
}

// ── Scene views ────────────────────────────────────────────────────────────────

function DialogueView({
  scene,
  onAdvance,
}: {
  scene: DialogueScene;
  onAdvance: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSceneAudio(scene.audio);
  useSceneEffect(scene.effect, ref);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
      <BgLayer bg={scene.bg} />
      <CharactersLayer characters={scene.characters} speakerId={scene.speakerId} />
      <DialogueBox speaker={scene.speaker} text={scene.text} onAdvance={onAdvance} />
    </div>
  );
}

function MonologueView({
  scene,
  onAdvance,
}: {
  scene: MonologueScene;
  onAdvance: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSceneAudio(scene.audio);
  useSceneEffect(scene.effect, ref);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
      <BgLayer bg={scene.bg} />
      <CharactersLayer characters={scene.characters} speakerId={undefined} />
      <DialogueBox speaker={undefined} text={scene.text} onAdvance={onAdvance} />
    </div>
  );
}

function TransitionView({
  scene,
  onAdvance,
}: {
  scene: TransitionScene;
  onAdvance: () => void;
}) {
  useSceneAudio(scene.audio);

  return (
    <div
      onClick={onAdvance}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <BgLayer bg={scene.bg ?? { color: "#06020f" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          animation: "tr-fade 0.9s ease both",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            fontWeight: 300,
            letterSpacing: "0.22em",
            textAlign: "center",
            whiteSpace: "pre-line",
            lineHeight: 1.9,
            animation: "tr-text 1s ease 0.35s both",
          }}
        >
          {scene.text}
        </p>
      </div>
      <style>{`
        @keyframes tr-fade { from{opacity:0} to{opacity:1} }
        @keyframes tr-text { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}

function ChoiceView({
  scene,
  onAdvance,
}: {
  scene: ChoiceScene;
  onAdvance: (id: string) => void;
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <BgLayer bg={scene.bg} />
      <CharactersLayer characters={scene.characters} speakerId={undefined} />

      {/* Dim overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.38)",
          zIndex: 10,
        }}
      />

      {/* Choice panel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "0 40px",
        }}
      >
        {scene.question && (
          <p
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              marginBottom: 8,
              textAlign: "center",
              textShadow: "0 2px 16px rgba(0,0,0,0.7)",
              animation: "ch-in 0.4s ease both",
            }}
          >
            {scene.question}
          </p>
        )}

        {scene.options.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => onAdvance(opt.next)}
            style={{
              width: "min(560px, 85%)",
              padding: "14px 28px",
              borderRadius: 10,
              border: "1px solid rgba(236,72,153,0.35)",
              background: "rgba(10,6,20,0.82)",
              backdropFilter: "blur(14px)",
              color: "rgba(255,255,255,0.88)",
              fontWeight: 500,
              fontSize: "0.95rem",
              letterSpacing: "0.03em",
              cursor: "pointer",
              transition: "all 0.15s ease",
              textAlign: "left",
              animation: `ch-in 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.07 + 0.1}s both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = "rgba(236,72,153,0.2)";
              e.currentTarget.style.borderColor = "rgba(236,72,153,0.75)";
              e.currentTarget.style.color       = "#fff";
              e.currentTarget.style.transform   = "translateX(6px)";
              e.currentTarget.style.boxShadow   = "0 0 20px rgba(236,72,153,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = "rgba(10,6,20,0.82)";
              e.currentTarget.style.borderColor = "rgba(236,72,153,0.35)";
              e.currentTarget.style.color       = "rgba(255,255,255,0.88)";
              e.currentTarget.style.transform   = "none";
              e.currentTarget.style.boxShadow   = "none";
            }}
          >
            <span
              style={{
                color: "#ec4899",
                marginRight: 12,
                fontWeight: 800,
                fontSize: "0.85rem",
              }}
            >
              {["①", "②", "③", "④", "⑤"][i] ?? `${i + 1}.`}
            </span>
            {opt.text}
          </button>
        ))}
      </div>

      <style>{`@keyframes ch-in { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }`}</style>
    </div>
  );
}

function CgView({
  scene,
  onAdvance,
}: {
  scene: CgScene;
  onAdvance: () => void;
}) {
  useSceneAudio(scene.audio);

  return (
    <div
      onClick={onAdvance}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
        background: "#000",
        animation: "cg-fade 0.7s ease both",
      }}
    >
      <Image
        src={scene.image}
        alt="CG"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "contain" }}
      />
      {scene.caption && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.68)",
            backdropFilter: "blur(8px)",
            padding: "10px 28px",
            borderRadius: 8,
            color: "rgba(255,255,255,0.88)",
            fontSize: "0.9rem",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            animation: "cg-fade 0.8s ease 0.4s both",
          }}
        >
          {scene.caption}
        </div>
      )}
      <style>{`@keyframes cg-fade { from{opacity:0} to{opacity:1} }`}</style>
    </div>
  );
}

function EndingView({
  scene,
  onAdvance,
}: {
  scene: EndingScene;
  onAdvance: () => void;
}) {
  useSceneAudio(scene.audio);

  const colors: Record<string, string> = {
    act:  "rgba(236,72,153,0.85)",
    good: "rgba(74,222,128,0.85)",
    bad:  "rgba(248,113,113,0.85)",
    true: "rgba(167,139,250,0.95)",
  };
  const c = colors[scene.endingType] ?? colors.act;

  return (
    <div
      onClick={onAdvance}
      style={{ width: "100%", height: "100%", position: "relative", cursor: "pointer" }}
    >
      <BgLayer bg={scene.bg ?? { color: "#06020f" }} />

      {scene.characterSprite && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 380,
            height: 580,
            opacity: 0.5,
            zIndex: 2,
            animation: "end-char 1.2s ease 0.3s both",
          }}
        >
          <Image
            src={scene.characterSprite}
            alt="character"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom" }}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <p
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: c,
            textShadow: `0 0 48px ${c}`,
            animation: "end-in 1s ease 0.5s both",
            textAlign: "center",
          }}
        >
          {scene.title}
        </p>

        {scene.subtitle && (
          <p
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              animation: "end-in 1s ease 0.8s both",
            }}
          >
            {scene.subtitle}
          </p>
        )}

        <p
          style={{
            marginTop: 32,
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: "rgba(236,72,153,0.4)",
            animation: "end-in 1s ease 1.2s both",
          }}
        >
          — CLICK TO CONTINUE —
        </p>
      </div>

      <style>{`
        @keyframes end-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes end-char { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:0.5;transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}

// ── Main router ────────────────────────────────────────────────────────────────

export default function SceneRenderer({ scene, onAdvance }: SceneRendererProps) {
  switch (scene.type) {
    case "dialogue":
      return <DialogueView   scene={scene} onAdvance={() => onAdvance(scene.next)} />;
    case "monologue":
      return <MonologueView  scene={scene} onAdvance={() => onAdvance(scene.next)} />;
    case "transition":
      return <TransitionView scene={scene} onAdvance={() => onAdvance(scene.next)} />;
    case "choice":
      return <ChoiceView     scene={scene} onAdvance={(id) => onAdvance(id)} />;
    case "cg":
      return <CgView         scene={scene} onAdvance={() => onAdvance(scene.next)} />;
    case "ending":
      return <EndingView     scene={scene} onAdvance={() => onAdvance(scene.next)} />;
    default:
      return <div style={{ color: "red", padding: 40 }}>Unknown scene type</div>;
  }
}