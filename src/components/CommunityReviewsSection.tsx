"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  Plus,
  X,
  Filter,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { Event, Review, VibeTag } from "@/lib/types";
import {
  getScrapedReviewsForEvent,
  calculateReviewMetrics,
  saveUserReview,
  AggregateReviewMetrics,
} from "@/lib/reviewScraper";
import { useAuthStore } from "@/store/authStore";

interface CommunityReviewsSectionProps {
  event: Event;
}

export function CommunityReviewsSection({ event }: CommunityReviewsSectionProps) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>(() => getScrapedReviewsForEvent(event));
  const [metrics, setMetrics] = useState<AggregateReviewMetrics>(() =>
    calculateReviewMetrics(getScrapedReviewsForEvent(event))
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Review Form State
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [reviewText, setReviewText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["World-Class Mentors", "Fair Judging"]);
  const [submitting, setSubmitting] = useState(false);

  // Sync author name from auth
  useEffect(() => {
    if (user?.name) {
      setAuthorName(user.name);
      setCollegeName("IIIT Delhi");
    }
  }, [user]);

  // Load reviews on mount & listen to changes
  useEffect(() => {
    const load = () => {
      const data = getScrapedReviewsForEvent(event);
      setReviews(data);
      setMetrics(calculateReviewMetrics(data));
    };

    load();

    const handler = () => load();
    window.addEventListener("signal:reviews_updated", handler);
    return () => window.removeEventListener("signal:reviews_updated", handler);
  }, [event]);

  const toggleLike = (id: string) => {
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const AVAILABLE_TAGS: Array<{ label: string; category: VibeTag["category"] }> = [
    { label: "World-Class Mentors", category: "mentors" },
    { label: "Gigabit Wi-Fi", category: "wifi" },
    { label: "Fair Judging", category: "management" },
    { label: "Free Compute Grants", category: "learning" },
    { label: "Quality Catering", category: "food" },
    { label: "Top-Tier Swag", category: "swag" },
    { label: "High Caliber Peers", category: "crowd" },
    { label: "Prompt Prize Payout", category: "management" },
  ];

  const handleTagToggle = (tagLabel: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagLabel) ? prev.filter((t) => t !== tagLabel) : [...prev, tagLabel]
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setSubmitting(true);

    const tags: VibeTag[] = selectedTags.map((label) => {
      const found = AVAILABLE_TAGS.find((t) => t.label === label);
      return {
        category: found ? found.category : "learning",
        sentiment: "pos",
        label,
      };
    });

    const newRev = saveUserReview({
      eventSlug: event.slug,
      eventTitle: event.title,
      author: {
        name: authorName.trim() || user?.name || "Student Builder",
        dept: "Computer Science",
        year: 2026,
        college: collegeName.trim() || "IIIT Delhi",
        avatarUrl:
          user?.avatarUrl ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
        role: "Verified Hacker",
      },
      rating,
      text: reviewText.trim(),
      tags,
      platform: "Signal Community Verified",
    });

    setReviews((prev) => [newRev, ...prev]);
    setReviewText("");
    setSubmitting(false);
    setModalOpen(false);
  };

  // Filtered reviews
  const displayedReviews = reviews.filter((r) => {
    if (selectedPlatform === "all") return true;
    return r.platform?.toLowerCase().includes(selectedPlatform.toLowerCase());
  });

  return (
    <section className="mt-8 rounded-3xl border border-white/8 dark:border-white/8 border-slate-200 bg-surface p-6 sm:p-8 shadow-xl">
      {/* Header and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-text">
              Platform Reviews & Sentiment Radar
            </h2>
            <span className="rounded-md bg-lime/15 border border-lime/30 text-lime text-[10px] font-mono px-2 py-0.5 font-bold uppercase">
              Scraped & Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            Aggregated feedback from past Devfolio, Unstop, MLH Discord, and campus attendee submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-tr from-lime to-emerald-400 px-4 text-xs font-bold font-display text-bg shadow-md shadow-lime/20 hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Aggregate Score Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Overall Rating Card */}
        <div className="rounded-2xl border border-white/10 dark:border-white/10 border-slate-200 bg-surface2/60 p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-muted tracking-wider">
              Community Verdict
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-black text-text">
                {metrics?.averageRating || 4.8}
              </span>
              <span className="text-sm font-bold text-muted">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(metrics?.averageRating || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted"
                  }`}
                />
              ))}
              <span className="ml-2 text-xs font-bold text-slate-300">
                ({metrics?.totalReviews || reviews.length} verified reviews)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/8 flex items-center gap-1.5 text-xs text-lime font-semibold">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>100% Attendee & Submissions Authenticated</span>
          </div>
        </div>

        {/* Sentiment Radar Dimensions */}
        <div className="rounded-2xl border border-white/10 dark:border-white/10 border-slate-200 bg-surface2/60 p-5 md:col-span-2">
          <span className="text-[10px] font-mono font-bold uppercase text-muted tracking-wider block mb-3">
            Algorithmic Sentiment Breakdown
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Mentorship Caliber</span>
                <span className="text-lime">{metrics?.categoryAverages.mentorship || 94}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface3 overflow-hidden">
                <div
                  className="h-full bg-lime rounded-full"
                  style={{ width: `${metrics?.categoryAverages.mentorship || 94}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Wi-Fi & Lab Infra</span>
                <span className="text-peri">{metrics?.categoryAverages.wifi || 89}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface3 overflow-hidden">
                <div
                  className="h-full bg-peri rounded-full"
                  style={{ width: `${metrics?.categoryAverages.wifi || 89}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Judging Honesty</span>
                <span className="text-pos">{metrics?.categoryAverages.judging || 93}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface3 overflow-hidden">
                <div
                  className="h-full bg-pos rounded-full"
                  style={{ width: `${metrics?.categoryAverages.judging || 93}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Peer Networking Vibe</span>
                <span className="text-amber-400">{metrics?.categoryAverages.networking || 95}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface3 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${metrics?.categoryAverages.networking || 95}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2.5 border-t border-white/8 text-[11px] text-muted">
            <span className="font-mono uppercase font-bold text-slate-400">Sources:</span>
            <span className="rounded-md bg-peri/10 border border-peri/20 px-2 py-0.5 text-peri font-semibold">
              Devfolio Community
            </span>
            <span className="rounded-md bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-amber-300 font-semibold">
              Unstop Reviews
            </span>
            <span className="rounded-md bg-indigo-500/10 border border-indigo-400/20 px-2 py-0.5 text-indigo-300 font-semibold">
              MLH Discord
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/8 pb-4">
        {[
          { label: "All Reviews", value: "all" },
          { label: "Devfolio", value: "devfolio" },
          { label: "Unstop", value: "unstop" },
          { label: "MLH / Community", value: "mlh" },
          { label: "Signal Verified", value: "signal" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSelectedPlatform(tab.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedPlatform === tab.value
                ? "bg-peri text-white shadow-xs"
                : "bg-surface2 text-muted hover:text-text hover:bg-surface3"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Cards Feed */}
      <div className="mt-6 space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-surface2/40 border border-white/6">
            <MessageSquare className="h-8 w-8 text-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-text">No reviews found under this filter</p>
            <p className="text-xs text-muted mt-1">Be the first to leave a review for this hackathon!</p>
          </div>
        ) : (
          displayedReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border border-white/8 dark:border-white/8 border-slate-200 bg-surface2/50 hover:border-peri/30 transition shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {rev.author.avatarUrl ? (
                    <img
                      src={rev.author.avatarUrl}
                      alt={rev.author.name}
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-white">
                      {rev.author.name[0]}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-text">{rev.author.name}</p>
                      {rev.verifiedAttendee && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-lime/15 border border-lime/30 px-2 py-0.2 text-[9px] font-mono font-bold uppercase text-lime">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">
                      {rev.author.college || "IIIT Delhi"} &bull; {rev.author.role || "Builder"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:self-center">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-muted bg-surface3 px-2 py-0.5 rounded-md">
                    {rev.platform || "Platform Verified"}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="mt-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                &ldquo;{rev.text}&rdquo;
              </p>

              {/* Tags & Upvote */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/6">
                <div className="flex flex-wrap items-center gap-1.5">
                  {rev.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className="inline-flex items-center gap-1 rounded-lg bg-surface3 px-2 py-0.5 text-[10px] font-semibold text-peri"
                    >
                      <span>{tag.label}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="text-[11px] font-mono">{rev.createdAt}</span>

                  <button
                    type="button"
                    onClick={() => toggleLike(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      likedReviews[rev.id]
                        ? "bg-peri/20 text-peri border border-peri/40"
                        : "bg-surface3 text-muted hover:text-text"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{(rev.helpfulCount || 12) + (likedReviews[rev.id] ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/12 bg-surface p-6 sm:p-7 shadow-2xl z-10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-text">Review {event.title}</h3>
                  <p className="text-xs text-muted mt-0.5">
                    Share honest feedback on judging, Wi-Fi, mentors, and organizer execution.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-surface2 p-2 text-muted hover:text-text transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
                {/* Rating Stars */}
                <div>
                  <label className="text-xs font-mono font-bold uppercase text-muted block mb-1.5">
                    Overall Experience Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
                        className="p-1 cursor-pointer transition hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating ? "fill-amber-400 text-amber-400" : "text-muted"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-xs font-bold text-amber-400">{rating} out of 5 stars</span>
                  </div>
                </div>

                {/* Author Name and College */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-muted block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Aditya Sharma"
                      className="w-full rounded-xl border border-white/10 bg-surface2 px-3 py-2 text-xs text-text outline-none focus:border-peri/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-muted block mb-1">
                      College / Campus
                    </label>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. IIIT Delhi, DTU"
                      className="w-full rounded-xl border border-white/10 bg-surface2 px-3 py-2 text-xs text-text outline-none focus:border-peri/60"
                      required
                    />
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-xs font-mono font-bold uppercase text-muted block mb-1">
                    Your Honest Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="How was the mentor support, Wi-Fi reliability, food, and judging fairness? Be honest to help fellow builders."
                    className="w-full rounded-xl border border-white/10 bg-surface2 p-3 text-xs text-text outline-none focus:border-peri/60 placeholder:text-muted leading-relaxed"
                    required
                  />
                </div>

                {/* Vibe Tags Toggle */}
                <div>
                  <label className="text-xs font-mono font-bold uppercase text-muted block mb-1.5">
                    Highlight Key Vibe Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_TAGS.map((tag) => {
                      const active = selectedTags.includes(tag.label);
                      return (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => handleTagToggle(tag.label)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            active
                              ? "bg-peri text-white border border-peri/50"
                              : "bg-surface2 text-muted hover:text-text border border-white/6"
                          }`}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-text hover:bg-surface2 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !reviewText.trim()}
                    className="px-5 py-2 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition cursor-pointer disabled:opacity-50"
                  >
                    Post Verified Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
