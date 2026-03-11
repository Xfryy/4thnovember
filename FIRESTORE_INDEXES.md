# Firestore Indexes Guide

## Overview
This document describes the recommended Firestore indexes for optimal query performance in the 4th November VN engine.

## Note on Index Creation
Firestore will **automatically suggest and create** composite indexes when you run queries that need them. You only need to manually create indexes in special cases or for optimization.

**To view/manage indexes:**
1. Go to: Firebase Console → Firestore → Indexes
2. Check "Composite Indexes" tab for custom indexes
3. Firestore shows "Status" and "Suggestions" for automatic ones

---

## Recommended Composite Indexes

### 1. Save Slots by User (Latest First)
**Collection:** `save_slots`
**Fields:**
- `uid` (Ascending)
- `lastSaved` (Descending)

**Use Case:** List all saves for a user, sorted by most recent
```typescript
// Query that uses this index:
const slots = await getDocs(
  query(
    collection(db, "save_slots"),
    where("uid", "==", userId),
    orderBy("lastSaved", "desc"),
    limit(10)
  )
);
```

**Status:** ✅ Firestore auto-creates when first queried

---

### 2. Users by PlayTime (Leaderboard)
**Collection:** `users`
**Fields:**
- `totalPlayTime` (Descending)
- `createdAt` (Descending)

**Use Case:** Leaderboard or analytics queries
```typescript
// Query for top players by playtime:
const topPlayers = await getDocs(
  query(
    collection(db, "users"),
    orderBy("totalPlayTime", "desc"),
    limit(100)
  )
);
```

**Status:** ✅ Firestore auto-creates when first queried

---

### 3. Users by Join Date (Analytics)
**Collection:** `users`
**Fields:**
- `createdAt` (Descending)

**Use Case:** New player signups over time
```typescript
const newSignups = await getDocs(
  query(
    collection(db, "users"),
    where("createdAt", ">=", weekAgoMs),
    orderBy("createdAt", "desc")
  )
);
```

**Status:** ✅ Single-field indexes auto-created

---

## Single-Field Indexes (Auto-Created)

Firestore automatically creates these when first queried:

| Collection | Field | Purpose |
|------------|-------|---------|
| `users` | `lastPlayed` | Filter returning players |
| `users` | `totalPlayTime` | Analytics, sorting |
| `users` | `totalPlays` | Session count queries |
| `save_slots` | `uid` | Find user's saves |
| `save_slots` | `lastSaved` | Sort by recency |
| `save_slots` | `cleared` | Filter deleted slots |
| `settings` | `uid` | Fetch user settings |

---

## Firestore Pricing Impact

**Important:** Index use affects billing:
- **Storage:** ~40 KB per 100K docs indexed (minimal)
- **Operations:** No extra read cost for using indexes
- **Deletion:** Indexes reduce write cost per deleted field

**Cost Optimization:**
- ✅ Indexes reduce document scan cost
- ✅ Composite indexes are worth it for frequent queries
- ❌ Avoid indexes on rarely-used filters

---

## Query Performance Best Practices

### ✅ DO
- Use equality filters `where()` before range filters
- Order by fields that are in your indexes
- Limit result sets with `.limit()`
- Use pagination for large datasets

### ❌ DON'T
- Chain too many `where()` clauses (2-3 max)
- Query without filtering (scans entire collection)
- Order by multiple fields (only if indexed)
- Fetch more docs than needed

---

## Creating Manual Indexes (Firebase CLI)

If you want to pre-create indexes before going to production:

```bash
# Download current index configuration
firebase firestore:indexes

# Deploy indexes
firebase deploy --only firestore:indexes
```

**Or via Console:**
1. Firebase Console → Firestore → Indexes
2. Create Index button
3. Select collection, fields, sort order

---

## Monitoring Index Usage

**Via Firebase Console:**
1. Go to Firestore → Indexes
2. View "Query Efficiency" in index details
3. Monitor unused indexes for cleanup

**Via CLI:**
```bash
firebase firestore:indexes --list
```

---

## Future Index Recommendations

### If Adding Search Features:
- Consider adding Algolia or similar (Firestore doesn't support full-text search)

### If Adding Analytics:
- `users` collection indexes on `totalPlayTime`, `totalPlays`, `createdAt`
- `save_slots` indexes on `uid`, `lastSaved` for aggregation

### If Adding Leaderboards:
- `users` (totalPlayTime desc, createdAt desc)
- `users` (totalPlays desc, createdAt desc)

---

## Firestore Quota Limits

**Default Limits:**
- Index limit: 200 composite indexes
- Database size: Unlimited (scales automatically)
- Stored indexes: Count toward quota

**Current Game Setup:**
- 1 users collection
- 10 save_slots per user
- 1 settings per user
- 1 progress per user (deprecated)

**Estimated Indexes:** 2-4 composite + auto-created single-field = ~6 total

---

## Checklist

- [ ] Review current Firestore indexes in Console
- [ ] Verify performance on large datasets  (1000+ users)
- [ ] Check query explain plans for optimization opportunities
- [ ] Monitor index creation suggestions
- [ ] Pre-create critical indexes before production
- [ ] Document any custom indexes in this file

