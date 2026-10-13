"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormattedOverviewProps {
  text?: string;
  blurb?: string;
  title?: string;
  mode?: "compact" | "full";
  maxLines?: number;
}

interface ParsedSection {
  title: string;
  icon?: string;
  content: string[];
  bullets?: string[];
  phases?: Array<{ title: string; desc: string }>;
}

export function FormattedOverview({
  text = "",
  blurb = "",
  title = "Hackathon Overview",
  mode = "compact",
}: FormattedOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Parse markdown into clean structured sections
  const { summary, highlights, sections } = useMemo(() => {
    const raw = text || blurb || "";
    if (!raw.trim()) {
      return {
        summary: "No detailed description provided by the organizers.",
        highlights: [],
        sections: [],
      };
    }

    // Clean up HTML tags if any (e.g. <p>, <strong>, &amp;)
    const cleaned = raw
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&ndash;/g, "–")
      .replace(/&mdash;/g, "—");

    // Split by markdown headings
    const headingSplitRegex = /(?:^|\n)#+\s*\**([^*#\n]+)\**\s*(?:\n|$)/g;
    const parts = cleaned.split(/(?:^|\n)#+\s*/);

    let intro = "";
    const parsedSections: ParsedSection[] = [];

    if (parts.length > 0) {
      // First chunk is usually the intro
      intro = parts[0].trim();
    }

    // Process all section blocks
    const lines = cleaned.split("\n");
    let currentSection: ParsedSection | null = null;
    let introLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Detect Heading (# Heading or # **Heading**)
      const headingMatch = line.match(/^#+\s*\**([^*#]+?)\**\s*$/);
      if (headingMatch) {
        if (currentSection) {
          parsedSections.push(currentSection);
        }
        const cleanTitle = headingMatch[1].replace(/[*#_]/g, "").trim();
        currentSection = {
          title: cleanTitle,
          content: [],
          bullets: [],
          phases: [],
        };
        continue;
      }

      if (!currentSection) {
        // Still in intro
        introLines.push(line);
      } else {
        // Check for bullet point (* or -)
        if (line.startsWith("*") || line.startsWith("-") || line.startsWith("•")) {
          const cleanBullet = line.replace(/^[*•-]\s*/, "").replace(/\*\*/g, "").trim();
          if (cleanBullet) currentSection.bullets?.push(cleanBullet);
        } else if (line.match(/^\*\*Phase\s*\d+.*?\*\*/i)) {
          // Detect phase
          const phaseTitle = line.replace(/^\*\*/, "").replace(/\*\*.*$/, "").trim();
          const phaseDesc = line.replace(/^\*\*.*?\*\*\s*/, "").trim();
          currentSection.phases?.push({ title: phaseTitle, desc: phaseDesc });
        } else {
          const cleanLine = line.replace(/\*\*/g, "").trim();
          if (cleanLine) currentSection.content.push(cleanLine);
        }
      }
    }

    if (currentSection) {
      parsedSections.push(currentSection);
    }

    // Extract quick highlights from text (Venue, Prize, Team size)
    const detectedHighlights: string[] = [];
    const venueMatch = cleaned.match(/(?:Venue|Location):\s*([^.\n]+)/i);
    if (venueMatch) detectedHighlights.push(`📍 ${venueMatch[1].trim()}`);

    const prizeMatch = cleaned.match(/(?:Prize Pool|Prizes):\s*([^.\n]+)/i);
    if (prizeMatch) detectedHighlights.push(`💰 ${prizeMatch[1].trim()}`);

    const teamMatch = cleaned.match(/(?:Team Size|Teams must consist of):\s*([^.\n]+)/i);
    if (teamMatch) detectedHighlights.push(`👥 ${teamMatch[1].trim()}`);

    const phasesMatch = cleaned.match(/Phase\s*(\d+)/gi);
    if (phasesMatch && phasesMatch.length > 1) {
      detectedHighlights.push(`🎯 ${phasesMatch.length} Challenge Phases`);
    }

    // Clean summary paragraph
    const cleanSummary = (introLines.join(" ") || intro || blurb)
      .replace(/#+\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/[*_]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return {
      summary: cleanSummary,
      highlights: detectedHighlights,
      sections: parsedSections,
    };
  }, [text, blurb]);

  // If in COMPACT mode (for Compare Table side-by-side)
  if (mode === "compact") {
    return (
      <div className="flex flex-col gap-2.5">
        {/* Quick Highlights Chips */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {highlights.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="rounded-md border border-white/10 bg-surface2 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Clean Summary (Truncated without breaking layout) */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
          {summary}
        </p>

        {/* Structured Sections Badges */}
        {sections.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {sections.slice(0, 3).map((sec, idx) => (
              <span
                key={idx}
                className="rounded-md bg-peri/10 border border-peri/20 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-peri truncate max-w-[140px]"
              >
                ✓ {sec.title}
              </span>
            ))}
            {sections.length > 3 && (
              <span className="text-[9px] text-muted font-mono">
                +{sections.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Toggle Button */}
        <div className="pt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-peri/30 bg-peri/10 px-2.5 py-1 text-[11px] font-bold text-peri hover:bg-peri/20 transition cursor-pointer"
          >
            <Maximize2 className="h-3 w-3" />
            <span>Read Structured Brief</span>
          </button>
        </div>

        {/* Full Modal Viewer */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/12 bg-surface p-6 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/8 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Flame className="h-5 w-5 text-peri shrink-0" />
                    <h3 className="font-display text-lg font-bold text-text truncate">
                      {title} · Verified Brief
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="p-1.5 rounded-xl border border-white/10 bg-surface2 text-muted hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 py-4 space-y-5 pr-1">
                  {/* Executive Summary */}
                  <div className="rounded-2xl border border-white/8 bg-surface2/60 p-4">
                    <span className="text-[10px] font-mono font-bold uppercase text-peri tracking-wider block mb-1.5">
                      Executive Summary
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  {highlights.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {highlights.map((h, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-white/6 bg-surface2/40 p-3 text-xs font-semibold text-text flex items-center gap-2"
                        >
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Structured Sections */}
                  {sections.map((section, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/8 bg-surface2/40 p-4 space-y-2.5"
                    >
                      <h4 className="font-display text-sm font-bold text-lime flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-peri shrink-0" />
                        <span>{section.title}</span>
                      </h4>

                      {section.content.map((c, i) => (
                        <p key={i} className="text-xs text-slate-300 leading-relaxed">
                          {c}
                        </p>
                      ))}

                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-1">
                          {section.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                              <CheckCircle2 className="h-3.5 w-3.5 text-peri shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.phases && section.phases.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {section.phases.map((p, i) => (
                            <div
                              key={i}
                              className="rounded-xl border border-white/8 bg-surface p-3"
                            >
                              <span className="font-mono text-xs font-bold text-peri block">
                                {p.title}
                              </span>
                              {p.desc && (
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                  {p.desc}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/8 flex justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition"
                  >
                    Close Overview
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // FULL mode (for Event detail page)
  return (
    <div className="space-y-6">
      {/* Executive Summary Paragraph */}
      <div className="rounded-2xl border border-white/8 bg-surface2/40 p-5">
        <p className="text-sm leading-relaxed text-slate-200">{summary}</p>
      </div>

      {/* Highlights Bar */}
      {highlights.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/8 bg-surface2/60 p-3.5 text-xs font-semibold text-text shadow-xs"
            >
              <span>{h}</span>
            </div>
          ))}
        </div>
      )}

      {/* Parsed Sections */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/8 bg-surface2/30 p-5 transition hover:border-white/12"
          >
            <h4 className="font-display text-base font-bold text-text flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-lime" />
              <span>{section.title}</span>
            </h4>

            {section.content.map((c, i) => (
              <p key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                {c}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="space-y-2 mt-3">
                {section.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-lime shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.phases && section.phases.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 mt-3">
                {section.phases.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-peri/20 bg-surface p-3.5 shadow-xs"
                  >
                    <span className="font-mono text-xs font-bold text-peri block">
                      {p.title}
                    </span>
                    {p.desc && (
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {p.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
