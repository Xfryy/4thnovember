# 🎮 Game Engine Architecture Prompt

**Objective**: Build a clean, modular visual novel game engine that separates **runtime logic** from **content customization**. The engine handles only core functionality (launch, save, run), while each Act is customizable independently.

---

## ✨ Design Principles

1. **Separation**: Engine ≠ Content
   - Engine: Generic scene rendering, navigation, save/load
   - Content (Acts): Custom events, interactions, minigames

2. **Extensibility**: Easy to add per-act logic
   - Built-in hooks for act-specific handlers
   - Event system for interactive elements
   - Minigame launcher abstraction

3. **Type Safety**: Full TypeScript support
   - All scene operations type-checked
   - Props interfaces for customization

4. **Performance**: Minimal re-renders
   - Scene-level updates only
   - Asset preloading via existing Preloader
   - Efficient state management (Zustand already good)

---

## 📋 Core Engine Responsibilities

### 1. Scene Progression
- Load scene from SCENE_REGISTRY
- Render appropriate component based on scene.type
- Handle navigation (next scene, choices)
- Trigger auto-save at intervals
- Update UI (toolbar indicator, etc)

### 2. Save/Load Integration
- Execute `useSaveState` hooks (already built)
- Track choices made
- Restore act/scene on load
- Restore character affection

### 3. Input Handling
- Click/touch detection
- Keyboard shortcuts (Space/Enter)
- Dialog advancement
- Choice selection

### 4. Effect System
- Apply screen shake (if scene.effect.shake)
- Apply flash effects
- Character enter/exit animations
- Background filtering/overlay

---

## 🏗️ Proposed Folder Structure

```
components/GameEngine/
├── index.tsx                    ← Main game container (scene loader + navigation)
├── components/
│   ├── SceneRenderer.tsx        ← Routes to specific scene renderers
│   ├── DialogueBox.tsx          ✅ (keep existing)
│   ├── Gametoolbar.tsx          ✅ (keep existing)
│   ├── Preloader.tsx            ✅ (keep existing)
│   ├── scenes/
│   │   ├── DialogueSceneView.tsx     ← Render dialogue scene
│   │   ├── MonologueSceneView.tsx    ← Render monologue
│   │   ├── ChoiceSceneView.tsx       ← Render choice UI
│   │   ├── TransitionSceneView.tsx   ← Loading screen
│   │   ├── CgSceneView.tsx           ← Full-screen CG
│   │   ├── EndingSceneView.tsx       ← Ending credits
│   │   └── MinigameSceneView.tsx     ← Launch minigame
│   ├── effects/
│   │   ├── ScreenShake.tsx      ← Screen shake effect
│   │   ├── FlashEffect.tsx      ← Flash overlay
│   │   └── Transitions.tsx      ← Fade/slide transitions
│   ├── Usesavestate.ts          ✅ (keep existing)
│   ├── Usescenetransition.ts    ← Scene transition hooks
│   └── useEffects.ts            ← NEW: Effect application hooks
├── hooks/
│   ├── useSceneLoader.ts        ← Load & validate scenes
│   ├── useCharacterHandler.ts   ← Character interaction logic
│   └── useEventDispatcher.ts    ← Event/action system
└── utils/
    ├── effectApplier.ts         ← Apply effects to DOM
    └── animationUtils.ts        ← Character animation helpers

components/Acts/                 ← Per-act customization
├── Act1/
│   ├── index.ts                 ← Export act config
│   ├── events.ts                ← Custom event handlers
│   ├── interactions.ts          ← Clickable element handlers
│   ├── minigames/
│   │   ├── CardMatch.tsx        ← Example minigame
│   │   └── [gameId].tsx
│   └── customScenes/             ← Override scene renderers if needed
├── Act2/
│   └── [same structure]
└── BaseActConfig.ts             ← Config interface for acts
```

---

## 🔄 Game Engine Flow

```
┌─────────────────────────────────────────┐
│    GameEngine (Main Container)          │
│                                         │
│  • Load scene from SCENE_REGISTRY      │
│  • Initialize save state                │
│  • Bind event listeners                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│      SceneRenderer (Router)              │
│                                         │
│  scenes.type === 'dialogue'             │
│       ↓ render DialogueSceneView        │
│  scenes.type === 'choice'               │
│       ↓ render ChoiceSceneView          │
│  scenes.type === 'minigame'             │
│       ↓ render MinigameSceneView        │
│  ...etc                                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│     Specific Scene Component             │
│                                         │
│  • Render characters + backgrounds      │
│  • Apply effects (shake, flash)         │
│  • Apply animations (enter, fade)       │
│  • Handle interactions                  │
│  • Dispatch scene  completion on        │
│    advance/choice/minigame result       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Scene Event (onSceneAdvance)          │
│                                         │
│  • Save state (choices, affection)     │
│  • Load next scene                      │
│  • Trigger act hooks if present         │
│  • Loop back to SceneRenderer           │
└─────────────────────────────────────────┘
```

---

## 📦 Key Interfaces & Types

### ActConfig (Per-act customization)
```typescript
export interface ActConfig {
  actNumber: number;
  title: string;
  
  // Custom event handlers
  onActStart?: (engine: GameEngineContext) => void;
  onActEnd?: (result: "complete" | "ending" | string) => void;
  
  // Scene-specific event handler
  onSceneLoad?: (sceneId: string, context: GameEngineContext) => void;
  
  // Custom character interactions
  characterInteractions?: {
    [characterId: string]: (context: GameEngineContext) => void;
  };
  
  // Registered minigames
  minigames?: {
    [gameId: string]: React.ComponentType<MinigameProps>;
  };
  
  // Custom effect handlers
  effectHandlers?: {
    [effectType: string]: (target: HTMLElement) => void | Promise<void>;
  };
}
```

### GameEngineContext (Available to act handlers)
```typescript
export interface GameEngineContext {
  // Current state
  currentScene: Scene;
  currentAct: number;
  
  // Actions
  advanceScene: (sceneId: string, choices?: {choiceId: string; sceneId: string}) => Promise<void>;
  triggerEffect: (effectName: string, target?: HTMLElement) => Promise<void>;
  updateAffection: (characterId: string, delta: number) => void;
  
  // Utilities
  loadAsset: (assetPath: string) => Promise<string>;
  playAudio: (audioPath: string) => Promise<void>;
}
```

### MinigameProps
```typescript
export interface MinigameProps {
  title?: string;
  description?: string;
  background?: string;
  audio?: { bgm?: string; sfx?: string };
  onResult: (result: "win" | "lose" | "quit") => void;
  playerData?: Record<string, any>; // Access game state from minigame
}
```

---

## 🎯 Implementation Checklist

### Phase 1: Core Engine (Priority)
- [ ] `GameEngine/index.tsx` - Main game loop & scene loader
- [ ] `SceneRenderer.tsx` - Scene type router
- [ ] `DialogueSceneView.tsx` - Render dialogue with characters
- [ ] `ChoiceSceneView.tsx` - Render choice UI
- [ ] `useSceneLoader.ts` - Load & validate scenes safely
- [ ] `useEffects.ts` - Screen shake, flash, animations

### Phase 2: Scene Types (Per Type)
- [ ] `MonologueSceneView.tsx`
- [ ] `TransitionSceneView.tsx` (with auto-advance timing)
- [ ] `CgSceneView.tsx`
- [ ] `EndingSceneView.tsx`
- [ ] `MinigameSceneView.tsx` (launcher only, act-specific minigames in Act folder)

### Phase 3: Extensibility Hooks
- [ ] Act config loader & validator
- [ ] Event dispatcher for act-specific handlers
- [ ] Character interaction system
- [ ] Custom effect registry

### Phase 4: Content Structure
- [ ] Create `components/Acts/BaseActConfig.ts`
- [ ] Create `components/Acts/Act1/` structure
- [ ] Create example minigame (CardMatch.tsx)
- [ ] Create example event handler

### Phase 5: Polish
- [ ] Error handling & fallbacks
- [ ] Loading states
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Performance optimization

---

## 📌 Key Technical Notes

1. **Scene Advancement**
   - Always go through `useSaveState.onSceneAdvance()` to update state
   - This ensures choices & affection are tracked

2. **Character Positioning**
   - Use CSS Grid or flexbox for positioning
   - Support position types: far-left, left, center-left, center, center-right, right, far-right
   - Character size multiplier: small(0.6x), medium(0.8x), large(1x), xl(1.3x), full(screen-width)

3. **Effects System**
   - `effect.shake` → trigger screen shake animation
   - `effect.flash` → apply color overlay + fade out
   - Supply effects via hooks, not in scene definition (for run-time flexibility)

4. **Asset Loading**
   - Preloader already handles batching
   - Use existing assetLoader.ts for runtime loads
   - Cache strategy: Session-level (next-frame), Act-level, Global

5. **Audio Management**
   - BGM crossfade (fade out old → fade in new)
   - Voice playback should not cut off BGM
   - SFX layering supported
   - Use existing Audiomanager.ts

6. **Minigame Handoff**
   - MinigameSceneView renders act's minigame component
   - Pass `onResult` callback (win/lose/quit)
   - onResult triggers scene branch (onWinNext vs next)
   - Minigame components live in components/Acts/ActN/minigames/

---

## 💡 Future Enhancements (Roadmap)

- [ ] Dialogue history system
- [ ] Fast-forward/skip support
- [ ] Affection meter UI
- [ ] Gallery/CG unlocks
- [ ] Character route tracking
- [ ] Achievement system
- [ ] Mobile gestures (swipe next, etc)
- [ ] Keyboard config/remapping
- [ ] Mod support (external save format)

---

## 🚀 Success Criteria

✅ Engine runs any scene from SCENE_REGISTRY without crashing
✅ Act-specific events fire at correct times
✅ Minigames launch & return results properly
✅ Effects (shake, flash) apply smoothly
✅ Save/load preserves all choices & state
✅ Adding new act requires only new file in components/Acts/
✅ Customizing act via ActConfig is intuitive
✅ No console errors related to scene rendering
✅ Typescript full type coverage

---

**Start building!** 🎮
