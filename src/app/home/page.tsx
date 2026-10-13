"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Flame,
  MapPin,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import type { CatalogSnapshot, EventMode, EventSource, EventType } from "@/lib/types";
import { repository } from "@/lib/repository";
import { rankEvents } from "@/lib/ranking";
import { useProfileStore } from "@/store/profileStore";
import { EventCard } from "@/components/EventCard";
import { useCatalog } from "@/lib/useCatalog";
import { TypewriterText } from "@/components/TypewriterText";

const MODES: Array<{ label: string; value: "all" | EventMode }> = [
  { label: "All Formats", value: "all" },
  { label: "Online", value: "online" },
  { label: "In-Person", value: "offline" },
  { label: "Hybrid", value: "hybrid" },
];

const SOURCES: Array<{ label: string; value: "all" | EventSource }> = [
  { label: "All Platforms", value: "all" },
  { label: "Devfolio", value: "devfolio" },
  { label: "Unstop", value: "unstop" },
  { label: "MLH", value: "mlh" },
  { label: "HackerEarth", value: "hackerearth" },
  { label: "Luma Meets", value: "luma" },
];

const TYPES: Array<{ label: string; value: "all" | EventType }> = [
  { label: "All Events", value: "all" },
  { label: "Hackathons", value: "hackathon" },
  { label: "Developer Meets", value: "developer-meet" },
];

const LOCATION_DISPLAY: Record<string, string> = {
  delhi: "Delhi & NCR",
  bangalore: "Bengaluru",
  mumbai: "Mumbai & Pune",
  hyderabad: "Hyderabad",
  pan_india: "Pan-India",
  online: "Online & Remote",
};

export default function HomePage() {
  const profile = useProfileStore((state) => state.profile);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const preferredLoc = (mounted ? profile?.preferredLocation : undefined) || "delhi";
  const snapshot = useCatalog();

  const [query, setQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<"all" | EventMode>("all");
  const [selectedSource, setSelectedSource] = useState<"all" | EventSource>("all");
  const [selectedType, setSelectedType] = useState<"all" | EventType>("all");
  const [sortMode, setSortMode] = useState<"signal" | "fit" | "prizes" | "vibe" | "trust" | "deadline">("signal");
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [showSources, setShowSources] = useState(false);

  const listings = useMemo(() => {
    const filtered = snapshot.events.filter((event) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${event.title} ${event.organizer.name} ${event.city} ${event.venue} ${event.source} ${event.themes.join(
          " "
        )} ${event.prizeLabel || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Mode filter
      if (selectedMode !== "all" && event.mode !== selectedMode) return false;
      // Source filter
      if (selectedSource !== "all" && event.source !== selectedSource) return false;
      // Type filter
      if (selectedType !== "all" && event.type !== selectedType) return false;

      return true;
    });

    if (sortMode === "deadline") {
      const ranked = rankEvents(filtered, profile, "signal");
      ranked.sort((a, b) => {
        const aDate = a.event.registrationClosesAt ? new Date(a.event.registrationClosesAt).getTime() : Infinity;
        const bDate = b.event.registrationClosesAt ? new Date(b.event.registrationClosesAt).getTime() : Infinity;
        return aDate - bDate;
      });
      return ranked;
    }

    return rankEvents(filtered, profile, sortMode);
  }, [snapshot.events, profile, query, selectedMode, selectedSource, selectedType, sortMode]);

  async function sync() {
    setSyncing(true);
    setMessage("");
    try {
      const response = await fetch("/api/scrape", { method: "POST" });
      const data: unknown = await response.json();
      if (!data || typeof data !== "object") throw new Error("Invalid sync response");
      const next = data as CatalogSnapshot;
      const merged = repository.mergeSnapshot(next);
      setMessage(
        `Successfully synced ${next.events.length} fresh listings across ${next.sources.length} platforms! Directory size: ${merged.events.length} events.`
      );
    } catch {
      setMessage("Sync encountered a temporary network issue. Your local catalogue remains active.");
    } finally {
      setSyncing(false);
    }
  }

  const resetFilters = () => {
    setQuery("");
    setSelectedMode("all");
    setSelectedSource("all");
    setSelectedType("all");
    setSortMode("signal");
  };

  const hasActiveFilters =
    Boolean(query) || selectedMode !== "all" || selectedSource !== "all" || selectedType !== "all";

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-250 relative overflow-hidden">
      {/* Floating Animated Ambient Glow Orbs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-primary via-peri to-lime blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -35, 0],
          y: [0, 25, 0],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ repeat: Infinity, duration: 14, delay: 2, ease: "easeInOut" }}
        className="pointer-events-none absolute top-96 -right-40 h-[450px] w-[450px] rounded-full bg-gradient-to-bl from-lime via-emerald-500 to-peri blur-[130px]"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/8 pt-28 pb-12">
        <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Animated Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-peri/30 bg-peri/10 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-peri backdrop-blur"
            >
              <Radio className="h-3.5 w-3.5 text-lime animate-pulse" />
              <span>GLOBAL RADAR · MULTI-PILLAR SIGNAL RANKINGS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-tight sm:leading-[1.22] pb-2 overflow-visible"
            >
              Discover Hackathons <br />
              <TypewriterText
                phrases={[
                  "Ranked for Your Success.",
                  "in New Delhi & NCR.",
                  "in Bengaluru & Across India.",
                  "with ₹10L+ Cash Bounties.",
                  "for AI, Web3 & Tech Builders.",
                  "from Devfolio, Unstop & MLH.",
                ]}
                textClassName="inline-block py-1 pr-2 bg-gradient-to-r from-peri via-lime to-emerald-400 bg-clip-text text-transparent overflow-visible"
                cursorClassName="text-lime"
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
            >
              Factual listings from Devfolio, Unstop, MLH, HackerEarth, and Luma.
              Personalized multi-pillar rankings across Profile Fit, Community Caliber, Organizer Trust, and Bounties.
            </motion.p>
          </div>

          {/* Search Bar & Sync Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface/90 p-3 shadow-2xl shadow-black/40 sm:flex-row backdrop-blur-md"
          >
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-surface2 px-4 focus-within:ring-2 focus-within:ring-peri/40 transition">
              <Search className="h-5 w-5 text-peri shrink-0" aria-hidden="true" />
              <span className="sr-only">Search hackathons</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, city (Delhi, Bangalore), theme (AI, Web3), organizer, platform..."
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-muted hover:text-text cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <button
              type="button"
              onClick={sync}
              disabled={syncing}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-hover active:scale-95 disabled:opacity-60 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 shrink-0 ${syncing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {syncing ? "Scanning Sources..." : "Sync Live Sources"}
            </button>
          </motion.div>

          {/* Sync notification message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-3 flex items-center gap-2 rounded-xl border border-peri/30 bg-peri/10 px-4 py-2.5 text-xs font-semibold text-peri"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-lime" />
              <span>{message}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Directory & Filter Workspace */}
      <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-6 sm:py-8">


        {/* Ranking Algorithm Switcher Bar */}
        <div className="mt-8 rounded-2xl border border-white/8 bg-surface p-3 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-lime" />
                Ranking Pillar:
              </span>
            </div>

            {/* Ranking Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "signal", label: "Signal Overall Score", icon: Sparkles },
                { id: "fit", label: "Personalized Fit", icon: Zap },
                { id: "prizes", label: "Highest Bounties", icon: Trophy },
                { id: "vibe", label: "Community Scale", icon: Flame },
                { id: "trust", label: "Organizer Trust", icon: ShieldCheck },
                { id: "deadline", label: "Closing Soonest", icon: SlidersHorizontal },
              ].map(({ id, label, icon: Icon }) => {
                const isActive = sortMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSortMode(id as "signal" | "fit" | "prizes" | "vibe" | "trust" | "deadline")}
                    className={`relative inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-lime text-bg font-extrabold shadow-sm shadow-lime/30"
                        : "bg-surface2 text-muted hover:text-text hover:bg-surface3"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-col gap-4 border-y border-white/8 py-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Format & Platform chips */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="mr-1 h-4 w-4 text-peri" aria-hidden="true" />

            {/* Platform filter */}
            <div className="flex flex-wrap gap-1.5">
              {SOURCES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedSource(option.value)}
                  className={`min-h-9 rounded-xl px-3 text-xs font-bold transition-all cursor-pointer ${
                    selectedSource === option.value
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "border border-white/8 bg-surface text-muted hover:border-peri/40 hover:text-text"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-white/10 hidden sm:block mx-1" />

            {/* Mode filter */}
            <div className="flex flex-wrap gap-1.5">
              {MODES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedMode(option.value)}
                  className={`min-h-9 rounded-xl px-3 text-xs font-bold transition-all cursor-pointer ${
                    selectedMode === option.value
                      ? "bg-peri/20 text-peri border border-peri/40"
                      : "border border-white/8 bg-surface text-muted hover:border-peri/40 hover:text-text"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Category filter */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as "all" | EventType)}
              className="min-h-9 rounded-xl border border-white/10 bg-surface px-3 text-xs font-bold text-text outline-none hover:border-peri/40 cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-surface text-text">
                  {t.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-muted hover:text-neg transition font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Preferred Hub First-Preference Banner */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-peri/15 via-surface2 to-surface border border-peri/30 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime/20 text-lime border border-lime/30 shadow-xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-lime">
                  1st Preference Active
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              </div>
              <p className="text-sm font-bold text-text mt-0.5">
                Prioritizing top hackathons in{" "}
                <span className="text-peri font-extrabold underline decoration-peri/40 underline-offset-2">
                  {LOCATION_DISPLAY[preferredLoc] || "Delhi & NCR"}
                </span>{" "}
                at the top of your feed
              </p>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-peri hover:text-white px-3.5 py-2 rounded-xl border border-peri/30 bg-peri/10 hover:bg-peri/20 transition active:scale-95 shrink-0 shadow-xs"
          >
            <span>Change Preferred Hub</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Event Listings Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-text">
              Showing {listings.length} Events
            </h2>
            {selectedSource !== "all" && (
              <span className="text-xs font-mono text-peri uppercase">
                Platform: {selectedSource}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
            {listings.map(({ event, ranking, isPreferredHub }, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: Math.min((index % 6) * 0.06, 0.3) }}
              >
                <EventCard
                  event={event}
                  ranking={ranking}
                  rankNumber={index + 1}
                  isPreferredHub={isPreferredHub}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty Search / Filter State */}
        {!listings.length && (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-surface p-12 text-center">
            <Database className="mx-auto h-10 w-10 text-peri" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl font-bold text-text">No Matching Events Found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              {hasActiveFilters
                ? "Try adjusting your search keywords, format, or platform filters to discover more events."
                : "No listings are currently cached. Hit 'Sync Live Sources' above to fetch active hackathons."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
