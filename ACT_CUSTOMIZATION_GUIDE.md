# 🎨 Act Customization Guide

## Overview

Setiap **Act** adalah unit cerita yang independent dan fully customizable. Engine hanya handle:
- Scene loading & progression
- Save/load
- Basic rendering

**Apa yang bisa di-customize di Act**:
- Custom event handlers (ketika scene load/act start)
- Character interactions (klik karakter → trigger event)
- Mini-games (card match, quiz, visual puzzle, etc)
- Custom effects/animations
- Scene-specific logic

---

## 📁 Act Folder Structure

```
components/Acts/
├── BaseActConfig.ts           ← Interface definition
│
├── Act1/
│   ├── index.ts               ← Export config
│   ├── config.ts              ← ActConfig implementation
│   ├── events.ts              ← Event handlers
│   ├── interactions.ts        ← Character click handlers
│   ├── minigames/
│   │   ├── CardMatch.tsx      ← Example: memory game
│   │   ├── DreamSequence.tsx  ← Example: interactive scene
│   │   └── [gameId].tsx
│   └── assets.ts              ← Custom asset list for preload
│
├── Act2/
│   ├── index.ts
│   ├── config.ts
│   ├── events.ts
│   ├── interactions.ts
│   ├── minigames/
│   └── assets.ts
│
└── BaseActConfig.ts
```

---

## 📝 Example: Act 1 Customization

### 1. Define ActConfig (Act1/config.ts)

```typescript
// components/Acts/Act1/config.ts
import { ActConfig } from './BaseActConfig';
import { handleCharacterClick } from './interactions';
import { CardMatch } from './minigames/CardMatch';
import { DreamSequence } from './minigames/DreamSequence';

export const ACT_1_CONFIG: ActConfig = {
  actNumber: 1,
  title: "新しい朝 — A New Morning",
  
  // Called when act starts
  onActStart: async (engine) => {
    console.log("🎬 Act 1 started!");
    // Could initialize act-specific state
  },
  
  // Called when act ends
  onActEnd: async (engine, result) => {
    console.log(`✅ Act 1 ended with: ${result}`);
    // Could clean up act-specific resources
  },
  
  // Called whenever a scene loads
  onSceneLoad: async (sceneId, engine) => {
    console.log(`📖 Loaded scene: ${sceneId}`);
    
    // Example: Trigger background animation on specific scene
    if (sceneId === "act1_s5") {
      engine.triggerEffect("bgShake");
    }
    
    // Example: Play special audio
    if (sceneId === "act1_s3") {
      // Could play intro music
    }
  },
  
  // Character interaction handlers
  characterInteractions: {
    rinn: async (engine) => {
      console.log("💬 Player clicked on Rinn!");
      // Could trigger:
      // - Affection increase
      // - Additional dialogue
      // - Special animation
      engine.updateAffection("rinn", 1);
    },
    
    mainCharacter: async (engine) => {
      console.log("👤 Player clicked on main character");
      // Handle main character interaction
    },
  },
  
  // Registered minigames
  minigames: {
    "card-match": CardMatch,
    "dream-sequence": DreamSequence,
    // Add more minigames here
  },
  
  // Custom effect handlers
  effectHandlers: {
    "bgShake": async (target) => {
      // Custom background shake effect
      // Different from standard screen shake
      target.style.animation = "bgPulse 0.5s ease-in-out";
    },
    
    "screenFlip": async (target) => {
      // Custom flip animation
      target.style.animation = "flip 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    },
  },
};

// Export for engine to load
export default ACT_1_CONFIG;
```

### 2. Export Config (Act1/index.ts)

```typescript
// components/Acts/Act1/index.ts
export { ACT_1_CONFIG as default } from './config';
export { ACT_1_SCENES } from '@/lib/acts/act_1/scenes';
export { ACT_1_ASSETS } from '@/lib/acts/act_1/assets';
```

### 3. Character Interactions (Act1/interactions.ts)

```typescript
// components/Acts/Act1/interactions.ts
import { GameEngineContext } from './BaseActConfig';

export async function handleCharacterClick(
  characterId: string,
  engine: GameEngineContext
) {
  switch (characterId) {
    case "rinn":
      await handleRinnClick(engine);
      break;
    
    case "mainCharacter":
      await handleMainCharacterClick(engine);
      break;
    
    default:
      console.warn(`Unknown character: ${characterId}`);
  }
}

async function handleRinnClick(engine: GameEngineContext) {
  // Get current affection
  const affection = engine.getAffection("rinn");
  
  if (affection > 50) {
    // High affection response
    engine.updateAffection("rinn", 2);
    engine.playAudio("/audio/voice/act_1/rinn_happy.mp3");
  } else {
    // Normal response
    engine.updateAffection("rinn", 1);
    engine.playAudio("/audio/voice/act_1/rinn_neutral.mp3");
  }
  
  // Could also trigger scene jump
  // engine.advanceScene("act1_special_dialogue");
}

async function handleMainCharacterClick(engine: GameEngineContext) {
  // Handle main character click
  // Usually for UI feedback or minor animations
  engine.triggerEffect("playerGlow");
}
```

### 4. Mini-game Example (Act1/minigames/CardMatch.tsx)

```typescript
// components/Acts/Act1/minigames/CardMatch.tsx
"use client";

import { useState, useEffect } from "react";
import { MinigameProps } from "../BaseActConfig";

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

export function CardMatch({ title, onResult, audio }: MinigameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);

  // Initialize game
  useEffect(() => {
    const values = ["🌙", "⭐", "✨", "💫", "🌙", "⭐", "✨", "💫"];
    const shuffled = values
      .sort(() => Math.random() - 0.5)
      .map((value, id) => ({
        id,
        value,
        flipped: false,
        matched: false,
      }));
    setCards(shuffled);
  }, []);

  // Handle card flip
  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || cards[id].matched || flipped.includes(id)) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      // Check if match
      if (cards[newFlipped[0]].value === cards[newFlipped[1]].value) {
        // Match!
        setMatched(matched + 1);
        setCards(
          cards.map((card) =>
            newFlipped.includes(card.id) ? { ...card, matched: true } : card
          )
        );
        setFlipped([]);
        
        // Check if won
        if (matched + 1 === 4) {
          setTimeout(() => onResult("win"), 500);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>{title || "Card Match Game"}</h2>
      <p>Moves: {moves}</p>
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          maxWidth: "400px",
          margin: "40px auto",
        }}
      >
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            style={{
              padding: "40px",
              fontSize: "32px",
              background: card.matched
                ? "rgba(76, 175, 80, 0.5)"
                : flipped.includes(idx)
                ? "rgba(33, 150, 243, 0.7)"
                : "rgba(100, 100, 100, 0.7)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
          >
            {flipped.includes(idx) || card.matched ? card.value : "?"}
          </button>
        ))}
      </div>

      <button
        onClick={() => onResult("quit")}
        style={{
          padding: "10px 20px",
          background: "rgba(244, 67, 54, 0.7)",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Give Up
      </button>
    </div>
  );
}
```

### 5. Event Handlers (Act1/events.ts)

```typescript
// components/Acts/Act1/events.ts
import { GameEngineContext } from './BaseActConfig';

export async function onAct1Start(engine: GameEngineContext) {
  console.log("🎬 Act 1 Starting...");
  
  // Initialize act-specific state
  engine.setActData("intro_played", false);
  
  // Preload common act assets
  await engine.preloadAssets([
    "/Image/GameBG/Bg-1.jpg",
    "/Image/Rinn/*.png",
    "/audio/bgm/act_1.mp3",
  ]);
}

export async function onAct1End(engine: GameEngineContext) {
  console.log("✅ Act 1 Complete!");
  
  // Save act-specific data if needed
  const playersChoices = engine.getChoices();
  console.log("Player made these choices:", playersChoices);
}

export async function onAct1Scene(sceneId: string, engine: GameEngineContext) {
  // Special handling for specific scenes
  if (sceneId === "act1_s1") {
    // Intro scene - play special animation
    await engine.triggerEffect("fadeIn");
  }
  
  if (sceneId === "act1_s10") {
    // Boss scene - dramatic music
    await engine.playAudio("/audio/bgm/act_1_boss.mp3");
  }
}
```

---

## 🎮 How Engine Loads & Uses Act Config

```typescript
// Inside GameEngine/index.tsx

async function loadAct(actNumber: number) {
  // 1. Load act config dynamically
  const ActConfig = await import(`@/components/Acts/Act${actNumber}/config`);
  const actConfig = ActConfig.default as ActConfig;
  
  // 2. Call onActStart hook
  if (actConfig.onActStart) {
    await actConfig.onActStart(engineContext);
  }
  
  // 3. Load first scene
  const firstSceneId = getActFirstScene(actNumber);
  await loadScene(firstSceneId, actConfig);
}

async function loadScene(sceneId: string, actConfig: ActConfig) {
  const scene = SCENE_REGISTRY[sceneId];
  
  // 1. Call onSceneLoad hook
  if (actConfig.onSceneLoad) {
    await actConfig.onSceneLoad(sceneId, engineContext);
  }
  
  // 2. Render scene normally
  renderScene(scene);
}

// When user clicks character:
async function handleCharacterClick(characterId: string) {
  const currentActConfig = getCurrentActConfig();
  
  if (currentActConfig.characterInteractions?.[characterId]) {
    await currentActConfig.characterInteractions[characterId](engineContext);
  }
}

// When minigame scene encountered:
function renderMinigame(scene: MinigameScene) {
  const currentActConfig = getCurrentActConfig();
  const GameComponent = currentActConfig.minigames?.[scene.gameId];
  
  if (!GameComponent) {
    console.error(`Minigame not found: ${scene.gameId}`);
    return null;
  }
  
  return (
    <GameComponent
      title={scene.title}
      onResult={(result) => {
        const nextSceneId = result === "win" 
          ? scene.onWinNext || scene.next 
          : scene.next;
        
        advanceScene(nextSceneId);
      }}
    />
  );
}
```

---

## 🚀 Adding a New Act

1. **Create folder structure:**
   ```bash
   mkdir -p components/Acts/Act3/{minigames}
   touch components/Acts/Act3/{index,config,events,interactions,assets}.ts
   ```

2. **Create config.ts** - Copy from Act1, modify handlers

3. **Create scenes.ts** in lib/acts/act_3/ - Define all scenes

4. **Add minigames** - Create .tsx files in minigames folder

5. **Import in lib/acts.ts:**
   ```typescript
   import { ACT_3_SCENES } from "./acts/act_3/scenes";
   const ALL_SCENES = [...ACT_1_SCENES, ...ACT_2_SCENES, ...ACT_3_SCENES];
   ```

6. **Done!** Engine will auto-load config when starting act 3

---

## 💡 Common Customization Patterns

### Pattern 1: Branch Scene Based on Choice

```typescript
// act1/interactions.ts
characterInteractions: {
  rinn: async (engine) => {
    const choice = engine.getChoice("rinn_first_meeting");
    
    if (choice === "cold") {
      // Player was cold to Rinn
      engine.advanceScene("act1_rinn_sad_branch");
    } else if (choice === "friendly") {
      // Player was friendly
      engine.advanceScene("act1_rinn_happy_branch");
    } else {
      // No prior choice, ask now
      // (This would be a choice scene normally, but can override here)
    }
  }
}
```

### Pattern 2: Trigger Complex Animation Sequence

```typescript
onSceneLoad: async (sceneId, engine) => {
  if (sceneId === "act1_dramatic_moment") {
    // 1. Shake screen
    await engine.triggerEffect("screenShake");
    
    // 2. Wait
    await new Promise(r => setTimeout(r, 500));
    
    // 3. Flash white
    await engine.triggerEffect("flashWhite");
    
    // 4. Fade to black
    await engine.triggerEffect("fadeOut");
    
    // May or may not auto-advance depending on scene config
  }
}
```

### Pattern 3: Mini-game Score Affects Story

```typescript
// act1/minigames/Quiz.tsx
export function Quiz({ onResult }: MinigameProps) {
  const handleResult = (correctCount: number) => {
    // Pass score in custom data
    onResult("win", { score: correctCount });
  };
  
  return ...;
}

// act1/events.ts
onSceneLoad: async (sceneId, engine) => {
  if (sceneId === "act1_quiz_scene") {
    // After quiz minigame:
    const quizData = engine.getLastMinigameResult();
    
    if (quizData.score > 8) {
      // High score - smart player path
      engine.updateAffection("teacher", 3);
    } else {
      // Low score - determined player path
      engine.updateAffection("teacher", 1);
    }
    
    // Could also jump to different next scene
    // engine.advanceScene("...specific_branch...");
  }
}
```

### Pattern 4: Act-Specific Modifiers

```typescript
effectHandlers: {
  "glacialShake": (target) => {
    // Act-specific version of shake
    // Maybe slower, more elegant
    target.style.animation = "glacialShake 1.5s ease-in-out";
  },
  
  "memoryFlash": (target) => {
    // Unique to this act's story theme
    target.style.animation = "memoryFlash 2s ease-out";
  },
},
```

---

## ✅ Summary

**The beauty of this system:**
- 🔒 Engine is locked down & reliable
- 📖 Each Act is a separate module
- ✏️ Easy to add/modify acts
- 🎮 Easy to add minigames
- 🎨 Full creative freedom per act
- 🔌 Clean interfaces = easy debugging

**To add content:**
1. Create Act config
2. Add event handlers
3. Register minigames
4. Add scenes/assets
5. Done! ✨
