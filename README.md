# 4th November - Visual Novel Game

A production-ready visual novel / galgame built with Next.js 14, Firebase, and TypeScript.

## 🎮 Features

- **Google Authentication** - Easy Google OAuth login system
- **Character Customization** - Set your character name once on first login
- **Interactive Start Menu** - 3-column layout with character sprite, calendar, and navigation
- **Settings Panel** - Customize audio, display, language, and text speed
- **Calendar System** - Beautiful game-themed calendar with animated UI
- **Scene-based Narrative** - Story structured into Acts and Scenes
- **Auto-save Progress** - Game progress saved to Firestore automatically
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **State Management**: Zustand
- **UI Framework**: CSS Modules + Tailwind CSS
- **Deployment-ready**: Optimized for Vercel

## 📋 Project Structure

```
4thnovember/
├── app/
│   ├── api/
│   │   ├── auth/login/       # Google auth endpoint
│   │   └── user/             # User profile management
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home/Start Menu
│   └── globals.css           # Global styles
├── components/
│   └── StartMenu.tsx         # Main menu UI & character selection
├── lib/
│   └── firebase.ts           # Firebase initialization & functions
├── types/
│   └── game.ts               # TypeScript interfaces for game data
├── store/
│   └── gameStore.ts          # Zustand store for game state
├── hooks/
│   └── useGameState.ts       # Hook to access game state
├── Assets/
│   └── Image/
│       ├── GameBG/           # Background images
│       └── Rinn/             # Character sprites
├── .env.local.example        # Environment variables template
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies

```

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account (free tier works fine)
- Google OAuth credentials

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project "4th-november" (or use existing)
3. Enable Firestore Database (Test mode for development)
4. Enable Authentication (Google provider)
5. Go to Project Settings > Service Accounts > Generate New Private Key (JSON)
6. Go to Project Settings > General > Get your Web API Key & Config

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   
   FIREBASE_PROJECT_ID=...
   FIREBASE_PRIVATE_KEY="..."
   FIREBASE_CLIENT_EMAIL=...
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Current Implementation

### ✅ Completed

- [x] Start Menu UI (matches reference design)
- [x] Google authentication flow
- [x] Character name input dialog
- [x] User profile management (Firestore)
- [x] Game state store (Zustand)
- [x] Type definitions for game scenes
- [x] API routes for user data
- [x] Responsive design
- [x] Character sprite rotation/animation

### 📝 Next Steps (For Future Phases)

- [ ] Game scene rendering system
- [ ] Dialogue display component
- [ ] Choice system component
- [ ] Monologue/narration scenes
- [ ] Minigame framework
- [ ] Transition effects
- [ ] Save/Load system UI
- [ ] Settings menu
- [ ] Scene data loader
- [ ] Story script parser

## 💾 Game Data Structure

### User Document (Firestore)
```typescript
{
  uid: string;
  email: string;
  characterName: string;
  createdAt: number;
  lastPlayed: number;
}
```

### Progress Document (Firestore)
```typescript
{
  uid: string;
  currentAct: number;
  currentScene: number;
  choices: Record<string, any>;
  lastUpdated: number;
}
```

### Scene Types

The engine supports these scene types:

- **dialogue** - Character speaks to player (with sprite)
- **monologue** - MC internal thoughts (no sprite)
- **choice** - Player picks option (affects story/affection)
- **transition** - Scene change narration
- **minigame** - Interactive mini game (framework ready)
- **ending** - Act ending or game ending

## 🎨 Character Management

Characters are stored in `Image/[CharacterName]/` folders:

```
/Image/Rinn/SchoolFIT/
├── frame_0.png
├── frame_1.png
├── frame_2.png
└── ...
```

The system auto-rotates through these sprites for visual variety. You can add more character folders and they'll be automatically detected.

## 🔧 API Endpoints

### GET /api/user
Fetch user profile data.

**Headers:**
```
Authorization: Bearer <firebase-id-token>
```

**Response:**
```json
{
  "user": {
    "uid": "...",
    "email": "...",
    "characterName": "...",
    "createdAt": 1234567890,
    "lastPlayed": 1234567890
  }
}
```

### POST /api/user
Update user data (character name, etc).

**Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Body:**
```json
{
  "characterName": "Player Name"
}
```

### POST /api/auth/login
Validate login token.

**Body:**
```json
{
  "token": "<firebase-id-token>"
}
```

## 🐛 Troubleshooting

### "Firebase config not found"
- Make sure `.env.local` is created and filled with Firebase credentials
- Restart the dev server after changing env vars

### "Login button doesn't work"
- Check Firebase Console > Authentication > Google provider is enabled
- Make sure your domain is added to authorized redirect URIs

### "Character sprite not showing"
- Verify image paths in `Image/Rinn/SchoolFIT/`
- Images should be png or JPEG format
- Check browser console for image loading errors

### "Firestore data not saving"
- Use Firebase Console to check Firestore database
- Make sure Firestore is in "Test mode" (for development)
- Check users have read/write rules enabled

## 📦 Deployment (Vercel)

```bash
# 1. Connect repo to Vercel
# 2. Add environment variables in Vercel Project Settings
# 3. Push to main branch
# 4. Vercel auto-deploys
```

## 📚 Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 📄 License

Private - Team Only

---

**Game Title:** 4th November  
**Genre:** Visual Novel / Galgame  
**Status:** In Development (Phase 1: Menu System Complete)
