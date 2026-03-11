# 4th November - Project Architecture Analysis

## 📊 Current State Overview

### ✅ What's Working Well
- **Save System** - Robust Firestore integration dengan auto-save & manual save slots
- **Auth System** - Google OAuth with player character name customization
- **Scene Definition System** - Well-typed scene structure dengan multiple scene types
- **Scene Registry** - O(1) lookup untuk scenes dengan proper act/scene organization
- **UI Components** - DialogueBox, GameToolbar, Settings modal sudah ada
- **State Management** - Zustand store untuk global game state
- **Audio Support** - BGM, voice, SFX configuration per scene

### ⚠️ Current Issues & Gaps

1. **Empty Core Components**
   - `GameEngine/index.tsx` - EMPTY
   - `SceneRenderer.tsx` - EMPTY
   - `Acts/` folder - EMPTY (meant for content customization)

2. **No Scene Rendering Logic**
   - Tidak ada implementasi yang render different scene types
   - Tidak ada character positioning/animation system
   - Tidak ada background rendering logic
   - Tidak ada effect/shake system

3. **No Effect System**
   - Screen shake effect tidak diimplementasikan
   - Flash effects tidak ada
   - Character animations tidak ada

4. **No Interactivity**
   - Clickable characters tidak bisa
   - Event system tidak ada
   - Minigame integration tidak ada (structure ada tapi kosong)

## 📁 Current File Structure

```
lib/acts/
├── acts.ts              ← Scene registry & utilities ✅
├── act_1/
│   ├── index.ts         ← Act metadata ✅
│   ├── scenes.ts        ← Scene definitions ✅
│   └── assets.ts        ← Asset manifest (partially)
└── act_2/
    ├── index.ts
    ├── scenes.ts
    └── assets.ts

components/
├── GameEngine/
│   ├── index.tsx        ← EMPTY - should handle main game loop
│   └── components/
│       ├── DialogueBox.tsx          ✅ Working
│       ├── GameToolbar.tsx          ✅ Working
│       ├── Preloader.tsx            ✅ Working
│       ├── SceneRenderer.tsx        ← EMPTY - should render scenes
│       ├── Usesavestate.ts          ✅ Working
│       └── Usescenetransition.ts    ← Need to check
├── Acts/                            ← EMPTY - should contain act-specific logic
├── StartMenu/                       ✅ Working
└── Event/                           ← Unknown

store/
├── gameStore.ts         ✅ Good Zustand store
└── Settingsstore.ts     ✅ Working
```

## 🎮 Scene Type Support

Current types handled:
- ✅ **dialogue** - Speaker + text + character sprite
- ✅ **monologue** - Inner thoughts
- ✅ **choice** - Decision branches
- ✅ **transition** - Loading screens with timing
- ✅ **cg** - Full-screen images
- ✅ **ending** - Act/ending screens
- ✅ **minigame** - Mini-game launcher (structure exists, no implementation)

## 💾 Save System (Well-Implemented)

- Auto-save every 3 scenes
- Manual save slots (numbered)
- Save preview (context-aware text + character sprite)
- Play time tracking
- Affection/choice tracking
- Session persistence

## 🔧 Issues to Address

1. **Game Flow Architecture** - No clear state machine for scene progression
2. **Rendering Pipeline** - No component to actually render different scene types
3. **Effect System** - No shake, flash, fade implementations
4. **Character System** - No click detection, positioning needs work
5. **Event System** - No custom event/action handlers
6. **Minigame Integration** - Structure exists but needs implementation
7. **Animation System** - Character enter/exit animations defined in types but not rendered

## 🎯 Recommended Architecture

### Separation of Concerns:
1. **Game Engine** (Core Runtime)
   - Scene loading & progression
   - Save/load execution
   - Input handling
   - State management orchestration

2. **Scene Renderer** (Presentation)
   - Render scene based on type
   - Handle character positioning/display
   - Background rendering
   - Effect application

3. **Effect System** (Visual Effects)
   - Screen shake
   - Flash effects
   - Character animations
   - Transitions

4. **Acts Content** (Customizable)
   - Per-act event handlers
   - Custom components/minigames
   - Act-specific logic
   - Interactive elements

5. **Event System** (Interactivity)
   - Clickable character handlers
   - Custom action buttons
   - Scene-specific triggers

---

**Next Step**: Build modular, well-typed Game Engine that only handles core flow, with easy customization hooks for content creators (Acts folder).
