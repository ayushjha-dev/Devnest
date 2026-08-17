# DevNest - Tech Community Website

Official website for DevNest, the premier technical club fostering innovation and collaboration among tech enthusiasts.

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- pnpm package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Devnest-Web-Application-main
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Firebase credentials.

4. **Run development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔥 Firebase Setup

This project uses Firebase for membership management.

### **1. Create Firebase Project**
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Firestore Database
4. Get your configuration values

### **2. Configure Environment Variables**

Update `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### **3. Set Firestore Security Rules**

In Firebase Console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{memberId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

📚 **Detailed Firebase setup guide:** `FIREBASE_SETUP.md`

---

## 📱 WhatsApp Integration

Update your WhatsApp group link in `src/config/whatsapp.ts`:

```typescript
export const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/YOUR_LINK_HERE";
```

After registration, students will see a button to join your WhatsApp community.

---

## 🎯 Key Features

- ✅ **Public Membership Registration** - `/membership`
- ✅ **Admin Dashboard** - `/admin/members`
- ✅ **Events Showcase** - 5 upcoming events, past events archive
- ✅ **Technical Blogs** - 15 high-quality articles
- ✅ **Team Profiles** - Core team & alumni sections
- ✅ **WhatsApp Integration** - Automatic community join
- ✅ **Performance Optimized** - Lazy loading, optimized animations
- ✅ **Light Mode Only** - Forced light theme
- ✅ **Fully Responsive** - Mobile-first design

---

## 📁 Project Structure

```
Devnest-Web-Application-main/
├── src/
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   ├── data/              # JSON data (team, blogs)
│   ├── lib/               # Utilities (Firebase, Firestore)
│   └── config/            # Configuration (WhatsApp)
├── public/                # Static assets
│   ├── team/             # Team member photos
│   └── certificates/     # Event certificates
└── FIREBASE_SETUP.md     # Detailed Firebase guide
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animations:** Framer Motion, GSAP
- **Database:** Firebase Firestore
- **Package Manager:** pnpm
- **Deployment:** Vercel

---

## 📝 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

---

## 🗺️ Routes

### **Public Routes**
- `/` - Home page
- `/about` - About DevNest
- `/events` - Events listing
- `/blogs` - Technical blog articles
- `/team` - Team members & alumni
- `/membership` - Membership registration
- `/contact` - Contact information

### **Admin Routes**
- `/admin/members` - Member management dashboard

### **Event Pages**
- `/events/datadash` - DataDash event details
- `/events/promptathon-2026` - Promptathon details
- `/events/schedule` - Complete event schedule

---

## 📊 Data Management

### **Team Data**
Edit `src/data/team.json` to update:
- Core team members
- Alumni members
- Photos, roles, social links

### **Blog Data**
Edit `src/data/blogs.json` to:
- Add new blog posts
- Update existing content
- Manage categories

### **Events**
Edit events in `src/pages/events/index.tsx`:
- Update upcoming events
- Add past events

---

## 🔒 Security Notes

### **Environment Variables**
- ✅ Never commit `.env.local` to Git
- ✅ Add Firebase variables to Vercel environment settings
- ✅ Keep API keys secure

### **Firebase Rules**
- ⚠️ Current setup allows public registration (intended)
- 🔐 For production, implement authentication for admin routes
- 🔐 Restrict update/delete to authenticated admins only

---

## 🚀 Deployment

### **Deploy to Vercel**

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - All `NEXT_PUBLIC_FIREBASE_*` variables
4. Deploy

### **Environment Variables in Vercel**
Go to: Project Settings → Environment Variables

Add all variables from `.env.local`

---

## 📞 Support

- **Email:** devnest.techclub@gmail.com
- **Firebase Setup:** See `FIREBASE_SETUP.md`
- **WhatsApp:** Update link in `src/config/whatsapp.ts`

---

## 📄 License

© 2024-2026 DevNest. All rights reserved.

---

## 🎉 Credits

Built with ❤️ by the DevNest team.

**Key Contributors:**
- Hemanth Chakka (Former Head Developer)
- Aaditya Kumar (President)
- Manish Yadav (Technical Head)

---

## 🔄 Recent Updates

- ✅ Firebase membership system integrated
- ✅ WhatsApp community integration
- ✅ 15 technical blogs added
- ✅ 5 upcoming events added
- ✅ Performance optimizations (removed heavy animations)
- ✅ Light mode only
- ✅ Hall of Fame page removed
- ✅ Team page bubbles/particles removed
- ✅ Alumni section added

---

**Happy Coding! 🚀**
# DevNest - Technical Community
