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
b.M("Dingin.\n\nSeperti tidur di atas batu.");

b.M("Ada bau yang tidak asing tapi tidak menyenangkan.\n\nSteril. Tajam. Seperti sesuatu yang sengaja membunuh semua aroma lain.");

b.bg({ image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.15)" });
b.M("Langit-langit putih.\n\nDatar. Tak ada noda. Tak ada retakan.\n\nTerlalu sempurna untuk ditatap.");

b.M("Kepala berat.\n\nBukan sakit — lebih seperti ada sesuatu yang baru saja dicabut dari dalam sana dan meninggalkan ruang kosong di tempatnya.");

b.M("Aku mencoba mengingat.\n\nNama sendiri? — Ada.\nTanggal lahir? — Ada.\nYang terakhir terjadi?\n\n...\n\n...");

b.bg({ image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.25)" });
b.M("Tidak ada.\n\nBukan kosong seperti lupa. Kosong seperti halaman yang memang tidak pernah ditulis.");

b.bg({ image: "/Image/scenes/Act_1/scene_1.jpeg", overlay: "rgba(0,0,0,0.10)" });
b.M("Tapi tunggu—\n\nAda seorang.\n\nDilihat bukan seperti perawat.");

b.M("Perempuan...\n\nDi kursi. Di sudut kasur pasien.\n\nAku tidak kenal.");

b.M("Dia tidak tahu aku sudah bangun.\n\nDia sedang gelisah — tangannya menggenggam sesuatu, matanya terus ke arah kosong memikirkan sesuatu.\n\nSeperti orang yang sudah menunggu terlalu lama tapi tidak mau pergi.");

b.M("Aku tidak mungkin di jengguk perempuan kan?\n\nApalagi tidak kenal.");

b.M("Tapi kalo iya...\n\nSiapa dia...");

b.bg(null);
b.cg("/Image/scenes/Act_1/scene_1-2.jpeg", "", { effect: "screenShake" });

b.bg({ image: "/Image/scenes/Act_1/scene_1-2.jpeg", overlay: "rgba(0,0,0,0.10)" });
b.M("Eh—");
b.M("Tunggu.\n\nDia menatap balik.");
b.M("...\n\nDia berdiri.\n\nDia ke arah sini.");

// ── [ PERTEMUAN PERTAMA ] ─────────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "rin_unknown",
  sprite: "/Image/Rinn/defal-smile-Photoroom.png",
  position: "right",
  size: "large",
  animation: "fade-in"
}]);

// Hint: Rin muncul terlalu cepat, terlalu tepat di posisi yang nyaman.
b.D("-?????-", "rin_unknown", "Kamu udah siuman?");

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Leganya...\n\nAku nungguin kamu dari tadi. Khawatir banget.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large", dim: true }]);
b.M("Perempuan yang dari tadi gelisah itu...\n\nternyata menjengguk aku.");

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/confident-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Cantik.\n\nBukan cantik yang mencolok — cantik yang semacam... sudah dari dulu ada di sana tanpa aku sadari.\n\nFamiliar. Anehnya familiar.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.M("Kenapa aku ada di sini?\n\nKenapa dia ada di sini?\n\nDan kenapa rasanya seperti — dua pertanyaan itu harusnya punya jawaban yang sama?");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/cemberut.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Hei.\n\nAku tanya loh.\n\nKenapa malah bengong?");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.choice("Kamu menjawab...", [
  {
    id: "c1_opt1",
    text: "Maaf — aku nggak bengong. Aku lagi kagum aja. Ada perempuan cantik yang nungguin aku, itu hal yang cukup buat bikin orang speechless.",
    next: "act1_s25a",
    affection: { character: "rin", amount: 15 }
  },
  {
    id: "c1_opt2",
    text: "Maaf. Aku lagi nyoba inget sesuatu.",
    next: "act1_s25b",
    affection: { character: "rin", amount: -5 }
  },
  {
    id: "c1_opt3",
    text: "...Kamu yang bawa aku ke sini ya?",
    next: "act1_s25c",
    affection: { character: "rin", amount: 0 }
  }
]);

// ── Branch A ─────────────────────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Hmph.\n\nGombal.", { id: "act1_s25a", next: "act1_s25a_2" });

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "...Tapi makasih.", { id: "act1_s25a_2", next: "act1_s26" });

// ── Branch B ─────────────────────────────────────────────────────────────────
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/kecewa.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Inget sesuatu...", { id: "act1_s25b", next: "act1_s25b_2" });

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "...Berhasil?", { id: "act1_s25b_2", next: "act1_s26" });

// ── Branch C ─────────────────────────────────────────────────────────────────
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/kaget-santay.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Hah?!\n\nBawa kamu—?", { id: "act1_s25c", next: "act1_s25c_2" });

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/cemberut.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Bukan.\n\nAku yang nungguin kamu di sini. Beda.", { id: "act1_s25c_2", next: "act1_s26" });

// ── Lanjutan setelah semua branch ────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Kondisi terbaik, kok. Nggak ada yang sakit.\n\nApalagi ada seorang yang menjengguk aku di sini — jadi lebih baik lagi.", { id: "act1_s26", next: "act1_s27" });

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/memohon.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "Syukurlah...", { id: "act1_s27", next: "act1_s28" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/memohon.png", position: "right", size: "large", dim: true }]);
b.M("Ada sesuatu di cara dia bilang 'syukurlah' itu.\n\nBukan cara orang yang baru kenal bilang lega.\n\nItu cara orang yang sudah takut sekali — dan baru sekarang boleh berhenti takut.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Maaf ya — aku nggak inget apa-apa.\n\nTapi aku yakin kamu orang yang baik. Kalau nggak, kamu nggak bakal ada di sini.", { id: "act1_s28", next: "act1_s29" });

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/kaget-santay.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "...", { id: "act1_s29", next: "act1_s30" });

b.chars([{ id: "rin_unknown", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("-?????-", "rin_unknown", "......", { id: "act1_s30", next: "act1_s31" });

b.D("-?????-", "rin_unknown", "Hmmm...akuu-", { id: "act1_s31", next: "act1_s32" });

b.audio({ voice: "" });
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/sombong.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Rin.\n\nRin Fuyutsuki-hime.", { id: "act1_s32", next: "act1_s33" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/pointing.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Pacar kamu.", { id: "act1_s33", next: "act1_s34" });

b.D("{playerName}", "mc", "HAHHHHH?!", { id: "act1_s34", effect: "screenShake", next: "act1_s35" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/pointing.png", position: "right", size: "large", dim: true }]);
b.M("Pacar.\n\nAku punya pacar.\n\nDan pacarnya, ternyata adalah perempuan yang baru saja membuat aku speechless dalam dua menit pertama bangun tidur.");

b.D("{playerName}", "mc", "Serius?!", { id: "act1_s35", next: "act1_s36" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.choice("Bagaimana kamu merespons?", [
  {
    id: "c2_opt1",
    text: "Beneran?! Wah — kalau itu benar, aku beruntung banget.",
    next: "act1_s37a",
    affection: { character: "rin", amount: 15 }
  },
  {
    id: "c2_opt2",
    text: "Kamu... tidak sedang bercanda kan?",
    next: "act1_s37b",
    affection: { character: "rin", amount: 5 }
  },
  {
    id: "c2_opt3",
    text: "Aku tidak ingat kamu sama sekali. Maaf.",
    next: "act1_s37c",
    affection: { character: "rin", amount: -5 }
  }
], { id: "act1_s36" });

// ── Branch A ─────────────────────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iyaa, serius.\n\nKamu pasti nggak inget ya — kasian~", { id: "act1_s37a", next: "act1_s38" });

// ── Branch B ─────────────────────────────────────────────────────────────────
b.D("Rin Fuyutsuki-hime", "rin", "Bercanda gimana.\n\nKamu aja yang lupa.", { id: "act1_s37b", next: "act1_s38" });

// ── Branch C ─────────────────────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/kecewa.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Aku tau.\n\nMakanya aku di sini.", { id: "act1_s37c", next: "act1_s38" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large", dim: true }]);
b.D("{playerName}", "mc", "Rin Fuyutsuki-hime...\n\nNama yang indah.", { id: "act1_s38", next: "act1_s39" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" });
b.chars(null);
b.M("Aku mencoba mengingat.\n\nBukan nama — nama sudah ada sekarang. Tapi wajahnya. Suaranya. Detailnya.\n\n...\n\nBlank.", { id: "act1_s39", next: "act1_s40" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Kamu terasa familiar.\n\nAku nggak bisa jelasin kenapa — tapi terasa familiar.", { id: "act1_s40", next: "act1_s41" });

b.D("Rin Fuyutsuki-hime", "rin", "Iya lah.\n\nKita udah lama bareng.", { id: "act1_s41", next: "act1_s42" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Seperti ada sesuatu di dalam diri ini yang tidak ikut terhapus.\n\nBukan memori — lebih dalam dari itu.\n\nSeperti otot yang masih ingat gerakannya bahkan setelah lupa namanya.", { id: "act1_s42", next: "act1_s43" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Aku nggak ngerti kenapa — tapi ada bagian dari aku yang ngerasa... kamu ada di sini memang sudah seharusnya.", { id: "act1_s43", next: "act1_s44" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Semoga ingatan kamu cepat pulih ya.", { id: "act1_s44", next: "act1_s45" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large", dim: true }]);
b.M("Kalimat yang sederhana.\n\nTapi ada sesuatu di intonasi itu — sesuatu yang tidak sempat kutangkap sebelum dia melanjutkan.", { id: "act1_s44b", next: "act1_s45" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Kalau bisa — secepatnya.", { id: "act1_s45", next: "act1_s46" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/menguap.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Hmm.\n\nOh iya — tadi aku hampir ketiduran nungguin kamu.", { id: "act1_s46", next: "act1_s47" });

b.D("{playerName}", "mc", "Hahaha. Maaf ya.\n\nDan makasih — serius.", { id: "act1_s47", next: "act1_s48" });

// ── [ DOKTER MASUK ] ──────────────────────────────────────────────────────────

b.bg({ color: "#0a0a0a" });
b.audio({ sfx: "/audio/sfx/knocking-door.mp3" });
b.transition(4000, "— Tok.  Tok.  Tok.", { id: "act1_s48", next: "act1_s49" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([
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

// Hint: Dokter tidak menoleh ke Rin, bahkan saat melewatinya.
b.D("Dokter", "doctor", "Permisi. Maaf mengganggu.", { id: "act1_s49", next: "act1_s50" });
b.D("Dokter", "doctor", "Saya dokter yang menangani kamu.\n\nAda beberapa hal yang perlu kamu tahu tentang kondisimu.", { id: "act1_s50", next: "act1_s51" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.D("Dokter", "doctor", "Berdasarkan hasil pemeriksaan...\n\nKamu mengalami amnesia. Bukan jenis yang ringan.", { id: "act1_s51", next: "act1_s52" });

b.D("Dokter", "doctor", "Bukan akibat cedera fisik.\n\nIni akibat trauma psikologis — tekanan yang terakumulasi dalam jangka waktu cukup panjang hingga titik tertentu yang tidak bisa lagi ditoleransi otak.", { id: "act1_s52", next: "act1_s53" });

b.D("Dokter", "doctor", "Secara sederhana — pikiran kamu secara tidak sadar 'menutup' akses ke memori tertentu.\n\nBukan karena rusak. Tapi karena memori itu terlalu berat untuk diproses.", { id: "act1_s53", next: "act1_s54" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.35)" });
b.chars(null);
b.M("Terlalu berat untuk diproses.\n\nAku mengulangi kalimat itu dalam kepala.\n\nApa yang seberat itu?\n\nApa yang cukup berat sampai otak memilih untuk tidak mengingat sama sekali?", { id: "act1_s54", next: "act1_s55" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  offsetY: -60,
  offsetX: -20
}]);
b.D("Dokter", "doctor", "Yang bisa kamu lakukan sekarang: istirahat, tidak memaksakan diri untuk mengingat, dan konsumsi obat yang saya resepkan secara teratur.", { id: "act1_s55", next: "act1_s56" });

b.bg(null);
b.cg("/Image/scenes/Act_1/scene-doctor.jpeg", "", { id: "act1_s56", next: "act1_s57" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.D("Dokter", "doctor", "Ini obatnya.\n\nSatu tablet per hari — jangan sampai terlewat, dan jangan dihentikan sendiri tanpa konsultasi.\n\nIni akan membantu proses pemulihan ingatan berjalan secara bertahap.", { id: "act1_s57", next: "act1_s58" });

b.D("Dokter", "doctor", "Kalau ada yang ingin ditanyakan, hubungi perawat di luar. Saya permisi.", { id: "act1_s58", next: "act1_s59" });

// Hint: Dokter pergi tanpa menoleh ke arah Rin. Tatapannya seolah menembus tempat dia berdiri.
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars(null);
b.M("Dokter itu berjalan keluar.\n\nDia sama sekali tidak melihat ke arah Rin.\n\nTidak sekali pun.\n\n...\n\nMungkin dokter memang begitu. Sibuk. Fokus.", { id: "act1_s59", next: "act1_s60" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Kamu dikasih obat.\n\nMinum ya — jangan coba-coba di-skip.", { id: "act1_s60", next: "act1_s61" });

b.D("{playerName}", "mc", "Iya, iya.", { id: "act1_s61", next: "act1_s62" });

b.D("{playerName}", "mc", "Eh Rin — kamu nggak pulang? Kayaknya udah sore.", { id: "act1_s62", next: "act1_s63" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya...\n\nAku harus pulang.\n\nTapi aku bakal balik besok.", { id: "act1_s63", next: "act1_s64" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.choice("Kamu menjawab...", [
  {
    id: "c3_opt1",
    text: "Oke. Hati-hati ya.",
    next: "act1_s65a",
    affection: { character: "rin", amount: 10 }
  },
  {
    id: "c3_opt2",
    text: "Nggak usah repot-repot balik...",
    next: "act1_s65b",
    affection: { character: "rin", amount: -10 }
  },
  {
    id: "c3_opt3",
    text: "Aku tunggu.",
    next: "act1_s65c",
    affection: { character: "rin", amount: 20 }
  }
], { id: "act1_s64" });

// ── Branch A ─────────────────────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya~\n\nIstirahat yang bener. Jangan macem-macem.", { id: "act1_s65a", next: "act1_s66" });

// ── Branch B ─────────────────────────────────────────────────────────────────
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...Kamu ngomong apa.", { id: "act1_s65b", next: "act1_s65b_2" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Aku tetap balik besok.\n\nItu bukan pertanyaan.", { id: "act1_s65b_2", next: "act1_s66" });

// ── Branch C ─────────────────────────────────────────────────────────────────
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...", { id: "act1_s65c", next: "act1_s65c_2" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya.\n\nAku pasti datang.", { id: "act1_s65c_2", next: "act1_s66" });

// ── [ PERPISAHAN PERTAMA ] ────────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large", dim: true }]);
b.M("Dia melambai.\n\nSenyum kecil — bukan senyum yang lebar, tapi jenis senyum yang seperti sudah berlatih lama untuk terlihat baik-baik saja.", { id: "act1_s66", next: "act1_s67" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.40)" });
b.chars(null);
b.M("Pintu menutup.\n\nDan aku sendirian lagi.", { id: "act1_s67", next: "act1_s67_2" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.M("Hening.\n\nTapi bukan hening yang kosong — seperti ada sesuatu yang tertinggal di udara.\n\nAroma? Suara? Atau hanya perasaan?", { id: "act1_s67_2", next: "act1_s67_3" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.50)" });
b.M("Botol obat itu ada di nakas.\n\nDokter bilang satu tablet sehari.\n\nTapi...", { id: "act1_s67_3", next: "act1_s67_4" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.55)" });
b.M("Aku pegang botolnya.\n\nRingan. Terlalu ringan untuk ukuran obat yang katanya penting.\n\nAtau mungkin ini baru saja diisi? Entah.", { id: "act1_s67_4", next: "act1_s67_5" });

b.bg({ color: "#0a0a0a" });
b.transition(1500, "", { id: "act1_s67_5", next: "act1_s67_6" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.65)" });
b.examine("/Image/scenes/Obat-pill.png", "", { id: "act1_s67_6", next: "act1_medicine_choice" });

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
    text: "Simpan dulu. Mungkin nanti sebelum tidur.",
    next: "act1_medicine_saved",
    affection: { character: "rin", amount: 0 }
  }
], { id: "act1_medicine_choice", next: "act1_medicine_taken" });

// Branch: Minum sekarang
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.65)" });
b.M("Aku membuka tutup botol.\n\nSatu tablet putih jatuh ke telapak tangan.\n\nTidak ada bau. Tidak ada rasa.\n\nAku menelannya dengan seteguk air.", { id: "act1_medicine_taken", next: "act1_s68" });

// Branch: Simpan dulu
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.65)" });
b.M("Aku meletakkan botol itu kembali.\n\nNanti saja. Malam masih panjang.\n\nTapi ada sesuatu yang mengganggu—\n\nseperti suara bisikan di sudut kamar.\n\n...\n\nApa itu tadi?", { id: "act1_medicine_saved", next: "act1_s68" });

// ── [ MONOLOG AKHIR (dimodifikasi sedikit) ] ───────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.70)" });
b.M("Langit-langit yang sama.\n\nBau yang sama.\n\nTapi sekarang — ada hal yang berbeda.\n\nAda nama sekarang. Ada wajah. Ada suara.", { id: "act1_s68", next: "act1_s69" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.75)" });
b.M("Rin Fuyutsuki-hime.\n\nKenapa nama itu terasa berat di lidah, tapi sekaligus seperti sudah ada di sana sebelum aku lahir?", { id: "act1_s69", next: "act1_s70" });

// Tambahan foreshadowing: bisikan
b.audio({ sfx: "/audio/sfx/whisper.mp3" });
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.80)" });
b.M("...", { id: "act1_s70_whisper", next: "act1_s70" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.85)" });
b.M("Tunggu.\n\nAku dengar sesuatu.\n\n...\n\nSeperti suara perempuan memanggil namaku?\n\nAtau hanya angin?", { id: "act1_s70", next: "act1_s71" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.90)" });
b.M("Tidak ada siapa pun.\n\nPasti karena lelah.", { id: "act1_s71", next: "act1_s72" });

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.95)" });
b.M("Tapi...\n\nAda sesuatu yang harusnya aku ingat.\n\nBukan tentang di mana aku kemarin — lebih dari itu.\n\nSesuatu yang tersimpan di tempat yang lebih dalam dari memori biasa.\n\nDi tempat yang sepertinya... sengaja dikunci.", { id: "act1_s72", next: "act1_ending" });

// ── [ ENDING ACT 1 ] ─────────────────────────────────────────────────────────

b.bg({ color: "#06020f" });
b.end("目覚め — Awakening", "act", {
  id: "act1_ending",
  subtitle: "Seseorang menunggumu.\nBahkan ketika kamu tidak tahu kenapa — dan dia tidak pernah memberitahumu.",
  next: "act2_s1"
});

export const ACT_1_SCENES: Scene[] = b.build();