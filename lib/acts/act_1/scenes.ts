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

export const ACT_1_SCENES: Scene[] = [

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

  // ── MC Membuka Mata ──────────────────────────────────────────────

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
    text: "Langit-langit putih.\n\nBau yang... steril.",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s7",
  },

  // ── MC Inner Monologue — Melihat Perempuan ───────────────────────

  {
    id: "act1_s7",
    type: "monologue",
    act: 1,
    sceneNumber: 7,
    text: "Kepala berat. Badan rasanya kayak abis ketabrak truk.",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s8",
  },

  {
    id: "act1_s8",
    type: "monologue",
    act: 1,
    sceneNumber: 8,
    text: "sudah jelas ini dirumah sakit..huft",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s9",
  },

  {
    id: "act1_s9",
    type: "monologue",
    act: 1,
    sceneNumber: 9,
    text: "Tapi tunggu—\n\nAda seseorang di sana.",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.15)" },
    next: "act1_s10",
  },

  {
    id: "act1_s10",
    type: "monologue",
    act: 1,
    sceneNumber: 10,
    text: "Perempuan cantik...\n\nDia gelisah. Khawatir. Kenapa dia disni?",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s11",
  },

  {
    id: "act1_s11",
    type: "monologue",
    act: 1,
    sceneNumber: 11,
    text: "aku di jengguk perempuan?\n\nga mungkin~",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s12",
  },

  {
    id: "act1_s12",
    type: "monologue",
    act: 1,
    sceneNumber: 12,
    text: "Tapi kalo iya,\n\Dijamin langsung bugar deh kalau ada perempuan kayak gitu yang—",
    bg: { image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s13",
  },

  // ── Perempuan Menoleh — Ganti Scene Image + Shake ────────────────

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

  // ── MC Kaget ─────────────────────────────────────────────────────

  {
    id: "act1_s14",
    type: "monologue",
    act: 1,
    sceneNumber: 14,
    text: "Eh—",
    bg: { image: "/Image/scenes/Act_1/scene_1-2.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s15",
  },

  {
    id: "act1_s15",
    type: "monologue",
    act: 1,
    sceneNumber: 15,
    text: "Ehhhh?!\n\nD-dia ke arah sini?!",
    bg: { image: "/Image/scenes/Act_1/scene_1-2.jpeg", overlay: "rgba(0,0,0,0.10)" },
    next: "act1_s16",
  },

  // ── Rin Bicara — Masih -?????- ────────────────────────────────────

  {
    id: "act1_s16",
    type: "dialogue",
    act: 1,
    sceneNumber: 16,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Kamu udah siuman?",
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
    text: "Leganya... aku nungguin kamu dengan khawatir dari tadi loh.",
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

  // ── MC Inner Monologue — Di Rumah Sakit ─────────────────────────

  {
    id: "act1_s18",
    type: "monologue",
    act: 1,
    sceneNumber: 18,
    text: "Ternyata... dia yang dari tadi aku perhatiin, itu menjengguk aku?",
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
    text: "Lagi pula...\n\nKenapa aku ada di rumah sakit?",
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
    text: "Yang terakhir aku ingat...\n\nHmm.\n\n...",
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
    text: "Tidak bisa.\n\nAku tidak ingat apa-apa.",
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
    text: "Apa jangan-jangan...\n\nPerempuan ini menabrak aku?\n\Itu lah sebabnya aku tidak ingat apa apa..\n\nHahaha, tidak mungkin deh~",
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

  // ── Rin Ngambek ───────────────────────────────────────────────────

  {
    id: "act1_s23",
    type: "dialogue",
    act: 1,
    sceneNumber: 23,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Hei.\n\nKamu kok malah bengong sih? Aku tanya loh.",
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

  // ── Pilihan Pertama ───────────────────────────────────────────────

  {
    id: "act1_s24",
    type: "choice",
    act: 1,
    sceneNumber: 24,
    question: "Kamu menjawab...",
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
        text: "Aku cuma kagum aja ngeliat perempuan cantik yang dari tadi gelisah khawatir ternyata buat aku.",
        next: "act1_s25a",
        affection: { character: "rin", amount: 15 },
      },
      {
        id: "c1_opt2",
        text: "Enggak kenapa-kenapa, aku cuma lagi mikir aja.",
        next: "act1_s25b",
        affection: { character: "rin", amount: -5 },
      },
      {
        id: "c1_opt3",
        text: "...Kamu nabrak aku ya?",
        next: "act1_s25c",
        affection: { character: "rin", amount: 0 },
      },
    ],
  },

  // ── Branch A — Pujian ────────────────────────────────────────────

  {
    id: "act1_s25a",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Hmph.\n\nMencoba menghibur...",
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
    text: "Tapi— makasih atas pujiannya.",
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

  // ── Branch B — mikir ─────────────────────────────────────────

  {
    id: "act1_s25b",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Aku cuman lagi mikir aja, kenapa bisa di rumah sakit..",
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
    text: "hmmmm.\n\nDokter entar ngasih tau~",
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

  // ── Branch C — Nyalahin Rin ──────────────────────────────────────

  {
    id: "act1_s25c",
    type: "dialogue",
    act: 1,
    sceneNumber: 25,
    speaker: "-?????-",
    speakerId: "rin_unknown",
    text: "Hah?!\n\nAku?! Nabrak kamu?!\n\nYang bener aja—",
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
    text: "...Aku bukan penabrak kamu, oke.\n\nAku yang nungguin kamu dari tadi.",
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

  // ── Konvergensi — MC Minta Maaf + Perkenalan ─────────────────────

  {
    id: "act1_s26",
    type: "dialogue",
    act: 1,
    sceneNumber: 26,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "aku udah siuman kok, nggak ada sakit apa-apa.\n\nKondisi terbaik! Apalagi ada perempuan cantik di sebelah aku, xixixi.",
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
    text: "Syukurlah... aku lega.",
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
    text: "Ini mah maaf banget ya...\n\nserius dua rius..\n\nAku nggak inget apa-apa, tapi aku yakin kamu pasti orang yang baik dan perhatian banget buat aku, makanya kamu nungguin aku disini.",
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

  // ── Rin Kaget — Ekspresi Berantai ────────────────────────────────

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

  // ── Rin Reveal Nama — Nama Muncul ────────────────────────────────

  {
    id: "act1_s32",
    type: "dialogue",
    act: 1,
    sceneNumber: 32,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Aku...\n\nRin. Rin Fuyutsuki-hime.",
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
    text: "Pacar kamu loh~",
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
    text: "HAHHHHH?!",
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
    text: "Serius?!",
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

  // ── Pilihan Kedua — Reaksi MC ─────────────────────────────────────

  {
    id: "act1_s36",
    type: "choice",
    act: 1,
    sceneNumber: 36,
    question: "Bagaimana kamu merespon pengakuan Rin?",
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
        text: "Beneran?! Wah... aku beruntung banget dong!",
        next: "act1_s37a",
        affection: { character: "rin", amount: 15 },
      },
      {
        id: "c2_opt2",
        text: "Kamu tidak sedang bercanda kan..?",
        next: "act1_s37b",
        affection: { character: "rin", amount: 5 },
      },
      {
        id: "c2_opt3",
        text: "Aku... tidak bisa ingat kamu sama sekali. Maaf.",
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
    text: "Iyaa~ aku serius. Kamu pasti ga bisa inget ya?\n\nHahaha, kasian~",
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

  // ── Branch B — Ragu ───────────────────────────────────────────────

  {
    id: "act1_s37b",
    type: "dialogue",
    act: 1,
    sceneNumber: 37,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Bercanda gimana. Serius 100%.\n\nKamu aja yang lupa~",
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

  // ── Branch C — Sedih ──────────────────────────────────────────────

  {
    id: "act1_s37c",
    type: "dialogue",
    act: 1,
    sceneNumber: 37,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Aku tau kok.\n\nMakanya aku di sini.",
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

  // ── Konvergensi — MC Mencoba Ingat ────────────────────────────────

  {
    id: "act1_s38",
    type: "dialogue",
    act: 1,
    sceneNumber: 38,
    speaker: "{playerName}",
    speakerId: "mc",
    text: "Rin Fuyutsuki-hime ya.. Nama yang indah",
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
    text: "Aku mencoba mengingat.\n\nTapi... blank. Sama sekali tidak ada.",
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
    text: "Kamu memang terasa familiar sih. Entah kenapa.",
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
    text: "Iya lah~ Kita kan pasangan, wajar aja kamu ngerasa familiar sama aku.",
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
    text: "Seperti ada sesuatu di dalam diri ini yang tidak bisa dilupakan...\n\nBahkan ketika pikiran tidak bisa ingat — tubuh ini seperti sudah tahu.",
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
    text: "Aku nggak ngerti sih, tapi aku juga ngerasa gitu.",
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

  // ── Obrolan Ringan ────────────────────────────────────────────────

  {
    id: "act1_s44",
    type: "dialogue",
    act: 1,
    sceneNumber: 44,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Senang dengar kamu bilang begitu. Semoga ingantan kamu cepat pulih ya!.",
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
    text: "Hmm... kalo bisa secepatnya!.",
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
    text: "Bagus.\n\nOh iya, Tadi aku hampir ketiduran nungguin kamu tadi.",
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
    text: "Hahaha, maaf ya. Tapi makasih udah nungguin.",
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

  // ── Sound Effect Ketukan Pintu + Dokter ───────────────────────────

  {
    id: "act1_s48",
    type: "transition",
    act: 1,
    sceneNumber: 48,
    text: "— Tok. Tok. Tok.",
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
    speaker: "Dokter",
    speakerId: "doctor",
    text: "Permisi, Maaf mengganggu.",
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
    speaker: "Dokter",
    speakerId: "doctor",
    text: "Saya dokter yang menangani kamu. Ada beberapa hal yang perlu kamu ketahui mengenai kondisimu.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
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
    speaker: "Dokter",
    speakerId: "doctor",
    text: "Berdasarkan hasil pemeriksaan...\n\nKamu mengalami amnesia sementara.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
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
    speaker: "Dokter",
    speakerId: "doctor",
    text: "Kondisi ini bukan akibat cedera fisik. Melainkan akibat trauma psikologis dan tekanan stres yang berlebihan dalam jangka waktu yang cukup panjang.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
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
    speaker: "Dokter",
    speakerId: "doctor",
    text: "Pikiran kamu secara tidak sadar 'memutus' akses ke memori tertentu sebagai mekanisme perlindungan diri.\n\nIni adalah reaksi alami tubuh terhadap sesuatu yang terlalu berat untuk diproses.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
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
    text: "...Sesuatu yang terlalu berat untuk diproses.\n\nApa artinya itu?",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.35)" },
    next: "act1_s55",
  },

  {
    id: "act1_s55",
    type: "dialogue",
    act: 1,
    sceneNumber: 55,
    speaker: "Dokter",
    speakerId: "doctor",
    text: "Yang bisa kamu lakukan sekarang adalah beristirahat, jangan memaksakan diri untuk mengingat, dan minum obat yang saya resepkan secara teratur.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
    offsetY: -60,         
    offsetX: -20,         
      },
    ],
    next: "act1_s56",
  },

  // ── Dokter Berikan Obat — Full CG ────────────────────────────────

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
    speaker: "Dokter",
    speakerId: "doctor",
    text: "...\n\nIni obatnya. Diminum 1x sehari ya. Jangan sampai terlewat.\n\nIni untuk membantu proses pemulihan ingatan kamu secara bertahap.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
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
    speaker: "Dokter",
    speakerId: "doctor",
    text: "Baik. Kalau ada yang ingin ditanyakan, bisa hubungi perawat di luar ya. Saya permisi dulu.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" },
    characters: [
      {
        id: "doctor",
        sprite: "/Image/NPC/doctor/doctor.png",
        position: "left",
        size: "large",
        animation: "enter-bottom",
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
    text: "Dokter itu berjalan keluar.\n\nDia berlalu begitu saja...\n\nSeperti tidak menganggap Rin ada di sana.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" },
    next: "act1_s60",
  },

  // ── Setelah Dokter Pergi ──────────────────────────────────────────

  {
    id: "act1_s60",
    type: "dialogue",
    act: 1,
    sceneNumber: 60,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Weh, kamu dikasih obat~\n\nMinum ya, biar cepet sembuh.",
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
    text: "Iya iya, aku minum.",
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
    text: "Eh, Rin. Kamu nggak pulang? Udah sore loh kayaknya.",
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
    text: "Iya nih... aku harus pulang.\n\nTapi aku bakal balik besok ya.",
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

  // ── Pilihan Ketiga — Pamitan ──────────────────────────────────────

  {
    id: "act1_s64",
    type: "choice",
    act: 1,
    sceneNumber: 64,
    question: "Kamu menjawab...",
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
        text: "Oke, hati-hati ya di jalan.",
        next: "act1_s65a",
        affection: { character: "rin", amount: 10 },
      },
      {
        id: "c3_opt2",
        text: "Nggak usah repot-repot balik...",
        next: "act1_s65b",
        affection: { character: "rin", amount: -10 },
      },
      {
        id: "c3_opt3",
        text: "Aku tunggu.",
        next: "act1_s65c",
        affection: { character: "rin", amount: 20 },
      },
    ],
  },

  // ── Branch A — Baik-baik ──────────────────────────────────────────

  {
    id: "act1_s65a",
    type: "dialogue",
    act: 1,
    sceneNumber: 65,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "Iya~!\n\nIstirahat yang bener ya. Jangan macem-macem.",
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

  // ── Branch B — Menolak ────────────────────────────────────────────

  {
    id: "act1_s65b",
    type: "dialogue",
    act: 1,
    sceneNumber: 65,
    speaker: "Rin Fuyutsuki-hime",
    speakerId: "rin",
    text: "...Kamu ngomong apa sih.",
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
    text: "Aku tetap balik besok. Itu bukan pertanyaan.",
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

  // ── Branch C — Romantis ───────────────────────────────────────────

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
    text: "Iya.\n\nAku pasti datang.",
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

  // ── Konvergensi — Rin Pergi ───────────────────────────────────────

  {
    id: "act1_s66",
    type: "monologue",
    act: 1,
    sceneNumber: 66,
    text: "Dia melambai.\n\nSenyumnya terakhir yang aku lihat sebelum pintu kamar rumah sakit itu menutup.",
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
    text: "...\n\nAku sendirian lagi.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.40)" },
    next: "act1_s68",
  },

  {
    id: "act1_s68",
    type: "monologue",
    act: 1,
    sceneNumber: 68,
    text: "Langit-langit putih yang sama.\n\nBau yang sama.\n\nTapi rasanya... berbeda.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.40)" },
    next: "act1_s69",
  },

  {
    id: "act1_s69",
    type: "monologue",
    act: 1,
    sceneNumber: 69,
    text: "Ada sesuatu yang harusnya aku ingat.\n\nAda sesuatu yang berat banget yang disimpan di dalam sana — di tempat yang tidak bisa aku jangkau.",
    bg: { image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.50)" },
    next: "act1_s70",
  },

  {
    id: "act1_s70",
    type: "monologue",
    act: 1,
    sceneNumber: 70,
    text: "Apa yang terjadi padaku?\n\nApa yang coba kulupakan?",
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
    endingType: "act",
    title: "目覚め — Awakening",
    subtitle: "Seseorang menunggumu. Bahkan ketika kamu tidak ingat kenapa.",
    bg: { color: "#06020f" },
    next: "act2_s1",
  },
];