"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { useDiscordStore } from "@/store/discordStore";
import { DiscordConnectModal } from "@/components/DiscordConnectModal";
import { repository } from "@/lib/repository";
import { Shield, RotateCcw, ArrowRight, MessageSquare, Star } from "lucide-react";

export default function ProfilePage() {
  const { profile, clearProfile } = useProfileStore();
  const { isConnected, user } = useDiscordStore();
  const [discordModalOpen, setDiscordModalOpen] = useState(false);
  const userReviews = useMemo(() => repository.getUserReviews(), []);

  return (
    <div className="min-h-screen bg-bg text-text pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/12 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-lime to-emerald-400 text-bg font-display font-extrabold text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(198,255,74,0.3)]">
              {profile?.name ? profile.name[0].toUpperCase() : "H"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold text-white">
                  {profile?.name || "Student Hacker"}
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-lime/15 text-lime border border-lime/30 font-bold uppercase">
                  VERIFIED BUILDER
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono capitalize font-medium">
                Archetype: <span className="text-white font-bold">{profile?.persona || "Builder & Hacker"}</span> · <span className="text-lime font-bold">{profile?.skillLevel || "Intermediate"}</span> Tier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding"
              className="px-4 py-2.5 rounded-xl bg-lime text-bg text-xs font-bold font-display tracking-wide shadow-[0_0_15px_rgba(198,255,74,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Retake Vibe Check</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={clearProfile}
              className="p-2.5 rounded-xl bg-surface2 text-slate-300 hover:text-neg border border-white/10 transition-colors cursor-pointer"
              title="Reset profile"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Discord Campus Squad Integration (Demo) */}
      <div className="p-6 rounded-3xl bg-surface border border-white/12 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#5865F2]/25">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="font-display text-base font-bold text-text">Discord Campus Presence</h2>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-mono px-2 py-0.5 font-bold uppercase">
                DEMO
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {isConnected && user
                ? `Connected as @${user.username}#${user.discriminator} · 5 campus peers RSVP tracking enabled`
                : "Simulate connecting Discord to see which classmates & friends are attending which hackathon"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDiscordModalOpen(true)}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer shrink-0 ${
            isConnected
              ? "bg-surface2 text-text border border-white/10 hover:border-peri/40"
              : "bg-[#5865F2] text-white hover:bg-[#4752C4] shadow-[#5865F2]/25 active:scale-95"
          }`}
        >
          <span>{isConnected ? "Manage Discord (Demo)" : "Connect Discord (Demo)"}</span>
        </button>
      </div>

      <DiscordConnectModal isOpen={discordModalOpen} onClose={() => setDiscordModalOpen(false)} />

      {/* Profile Details Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Interests */}
        <div className="p-6 rounded-2xl bg-surface border border-white/12 shadow-md">
          <h2 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider mb-3">
            Calibrated Domains &amp; Tracks
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(profile?.interests || ["AI/ML", "Assistive Tech", "Systems"]).map((interest) => (
              <span
                key={interest}
                className="px-3 py-1.5 rounded-lg bg-surface2 text-xs font-semibold text-peri border border-peri/25"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Non-Negotiables & Priorities */}
        <div className="p-6 rounded-2xl bg-surface border border-white/12 shadow-md">
          <h2 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider mb-3">
            Non-Negotiable Priorities
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(profile?.priorities || ["World-Class Mentors", "Gigabit Wi-Fi", "Honest Judging"]).map(
              (priority) => (
                <span
                  key={priority}
                  className="px-3 py-1.5 rounded-lg bg-lime/15 text-xs font-semibold text-lime border border-lime/30 flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {priority}
                </span>
              )
            )}
          </div>
        </div>

        {/* Format & Social Vibe */}
        <div className="p-6 rounded-2xl bg-surface border border-white/12 shadow-md">
          <h2 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider mb-2">
            Social Vibe &amp; Crowd Preference
          </h2>
          <p className="text-sm font-bold text-white mb-1">
            {profile?.socialVibe || "Small Close-Knit Crew (2-4)"}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Algorithm prioritizes hackathons with team workspaces and lower noise density.
          </p>
        </div>

        {/* Goals */}
        <div className="p-6 rounded-2xl bg-surface border border-white/12 shadow-md">
          <h2 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider mb-2">
            Semester Goals
          </h2>
          <p className="text-sm font-bold text-white mb-1">
            {profile?.goals?.join(", ") || "Build Portfolio & Win Bounties"}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Filtered towards events with direct founder networking and grant opportunities.
          </p>
        </div>
      </div>

      {/* User Submitted Community Reviews */}
      <div className="p-6 rounded-2xl bg-surface border border-white/12 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-lime" />
          <h2 className="font-display text-lg font-bold text-white">
            Your Community Reviews ({userReviews.length})
          </h2>
        </div>

        {userReviews.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You haven&apos;t published any event reviews yet. Visit an event detail page and drop an honest review to contribute to the signal network.
          </p>
        ) : (
          <div className="space-y-3">
            {userReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-surface2 border border-white/10 flex items-start justify-between gap-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? "fill-lime text-lime" : "text-surface3"
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-slate-300 font-mono ml-2 font-semibold">
                      {rev.createdAt}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 italic leading-relaxed">&quot;{rev.text}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
