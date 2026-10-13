"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ExternalLink,
  HelpCircle,
  MapPin,
  Plus,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { Event, RankingResult } from "@/lib/types";
import { GradientPoster } from "./GradientPoster";
import { MatchRing } from "./MatchRing";
import { WhyRankModal } from "./WhyRankModal";
import { DiscordFriendsBadge } from "./DiscordFriendsBadge";
import { GoogleCalendarButton } from "./GoogleCalendarButton";
import { useCompareStore } from "@/store/compareStore";

interface EventCardProps {
  event: Event;
  ranking: RankingResult;
  rankNumber?: number;
  isPreferredHub?: boolean;
}

export function EventCard({ event, ranking, rankNumber, isPreferredHub }: EventCardProps) {
  const { selected, addEvent, removeEvent } = useCompareStore();
  const [showWhyModal, setShowWhyModal] = useState(false);

  const compared = selected.some((entry) => entry.id === event.id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeEvent(event.id);
    } else {
      addEvent({ id: event.id, title: event.title, slug: event.slug });
    }
  };

  const isRegistrationOpen = event.registrationStatus === "open";

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-white/8 bg-surface shadow-xl shadow-black/25 transition-colors duration-300 hover:border-peri/40 hover:shadow-2xl hover:shadow-peri/10"
      >
        {/* Banner / Poster */}
        <Link
          href={`/event/${event.slug}`}
          className="block p-1.5 sm:p-3 pb-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-t-xl sm:rounded-t-2xl"
        >
          <GradientPoster
            gradient={event.posterGradient}
            title={event.title}
            imageUrl={event.bannerUrl}
            platform={event.source}
            type={event.type}
          />
        </Link>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Organizer & Status */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-mono font-bold text-peri truncate" title={event.organizer.name}>
                {event.organizer.name}
              </span>
              {isPreferredHub && (
                <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 border border-lime/30 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-lime shrink-0">
                  <MapPin className="h-2.5 w-2.5" />
                  Hub
                </span>
              )}
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                isRegistrationOpen
                  ? "bg-pos/15 text-pos border border-pos/30"
                  : "bg-surface2 text-muted border border-white/8"
              }`}
            >
              {isRegistrationOpen && <span className="h-1.5 w-1.5 rounded-full bg-pos animate-pulse" />}
              <span>{event.registrationStatus}</span>
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/event/${event.slug}`}
            className="font-display text-base sm:text-lg md:text-xl font-bold leading-snug text-text transition-colors duration-200 group-hover:text-peri line-clamp-2"
          >
            {event.title}
          </Link>

          {/* Key Metadata */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-300">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-peri" aria-hidden="true" />
              <span className="truncate">{event.dateLabel}</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-peri" aria-hidden="true" />
              <span className="truncate">
                {event.mode === "online" ? "Online" : event.city || event.venue}
              </span>
            </p>
            {event.teamSize && (
              <p className="flex items-center gap-2 text-muted">
                <Users className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                <span className="truncate">{event.teamSize}</span>
              </p>
            )}
          </div>

          {/* Prize & Themes */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {event.prizeLabel && (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-bold text-amber-300 truncate max-w-full">
                <Trophy className="h-3 w-3 text-amber-400 shrink-0" />
                <span className="truncate">{event.prizeLabel}</span>
              </span>
            )}
            {event.themes.slice(0, 3).map((theme) => (
              <span
                key={theme}
                className="inline-flex rounded-md border border-peri/20 bg-peri/10 px-2 py-0.5 text-[11px] font-medium text-peri"
              >
                {theme}
              </span>
            ))}
          </div>

          {/* Discord Friends Attending (Demo) */}
          <DiscordFriendsBadge eventSlugOrId={event.slug} variant="card" />

          {/* Interactive Signal Ranking Strip with MatchRing */}
          <div
            onClick={() => setShowWhyModal(true)}
            className="mt-2 sm:mt-4 rounded-lg sm:rounded-xl border border-white/6 bg-surface2/80 p-1.5 sm:p-3 hover:border-peri/40 transition cursor-pointer group/ranking"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowWhyModal(true);
            }}
            aria-label="View why this event is ranked"
          >
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <div className="sm:hidden shrink-0">
                  <MatchRing score={ranking.total} size={24} strokeWidth={3} />
                </div>
                <div className="hidden sm:block shrink-0">
                  <MatchRing score={ranking.total} size={42} strokeWidth={4} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs font-bold text-lime truncate">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" aria-hidden="true" />
                    <span className="sm:hidden">{ranking.total}%</span>
                    <span className="hidden sm:inline">Signal Score: {ranking.total}%</span>
                  </div>
                  <p className="hidden sm:block text-[11px] text-muted line-clamp-2 leading-relaxed mt-0.5">
                    {ranking.reasons[0]}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[11px] font-semibold text-peri group-hover/ranking:underline shrink-0">
                <span className="hidden sm:inline">Why?</span>
                <HelpCircle className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              </span>
            </div>
          </div>

          {/* Outbound Link & Compare Buttons */}
          <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2 border-t border-white/8 pt-1.5 sm:pt-3">
            <button
              type="button"
              onClick={toggleCompare}
              aria-pressed={compared}
              className={`min-h-7 sm:min-h-10 flex-1 rounded-lg sm:rounded-xl border px-1 sm:px-3 text-[9px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                compared
                  ? "border-peri bg-peri/20 text-white shadow-sm shadow-peri/30"
                  : "border-white/10 bg-surface2 text-slate-200 hover:border-peri/50 hover:bg-surface3"
              }`}
            >
              {compared ? (
                <>
                  <Check className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-lime" />
                  <span className="truncate">Saved</span>
                </>
              ) : (
                <>
                  <Plus className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-peri" />
                  <span className="truncate">Compare</span>
                </>
              )}
            </button>

            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open official listing on ${event.source}`}
              className="inline-flex min-h-7 sm:min-h-10 items-center justify-center rounded-lg sm:rounded-xl border border-white/10 bg-surface2 px-2 sm:px-3 text-[10px] sm:text-xs font-bold text-peri transition-colors hover:border-peri/50 hover:bg-surface3 hover:text-white shrink-0"
            >
              <span className="mr-1 hidden sm:inline">Official</span>
              <ExternalLink className="h-3 sm:h-3.5 w-3 sm:w-3.5" aria-hidden="true" />
            </a>

            {/* Google Calendar Add */}
            <GoogleCalendarButton event={event} variant="icon" />
          </div>
        </div>
      </motion.article>

      {/* Why Ranked Explanation Modal */}
      <WhyRankModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        event={event}
        ranking={ranking}
        rankNumber={rankNumber}
      />
    </>
  );
}
