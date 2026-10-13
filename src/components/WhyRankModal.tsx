"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Shield, Flame, Target, Award, Sparkles } from "lucide-react";
import type { Event, RankingResult } from "@/lib/types";
import { MatchRing } from "./MatchRing";

interface WhyRankModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  ranking: RankingResult;
  rankNumber?: number;
}

export function WhyRankModal({
  isOpen,
  onClose,
  event,
  ranking,
  rankNumber,
}: WhyRankModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const { breakdown, reasons } = ranking;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-surface border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <MatchRing score={ranking.total} size={64} strokeWidth={6} showPercent />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-lime font-bold uppercase tracking-wider">
                    {rankNumber ? `Rank #${rankNumber} Match` : "Verified Signal Score"}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-text leading-tight mt-0.5">
                  {event.title}
                </h3>
                <span className="text-xs text-muted font-medium">
                  {event.organizer.name}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close why rank modal"
              className="p-1.5 rounded-xl text-muted hover:text-text hover:bg-surface2 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Breakdown Bars */}
          <div className="space-y-3.5 mb-6 p-4.5 rounded-2xl bg-surface2 border border-white/8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-muted font-bold tracking-wider">
                Signal Algorithm Weights
              </span>
              <span className="text-xs font-bold text-peri flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4 Core Pillars</span>
              </span>
            </div>

            {/* 1. Profile Match */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-text font-bold">
                  <Target className="w-3.5 h-3.5 text-lime" />
                  Profile Affinity (35%)
                </span>
                <span className="font-mono text-lime font-bold">
                  {Math.round(breakdown.profileMatch * 100)}%
                </span>
              </div>
              <div className="h-2 bg-bg/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(breakdown.profileMatch * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-lime rounded-full"
                />
              </div>
            </div>

            {/* 2. Community Vibe */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-text font-bold">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Community Caliber &amp; Scale (25%)
                </span>
                <span className="font-mono text-orange-400 font-bold">
                  {Math.round(breakdown.communityVibe * 100)}%
                </span>
              </div>
              <div className="h-2 bg-bg/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(breakdown.communityVibe * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  className="h-full bg-orange-400 rounded-full"
                />
              </div>
            </div>

            {/* 3. Organizer Trust */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-text font-bold">
                  <Shield className="w-3.5 h-3.5 text-peri" />
                  Organizer Credibility (20%)
                </span>
                <span className="font-mono text-peri font-bold">
                  {Math.round(breakdown.organizerTrust * 100)}%
                </span>
              </div>
              <div className="h-2 bg-bg/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(breakdown.organizerTrust * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-peri rounded-full"
                />
              </div>
            </div>

            {/* 4. ROI & Opportunity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-text font-bold">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  ROI, Prizes &amp; Bounties (20%)
                </span>
                <span className="font-mono text-indigo-400 font-bold">
                  {Math.round(breakdown.roi * 100)}%
                </span>
              </div>
              <div className="h-2 bg-bg/80 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(breakdown.roi * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="h-full bg-indigo-400 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Reasoning list */}
          <div>
            <div className="text-xs font-mono uppercase text-muted font-bold tracking-wider mb-3">
              Verified Recommendation Evidence
            </div>
            <ul className="space-y-2.5">
              {reasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom dismiss */}
          <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between">
            <span className="text-[11px] text-muted">
              Computed from source facts &amp; builder preferences
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-primary/20"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
