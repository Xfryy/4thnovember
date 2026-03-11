# Database Schema - 4th November VN Engine

## Overview
This document defines the Firestore database structure for the 4th November visual novel engine. The schema supports:
- ✅ User profiles with playtime tracking 
- ✅ 10-slot manual save system + auto-save
- ✅ Scene screenshots for game saves
- ✅ Character affection system
- ✅ Player choice history
- ✅ Settings persistence
- ✅ Game progress tracking

---

## Collection: `users/{uid}`
**Purpose:** User profile and statistics

**Document Structure:**
```typescript
{
  uid: string;                    // Firebase Auth UID (Document ID)
  email: string;                  // User email
  characterName: string;          // Player-chosen name
  createdAt: number;              // Account creation timestamp (ms)
  lastPlayed: number;             // Last session timestamp (ms)
  totalPlayTime: number;          // Total playtime in seconds (sum of all save slots)
  totalPlays: number;             // Number of manual saves + auto-saves
}
```

**Example:**
```json
{
  "uid": "user_abc123",
  "email": "player@example.com",
  "characterName": "Rinn",
  "createdAt": 1700000000000,
  "lastPlayed": 1700050000000,
  "totalPlayTime": 7200,          // 2 hours
  "totalPlays": 5
}
```

**Relationships:** 
- 1:N → `save_slots/{uid_s*}` (owns all save slots)
- 1:1 → `settings/{uid}` (owns settings doc)

**Queries:**
- Get profile: `users/{uid}`
- List users: `users WHERE createdAt >= X` (for analytics)

---

## Collection: `save_slots/{docId}`
**Purpose:** Store 10-slot save system (1 auto + 9 manual saves per player)

**Document ID Format:** `{uid}_s{slotId}`
- Example: `user_abc123_s0` (auto-save slot)
- Example: `user_abc123_s3` (manual save slot 3)

**Document Structure:**
```typescript
{
  // Identifiers
  slotId: number;                 // 0=auto, 1-9=manual
  uid: string;                    // Foreign key → users/{uid}
  
  // Game State
  currentAct: number;             // Act number (e.g., 1, 2, 3)
  currentSceneId: string;         // Scene ID to resume at (e.g., "act1_scene5")
  choices: Record<string, string>;// Player choices: {choiceId: selectedOptionId}
  affection: Record<string, number>; // Character affection: {characterId: points}
  
  // Metadata
  playTimeSeconds: number;        // Total playtime in this save (seconds)
  lastSaved: number;              // Last save timestamp (ms)
  
  // Preview Data (for Save/Load UI)
  previewImage?: string;          // Screenshot as base64 data URL OR character sprite URL
  previewText?: string;           // First ~80 characters of dialogue
  sceneLabel?: string;            // Human-readable label (e.g., "Act 1 · Scene 5")
  
  // Soft Delete Flag
  cleared?: boolean;              // If true, treat as empty slot (skip in UI)
}
```

**Example:**
```json
{
  "slotId": 0,
  "uid": "user_abc123",
  "currentAct": 2,
  "currentSceneId": "act2_scene7",
  "choices": {
    "choice_1": "option_a",
    "choice_2": "option_b",
    "choice_5": "option_c"
  },
  "affection": {
    "character_rinn": 45,
    "character_lucas": 20,
    "character_vera": 35
  },
  "playTimeSeconds": 2850,
  "lastSaved": 1700050000000,
  "previewImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "previewText": "I've been thinking about what happened yesterday...",
  "sceneLabel": "Act 2 · Scene 7"
}
```

**Relationships:**
- Foreign Key: `uid` → `users/{uid}`

**Queries:**
- Auto-save: `save_slots/{uid}_s0`
- Manual saves: `save_slots` WHERE `docId.contains({uid}_s)`
- All slots for user: Fetch docs with pattern `{uid}_s*`

**Lifecycle:**
- **Slot 0 (Auto-save):** Updated every scene advance
- **Slots 1-9 (Manual):** Updated on user save
- **Clearing:** Soft-delete with `cleared: true` flag (doc remains for history)

---

## Collection: `settings/{uid}`
**Purpose:** Store per-user game settings (persistent across sessions)

**Document Structure:**
```typescript
{
  uid: string;                    // Firebase Auth UID (Document ID)
  masterVolume: number;           // 0-100
  bgmVolume: number;              // 0-100
  sfxVolume: number;              // 0-100
  voiceVolume: number;            // 0-100
  brightness: number;             // 0-100 (or -50 to +50)
  language: "id" | "en";          // Interface language
  textSpeed: number;              // 10-100 (10=slow, 100=fast)
  lastModified: number;           // Last modification timestamp (ms)
}
```

**Example:**
```json
{
  "uid": "user_abc123",
  "masterVolume": 80,
  "bgmVolume": 70,
  "sfxVolume": 75,
  "voiceVolume": 80,
  "brightness": 100,
  "language": "id",
  "textSpeed": 50,
  "lastModified": 1700050000000
}
```

**Relationships:**
- Foreign Key: `uid` → `users/{uid}`

**Queries:**
- Get settings: `settings/{uid}`

**Sync Behavior:**
- **Local First:** Settings cached in Zustand + localStorage
- **Firestore Backup:** Synced on app init, on save, and on logout
- **Conflict Resolution:** Firestore version preferred (server-of-truth)

---

## Collection: `progress/{uid}` (DEPRECATED - Consider Removing)
**Status:** OPTIONAL - Currently stored as single doc per user. Consider consolidating into `save_slots`.

**Document Structure:**
```typescript
{
  uid: string;                    // Firebase Auth UID (Document ID)
  currentAct: number;
  currentScene: number;
  choices: Record<string, any>;
  lastUpdated: number;
}
```

**Migration Plan:**
- KEEP if you want to track "current game state" separately from save slots
- REMOVE if save_slots is source of truth (recommended)
- If kept, always sync with auto-save (slot 0)

---

## Data Relationships Diagram

```
┌──────────────────────┐
│   users/{uid}        │  (1 user)
│  ─────────────────   │
│  - uid (PK)         │
│  - email            │
│  - characterName    │
│  - createdAt        │
│  - lastPlayed       │
│  - totalPlayTime    │◄─────────────┐
│  - totalPlays       │◄─────────────┤ (Aggregated from save_slots)
└──────────────────────┘              │
         │ 1:1                        │
         ├───────────────────────┐    │
         │                       │    │
    1:N  │                   1:1 │    │
         │                       │    │
         v                       v    │
┌──────────────────────┐  ┌──────────────────────┐
│ save_slots/{docId}   │  │  settings/{uid}      │
│ (10 per user)        │  │  ─────────────────   │
│ ─────────────────    │  │  - masterVolume     │
│ - slotId (0-9)       │  │  - bgmVolume        │
│ - uid (FK→users)     │  │  - sfxVolume        │
│ - currentAct         │  │  - voiceVolume      │
│ - currentSceneId     │  │  - brightness       │
│ - choices            │  │  - language         │
│ - affection          │  │  - textSpeed        │
│ - playTimeSeconds    │  │  - lastModified     │
│ - previewImage ✨    │  └──────────────────────┘
│ - previewText        │
│ - sceneLabel         │
│ - lastSaved          │
│ - cleared?           │
└──────────────────────┘
          ▲
          │
       ✨ 📸 Screenshot (base64 JPEG)
          │ Size limit: ~200KB
          │ Captured via: html2canvas
```

---

## Schema Version Control

**Current Version:** 1.0  
**Last Updated:** [Current Date]

**Version History:**
- **v1.0:** Initial schema with 10-slot saves, screenshots, settings, playtime tracking
- Feature: Auto-sync playtime to user profile
- Feature: Base64 screenshots in save slots
- Feature: Firestore settings persistence

---

## Migration Notes

### From Old Schema (if applicable):
If migrating from a previous structure, follow this order:

1. Create new `settings/{uid}` for existing users (copy from localStorage)
2. Backfill `totalPlayTime` and `totalPlays` in `users/*` from existing saves
3. Add `previewImage` field to existing save_slots (can be null initially)
4. Test save/load with new structure before removing old collections

### Adding Screenshots to Existing Saves:
```javascript
// For each save slot, either:
// 1. Leave previewImage empty (user will see it on next save)
// 2. Manually capture and upload sprite URL
// 3. Display placeholder image in meantime
```

---

## Firestore Security Rules

**Recommended Rules:**
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Users can read/write their own saves
    match /save_slots/{document=**} {
      allow read, write: if request.auth.uid == 
        resource.data.uid || 
        request.resource.data.uid;
    }
    
    // Users can read/write their own settings
    match /settings/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Optional: progress collection
    match /progress/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

---

## Indexing Strategy

**Recommended Composite Indexes:**

1. **Save Slots by User:**
   - Collection: `save_slots`
   - Fields: `uid` (Asc), `lastSaved` (Desc)
   - Use: List all saves for user, sorted by recent

2. **Users by PlayTime (Analytics):**
   - Collection: `users`
   - Fields: `totalPlayTime` (Desc)
   - Use: Leaderboard/analytics

### Firestore Will Auto-Create:
- Single-field indexes for common queries
- Always check Firestore Console for suggested indexes

---

## Example Queries

### JavaScript/TypeScript

```typescript
// Get user profile
const userRef = doc(db, "users", uid);
const userSnap = await getDoc(userRef);

// Get all save slots for user
const slots = await Promise.all(
  Array.from({length: 10}, (_, i) => 
    getDoc(doc(db, "save_slots", `${uid}_s${i}`))
  )
);

// Get user settings
const settingsRef = doc(db, "settings", uid);
const settingsSnap = await getDoc(settingsRef);

// Save to slot
await setDoc(doc(db, "save_slots", `${uid}_s3`), {
  slotId: 3,
  uid,
  currentAct: 1,
  currentSceneId: "act1_scene5",
  choices: {...},
  affection: {...},
  playTimeSeconds: 1234,
  lastSaved: Date.now(),
  previewImage: "data:image/jpeg;...",
  previewText: "...",
  sceneLabel: "Act 1 · Scene 5"
});
```

---

## Performance Considerations

### ✅ Optimized
- Playtime aggregation: Sum in code (not via Firestore function)
- Settings: Cache locally + Firestore = best of both worlds
- Save slots: 10 docs max per user (fetch in parallel)

### ⚠️ To Monitor
- Screenshot size: Keep base64 ≤ 200KB
- Writes per session: Auto-save debounced (3s intervals)
- Reads on app init: Fetch all 10 slots in parallel

### ❌ Avoid
- Real-time listener on all save slots (use one-time reads)
- Storing full screenshot objects (use base64 strings instead)
- Transactions across multiple users' docs

---

## Checklist for Implementation

- [ ] Update `firebase.ts` with schema documentation
- [ ] Add `settings` collection support
- [ ] Consolidate or remove `progress` collection
- [ ] Verify all writes include required fields
- [ ] Add Firestore index definitions
- [ ] Test cross-browser settings sync
- [ ] Document any breaking schema changes
- [ ] Add data validation/migration scripts

