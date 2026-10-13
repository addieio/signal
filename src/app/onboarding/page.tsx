"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useProfileStore } from "@/store/profileStore";
import { QuizStep, QuizOption } from "@/components/quiz/QuizStep";
import { useTheme } from "@/components/ThemeProvider";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sun,
  Moon,
  Compass,
  Radio,
  Target,
  Award,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import type { UserProfile, SkillLevel } from "@/lib/types";

interface StepConfig {
  title: string;
  subtitle: string;
  maxSelect: number;
  options: QuizOption[];
}

// Exactly symmetrical steps: 6 options (3x2), 12 options (4x3), or 3 options (1x3)
const STEPS: StepConfig[] = [
  // 1. Persona (6 options -> 3x2 / 2x3)
  {
    title: "What's your primary hacker persona?",
    subtitle: "Tell us how you approach hackathons, tech meets, and campus sprints.",
    maxSelect: 1,
    options: [
      { id: "builder", label: "Builder & Hacker", description: "Code fast, ship real working prototypes, live on caffeine", icon: "⚡" },
      { id: "researcher", label: "Researcher & Deep-Tech", description: "ArXiv papers, distributed systems, high compute ML models", icon: "🧠" },
      { id: "designer", label: "Designer & Creative", description: "Figma tokens, buttery micro-interactions, flawless responsive UI", icon: "🎨" },
      { id: "founder", label: "Founder & Networker", description: "Validate PMF, find technical co-founders, pitch active VCs", icon: "🚀" },
      { id: "beginner", label: "Curious Explorer", description: "Attending first few events, looking for welcoming patient mentors", icon: "🌱" },
      { id: "competitor", label: "Competitive Solver", description: "Algorithmic speed, leaderboard rankings, cash bounties", icon: "🏆" },
    ],
  },
  // 2. Preferred Location Hub (6 options -> 3x2 / 2x3)
  {
    title: "Where is your preferred hackathon hub?",
    subtitle: "We will prioritize in-person hackathons and campus meets from your region as your first preference.",
    maxSelect: 1,
    options: [
      { id: "delhi", label: "Delhi & NCR", description: "IIITD, IIT Delhi, NSUT, DTU, Galgotias & Bennett tech hubs", icon: "🏛️" },
      { id: "bangalore", label: "Bengaluru", description: "Koramangala, Indiranagar, RVCE, PES, Whitefield tech corridor", icon: "🚀" },
      { id: "mumbai", label: "Mumbai & Pune", description: "IIT Bombay, COEP, Pune tech parks, BKC dev ecosystems", icon: "🌊" },
      { id: "hyderabad", label: "Hyderabad", description: "IIIT Hyderabad, HITEC City, T-Hub innovation community", icon: "💎" },
      { id: "pan_india", label: "Pan-India", description: "Major Tier-1 campuses across India with travel reimbursements", icon: "🇮🇳" },
      { id: "online", label: "Online & Global Remote", description: "Asynchronous virtual hackathons, MLH seasons & global builds", icon: "🌐" },
    ],
  },
  // 3. Interests (12 options -> 4x3 / 3x4)
  {
    title: "Which domains excite you most?",
    subtitle: "Pick up to 4 tracks you want to build or learn in.",
    maxSelect: 4,
    options: [
      { id: "AI/ML", label: "AI/ML & LLMs", description: "Transformers, agentic loops, RAG, PyTorch architectures", icon: "🤖" },
      { id: "Assistive Tech", label: "Assistive Tech & Social Impact", description: "Hardware sensors, screen readers, accessible interfaces", icon: "♿" },
      { id: "Web3", label: "Web3 & Protocols", description: "Zero-knowledge proofs, smart contracts, decentralized rails", icon: "⛓️" },
      { id: "DevOps", label: "Systems & Infrastructure", description: "Distributed tracing, Kubernetes, Rust, low-latency backends", icon: "⚙️" },
      { id: "Product Design", label: "UI/UX & Product Design", description: "Design systems, ergonomic flows, human-computer interaction", icon: "✨" },
      { id: "Fintech", label: "Fintech & Algorithmic Trading", description: "UPI rails, quant models, order-book execution pipelines", icon: "📈" },
      { id: "Cybersecurity", label: "Cybersecurity & CTF", description: "Binary exploitation, reverse engineering, defensive web security", icon: "🛡️" },
      { id: "Open Source", label: "Open Source & Kernel", description: "Upstream PRs, Linux internals, Git maintainer culture", icon: "🐧" },
      { id: "Robotics", label: "Robotics & Hardware", description: "ROS 2, microcontrollers, autonomous drones, edge devices", icon: "🦾" },
      { id: "Creative Code", label: "Generative Art & Audio", description: "Hydra shaders, live coding, digital humanities, creative tech", icon: "🎶" },
      { id: "Fullstack", label: "Modern Web & Mobile", description: "Next.js, React 19, Turbopack, Tailwind CSS, Flutter", icon: "🌐" },
      { id: "BioTech", label: "Brain-Computer & NeuroTech", description: "EEG headsets, biosensors, medical informatics, healthtech", icon: "🧬" },
    ],
  },
  // 3. Goals (6 options -> 3x2 / 2x3)
  {
    title: "What are your primary goals right now?",
    subtitle: "What makes an event genuinely worth a weekend of your time?",
    maxSelect: 3,
    options: [
      { id: "Win Cash Bounties", label: "Win Cash Bounties & Grants", description: "Substantial pools and transparent judging criteria", icon: "💰" },
      { id: "Build Portfolio", label: "Build Stellar Portfolio Project", description: "Ship an end-to-end demo people actually use in production", icon: "📂" },
      { id: "Meet Co-Founders", label: "Meet Co-Founders & Builders", description: "Find complementary teammates who actually ship code", icon: "🤝" },
      { id: "Fast-Track Hiring", label: "Land High-Impact Tech Roles", description: "Fast-track interview shortlists with top-tier tech startups", icon: "💼" },
      { id: "Learn New Stack", label: "Master a Hard Technical Skill", description: "Hands-on labs and zero-fluff live debugging sessions", icon: "📚" },
      { id: "1:1 Mentorship", label: "Get 1:1 Senior Mentorship", description: "Real guidance from engineers who have scaled systems", icon: "🧭" },
    ],
  },
  // 4. Skill Level (3 options -> 1x3)
  {
    title: "How would you describe your technical tier?",
    subtitle: "We use this to ensure you're never bored and never overwhelmed.",
    maxSelect: 1,
    options: [
      { id: "beginner", label: "Beginner / Explorer", description: "Still building fundamentals. Need patient guidance and friendly vibes.", icon: "🌱" },
      { id: "intermediate", label: "Intermediate / Builder", description: "Comfortable with Git, APIs, and building working MVPs over a weekend.", icon: "🛠️" },
      { id: "advanced", label: "Advanced / Specialist", description: "Deep systems or ML chops. Crave hardcore competition and peer caliber.", icon: "⚡" },
    ],
  },
  // 5. Format Preferences (3 options -> 1x3)
  {
    title: "Where do you prefer to compete and collaborate?",
    subtitle: "Choose formats that fit your lifestyle and schedule.",
    maxSelect: 2,
    options: [
      { id: "In-Person Campus", label: "Offline Campus Hackathons", description: "36-hour lock-in, face-to-face team synergy, physical venues", icon: "🏛️" },
      { id: "Virtual Hackathons", label: "Online Virtual Sprints", description: "Asynchronous coding from your home setup with global participants", icon: "💻" },
      { id: "Hybrid Summits", label: "Hybrid Tech Summits", description: "Conferences with talk tracks, lounges, and live stream submissions", icon: "🌐" },
    ],
  },
  // 6. Priorities (6 options -> 3x2 / 2x3)
  {
    title: "Pick your Top 3 Non-Negotiable Priorities",
    subtitle: "What usually makes or breaks a hackathon experience for you?",
    maxSelect: 3,
    options: [
      { id: "Mentorship & Guidance", label: "World-Class Mentorship", description: "Senior engineers who sit with your team and review code", icon: "👨‍🏫" },
      { id: "High-speed Wi-Fi", label: "Flawless Gigabit Wi-Fi", description: "Zero packet loss and guaranteed LAN ports at desks", icon: "📶" },
      { id: "Free Food & Snacks", label: "Hygienic Midnight Catering", description: "Proper hot meals and uninterrupted caffeine station", icon: "🍕" },
      { id: "Quality Swag", label: "Custom Swag & Cloud Perks", description: "Heavyweight hoodies, custom keycaps, and $1,000+ credits", icon: "🎁" },
      { id: "Honest Judging", label: "Transparent & Fair Judging", description: "Technical depth evaluated over slide-deck theater", icon: "⚖️" },
      { id: "Big Prize Pools", label: "Substantial Cash Prize Pool", description: "Verified cash rewards paid directly to winning teams", icon: "💎" },
    ],
  },
  // 7. Social Vibe (3 options -> 1x3)
  {
    title: "What is your preferred social dynamic?",
    subtitle: "How do you prefer to experience the floor during a 36-hour sprint?",
    maxSelect: 1,
    options: [
      { id: "Solo Wolf", label: "Solo Wolf (Deep Focus)", description: "Laser-focused coding in quiet corners with headphones on", icon: "🐺" },
      { id: "Small Crew", label: "Small Close-Knit Crew (2-4)", description: "Cohesive team with divided roles and tight syncs", icon: "👥" },
      { id: "Big Room", label: "Big Room (Massive Spectacle)", description: "Electrifying 500+ hacker auditoriums with nonstop energy", icon: "🏟️" },
    ],
  },
];

const LOCATION_DISPLAY: Record<string, string> = {
  delhi: "Delhi & NCR",
  bangalore: "Bengaluru",
  mumbai: "Mumbai & Pune",
  hyderabad: "Hyderabad",
  pan_india: "Pan-India",
  online: "Online & Remote",
};

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useProfileStore((state) => state.setProfile);
  const { theme, toggleTheme } = useTheme();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({
    0: ["builder"],
    1: ["delhi"],
    2: ["AI/ML", "Assistive Tech"],
    3: ["Build Portfolio", "1:1 Mentorship"],
    4: ["intermediate"],
    5: ["In-Person Campus"],
    6: ["Mentorship & Guidance", "High-speed Wi-Fi"],
    7: ["Small Crew"],
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const step = STEPS[currentStep];
  const selected = answers[currentStep] || [];

  const handleSelect = (id: string) => {
    if (step.maxSelect === 1) {
      setAnswers((prev) => ({ ...prev, [currentStep]: [id] }));
      return;
    }

    // Multi-select
    if (selected.includes(id)) {
      setAnswers((prev) => ({
        ...prev,
        [currentStep]: selected.filter((item) => item !== id),
      }));
    } else {
      if (selected.length < step.maxSelect) {
        setAnswers((prev) => ({
          ...prev,
          [currentStep]: [...selected, id],
        }));
      }
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    const profile: UserProfile = {
      name: "Student Hacker",
      persona: answers[0]?.[0] || "builder",
      preferredLocation: answers[1]?.[0] || "delhi",
      interests: answers[2] || ["AI/ML"],
      goals: answers[3] || ["Build Portfolio"],
      skillLevel: (answers[4]?.[0] || "intermediate") as SkillLevel,
      formatPrefs: answers[5] || ["In-Person Campus"],
      priorities: answers[6] || ["Mentorship & Guidance"],
      socialVibe: answers[7]?.[0] || "Small Crew",
    };

    setProfile(profile);
    setIsCompleted(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C6FF4A", "#A5B4FC", "#6366F1", "#38BDF8", "#FFFFFF"],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleGoHome = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-250 flex flex-col justify-center items-center py-6 sm:py-12 px-3 sm:px-6 relative overflow-hidden">
      {/* Dynamic Animated Ambient Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 30, 0],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-primary via-peri to-lime blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ repeat: Infinity, duration: 14, delay: 1.5, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-lime via-emerald-500 to-peri blur-[130px]"
      />

      {/* Cyber Grid Pattern Background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Top Header with Theme Toggle & Return Link */}
      <div className="w-full max-w-4xl mb-4 sm:mb-6 flex items-center justify-between px-1 relative z-20">
        <Link href="/home" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-white text-base font-display shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold tracking-tight text-lg text-text flex items-center gap-1.5">
              Signal <span className="text-peri text-xs font-mono font-normal">/ Vibe Check</span>
            </span>
            <span className="text-[10px] font-mono text-muted tracking-wider uppercase">
              Algorithmic Event Fit
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface2 text-text hover:border-peri/40 transition active:scale-95 cursor-pointer shadow-xs"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>

          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-surface2 text-xs font-semibold text-muted hover:text-text hover:bg-surface3 transition shadow-xs"
          >
            <Compass className="h-3.5 w-3.5 text-lime" />
            <span className="hidden xs:inline">Skip to Radar</span>
          </Link>
        </div>
      </div>

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="quiz-card-wrapper"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-3xl border border-white/12 bg-surface/85 backdrop-blur-xl p-3 sm:p-8 shadow-2xl shadow-black/40"
            >
              <QuizStep
                key="quiz-active"
                stepIndex={currentStep}
                totalSteps={STEPS.length}
                title={step.title}
                subtitle={step.subtitle}
                options={step.options}
                selectedIds={selected}
                maxSelect={step.maxSelect}
                onSelect={handleSelect}
                onNext={handleNext}
                onBack={handleBack}
                isFirstStep={currentStep === 0}
                canProceed={selected.length > 0}
              />
            </motion.div>
          ) : (
            <motion.div
              key="quiz-result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full mx-auto p-6 sm:p-9 rounded-3xl bg-surface/90 backdrop-blur-xl border border-white/12 shadow-2xl relative z-10 text-center"
            >
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peri/15 border border-peri/30 text-peri text-xs font-mono font-bold mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-lime animate-spin" />
                <span>VIBE SIGNATURE CALIBRATED</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-text tracking-tight mb-2.5">
                Your Signal Profile is Ready
              </h2>
              <p className="text-muted text-xs sm:text-sm mb-7 max-w-md mx-auto leading-relaxed">
                We calibrated your preferences across our multi-pillar ranking engine. Generic marketing noise is filtered out — only verified, high-signal hackathons will reach your feed.
              </p>

              {/* Profile Card Breakdown */}
              <div className="p-5 sm:p-6 rounded-2xl bg-surface2/80 border border-white/10 text-left mb-8 space-y-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-lime" />
                    <span className="text-xs font-mono text-muted font-bold uppercase">Hacker Archetype</span>
                  </div>
                  <span className="text-sm font-bold text-lime capitalize font-display">
                    {answers[0]?.[0] || "Builder & Hacker"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-peri" />
                    <span className="text-xs font-mono text-muted font-bold uppercase">Preferred Hub</span>
                  </div>
                  <span className="text-sm font-bold text-peri font-display">
                    {LOCATION_DISPLAY[answers[1]?.[0] || "delhi"] || "Delhi & NCR"}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono text-muted font-bold uppercase block mb-2">Priority Focus Tracks</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(answers[2] || ["AI/ML"]).map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-surface text-xs text-peri border border-white/10 font-semibold shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-muted font-bold uppercase block mb-2">Non-Negotiable Priorities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(answers[6] || ["World-Class Mentorship"]).map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-xs text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5 shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Signal Radar Note */}
                <div className="pt-3.5 border-t border-white/10 flex items-start gap-3 text-xs text-text bg-peri/10 p-3.5 rounded-xl border border-peri/20">
                  <Zap className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-peri font-bold">First Preference Active:</strong> Hackathons in{" "}
                    <strong className="text-lime">{LOCATION_DISPLAY[answers[1]?.[0] || "delhi"] || "Delhi & NCR"}</strong> are prioritized at the top of your homepage feed, backed by verified live organizer links and confirmed prize pools.
                  </span>
                </div>
              </div>

              {/* Call to action */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center">
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold font-display text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-primary/25 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Explore My Ranked Feed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentStep(0);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-surface2 text-muted hover:text-text text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border border-white/10 hover:bg-surface3 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recalibrate Quiz</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
