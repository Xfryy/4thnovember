import { Scene } from "@/types/game";
import { StoryBuilder } from "@/lib/StoryBuilder";

const b = new StoryBuilder(1);

b.bg({"color":"#000000"});
b.transition(1800, "");

b.bg(null);
b.cg("/Image/scenes/Act_1/scene_1.jpeg", "");

b.bg({"image":"/Image/scenes/Act_1/scene_1.jpeg","overlay":"rgba(0,0,0,0.10)"});
b.M("____");

b.M("______");

b.M("_____");

b.M("Langit-langit putih.\n\nBau yang... steril.");

b.bg({"image":"/Image/scenes/Act_1/scene_1.jpeg","overlay":"rgba(0,0,0,0.15)"});
b.M("Kepala berat. Badan rasanya kayak abis ketabrak truk.");

b.M("sudah jelas ini dirumah sakit..huft");

b.M("Tapi tunggu—\n\nAda seseorang di sana.");

b.bg({"image":"/Image/scenes/Act_1/scene_1.jpeg","overlay":"rgba(0,0,0,0.10)"});
b.M("Perempuan cantik...\n\nDia gelisah. Khawatir. Kenapa dia disni?");

b.M("aku di jengguk perempuan?\n\nga mungkin~");

b.M("Tapi kalo iya,\nDijamin langsung bugar deh kalau ada perempuan kayak gitu yang—");

b.bg(null);
b.cg("/Image/scenes/Act_1/scene_1-2.jpeg", "", {"effect":"screenShake"});

b.bg({"image":"/Image/scenes/Act_1/scene_1-2.jpeg","overlay":"rgba(0,0,0,0.10)"});
b.M("Eh—");

b.M("Ehhhh?!\n\nD-dia ke arah sini?!");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large","animation":"fade-in"}]);
b.D("-?????-", "rin_unknown", "Kamu udah siuman?");

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Leganya... aku nungguin kamu dengan khawatir dari tadi loh.");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large","dim":true}]);
b.M("Ternyata... dia yang dari tadi aku perhatiin, itu menjengguk aku?");

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/confident-Photoroom.png","position":"right","size":"large","dim":true}]);
b.M("Lagi pula...\n\nKenapa aku ada di rumah sakit?");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.25)"});
b.M("Yang terakhir aku ingat...\n\nHmm.\n\n...");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.30)"});
b.M("Tidak bisa.\n\nAku tidak ingat apa-apa.");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.M("Apa jangan-jangan...\n\nPerempuan ini menabrak aku?\nItu lah sebabnya aku tidak ingat apa apa..\n\nHahaha, tidak mungkin deh~");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Hei.\n\nKamu kok malah bengong sih? Aku tanya loh.");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.45)"});
b.choice("Kamu menjawab...", [{"id":"c1_opt1","text":"Aku cuma kagum aja ngeliat perempuan cantik yang dari tadi gelisah khawatir ternyata buat aku.","next":"act1_s25a","affection":{"character":"rin","amount":15}},{"id":"c1_opt2","text":"Enggak kenapa-kenapa, aku cuma lagi mikir aja.","next":"act1_s25b","affection":{"character":"rin","amount":-5}},{"id":"c1_opt3","text":"...Kamu nabrak aku ya?","next":"act1_s25c","affection":{"character":"rin","amount":0}}]);

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut-nengok.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Hmph.\n\nMencoba menghibur...", {"id":"act1_s25a","next":"act1_s25a_2"});

b.D("-?????-", "rin_unknown", "Tapi— makasih atas pujiannya.", {"id":"act1_s25a_2","next":"act1_s26"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/kecewa.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Aku cuman lagi mikir aja, kenapa bisa di rumah sakit..", {"id":"act1_s25b","next":"act1_s25b_2"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "hmmmm.\n\nDokter entar ngasih tau~", {"id":"act1_s25b_2","next":"act1_s26"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut-nengok.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Hah?!\n\nAku?! Nabrak kamu?!\n\nYang bener aja—", {"id":"act1_s25c","next":"act1_s25c_2"});

b.D("-?????-", "rin_unknown", "...Aku bukan penabrak kamu, oke.\n\nAku yang nungguin kamu dari tadi.", {"id":"act1_s25c_2","next":"act1_s26"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("{playerName}", "mc", "aku udah siuman kok, nggak ada sakit apa-apa.\n\nKondisi terbaik! Apalagi ada perempuan cantik di sebelah aku, xixixi.", {"id":"act1_s26","next":"act1_s27"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/memohon.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Syukurlah... aku lega.", {"id":"act1_s27","next":"act1_s28"});

b.D("{playerName}", "mc", "Ini mah maaf banget ya...\n\nserius dua rius..\n\nAku nggak inget apa-apa, tapi aku yakin kamu pasti orang yang baik dan perhatian banget buat aku, makanya kamu nungguin aku disini.", {"id":"act1_s28","next":"act1_s29"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/kaget-santay.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "____", {"id":"act1_s29","next":"act1_s30"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/mikir.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "_______", {"id":"act1_s30","next":"act1_s31"});

b.D("-?????-", "rin_unknown", "Hmmm...", {"id":"act1_s31","next":"act1_s32"});

b.audio({"voice":""});
b.chars([{"id":"rin","sprite":"/Image/Rinn/sombong.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Aku...\n\nRin. Rin Fuyutsuki-hime.", {"id":"act1_s32","next":"act1_s33"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/pointing.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Pacar kamu loh~", {"id":"act1_s33","next":"act1_s34"});

b.D("{playerName}", "mc", "HAHHHHH?!", {"id":"act1_s34","effect":"screenShake","next":"act1_s35"});

b.D("{playerName}", "mc", "Serius?!", {"id":"act1_s35","next":"act1_s36"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.45)"});
b.choice("Bagaimana kamu merespon pengakuan Rin?", [{"id":"c2_opt1","text":"Beneran?! Wah... aku beruntung banget dong!","next":"act1_s37a","affection":{"character":"rin","amount":15}},{"id":"c2_opt2","text":"Kamu tidak sedang bercanda kan..?","next":"act1_s37b","affection":{"character":"rin","amount":5}},{"id":"c2_opt3","text":"Aku... tidak bisa ingat kamu sama sekali. Maaf.","next":"act1_s37c","affection":{"character":"rin","amount":-5}}], {"id":"act1_s36"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Iyaa~ aku serius. Kamu pasti ga bisa inget ya?\n\nHahaha, kasian~", {"id":"act1_s37a","next":"act1_s38"});

b.D("Rin Fuyutsuki-hime", "rin", "Bercanda gimana. Serius 100%.\n\nKamu aja yang lupa~", {"id":"act1_s37b","next":"act1_s38"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.D("Rin Fuyutsuki-hime", "rin", "Aku tau kok.\n\nMakanya aku di sini.", {"id":"act1_s37c","next":"act1_s38"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large","dim":true}]);
b.D("{playerName}", "mc", "Rin Fuyutsuki-hime ya.. Nama yang indah", {"id":"act1_s38","next":"act1_s39"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.30)"});
b.chars(null);
b.M("Aku mencoba mengingat.\n\nTapi... blank. Sama sekali tidak ada.", {"id":"act1_s39","next":"act1_s40"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large"}]);
b.D("{playerName}", "mc", "Kamu memang terasa familiar sih. Entah kenapa.", {"id":"act1_s40","next":"act1_s41"});

b.D("Rin Fuyutsuki-hime", "rin", "Iya lah~ Kita kan pasangan, wajar aja kamu ngerasa familiar sama aku.", {"id":"act1_s41","next":"act1_s42"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.25)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large","dim":true}]);
b.M("Seperti ada sesuatu di dalam diri ini yang tidak bisa dilupakan...\n\nBahkan ketika pikiran tidak bisa ingat — tubuh ini seperti sudah tahu.", {"id":"act1_s42","next":"act1_s43"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large"}]);
b.D("{playerName}", "mc", "Aku nggak ngerti sih, tapi aku juga ngerasa gitu.", {"id":"act1_s43","next":"act1_s44"});

b.D("Rin Fuyutsuki-hime", "rin", "Senang dengar kamu bilang begitu. Semoga ingantan kamu cepat pulih ya!.", {"id":"act1_s44","next":"act1_s45"});

b.D("{playerName}", "mc", "Hmm... kalo bisa secepatnya!.", {"id":"act1_s45","next":"act1_s46"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/menguap.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Bagus.\n\nOh iya, Tadi aku hampir ketiduran nungguin kamu tadi.", {"id":"act1_s46","next":"act1_s47"});

b.D("{playerName}", "mc", "Hahaha, maaf ya. Tapi makasih udah nungguin.", {"id":"act1_s47","next":"act1_s48"});

b.bg({"color":"#0a0a0a"});
b.audio({"sfx":"/audio/sfx/knocking-door.mp3"});
b.transition(5000, "— Tok. Tok. Tok.", {"id":"act1_s48","next":"act1_s49"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/menguap.png","position":"right","size":"large","animation":"enter-right"},{"id":"doctor","sprite":"/Image/NPC/doctor/doctor.png","position":"left","size":"large","animation":"enter-bottom","offsetY":-60,"offsetX":-20}]);
b.D("Dokter", "doctor", "Permisi, Maaf mengganggu.", {"id":"act1_s49","next":"act1_s50"});

b.chars([{"id":"doctor","sprite":"/Image/NPC/doctor/doctor.png","position":"left","size":"large","animation":"enter-bottom","offsetY":-60,"offsetX":-20}]);
b.D("Dokter", "doctor", "Saya dokter yang menangani kamu. Ada beberapa hal yang perlu kamu ketahui mengenai kondisimu.", {"id":"act1_s50","next":"act1_s51"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.D("Dokter", "doctor", "Berdasarkan hasil pemeriksaan...\n\nKamu mengalami amnesia sementara.", {"id":"act1_s51","next":"act1_s52"});

b.D("Dokter", "doctor", "Kondisi ini bukan akibat cedera fisik. Melainkan akibat trauma psikologis dan tekanan stres yang berlebihan dalam jangka waktu yang cukup panjang.", {"id":"act1_s52","next":"act1_s53"});

b.D("Dokter", "doctor", "Pikiran kamu secara tidak sadar 'memutus' akses ke memori tertentu sebagai mekanisme perlindungan diri.\n\nIni adalah reaksi alami tubuh terhadap sesuatu yang terlalu berat untuk diproses.", {"id":"act1_s53","next":"act1_s54"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.35)"});
b.chars(null);
b.M("...Sesuatu yang terlalu berat untuk diproses.\n\nApa artinya itu?", {"id":"act1_s54","next":"act1_s55"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"doctor","sprite":"/Image/NPC/doctor/doctor.png","position":"left","size":"large","animation":"enter-bottom","offsetY":-60,"offsetX":-20}]);
b.D("Dokter", "doctor", "Yang bisa kamu lakukan sekarang adalah beristirahat, jangan memaksakan diri untuk mengingat, dan minum obat yang saya resepkan secara teratur.", {"id":"act1_s55","next":"act1_s56"});

b.bg(null);
b.cg("/Image/scenes/Act_1/scene-doctor.jpeg", "", {"id":"act1_s56","next":"act1_s57"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.D("Dokter", "doctor", "...\n\nIni obatnya. Diminum 1x sehari ya. Jangan sampai terlewat.\n\nIni untuk membantu proses pemulihan ingatan kamu secara bertahap.", {"id":"act1_s57","next":"act1_s58"});

b.D("Dokter", "doctor", "Baik. Kalau ada yang ingin ditanyakan, bisa hubungi perawat di luar ya. Saya permisi dulu.", {"id":"act1_s58","next":"act1_s59"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.25)"});
b.chars(null);
b.M("Dokter itu berjalan keluar.\n\nDia berlalu begitu saja...\n\nSeperti tidak menganggap Rin ada di sana.", {"id":"act1_s59","next":"act1_s60"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Weh, kamu dikasih obat~\n\nMinum ya, biar cepet sembuh.", {"id":"act1_s60","next":"act1_s61"});

b.D("{playerName}", "mc", "Iya iya, aku minum.", {"id":"act1_s61","next":"act1_s62"});

b.D("{playerName}", "mc", "Eh, Rin. Kamu nggak pulang? Udah sore loh kayaknya.", {"id":"act1_s62","next":"act1_s63"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya nih... aku harus pulang.\n\nTapi aku bakal balik besok ya.", {"id":"act1_s63","next":"act1_s64"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.45)"});
b.choice("Kamu menjawab...", [{"id":"c3_opt1","text":"Oke, hati-hati ya di jalan.","next":"act1_s65a","affection":{"character":"rin","amount":10}},{"id":"c3_opt2","text":"Nggak usah repot-repot balik...","next":"act1_s65b","affection":{"character":"rin","amount":-10}},{"id":"c3_opt3","text":"Aku tunggu.","next":"act1_s65c","affection":{"character":"rin","amount":20}}], {"id":"act1_s64"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya~!\n\nIstirahat yang bener ya. Jangan macem-macem.", {"id":"act1_s65a","next":"act1_s66"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "...Kamu ngomong apa sih.", {"id":"act1_s65b","next":"act1_s65b_2"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Aku tetap balik besok. Itu bukan pertanyaan.", {"id":"act1_s65b_2","next":"act1_s66"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "...", {"id":"act1_s65c","next":"act1_s65c_2"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Iya.\n\nAku pasti datang.", {"id":"act1_s65c_2","next":"act1_s66"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large","dim":true}]);
b.M("Dia melambai.\n\nSenyumnya terakhir yang aku lihat sebelum pintu kamar rumah sakit itu menutup.", {"id":"act1_s66","next":"act1_s67"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.40)"});
b.chars(null);
b.M("...\n\nAku sendirian lagi.", {"id":"act1_s67","next":"act1_s68"});

b.M("Langit-langit putih yang sama.\n\nBau yang sama.\n\nTapi rasanya... berbeda.", {"id":"act1_s68","next":"act1_s69"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.50)"});
b.M("Ada sesuatu yang harusnya aku ingat.\n\nAda sesuatu yang berat banget yang disimpan di dalam sana — di tempat yang tidak bisa aku jangkau.", {"id":"act1_s69","next":"act1_s70"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.60)"});
b.M("Apa yang terjadi padaku?\n\nApa yang coba kulupakan?", {"id":"act1_s70","next":"act1_ending"});

b.bg({"color":"#06020f"});
b.end("目覚め — Awakening", "act", {"id":"act1_ending","subtitle":"Seseorang menunggumu. Bahkan ketika kamu tidak ingat kenapa.","next":"act2_s1"});

export const ACT_1_SCENES: Scene[] = b.build();
