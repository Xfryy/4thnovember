import { Scene } from "@/types/game";

/**
 * Act 1: 目覚め — Awakening
 *
 * MC wakes up in a hospital with no memories.
 * A beautiful girl is waiting by his side — his girlfriend, Rin Fuyutsuki-hime.
 * But who is she? And why can't he remember anything?
 *
 * Themes: amnesia, grief, trauma, the warmth of someone who refuses to leave.
 */

export const ACT_1_SCENES_EN: Scene[] = [

  // ═══════════════════════════════════════════════════════════════════
  // ── OPENING — Full Scene Image
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "act1_s1",
    type: "transition",
    act: 1,
    sceneNumber: 1,
    text: "",
    bg: { color: "#000000" },
    duration: 1800,
    next: "act1_s2",
  },

  {
    id: "act1_s2",
    type: "cg",
    act: 1,
    sceneNumber: 2,
    image: "/Image/scenes/Act_1/scene_1.jpeg",
    caption: "",
    next: "act1_s3",
  },

  // ── MC Opens Eyes ──────────────────────────────────────────────

  {
    id: "act1_s3",
    type: "monologue",
    act: 1,
    sceneNumber: 3,
    text: "____",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s4",
  },

  {
    id: "act1_s4",
    type: "monologue",
    act: 1,
    sceneNumber: 4,
    text: "______",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s5",
  },

  {
    id: "act1_s5",
    type: "monologue",
    act: 1,
    sceneNumber: 5,
    text: "_____",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s6",
  },

  {
    id: "act1_s6",
    type: "monologue",
    act: 1,
    sceneNumber: 6,
    text: "White ceiling.\n\nThat smell... sterile.",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s7",
  },

  // ── MC Inner Monologue — Sees a Girl ───────────────────────

  {
    id: "act1_s7",
    type: "monologue",
    act: 1,
    sceneNumber: 7,
    text: "Head feels heavy. Body feels like it got hit by a truck.",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s8",
  },

  {
    id: "act1_s8",
    type: "monologue",
    act: 1,
    sceneNumber: 8,
    text: "Obviously this is a hospital... ugh.",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s9",
  },

  {
    id: "act1_s9",
    type: "monologue",
    act: 1,
    sceneNumber: 9,
    text: "But wait—\n\nThere's someone over there.",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s10",
  },

  {
    id: "act1_s10",
    type: "monologue",
    act: 1,
    sceneNumber: 10,
    text: "A beautiful girl...\n\nShe looks restless. Worried. Why is she here?",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s11",
  },

  {
    id: "act1_s11",
    type: "monologue",
    act: 1,
    sceneNumber: 11,
    text: "A girl came to visit me?\n\nNo way~",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s12",
  },

  {
    id: "act1_s12",
    type: "monologue",
    act: 1,
    sceneNumber: 12,
    text: "But if that's true,\n\nI'd be healed instantly if there's a girl like that—",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s13",
  },

  // ── Girl Turns — Scene Change + Shake ────────────────

  {
    id: "act1_s13",
    type: "cg",
    act: 1,
    sceneNumber: 13,
    image: "/Image/scenes/Act_1/scene_1-2.jpeg",
    caption: "",
    effect: "screenShake",
    next: "act1_s14",
  },

  // ── MC Shocked ─────────────────────────────────────────────────────

  {
    id: "act1_s14",
    type: "monologue",
    act: 1,
    sceneNumber: 14,
    text: "Huh—",
    bg: { image: "/Image/scenes/Act_1/scene_1-2.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s15",
  },

  {
    id: "act1_s15",
    type: "monologue",
    act: 1,
    sceneNumber: 15,
    text: "Ehhhh?!\n\nSh-she's coming this way?!",
    bg: { image: "/Image/scenes/Act_1/scene_1-2.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s16",
  },

  // ── Rin Speaks — Still -?????- ────────────────────────────────────

  {
    id: "act1_s16",
    type: "dialogue",
    act: 1,
    sceneNumber: 16,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "You're awake?",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
        animation: "fade-in",
      },
    ],
    next: "act1_s17",
  },

  {
    id: "act1_s17",
    type: "dialogue",
    act: 1,
    sceneNumber: 17,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "I'm so relieved... I've been waiting here worried about you, you know.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s18",
  },

  // ── MC Inner Monologue — At the Hospital ─────────────────────────

  {
    id: "act1_s18",
    type: "monologue",
    act: 1,
    sceneNumber: 18,
    text: "So... that girl I've been staring at, she came to visit me?",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s19",
  },

  {
    id: "act1_s19",
    type: "monologue",
    act: 1,
    sceneNumber: 19,
    text: "And anyway...\n\nWhy am I in the hospital?",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/confident-Photoroom.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s20",
  },

  {
    id: "act1_s20",
    type: "monologue",
    act: 1,
    sceneNumber: 20,
    text: "The last thing I remember...\n\nHmm.\n\n...",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/confident-Photoroom.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s21",
  },

  {
    id: "act1_s21",
    type: "monologue",
    act: 1,
    sceneNumber: 21,
    text: "I can't.\n\nI don't remember anything.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/confident-Photoroom.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s22",
  },

  {
    id: "act1_s22",
    type: "monologue",
    act: 1,
    sceneNumber: 22,
    text: "What if...\n\nThis girl hit me with her car?\n\nThat's why I can't remember anything...\n\nHahaha, no way~",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/confident-Photoroom.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s23",
  },

  // ── Rin Pouts ───────────────────────────────────────────────────

  {
    id: "act1_s23",
    type: "dialogue",
    act: 1,
    sceneNumber: 23,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Hey.\n\nWhy are you spacing out? I asked you a question.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s24",
  },

  // ── First Choice ───────────────────────────────────────────────

  {
    id: "act1_s24",
    type: "choice",
    act: 1,
    sceneNumber: 24,
    question: "You answer...",
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" },
    options: [
      {
        id: "c1_opt1",
        text: "I was just amazed to see a beautiful girl who was restless and worried — for me.",
        next: "act1_s25a",
        affection: { character: "rin", amount: 15 },
      },
      {
        id: "c1_opt2",
        text: "It's nothing, I was just thinking.",
        next: "act1_s25b",
        affection: { character: "rin", amount: -5 },
      },
      {
        id: "c1_opt3",
        text: "...Did you hit me with your car?",
        next: "act1_s25c",
        affection: { character: "rin", amount: 0 },
      },
    ],
  },

  // ── Branch A — Compliment ────────────────────────────────────────────

  {
    id: "act1_s25a",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Hmph.\n\nTrying to cheer me up...",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut-nengok.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s25a_2",
  },

  {
    id: "act1_s25a_2",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "But— thanks for the compliment.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut-nengok.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s26",
  },

  // ── Branch B — Thinking ─────────────────────────────────────────

  {
    id: "act1_s25b",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "I was just thinking, why I ended up in the hospital..",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/kecewa.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s25b_2",
  },

  {
    id: "act1_s25b_2",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "hmmmm.\n\nThe doctor will tell you later~",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s26",
  },

  // ── Branch C — Blaming Rin ──────────────────────────────────────

  {
    id: "act1_s25c",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Huh?!\n\nMe?! Hit you?!\n\nYou can't be serious—",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut-nengok.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s25c_2",
  },

  {
    id: "act1_s25c_2",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "...I'm not the one who hit you, okay.\n\nI've been here waiting for you all this time.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut-nengok.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s26",
  },

  // ── Convergence — MC Apologizes + Introduction ─────────────────────

  {
    id: "act1_s26",
    type: "dialogue",
    act: 1,
    sceneNumber: 26,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "I'm awake, nothing hurts.\n\nPerfect condition! Especially with a beautiful girl by my side, hehehe.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/cemberut.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s27",
  },

  {
    id: "act1_s27",
    type: "dialogue",
    act: 1,
    sceneNumber: 27,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Thank goodness... I'm relieved.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/memohon.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s28",
  },

  {
    id: "act1_s28",
    type: "dialogue",
    act: 1,
    sceneNumber: 28,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "I'm really sorry...\n\nfor real..\n\nI don't remember anything, but I'm sure you're a good person and you care about me, that's why you waited for me here.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/memohon.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s29",
  },

  // ── Rin Shocked — Chain Expression ────────────────────────────────

  {
    id: "act1_s29",
    type: "dialogue",
    act: 1,
    sceneNumber: 29,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "____",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/kaget-santay.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s30",
  },

  {
    id: "act1_s30",
    type: "dialogue",
    act: 1,
    sceneNumber: 30,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "_______",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/mikir.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s31",
  },

  {
    id: "act1_s31",
    type: "dialogue",
    act: 1,
    sceneNumber: 31,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Hmmm...",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin_unknown",
        sprite: "/Image/Rinn/mikir.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s32",
  },

  // ── Rin Reveals Name — Name Appears ────────────────────────────────

  {
    id: "act1_s32",
    type: "dialogue",
    act: 1,
    sceneNumber: 32,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "I'm...\n\nRin. Rin Fuyutsuki-hime.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/sombong.png",
        position: "right",
        size: "large",
      },
    ],
    audio: { voice: "" },
    next: "act1_s33",
  },

  {
    id: "act1_s33",
    type: "dialogue",
    act: 1,
    sceneNumber: 33,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "I'm your girlfriend~",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/pointing.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s34",
  },

  // ── MC Shock ──────────────────────────────────────────────────────

  {
    id: "act1_s34",
    type: "dialogue",
    act: 1,
    sceneNumber: 34,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "WHAAAAAT?!",
    effect: "screenShake",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/pointing.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s35",
  },

  {
    id: "act1_s35",
    type: "dialogue",
    act: 1,
    sceneNumber: 35,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "Seriously?!",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/pointing.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s36",
  },

  // ── Second Choice — MC's Reaction ─────────────────────────────────────

  {
    id: "act1_s36",
    type: "choice",
    act: 1,
    sceneNumber: 36,
    question: "How do you respond to Rin's confession?",
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/pointing.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" },
    options: [
      {
        id: "c2_opt1",
        text: "Really?! Wow... I'm so lucky then!",
        next: "act1_s37a",
        affection: { character: "rin", amount: 15 },
      },
      {
        id: "c2_opt2",
        text: "You're not joking, are you..?",
        next: "act1_s37b",
        affection: { character: "rin", amount: 5 },
      },
      {
        id: "c2_opt3",
        text: "I... can't remember you at all. Sorry.",
        next: "act1_s37c",
        affection: { character: "rin", amount: -5 },
      },
    ],
  },

  // ── Branch A — Happy ──────────────────────────────────────────────

  {
    id: "act1_s37a",
    type: "dialogue",
    act: 1,
    sceneNumber: 37,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Yeah~ I'm serious. You can't remember, can you?\n\nHahaha, poor you~",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s38",
  },

  // ── Branch B — Doubtful ───────────────────────────────────────────────

  {
    id: "act1_s37b",
    type: "dialogue",
    act: 1,
    sceneNumber: 37,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Joking how? 100% serious.\n\nYou're the one who forgot~",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s38",
  },

  // ── Branch C — Sad ──────────────────────────────────────────────

  {
    id: "act1_s37c",
    type: "dialogue",
    act: 1,
    sceneNumber: 37,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "I know.\n\nThat's why I'm here.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s38",
  },

  // ── Convergence — MC Tries to Remember ────────────────────────────────

  {
    id: "act1_s38",
    type: "dialogue",
    act: 1,
    sceneNumber: 38,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "Rin Fuyutsuki-hime, huh.. A beautiful name.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s39",
  },

  {
    id: "act1_s39",
    type: "monologue",
    act: 1,
    sceneNumber: 39,
    text: "I try to remember.\n\nBut... blank. Nothing at all.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" },
    next: "act1_s40",
  },

  {
    id: "act1_s40",
    type: "dialogue",
    act: 1,
    sceneNumber: 40,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "You do feel familiar, though. Somehow.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s41",
  },

  {
    id: "act1_s41",
    type: "dialogue",
    act: 1,
    sceneNumber: 41,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Of course~ We're a couple, it's only natural you feel familiar with me.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s42",
  },

  {
    id: "act1_s42",
    type: "monologue",
    act: 1,
    sceneNumber: 42,
    text: "There's something inside me that just can't be forgotten...\n\nEven when my mind can't remember — my body already knows.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s43",
  },

  {
    id: "act1_s43",
    type: "dialogue",
    act: 1,
    sceneNumber: 43,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "I don't get it, but I feel that way too.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s44",
  },

  // ── Light Conversation ────────────────────────────────────────────────

  {
    id: "act1_s44",
    type: "dialogue",
    act: 1,
    sceneNumber: 44,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "I'm glad to hear you say that. Hope your memory recovers soon!.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s45",
  },

  {
    id: "act1_s45",
    type: "dialogue",
    act: 1,
    sceneNumber: 45,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "Hmm... hopefully soon!.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s46",
  },

  {
    id: "act1_s46",
    type: "dialogue",
    act: 1,
    sceneNumber: 46,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Good.\n\nOh yeah, I almost fell asleep waiting for you earlier.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/menguap.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s47",
  },

  {
    id: "act1_s47",
    type: "dialogue",
    act: 1,
    sceneNumber: 47,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "Hahaha, sorry about that. But thanks for waiting.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/menguap.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s48",
  },

  // ── Sound Effect Knocking + Doctor ───────────────────────────

  {
    id: "act1_s48",
    type: "transition",
    act: 1,
    sceneNumber: 48,
    text: "— Knock. Knock. Knock.",
    bg: { color: "#0a0a0a" },
    duration: 5000,
    audio: { sfx: "/audio/sfx/knocking-door.mp3" },
    next: "act1_s49",
  },

  {
    id: "act1_s49",
    type: "dialogue",
    act: 1,
    sceneNumber: 49,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "Excuse me, sorry to interrupt.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
            {
        id: "rin",
        sprite: "/Image/Rinn/menguap.png",
        position: "right",
        size: "large",
        animation: "enter-right"
      },
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         
      },
      
    ],
    next: "act1_s50",
  },

  {
    id: "act1_s50",
    type: "dialogue",
    act: 1,
    sceneNumber: 50,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "I'm the doctor in charge of your case. There are some things you need to know about your condition.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         
      },
    ],
    next: "act1_s51",
  },

  {
    id: "act1_s51",
    type: "dialogue",
    act: 1,
    sceneNumber: 51,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "Based on the examination results...\n\nYou're experiencing temporary amnesia.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         

      },
    ],
    next: "act1_s52",
  },

  {
    id: "act1_s52",
    type: "dialogue",
    act: 1,
    sceneNumber: 52,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "This condition isn't caused by physical injury. Rather, it's due to psychological trauma and excessive stress over a prolonged period.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         
      },
    ],
    next: "act1_s53",
  },

  {
    id: "act1_s53",
    type: "dialogue",
    act: 1,
    sceneNumber: 53,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "Your mind subconsciously 'severed' access to certain memories as a self-protection mechanism.\n\nThis is the body's natural reaction to something too heavy to process.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         
      },
    ],
    next: "act1_s54",
  },

  {
    id: "act1_s54",
    type: "monologue",
    act: 1,
    sceneNumber: 54,
    text: "...Something too heavy to process.\n\nWhat does that mean?",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.35)" },
    next: "act1_s55",
  },

  {
    id: "act1_s55",
    type: "dialogue",
    act: 1,
    sceneNumber: 55,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "For now, what you can do is rest, don't force yourself to remember, and take the medication I've prescribed regularly.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         
      },
    ],
    next: "act1_s56",
  },

  // ── Doctor Gives Medicine — Full CG ────────────────────────────────

  {
    id: "act1_s56",
    type: "cg",
    act: 1,
    sceneNumber: 56,
    image: "/Image/scenes/Act_1/scene-doctor.jpeg",
    caption: "",
    next: "act1_s57",
  },

  {
    id: "act1_s57",
    type: "dialogue",
    act: 1,
    sceneNumber: 57,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "...\n\nHere's your medicine. Take it once a day. Don't miss a dose.\n\nThis will help your memory recover gradually.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         
      },
    ],
    next: "act1_s58",
  },

  {
    id: "act1_s58",
    type: "dialogue",
    act: 1,
    sceneNumber: 58,
    speaker: "Doctor",
    speakerId: "doctor",
    text: "Alright. If you have any questions, you can contact the nurse outside. I'll take my leave now.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
        customSize: {         
      width: 520,
      height: 880,
    },
    offsetY: -60,         
    offsetX: -20,         
      },
    ],
    next: "act1_s59",
  },

  {
    id: "act1_s59",
    type: "monologue",
    act: 1,
    sceneNumber: 59,
    text: "The doctor walked out.\n\nHe just left...\n\nLike he didn't even notice Rin was there.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" },
    next: "act1_s60",
  },

  // ── After the Doctor Leaves ──────────────────────────────────────────

  {
    id: "act1_s60",
    type: "dialogue",
    act: 1,
    sceneNumber: 60,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Ooh, they gave you medicine~\n\nTake it, so you'll get better soon.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s61",
  },

  {
    id: "act1_s61",
    type: "dialogue",
    act: 1,
    sceneNumber: 61,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "Yeah yeah, I'll take it.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s62",
  },

  {
    id: "act1_s62",
    type: "dialogue",
    act: 1,
    sceneNumber: 62,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "Hey, Rin. Aren't you going home? I think it's already evening.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/defal-smile-Photoroom.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s63",
  },

  {
    id: "act1_s63",
    type: "dialogue",
    act: 1,
    sceneNumber: 63,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Yeah... I should go home.\n\nBut I'll come back tomorrow, okay.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s64",
  },

  // ── Third Choice — Parting ──────────────────────────────────────

  {
    id: "act1_s64",
    type: "choice",
    act: 1,
    sceneNumber: 64,
    question: "You answer...",
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" },
    options: [
      {
        id: "c3_opt1",
        text: "Okay, take care on the way home.",
        next: "act1_s65a",
        affection: { character: "rin", amount: 10 },
      },
      {
        id: "c3_opt2",
        text: "You don't need to bother coming back...",
        next: "act1_s65b",
        affection: { character: "rin", amount: -10 },
      },
      {
        id: "c3_opt3",
        text: "I'll be waiting.",
        next: "act1_s65c",
        affection: { character: "rin", amount: 20 },
      },
    ],
  },

  // ── Branch A — Nice ──────────────────────────────────────────

  {
    id: "act1_s65a",
    type: "dialogue",
    act: 1,
    sceneNumber: 65,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Okay~!\n\nRest well, okay. Don't do anything weird.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/hai.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s66",
  },

  // ── Branch B — Rejecting ────────────────────────────────────────────

  {
    id: "act1_s65b",
    type: "dialogue",
    act: 1,
    sceneNumber: 65,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "...What are you saying.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/cemberut.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s65b_2",
  },

  {
    id: "act1_s65b_2",
    type: "dialogue",
    act: 1,
    sceneNumber: 65,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "I'm still coming back tomorrow. That's not a question.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/hai.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s66",
  },

  // ── Branch C — Romantic ───────────────────────────────────────────

  {
    id: "act1_s65c",
    type: "dialogue",
    act: 1,
    sceneNumber: 65,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "...",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/eye-close-smile.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s65c_2",
  },

  {
    id: "act1_s65c_2",
    type: "dialogue",
    act: 1,
    sceneNumber: 65,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Okay.\n\nI'll definitely come.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/hai.png",
        position: "right",
        size: "large",
      },
    ],
    next: "act1_s66",
  },

  // ── Convergence — Rin Leaves ───────────────────────────────────────

  {
    id: "act1_s66",
    type: "monologue",
    act: 1,
    sceneNumber: 66,
    text: "She waved.\n\nHer smile was the last thing I saw before the hospital room door closed.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "rin",
        sprite: "/Image/Rinn/hai.png",
        position: "right",
        size: "large",
        dim: true,
      },
    ],
    next: "act1_s67",
  },

  {
    id: "act1_s67",
    type: "monologue",
    act: 1,
    sceneNumber: 67,
    text: "...\n\nI'm alone again.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.40)" },
    next: "act1_s68",
  },

  {
    id: "act1_s68",
    type: "monologue",
    act: 1,
    sceneNumber: 68,
    text: "The same white ceiling.\n\nThe same smell.\n\nBut it feels... different.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.40)" },
    next: "act1_s69",
  },

  {
    id: "act1_s69",
    type: "monologue",
    act: 1,
    sceneNumber: 69,
    text: "There's something I should remember.\n\nThere's something heavy stored in there — in a place I can't reach.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.50)" },
    next: "act1_s70",
  },

  {
    id: "act1_s70",
    type: "monologue",
    act: 1,
    sceneNumber: 70,
    text: "What happened to me?\n\nWhat am I trying to forget?",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.60)" },
    next: "act1_ending",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ── ENDING ACT 1
  // ═══════════════════════════════════════════════════════════════════

  {
    id: "act1_ending",
    type: "ending",
    act: 1,
    sceneNumber: 71,
    endingType: "good",
    title: "目覚め — Awakening",
    subtitle: "Someone is waiting for you. Even when you don't remember why.",
    bg: { color: "#06020f" },
    next: "act2_s1",
  },
];