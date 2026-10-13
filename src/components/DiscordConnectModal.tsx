"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Unlink,
  LogIn,
  Trophy,
  Calendar,
  MapPin,
  Flame,
  ArrowRight,
} from "lucide-react";
import { useDiscordStore, DEMO_DISCORD_FRIENDS, DiscordFriend } from "@/store/discordStore";
import { useCatalog } from "@/lib/useCatalog";
import type { Event } from "@/lib/types";

interface DiscordConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscordConnectModal({ isOpen, onClose }: DiscordConnectModalProps) {
  const { isConnected, user, connectDiscord, disconnectDiscord } = useDiscordStore();
  const { events } = useCatalog();
  const [activeTab, setActiveTab] = useState<"friends" | "hackathons">("friends");

  // Handle ESC key press to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Helper to match a slug or ID to a catalog event
  const resolveEvent = (slug: string): Event | undefined => {
    const clean = slug.toLowerCase();
    const direct = events.find(
      (e) => e.slug.toLowerCase() === clean || e.id.toLowerCase() === clean
    );
    if (direct) return direct;

    return events.find((e) => {
      const s = e.slug.toLowerCase();
      return (
        s.includes(clean) ||
        clean.includes(s) ||
        (clean.includes("nexhack") && s.includes("nexhack")) ||
        (clean.includes("outpost") && s.includes("outpost")) ||
        (clean.includes("hacknaut") && s.includes("hacknaut")) ||
        (clean.includes("bios") && s.includes("bios")) ||
        (clean.includes("codewithchat") && s.includes("codewithchat"))
      );
    });
  };

  // Helper to humanize slug into readable title if catalog lookup misses
  const humanizeSlug = (slug: string) => {
    return slug
      .replace(/^(devfolio|unstop|hackerearth|mlh)-/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Group attendees by hackathon for the "By Hackathon" overview
  const hackathonGroups = useMemo(() => {
    const map = new Map<string, { friends: DiscordFriend[]; rawSlug: string }>();

    DEMO_DISCORD_FRIENDS.forEach((friend) => {
      friend.attendingEventSlugs.forEach((slug) => {
        const ev = resolveEvent(slug);
        const key = ev ? ev.slug : slug;
        if (!map.has(key)) {
          map.set(key, { friends: [], rawSlug: slug });
        }
        map.get(key)!.friends.push(friend);
      });
    });

    const list = Array.from(map.entries()).map(([key, data]) => {
      const ev = resolveEvent(key) || resolveEvent(data.rawSlug);
      return {
        eventSlug: ev ? ev.slug : key,
        eventTitle: ev ? ev.title : humanizeSlug(data.rawSlug),
        eventDate: ev?.dateLabel,
        eventCity: ev?.city || ev?.venue,
        eventMode: ev?.mode,
        eventObj: ev,
        friends: data.friends,
      };
    });

    return list.sort((a, b) => b.friends.length - a.friends.length);
  }, [events]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop with click-to-close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-[#5865F2]/40 bg-surface shadow-2xl shadow-[#5865F2]/25 overflow-hidden z-10"
        >
          {/* Ambient Background Glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#5865F2]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-lime/10 blur-3xl pointer-events-none" />

          {/* Sticky Header */}
          <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-white/10 bg-surface/95 backdrop-blur-md relative z-10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/30 shrink-0">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-text">
                      Discord Campus Radar
                    </h3>
                    <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-mono font-extrabold text-amber-300">
                      DEMO
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    See which hackathons your friends &amp; campus peers are attending
                  </p>
                </div>
              </div>

              {/* Explicit, high-visibility Top Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-surface2 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 hover:border-white/30 transition cursor-pointer shadow-sm active:scale-95 shrink-0"
                aria-label="Close modal"
                title="Close modal (Escape)"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>

          {/* Scrollable Body Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain">
            {/* Connection Status Box */}
            <div className="rounded-2xl border border-white/10 bg-surface2/80 p-4">
              {isConnected && user ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="h-11 w-11 rounded-full border-2 border-[#5865F2] object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-pos" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-text">@{user.username}</span>
                        <span className="text-xs text-muted font-mono">#{user.discriminator}</span>
                      </div>
                      <span className="text-[11px] text-pos font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Synced with 5 Delhi Campus Peers (Demo)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={disconnectDiscord}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neg/30 bg-neg/10 px-3 py-1.5 text-xs font-bold text-neg hover:bg-neg/20 transition cursor-pointer self-start sm:self-auto"
                  >
                    <Unlink className="h-3.5 w-3.5" />
                    <span>Disconnect (Demo)</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-text">Sync Discord Friends (Demo Simulation)</h4>
                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      Connect to automatically see which hackathons your friends are going to.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={connectDiscord}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#5865F2]/25 hover:bg-[#4752C4] transition cursor-pointer active:scale-95 shrink-0"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Connect Discord (Demo)</span>
                  </button>
                </div>
              )}
            </div>

            {/* View Selector Tabs: By Friend vs By Hackathon */}
            <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("friends")}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    activeTab === "friends"
                      ? "bg-[#5865F2] text-white shadow-md shadow-[#5865F2]/20"
                      : "bg-surface2 text-muted hover:text-white"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>By Friends ({DEMO_DISCORD_FRIENDS.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hackathons")}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    activeTab === "hackathons"
                      ? "bg-lime text-bg font-extrabold shadow-md shadow-lime/20"
                      : "bg-surface2 text-muted hover:text-white"
                  }`}
                >
                  <Flame className="h-3.5 w-3.5" />
                  <span>By Hackathon ({hackathonGroups.length})</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-peri hidden sm:inline">
                Click any hackathon to inspect
              </span>
            </div>

            {/* TAB 1: BY FRIENDS (Shows which hackathons each friend is attending) */}
            {activeTab === "friends" && (
              <div className="space-y-3">
                {DEMO_DISCORD_FRIENDS.map((friend) => (
                  <div
                    key={friend.id}
                    className="rounded-2xl border border-white/8 bg-surface2/50 p-4 transition hover:border-[#5865F2]/40 hover:bg-surface2/70 space-y-3"
                  >
                    {/* Friend Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={friend.avatarUrl}
                            alt={friend.name}
                            className="h-10 w-10 rounded-full border border-white/10 object-cover"
                          />
                          <span
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface ${
                              friend.status === "online"
                                ? "bg-pos"
                                : friend.status === "idle"
                                ? "bg-amber-400"
                                : "bg-neg"
                            }`}
                            title={`Status: ${friend.status}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs sm:text-sm font-bold text-text truncate">
                              {friend.name}
                            </p>
                            <span className="text-[11px] text-peri font-mono truncate">
                              @{friend.username}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted truncate">
                            {friend.college} {friend.tagline ? `· ${friend.tagline}` : ""}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/30 px-2 py-0.5 text-[10px] font-bold text-[#A5B4FC]">
                        {friend.attendingEventSlugs.length} Hackathons RSVP&apos;d
                      </span>
                    </div>

                    {/* Attending Hackathons Badges */}
                    <div className="pt-2 border-t border-white/6">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-lime" />
                        Attending Hackathons:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {friend.attendingEventSlugs.map((slug) => {
                          const ev = resolveEvent(slug);
                          const title = ev ? ev.title : humanizeSlug(slug);
                          const linkHref = ev ? `/event/${ev.slug}` : `/search?q=${encodeURIComponent(slug)}`;

                          return (
                            <Link
                              key={slug}
                              href={linkHref}
                              onClick={onClose}
                              className="group/chip inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-surface px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white hover:border-lime/60 hover:bg-lime/10 transition-all shadow-sm"
                              title={`View ${title} event page`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-lime group-hover/chip:scale-125 transition-transform" />
                              <span className="truncate max-w-[220px] group-hover/chip:text-lime transition-colors">
                                {title}
                              </span>
                              {ev?.dateLabel && (
                                <span className="text-[10px] text-muted font-mono hidden sm:inline">
                                  ({ev.dateLabel.split("–")[0].trim()})
                                </span>
                              )}
                              <ExternalLink className="h-3 w-3 text-muted group-hover/chip:text-lime transition-colors shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: BY HACKATHON (Shows which friends are going to each hackathon) */}
            {activeTab === "hackathons" && (
              <div className="space-y-3">
                {hackathonGroups.map((group) => {
                  const linkHref = group.eventObj
                    ? `/event/${group.eventObj.slug}`
                    : `/search?q=${encodeURIComponent(group.eventSlug)}`;

                  return (
                    <div
                      key={group.eventSlug}
                      className="rounded-2xl border border-white/8 bg-surface2/50 p-4 transition hover:border-lime/40 hover:bg-surface2/70 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 rounded-full bg-lime shrink-0" />
                            <h4 className="text-sm font-bold text-white truncate">
                              {group.eventTitle}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                            {group.eventDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-peri" />
                                {group.eventDate}
                              </span>
                            )}
                            {group.eventCity && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                {group.eventCity}
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          href={linkHref}
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-lime/15 border border-lime/30 px-3 py-1.5 text-xs font-bold text-lime hover:bg-lime/25 transition self-start sm:self-auto shrink-0"
                        >
                          <span>View Event</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      {/* Friends Going Stack */}
                      <div className="pt-2 border-t border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden shrink-0">
                            {group.friends.map((f) => (
                              <img
                                key={f.id}
                                src={f.avatarUrl}
                                alt={f.name}
                                title={`${f.name} (@${f.username}) - ${f.college}`}
                                className="h-7 w-7 rounded-full ring-2 ring-surface object-cover"
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-pos">
                            {group.friends.length} {group.friends.length === 1 ? "friend" : "friends"} going:
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">
                          {group.friends.map((f) => f.name.split(" ")[0]).join(", ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer with High-Visibility Done/Close Button */}
          <div className="shrink-0 p-4 sm:p-5 border-t border-white/10 bg-surface2/90 backdrop-blur-md relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="flex items-center gap-1 text-amber-300 font-mono text-[11px] font-bold">
                <Sparkles className="h-3.5 w-3.5" /> DEMO FEATURE SIMULATOR
              </span>
              <span className="hidden sm:inline">· Shows realistic student squad sync</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto min-h-10 px-6 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-xs sm:text-sm font-bold text-white transition cursor-pointer shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
                <span>Done / Close</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
