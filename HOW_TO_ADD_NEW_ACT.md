# 📖 Cara Menambah Act Baru - Panduan Lengkap

Panduan step-by-step untuk menambahkan act baru ke dalam game visual novel.

---

## 📁 Struktur Folder

```
4thnovember/
├── lib/
│   └── acts/
│       ├── act_1/
│       │   ├── scenes.ts          ← Scene utama (Bahasa Indonesia)
│       │   └── scenes.en.ts       ← Scene terjemahan (Bahasa Inggris)
│       ├── act_2/
│       │   ├── scenes.ts
│       │   └── scenes.en.ts
│       └── act_3/                 ← ACT BARU ANDA DI SINI
│           ├── scenes.ts
│           └── scenes.en.ts
│
├── components/
│   └── Acts/
│       ├── Act1/
│       │   └── config.ts          ← Konfigurasi Act 1
│       ├── Act2/
│       │   └── config.ts          ← Konfigurasi Act 2
│       └── Act3/                  ← ACT BARU ANDA DI SINI
│           └── config.ts
│
└── public/
    └── Image/
        ├── scenes/
        │   ├── Act_1/
        │   ├── Act_2/
        │   └── Act_3/             ← Folder scene images baru
        └── ...
```

---

## 🚀 Step-by-Step Menambah Act Baru

### **STEP 1: Buat Folder Structure**

Buat folder-folder berikut:

```bash
# Folder untuk scene scripts
lib/acts/act_3/

# Folder untuk konfigurasi act
components/Acts/Act3/

# Folder untuk asset gambar (di public)
public/Image/scenes/Act_3/
```

---

### **STEP 2: Buat File Scenes Utama**

Buat file: `lib/acts/act_3/scenes.ts`

```typescript
import { Scene } from "@/types/game";
import { StoryBuilder } from "@/lib/StoryBuilder";

const b = new StoryBuilder(3); // Ganti 3 sesuai nomor act

// === MULAI TULIS SCENE DI SINI ===

// Contoh scene pembuka
b.bg({"color":"#000000"});
b.transition(1000, "");

b.bg(null);
b.cg("/Image/scenes/Act_3/scene_1.jpeg", "");

b.bg({"image":"/Image/scenes/Act_3/scene_1.jpeg","overlay":"rgba(0,0,0,0.10)"});
b.M("Narrasi atau dialog di sini...");

// Tambahkan lebih banyak scene sesuai kebutuhan
// Gunakan method: b.bg(), b.cg(), b.M(), b.D(), b.chars(), b.choice(), dll.

// Scene penutup act
b.end("Judul Act", "good", {
  id: "act3_ending",
  subtitle: "Subtitle di sini",
  next: "act4_s1" // Next act, atau biarkan kosong jika ini act terakhir
});

// === JANGAN LUPA EXPORT INI ===
export const ACT_3_SCENES: Scene[] = b.build();
```

**📝 Catatan Penting:**
- Ganti `new StoryBuilder(3)` dengan nomor act yang sesuai
- Scene ID harus format: `act3_s1`, `act3_s2`, dst.
- Scene terakhir harus punya `next` ke act berikutnya atau kosong

---

### **STEP 3: Buat File Scenes Inggris (Opsional)**

Buat file: `lib/acts/act_3/scenes.en.ts`

```typescript
import { Scene } from "@/types/game";
import { StoryBuilder } from "@/lib/StoryBuilder";

const b = new StoryBuilder(3);

// === TULIS SCENE DALAM BAHASA INGGRIS ===
// Struktur sama dengan scenes.ts, tapi teks dalam bahasa Inggris

b.bg({"color":"#000000"});
b.transition(1000, "");

b.bg(null);
b.cg("/Image/scenes/Act_3/scene_1.jpeg", "");

b.bg({"image":"/Image/scenes/Act_3/scene_1.jpeg","overlay":"rgba(0,0,0,0.10)"});
b.M("Narration or dialogue in English...");

// ... lanjutkan sampai selesai

b.end("Act Title", "good", {
  id: "act3_ending",
  subtitle: "Subtitle in English",
  next: "act4_s1"
});

// === EXPORT ===
export const ACT_3_SCENES_EN: Scene[] = b.build();
```

---

### **STEP 4: Buat File Konfigurasi Act**

Buat file: `components/Acts/Act3/config.ts`

```typescript
/**
 * Act 3 Configuration — Judul Act Anda
 */

import { ActConfig } from "@/components/Acts/BaseActConfig";

export const ACT_3_CONFIG: ActConfig = {
  actNumber: 3,
  title: "Judul Act — Subtitle",

  // ── Lifecycle Hooks ──────────────────────────────────────────────

  onActStart: async (engine) => {
    console.log("🎬 Act 3 Starting...");

    // Inisialisasi data act
    engine.setActData("custom_flag", false);
    engine.setActData("affection", 0);
  },

  onActEnd: async (engine, result) => {
    console.log(`✅ Act 3 Complete: ${result}`);

    const choices = engine.getChoices();
    const affection = engine.getAffection("rin");
    console.log("Player choices:", choices);
    console.log("Affection at end of Act 3:", affection);
  },

  onSceneLoad: async (sceneId, engine) => {
    console.log(`📖 Scene: ${sceneId}`);

    // Trigger khusus per scene
    if (sceneId === "act3_s1") {
      const element = document.querySelector(".game-scene");
      engine.triggerEffect("fadeIn", element instanceof HTMLElement ? element : undefined);
    }
  },

  // ── Character Interactions ───────────────────────────────────────

  characterInteractions: {
    rin: async (engine) => {
      engine.updateAffection("rin", 1);
    },
    // Tambahkan karakter lain sesuai kebutuhan
  },

  // ── Minigames ────────────────────────────────────────────────────

  minigames: {
    // Tambahkan minigame jika ada
    // minigame1: async () => { ... }
  },

  // ── Custom Effects ───────────────────────────────────────────────

  effectHandlers: {
    fadeIn: async (target) => {
      if (target) {
        target.style.animation = "fadeIn 1.2s ease-out forwards";
      }
    },

    fadeOut: async (target) => {
      if (target) {
        target.style.animation = "fadeOut 1s ease-in forwards";
      }
    },

    screenShake: async (target) => {
      if (target) {
        target.style.animation = "screenShake 0.5s ease-in-out";
      }
    },
  },

  // ── Assets ───────────────────────────────────────────────────────

  preloadAssets: {
    images: [
      // Backgrounds
      "/Image/GameBG/Bg-1.jpg",

      // Scene Images (CG)
      "/Image/scenes/Act_3/scene_1.jpeg",
      "/Image/scenes/Act_3/scene_2.jpeg",

      // Character Sprites
      "/Image/Rinn/sprite1.png",
      "/Image/Rinn/sprite2.png",

      // NPCs
      "/Image/NPC/new_character.png",
    ],
    audio: [
      // Background Music
      "/audio/bgm/act_3.mp3",

      // Sound Effects
      "/audio/sfx/new_sfx.mp3",

      // Voice Acting
      "/audio/voice/act_3/act3_s1.mp3",
    ],
  },
};

export default ACT_3_CONFIG;
```

---

### **STEP 5: Daftarkan Scene ke Registry**

Edit file: `components/Acts/actRegistry.ts`

**Tambahkan import di bagian atas:**

```typescript
import { ACT_3_SCENES }    from "@/lib/acts/act_3/scenes";
import { ACT_3_SCENES_EN } from "@/lib/acts/act_3/scenes.en";
```

**Tambahkan ke REGISTRIES:**

```typescript
const REGISTRIES: Record<number, Record<string, SceneRegistry>> = {
  1: {
    id: buildRegistry(ACT_1_SCENES),
    en: buildRegistry(ACT_1_SCENES_EN),
  },
  2: {
    id: buildRegistry(ACT_2_SCENES),
    en: buildRegistry(ACT_2_SCENES_EN),
  },
  // TAMBAHKAN BARIS INI:
  3: {
    id: buildRegistry(ACT_3_SCENES),
    en: buildRegistry(ACT_3_SCENES_EN),
  },
};
```

---

### **STEP 6: Daftarkan ke acts.ts**

Edit file: `components/Acts/acts.ts`

**Tambahkan import:**

```typescript
import { ACT_3_SCENES } from "@/lib/acts/act_3/scenes";
```

**Tambahkan ke ALL_SCENES:**

```typescript
const ALL_SCENES = [
  ...ACT_1_SCENES,
  ...ACT_2_SCENES,
  ...ACT_3_SCENES, // ← TAMBAHKAN INI
];
```

---

### **STEP 7: Daftarkan Konfigurasi Act (Jika Diperlukan)**

Jika game Anda memiliki registry untuk act configs, daftarkan config baru.

Cari file yang mengimpor `ACT_1_CONFIG` dan `ACT_2_CONFIG`, lalu tambahkan:

```typescript
import { ACT_3_CONFIG } from "@/components/Acts/Act3/config";
```

---

## ✅ Checklist Setelah Menambah Act

Setelah selesai semua step di atas, pastikan:

- [ ] File `lib/acts/act_3/scenes.ts` sudah dibuat
- [ ] File `lib/acts/act_3/scenes.en.ts` sudah dibuat (opsional)
- [ ] File `components/Acts/Act3/config.ts` sudah dibuat
- [ ] Import sudah ditambahkan ke `actRegistry.ts`
- [ ] Import sudah ditambahkan ke `acts.ts`
- [ ] Asset images sudah ada di `public/Image/scenes/Act_3/`
- [ ] Asset audio sudah ada di folder yang sesuai
- [ ] Scene ID format benar: `act3_s1`, `act3_s2`, dst.
- [ ] Scene terakhir punya `next` ke act berikutnya

---

## 🧪 Testing

1. **Jalankan development server:**
   ```bash
   npm run dev
   ```

2. **Cek console untuk errors:**
   - Buka browser DevTools (F12)
   - Lihat tab Console
   - Pastikan tidak ada error import/registry

3. **Test scene baru:**
   - Mainkan game sampai act baru
   - Cek apakah semua scene muncul dengan benar
   - Test semua choice branches
   - Test transisi ke act berikutnya

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Pastikan path import benar
- Cek typo di nama file
- Restart dev server jika perlu

### Scene tidak muncul
- Cek apakah scene sudah di-export dengan benar
- Pastikan `b.build()` dipanggil di akhir file
- Cek console untuk error

### Registry tidak terupdate
- Pastikan sudah tambahkan ke `REGISTRIES` di `actRegistry.ts`
- Hard refresh browser (Ctrl+Shift+R)

### Asset tidak load
- Cek path asset di `preloadAssets`
- Pastikan file ada di folder `public/`
- Cek typo di nama file

---

## 📝 Template Cepat

Copy-paste template ini untuk memulai act baru dengan cepat:

### `lib/acts/act_X/scenes.ts`
```typescript
import { Scene } from "@/types/game";
import { StoryBuilder } from "@/lib/StoryBuilder";

const b = new StoryBuilder(X);

b.bg({"color":"#000000"});
b.transition(1000, "");

// Scene 1
b.bg(null);
b.cg("/Image/scenes/Act_X/scene_1.jpeg", "");
b.M("Opening narration...");

// Scene terakhir
b.end("Title", "good", {
  id: "actX_ending",
  subtitle: "Subtitle",
  next: "actY_s1"
});

export const ACT_X_SCENES: Scene[] = b.build();
```

---

## 📚 Referensi

- **StoryBuilder Methods**: Lihat `lib/StoryBuilder.ts` untuk semua method yang tersedia
- **Scene Type**: Lihat `types/game.ts` untuk struktur Scene
- **Base Config**: Lihat `components/Acts/BaseActConfig.ts` untuk interface konfigurasi

---

**Dibuat untuk:** Visual Novel Game - 4th November  
**Last Updated:** March 17, 2026
