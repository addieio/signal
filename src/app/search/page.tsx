"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";
import { useCatalog } from "@/lib/useCatalog";
import { useProfileStore } from "@/store/profileStore";
import { rankEvents } from "@/lib/ranking";
import { EventCard } from "@/components/EventCard";
import type { EventMode, EventSource } from "@/lib/types";

export default function SearchPage() {
  const profile = useProfileStore((state) => state.profile);
  const snapshot = useCatalog();

  const [query, setQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<"all" | EventSource>("all");
  const [selectedMode, setSelectedMode] = useState<"all" | EventMode>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Collect all unique themes
  const allThemes = useMemo(() => {
    const set = new Set<string>();
    snapshot.events.forEach((e) => e.themes.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 15);
  }, [snapshot.events]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return snapshot.events.filter((event) => {
      if (q) {
        const text = `${event.title} ${event.organizer.name} ${event.city} ${event.venue} ${event.themes.join(
          " "
        )} ${event.description || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      if (selectedSource !== "all" && event.source !== selectedSource) return false;
      if (selectedMode !== "all" && event.mode !== selectedMode) return false;
      if (selectedTag !== "all" && !event.themes.includes(selectedTag)) return false;
      return true;
    });
  }, [snapshot.events, query, selectedSource, selectedMode, selectedTag]);

  const ranked = useMemo(() => rankEvents(filtered, profile), [filtered, profile]);

  const clearAll = () => {
    setQuery("");
    setSelectedSource("all");
    setSelectedMode("all");
    setSelectedTag("all");
  };

  return (
    <main className="min-h-screen bg-bg text-text pb-28 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-peri hover:underline mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          BACK TO DIRECTORY
        </Link>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text">
          Faceted Search & Discovery
        </h1>
        <p className="mt-2 text-sm text-muted">
          Find hackathons across 5 global platforms filtered by domain, tech stack, and prize bounty.
        </p>

        {/* Search Input */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-surface p-2 shadow-xl">
          <label className="flex flex-1 items-center gap-3 px-3">
            <Search className="h-5 w-5 text-peri shrink-0" />
            <span className="sr-only">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, tech track, college, city..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
          </label>
          {query && (
            <button type="button" onClick={() => setQuery("")} className="p-2 text-muted hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Theme Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-muted uppercase mr-1">Popular:</span>
          {allThemes.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? "all" : tag)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                selectedTag === tag
                  ? "bg-peri text-bg font-bold shadow-sm"
                  : "bg-surface2 text-slate-300 hover:border-peri/40 border border-white/6"
              }`}
            >
              {tag}
            </button>
          ))}
          {(selectedTag !== "all" || selectedSource !== "all" || selectedMode !== "all" || query) && (
            <button
              type="button"
              onClick={clearAll}
              className="ml-2 text-xs font-bold text-neg hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Results */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-200 mb-4">
            Showing {ranked.length} results matching your search criteria
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
            {ranked.map(({ event, ranking }, i) => (
              <EventCard key={event.id} event={event} ranking={ranking} rankNumber={i + 1} />
            ))}
          </div>

          {!ranked.length && (
            <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-surface p-12 text-center">
              <p className="font-display text-xl font-bold text-text">No results found for &ldquo;{query}&rdquo;</p>
              <p className="mt-2 text-sm text-muted">Try clearing the tag filter or broadening your search keywords.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
