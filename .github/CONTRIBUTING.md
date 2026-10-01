# Contributing to DevNest

Thank you for your interest in contributing to the **DevNest** web application! DevNest is the premier technical club at Lamrin Tech Skills University Punjab (LTSU).

---

## 🚀 Getting Started

1. **Fork or Clone the Repository:**
   ```bash
   git clone https://github.com/devnest-tech/Devnest.git
   cd Devnest
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   # or npm install
   ```

3. **Set Up Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Configure your Firebase and Admin keys in `.env.local`.

4. **Run Local Dev Server:**
   ```bash
   pnpm dev
   # or npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌿 Git Branching Strategy

Always create a new branch from `main` for your work. Use clean and descriptive branch names prefixed by category:

| Prefix | Usage | Example |
| :--- | :--- | :--- |
| `feat/` | New features or enhancements | `feat/glyph-maintenance-page` |
| `fix/` | Bug fixes or issue resolutions | `fix/registration-dropdown-overflow` |
| `refactor/` | Code refactoring without behavior change | `refactor/attendance-sheet-styling` |
| `docs/` | Documentation improvements | `docs/update-readme-and-workflow` |
| `chore/` | Maintenance, dependencies, or configs | `chore/update-pnpm-lock` |

```bash
# Example: creating and switching to a feature branch
git checkout -b feat/your-feature-name
```

---

## 💬 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>
```

### Examples:
- `feat(glyph): add maintenance notice page for Glyph portal`
- `feat(events): replace Course with Section Name text input with predefined section dropdown`
- `fix(admin): dynamically size attendance sheet slots to match team counts`
- `docs(readme): update repository documentation and git guidelines`

---

## 🎨 Design System & Neobrutalism Standards

DevNest uses a custom **Neobrutalism** aesthetic. When building or modifying UI components, please maintain consistency:
- **Canvas:** `#FAF7EE` (Warm retro cream paper) with architectural dot-grid overlay (`neo-grid-bg`)
- **Strokes:** Bold black borders (`border-2 border-black` or `border-black`)
- **Shadows:** Hard, unblurred drop shadows (`shadow-[2px_2px_0px_#000]`, `shadow-[4px_4px_0px_#000]`)
- **Accents:** Canary yellow (`#FFE600`), Bubblegum pink (`#FF70A6`), Lavender (`#C8B6FF`)
- **Typography:** Poppins (headings), Space Grotesk (subheadings/badges), Manrope/Inter (body)

---

## 🔍 Validation Before Submitting

Before committing or opening a pull request, always verify:

```bash
# 1. Type check
pnpm typecheck

# 2. Lint check
pnpm lint

# 3. Production build verification
pnpm build
```

---

## 📤 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push -u origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch on [devnest-tech/Devnest](https://github.com/devnest-tech/Devnest).
3. Fill out the provided Pull Request template completely with details and screenshots if applicable.
4. Request review from the maintainers.
