"use client";

import { useState } from "react";
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  Sparkles,
  Tag,
  Trophy,
  Users,
  X,
} from "lucide-react";
import type { Event, UserProfile } from "@/lib/types";
import { computeRanking } from "@/lib/ranking";
import { GradientPoster } from "./GradientPoster";
import { FormattedOverview } from "./FormattedOverview";
import { DiscordFriendsBadge } from "./DiscordFriendsBadge";
import { GoogleCalendarButton } from "./GoogleCalendarButton";

interface CompareTableProps {
  events: Event[];
  profile: UserProfile | null;
  onRemove: (id: string) => void;
}

export function CompareTable({ events, profile, onRemove }: CompareTableProps) {
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  const rankings = events.map((event) => computeRanking(event, profile));

  return (
    <div className="space-y-8">
      {/* Mobile Tab Switcher (Visible on small screens) */}
      <div className="flex rounded-xl border border-white/10 bg-surface p-1.5 lg:hidden">
        {events.map((event, idx) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setActiveMobileTab(idx)}
            className={`flex-1 rounded-lg py-2.5 px-3 text-xs font-bold transition truncate ${
              activeMobileTab === idx
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "text-muted hover:text-white"
            }`}
          >
            {event.title}
          </button>
        ))}
      </div>

      {/* Top Header Event Cards Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {events.map((event, idx) => {
          const fit = rankings[idx];
          const isMobileActive = activeMobileTab === idx;

          return (
            <div
              key={event.id}
              className={`flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-xl shadow-black/30 transition-all ${
                isMobileActive ? "block" : "hidden lg:flex"
              }`}
            >
              {/* Event Poster with Banner */}
              <div className="p-3 pb-0">
                <GradientPoster
                  gradient={event.posterGradient}
                  title={event.title}
                  imageUrl={event.bannerUrl}
                  platform={event.source}
                  type={event.type}
                  heightClass="aspect-[16/9] w-full"
                />
              </div>

              {/* Header Card Body */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="micro-label text-peri">{event.source}</span>
                    <h2 className="mt-1 font-display text-lg font-bold leading-snug text-text line-clamp-2">
                      {event.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted truncate">{event.organizer.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(event.id)}
                    aria-label={`Remove ${event.title}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-surface2 text-muted transition hover:border-neg/40 hover:bg-neg/10 hover:text-neg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Personal Fit Badge */}
                <div className="mt-4 rounded-xl border border-lime/30 bg-lime/10 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-lime">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>
                      {fit.total ? `${fit.total}% Personal Fit` : "Preferences required for fit"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{fit.reasons[0]}</p>
                </div>

                {/* Discord Friends Attending (Demo) */}
                <div className="mt-2">
                  <DiscordFriendsBadge eventSlugOrId={event.slug} variant="card" />
                </div>

                {/* Actions: Direct Official Link & Google Calendar */}
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-xs font-bold text-white transition hover:bg-primary-hover shadow-md shadow-primary/20"
                  >
                    <span>Official Page</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <GoogleCalendarButton event={event} variant="icon" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Structured Comparison Modules */}

      {/* SECTION 1: Key Overview & Mode */}
      <section className="overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-lg">
        <div className="border-b border-white/8 bg-surface2/50 px-6 py-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-peri" />
          <h3 className="font-display text-base font-bold text-text">Event Format & Venue</h3>
        </div>

        <div className="divide-y divide-white/6">
          {/* Format / Mode */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Attendance Mode
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold uppercase ${
                    event.mode === "online"
                      ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {event.mode === "online" ? "Virtual / Online" : "In-Person / Offline"}
                </span>
              </div>
            ))}
          </div>

          {/* Location & Venue */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-peri" />
              Venue & City
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <p className="text-sm font-semibold text-text">
                  {event.city || (event.mode === "online" ? "Online Worldwide" : "Location TBA")}
                </p>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  {event.venue || event.city}
                </p>
              </div>
            ))}
          </div>

          {/* Registration Status */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Status
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
                    event.registrationStatus === "open"
                      ? "bg-pos/20 text-pos border border-pos/40"
                      : "bg-surface2 text-muted border border-white/10"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      event.registrationStatus === "open" ? "bg-pos animate-pulse" : "bg-muted"
                    }`}
                  />
                  {event.registrationStatus === "open" ? "Registration Open" : event.registrationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Timeline & Dates */}
      <section className="overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-lg">
        <div className="border-b border-white/8 bg-surface2/50 px-6 py-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-peri" />
          <h3 className="font-display text-base font-bold text-text">Timeline & Deadlines</h3>
        </div>

        <div className="divide-y divide-white/6">
          {/* Event Dates */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-peri" />
              Event Dates
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <p className="text-sm font-bold text-text">{event.dateLabel}</p>
                {event.startsAt && (
                  <p className="mt-0.5 text-xs text-muted">
                    Starts: {new Date(event.startsAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Registration Deadline */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-peri" />
              Deadline
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <p className="text-sm font-semibold text-slate-200">
                  {event.registrationClosesAt
                    ? new Date(event.registrationClosesAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not specified"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Prizes & Perks */}
      <section className="overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-lg">
        <div className="border-b border-white/8 bg-surface2/50 px-6 py-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <h3 className="font-display text-base font-bold text-text">Awards & Rewards</h3>
        </div>

        <div className="divide-y divide-white/6">
          {/* Prize pool */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Prize Pool
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                {event.prizeLabel ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-sm font-bold text-amber-300">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    {event.prizeLabel}
                  </span>
                ) : (
                  <span className="text-xs text-muted">Prizes / Bounties to be announced</span>
                )}
              </div>
            ))}
          </div>

          {/* Perks */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Perks & Benefits
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <ul className="space-y-1.5">
                  {(event.perks.length ? event.perks : ["Official Certificate", "Mentorship Support"]).map(
                    (perk, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-pos shrink-0" />
                        <span>{perk}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Team & Eligibility */}
      <section className="overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-lg">
        <div className="border-b border-white/8 bg-surface2/50 px-6 py-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-peri" />
          <h3 className="font-display text-base font-bold text-text">Participation & Rules</h3>
        </div>

        <div className="divide-y divide-white/6">
          {/* Team Size */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Team Size
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <p className="text-sm font-semibold text-text">
                  {event.teamSize || "1 - 4 members"}
                </p>
              </div>
            ))}
          </div>

          {/* Eligibility */}
          <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Eligibility
            </span>
            {events.map((event) => (
              <div key={event.id} className="min-w-0">
                <p className="text-xs leading-relaxed text-slate-300">
                  {event.eligibility || "Open to all developers and students worldwide"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Themes & Tracks */}
      <section className="overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-lg">
        <div className="border-b border-white/8 bg-surface2/50 px-6 py-4 flex items-center gap-2">
          <Tag className="h-4 w-4 text-peri" />
          <h3 className="font-display text-base font-bold text-text">Themes & Focus Tracks</h3>
        </div>

        <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
            Tech Tracks
          </span>
          {events.map((event) => (
            <div key={event.id} className="min-w-0 flex flex-wrap gap-1.5">
              {event.themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-md border border-peri/30 bg-peri/10 px-2.5 py-1 text-xs font-medium text-peri"
                >
                  {theme}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Campus Network & Squad (Discord Demo) */}
      <section className="overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-lg">
        <div className="border-b border-white/8 bg-surface2/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#5865F2]" />
            <h3 className="font-display text-base font-bold text-text">Campus Squad & Friends Presence</h3>
          </div>
          <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-mono font-extrabold text-amber-300">
            DEMO
          </span>
        </div>

        <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
            Friends Attending
          </span>
          {events.map((event) => (
            <div key={event.id} className="min-w-0">
              <DiscordFriendsBadge eventSlugOrId={event.slug} variant="compare" />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Structured Overview & Brief */}
      <section className="overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-lg">
        <div className="border-b border-white/8 bg-surface2/50 px-6 py-4 flex items-center gap-2">
          <Flame className="h-4 w-4 text-peri" />
          <h3 className="font-display text-base font-bold text-text">Structured Overview & Verified Brief</h3>
        </div>

        <div className="grid p-5 gap-4 lg:grid-cols-4 items-start">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
            Executive Brief
          </span>
          {events.map((event) => (
            <div key={event.id} className="min-w-0">
              <FormattedOverview
                text={event.description}
                blurb={event.blurb}
                title={event.title}
                mode="compact"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
