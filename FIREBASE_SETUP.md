# Firebase Setup Guide for DevNest Membership System

This guide will help you set up Firebase for the DevNest membership management system.

## 📋 Prerequisites

- A Google account
- Node.js and pnpm installed
- DevNest project cloned locally

---

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `devnest-membership` (or your choice)
4. **Google Analytics**: Optional (you can enable it for analytics)
5. Click **"Create project"** and wait for setup to complete

---

## 🌐 Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `DevNest Web App`
3. **DO NOT** check "Set up Firebase Hosting" (we're using Vercel)
4. Click **"Register app"**
5. Copy the Firebase configuration object shown (you'll need this)

The config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX" // Optional
};
```

---

## 🗄️ Step 3: Set Up Firestore Database

1. In Firebase Console, go to **"Build" > "Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll configure rules next)
4. Select a Cloud Firestore location (choose closest to your users, e.g., `asia-south1` for India)
5. Click **"Enable"**

### Configure Firestore Security Rules

1. Go to **"Firestore Database" > "Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Members collection - public read, admin write
    match /members/{memberId} {
      allow read: if true; // Anyone can read member data
      allow create: if true; // Anyone can create a new member (for registration form)
      allow update, delete: if request.auth != null; // Only authenticated users can update/delete
    }
  }
}
```

**Note**: For production, you should implement proper authentication and restrict write access to admin users only.

3. Click **"Publish"** to save the rules

---

## 🔐 Step 4: Set Up Authentication (Optional but Recommended)

If you want admin authentication for the dashboard:

1. Go to **"Build" > "Authentication"**
2. Click **"Get started"**
3. Enable **"Email/Password"** sign-in method
4. Click **"Add new provider"** > **"Email/Password"**
5. Enable and save

### Create Admin User

1. Go to **"Authentication" > "Users"** tab
2. Click **"Add user"**
3. Enter admin email and password
4. Click **"Add user"**

---

## 🔑 Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase config values:

```bash
# Client-side Firebase config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important**: 
- These variables start with `NEXT_PUBLIC_` so they're accessible in the browser
- The API key is safe to expose publicly
- Never commit `.env.local` to version control!

---

## 🚀 Step 6: Test the Integration

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

2. **Test Member Registration:**
   - Navigate to `/membership`
   - Fill out the registration form
   - Submit and check for success message

3. **Verify in Firebase Console:**
   - Go to **"Firestore Database" > "Data"** tab
   - You should see a `members` collection
   - Click on it to see the registered member document

4. **Test Admin Dashboard:**
   - Navigate to `/admin/members`
   - You should see all registered members
   - Try searching, filtering, and exporting data

---

## 📊 Database Structure

### Members Collection (`members`)

Each member document contains:

```typescript
{
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  branch: string;
  year: string;
  semester: string;
  
  // Club Information
  membershipType: "regular" | "core" | "alumni";
  joiningDate: Timestamp;
  interests: string[];
  skills: string[];
  
  // Social Links (optional)
  linkedin?: string;
  github?: string;
  portfolio?: string;
  
  // Status
  status: "active" | "inactive";
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 🛡️ Security Best Practices

### For Development:
- ✅ Current rules allow anyone to create members (for public registration)
- ✅ Current rules allow anyone to read members (for public display)
- ⚠️ Update/delete requires authentication

### For Production:

1. **Implement Admin Authentication:**
   ```javascript
   // Update Firestore rules to check for admin role
   match /members/{memberId} {
     allow read: if true;
     allow create: if true;
     allow update, delete: if request.auth != null && 
       get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
   }
   ```

2. **Create an admins collection** with user roles

3. **Add authentication to admin routes:**
   - Protect `/admin/members` route
   - Add login page
   - Check user role before allowing CRUD operations

4. **Rate Limiting:**
   - Implement rate limiting on member registration
   - Use Firebase App Check to prevent abuse

5. **Data Validation:**
   - Add server-side validation rules
   - Use Firebase Functions for complex validation

---

## 🎯 Available Routes

### Public Routes:
- `/membership` - Member registration form

### Admin Routes:
- `/admin/members` - Members dashboard (view, search, filter, export)

---

## 📱 Firebase Features Used

- ✅ **Firestore Database** - Store member data
- ✅ **Firebase Authentication** - Admin login (optional)
- ✅ **Firestore Security Rules** - Access control
- ⏳ **Firebase Analytics** - Track usage (if enabled)
- ⏳ **Firebase Functions** - Server-side operations (future)

---

## 🔧 Helper Functions Available

Located in `src/lib/firestore/members.ts`:

```typescript
// CRUD Operations
addMember(memberData)          // Add new member
getAllMembers()                // Get all members
getMemberById(id)              // Get single member
getMemberByEnrollment(number)  // Find by enrollment
getMemberByEmail(email)        // Find by email
updateMember(id, updates)      // Update member
deleteMember(id)               // Delete member

// Queries
getMembersByType(type)         // Filter by type (regular/core/alumni)
getActiveMembers()             // Get only active members
searchMembers(searchTerm)      // Search by name/email/enrollment

// Statistics
getMemberStats()               // Get member counts by type/status
```

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Check that all environment variables are set correctly
- Make sure you're using the correct API key from Firebase Console
- Restart the dev server after changing `.env.local`

### Error: "Missing or insufficient permissions"
- Check Firestore security rules
- Make sure rules are published
- For admin operations, ensure user is authenticated

### Members not showing in dashboard:
- Check browser console for errors
- Verify Firebase config is correct
- Check Firestore Database in Firebase Console to see if data exists
- Make sure you're reading from the correct collection name (`members`)

### Registration form not submitting:
- Check browser console for errors
- Verify all required fields are filled
- Check for duplicate enrollment numbers or emails
- Ensure Firestore security rules allow `create` operations

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js with Firebase](https://firebase.google.com/docs/web/setup)

---

## ✅ Checklist

Before deploying to production:

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Security rules configured
- [ ] Environment variables set
- [ ] Registration form tested
- [ ] Admin dashboard tested
- [ ] Authentication implemented (if needed)
- [ ] Admin role system set up (if needed)
- [ ] Rate limiting configured
- [ ] Data validation added
- [ ] Backup strategy in place

---

## 🎉 You're All Set!

Your Firebase membership system is ready to use. Students can now register at `/membership` and admins can manage members at `/admin/members`.

For questions or issues, contact the DevNest tech team at **devnest.techclub@gmail.com**
