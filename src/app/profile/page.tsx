"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import { repository } from "@/lib/repository";
import { Shield, RotateCcw, ArrowRight, MessageSquare, Star } from "lucide-react";

export default function ProfilePage() {
  const { profile, clearProfile } = useProfileStore();
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
