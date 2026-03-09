# 🔥 Firebase Setup Guide for 4th November

Step-by-step guide to set up Firebase for the visual novel game.

## Prerequisites

- Google account
- Firebase project (free tier is fine)
- Text editor for environment variables

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project**
3. Project name: `4th-november` (or your preferred name)
4. ✅ Accept terms and click **Create project**
5. Wait for project to be created (usually 1-2 minutes)

## Step 2: Register Web App

1. In Firebase Console, click the **</> (Web)** icon
2. App nickname: `4th-november-web`
3. ☑️ Check "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see your Firebase config - **COPY THIS** (you'll need it next)

Your config looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey...",
  authDomain: "4th-november-abc123.firebaseapp.com",
  projectId: "4th-november-abc123",
  storageBucket: "4th-november-abc123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 3: Set Up Authentication (Google Sign-In)

1. In Firebase Console, go to **Authentication** (left sidebar)
2. click **Get Started**
3. Click **Google** provider
4. Toggle ✅ **Enable**
5. Set **Project support email** (choose your Google account)
6. Click **Save**

### Add Authorized Domain

1. Still in **Authentication**, click **Settings** tab
2. Go to **Authorized domains** section
3. Click **Add domain**
4. Add these domains:
   - `localhost` (for local development)
   - `localhost:3000` (specific port)
   - Your Vercel domain (if deploying): `4th-november.vercel.app`

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Select **Test mode** (for development - anyone can read/write)
4. Select **US** region (or your preferred region)
5. Click **Create**

### Firestore Security Rules (Test Mode)

Test mode rules (development only):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Before going to production**, change to:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /progress/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

## Step 5: Generate Service Account Key (for Server-Side)

1. In Firebase Console, click **Project Settings** (gear icon)
2. Go to **Service Accounts** tab
3. Click **Generate New Private Key** → **Generate Key**
4. A JSON file downloads - **KEEP THIS SAFE!**

It looks like:
```json
{
  "type": "service_account",
  "project_id": "4th-november-abc123",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIB...",
  "client_email": "firebase-adminsdk-abc123@4th-november-abc123.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

## Step 6: Set Environment Variables

1. In your project root, create `.env.local` file
2. Copy from `.env.local.example`:

```bash
# Copy content from .env.local.example
```

3. Fill in the values from your Firebase config:

**From Firebase Web Config:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=                    # apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=                # authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=                 # projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=             # storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=        # messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=                     # appId
```

**From Service Account JSON:**
```
FIREBASE_PROJECT_ID=                             # project_id
FIREBASE_PRIVATE_KEY="-----BEGIN..."             # private_key (wrap in quotes!)
FIREBASE_CLIENT_EMAIL=                           # client_email
```

Example `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDEMO1234567890abcDEFGHIJ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=4th-november-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=4th-november-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=4th-november-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

FIREBASE_PROJECT_ID=4th-november-abc123
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEF..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@4th-november-abc123.iam.gserviceaccount.com
```

## Step 7: Test the Setup

1. Save `.env.local`
2. Restart dev server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)
4. Click **LOGIN WITH GOOGLE**
5. Use your Google account to sign in
6. You should be redirected to character name input
7. Enter a character name and click **Mulai Game**

### Verify in Firebase Console

1. Go to **Firestore Database**
2. You should see collections: `users` and optionally `progress`
3. Click `users` → you should see a document with your `uid`
4. It should contain:
   ```
   {
     uid: "your_firebase_uid",
     email: "your_email@gmail.com",
     characterName: "Your Character Name",
     createdAt: 1234567890,
     lastPlayed: 1234567890
   }
   ```

✅ **If you see this, Firebase is properly configured!**

## Common Issues & Solutions

### "Firebase config not found"
- ✅ Check `.env.local` exists in project root
- ✅ Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- ✅ Restart dev server after creating `.env.local`

### Login button clicks but nothing happens
- ✅ Check browser console for errors (F12 → Console)
- ✅ Verify Google provider is enabled in Firebase Auth
- ✅ Make sure `localhost` is in Authorized domains

### "Error: Firestore not initialized"
- ✅ Check Firestore Database is created (should show green checkmark)
- ✅ Verify it's in **Test mode** (for development)
- ✅ Check internet connection

### "User not found in Firestore"
- ✅ After login, user document should auto-create
- ✅ Check in Firebase Console → Firestore → Collections → users
- ✅ If missing, check cloud function logs for errors

### Data not saving to Firestore
- ✅ Verify Firestore is in Test mode (allows all writes)
- ✅ Check `.env.local` has correct `FIREBASE_PROJECT_ID`
- ✅ Verify rules allow write access (see Step 4)

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/4th-november.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **New Project**
3. Select your GitHub repo `4th-november`
4. Click **Import**

### 3. Add Environment Variables

1. In Vercel Project Settings → **Environment Variables**
2. Add all 9 variables from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

### 4. Update Firebase Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Add your Vercel domain:
   - Typically: `your-project.vercel.app`
   - Or custom domain if you have one

### 5. Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Your game is now live! 🎉

## Firestore Database Structure

### Collection: `users`

Document ID: `{uid}` (Firebase user ID)

Fields:
```typescript
{
  uid: string;                    // Firebase UID
  email: string;                  // User email
  characterName: string;          // Player chosen name
  createdAt: number;              // Timestamp
  lastPlayed: number;             // Last session timestamp
}
```

### Collection: `progress`

Document ID: `{uid}`

Fields:
```typescript
{
  uid: string;                    // Firebase UID
  currentAct: number;             // Act number
  currentScene: number;           // Scene number
  choices: Record<string, any>;   // Past choices
  lastUpdated: number;            // Last save timestamp
}
```

## Database Backup

Never lose player data! Follow Firebase Backup guide:

1. Firebase Console → Data Connect → Exports
2. Or enable automated backups (Firebase Blaze plan)

## Advanced: Custom Domain

1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Vercel Project Settings → Domains
3. Add your domain
4. Follow DNS setup instructions
5. Update Firebase Authorized domains with your custom domain

## Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Database Guide](https://firebase.google.com/docs/firestore)
- [Vercel Deployment](https://vercel.com/docs)

## Support

If you get stuck:

1. Check browser console for error messages (F12 → Console)
2. Check Firebase Console activity logs
3. Review `.env.local` for typos or missing values
4. Restart dev server after making changes

---

**Next Step:** After Firebase is set up, you can start the app:

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) to test!
