# DevNest Arcade - Implementation Guide

## 🎮 Overview

The DevNest Arcade is a collection of interactive cybersecurity and tech mini-games integrated into the main DevNest website. It features a minimalist glassmorphism UI, shared XP/leaderboard system, and educational content for college students.

## 📁 File Structure

```
src/
├── data/
│   ├── arcade-games.json              # Game metadata and reward tiers
│   ├── phishing-scenarios.json        # Phishing or Legit game data
│   ├── cyber-detective-scenarios.json # Cyber Detective game data
│   └── ctf-challenges.json            # Mini CTF challenge data
├── styles/
│   └── arcade.css                     # Glassmorphism styling
├── components/
│   └── arcade/
│       ├── GameCard.tsx               # Game selection card
│       ├── Timer.tsx                  # Countdown timer
│       ├── ScoreCounter.tsx           # Score display with animation
│       └── FeedbackToast.tsx          # Feedback notifications
└── pages/
    └── arcade/
        ├── index.tsx                  # Arcade landing page
        ├── leaderboard.tsx            # Leaderboard display
        └── game/
            └── phishing-or-legit.tsx  # Phishing game (fully implemented)
```

## ✅ Completed Features

### 1. **Arcade Landing Page** (`/arcade`)
- Minimalist glassmorphism design with soft gradient background
- Featured games section (3 priority games)
- Additional games grid
- "How to Play" section
- Integrated into main site navigation with 🎮 Arcade link

### 2. **Phishing or Legit Game** (Fully Functional)
- 10 rapid-fire scenarios (emails, messages, login pages, QR codes)
- Binary classification: Phishing vs Legit
- Real-time scoring: +10 per correct answer
- Streak bonus: +5 for every 3 correct in a row
- Instant feedback with educational explanations
- 2-minute timer with auto game-over
- Progress tracking
- End-game summary with replay/leaderboard options

### 3. **Shared Components**
- **GameCard**: Reusable card for game selection
- **Timer**: Countdown timer with color-coded urgency
- **ScoreCounter**: Animated score display
- **FeedbackToast**: Success/error notifications with explanations

### 4. **Leaderboard**
- Top 10 players display
- Medal icons for top 3 (gold, silver, bronze)
- Current user highlighting
- Progress bar to next reward tier
- Reward tiers display

### 5. **Design System**
- Glassmorphism effect on all cards
- Soft neon accents (green/cyan)
- Minimal, clean typography
- Responsive grid layouts
- Touch-friendly on mobile (44px minimum targets)

## 🎯 Games Implemented

| Game | Status | File Location | Description |
|------|--------|---------------|-------------|
| **Phishing or Legit?** | ✅ Complete | `/arcade/game/phishing-or-legit.tsx` | Binary classification of phishing attempts |
| Cyber Detective | 📦 Data Ready | `/data/cyber-detective-scenarios.json` | Find 5 hidden clues in scenarios |
| Mini CTF | 📦 Data Ready | `/data/ctf-challenges.json` | 5-level capture-the-flag challenge |
| Tech Quiz | 🔜 Pending | - | Rapid MCQ tech questions |
| Password Strength | 🔜 Pending | - | Rate password security |
| Code Debugger | 🔜 Pending | - | Find bugs in code snippets |

## 🚀 Quick Start

### 1. Access the Arcade
- Navigate to `/arcade` from the main navigation
- Or visit directly: `http://your-domain.com/arcade`

### 2. Play a Game
- Click on any game card
- Currently only "Phishing or Legit?" is fully playable
- Other games show "Game in Development" placeholder

### 3. View Leaderboard
- Click "View Leaderboard" button on arcade home
- Or navigate to `/arcade/leaderboard`

## 🎨 Design Guidelines

### Colors
- **Primary Accent**: `#4AFFB0` (soft neon green)
- **Secondary Accent**: `#5ED4FF` (soft cyan)
- **Danger**: `#FF6B81` (soft coral-red)
- **Text Primary**: `#F5F7FA` (off-white)
- **Text Secondary**: `#9AA3B2` (muted gray)
- **Background**: `#0A0E14` → `#12161F` gradient

### Glass Effect Recipe
```css
background: rgba(255, 255, 255, 0.06);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 24px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

## 📝 Adding a New Game

### Step 1: Create Game Data File
```json
// src/data/your-game-data.json
{
  "challenges": [
    {
      "id": "challenge_01",
      "question": "...",
      "answer": "...",
      "explanation": "..."
    }
  ]
}
```

### Step 2: Add to Game Registry
```json
// src/data/arcade-games.json
{
  "id": "your-game-id",
  "name": "Your Game Name",
  "icon": "🎯",
  "description": "Brief description",
  "difficulty": 2,
  "estimatedTime": "3 min",
  "featured": false,
  "order": 7
}
```

### Step 3: Create Game Page
```typescript
// src/pages/arcade/game/your-game-id.tsx
import { Layout } from "@/components/Layout";
import { Timer, ScoreCounter, FeedbackToast } from "@/components/arcade";
import gameData from "@/data/your-game-data.json";

export default function YourGame() {
  // Game logic here
  // Use existing components (Timer, ScoreCounter, FeedbackToast)
  // Follow glassmorphism design patterns from arcade.css
}
```

### Step 4: Add Game Logic
- Use `useState` for score, current question, feedback
- Implement scoring rules (base points + bonuses)
- Add instant feedback with explanations
- Include progress tracking
- Add end-game summary screen

## 🎯 Scoring System

### Standard Scoring
- Correct answer: +10 XP
- Wrong answer: 0 XP (no penalty to keep pace)
- Streak bonus (3 in a row): +5 XP
- Quick answer (<3 sec): +2 XP

### Cyber Detective Specific
- Each clue found: +10 XP
- Wrong click: -5 XP
- All 5 clues found: +20 bonus

### Mini CTF Specific
- Base: 50 XP per level
- Completion bonus: +50 XP
- Wrong attempts (after 3 free): -5 XP each
- Hint reveal: -10 XP

## 🔐 Security Notes

### Flag Protection (for CTF)
Never ship plaintext flags in client-side code. Options:
1. Hash flags and compare hashes client-side
2. Use serverless function for validation
3. Implement backend API endpoint for flag checking

### Example (Client-side hash comparison)
```typescript
import crypto from 'crypto';

const hashFlag = (flag: string) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
};

// Store hash, not plaintext
const correctFlagHash = "abc123...";

// Validate
const isCorrect = hashFlag(userInput) === correctFlagHash;
```

## 📊 XP & Leaderboard Integration

### Current Implementation
- **Frontend Only**: Mock leaderboard data
- **No Persistence**: Scores reset on page reload
- **No Authentication**: Anonymous play

### Backend Integration TODO
1. Create API endpoints:
   - `POST /api/arcade/submit-score` - Submit game score
   - `GET /api/arcade/leaderboard` - Fetch leaderboard
   - `GET /api/arcade/user-stats` - Get user stats

2. Database schema:
```sql
CREATE TABLE arcade_scores (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  game_id VARCHAR(100),
  score INTEGER,
  time_taken INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE arcade_leaderboard (
  user_id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(100),
  total_xp INTEGER,
  rank INTEGER,
  last_updated TIMESTAMP
);
```

3. Use Firebase/Supabase for real-time leaderboard updates

## 🎨 Customization

### Change Accent Colors
Edit `src/styles/arcade.css`:
```css
/* Primary accent (green) */
--arcade-primary: #4AFFB0;

/* Secondary accent (cyan) */
--arcade-secondary: #5ED4FF;

/* Danger (red) */
--arcade-danger: #FF6B81;
```

### Adjust Glass Intensity
```css
.glass-card {
  background: rgba(255, 255, 255, 0.06); /* Increase for more opacity */
  backdrop-filter: blur(20px); /* Increase for more blur */
}
```

### Modify Reward Tiers
Edit `src/data/arcade-games.json`:
```json
{
  "rewardTiers": [
    { "xp": 200, "reward": "Your Reward 1" },
    { "xp": 500, "reward": "Your Reward 2" }
  ]
}
```

## 📱 Mobile Optimization

### Tested Scenarios
- ✅ Portrait mode (phones)
- ✅ Landscape mode (tablets)
- ✅ Touch targets ≥44px
- ✅ Readable font sizes
- ✅ Responsive grid layouts

### QR Code Integration
To link directly to arcade for stall setup:
1. Generate QR code pointing to: `https://your-domain.com/arcade`
2. Print and display at event stalls
3. Users scan → instant access to games

## 🐛 Known Issues & Future Improvements

### Known Issues
- [ ] Leaderboard data is mock/static
- [ ] No user authentication
- [ ] No score persistence
- [ ] Games 4-6 not yet implemented

### Planned Improvements
- [ ] Add user login/registration
- [ ] Connect to backend API for scores
- [ ] Real-time leaderboard updates
- [ ] Add sound effects (optional toggle)
- [ ] Implement remaining 3 games
- [ ] Add game difficulty levels
- [ ] Daily challenges feature
- [ ] Achievement badges system

## 📖 Educational Content

Each game includes instant educational feedback:
- **Phishing or Legit**: Explains phishing indicators
- **Cyber Detective**: Details each security clue
- **Mini CTF**: Teaches encoding, log analysis, crypto basics

Feedback format:
- ✅ **Correct**: "Why this is correct" (1 plain-English sentence)
- ❌ **Wrong**: "Why this is wrong + what to look for" (1-2 sentences)

## 🤝 Contributing

To add new games or improve existing ones:
1. Follow the glassmorphism design system
2. Keep games short (1-5 minutes)
3. Include educational value
4. Test on mobile devices
5. Document scoring rules
6. Add clear feedback messages

## 📞 Support

For issues or questions:
- Check `/arcade` for game availability
- Review game data files for content
- Test in incognito mode if experiencing caching issues
- Clear browser cache if styles don't load

---

**Built with ❤️ for DevNest by the DevNest Team**

*Last Updated: 2024*
