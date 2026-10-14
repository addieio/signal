"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Scale, Sparkles, Trash2 } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { useProfileStore } from "@/store/profileStore";
import { useCatalog } from "@/lib/useCatalog";
import { CompareTable } from "@/components/CompareTable";

export default function ComparePage() {
  const { selected, removeEvent, clearCompare, addEvent } = useCompareStore();
  const profile = useProfileStore((state) => state.profile);
  const snapshot = useCatalog();

  const events = useMemo(() => {
    return selected
      .map((entry) => snapshot.events.find((event) => event.id === entry.id || event.slug === entry.slug))
      .filter((event): event is NonNullable<typeof event> => Boolean(event));
  }, [snapshot.events, selected]);

  // Quick compare top 2 if empty
  const handleQuickCompare = () => {
    if (snapshot.events.length >= 2) {
      clearCompare();
      addEvent({ id: snapshot.events[0].id, title: snapshot.events[0].title, slug: snapshot.events[0].slug });
      addEvent({ id: snapshot.events[1].id, title: snapshot.events[1].title, slug: snapshot.events[1].slug });
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text pb-24 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-white/8 pb-6">
          <div>
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-peri hover:underline mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              BACK TO DIRECTORY
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text">
              Side-by-Side Comparison Matrix
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Deep dive into schedule, eligibility, team constraints, awards, and personal fit without clutter or hidden details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {events.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-surface px-4 text-xs font-bold text-muted hover:text-text transition hover:border-neg/40 hover:bg-neg/10 hover:text-neg cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Matrix
              </button>
            )}
            <Link
              href="/home"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-peri/30 bg-peri/10 px-4 text-xs font-bold text-peri transition hover:bg-peri/20"
            >
              <Plus className="h-3.5 w-3.5" />
              Add More Events
            </Link>
          </div>
        </div>

        {/* Content */}
        {events.length >= 2 ? (
          <div className="mt-8">
            <CompareTable events={events} profile={profile} onRemove={removeEvent} />
          </div>
        ) : events.length === 1 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-10 text-center shadow-xl">
            <Scale className="mx-auto h-12 w-12 text-peri" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-text">
              1 Event Selected: &ldquo;{events[0].title}&rdquo;
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Pair this with another hackathon to evaluate side-by-side specs, bounty sizes, rules, and schedules.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const candidate = snapshot.events.find((e) => e.id !== events[0].id);
                  if (candidate) {
                    addEvent({ id: candidate.id, title: candidate.title, slug: candidate.slug });
                  }
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime px-5 text-sm font-bold text-bg hover:opacity-90 shadow-md shadow-lime/20 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Auto-Pair with Top Recommended Event</span>
              </button>
              <Link
                href="/home"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-surface2 px-5 text-sm font-bold text-text hover:bg-surface3"
              >
                Browse Directory to Pick Manually
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-surface p-12 text-center shadow-lg">
            <Scale className="mx-auto h-12 w-12 text-peri" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-text">
              No Hackathons in Comparison Matrix
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Click the &ldquo;Compare&rdquo; button on any event card in the directory to add up to 3 events here for complete side-by-side evaluation.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/home"
                className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/20"
              >
                Browse Directory
              </Link>
              <button
                type="button"
                onClick={handleQuickCompare}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-peri/30 bg-peri/10 px-5 text-sm font-bold text-peri hover:bg-peri/20"
              >
                <Sparkles className="h-4 w-4" />
                Quick Compare Top 2
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
