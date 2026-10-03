# DevNest — Official Tech Community Portal

<div align="center">

[![Repository](https://img.shields.io/badge/GitHub-devnest--tech%2FDevnest-181717?style=for-the-badge&logo=github)](https://github.com/devnest-tech/Devnest)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-FFE600?style=for-the-badge&labelColor=000000&color=FFE600)](LICENSE)

<br/>

**DevNest** is the premier student-led technical community at **Lamrin Tech Skills University Punjab (LTSU)**, operating in strategic collaboration with **Google Campus**. We foster technical excellence through high-impact hackathons, workshops, open-source projects, and industry networking.

[Explore Platform](https://devnest-club.vercel.app) • [Report Bug](https://github.com/devnest-tech/Devnest/issues/new?template=bug_report.md) • [Request Feature](https://github.com/devnest-tech/Devnest/issues/new?template=feature_request.md) • [Contributing Guide](.github/CONTRIBUTING.md)

</div>

---

## 🎨 Architectural Design System: Neobrutalism

The DevNest web application is crafted with a signature **Neobrutalism** aesthetic inspired by modern high-contrast editorial web design:

- **Warm Cream Paper Canvas:** `#FAF7EE` with subtle architectural dot-grid backgrounds (`neo-grid-bg`).
- **Pitch-Black Strokes & Hard Drop Shadows:** Solid `2px` and `3px` black borders paired with unblurred `shadow-[3px_3px_0px_#000]` and `shadow-[5px_5px_0px_#000]`.
- **Saturated Pop Accents:** Canary Yellow (`#FFE600`), Bubblegum Pink (`#FF70A6`), Lavender (`#C8B6FF`), and Cyber Cyan (`#70D6FF`).
- **Bold Typography:** **Poppins** for bold headings, **Space Grotesk** for technical badges/metadata, and **Manrope** for legible long-form reading.

---

## ⚡ Key Highlights & Capabilities

- 🎯 **Public Member Registration (`/membership`):** Dynamic onboarding with real-time Firebase Firestore synchronization.
- 🏆 **Flagship Events Hub (`/events`):** Full portals for **Designathon 2026**, **DataDash**, **Promptathon 2026**, **Prarambh**, and **Arcade**.
- 👥 **Dynamic Team Registration:** Flexible team sizes (individual 1 to team of 4), live teammate inputs, and academic section dropdowns (CSE-A1, CSE-A2, B.Tech IoT, AIML, etc.).
- 📊 **Administrative Suite (`/admin/*`):** Secure session-authenticated dashboards featuring real-time submission metrics, search filters, and status controls.
- 📑 **Official Formatted Excel Attendance Export:** Automated generation of stylized, border-aligned `.xlsx` attendance sheets formatted for institutional administrative reporting via `xlsx-js-style`.
- 🏅 **Hall of Fame (`/hall-of-fame`):** Showcase of hackathon victors, runner-ups, squad details, and project accomplishments.
- ⚙️ **Glyph Platform Portal (`/glyph`):** Dedicated status and maintenance hub for DevNest's upcoming computational platform.
- 📜 **Certificate Verification & Download (`/certificate-download`):** Instant verification and retrieval of event participation certificates.
- ✍️ **Engineering Blogs (`/blogs`):** Technical write-ups and tutorials contributed by community developers.

---

## 🗺️ Route Directory

### Public Routes
| Route | Purpose |
| :--- | :--- |
| [`/`](src/pages/index.tsx) | Homepage with Google Campus badge, core pillars, stats, and domains |
| [`/about`](src/pages/about.tsx) | Mission, vision, institutional partnership, and leadership |
| [`/events`](src/pages/events/index.tsx) | Comprehensive calendar of hackathons, workshops, and meetups |
| [`/events/designathon`](src/pages/events/designathon.tsx) | Designathon 2026 portal with dynamic multi-track registration modal |
| [`/events/datadash`](src/pages/events/datadash.tsx) | DataDash competition details and participant archives |
| [`/events/promptathon-2026`](src/pages/events/promptathon-2026.tsx) | Prompt engineering and AI hackathon portal |
| [`/events/schedule`](src/pages/events/schedule.tsx) | Master 2026 timeline and schedule |
| [`/blogs`](src/pages/blogs/index.tsx) | Technical articles, engineering logs, and tutorials |
| [`/team`](src/pages/team.tsx) | Core team directory, mentors, and alumni |
| [`/hall-of-fame`](src/pages/hall-of-fame.tsx) | Competition winners, runner-ups, and podium achievements |
| [`/glyph`](src/pages/glyph.tsx) | Glyph portal status & formal maintenance notice |
| [`/membership`](src/pages/membership.tsx) | Student membership application with instant WhatsApp community link |
| [`/certificate-download`](src/pages/certificate-download.tsx) | Student credential & event certificate retrieval portal |
| [`/contact`](src/pages/contact.tsx) | Official contact form, location details, and social links |

### Administrator Routes
| Route | Purpose |
| :--- | :--- |
| [`/admin/designathon`](src/pages/admin/designathon.tsx) | Designathon registration manager with search & official Excel attendance export |
| [`/admin/members`](src/pages/admin/members.tsx) | Membership database, verification status, and batch exports |
| [`/admin/datadash`](src/pages/admin/datadash.tsx) | DataDash participant review and attendance records |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0+ (recommended) or **npm** v9.0.0+
- **Git**: Installed and configured on your machine

### 1. Clone the Repository
```bash
git clone https://github.com/devnest-tech/Devnest.git
cd Devnest
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Environment Variables
Copy the template environment file:
```bash
cp .env.example .env.local
```
Open `.env.local` and populate your credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=devnest-club.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=devnest-club
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=devnest-club.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

ADMIN_PASSWORD=your_secure_admin_password
ADMIN_SESSION_SECRET=your_secure_session_secret
```

### 4. Start Local Development
```bash
pnpm dev
# or
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| Development Server | `pnpm dev` | Starts Next.js development server with hot-reload |
| Production Build | `pnpm build` | Compiles optimized production bundle |
| Start Production | `pnpm start` | Boots production server |
| TypeScript Check | `pnpm typecheck` | Validates TypeScript types across the project |
| ESLint Check | `pnpm lint` | Runs Next.js ESLint rules |
| Code Formatting | `pnpm format.fix` | Formats code with Prettier |

---

## 📊 Data Management

### **Team Data**
Edit `src/data/team.json` to update:
- Core team members
- Alumni members
- Photos, roles, social links

### **Blog Data**
Articles are authored as Markdown in `src/content/blogs/` — one `.md` file per post, with YAML frontmatter:

```yaml
title: "Post title"
author: "Author name"
date: "YYYY-MM-DD"          # posts are sorted newest-first
category: "Cyber Security"  # drives the category filter and related posts
thumbnail: "🔒"             # emoji/key resolved by src/components/TechIcon.tsx
coverImage: "/images/blogs/example.svg"  # optional; falls back to the themed icon banner
excerpt: "One or two sentence summary."
readTime: "6 min read"
```

To add a post, create `src/content/blogs/<slug>.md` — the filename becomes the URL (`/blog/<slug>`).
Real hero images live in `public/images/blogs/`. `src/data/blogs.json` holds a matching metadata catalogue for reference and tooling.

> **Note:** Markdown is rendered with `remark` **without GFM**, so GitHub-style tables, strikethrough and task lists are not supported in article bodies. Use plain Markdown lists instead.

### **Events**
Edit events in `src/pages/events/index.tsx`:
- Update upcoming events
- Add past events

---

## 🌿 Git & GitHub Contribution Guidelines

We welcome contributions from DevNest community members and open-source contributors! Please follow our established git workflow:

### 1. Branch Naming Convention
Always branch off the latest `main`:
```bash
git checkout main
git pull origin main
git checkout -b <prefix>/<short-description>
```

| Prefix | Scenario | Example |
| :--- | :--- | :--- |
| `feat/` | New user-facing feature or page | `feat/designathon-section-dropdown` |
| `fix/` | Bug fix or styling correction | `fix/attendance-excel-styling` |
| `refactor/` | Structural code improvement | `refactor/modular-admin-dialogs` |
| `docs/` | Documentation & guide updates | `docs/update-readme-and-github` |
| `chore/` | Tooling, build scripts, or packages | `chore/upgrade-dependencies` |

### 2. Conventional Commits
Format your commits with standard types:
```
feat(scope): add new feature
fix(scope): resolve issue description
docs(scope): update documentation
refactor(scope): streamline component logic
```

### 3. Verification Checklist
Before pushing:
```bash
pnpm typecheck
pnpm lint
```

### 4. Open a Pull Request
Push your branch to GitHub and create a Pull Request targeting `main`:
```bash
git push -u origin feat/your-feature-name
```
Our pull request template will automatically guide you through describing the changes and linking relevant tickets.

---

## 🔒 Security Best Practices

- **Never Commit Secrets:** `.env*.local` is explicitly ignored in `.gitignore`.
- **Admin Access:** All administrative endpoints (`/api/admin/*`) require HTTP session cookies validated against `ADMIN_SESSION_SECRET`.
- **Firebase Security Rules:** Firestore security rules restrict write operations for production collections and enforce strict schema boundaries.

---

## 🤝 Community & Connect

- **GitHub Organization:** [github.com/devnest-tech](https://github.com/devnest-tech)
- **Official Repository:** [github.com/devnest-tech/Devnest](https://github.com/devnest-tech/Devnest)
- **Email:** devnest.techclub@gmail.com
- **Institution:** Lamrin Tech Skills University Punjab (LTSU)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built with ❤️ by the **DevNest** Technical Team.
