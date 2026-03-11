# Database Schema Implementation Guide

## 🎯 Overview

This guide documents the corrected Firestore schema for the 4th November VN engine, including:
- ✅ Collection structure and relationships
- ✅ Consolidated save system (save_slots only)
- ✅ Firestore settings persistence
- ✅ Playtime aggregation and sync
- ✅ Security rules and indexes

---

## 📋 Summary of Changes

### Collections Now in Use:
1. **`users/{uid}`** - User profiles with playtime stats
2. **`save_slots/{uid_s{slotId}}`** - 10-slot save system
3. **`settings/{uid}`** - Per-user game settings

### Collections Deprecated:
- **`saves`** (old quick-save, replaced by save_slots)
- **`progress`** (old progress tracker, now in save_slots auto-save)

### New Features:
- ✅ Screenshot storage in `save_slots[].previewImage`
- ✅ Playtime aggregation from all save slots
- ✅ Firestore settings backup (with localStorage fallback)
- ✅ Auto-sync when settings change

---

## 🔄 Implementation Checklist

### Phase 1: Schema Update ✅ COMPLETE
- [x] Document new schema in DATABASE_SCHEMA.md
- [x] Update firebase.ts with `getSettings()` and `saveSettings()`
- [x] Add `totalPlayTime` and `totalPlays` to users collection initialization
- [x] Deprecate saveManager.ts and progress collection writes
- [x] Create settingsSync.ts module for Firestore settings sync

### Phase 2: Frontend Integration ✅ COMPLETE
- [x] Import `loadSettingsFromFirestore` and `setupSettingsSync` in StartMenu
- [x] Load settings from Firestore after login
- [x] Enable auto-sync on settings changes
- [x] Cleanup sync on logout/unmount
- [x] Handle localStorage fallback for offline/new users

### Phase 3: Security & Optimization ✅ COMPLETE
- [x] Document Firestore security rules in FIRESTORE_RULES.js
- [x] Create index recommendations in FIRESTORE_INDEXES.md
- [x] Plan migration from old collections

### Phase 4: Migration (Optional)
- [ ] Migrate existing `saves` data to `save_slots` (if needed)
- [ ] Backfill `totalPlayTime` and `totalPlays` in existing user docs
- [ ] Add `previewImage` to existing save slots (optional, can be null)
- [ ] Migrate `progress` data to save_slots auto-save

### Phase 5: Cleanup (Later)
- [ ] Remove old `saves/{uid}` documents
- [ ] Remove old `progress/{uid}` documents
- [ ] Update any old API routes referencing these collections

---

## 📊 Collection Schemas

### 1. `users/{uid}`
```typescript
{
  uid: string;                    // PK: Firebase Auth UID
  email: string;                  // User email
  characterName: string;          // Player name (0 = not set)
  createdAt: number;              // Account creation (ms)
  lastPlayed: number;             // Last session (ms)
  totalPlayTime: number;          // Total seconds across all saves
  totalPlays: number;             // Count of manual saves + auto-saves
}
```

### 2. `save_slots/{uid_s{slotId}}`
```typescript
{
  // IDs
  slotId: number;                 // 0=auto, 1-9=manual
  uid: string;                    // FK → users/{uid}
  
  // Game State
  currentAct: number;
  currentSceneId: string;
  choices: Record<string, string>;
  affection: Record<string, number>;
  
  // Metadata
  playTimeSeconds: number;
  lastSaved: number;              // ms since epoch
  
  // Preview for UI
  previewImage?: string;          // Base64 screenshot OR sprite URL
  previewText?: string;           // First ~80 chars of dialogue
  sceneLabel?: string;            // "Act 1 · Scene 5"
  
  // Soft Delete
  cleared?: boolean;              // true = treat as empty
}
```

### 3. `settings/{uid}`
```typescript
{
  uid: string;                    // PK: Firebase Auth UID
  masterVolume: number;           // 0-100
  bgmVolume: number;              // 0-100
  sfxVolume: number;              // 0-100
  voiceVolume: number;            // 0-100
  brightness: number;             // 0-100
  language: "id" | "en";
  textSpeed: number;              // 10-100
  lastModified: number;           // ms since epoch
}
```

---

## 🔐 Security Rules

**Location:** `FIRESTORE_RULES.js`

**Key Rules:**
- Users can only access their own documents
- Auto-created validation for settings ranges
- Save slots document ID must match `{uid}_s{slotId}`
- Admin-only cleanup of deprecated collections

**Deploy:**
```bash
firebase deploy --only firestore:rules
```

---

## 📈 Indexes

**Location:** `FIRESTORE_INDEXES.md`

**Most Important:**
1. `save_slots`: (uid, lastSaved desc) - for listing user saves
2. `users`: (totalPlayTime desc) - for leaderboards
3. `users`: (createdAt desc) - for analytics

**Status:** Firestore auto-creates on first query

---

## 🔌 Integration Points

### Initialization (StartMenu/index.tsx)
```typescript
// After user login:
await loadSettingsFromFirestore();      // Load from server
setupSettingsSync();                    // Enable auto-sync

// On logout:
await cleanupSettingsSync();            // Flush pending changes
```

### Save/Load Game (Usesavestate.ts)
```typescript
// Already integrated - no changes needed!
// Saves use save_slots via writeSlot()
// Screenshots stored in previewImage
```

### Settings Changes
```typescript
// Automatic! Just update Zustand store:
useSettingsStore.getState().updateSetting("masterVolume", 80);
// → Debounced sync to Firestore
```

---

## 🚀 Benefits of Corrected Schema

| Aspect | Before | After |
|--------|--------|-------|
| **Save System** | 2 collections (saves + saveSlots) | 1 collection (save_slots) |
| **Settings** | localStorage only | Firestore + localStorage fallback |
| **Playtime** | Manual calculation | Automatic sync on save |
| **Relationships** | Unclear | Clear schema with foreign keys |
| **Data Integrity** | Possible duplicates | Single source of truth |
| **Cross-Device Sync** | Partial | Full settings sync |

---

## 📝 Type Definitions

### TypeScript Types (types/game.ts)
```typescript
export interface GameUser {
  uid: string;
  email: string;
  characterName: string;
  createdAt: number;
  lastPlayed: number;
  totalPlayTime?: number;        // New field
  totalPlays?: number;           // New field
}

export interface SaveData {
  uid: string;
  currentAct: number;
  currentSceneId: string;
  choices: Record<string, string>;
  affection: Record<string, number>;
  playTimeSeconds: number;
  lastSaved: number;
  previewImage?: string;         // New field
  previewText?: string;          // New field
  sceneLabel?: string;           // New field
}

export interface GameSettings {
  uid: string;
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  brightness: number;
  language: "id" | "en";
  textSpeed: number;
  lastModified: number;
}
```

---

## 📚 Documentation Files

1. **DATABASE_SCHEMA.md** - Complete schema reference
2. **FIRESTORE_RULES.js** - Security rules (deploy to Firebase)
3. **FIRESTORE_INDEXES.md** - Index optimization guide
4. **SCHEMA_IMPLEMENTATION_GUIDE.md** ← You are here

---

## 🧪 Testing the Schema

### Test Checklist

```bash
# 1. User Login & Settings Sync
- [ ] Login with new account
- [ ] Verify settings created in Firestore
- [ ] Change a setting
- [ ] Logout and verify changes saved

# 2. Save/Load System
- [ ] Create manual save
- [ ] Verify document in save_slots collection
- [ ] Load save and verify state restoration
- [ ] Check previewImage contains screenshot

# 3. Playtime Tracking
- [ ] Play for 1 minute
- [ ] Auto-save
- [ ] Check totalPlayTime in users doc
- [ ] Play again and verify accumulation

# 4. Cross-Device Sync (requires 2 devices/browsers)
- [ ] Login on device A
- [ ] Change settings
- [ ] Login on device B
- [ ] Verify settings synced

# 5. Offline Behavior
- [ ] Disconnect network
- [ ] Change settings (should use localStorage)
- [ ] Reconnect
- [ ] Verify sync to Firestore
```

---

## 🐛 Troubleshooting

### Settings Not Syncing
**Problem:** Changes not appearing in Firestore
- Check if user is logged in
- Verify `setupSettingsSync()` was called
- Check browser console for errors
- Check Firestore security rules

**Solution:**
```typescript
// Debug: Log sync status
import { setupSettingsSync } from "@/lib/settingsSync";

const unsubscribe = setupSettingsSync();
// → Should log "📝 Settings auto-sync enabled"
```

### Save Slots Not Found
**Problem:** Saves not appearing in collection
- Verify document ID format: `{uid}_s{slotId}`
- Check if user UID matches
- Check Firestore security rules allow writes

**Solution:**
```typescript
// Debug: Log save slot
import { readAllSlots } from "@/lib/saveSlots";

const slots = await readAllSlots(uid);
console.log("Slots:", slots);
```

### Playtime Not Updating
**Problem:** `totalPlayTime` stuck at 0
- Check `calculateTotalPlaytime` is being called
- Verify auto-saves are writing `playTimeSeconds`
- Check `updateUserPlaytime` is receiving correct values

**Solution:**
```typescript
// Manually trigger recalculation
import { calculateTotalPlaytime } from "@/lib/saveSlots";
import { updateUserPlaytime } from "@/lib/firebase";

const stats = await calculateTotalPlaytime(uid);
await updateUserPlaytime(uid, stats.totalMinutes, stats.totalPlays);
```

---

## 📞 Support

For schema-related issues:
1. Check DATABASE_SCHEMA.md for field definitions
2. Review FIRESTORE_RULES.js for permissions
3. Verify types match in types/game.ts
4. Check browser console for Firebase errors

---

## Version Control

**Current Schema Version:** 1.0  
**Last Updated:** [Current Date]  
**Maintained By:** [Your Team]

