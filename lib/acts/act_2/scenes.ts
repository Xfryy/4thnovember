import { Scene } from "@/types/game";
import { StoryBuilder } from "@/lib/StoryBuilder";

const b = new StoryBuilder(2);

// ══════════════════════════════════════════════════════════════════════════════
// ACT 2 — 帰還  "Homecoming"
// ══════════════════════════════════════════════════════════════════════════════

// ── [ PEMBUKAAN: HITAM ] ──────────────────────────────────────────────────────

b.bg({ color: "#000000" });
b.transition(2500, "", { id: "act2_s1" });

// ── [ MIMPI: PEREMPUAN YANG TIDAK BERWAJAH ] ──────────────────────────────────

b.bg(null);
b.cg("/Image/scenes/Act_2/scene_1.png", "");

b.bg({ image: "/Image/scenes/Act_2/scene_1.png", overlay: "rgba(0,0,0,0.45)" });
b.M("...\n\nAda cahaya.\n\nBukan cahaya yang hangat — cahaya yang terlalu putih. Terlalu datar.\n\nSeperti lampu ruang tunggu yang tidak pernah dimatikan.");

b.M("Dan di tengah cahaya itu —\n\nada perempuan.\n\nDia berdiri memunggungiku.");

b.M("Wajahnya tidak kelihatan.\n\nBukan karena gelap — tapi seperti ada sesuatu yang sengaja mengaburkan bagian itu.\nSeperti foto yang salah fokus tepat di satu titik.");

b.M("Coba sapa.");

b.D("{playerName}", "mc", "Hey.\n\nKamu siapa?");

b.D("-?????-", "unknown", "___");

b.M("Hening.\n\nBukan hening yang kosong — ini hening yang berisi.\nAda sesuatu di dalamnya yang tidak bisa dibaca tapi bisa dirasakan.\n\nBerat. Seperti kalimat yang sudah di ujung lidah tapi tidak pernah jadi diucapkan.");

b.D("{playerName}", "mc", "Hey.\n\nAku tanya loh.");

b.D("-?????-", "unknown", "___");
b.D("-?????-", "unknown", "___");

b.bg(null);
b.cg("/Image/scenes/Act_2/scene_2.png", "", { effect: "screenShake" });

b.bg({ image: "/Image/scenes/Act_2/scene_2.png", overlay: "rgba(0,0,0,0.30)" });
b.M("— Dia berdiri.\n\nTiba-tiba. Tanpa gerakan peralihan. Tanpa suara.\n\nSeperti kaset yang di-skip paksa ke frame berikutnya.");

b.M("Dan sekarang dia menghadap ke sini.\n\nWajahnya masih kabur.\n\nTapi aku tahu — aku tahu dia sedang menatap langsung ke mataku.\n\nDan ada sesuatu di tatapan itu yang terasa seperti:\n\nsudah lama menunggu.");

b.D("-?????-", "unknown", "Σϴλψ ωϑδΦΨ Θξζλψ ΩϴΣΨδ ξΘΩΦλ ψδΘξΩ...");

b.D("{playerName}", "mc", "Hah—?\n\nNgomong apa? Aku nggak ngerti.");

b.D("-?????-", "unknown", "Φδξψ ΩΘΣλ ψΦξΘδ ΩΣψλδ Θξ ΩΦΣψ δλξΘΩ...");

b.bg({ image: "/Image/scenes/Act_2/scene_2.png", overlay: "rgba(0,0,0,0.20)" });
b.M("Bahasa apa ini.\n\nAtau bukan bahasa sama sekali.\n\nBunyi yang terdengar seperti kata-kata — tapi setiap kali aku coba tangkap maknanya, dia tergelincir.");

b.bg(null);
b.cg("/Image/scenes/Act_2/scene_3.png", "", { effect: "flash" });

b.bg({ image: "/Image/scenes/Act_2/scene_3.png", overlay: "rgba(0,0,0,0.15)" });
b.M("Dia menunjuk.\n\nLurus. Tepat.\n\nLangsung ke arahku.\n\nTidak ragu. Tidak gemetar.\n\nSeperti seseorang yang sudah berlatih gerakan ini sangat lama.");

b.D("-?????-", "unknown", "Ξψδθφ ΩΣΛ ψΘξΔΩΦδ ΣΛΘξΩψ ΦδΩΞΣΛ... ΨΘδξφ ΩΣΛψ ΔξΘΩφ ΣΛψδΞΘ... ΩΦδΣΛΨξ ΘΩδφΣΛΨξΘ ΩδΦΣΛΨξΘ δΩφΣΛΨ...");

b.D("-?????-", "unknown", "kamu—");

b.bg({ image: "/Image/scenes/Act_2/scene_3.png", overlay: "rgba(0,0,0,0.60)" });
b.M("Aku terbangun.");

// ── [ KAMAR RUMAH SAKIT — PAGI ] ──────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  animation: "fade-in",
  offsetY: -60,
  offsetX: -20
}]);

b.M("Napas terengah.\n\nDada naik turun tidak beraturan.\n\nLangit-langit putih itu lagi.\n\nAku kembali.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.M("Tangan masih sedikit gemetar.\n\nAku tidak ingat kapan terakhir kali mimpi terasa seberat ini.\n\nAtau mungkin — aku memang tidak ingat apa-apa.");

b.D("Dokter", "doctor", "Mimpi buruk?");

b.D("{playerName}", "mc", "Aneh lebih tepatnya.\n\nNggak menakutkan — tapi nggak enak juga.");

b.D("Dokter", "doctor", "Bisa diceritakan?");

b.D("{playerName}", "mc", "Ada perempuan. Wajahnya nggak kelihatan.\n\nDia ngomong sesuatu tapi aku nggak ngerti. Dan di akhir —\n\nsatu kata yang masuk. Yang lain nggak.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.D("Dokter", "doctor", "Menarik.\n\nKamu tahu kenapa mimpi bisa terasa lebih nyata dari biasanya?");

b.D("{playerName}", "mc", "Nggak.");

b.D("Dokter", "doctor", "Karena otak tidak membedakan antara yang nyata dan yang dikonstruksi — selama memorinya cukup kuat.\n\nDalam kondisi amnesia seperti kamu, mimpi sering jadi satu-satunya akses yang tersisa ke memori yang tertutup.\n\nOtak pakai 'jalan belakang'.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.20)" });
b.D("{playerName}", "mc", "Jadi perempuan di mimpi itu—");

b.D("Dokter", "doctor", "Bisa jadi seseorang yang pernah ada.\n\nBisa jadi konstruksi.\n\nSaya tidak bisa memastikan dari luar.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.30)" });
b.chars(null);
b.M("Seseorang yang pernah ada.\n\nDiucapkan begitu ringan.\n\nTapi ada sesuatu di cara dokter itu berhenti sejenak sebelum bilang 'saya tidak bisa memastikan' —\n\nseperti orang yang bisa memastikan, tapi memilih tidak.");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  offsetY: -60,
  offsetX: -20
}]);
b.D("Dokter", "doctor", "Anyway — saya ke sini ada kabar baik.\n\nKondisi fisik kamu sudah stabil sepenuhnya.\n\nKamu boleh pulang hari ini.");

b.D("{playerName}", "mc", "Serius?");

b.D("Dokter", "doctor", "Serius.\n\nTapi singgah dulu ke resepsionis di lobi bawah — ada dokumen kepulangan yang perlu ditandatangani.");

b.D("{playerName}", "mc", "Oke.");

b.D("Dokter", "doctor", "Dan jangan lupa obatnya.\n\nJangan sampai terlewat — bahkan satu hari pun.");

b.D("{playerName}", "mc", "Iya, Dok.");

b.chars(null);
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.35)" });
b.M("Dokter itu pergi.\n\nDan aku duduk sebentar dengan kata 'pulang' yang menggantung di udara.\n\nPulang.\n\nKe tempat yang aku ingat alamatnya — tapi tidak ingat rasanya.");

// ── [ LORONG RUMAH SAKIT ] ────────────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Hallway.png", overlay: "rgba(0,0,0,0.10)" });
b.M("Lorong yang panjang.\n\nBau antiseptik menyengat.\nAC yang terlalu dingin.\n\nLangkah kakiku sendiri terdengar lebih keras dari yang seharusnya —\n\nseperti suara yang tidak punya teman untuk meredam.");

b.D("{playerName}", "mc", "Resepsionis... lobi bawah.\n\nSemoga nggak nyasar.");

b.chars([{
  id: "receptionist",
  sprite: "/Image/NPC/doctor/Reception.png",
  position: "right",
  size: "large",
  animation: "fade-in"
}]);

b.D("{playerName}", "mc", "Permisi — saya diminta ke sini oleh dokter. Untuk mengurus surat kepulangan.");

b.D("Resepsionis", "receptionist", "Baik. Nama lengkapnya?");

b.D("{playerName}", "mc", "{playerName}.");

b.D("Resepsionis", "receptionist", "Sebentar ya...\n\n*klik klik*\n\n...ketemu. Ini dokumen kepulangannya.\n\nMohon dibaca dulu sebelum ditandatangani.");

b.audio({ sfx: "/audio/sfx/page-turn.mp3" });
b.M("Lembar pertama.\n\nKondisi pasien. Diagnosa. Baris-baris kalimat medis yang terasa seperti dibaca tentang orang lain.");

b.audio({ sfx: "/audio/sfx/page-turn.mp3" });
b.M("Lembar kedua.\n\nInstruksi perawatan. Jadwal kontrol. Satu baris yang dicetak tebal:\n\n'KONSUMSI OBAT TIDAK BOLEH DIHENTIKAN TANPA PERSETUJUAN DOKTER.'");

b.audio({ sfx: "/audio/sfx/page-turn.mp3" });
b.M("Lembar terakhir.\n\nTanda tangan.\n\nTinta di atas kertas — dan selesai.\n\nSeperti itu saja.");

b.D("{playerName}", "mc", "Ini — sudah semua.");

b.D("Resepsionis", "receptionist", "Baik, sudah lengkap.\n\n{playerName} resmi diizinkan pulang hari ini.\n\nJangan lupa ambil semua barang dari kamar ya.");

b.D("{playerName}", "mc", "Siap. Terima kasih.");

b.D("Resepsionis", "receptionist", "Semoga lekas pulih.");

b.chars(null);
b.bg({ image: "/Image/GameBG/Hallway.png", overlay: "rgba(0,0,0,0.30)" });
b.M("Lekas pulih.\n\nSemua orang bilang itu.\n\nTapi tidak ada yang pernah menjelaskan —\n\npulih dari apa, tepatnya.");

// ── [ KEMBALI KE KAMAR — RIN SUDAH ADA ] ─────────────────────────────────────
b.audio({ sfx: "/audio/sfx/walk-on-floor.mp3" });
b.bg({ color: "#0a0a0a" });
b.transition(3000, "— Kembali ke kamar...");


b.bg({ image: "/Image/GameBG/Room.png", overlay: "rgba(0,0,0,0.20)" });
b.M("Kamar yang sama.\n\nTempat yang sudah beberapa hari aku kenal dari langit-langitnya, dari bau AC-nya, dari suara jarum jam di sudut dinding.\n\nKosong.\n\nSeperti yang seharusnya.");

b.M("Aku melangkah masuk.\n\nMenaruh tas.\n\nMelihat sekeliling sekali lagi untuk memastikan tidak ada yang tertinggal.");

b.bg(null);
b.cg("/Image/scenes/Act_2/scene_4.png", "", { effect: "flash" });

b.bg({ image: "/Image/scenes/Act_2/scene_4.png", overlay: "rgba(0,0,0,0.10)" });
b.M("...\n\nTunggu.");

b.M("Ada seseorang di sini.");

b.D("{playerName}", "mc", "Rin?! \n\nSejak kapan kamu disni?");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{
  id: "rin",
  sprite: "/Image/Rinn/eye-close-smile.png",
  position: "right",
  size: "large",
  animation: "fade-in"
}]);

b.D("Rin Fuyutsuki-hime", "rin", "hahahaha sejak tadi~\n\nBecanda. Baru banget sampe kok — tadi kamarnya kosong.\n\nAku nebak kamu bakal balik ke sini dulu. Bener kan?");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Aku berdiri di tengah kamar.\n\nMasih sedikit kaget.\n\nDia duduk di sana — di kursi yang sama dengan kemarin — seolah tidak ada yang aneh.\n\nSeolah ini memang tempatnya.");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "...Kamu ini.\n\nNggak kasih peringatan dulu.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Peringatan apanya — aku bukan hantu.");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("...\n\nAku hampir tertawa.\n\nTapi ada sesuatu di kalimat itu yang menggantung sedetik terlalu lama.\n\nAku tidak tahu kenapa.");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Kamu abis dari mana?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Ngurus surat kepulangan di bawah.\n\nDokter bilang aku boleh pulang hari ini.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/kaget-santay.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Udah boleh?!\n\nCepet banget—");

b.D("{playerName}", "mc", "Katanya kondisi fisik sudah stabil.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Rumah kamu — masih inget?");

b.D("{playerName}", "mc", "Anehnya iya.\n\nAlamat, jalan, naik transportasi apa — inget semua.\n\nTapi hal-hal lain...");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("Hal-hal lain tidak kembali.\n\nSeperti peta yang menunjukkan di mana rumahnya —\n\ntapi tidak bisa menunjukkan apa yang ada di dalamnya.");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Setidaknya kamu nggak lupa jalan pulang.\n\nItu sudah cukup.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Pulang bareng?");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.45)" });
b.choice("Kamu menjawab...", [
  {
    id: "c4_opt1",
    text: "Ayoo — dengan senang hati.",
    next: "act2_pack_a",
    affection: { character: "rin", amount: 10 }
  },
  {
    id: "c4_opt2",
    text: "Nggak usah repot-repot...",
    next: "act2_pack_b",
    affection: { character: "rin", amount: -5 }
  }
]);

// ── Branch A ─────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Oke~\n\nSiap-siap dulu. Jangan ada yang ketinggalan.", { id: "act2_pack_a", next: "act2_packing" });

// ── Branch B ─────────────────────────────────────────────────
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...Kamu nih.", { id: "act2_pack_b", next: "act2_pack_b2" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Aku tetap ikut.\n\nItu bukan pertanyaan.\n\nNah — cepetan siap-siap.", { id: "act2_pack_b2", next: "act2_packing" });

// ── [ PACKING ] ───────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars(null);
b.transition(2000, "— Menyiapkan barang...", { id: "act2_packing" });

b.audio({ sfx: "/audio/sfx/bag.mp3" });
b.M("*Srek. Srek. Srek—*\n\nBarang masuk satu per satu.\n\nBaju. Obat. Dokumen kepulangan.\n\nHal-hal yang bisa digenggam.");

b.audio({ sfx: "/audio/sfx/zipper.mp3" });
b.M("*Zrrrrt.*\n\nTas tertutup.\n\nHal-hal yang tidak bisa digenggam — ditinggal dulu.");

b.bg({ image: "/Image/GameBG/Bg-1-morning.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Oke — siap.");
b.D("Rin Fuyutsuki-hime", "rin", "Ayo kalau begitu~");

// ── [ KELUAR DARI RUMAH SAKIT ] ───────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Exit.png", overlay: "rgba(0,0,0,0.10)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", animation: "fade-in" }]);

b.M("Pintu otomatis terbuka.\n\nDan udara luar masuk sekaligus.\n\nBukan dingin AC. Bukan bau antiseptik.\n\nUdara biasa — yang terasa luar biasa hanya karena kontrasnya.");

b.D("{playerName}", "mc", "Rin.\n\nAku penasaran satu hal.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Aku orangnya kayak gimana?\n\nSebelum... semua ini.");

b.D("Rin Fuyutsuki-hime", "rin", "Kamu?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Baik.\n\nTerlalu baik, kadang-kadang.");

b.D("{playerName}", "mc", "Terlalu baik itu maksudnya?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Tipe orang yang lebih gampang bilang 'iya' daripada mengecewakan orang lain.\n\nBahkan kalau itu berarti ngecewain diri sendiri.");

b.bg({ image: "/Image/GameBG/Exit.png", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("Aku tidak tahu harus merespons apa.\n\nKarena itu bukan terasa seperti pujian.\n\nLebih seperti seseorang yang sudah lama melihat sesuatu — dan akhirnya memutuskan untuk menyebutnya.");

b.bg({ image: "/Image/GameBG/Exit.png", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Itu... kedengarannya nggak terlalu positif.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Aku bilang kamu baik, bukan?\n\nAku cuma nggak bilang itu nggak ada kekurangannya.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Angin sore masuk dari celah antara gedung.\n\nBau rumah sakit hilang perlahan — diganti sesuatu yang lebih bebas.\n\nLebih hidup.\n\nAtau mungkin — hanya terasa lebih hidup karena ada dia di sini.");

// ── [ JALAN KAKI MENUJU STASIUN ] ─────────────────────────────────────────────
// Ditambahkan foreshadowing: orang lewat melihat MC bicara sendiri

b.bg({ image: "/Image/GameBG/road.jpg", overlay: "rgba(0,0,0,0.10)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", animation: "fade-in" }]);

b.D("{playerName}", "mc", "Ke mana dulu?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/pointing.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Stasiun.\n\nKamu naik kereta kan?");

b.D("{playerName}", "mc", "Jauh?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Sepuluh menit jalan.\n\nNggak jauh.");

b.D("{playerName}", "mc", "Oke.\n\nBareng kamu juga nggak bakal kerasa.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Gombal.");

// Foreshadowing: seorang pejalan kaki menoleh dengan tatapan aneh
b.bg({ image: "/Image/GameBG/road.jpg", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Kami berjalan.\n\nTidak terlalu cepat. Tidak terlalu lambat.\n\nIrama yang terasa sudah dikenal — bahkan oleh kaki yang tidak ingat pernah berjalan berdampingan sebelumnya.");

b.M("Seorang lewat.\n\nDia menatapku sekilas — lalu ke sampingku, ke tempat Rin — lalu kembali ke depan, cepat.\n\nEkspresinya... aneh. Seperti melihat sesuatu yang tidak biasa.\n\nMungkin karena aku masih pakai baju pasien.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Rin.\n\nMakasih ya — buat hari ini. Serius.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Nggak usah makasih-makasih an.\n\nIni wajar.");

b.bg({ image: "/Image/GameBG/road.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Dia melihat ke depan.\n\nAngin menggerakkan sedikit rambutnya.\n\nAku tidak tahu banyak tentang diriku sendiri saat ini.\n\nTapi satu hal terasa pasti —\n\nDia ada di sisiku.\n\nDan entah kenapa — itu terasa cukup.");

// ── [ STASIUN — MENUNGGU KERETA BERSAMA ] ─────────────────────────────────────

b.bg({ color: "#0a0a0a" });
b.audio({ sfx: "/audio/sfx/subway.mp3" });
b.transition(3000, "— Stasiun.");

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.20)" });
b.chars([{
  id: "rin",
  sprite: "/Image/Rinn/defal-smile-Photoroom.png",
  position: "right",
  size: "large",
  animation: "fade-in"
}]);

b.M("Cahaya neon putih.\n\nLantai ubin yang memantulkan langkah kaki siapa pun yang lewat.\n\nSuara pengumuman otomatis yang tidak pernah benar-benar didengarkan siapa pun.\n\nOrang-orang menunggu — masing-masing dalam dunianya sendiri.");

b.M("Kami duduk di bangku peron.\n\nBerdampingan.\n\nMenunggu.");

b.D("{playerName}", "mc", "Kamu satu jurusan sama aku?");

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Hampir.\n\nAku turun lebih awal.");

b.D("{playerName}", "mc", "Berapa stasiunnya?");

b.D("Rin Fuyutsuki-hime", "rin", "Dua.");

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Dua stasiun.\n\nBerarti dua stasiun bersama.\n\nAku tidak tahu kenapa itu terasa seperti angka yang penting.");

// Rin membuka percakapan — tidak dengan basa basi
b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Menurutmu...\n\nstasiun itu tempat yang menyenangkan atau menyedihkan?");

b.D("{playerName}", "mc", "Pertanyaan yang tidak terduga.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Jawab aja.");

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.30)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Aku melihat sekeliling.\n\nOrang-orang yang menunggu.\nMasing-masing menatap layar HP, atau ujung sepatu sendiri.\nTidak ada yang bicara.\n\nSemua datang dari suatu tempat.\nSemua pergi ke suatu tempat.\n\nTapi di sini — di titik ini — mereka hanya berdiri.\n\nDi antara dua tempat yang bukan milik mereka.");

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.45)" });
b.choice("Kamu menjawab...", [
  {
    id: "c5_opt1",
    text: "Menyedihkan. Semua orang pergi — tidak ada yang benar-benar tinggal.",
    next: "act2_station_a",
    affection: { character: "rin", amount: 10 }
  },
  {
    id: "c5_opt2",
    text: "Menyenangkan. Artinya selalu ada tujuan. Selalu ada tempat yang dituju.",
    next: "act2_station_b",
    affection: { character: "rin", amount: 5 }
  },
  {
    id: "c5_opt3",
    text: "Tergantung siapa yang ada di sebelahmu saat menunggu.",
    next: "act2_station_c",
    affection: { character: "rin", amount: 15 }
  }
]);

// ── Branch A ─────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Semua orang pergi. Tidak ada yang tinggal.", { id: "act2_station_a", next: "act2_station_a2" });
b.D("Rin Fuyutsuki-hime", "rin", "Kamu pernah mikir nggak...\n\nbahwa beberapa orang memang diciptakan untuk jadi seperti stasiun?\n\nSelalu ada. Selalu ditinggal.\n\nTapi harus tetap berdiri — supaya yang lain bisa pergi.", { id: "act2_station_a2", next: "act2_station_merge" });

// ── Branch B ─────────────────────────────────────────────────
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Selalu ada tujuan.", { id: "act2_station_b", next: "act2_station_b2" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Pernah nggak —\n\nkamu berdiri di peron, kereta datang, pintu terbuka —\n\ntapi kaki nggak bisa bergerak?\n\nBukan karena takut. Tapi karena tiba-tiba lupa kenapa kamu harus pergi.", { id: "act2_station_b2", next: "act2_station_merge" });

// ── Branch C ─────────────────────────────────────────────────
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Tergantung siapa yang ada di sebelahmu saat menunggu.", { id: "act2_station_c", next: "act2_station_c2" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Dan kalau kamu selalu sendirian setiap kali menunggu —\n\napakah itu berarti stasiun selalu menyedihkan?\n\nAtau kamu yang belum nemu orang yang tepat untuk menunggu bersamamu?", { id: "act2_station_c2", next: "act2_station_merge" });

// ── Merge ─────────────────────────────────────────────────────
b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.35)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("Ada sesuatu di cara Rin bicara tentang stasiun ini.\n\nSeperti dia tidak benar-benar sedang bicara tentang stasiun.", { id: "act2_station_merge", next: "act2_station_1" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Rin...\n\nKamu sering kepikiran hal-hal kayak gitu?", { id: "act2_station_1", next: "act2_station_2" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Sering.\n\nKamu dulu sering bilang aku terlalu banyak mikir.", { id: "act2_station_2", next: "act2_station_3" });

b.D("{playerName}", "mc", "Memangnya salah?", { id: "act2_station_3", next: "act2_station_4" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Nggak salah.\n\nTapi yang paling sering dipikirkan manusia — justru adalah hal yang harusnya paling tidak perlu dipikirkan.", { id: "act2_station_4", next: "act2_station_5" });

b.D("{playerName}", "mc", "Contohnya?", { id: "act2_station_5", next: "act2_station_6" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.30)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...", { id: "act2_station_6", next: "act2_station_7" });

b.D("Rin Fuyutsuki-hime", "rin", "Kalau seseorang penting buat kamu —\n\nseharusnya nggak perlu banyak mikir untuk bilang itu ke mereka.", { id: "act2_station_7", next: "act2_station_8" });

b.D("Rin Fuyutsuki-hime", "rin", "Tapi manusia selalu mikirin konsekuensinya dulu.\nMikirin nanti gimana.\nMikirin apa kata orang.\n\nDan waktu akhirnya siap —", { id: "act2_station_8", next: "act2_station_9" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.55)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/kecewa.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Orangnya sudah tidak ada.", { id: "act2_station_9", next: "act2_station_10" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.45)" });
b.chars(null);
b.M("Angin di peron lewat.\n\nSuara rel kereta di kejauhan.\nBelum sampai — tapi sudah bisa didengar.\n\nDan di antara kami — tidak ada yang bicara.", { id: "act2_station_10", next: "act2_station_11" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.20)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Rin...\n\nKamu ngomong dari pengalaman?", { id: "act2_station_11", next: "act2_station_12" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Mungkin.", { id: "act2_station_12", next: "act2_station_13" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Atau mungkin aku cuma suka lihat ekspresi kamu waktu dapet pertanyaan yang susah.", { id: "act2_station_13", next: "act2_station_14" });

b.D("{playerName}", "mc", "...Itu tidak lucu.", { id: "act2_station_14", next: "act2_station_15" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Lucu kok.\n\nDari sudut pandangku.", { id: "act2_station_15", next: "act2_station_16" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.30)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Dia tersenyum.\n\nTapi matanya tidak ikut tersenyum.\n\nAda sesuatu di sana — sesuatu yang sudah ada sejak tadi dan baru sekarang aku perhatikan dengan benar.\n\nSeperti orang yang sudah sangat lama belajar untuk terlihat baik-baik saja.\n\nDan sangat mahir melakukannya.", { id: "act2_station_16", next: "act2_station_17" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Rin.\n\nAku nggak tau banyak tentang kita — tentang sebelumnya.\n\nTapi aku tau satu hal.", { id: "act2_station_17", next: "act2_station_18" });

b.D("{playerName}", "mc", "Kamu penting.\n\nDan aku nggak mau jadi orang yang terlalu lama mikir sebelum bilang itu.", { id: "act2_station_18", next: "act2_station_19" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.40)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/kaget-santay.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...", { id: "act2_station_19", next: "act2_station_20" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Kamu tau...\n\nada hal-hal yang lebih baik tidak diingat.", { id: "act2_station_20", next: "act2_station_21" });

b.D("{playerName}", "mc", "Maksudnya?", { id: "act2_station_21", next: "act2_station_22" });

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Nggak ada.\n\nKamu nggak perlu tahu sekarang.", { id: "act2_station_22", next: "act2_station_23" });

b.bg({ image: "/Image/GameBG/Stasiun.png", overlay: "rgba(0,0,0,0.35)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Aku ingin memaksa.\n\nIngin tanya lebih.\n\nTapi ada sesuatu di cara dia berkata 'nggak perlu tahu sekarang' yang terasa seperti pintu yang ditutup dari dalam —\n\ndan kuncinya ada di sisi yang tidak bisa kujangkau.", { id: "act2_station_23", next: "act2_station_24" });

// ── [ KERETA DATANG ] ─────────────────────────────────────────

b.bg({ color: "#0a0a0a" });
b.audio({ sfx: "/audio/sfx/subway.mp3" });
b.transition(500, "", { id: "act2_station_24_intro", next: "act2_station_24" });

b.audio({ sfx: "/audio/sfx/Train-arrived.mp3" });
b.transition(3000, "— The Train Has Arrived.", { id: "act2_station_24", next: "act2_station_25" });

b.bg({ image: "/Image/GameBG/Stasiun-1.png", overlay: "rgba(0,0,0,0.25)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large", dim: true }]);
b.M("Suara roda besi di rel — semakin dekat.\n\nAngin dari ujung terowongan mendahului keretanya.", { id: "act2_station_25", next: "act2_station_26" });

// Kereta masuk peron
b.bg({ image: "/Image/GameBG/Stasiun-1.png", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Itu kereta kita.", { id: "act2_station_26", next: "act2_station_27" });

b.D("{playerName}", "mc", "Yuk.", { id: "act2_station_27", next: "act2_station_28" });

// Masuk bersama — pintu menutup
b.bg({ image: "/Image/GameBG/Stasiun-1.png", overlay: "rgba(0,0,0,0.30)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("Kami masuk bersama.\n\nPintu menutup di belakang kami.", { id: "act2_station_28", next: "act2_ending" });

// ── [ ENDING ACT 2 ] ──────────────────────────────────────────────────────────

b.bg({ color: "#06020f" });
b.end("帰還 — Homecoming", "act", {
  id: "act2_ending",
  subtitle: "Ada hal-hal yang lebih baik tidak diingat.\nAda juga hal-hal yang sudah terlambat untuk dilupakan.",
  next: "act3_s1"
});

export const ACT_2_SCENES: Scene[] = b.build();