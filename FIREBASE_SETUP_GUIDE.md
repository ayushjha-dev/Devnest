# Firebase Setup Guide for DevNest Arcade

This guide will help you configure Firebase for the multi-user arcade system.

## Step 1: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on "Project Settings" (gear icon)

## Step 2: Get Client-Side Credentials

In "Project Settings" > "General" tab:

1. Scroll to "Your apps" section
2. If no web app exists, click "Add app" and select Web
3. Copy the Firebase SDK configuration values:

```
API Key: AIza...
Auth Domain: your-project.firebaseapp.com
Project ID: your-project-id
Storage Bucket: your-project.appspot.com
Messaging Sender ID: 123456789
App ID: 1:123456789:web:abc123
```

## Step 3: Get Server-Side Credentials (Firebase Admin SDK)

In "Project Settings" > "Service Accounts" tab:

1. Click "Generate New Private Key"
2. A JSON file will be downloaded
3. Open the file and extract these two values:
   - `client_email` (looks like: firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com)
   - `private_key` (looks like: -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n)

## Step 4: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your preferred region
5. Click "Enable"

### Firestore Security Rules

Go to "Firestore Database" > "Rules" tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /arcade_users/{userId} {
      // Allow read for all
      allow read: if true;
      // Allow write only through server API
      allow create, update, delete: if false;
    }
  }
}
```

Click "Publish"

## Step 5: Configure Environment Variables

### For Local Development (.env.local):

Create a `.env.local` file in your project root:

```env
# Client-side (from Step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Server-side (from Step 3)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

**Important:** Keep the `FIREBASE_PRIVATE_KEY` value wrapped in quotes and preserve the `\n` newline characters!

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click "Settings" > "Environment Variables"
3. Add each variable one by one:
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIza...`
   - Click "Add"
   - Repeat for all 8 variables

**For the private key in Vercel:**
- Paste the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Vercel will automatically handle the newlines

## Step 6: Test the Setup

1. Deploy to Vercel or run locally with `npm run dev`
2. Visit `/arcade/register`
3. Register with a test user
4. If successful, you should see the user in Firestore Console

## Troubleshooting

### "Firebase Admin credentials not configured"
- Check that all three admin variables are set: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- Verify the private key includes the `-----BEGIN` and `-----END` markers

### "Permission denied" in Firestore
- Check your Firestore Security Rules (Step 4)
- Make sure reads are allowed for everyone

### "Invalid credentials"
- Regenerate the service account key (Step 3)
- Make sure there are no extra spaces or line breaks in the environment variables

### Vercel deployment fails
- Check Vercel logs for specific error messages
- Verify all environment variables are set in Vercel dashboard
- Try redeploying after setting variables

## Security Notes

- **NEVER** commit `.env.local` to Git (it's in `.gitignore`)
- The `FIREBASE_PRIVATE_KEY` should ONLY be set in Vercel environment variables or local `.env.local`
- Client-side variables (NEXT_PUBLIC_*) are safe to expose in the browser
- Server-side variables (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are NEVER sent to the browser

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Check Firestore Console to see if data is being written
4. Verify all environment variables are correctly set
