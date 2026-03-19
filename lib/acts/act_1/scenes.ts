import { Scene } from "@/types/game";
import { StoryBuilder } from "@/lib/StoryBuilder";

const b = new StoryBuilder(1);

// ══════════════════════════════════════════════════════════════════════════════
// ACT 1 — 目覚め  "Awakening"
// ══════════════════════════════════════════════════════════════════════════════

// ── [ PEMBUKAAN: HITAM TOTAL ] ────────────────────────────────────────────────

b.bg({ color: "#000000" });
b.transition(2200, "");

// ── [ FIRST FLASH: GAMBAR RUANG ] ────────────────────────────────────────────

b.bg(null);
b.cg("/Image/scenes/Act_1/scene_1.jpeg", "");
b.bg({ image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.30)" });

b.M("...");
b.M("......");
b.M(".........");

b.bg({ image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.20)" });
b.M("Putih.");
b.M("Kasur dingin.");
b.M("Bau alkohol... steril... mati.");

b.M("Langit-langit yang asing.");
b.M("Aku menatapnya sampai aku sadar —");
b.M("— ini bukan langit-langit rumah.");

b.M("Kepala berat.");
b.M("Sakit.");
b.M("Lebih seperti ada bagian yang belum sepenuhnya kembali ke tempatnya.");

b.M("Aku mencoba mengingat.");
b.M("Nama sendiri? — Ada.\nTanggal lahir? — Ada.\nYang terakhir terjadi?");
b.M("Tapi sisanya...");
b.M("...terbakar habis.");

b.bg({ image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.25)" });
b.M("Tapi tunggu —");
b.M("Ada seseorang.");
b.M("Bukan perawat.");
b.M("Perempuan. Di kursi, di sebelah kasur pasien.");

b.M("Dia tak sadar aku sudah bangun.");
b.M("Tangannya menggenggam sesuatu, matanya ke arah kosong —");
b.M("— seperti orang yang sudah menunggu terlalu lama.");

b.bg({ image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.30)" });
b.M("Aku tidak kenal dia.");
b.M("Atau —");
b.M("— aku tidak ingat kenal dia.");
b.M("Itu dua hal yang berbeda.");
b.M("Tapi sekarang terasa sama.");

// Transisi: Rin menoleh
b.bg(null);
b.cg("/Image/scenes/Act_1/scene_1-2.jpeg", "", { effect: "screenShake" });
b.bg({ image: "/Image/scenes/Act_1/scene_1-2.jpeg", overlay: "rgba(0,0,0,0.10)" });

b.M("Ehh —");
b.M("Dia menoleh.");
b.M("Dan langsung ke arah sini.");
b.M("Mata merah yang indah, rambut putih panjang dengan pita.");
b.M("Cantik.");
b.M("Mata kami ketemu.");
b.M("Kelihatan senang.");

// ── [ PERTEMUAN PERTAMA ] ─────────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "rin_unknown",
  sprite: "/Image/Rinn/defal-smile-Photoroom.png",
  position: "right",
  size: "large",
  animation: "fade-in"
}]);

b.D("-?????-", "rin_unknown", "...Kamu sudah sadar?");
b.D("{playerName}", "mc", "...Ya. Baru saja.");

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Syukurlah...");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large", dim: true }]);
b.M("Bukan cara orang yang baru kenal bilang lega.");
b.M("Itu cara orang yang sudah takut sekali —");
b.M("— dan baru sekarang boleh berhenti takut.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Maaf... aku tak ingat apa-apa.\nKamu... siapa?");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("Dia tidak langsung menjawab.");
b.M("Matanya ke aku — lama.");
b.M("Seperti menimbang sesuatu.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "...Jadi begitu.\nKamu tak ingat sama sekali.");
b.D("{playerName}", "mc", "Tidak semua. Kamu iya.");

// Rin memperkenalkan diri
b.audio({ voice: "" });
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/sombong.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Aku—\nRin. Rin Fuyutsuki-hime.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/sombong.png", position: "right", size: "large", dim: true }]);
b.M("Dia bilang nama itu pelan.");
b.M("Terlihat tersipu.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/pointing.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Pacar kamu.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" });
b.chars(null);
b.M("...");
b.M("Kosong.");
b.M("Aku tidak pernah mengingat punya pacar.");
b.M("Aneh.");
b.M("Tidak mengerti.");
b.M("Tapi aku percaya.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/pointing.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Ha?", { effect: "screenShake" });

// ── [ PILIHAN 1 ] ────────────────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.choice("Bagaimana kamu merespons?", [
  {
    id: "c1_opt1",
    text: "Beneran?! Wah — aku beruntung.",
    next: "act1_c1a",
    affection: { character: "rin", amount: 15 }
  },
  {
    id: "c1_opt2",
    text: "Kamu... tidak sedang bercanda kan?",
    next: "act1_c1b",
    affection: { character: "rin", amount: 5 }
  },
  {
    id: "c1_opt3",
    text: "Sekali lagi. Maaf aku tidak ingat kamu sama sekali.",
    next: "act1_c1c",
    affection: { character: "rin", amount: -5 }
  }
]);

// ── Branch A ─────────────────────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iyaa, serius. Kamu nggak inget ya — kasian~", { id: "act1_c1a" });
b.D("{playerName}", "mc", "Kalau begitu aku serius juga jadi pacar kamu.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Gombal deh.", { next: "act1_c1_merge" });

// ── Branch B ─────────────────────────────────────────────────────────────────
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Bercanda gimana. Kamu aja yang lupa.", { id: "act1_c1b" });
b.D("{playerName}", "mc", "Aku cuman syok sedikit.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "hehehe, aku engga becanda ya..", { next: "act1_c1_merge" });

// ── Branch C ─────────────────────────────────────────────────────────────────
b.chars([{ id: "rin", sprite: "/Image/Rinn/kecewa.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya gapapa. Makanya aku di sini.", { id: "act1_c1c" });
b.D("{playerName}", "mc", "...\n\nMakasih, kamu baik banget.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya sama sama, emang harusnya begini kok.", { next: "act1_c1_merge" });

// ── Lanjutan setelah branch ──────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" });
b.chars(null);
b.M("Rin Fuyutsuki-hime...", { id: "act1_c1_merge" });
b.M("Aku coba ingat —");
b.M("Bukan namanya.");
b.M("Tapi sesuatu di baliknya.");
b.M("Wajah. Suara. Momen.");
b.M("...");
b.M("Tidak ada yang kembali.");
b.M("Tapi anehnya —");
b.M("— tak ada yang terasa salah.");
b.M("Seperti nama itu sudah pernah ada di sini...");
b.M("Lagu yang pernah kudengar, tapi liriknya hilang.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Nama yang indah.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Bagus kan?! Artinya putri musim dingin.");
b.D("{playerName}", "mc", "Iya bagus.\n\nKamu putri, aku pangeran.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Pangeran apa yang lupa sama putrinya sendiri.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large", dim: true }]);
b.M("(senyum, tapi ada yang retak di baliknya)");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Justru itu yang bikin menarik.\n\nKenalan lagi dari awal.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large", dim: true }]);
b.M("Dia diam sebentar.");
b.M("Lalu ketawa kecil —");
b.M("— di balik ketawa itu ada sesuatu yang menyakitkan.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...Kamu tau ga, itu agak menyakitkan sebenernya.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large", dim: true }]);
b.M("Dia bilang itu sambil senyum.");
b.M("Persis — sambil senyum.");
b.M("Seperti sudah terlalu terbiasa membungkus sesuatu yang berat");
b.M("dengan kalimat yang terdengar ringan.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Maaf.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Eh, bukan salah kamu juga.\nJangan minta maaf untuk hal yang kamu ga pilih.");
b.D("{playerName}", "mc", "Harusnya aku sedih. Tapi anehnya —\ntidak ada yang terasa hilang.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...Mungkin karena memang tidak ada yang perlu kamu rasa kehilangan.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("Dia bilang itu pelan.");
b.M("Seperti bukan untuk aku —");
b.M("— seperti untuk dirinya sendiri juga.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Maksudnya?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Tidak tahu itu... kadang bagus.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("Dia menoleh ke jendela.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Kamu bangun hari ini.\nKamu lihat langit-langit asing.\nTidak bawa beban dari kemarin —");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("...");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Rin — aku rasa hadirnya kamu di sini,\nsudah cukup beralasan bahwa hari kemarin itu penting.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large", dim: true }]);
b.M("(senyum tipis lega)");

// ── [ DOKTER MASUK ] ──────────────────────────────────────────────────────────

b.audio({ sfx: "/audio/sfx/knocking-door.mp3" });
b.transition(4000, "— Tok.  Tok.  Tok.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([
  { id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" },
  {
    id: "doctor",
    sprite: "/Image/NPC/doctor/doctor.png",
    position: "left",
    size: "large",
    animation: "fade-in",
    offsetY: -60,
    offsetX: -20
  }
]);

// Hint: Dokter masuk tanpa menoleh ke arah Rin sama sekali.
b.D("Dokter", "doctor", "Permisi.");
b.D("Dokter", "doctor", "Saya dokter yang menangani kamu.\nAda beberapa hal yang perlu kamu tahu.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.D("Dokter", "doctor", "Berdasarkan hasil pemeriksaan — kamu mengalami amnesia.\nBukan jenis yang ringan.");
b.D("Dokter", "doctor", "Bukan akibat cedera fisik.\nIni akibat trauma psikologis — tekanan yang terakumulasi hingga titik yang tidak bisa lagi ditoleransi otak.");
b.D("Dokter", "doctor", "Pikiran kamu secara tidak sadar 'menutup' akses ke memori tertentu.\nBukan karena rusak — tapi karena memori itu terlalu berat untuk diproses.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.35)" });
b.chars(null);
b.M("Terlalu berat untuk diproses.");
b.M("Aku mengulangi kalimat itu dalam kepala.");
b.M("Apa yang seberat itu?");
b.M("Apa yang cukup berat sampai otak memilih untuk tidak mengingat sama sekali?");

// ── [ PILIHAN DOKTER — TANYA JAWAB ] ─────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  offsetY: -60,
  offsetX: -20
}]);

b.choice("Kamu ingin bertanya...", [
  {
    id: "dq_opt1",
    text: "Ingatan saya — bisa kembali?",
    next: "act1_dq1",
    affection: { character: "rin", amount: 0 }
  },
  {
    id: "dq_opt2",
    text: "Trauma psikologis... maksudnya apa yang terjadi pada saya?",
    next: "act1_dq2",
    affection: { character: "rin", amount: 0 }
  },
  {
    id: "dq_opt3",
    text: "Tidak ada pertanyaan.",
    next: "act1_dq3",
    affection: { character: "rin", amount: 0 }
  }
]);

// ── Branch DQ1 ────────────────────────────────────────────────────────────────
b.D("Dokter", "doctor", "Bisa.", { id: "act1_dq1" });
b.D("Dokter", "doctor", "Tapi prosesnya bertahap. Dan tidak bisa dipaksa.\nOtak perlu waktunya sendiri untuk membuka apa yang dia tutup.", { next: "act1_dq_merge" });

// ── Branch DQ2 ────────────────────────────────────────────────────────────────
b.D("Dokter", "doctor", "Itu yang belum bisa saya jawab secara spesifik.", { id: "act1_dq2" });
b.D("Dokter", "doctor", "Yang saya tahu — sesuatu yang cukup berat terjadi.\nSeberapa berat, justru memori kamu sendiri yang akan memberitahu, perlahan.", { next: "act1_dq_merge" });

// ── Branch DQ3 ────────────────────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  offsetY: -60,
  offsetX: -20,
  dim: true
}]);
b.M("Dokter itu mengangguk sekali.", { id: "act1_dq3" });
b.M("Seperti sudah menduga jawabannya.", { next: "act1_dq_merge" });

// ── Lanjutan setelah tanya jawab ─────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  offsetY: -60,
  offsetX: -20
}]);
b.D("Dokter", "doctor", "Yang bisa kamu lakukan sekarang: istirahat, tidak memaksakan diri mengingat, dan konsumsi obat yang saya resepkan secara teratur.", { id: "act1_dq_merge" });

b.bg(null);
b.cg("/Image/scenes/Act_1/scene-doctor.jpeg", "");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  offsetY: -60,
  offsetX: -20
}]);
b.D("Dokter", "doctor", "Ini obatnya.\n\nSatu tablet per hari — jangan sampai terlewat, dan jangan dihentikan sendiri tanpa konsultasi.");
b.D("Dokter", "doctor", "Kalau perlu apa-apa, hubungi perawat di luar. Saya permisi.");

// Hint: Dokter pergi tanpa sekali pun menatap ke arah Rin.
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" });
b.chars(null);
b.M("Dokter itu berjalan keluar.");
b.M("Pintu tertutup.");
b.M("...");
b.M("Dia tidak sekali pun melihat ke arah Rin.");

// ── [ SETELAH DOKTER PERGI ] ─────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "{playerName} gapapa kok, jangan sedih!\nKamu bisa sembuh kan? Walau perlahan.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Aku mendengarnya.");
b.M("Tapi ada sesuatu yang tidak langsung menjawab 'iya'.");
b.M("...");
b.M("Apa kesembuhan memang yang aku inginkan?");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.35)" });
b.chars(null);
b.M("Jika semuanya begini karena aku tau sesuatu.");
b.M("...");
b.M("Demi dia?");
b.M("Ya.");
b.M("Itu saja cukup.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Iya makasih. Aku pengen cepet sembuh.\n\nBiar inget semua tentang kita berdua.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Yay, senang dengarnya.");

// Rin nguap — trigger MC nanya
b.chars([{ id: "rin", sprite: "/Image/Rinn/menguap.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "*hoamm*");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Kamu ngantuk?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya nih... sepertinya cukup sampai di sini untuk hari ini.");
b.D("{playerName}", "mc", "Oh, sudah mau balik ya?");
b.D("Rin Fuyutsuki-hime", "rin", "Iya. Besok aku ke sini lagi ya.\nTenang aja.");
b.D("{playerName}", "mc", "Oke.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Jangan lupa minum obatnya ya, jangan coba-coba di-skip.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Iya, iya.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "bye-bye.");
b.D("Rin Fuyutsuki-hime", "rin", "ich liebe dich...");
b.D("{playerName}", "mc", "see ya.");

// Hint: "ich liebe dich" — terasa seperti echo dari sesuatu yang jauh
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.35)" });
b.chars(null);
b.M("ich liebe dich?");
b.M("...");
b.M("Seperti echo dari mimpi yang tak kuingat.");
b.M("Tapi kenapa terasa...");
b.M("...palsu?");
b.M("...");

// ── [ PERPISAHAN PERTAMA ] ────────────────────────────────────────────────────


b.bg(null);
b.cg("/Image/scenes/Act_1/dadah.jpg", "");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.M("Dia melambai.");
b.M("Senyum kecil.");
b.M("Lucunya.");


b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.chars(null);
b.M("Pintu menutup.");
b.M("Hening...");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.55)" });
b.M("Botol obat ada di nakas.");
b.M("Dokter bilang satu tablet sehari.");
b.M("Aku pegang botolnya.");


b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.65)" });
b.examine("/Image/scenes/Obat-pill.png", "");

// ── [ PILIHAN OBAT ] ─────────────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.60)" });
b.choice("Apa yang kamu lakukan?", [
  {
    id: "medicine_take",
    text: "Minum obat sekarang. Dokter bilang harus teratur.",
    next: "act1_medicine_taken",
    affection: { character: "rin", amount: 0 }
  },
  {
    id: "medicine_save",
    text: "Simpan dulu. Mungkin nanti.",
    next: "act1_medicine_saved",
    affection: { character: "rin", amount: 0 }
  }
]);

// Branch: Minum sekarang
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.65)" });
b.M("Satu tablet putih jatuh ke telapak tangan.", { id: "act1_medicine_taken" });
b.M("Bau dan rasa khas obat.");
b.M("Aku menelannya dengan seteguk air.", { next: "act1_monolog" });

// Branch: Simpan dulu
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.65)" });
b.M("Aku meletakkan botol itu kembali.", { id: "act1_medicine_saved" });
b.M("Nanti saja.", { next: "act1_monolog" });

// ── [ MONOLOG AKHIR ] ─────────────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.70)" });
b.M("Langit-langit yang sama.", { id: "act1_monolog" });
b.M("Bau yang sama.");
b.M("Tapi sekarang ada yang berbeda —");
b.M("Ada nama.");
b.M("Ada wajah.");
b.M("Ada suara.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.75)" });
b.M("Rin Fuyutsuki-hime.");
b.M("...");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.80)" });
b.M("Tapi — ada sesuatu yang harusnya aku ingat.");
b.M("Bukan tentang di mana aku kemarin.");
b.M("Sesuatu yang lebih dalam.");
b.M("Yang tersimpan di tempat yang sepertinya...");
b.M("...sengaja dikunci.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.85)" });
b.M("Menghela napas kecil.");
b.M("Seperti aku lelah.");

// Fade ke hitam
b.bg({ color: "#06020f" });
b.transition(2000, "");

// ── [ ENDING ACT 1 ] ─────────────────────────────────────────────────────────
b.bg({ color: "#06020f" });
b.end("目覚め — Awakening", "act", {
  id: "act1_ending",
  subtitle: "Seseorang menunggumu.\nBahkan ketika kamu tidak tahu kenapa — dan dia tidak pernah memberitahumu.",
  next: "act2_s1"
});

export const ACT_1_SCENES: Scene[] = b.build();