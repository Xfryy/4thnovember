const fs = require('fs');

const inputPath = './lib/acts/act_1/scenes.en.ts';
const outputPath = './lib/acts/act_1/scenes.en.converted.ts';

let content = fs.readFileSync(inputPath, 'utf8');

// Extract the array content
const match = content.match(/export const ACT_1_SCENES_EN: Scene\[\] = \[\s*([\s\S]*?)\s*\];/);
if (!match) {
  console.error("Could not find the scenes array.");
  process.exit(1);
}

const rawList = match[1];

// We can actually just evaluate it if we strip types
let toEval = `const arr = [\n${rawList}\n];\nmodule.exports = arr;`;
fs.writeFileSync('./tmp_eval.js', toEval);

try {
  const arr = require('./tmp_eval.js');
  let output = `import { Scene } from "@/types/game";\nimport { StoryBuilder } from "@/lib/StoryBuilder";\n\nconst b = new StoryBuilder(1);\n\n`;
  
  // Track state so we don't emit redundant bg or char updates
  let currentBg = undefined;
  let currentChars = undefined;
  let currentAudio = undefined;

  for (const scene of arr) {
    // 1. Check bg modifications
    if (scene.bg) {
       let bgStr = JSON.stringify(scene.bg);
       if (bgStr !== currentBg) {
           output += `b.bg(${bgStr});\n`;
           currentBg = bgStr;
       }
    } else if (currentBg !== undefined && scene.type !== 'transition') {
       output += `b.bg(null);\n`;
       currentBg = undefined;
    }

    // 2. Check audio modifications
    if (scene.audio) {
       let audioStr = JSON.stringify(scene.audio);
       if (audioStr !== currentAudio) {
           output += `b.audio(${audioStr});\n`;
           currentAudio = audioStr;
       }
    }

    // 3. Check chars modifications
    if (scene.characters) {
       let charStr = JSON.stringify(scene.characters);
       if (charStr !== currentChars) {
           output += `b.chars(${charStr});\n`;
           currentChars = charStr;
       }
    } else if (currentChars !== undefined && scene.type !== 'cg' && scene.type !== 'transition') {
       output += `b.chars(null);\n`;
       currentChars = undefined;
    }

    // 4. Extract specific overrides
    let overrides = { ...scene };

    const idx = arr.indexOf(scene);
    const standardId = `act1_s${idx + 1}`;
    if (scene.id === standardId) {
        delete overrides.id;
    }

    const standardNext = `act1_s${idx + 2}`;
    if (scene.next === standardNext || !scene.next) {
        delete overrides.next;
    }

    delete overrides.sceneNumber;
    delete overrides.act;
    delete overrides.type;
    delete overrides.text;
    delete overrides.bg;
    delete overrides.audio;
    delete overrides.characters;
    delete overrides.speaker;
    delete overrides.speakerId;
    delete overrides.image;
    delete overrides.caption;
    delete overrides.question;
    delete overrides.options;
    delete overrides.endingType;
    delete overrides.title;
    delete overrides.duration;

    const overStr = Object.keys(overrides).length > 0 ? `, ${JSON.stringify(overrides)}` : ``;

    if (scene.type === 'transition') {
        output += `b.transition(${scene.duration || 1000}, ${JSON.stringify(scene.text || "")}${overStr});\n`;
    } else if (scene.type === 'cg') {
        output += `b.cg(${JSON.stringify(scene.image)}, ${JSON.stringify(scene.caption || "")}${overStr});\n`;
    } else if (scene.type === 'monologue') {
        output += `b.M(${JSON.stringify(scene.text || "")}${overStr});\n`;
    } else if (scene.type === 'dialogue') {
        output += `b.D(${JSON.stringify(scene.speaker || "")}, ${JSON.stringify(scene.speakerId)}, ${JSON.stringify(scene.text || "")}${overStr});\n`;
    } else if (scene.type === 'choice') {
        output += `b.choice(${JSON.stringify(scene.question || "")}, ${JSON.stringify(scene.options || [])}${overStr});\n`;
    } else if (scene.type === 'ending') {
        output += `b.end(${JSON.stringify(scene.title || "")}, ${JSON.stringify(scene.endingType || "act")}${overStr});\n`;
    }
    
    output += `\n`;
  }
  
  output += `export const ACT_1_SCENES_EN: Scene[] = b.build();\n`;
  fs.writeFileSync(outputPath, output);
  console.log("Done generating!");
} catch (e) {
  console.error("Eval failed:", e);
}
