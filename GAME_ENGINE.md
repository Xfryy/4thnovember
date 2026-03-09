# 🎮 4th November - Game Engine Documentation

Complete guide to the visual novel game engine backend and data structure.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Scene Types & Structure](#scene-types--structure)
3. [Game State Management](#game-state-management)
4. [Building Story Content](#building-story-content)
5. [Character Management](#character-management)
6. [API Reference](#api-reference)
7. [Development Workflow](#development-workflow)

---

## Architecture Overview

The game engine is built on a **scene-based narrative system** where all content is structured into:

- **Acts** - Major story divisions (Act 1, Act 2, etc.)
- **Scenes** - Individual events within an act (dialogue, choices, transitions)
- **Characters** - NPCs with affection tracking
- **Choices** - Player decisions that affect story/relationships

### Data Flow

```
User Login (Google Auth)
    ↓
Set Character Name
    ↓
Load Game Progress (from Firestore)
    ↓
Render Current Scene
    ↓
Player Makes Choice/Action
    ↓
Update Game State in Store
    ↓
Auto-save to Firestore
    ↓
Load Next Scene
```

### File Structure

```
lib/
├── firebase.ts          # Firebase initialization & functions
├── scenes.ts           # Story content (Acts & Scenes)
└── [future: minigames.ts, characters.ts, effects.ts]

store/
└── gameStore.ts        # Zustand state management

types/
└── game.ts             # TypeScript type definitions

components/
├── StartMenu.tsx       # Main menu UI
└── [future: SceneRenderer.tsx, DialogueBox.tsx, ChoicePanel.tsx]

app/
└── api/
    ├── auth/login/    # Google OAuth
    └── user/          # Profile & progress sync
```

---

## Scene Types & Structure

### 1. Dialogue Scene

**Purpose:** Character speaks to the player with an optional sprite.

**Data Structure:**
```typescript
interface DialogueScene extends BaseScene {
  type: "dialogue";
  character: string;                    // Character name
  characterSprite: string;              // Path to sprite image
  dialogueText: string;                 // What they say
  backgroundColor: string;              // Background color (hex)
  nextScene?: string;                   // Next scene ID
}
```

**Example:**
```typescript
{
  id: "act1_scene3",
  type: "dialogue",
  act: 1,
  sceneNumber: 3,
  character: "Rinn",
  characterSprite: "/Image/Rinn/SchoolFIT/frame_0.png",
  dialogueText: "Ohayo! Kamu akhirnya bangun!",
  backgroundColor: "#e8b4d0",
  nextScene: "act1_scene4",
}
```

### 2. Monologue Scene

**Purpose:** MC's internal thoughts without sprite.

**Data Structure:**
```typescript
interface MonologueScene extends BaseScene {
  type: "monologue";
  dialogueText: string;                 // Internal thought
  backgroundColor: string;              // Background
  nextScene?: string;
}
```

**Example:**
```typescript
{
  id: "act1_scene4",
  type: "monologue",
  act: 1,
  sceneNumber: 4,
  dialogueText: "A girl in a school uniform...\n\nI have no idea who she is.",
  backgroundColor: "#e8b4d0",
  nextScene: "act1_scene5",
}
```

### 3. Choice Scene

**Purpose:** Player picks from 2-4 options. Choices affect affection & story progression.

**Data Structure:**
```typescript
interface ChoiceScene extends BaseScene {
  type: "choice";
  questionText: string;                 // "What do you do?"
  options: ChoiceOption[];              // Array of 2-4 choices
  backgroundColor: string;              // Background
}

interface ChoiceOption {
  id: string;                           // Unique option ID
  text: string;                         // Choice text
  nextScene: string;                    // Scene if chosen
  affection?: {
    character: string;                  // Which character
    amount: number;                     // +10, -5, etc.
  };
}
```

**Example:**
```typescript
{
  id: "act1_scene6",
  type: "choice",
  act: 1,
  sceneNumber: 6,
  questionText: "Bagaimana kamu merespons?",
  backgroundColor: "#e8b4d0",
  options: [
    {
      id: "choice1_opt1",
      text: "Aku tidak ingat. Siapa kamu?",
      nextScene: "act1_scene7_choice1",
      affection: { character: "rinn", amount: -5 },
    },
    {
      id: "choice1_opt2",
      text: "Tentu aku ingat! Rinn!",
      nextScene: "act1_scene7_choice2",
      affection: { character: "rinn", amount: 10 },
    },
    // ... up to 4 options
  ],
}
```

### 4. Transition Scene

**Purpose:** Scene change with narration (time skip, location change).

**Data Structure:**
```typescript
interface TransitionScene extends BaseScene {
  type: "transition";
  narrationText: string;                // "3 Days Later..."
  nextScene: string;                    // Next scene
  duration: number;                     // Display duration (ms)
  backgroundColor: string;              // Background
}
```

**Example:**
```typescript
{
  id: "act1_scene1",
  type: "transition",
  act: 1,
  sceneNumber: 1,
  narrationText: "4th November, Morning...",
  nextScene: "act1_scene2",
  duration: 3000,
  backgroundColor: "#0f0f1e",
}
```

### 5. Ending Scene

**Purpose:** End of act or entire game. Can trigger next act.

**Data Structure:**
```typescript
interface EndingScene extends BaseScene {
  type: "ending";
  endingType: "act" | "game";           // Is this the game end?
  endingText: string;                   // Ending message
  characterSprite?: string;             // Optional final sprite
  nextScene?: string;                   // Can lead to Act 2
}
```

**Example:**
```typescript
{
  id: "act1_scene8",
  type: "ending",
  act: 1,
  sceneNumber: 8,
  endingType: "act",
  characterSprite: "/Image/Rinn/SchoolFIT/frame_1.png",
  endingText: "To be continued...",
  nextScene: "act2_scene1",
}
```

### 6. Minigame Scene (Framework Ready)

**Purpose:** Interactive mini games (coming in future phase).

```typescript
interface MinigameScene extends BaseScene {
  type: "minigame";
  gameName: string;                     // e.g., "memory-match"
  difficulty: "easy" | "normal" | "hard";
  reward?: {
    affection?: Record<string, number>;
    items?: string[];
  };
  nextScene: string;
}
```

---

## Game State Management

### Zustand Store

All game state is handled by `useGameStore()` from Zustand. Located in `store/gameStore.ts`.

**State Properties:**

```typescript
// Auth
user: GameUser | null              // Logged-in user data
isAuthenticated: boolean           // Login status
isLoading: boolean                 // Loading state

// User Data
characterName: string              // Player's chosen name
characterNameSet: boolean          // Has name been set?

// Progress
currentAct: number                 // Current act (1, 2, 3...)
currentScene: number               // Current scene within act
choices: Record<string, any>       // Player's past choices

// Characters
characters: Character[]            // All characters with affection
```

**Available Actions:**

```typescript
const { 
  user, 
  setUser,
  setCharacterName,
  setGameProgress,
  setCharacterAffection,
  resetGameState,
  // ... and more
} = useGameStore();
```

### Usage Examples

**Update game progress:**
```typescript
setGameProgress(1, 5, { choice1: "option2" });
```

**Update character affection:**
```typescript
setCharacterAffection("rinn", 25);  // Set to 25
```

**Get current state:**
```typescript
const { characterName, currentAct, currentScene } = useGameStore();
```

---

## Building Story Content

### Step 1: Create a New Scene

Each scene needs a unique ID following the pattern: `act{N}_scene{N}` or `act{N}_scene{N}_choice{choice_id}`.

```typescript
// In lib/scenes.ts
const myScene: DialogueScene = {
  id: "act1_scene3",
  type: "dialogue",
  act: 1,
  sceneNumber: 3,
  character: "Rinn",
  characterSprite: "/Image/Rinn/SchoolFIT/frame_0.png",
  dialogueText: "Hello! How are you?",
  backgroundColor: "#e8b4d0",
  nextScene: "act1_scene4",
};
```

### Step 2: Add Scenes to Act Array

```typescript
export const ACT_1_SCENES: Scene[] = [
  transitionScene1,
  monologueScene1,
  dialogueScene1,
  choiceScene1,
  // ... more scenes
  endingScene,
];
```

### Step 3: Create Scene Registry

```typescript
export const SCENE_REGISTRY: Record<string, Scene> = 
  ACT_1_SCENES.reduce((acc, scene) => {
    acc[scene.id] = scene;
    return acc;
  }, {} as Record<string, Scene>);
```

### Step 4: Export Act

```typescript
export const ACT_1: Act = {
  actNumber: 1,
  title: "新しい朝 (A New Morning)",
  scenes: ACT_1_SCENES,
};
```

### Example: Complete Story Arc

File: `lib/scenes.ts`

```typescript
// 1. Create scenes
const openingTransition: TransitionScene = {
  id: "act1_scene1",
  type: "transition",
  act: 1,
  sceneNumber: 1,
  narrationText: "Morning of November 4th...",
  nextScene: "act1_scene2",
  duration: 3000,
  backgroundColor: "#0f0f1e",
};

const wakeUpMonologue: MonologueScene = {
  id: "act1_scene2",
  type: "monologue",
  act: 1,
  sceneNumber: 2,
  dialogueText: "Where am I?",
  backgroundColor: "#2a2a4e",
  nextScene: "act1_scene3",
};

const rinnDialog: DialogueScene = {
  id: "act1_scene3",
  type: "dialogue",
  act: 1,
  sceneNumber: 3,
  character: "Rinn",
  characterSprite: "/Image/Rinn/SchoolFIT/frame_0.png",
  dialogueText: "You're finally awake!",
  backgroundColor: "#e8b4d0",
  nextScene: "act1_scene4",
};

// 2. Combine into array
export const ACT_1_SCENES: Scene[] = [
  openingTransition,
  wakeUpMonologue,
  rinnDialog,
  // ... more scenes
];

// 3. Create registry
export const SCENE_REGISTRY = ACT_1_SCENES.reduce(
  (acc, scene) => { acc[scene.id] = scene; return acc; },
  {} as Record<string, Scene>
);

// 4. Export Act
export const ACT_1: Act = {
  actNumber: 1,
  title: "新しい朝",
  scenes: ACT_1_SCENES,
};
```

---

## Character Management

### Adding Characters

Characters are defined in `store/gameStore.ts`:

```typescript
characters: [
  {
    id: "rinn",
    name: "Rinn",
    spritesPath: "/Image/Rinn",
    affection: 0,  // Starts at 0
  },
  // Add more characters here later
]
```

### Character Sprites Organization

Organize character assets like this:

```
Assets/Image/
├── GameBG/
│   ├── classroom.png
│   ├── school_hallway.png
│   └── ...
└── Rinn/
    └── SchoolFIT/
        ├── frame_0.png   # Neutral
        ├── frame_1.png   # Happy
        ├── frame_2.png   # Sad
        └── ...
```

### Using Multiple Character Poses

In dialogue scenes, change the `characterSprite` path:

```typescript
// Happy expression
{
  character: "Rinn",
  characterSprite: "/Image/Rinn/SchoolFIT/frame_1.png",
  dialogueText: "I'm so happy to see you!",
}

// Sad expression
{
  character: "Rinn",
  characterSprite: "/Image/Rinn/SchoolFIT/frame_2.png",
  dialogueText: "Why would you do that...",
}
```

### Affection System

Affection ranges from 0-100:

```typescript
// In choice options
affection: {
  character: "rinn",
  amount: 10,  // +10 affection
}

// Negative choices
affection: {
  character: "rinn",
  amount: -5,  // -5 affection
}
```

Affection affects:
- Character reactions
- Available choices (locked by affection level)
- Multiple endings per character
- Special events/scenes

---

## API Reference

### Server-Side: Firebase Functions

All in `lib/firebase.ts`

#### signInWithGoogle()
```typescript
const user = await signInWithGoogle();
// Returns: Firebase User object
// Creates user document in Firestore if new
```

#### updateCharacterName(uid, characterName)
```typescript
await updateCharacterName("user123", "Alice");
// Saves character name to Firestore
```

#### saveGameProgress(uid, act, scene, choices)
```typescript
await saveGameProgress("user123", 1, 5, {
  choice1: "option2",
  choice2: "option1",
});
// Auto-called after each scene
```

#### getGameProgress(uid)
```typescript
const progress = await getGameProgress("user123");
// Returns: { currentAct, currentScene, choices }
```

### Client-Side: Hooks

#### useGameState()
```typescript
import { useGameState } from "@/hooks/useGameState";

const gameState = useGameState();
// Access: user, characterName, currentAct, currentScene, etc.
// Update: setGameProgress(), setCharacterAffection(), etc.
```

### REST API Endpoints

#### POST /api/auth/login
```
Body: { token: "<firebase-id-token>" }
Response: { success: true }
```

#### GET /api/user
```
Headers: Authorization: Bearer <token>
Response: { user: { uid, email, characterName, ... } }
```

#### POST /api/user
```
Headers: Authorization: Bearer <token>
Body: { characterName: "New Name" }
Response: { success: true }
```

---

## Development Workflow

### Phase 1 ✅ (COMPLETE)
- [x] Start Menu UI
- [x] Google Authentication
- [x] Character Name Input
- [x] User Profile Saving
- [x] Game State Management
- [x] Type Definitions

### Phase 2 (Next)
- [ ] Scene Renderer Component
- [ ] Dialogue Box UI
- [ ] Choice Button System
- [ ] Scene Navigation Logic
- [ ] Progress Auto-save Integration

### Phase 3
- [ ] Monologue Rendering
- [ ] Transition Effects
- [ ] Character Sprite Management
- [ ] Affection Display
- [ ] Ending Scenes

### Phase 4
- [ ] Minigame Framework
- [ ] Minigame Examples
- [ ] Save/Load System UI
- [ ] Settings Menu
- [ ] Advanced Effects

### To Add Scenes:

1. **Edit** `lib/scenes.ts`
2. **Create** new scene objects (dialogue, choice, etc.)
3. **Add** to `ACT_N_SCENES` array
4. **Update** `SCENE_REGISTRY`
5. **Test** by navigating to that scene

### To Create Next Act:

1. **Create** `ACT_2_SCENES` array
2. **Create** `SCENE_REGISTRY_ACT_2`
3. **Export** `ACT_2`
4. **Update** act ending to point to `act2_scene1`
5. **Test** progression

### Testing Scenes

```typescript
// Check if scene exists
console.log(SCENE_REGISTRY["act1_scene3"]);

// Mock progression
setGameProgress(1, 3, {});

// Check character affection
console.log(characters.find(c => c.id === "rinn").affection);
```

---

## Best Practices

### ✅ DO

- Use consistent scene ID naming
- Add descriptions in comments
- Keep dialogue concise
- Test choice branching
- Use meaningful character names
- Organize sprites by character/outfit

### ❌ DON'T

- Leave `nextScene` undefined (except endings)
- Mix Japanese/English inconsistently
- Use extremely long dialogue text
- Create circular scene references
- Hard-code paths without  prefix

---

## Performance Tips

1. **Scene Registry** - Always export SCENE_REGISTRY for O(1) lookup
2. **Sprite Optimization** - Compress images (png > 500KB should be optimized)
3. **State Updates** - Use Zustand for efficient state updates
4. **Lazy Load** - Load acts only when needed (future optimization)

---

## Troubleshooting

### Scene doesn't load
- Check scene ID in `nextScene` matches actual scene ID
- Verify scene is in `ACT_N_SCENES` array
- Make sure it's in `SCENE_REGISTRY`

### Character affection not updating
- Check choice has `affection` field
- Verify character ID matches store character
- Call `setCharacterAffection()` explicitly if needed

### Sprite not showing
- Verify image path is correct
- Check image file exists in `/Image/`
- Use relative paths starting with `/`

---

## Future Enhancements

- [ ] Dynamic scene loading from CMS
- [ ] Voice acting system
- [ ] Background music management
- [ ] Advanced particle effects
- [ ] Multiplayer/branching story paths
- [ ] Steam integration
- [ ] Mobile app version

---

**Last Updated:** November 4, 2024  
**Version:** 1.0 (Phase 1 Complete)
