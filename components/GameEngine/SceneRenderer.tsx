"use client";

import Image from "next/image";
import { Scene, ChoiceScene } from "@/types/game";
import DialogueBox from "./DialogueBox";

interface SceneRendererProps {
  scene: Scene;
  onAdvance: (nextSceneId?: string) => void;
}

// ── Shared: white canvas + character sprite layout ─────────────────────────────
function SceneCanvas({ children, bg = "#ffffff" }: { children: React.ReactNode; bg?: string }) {
  return (
    <div
      style={{
        width: "100%", height: "100%",
        background: bg,
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

interface CharacterProps {
  src: string;
  name: string;
  side?: "left" | "center" | "right";
}

function CharacterSprite({ src, name, side = "right" }: CharacterProps) {
  const posMap = {
    left:   { left: "8%",  right: "auto", transform: "none" },
    center: { left: "50%", right: "auto", transform: "translateX(-50%)" },
    right:  { right: "8%", left: "auto",  transform: "none" },
  };
  const pos = posMap[side];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120, // sit above dialogue box
        width: 320,
        height: 520,
        ...pos,
        // Soft entrance
        animation: "char-enter 0.4s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <Image
        src={src}
        alt={name}
        fill
        priority
        sizes="320px"
        style={{
          objectFit: "contain",
          objectPosition: "bottom",
          filter: "drop-shadow(0 8px 32px rgba(236,72,153,0.15))",
        }}
      />
      <style>{`
        @keyframes char-enter {
          from { opacity: 0; transform: ${pos.transform || "none"} translateY(18px); }
          to   { opacity: 1; transform: ${pos.transform || "none"} translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Scene renderers ────────────────────────────────────────────────────────────

function DialogueSceneView({ scene, onAdvance }: { scene: Extract<Scene, { type: "dialogue" }>; onAdvance: () => void }) {
  return (
    <SceneCanvas>
      <CharacterSprite src={scene.characterSprite} name={scene.character} side="right" />
      <DialogueBox
        characterName={scene.character}
        text={scene.dialogueText}
        onAdvance={onAdvance}
      />
    </SceneCanvas>
  );
}

function MonologueSceneView({ scene, onAdvance }: { scene: Extract<Scene, { type: "monologue" }>; onAdvance: () => void }) {
  return (
    <SceneCanvas>
      <DialogueBox
        characterName={undefined}
        text={scene.dialogueText}
        onAdvance={onAdvance}
      />
    </SceneCanvas>
  );
}

function TransitionSceneView({
  scene,
  onAdvance,
}: {
  scene: Extract<Scene, { type: "transition" }>;
  onAdvance: () => void;
}) {
  // Auto-advance after duration, also allow click to skip
  return (
    <div
      onClick={onAdvance}
      style={{
        width: "100%", height: "100%",
        background: "#0a0618",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        animation: "fade-in 0.8s ease both",
      }}
    >
      <p
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textAlign: "center",
          whiteSpace: "pre-line",
          animation: "text-appear 1s ease 0.4s both",
        }}
      >
        {scene.narrationText}
      </p>
      <style>{`
        @keyframes fade-in    { from { opacity:0; } to { opacity:1; } }
        @keyframes text-appear { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  );
}

function ChoiceSceneView({
  scene,
  onAdvance,
}: {
  scene: ChoiceScene;
  onAdvance: (nextId: string) => void;
}) {
  return (
    <SceneCanvas>
      {/* Question */}
      <div
        style={{
          position: "absolute",
          top: "30%", left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#1a1030",
          fontWeight: 700,
          fontSize: "1.1rem",
          letterSpacing: "0.04em",
          marginBottom: 24,
        }}
      >
        {scene.questionText}
      </div>

      {/* Choices */}
      <div
        style={{
          position: "absolute",
          top: "45%", left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "min(480px, 80%)",
        }}
      >
        {scene.options.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => onAdvance(opt.nextScene)}
            style={{
              padding: "14px 24px",
              borderRadius: 12,
              border: "1.5px solid rgba(236,72,153,0.3)",
              background: "rgba(255,255,255,0.9)",
              color: "#1a1030",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.18s ease",
              textAlign: "left",
              animation: `choice-in 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s both`,
              boxShadow: "0 2px 12px rgba(236,72,153,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(168,85,247,0.08))";
              e.currentTarget.style.borderColor = "rgba(236,72,153,0.6)";
              e.currentTarget.style.transform = "translateX(6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              e.currentTarget.style.borderColor = "rgba(236,72,153,0.3)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <span style={{ color: "#ec4899", marginRight: 10, fontWeight: 800 }}>
              {["①", "②", "③", "④"][i] ?? `${i + 1}.`}
            </span>
            {opt.text}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes choice-in {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:none; }
        }
      `}</style>
    </SceneCanvas>
  );
}

function EndingSceneView({
  scene,
  onAdvance,
}: {
  scene: Extract<Scene, { type: "ending" }>;
  onAdvance: () => void;
}) {
  return (
    <div
      onClick={onAdvance}
      style={{
        width: "100%", height: "100%",
        background: "#0a0618",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        gap: 24,
      }}
    >
      {scene.characterSprite && (
        <div style={{ width: 200, height: 320, position: "relative", opacity: 0.6 }}>
          <Image src={scene.characterSprite} alt="character" fill style={{ objectFit: "contain" }} />
        </div>
      )}
      <p
        style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "1.3rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          animation: "fade-in 1.2s ease 0.5s both",
        }}
      >
        {scene.endingText}
      </p>
      <p style={{ color: "rgba(236,72,153,0.5)", fontSize: "0.7rem", letterSpacing: "0.3em", marginTop: 8 }}>
        — Click to continue —
      </p>
      <style>{`@keyframes fade-in { from { opacity:0; } to { opacity:1; } }`}</style>
    </div>
  );
}

// ── Main router ────────────────────────────────────────────────────────────────

export default function SceneRenderer({ scene, onAdvance }: SceneRendererProps) {
  switch (scene.type) {
    case "dialogue":
      return (
        <DialogueSceneView
          scene={scene}
          onAdvance={() => onAdvance(scene.nextScene)}
        />
      );

    case "monologue":
      return (
        <MonologueSceneView
          scene={scene}
          onAdvance={() => onAdvance(scene.nextScene)}
        />
      );

    case "transition":
      return (
        <TransitionSceneView
          scene={scene}
          onAdvance={() => onAdvance(scene.nextScene)}
        />
      );

    case "choice":
      return (
        <ChoiceSceneView
          scene={scene}
          onAdvance={(nextId) => onAdvance(nextId)}
        />
      );

    case "ending":
      return (
        <EndingSceneView
          scene={scene}
          onAdvance={() => onAdvance(scene.nextScene)}
        />
      );

    default:
      return <div style={{ color: "red", padding: 40 }}>Unknown scene type</div>;
  }
}