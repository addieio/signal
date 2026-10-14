"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  ExternalLink,
  MapPin,
  Send,
  Sparkles,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useCatalog } from "@/lib/useCatalog";
import { useProfileStore } from "@/store/profileStore";
import { matchGenieEvents } from "@/lib/genieMatcher";
import type { Event } from "@/lib/types";

interface Message {
  id: string;
  sender: "user" | "genie";
  text: string;
  results?: Event[];
  source?: "signal_ai" | "catalog_engine";
}

const PROMPT_SUGGESTIONS = [
  "Hackathons in Delhi in October",
  "Find online AI and Machine Learning hackathons",
  "Top hackathons with cash prize pools",
  "Developer meets and community networking on Luma",
  "Beginner-friendly hackathons for college students",
  "Global MLH season hackathons",
];

function TypewriterBubble({ text, isLatest }: { text: string; isLatest: boolean }) {
  const [displayed, setDisplayed] = useState(isLatest ? "" : text);

  useEffect(() => {
    if (!isLatest) {
      setDisplayed(text);
      return;
    }

    let i = 0;
    const speed = text.length > 200 ? 10 : 18;
    const interval = setInterval(() => {
      i += 2;
      if (i >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, speed);

    return () => {
      clearInterval(interval);
      setDisplayed(text);
    };
  }, [text, isLatest]);

  return (
    <div className="relative">
      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{displayed}</p>
      {isLatest && displayed.length < text.length && (
        <span className="inline-block ml-0.5 text-lime font-mono animate-pulse font-bold">|</span>
      )}
    </div>
  );
}

export function GenieChat() {
  const profile = useProfileStore((state) => state.profile);
  const snapshot = useCatalog();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "genie",
      text: "Hello builder! I am Signal AI Genie, your personal hackathon discovery copilot grounded strictly in our verified global catalogue. Ask me for events by city (e.g., 'Delhi in October'), tech stack (AI, Web3), cash prize pool, or platform (Luma, MLH, Devfolio), and I'll find them for you.",
      source: "signal_ai",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Connect directly to backend Signal AI endpoint
      const res = await fetch("/api/genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, profile }),
      });

      if (!res.ok) {
        throw new Error(`Signal AI API error ${res.status}`);
      }

      const data = await res.json();
      const suggestedSlugs: string[] = Array.isArray(data.suggestedEvents)
        ? data.suggestedEvents
        : [];

      // Match slugs against current live snapshot
      let matchedEvents = suggestedSlugs
        .map((slug) => snapshot.events.find((e) => e.slug === slug || e.id === slug))
        .filter(Boolean) as Event[];

      // Fallback: If 0 slugs matched, run local matcher for companion cards
      if (matchedEvents.length === 0) {
        const localMatches = matchGenieEvents(query, snapshot.events, profile);
        matchedEvents = localMatches.results || [];
      }

      const genieMsg: Message = {
        id: `genie-${Date.now()}`,
        sender: "genie",
        text: data.reply || "Here are hackathons matching your query.",
        results: matchedEvents,
        source: data.source || "signal_ai",
      };

      setMessages((prev) => [...prev, genieMsg]);
    } catch (err) {
      console.warn("AI Genie API error, utilizing local heuristic fallback:", err);
      const matchOutcome = matchGenieEvents(query, snapshot.events, profile);
      const genieMsg: Message = {
        id: `genie-${Date.now()}`,
        sender: "genie",
        text: matchOutcome.reply,
        results: matchOutcome.results,
        source: "catalog_engine",
      };
      setMessages((prev) => [...prev, genieMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text pb-32 md:pb-24 pt-8 sm:pt-12 transition-colors duration-250">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Genie Hero Title */}
        <div className="flex items-center gap-3.5 border-b border-white/8 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-peri to-primary text-white shadow-lg shadow-peri/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text">
                Signal AI Genie
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 border border-lime/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-lime">
                <Sparkles className="w-3 h-3 text-lime" />
                Signal AI Copilot
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Powered by Signal Intelligence &bull; Grounded strictly in verified live hackathons.
            </p>
          </div>
        </div>

        {/* Suggested Prompts Pills */}
        <div className="mt-5">
          <p className="text-xs font-mono font-bold text-muted uppercase tracking-wider mb-2">
            Suggested Prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="rounded-xl border border-white/8 bg-surface px-3 py-1.5 text-xs text-text transition hover:border-peri/40 hover:bg-surface2 cursor-pointer active:scale-95 shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Stream */}
        <div className="mt-8 space-y-6">
          {messages.map((msg, index) => {
            const isLatestGenie =
              msg.sender === "genie" && index === messages.length - 1 && !isTyping;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "genie" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 ${
                    msg.sender === "user"
                      ? "bg-primary text-white ml-12 rounded-tr-sm shadow-md shadow-primary/20"
                      : "border border-white/8 bg-surface text-text rounded-tl-sm shadow-xl"
                  }`}
                >
                  {/* Origin Badge */}
                  {msg.sender === "genie" && (
                    <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/6">
                      {msg.source === "signal_ai" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-peri bg-peri/10 border border-peri/20 px-2 py-0.5 rounded-full">
                          <Sparkles className="h-3 w-3 text-lime" />
                          Signal AI Copilot
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-muted bg-surface2 px-2 py-0.5 rounded-full">
                          <Zap className="h-3 w-3 text-amber-400" />
                          Catalog Radar
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Body with Typewriter for latest response */}
                  {msg.sender === "genie" ? (
                    <TypewriterBubble text={msg.text} isLatest={isLatestGenie} />
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  )}

                  {/* Event Results Cards inside Genie Message */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {msg.results.map((event) => (
                        <div
                          key={event.id}
                          className="flex flex-col rounded-xl border border-white/8 bg-surface2/80 p-3.5 transition hover:border-peri/40 shadow-md"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="micro-label text-peri">{event.source}</span>
                            <span className="text-[10px] font-mono text-muted uppercase">
                              {event.mode === "online" ? "Virtual" : event.mode}
                            </span>
                          </div>

                          <h4 className="font-display text-sm font-bold text-text line-clamp-1">
                            {event.title}
                          </h4>

                          <div className="mt-2 space-y-1 text-xs text-muted">
                            <p className="flex items-center gap-1.5 truncate">
                              <Calendar className="h-3 w-3 text-peri shrink-0" />
                              <span>{event.dateLabel}</span>
                            </p>
                            <p className="flex items-center gap-1.5 truncate">
                              <MapPin className="h-3 w-3 text-peri shrink-0" />
                              <span>{event.city}</span>
                            </p>
                            {event.prizeLabel && (
                              <p className="flex items-center gap-1.5 text-amber-400 font-semibold truncate">
                                <Trophy className="h-3 w-3 shrink-0" />
                                <span>{event.prizeLabel}</span>
                              </p>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2">
                            <Link
                              href={`/event/${event.slug}`}
                              className="text-xs font-bold text-peri hover:underline flex items-center gap-1"
                            >
                              <span>Inspect</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>

                            <a
                              href={event.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-white bg-primary hover:bg-primary-hover px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs"
                            >
                              <span>Official Link</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface2 text-peri border border-white/10">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-center"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div className="rounded-2xl border border-white/8 bg-surface px-4 py-3 text-xs text-muted flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-lime animate-spin" />
                <span>Signal AI is analyzing verified hackathons...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar — positioned above mobile bottom nav */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="sticky bottom-20 md:bottom-6 mt-8 flex gap-2 rounded-2xl border border-white/10 bg-surface/95 p-2 shadow-2xl backdrop-blur-md z-30"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Genie (e.g. 'hackathons in delhi in october' or 'AI hackathons with cash prizes')..."
            className="flex-1 bg-transparent px-4 text-sm text-text outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-hover disabled:opacity-40 cursor-pointer shadow-md shadow-primary/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
