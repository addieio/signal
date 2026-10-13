# ⚡ Signal — Hackathon Discovery & Algorithmic Ranking Radar

> **Intelligent, multi-pillar discovery engine for hackathons and developer meetups across India and globally.**  
> Grounded strictly in verified, live-scraped event data from Devfolio, Unstop, Major League Hacking (MLH), HackerEarth, and Luma.

---

## 🌟 Highlights & Key Capabilities

- 🎯 **Algorithmic Multi-Pillar Ranking**
  - **Profile Fit (35% - 50%)**: Domain alignment (AI/ML, Web3, Systems, Design), format preferences, and primary hacker objectives.
  - **Community Scale (25%)**: Participant caliber, scale, peer network depth, and mentorship presence.
  - **Organizer Trust (20%)**: Host reputation rating, past editions, verification badges, and tier credibility.
  - **ROI & Bounties (20%)**: Confirmed cash pools, hiring shortlists, VC pitch access, and verified bounties.

- 📍 **Personalized Preferred Hub Priority**
  - Interactive **Vibe Check Quiz** calibrates each builder's profile upon arrival.
  - Users select their preferred location hub (**Delhi & NCR**, **Bengaluru**, **Mumbai & Pune**, **Hyderabad**, **Pan-India**, or **Online & Remote**).
  - The homepage dynamically applies **1st Preference Priority**, displaying top verified hackathons from your region first with dedicated hub match indicators.

- 🤖 **Signal AI Genie Discovery Copilot**
  - Conversational AI discovery assistant grounded strictly in our live verified catalogue.
  - Real-time queries: *"Hackathons in Delhi in October"*, *"Top cash prizes in AI & LLMs"*, or *"Luma developer meetups"*.
  - Strict anti-hallucination rules prevent fake listings or mixed-up cities.

- ⚖️ **Side-by-Side Event Compare Tray**
  - Compare up to 4 hackathons simultaneously.
  - Detailed breakdown matrix analyzing prizes, deadlines, formats, verified links, and Signal scores.

- 🎨 **State-of-the-Art Aesthetic UI/UX**
  - Native **Dark & Light Mode** with harmonious tokenized typography and contrast controls.
  - Smooth Framer Motion micro-interactions, responsive grids, animated ambient glow orbs, and typewriter text headers.
  - Mobile-first responsive layout tailored for builders on any screen size.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, Custom CSS tokens, Base UI primitives
- **Animation**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **State Management**: Zustand with persistent storage (`localStorage`)
- **Validation**: Zod schema validation
- **Backend / Intelligence**: Next.js Server Route Handlers + Signal AI Engine

---

## 📁 Repository Structure

```
signal/
├── public/                # Static assets, branding logos, and imagery
│   ├── brand/             # Verified organizer and hackathon imagery
│   └── signal-logo.png    # Official Signal brand icon
├── scripts/
│   └── scrape.js          # Standalone CLI nationwide multi-platform scraper
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── genie/     # Signal AI Genie copilot route handler
│   │   │   └── scrape/    # Live multi-platform ingest route handler
│   │   ├── compare/       # Side-by-side comparison matrix page
│   │   ├── event/[slug]/  # Deep-dive event specification & review page
│   │   ├── genie/         # Fullscreen Signal AI Genie chat workspace
│   │   ├── home/          # Main feed with 1st-preference hub rankings
│   │   ├── onboarding/    # Symmetrical Vibe Check calibration quiz
│   │   ├── profile/       # Builder profile view and customization
│   │   ├── rankings/      # Interactive leaderboard with multi-axis filters
│   │   ├── search/        # Instant keyword search directory
│   │   ├── globals.css    # Design system tokens and styling rules
│   │   ├── layout.tsx     # Global layout with ThemeProvider and Navigation
│   │   └── page.tsx       # Root entry redirecting to onboarding
│   ├── components/
│   │   ├── quiz/          # Pixel-perfect symmetrical quiz cards
│   │   ├── CompareTray.tsx# Persistent bottom comparison drawer
│   │   ├── EventCard.tsx  # Interactive hackathon card with MatchRing
│   │   ├── GenieChat.tsx  # Conversational assistant UI
│   │   ├── MatchRing.tsx  # SVG circular score visualizer
│   │   ├── Navbar.tsx     # Responsive navigation with dark/light toggle
│   │   └── WhyRankModal.tsx # Transparent ranking score breakdown modal
│   ├── lib/
│   │   ├── initialCatalog.ts # Verified real hackathon snapshot
│   │   ├── ranking.ts     # Multi-pillar ranking math and hub sorting
│   │   ├── repository.ts  # Catalog snapshot management and caching
│   │   ├── signalGenie.ts # Signal AI intelligent reasoning layer
│   │   └── types.ts       # TypeScript schemas and data contracts
│   └── store/
│       ├── compareStore.ts# Multi-event compare state
│       └── profileStore.ts# User profile and hub preference store
├── .gitignore             # Safe exclusion rules (.env*, .next, node_modules)
├── package.json           # Scripts and dependencies
└── tsconfig.json          # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ recommended
- **npm** or **pnpm**

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/signal.git
cd signal
npm install
```

### 3. Environment Variables (Optional for AI Copilot)

Create a `.env.local` file in the root directory:

```env
# Optional: Enables Signal AI Genie reasoning
GEMINI_API_KEY=your_api_key_here
```

*(If no API key is supplied, Signal Genie automatically and gracefully operates using its deterministic catalog radar matcher with zero downtime.)*

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## 🛡️ License

Built for students and developers worldwide. Released under the [MIT License](LICENSE).
