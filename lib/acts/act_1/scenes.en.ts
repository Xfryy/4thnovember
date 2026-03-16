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

b.M("White ceiling.\n\nThat smell... sterile.");

b.bg({"image":"/Image/scenes/Act_1/scene_1.jpeg","overlay":"rgba(0,0,0,0.15)"});
b.M("Head feels heavy. Body feels like it got hit by a truck.");

b.M("Obviously this is a hospital... ugh.");

b.M("But wait—\n\nThere's someone over there.");

b.bg({"image":"/Image/scenes/Act_1/scene_1.jpeg","overlay":"rgba(0,0,0,0.10)"});
b.M("A beautiful girl...\n\nShe looks restless. Worried. Why is she here?");

b.M("A girl came to visit me?\n\nNo way~");

b.M("But if that's true,\n\nI'd be healed instantly if there's a girl like that—");

b.bg(null);
b.cg("/Image/scenes/Act_1/scene_1-2.jpeg", "", {"effect":"screenShake"});

b.bg({"image":"/Image/scenes/Act_1/scene_1-2.jpeg","overlay":"rgba(0,0,0,0.10)"});
b.M("Huh—");

b.M("Ehhhh?!\n\nSh-she's coming this way?!");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large","animation":"fade-in"}]);
b.D("-?????-", "rin_unknown", "You're awake?");

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "I'm so relieved... I've been waiting here worried about you, you know.");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large","dim":true}]);
b.M("So... that girl I've been staring at, she came to visit me?");

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/confident-Photoroom.png","position":"right","size":"large","dim":true}]);
b.M("And anyway...\n\nWhy am I in the hospital?");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.25)"});
b.M("The last thing I remember...\n\nHmm.\n\n...");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.30)"});
b.M("I can't.\n\nI don't remember anything.");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.M("What if...\n\nThis girl hit me with her car?\n\nThat's why I can't remember anything...\n\nHahaha, no way~");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Hey.\n\nWhy are you spacing out? I asked you a question.");

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.45)"});
b.choice("You answer...", [{"id":"c1_opt1","text":"I was just amazed to see a beautiful girl who was restless and worried — for me.","next":"act1_s25a","affection":{"character":"rin","amount":15}},{"id":"c1_opt2","text":"It's nothing, I was just thinking.","next":"act1_s25b","affection":{"character":"rin","amount":-5}},{"id":"c1_opt3","text":"...Did you hit me with your car?","next":"act1_s25c","affection":{"character":"rin","amount":0}}]);

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut-nengok.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Hmph.\n\nTrying to cheer me up...", {"id":"act1_s25a","next":"act1_s25a_2"});

b.D("-?????-", "rin_unknown", "But— thanks for the compliment.", {"id":"act1_s25a_2","next":"act1_s26"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/kecewa.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "I was just thinking, why I ended up in the hospital..", {"id":"act1_s25b","next":"act1_s25b_2"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "hmmmm.\n\nThe doctor will tell you later~", {"id":"act1_s25b_2","next":"act1_s26"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut-nengok.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Huh?!\n\nMe?! Hit you?!\n\nYou can't be serious—", {"id":"act1_s25c","next":"act1_s25c_2"});

b.D("-?????-", "rin_unknown", "...I'm not the one who hit you, okay.\n\nI've been here waiting for you all this time.", {"id":"act1_s25c_2","next":"act1_s26"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("{playerName}", "mc", "I'm awake, nothing hurts.\n\nPerfect condition! Especially with a beautiful girl by my side, hehehe.", {"id":"act1_s26","next":"act1_s27"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/memohon.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "Thank goodness... I'm relieved.", {"id":"act1_s27","next":"act1_s28"});

b.D("{playerName}", "mc", "I'm really sorry...\n\nfor real..\n\nI don't remember anything, but I'm sure you're a good person and you care about me, that's why you waited for me here.", {"id":"act1_s28","next":"act1_s29"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/kaget-santay.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "____", {"id":"act1_s29","next":"act1_s30"});

b.chars([{"id":"rin_unknown","sprite":"/Image/Rinn/mikir.png","position":"right","size":"large"}]);
b.D("-?????-", "rin_unknown", "_______", {"id":"act1_s30","next":"act1_s31"});

b.D("-?????-", "rin_unknown", "Hmmm...", {"id":"act1_s31","next":"act1_s32"});

b.audio({"voice":""});
b.chars([{"id":"rin","sprite":"/Image/Rinn/sombong.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "I'm...\n\nRin. Rin Fuyutsuki-hime.", {"id":"act1_s32","next":"act1_s33"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/pointing.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "I'm your girlfriend~", {"id":"act1_s33","next":"act1_s34"});

b.D("{playerName}", "mc", "WHAAAAAT?!", {"id":"act1_s34","effect":"screenShake","next":"act1_s35"});

b.D("{playerName}", "mc", "Seriously?!", {"id":"act1_s35","next":"act1_s36"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.45)"});
b.choice("How do you respond to Rin's confession?", [{"id":"c2_opt1","text":"Really?! Wow... I'm so lucky then!","next":"act1_s37a","affection":{"character":"rin","amount":15}},{"id":"c2_opt2","text":"You're not joking, are you..?","next":"act1_s37b","affection":{"character":"rin","amount":5}},{"id":"c2_opt3","text":"I... can't remember you at all. Sorry.","next":"act1_s37c","affection":{"character":"rin","amount":-5}}], {"id":"act1_s36"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Yeah~ I'm serious. You can't remember, can you?\n\nHahaha, poor you~", {"id":"act1_s37a","next":"act1_s38"});

b.D("Rin Fuyutsuki-hime", "rin", "Joking how? 100% serious.\n\nYou're the one who forgot~", {"id":"act1_s37b","next":"act1_s38"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.D("Rin Fuyutsuki-hime", "rin", "I know.\n\nThat's why I'm here.", {"id":"act1_s37c","next":"act1_s38"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large","dim":true}]);
b.D("{playerName}", "mc", "Rin Fuyutsuki-hime, huh.. A beautiful name.", {"id":"act1_s38","next":"act1_s39"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.30)"});
b.chars(null);
b.M("I try to remember.\n\nBut... blank. Nothing at all.", {"id":"act1_s39","next":"act1_s40"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large"}]);
b.D("{playerName}", "mc", "You do feel familiar, though. Somehow.", {"id":"act1_s40","next":"act1_s41"});

b.D("Rin Fuyutsuki-hime", "rin", "Of course~ We're a couple, it's only natural you feel familiar with me.", {"id":"act1_s41","next":"act1_s42"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.25)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large","dim":true}]);
b.M("There's something inside me that just can't be forgotten...\n\nEven when my mind can't remember — my body already knows.", {"id":"act1_s42","next":"act1_s43"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large"}]);
b.D("{playerName}", "mc", "I don't get it, but I feel that way too.", {"id":"act1_s43","next":"act1_s44"});

b.D("Rin Fuyutsuki-hime", "rin", "I'm glad to hear you say that. Hope your memory recovers soon!.", {"id":"act1_s44","next":"act1_s45"});

b.D("{playerName}", "mc", "Hmm... hopefully soon!.", {"id":"act1_s45","next":"act1_s46"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/menguap.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Good.\n\nOh yeah, I almost fell asleep waiting for you earlier.", {"id":"act1_s46","next":"act1_s47"});

b.D("{playerName}", "mc", "Hahaha, sorry about that. But thanks for waiting.", {"id":"act1_s47","next":"act1_s48"});

b.bg({"color":"#0a0a0a"});
b.audio({"sfx":"/audio/sfx/knocking-door.mp3"});
b.transition(5000, "— Knock. Knock. Knock.", {"id":"act1_s48","next":"act1_s49"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/menguap.png","position":"right","size":"large","animation":"enter-right"},{"id":"doctor","sprite":"/Image/NPC/doctor/doctor.png","position":"left","size":"large","animation":"enter-bottom","customSize":{"width":520,"height":880},"offsetY":-60,"offsetX":-20}]);
b.D("Doctor", "doctor", "Excuse me, sorry to interrupt.", {"id":"act1_s49","next":"act1_s50"});

b.chars([{"id":"doctor","sprite":"/Image/NPC/doctor/doctor.png","position":"left","size":"large","animation":"enter-bottom","customSize":{"width":520,"height":880},"offsetY":-60,"offsetX":-20}]);
b.D("Doctor", "doctor", "I'm the doctor in charge of your case. There are some things you need to know about your condition.", {"id":"act1_s50","next":"act1_s51"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.D("Doctor", "doctor", "Based on the examination results...\n\nYou're experiencing temporary amnesia.", {"id":"act1_s51","next":"act1_s52"});

b.D("Doctor", "doctor", "This condition isn't caused by physical injury. Rather, it's due to psychological trauma and excessive stress over a prolonged period.", {"id":"act1_s52","next":"act1_s53"});

b.D("Doctor", "doctor", "Your mind subconsciously 'severed' access to certain memories as a self-protection mechanism.\n\nThis is the body's natural reaction to something too heavy to process.", {"id":"act1_s53","next":"act1_s54"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.35)"});
b.chars(null);
b.M("...Something too heavy to process.\n\nWhat does that mean?", {"id":"act1_s54","next":"act1_s55"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"doctor","sprite":"/Image/NPC/doctor/doctor.png","position":"left","size":"large","animation":"enter-bottom","customSize":{"width":520,"height":880},"offsetY":-60,"offsetX":-20}]);
b.D("Doctor", "doctor", "For now, what you can do is rest, don't force yourself to remember, and take the medication I've prescribed regularly.", {"id":"act1_s55","next":"act1_s56"});

b.bg(null);
b.cg("/Image/scenes/Act_1/scene-doctor.jpeg", "", {"id":"act1_s56","next":"act1_s57"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.D("Doctor", "doctor", "...\n\nHere's your medicine. Take it once a day. Don't miss a dose.\n\nThis will help your memory recover gradually.", {"id":"act1_s57","next":"act1_s58"});

b.D("Doctor", "doctor", "Alright. If you have any questions, you can contact the nurse outside. I'll take my leave now.", {"id":"act1_s58","next":"act1_s59"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.25)"});
b.chars(null);
b.M("The doctor walked out.\n\nHe just left...\n\nLike he didn't even notice Rin was there.", {"id":"act1_s59","next":"act1_s60"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/defal-smile-Photoroom.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Ooh, they gave you medicine~\n\nTake it, so you'll get better soon.", {"id":"act1_s60","next":"act1_s61"});

b.D("{playerName}", "mc", "Yeah yeah, I'll take it.", {"id":"act1_s61","next":"act1_s62"});

b.D("{playerName}", "mc", "Hey, Rin. Aren't you going home? I think it's already evening.", {"id":"act1_s62","next":"act1_s63"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Yeah... I should go home.\n\nBut I'll come back tomorrow, okay.", {"id":"act1_s63","next":"act1_s64"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.45)"});
b.choice("You answer...", [{"id":"c3_opt1","text":"Okay, take care on the way home.","next":"act1_s65a","affection":{"character":"rin","amount":10}},{"id":"c3_opt2","text":"You don't need to bother coming back...","next":"act1_s65b","affection":{"character":"rin","amount":-10}},{"id":"c3_opt3","text":"I'll be waiting.","next":"act1_s65c","affection":{"character":"rin","amount":20}}], {"id":"act1_s64"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.15)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Okay~!\n\nRest well, okay. Don't do anything weird.", {"id":"act1_s65a","next":"act1_s66"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/cemberut.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "...What are you saying.", {"id":"act1_s65b","next":"act1_s65b_2"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "I'm still coming back tomorrow. That's not a question.", {"id":"act1_s65b_2","next":"act1_s66"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/eye-close-smile.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "...", {"id":"act1_s65c","next":"act1_s65c_2"});

b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large"}]);
b.D("Rin Fuyutsuki-hime", "rin", "Okay.\n\nI'll definitely come.", {"id":"act1_s65c_2","next":"act1_s66"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.20)"});
b.chars([{"id":"rin","sprite":"/Image/Rinn/hai.png","position":"right","size":"large","dim":true}]);
b.M("She waved.\n\nHer smile was the last thing I saw before the hospital room door closed.", {"id":"act1_s66","next":"act1_s67"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.40)"});
b.chars(null);
b.M("...\n\nI'm alone again.", {"id":"act1_s67","next":"act1_s68"});

b.M("The same white ceiling.\n\nThe same smell.\n\nBut it feels... different.", {"id":"act1_s68","next":"act1_s69"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.50)"});
b.M("There's something I should remember.\n\nThere's something heavy stored in there — in a place I can't reach.", {"id":"act1_s69","next":"act1_s70"});

b.bg({"image":"/Image/GameBG/Bg-1.jpg","overlay":"rgba(0,0,0,0.60)"});
b.M("What happened to me?\n\nWhat am I trying to forget?", {"id":"act1_s70","next":"act1_ending"});

b.bg({"color":"#06020f"});
b.end("目覚め — Awakening", "good", {"id":"act1_ending","subtitle":"Someone is waiting for you. Even when you don't remember why.","next":"act2_s1"});

export const ACT_1_SCENES_EN: Scene[] = b.build();
