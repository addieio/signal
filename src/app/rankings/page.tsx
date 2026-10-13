"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Filter,
  Flame,
  Globe,
  MapPin,
  Medal,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useCatalog } from "@/lib/useCatalog";
import { useProfileStore } from "@/store/profileStore";
import { rankEvents } from "@/lib/ranking";
import { EventCard } from "@/components/EventCard";
import { MatchRing } from "@/components/MatchRing";
import type { EventMode, EventSource, EventType } from "@/lib/types";

type LocationFilter = "all" | "delhi" | "bangalore" | "mumbai" | "hyderabad" | "online" | "international";
type TimeFilter = "all" | "october" | "closing_soon" | "upcoming";

export default function RankingsPage() {
  const profile = useProfileStore((state) => state.profile);
  const snapshot = useCatalog();

  // Ranking & Filter State
  const [rankingMode, setRankingMode] = useState<"signal" | "fit" | "prizes" | "vibe" | "trust">("signal");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [modeFilter, setModeFilter] = useState<"all" | EventMode>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | EventSource>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | EventType>("all");

  const rankedList = useMemo(() => {
    // 1. Filter events based on all criteria
    const filtered = snapshot.events.filter((e) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = `${e.title} ${e.organizer.name} ${e.city} ${e.venue} ${e.source} ${e.themes.join(" ")} ${e.prizeLabel || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Location filter
      if (locationFilter !== "all") {
        const city = (e.city || "").toLowerCase();
        const venue = (e.venue || "").toLowerCase();
        const country = (e.country || "").toLowerCase();

        if (locationFilter === "delhi") {
          // Strict Delhi / NCR matching
          const isDelhi = /delhi/i.test(city) || /delhi/i.test(venue);
          const isNCR = /noida|gurugram|gurgaon|ghaziabad|faridabad/i.test(`${city} ${venue}`);
          if (!isDelhi && !isNCR) return false;
        } else if (locationFilter === "bangalore") {
          if (!/bangalore|bengaluru/i.test(`${city} ${venue}`)) return false;
        } else if (locationFilter === "mumbai") {
          if (!/mumbai|bombay|pune/i.test(`${city} ${venue}`)) return false;
        } else if (locationFilter === "hyderabad") {
          if (!/hyderabad|telangana/i.test(`${city} ${venue}`)) return false;
        } else if (locationFilter === "online") {
          if (e.mode !== "online" && !/online|virtual|global/i.test(city)) return false;
        } else if (locationFilter === "international") {
          if (
            country.includes("india") ||
            /india|delhi|bengaluru|bangalore|mumbai|pune|hyderabad|kolkata|chennai|noida|ghaziabad/i.test(`${city} ${venue}`)
          ) {
            return false;
          }
        }
      }

      // Format / Mode filter
      if (modeFilter !== "all") {
        if (modeFilter === "online" && e.mode !== "online") return false;
        if (modeFilter === "offline" && e.mode !== "offline") return false;
        if (modeFilter === "hybrid" && e.mode !== "hybrid") return false;
      }

      // Time / Schedule filter
      if (timeFilter !== "all") {
        const dl = (e.dateLabel || "").toLowerCase();
        const starts = (e.startsAt || "").toLowerCase();
        const ends = (e.endsAt || "").toLowerCase();

        if (timeFilter === "october") {
          const isOct = dl.includes("oct") || starts.includes("-10-") || ends.includes("-10-");
          if (!isOct) return false;
        } else if (timeFilter === "closing_soon") {
          if (!e.registrationClosesAt) return false;
          const closes = new Date(e.registrationClosesAt).getTime();
          const baseTime = snapshot.syncedAt ? new Date(snapshot.syncedAt).getTime() : 1791882000000;
          // Closes within 30 days
          if (closes < baseTime || closes > baseTime + 30 * 24 * 60 * 60 * 1000) return false;
        } else if (timeFilter === "upcoming") {
          const year = starts.slice(0, 4);
          if (year && parseInt(year, 10) < 2026) return false;
        }
      }

      // Platform / Source filter
      if (sourceFilter !== "all" && e.source !== sourceFilter) return false;

      // Event Type filter
      if (typeFilter !== "all" && e.type !== typeFilter) return false;

      return true;
    });

    // 2. Rank remaining events
    return rankEvents(filtered, profile, rankingMode);
  }, [
    snapshot.events,
    snapshot.syncedAt,
    profile,
    rankingMode,
    searchQuery,
    locationFilter,
    modeFilter,
    timeFilter,
    sourceFilter,
    typeFilter,
  ]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setModeFilter("all");
    setTimeFilter("all");
    setSourceFilter("all");
    setTypeFilter("all");
    setRankingMode("signal");
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    locationFilter !== "all" ||
    modeFilter !== "all" ||
    timeFilter !== "all" ||
    sourceFilter !== "all" ||
    typeFilter !== "all";

  return (
    <main className="min-h-screen bg-bg text-text pb-28 pt-24 transition-colors duration-250">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-peri hover:underline mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          BACK TO DIRECTORY
        </Link>

        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/8 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-0.5 text-xs font-mono font-bold uppercase text-lime mb-2">
              <Medal className="h-3.5 w-3.5" />
              <span>GLOBAL SIGNAL LEADERBOARD</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text">
              Hackathon Multi-Pillar Rankings
            </h1>
            <p className="mt-2 text-sm text-muted max-w-2xl">
              Transparent, algorithmic ranking powered by 4 objective pillars: Profile Affinity, Community Scale, Organizer Trust, and Bounties. Filterable by location, date, format, and platform.
            </p>
          </div>

          {/* Ranking Mode Selector */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-surface p-1.5 shadow-md">
            {[
              { id: "signal", label: "Signal Score", icon: Sparkles },
              { id: "fit", label: "Personal Fit", icon: Zap },
              { id: "prizes", label: "Top Bounties", icon: Trophy },
              { id: "vibe", label: "Community Scale", icon: Flame },
              { id: "trust", label: "Organizer Trust", icon: ShieldCheck },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRankingMode(id as "signal" | "fit" | "prizes" | "vibe" | "trust")}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  rankingMode === id
                    ? "bg-lime text-bg shadow-sm font-extrabold"
                    : "text-muted hover:text-text hover:bg-surface2"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comprehensive Filters Bar */}
        <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 shadow-lg">
          {/* Top Row: Search Input & Quick Action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rankings by name, tech track (AI, Web3), organizer, or prize..."
                className="w-full rounded-xl border border-white/10 bg-surface2 pl-10 pr-10 py-2.5 text-xs text-text placeholder:text-muted focus:border-peri/60 focus:outline-none focus:ring-1 focus:ring-peri/40 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neg/30 bg-neg/10 px-4 py-2.5 text-xs font-bold text-neg hover:bg-neg/20 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Filter Pills Groups */}
          <div className="grid gap-3 pt-2 border-t border-white/8 text-xs">
            {/* 1. Location Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-muted uppercase flex items-center gap-1 min-w-[80px]">
                <MapPin className="h-3.5 w-3.5 text-peri" /> Location:
              </span>
              {[
                { id: "all", label: "All Hubs" },
                { id: "delhi", label: "Delhi / NCR" },
                { id: "bangalore", label: "Bengaluru" },
                { id: "mumbai", label: "Mumbai / Pune" },
                { id: "hyderabad", label: "Hyderabad" },
                { id: "online", label: "Online / Global" },
                { id: "international", label: "North America & Europe" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLocationFilter(id as LocationFilter)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    locationFilter === id
                      ? "bg-primary text-white shadow-sm font-extrabold"
                      : "bg-surface2 text-muted hover:text-text hover:bg-surface3"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 2. Format / Mode Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-muted uppercase flex items-center gap-1 min-w-[80px]">
                <Globe className="h-3.5 w-3.5 text-lime" /> Format:
              </span>
              {[
                { id: "all", label: "All Formats" },
                { id: "offline", label: "In-Person / Offline" },
                { id: "online", label: "Online / Remote" },
                { id: "hybrid", label: "Hybrid" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setModeFilter(id as "all" | EventMode)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    modeFilter === id
                      ? "bg-lime text-bg shadow-sm font-black"
                      : "bg-surface2 text-muted hover:text-text hover:bg-surface3"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 3. Time / Schedule Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-muted uppercase flex items-center gap-1 min-w-[80px]">
                <Calendar className="h-3.5 w-3.5 text-amber-400" /> Timeline:
              </span>
              {[
                { id: "all", label: "All Dates" },
                { id: "october", label: "Happening in October" },
                { id: "closing_soon", label: "Closing Within 30 Days" },
                { id: "upcoming", label: "2026/2027 Season" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTimeFilter(id as TimeFilter)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    timeFilter === id
                      ? "bg-amber-400 text-bg shadow-sm font-black"
                      : "bg-surface2 text-muted hover:text-text hover:bg-surface3"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 4. Platform & Type Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-muted uppercase flex items-center gap-1 min-w-[80px]">
                <Filter className="h-3.5 w-3.5 text-primary" /> Source:
              </span>
              {[
                { id: "all", label: "All Platforms" },
                { id: "devfolio", label: "Devfolio" },
                { id: "unstop", label: "Unstop" },
                { id: "mlh", label: "MLH" },
                { id: "hackerearth", label: "HackerEarth" },
                { id: "luma", label: "Luma (Meets)" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSourceFilter(id as "all" | EventSource)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    sourceFilter === id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface2 text-muted hover:text-text hover:bg-surface3"
                  }`}
                >
                  {label}
                </button>
              ))}

              <span className="mx-2 text-white/20 hidden sm:inline">|</span>

              {[
                { id: "all", label: "All Types" },
                { id: "hackathon", label: "Hackathons Only" },
                { id: "developer-meet", label: "Developer Meets" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTypeFilter(id as "all" | EventType)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    typeFilter === id
                      ? "border border-lime/40 bg-lime/10 text-lime font-black"
                      : "bg-surface2 text-muted hover:text-text hover:bg-surface3"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Podium Cards for Current Filtered Slice */}
        <AnimatePresence mode="wait">
          {rankedList.length >= 3 && (
            <motion.div
              key={`${locationFilter}-${modeFilter}-${timeFilter}-${rankingMode}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="mt-8"
            >
              <h2 className="text-xs font-mono uppercase text-muted font-bold tracking-wider mb-4 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>
                  Podium Leaders · Top 3 in {locationFilter === "all" ? "Worldwide" : locationFilter.toUpperCase()}
                </span>
              </h2>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
                {rankedList.slice(0, 3).map(({ event, ranking }, rankIndex) => {
                  const podiumColors = [
                    "from-amber-400/20 via-surface to-surface border-amber-400/40 text-amber-300",
                    "from-slate-300/20 via-surface to-surface border-slate-300/40 text-slate-200",
                    "from-amber-700/20 via-surface to-surface border-amber-700/40 text-amber-600",
                  ];

                  return (
                    <div
                      key={event.id}
                      className={`relative overflow-hidden rounded-xl sm:rounded-2xl border bg-gradient-to-b p-2 sm:p-5 shadow-2xl ${podiumColors[rankIndex]}`}
                    >
                      <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="flex h-6 w-6 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-surface2 font-display font-black text-xs sm:text-sm">
                            #{rankIndex + 1}
                          </span>
                          <span className="text-[8px] sm:micro-label text-peri truncate">{event.source}</span>
                        </div>
                        <div className="sm:hidden">
                          <MatchRing score={ranking.total} size={24} strokeWidth={3} />
                        </div>
                        <div className="hidden sm:block">
                          <MatchRing score={ranking.total} size={44} strokeWidth={4} />
                        </div>
                      </div>

                      <h3 className="font-display text-xs sm:text-base font-bold text-text line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs text-muted truncate">{event.organizer.name}</p>

                      <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-1.5 border-t border-white/8 pt-1.5 sm:pt-3 text-[9px] sm:text-xs text-slate-300">
                        <div className="flex justify-between gap-1">
                          <span className="text-muted hidden sm:inline">Format:</span>
                          <span className="font-semibold truncate">{event.mode === "online" ? "Virtual" : event.city}</span>
                        </div>
                        <div className="flex justify-between gap-1">
                          <span className="text-muted hidden sm:inline">Dates:</span>
                          <span className="font-semibold truncate">{event.dateLabel}</span>
                        </div>
                        {event.prizeLabel && (
                          <div className="flex justify-between gap-1 text-amber-300 font-semibold">
                            <span className="hidden sm:inline">Prize:</span>
                            <span className="truncate">{event.prizeLabel}</span>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/event/${event.slug}`}
                        className="mt-2 sm:mt-4 block text-center rounded-lg sm:rounded-xl bg-surface2 hover:bg-surface3 py-1.5 sm:py-2 text-[9px] sm:text-xs font-bold text-text transition"
                      >
                        <span className="sm:hidden">Specs →</span>
                        <span className="hidden sm:inline">Inspect Specs &amp; Rationale →</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complete Ranked Directory */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-text">
                Leaderboard ({rankedList.length} Verified Events)
              </h2>
              {hasActiveFilters && (
                <p className="text-xs text-muted mt-0.5">
                  Showing events matching active filters.
                </p>
              )}
            </div>
            <span className="text-xs font-mono text-muted uppercase">
              Ranked by: {rankingMode}
            </span>
          </div>

          {rankedList.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5"
            >
              {rankedList.map(({ event, ranking, isPreferredHub }, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  ranking={ranking}
                  rankNumber={index + 1}
                  isPreferredHub={isPreferredHub}
                />
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-surface p-12 text-center shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface2 text-muted mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-text">
                No events match this filter combination
              </h3>
              <p className="mt-1 text-xs text-muted max-w-md mx-auto">
                Try loosening your filters (e.g. choose &ldquo;All Hubs&rdquo; or &ldquo;All Formats&rdquo;) to view the rest of our verified directory.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:bg-primary-hover cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
