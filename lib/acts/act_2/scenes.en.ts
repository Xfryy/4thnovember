import { Scene } from "@/types/game";
import { StoryBuilder } from "@/lib/StoryBuilder";

const b = new StoryBuilder(2);

// ============================================================
// ACT 2 — 帰還 (Homecoming)
// ============================================================

// ── [ PROLOGUE: DREAM ] ──────────────────────────────────────

// Fade in from black — slowly opening eyes
b.bg({ color: "#000000" });
b.transition(2500, "", { id: "act2_s1" });

// Slowly opening eyes — dream begins
b.bg({ image: "/Image/scenes/Act_2/scene_1.png", overlay: "rgba(0,0,0,0.40)" });
b.D("-?????", "unknown", "___");
b.D("-?????", "unknown", "___");
b.D("-?????", "unknown", "___");

b.M("...\n\nWas I dreaming?\n\nThere's a girl in front of me.\n\nBut her face is blurry — like an out-of-focus photo.\nVague. Too vague.");
b.M("Maybe I should greet her.");

b.D("{playerName}", "mc", "Hey...\n\nWho are you?");
b.D("-?????", "unknown", "___");
b.M("Silence.\n\nNot a peaceful silence — this kind of silence sticks to your skin.\nHeavy. Cold. Unnatural.");
b.D("{playerName}", "mc", "Hey.\n\nI asked you a question.");

// Girl suddenly stands — scene_2
b.bg({ image: "/Image/scenes/Act_2/scene_2.png", overlay: "rgba(0,0,0,0.25)" });
b.M("— She stood up.\n\nSuddenly. Without any transition. Without sound.\n\nLike a tape forcibly skipped to the next frame.");

b.D("-?????", "unknown", "Σϴλψ ωϑδΦΨ Θξζλψ ΩϴΣΨδ ξΘΩΦλ ψδΘξΩ...");
b.D("{playerName}", "mc", "Huh...?\n\nWhat? I don't understand at all.");
b.D("-?????", "unknown", "Φδξψ ΩΘΣλ ψΦξΘδ ΩΣψλδ Θξ ΩΦΣψ δλξΘΩ...");

// Pointing at camera — scene_3
b.bg({ image: "/Image/scenes/Act_2/scene_3.png", overlay: "rgba(0,0,0,0.15)" });
b.M("She pointed.\n\nStraight. Direct.\n\nRight at me.");

// Encrypted speech — ends with "you-" unencrypted
b.D("-?????", "unknown", "Ξψδθφ ΩΣΛ ψΘξΔΩΦδ ΣΛΘξΩψ ΦδΩΞΣΛ... ΨΘδξφ ΩΣΛψ ΔξΘΩφ ΣΛψδΞΘ... ΩΦδΣΛΨξ ΘΩδφΣΛΨξΘ ΩδΦΣΛΨξΘ δΩφΣΛΨ... you-");

// MC wakes up
b.bg({ color: "#000000" });
b.transition(1800, "");


// ── [ HOSPITAL ROOM: WAKING UP ] ──────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.25)" });
b.chars([{
  id: "doctor",
  sprite: "/Image/NPC/doctor/doctor.png",
  position: "left",
  size: "large",
  animation: "fade-in",
  offsetY: -60,
  offsetX: -20
}]);

b.M("Gasping breath.\n\nChest rising and falling irregularly.\n\nThat white ceiling again.\n\nI'm back here.");

b.D("Doctor", "doctor", "Nightmare?\n\nIt's common here.");
b.D("{playerName}", "mc", "Haha... yeah, Doc.\n\nBut it wasn't really that bad. Just... weird.");
b.D("Doctor", "doctor", "Why did you react like that?\n\nYou were sweating, breathing fast — like you were being chased by something.");
b.D("{playerName}", "mc", "Yeah, Doc... I don't know either.\n\nIt feels like — my body knows something, but I don't.");
b.D("Doctor", "doctor", "Interesting.\n\nYou're currently experiencing amnesia. Dreams are often the 'back door' the brain uses to try to access blocked memories.\n\nIt's normal for them to feel intense.");
b.D("{playerName}", "mc", "Hmm... so dreams are like the brain's attempt to remind me of something?");
b.D("Doctor", "doctor", "Something like that.\n\nBut don't force it. Let the process run naturally.\n\nOh right — I actually came with good news.");
b.D("Doctor", "doctor", "Based on the latest observation results, your physical condition has fully stabilized.\n\nWhich means — you can go home today.");
b.D("{playerName}", "mc", "Seriously, Doc?");
b.D("Doctor", "doctor", "Seriously.\n\nBut before you leave, stop by the administration section first — the receptionist in the lobby downstairs. There are some discharge documents you need to read and sign as administrative requirements.");
b.D("{playerName}", "mc", "Okay, got it Doc.");
b.D("Doctor", "doctor", "Good. I hope your memory recovery continues smoothly.\n\nDon't forget to take your medicine, okay — don't skip it.");

b.chars(null);
b.M("...\n\n...\n\nI let out a long sigh.\n\nHome.");


// ── [ HOSPITAL HALLWAY ] ────────────────────────────────────

b.bg({ image: "/Image/GameBG/Hallway.png", overlay: "rgba(0,0,0,0.10)" });
b.M("A long corridor.\n\nAntiseptic smell. AC that's too cold.\n\nMy own footsteps sound louder than usual.");
b.D("{playerName}", "mc", "Hmm...\n\nEh, is this the right way to the receptionist?\n\nHope I don't get lost.");

// Receptionist appears
b.chars([{
  id: "receptionist",
  sprite: "/Image/NPC/doctor/Reception.png",
  position: "right",
  size: "large",
  animation: "fade-in"
}]);
b.D("{playerName}", "mc", "Woah—\n\nExcuse me. The doctor told me to come here to handle my discharge papers, since I've been cleared to leave.");
b.D("Receptionist", "receptionist", "Oh yes, sure. May I have your full name, Sir?");
b.D("{playerName}", "mc", "Oh right — my name is {playerName}.");
b.D("Receptionist", "receptionist", "Alright, {playerName}.\n\nOne moment... *click click*\n\n...found it. Here are your discharge documents, Sir.\n\nPlease read them carefully before signing, okay.");

// Signing — 3 page turn SFX
b.audio({ sfx: "/audio/sfx/page-turn.mp3" });
b.M("*first page...*\n\nReading. Reading.");
b.audio({ sfx: "/audio/sfx/page-turn.mp3" });
b.M("*second page...*\n\nLine by line.");
b.audio({ sfx: "/audio/sfx/page-turn.mp3" });
b.M("*last page.*\n\n— Signature.");

b.D("{playerName}", "mc", "Excuse me — I've signed everything.");
b.D("Receptionist", "receptionist", "Let me check...\n\n......\n\nOkay, everything is complete and correct.\n\n{playerName} is officially cleared to go home today.");
b.D("Receptionist", "receptionist", "Oh right — before you leave, make sure you've collected all your belongings from your room, Sir. Don't leave anything behind.");
b.D("{playerName}", "mc", "Okay, will do. Thank you very much.");
b.D("Receptionist", "receptionist", "You're welcome. I hope you recover soon, Sir.");


// ── [ BACK TO ROOM — RIN APPEARS ] ────────────────────────

b.bg({ color: "#0a0a0a" });
b.transition(1500, "");

b.bg(null);
b.cg("/Image/scenes/Act_2/scene_4.png", "");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.D("{playerName}", "mc", "Rin?!\n\nSince when have you been here?");

b.chars([{
  id: "rin",
  sprite: "/Image/Rinn/eye-close-smile.png",
  position: "right",
  size: "large",
  animation: "fade-in"
}]);
b.D("Rin Fuyutsuki-hime", "rin", "HAHAHAHA since earlier~\n\nJust kidding. Just got here — your room was empty.\n\nI guessed you'd come back here. See, I was right?");
b.D("{playerName}", "mc", "Ehh, you caught me.\n\nSo you really just got here then.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Yep, just now.\n\nWhere were you, anyway?");
b.D("{playerName}", "mc", "Handling my discharge papers downstairs.\n\nThe doctor said I've been cleared to go home today.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/kaget-santay.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "That fast?! You can already go back??");
b.D("{playerName}", "mc", "Yeah. I feel healthy too, honestly.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Do you remember where your house is?");
b.D("{playerName}", "mc", "Hmm... weirdly, I do. How do I put this, Rin — how is that possible?");
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "I'm not really sure, honestly.\n\nBut that's good — at least you didn't forget the way home.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Want to go home together?");

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.45)" });
b.choice("You answer...", [
  { id: "c4_opt1", text: "Sure! With pleasure.", next: "act2_pack_a", affection: { character: "rin", amount: 10 } },
  { id: "c4_opt2", text: "No need to trouble yourself...", next: "act2_pack_b", affection: { character: "rin", amount: -5 } }
]);

// Branch A — agrees to go together
b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Yess~\n\nAlright! Get ready first. Don't forget any of your stuff!", { id: "act2_pack_a", next: "act2_packing" });

// Branch B — refuses
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "...You.", { id: "act2_pack_b", next: "act2_pack_b2" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/hai.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "I'm still going with you. That's not a question.\n\nNow, hurry up and get ready!", { id: "act2_pack_b2", next: "act2_packing" });


// ── [ PACKING ] ───────────────────────────────────────────────

b.bg({ image: "/Image/GameBG/Bg-1.jpg", overlay: "rgba(0,0,0,0.15)" });
b.chars(null);
b.transition(2500, "— Packing up...", { id: "act2_packing" });

b.audio({ sfx: "/audio/sfx/bag.mp3" });
b.M("*Rustle rustle rustle—*\n\nThings go in one by one.");
b.audio({ sfx: "/audio/sfx/zipper.mp3" });
b.M("*Zrrrrt.*\n\nBag closed. All done.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Let's go — I'm all ready.");
b.D("Rin Fuyutsuki-hime", "rin", "Let's go then~");


// ── [ HOSPITAL EXIT DOOR ] ──────────────────────────────

b.bg({ color: "#0a0a0a" });
b.transition(1200, "");

b.bg({ image: "/Image/GameBG/Exit.png", overlay: "rgba(0,0,0,0.10)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", animation: "fade-in" }]);
b.D("{playerName}", "mc", "Rin...\n\nActually, I have so many questions.\n\nBut I want to ask this one first.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "What kind of person am I?");
b.D("Rin Fuyutsuki-hime", "rin", "You?");
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Hmm...\n\nKind. Always there for me.\n\nToo kind, even — sometimes I worry about you myself.");
b.D("Rin Fuyutsuki-hime", "rin", "Patient. Not easily angered.\n\nBasically — you're a total green flag.");
b.D("{playerName}", "mc", "Hey.\n\nYou can be honest with me, you know.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Ehh~?\n\nI am being honest.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Hmm... I hope that's true.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("The evening breeze greeted us as we walked out the door.\n\nThe hospital smell slowly faded — replaced by freer air.\n\nMore alive.");


// ── [ STREETS: TOWARD THE STATION ] ───────────────────────────────

b.bg({ image: "/Image/GameBG/road.jpg", overlay: "rgba(0,0,0,0.10)" });
b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", animation: "fade-in" }]);
b.D("{playerName}", "mc", "Where are we headed first?");
b.chars([{ id: "rin", sprite: "/Image/Rinn/pointing.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "To the station first.\n\nYou're taking the train home, right?");
b.D("{playerName}", "mc", "Oh, right...\n\nIs it far from here?");
b.chars([{ id: "rin", sprite: "/Image/Rinn/mikir.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Hmm... about ten minutes on foot.\n\nNot too far.");
b.D("{playerName}", "mc", "Okay. With you, it won't feel like much.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/eye-close-smile.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "Hee~?\n\nSmooth talker.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("We walked.\n\nNot too fast, not too slow.\n\nLike two people accustomed to walking side by side — even when one of them doesn't remember why.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large" }]);
b.D("{playerName}", "mc", "Rin.\n\nThanks — for walking me home.");
b.chars([{ id: "rin", sprite: "/Image/Rinn/cemberut-nengok.png", position: "right", size: "large" }]);
b.D("Rin Fuyutsuki-hime", "rin", "No need to thank me.\n\nIt's the normal thing to do.");

b.chars([{ id: "rin", sprite: "/Image/Rinn/defal-smile-Photoroom.png", position: "right", size: "large", dim: true }]);
b.M("She looked ahead.\n\nThe wind moved her hair slightly.\n\nI don't know much about myself right now.\n\nBut one thing feels certain —\n\nShe, Rin, is by my side.\n\nAnd somehow — that feels like enough.");


// ── [ ENDING ACT 2 ] ──────────────────────────────────────────

b.bg({ color: "#06020f" });
b.end("帰還 — Homecoming", "act", {
  id: "act2_ending",
  subtitle: "One step out. A thousand more steps to remember who you are.",
  next: "act3_s1"
});

export const ACT_2_SCENES_EN: Scene[] = b.build();
