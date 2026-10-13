"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ExternalLink,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCatalog } from "@/lib/useCatalog";
import { useProfileStore } from "@/store/profileStore";
import { useCompareStore } from "@/store/compareStore";
import { computeRanking } from "@/lib/ranking";
import { GradientPoster } from "@/components/GradientPoster";

function FactCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-surface p-5 shadow-lg">
      <div className="flex items-center gap-2 text-peri">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="micro-label text-muted">{label}</span>
      </div>
      <p className="mt-2 font-display text-base font-bold text-text leading-snug">
        {value || "Not supplied by official source"}
      </p>
      {subtext && <p className="mt-1 text-xs text-muted">{subtext}</p>}
    </div>
  );
}

export default function EventPage() {
  const params = useParams<{ slug: string }>();
  const profile = useProfileStore((state) => state.profile);
  const snapshot = useCatalog();
  const { selected, addEvent, removeEvent } = useCompareStore();

  const event = useMemo(
    () => snapshot.events.find((candidate) => candidate.slug === params.slug || candidate.id === params.slug),
    [snapshot.events, params.slug]
  );

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-32 text-center">
        <h1 className="font-display text-3xl font-bold text-text">Event Not Found in Directory</h1>
        <p className="mt-3 text-muted">
          This event may have been updated or moved. Return to the directory to browse current listings.
        </p>
        <Link
          href="/home"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/20"
        >
          Browse Directory
        </Link>
      </div>
    );
  }

  const ranking = computeRanking(event, profile);
  const compared = selected.some((entry) => entry.id === event.id);

  const toggleCompare = () => {
    if (compared) {
      removeEvent(event.id);
    } else {
      addEvent({ id: event.id, title: event.title, slug: event.slug });
    }
  };

  return (
    <main className="min-h-screen bg-bg text-text pb-28 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-peri hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          BACK TO ALL HACKATHONS
        </Link>

        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-start">
          {/* Banner Image */}
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <GradientPoster
              gradient={event.posterGradient}
              title={event.title}
              imageUrl={event.bannerUrl}
              platform={event.source}
              type={event.type}
              heightClass="aspect-[16/10] w-full"
            />
          </div>

          {/* Quick Info & Outbound CTA */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-surface p-6 sm:p-8 shadow-2xl shadow-black/25">
            <div className="flex items-center justify-between gap-2">
              <span className="micro-label text-peri">{event.source} · OFFICIAL LISTING</span>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-mono font-bold uppercase ${
                  event.registrationStatus === "open"
                    ? "bg-pos/20 text-pos border border-pos/40"
                    : "bg-surface2 text-muted border border-white/8"
                }`}
              >
                {event.registrationStatus}
              </span>
            </div>

            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-text leading-tight">
              {event.title}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-peri shrink-0" />
              <span>Organized by <strong className="text-text">{event.organizer.name}</strong></span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-4">
              {event.description || event.blurb}
            </p>

            {/* Personal Fit Alert */}
            <div className="mt-6 rounded-2xl border border-lime/30 bg-lime/10 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-lime">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>
                  {ranking.total ? `${ranking.total}% Personal Match` : "Tune preferences for personalized fit"}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-200 leading-relaxed">
                {ranking.reasons[0]}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover shadow-lg shadow-primary/25"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={toggleCompare}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition ${
                  compared
                    ? "border-peri bg-peri/20 text-white"
                    : "border-white/10 bg-surface2 text-slate-200 hover:border-peri/40 hover:bg-surface3"
                }`}
              >
                {compared ? (
                  <>
                    <Check className="h-4 w-4 text-lime" />
                    <span>In Compare</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 text-peri" />
                    <span>Compare</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Grid of Facts */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-text mb-6">
            Detailed Verified Specifications
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FactCard
              icon={CalendarDays}
              label="Timeline & Dates"
              value={event.dateLabel}
              subtext={event.startsAt ? `Starts ${new Date(event.startsAt).toLocaleDateString()}` : undefined}
            />
            <FactCard
              icon={MapPin}
              label="Format & Location"
              value={event.mode === "online" ? "Online / Virtual" : event.city}
              subtext={event.venue}
            />
            <FactCard
              icon={Trophy}
              label="Prizes & Rewards"
              value={event.prizeLabel || "Announced on platform"}
              subtext="Verified official bounty"
            />
            <FactCard
              icon={Users}
              label="Team Size"
              value={event.teamSize || "1 - 4 members"}
              subtext={event.eligibility}
            />
          </div>
        </section>

        {/* Full Overview Description */}
        <section className="mt-8 rounded-3xl border border-white/8 bg-surface p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-text mb-3">About this Event</h3>
          <p className="text-sm leading-relaxed text-muted whitespace-pre-line">
            {event.description || event.blurb}
          </p>

          {/* Themes / Tracks */}
          <div className="mt-6 border-t border-white/8 pt-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted block mb-3">
              Focus Domains & Tracks
            </span>
            <div className="flex flex-wrap gap-2">
              {event.themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-lg border border-peri/30 bg-peri/10 px-3 py-1 text-xs font-semibold text-peri"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
