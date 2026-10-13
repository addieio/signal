"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Radio,
  Unlink,
  LogIn,
} from "lucide-react";
import { useDiscordStore, DEMO_DISCORD_FRIENDS } from "@/store/discordStore";

interface DiscordConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscordConnectModal({ isOpen, onClose }: DiscordConnectModalProps) {
  const { isConnected, user, friends, connectDiscord, disconnectDiscord } = useDiscordStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#5865F2]/40 bg-surface p-6 shadow-2xl shadow-[#5865F2]/20 z-10"
        >
          {/* Header Ambient Glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#5865F2]/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-lime/15 blur-3xl pointer-events-none" />

          {/* Top Row: Title + Close */}
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/30">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-text">Discord Campus Sync</h3>
                  <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-mono font-extrabold text-amber-300">
                    DEMO
                  </span>
                </div>
                <p className="text-xs text-muted">See which friends and seniors are attending hackathons</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-surface2 p-2 text-muted hover:text-white transition"
              aria-label="Close Discord Demo Modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Connection Status Box */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-surface2/70 p-4 relative z-10">
            {isConnected && user ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-12 w-12 rounded-full border-2 border-[#5865F2] object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-pos" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-text">@{user.username}</span>
                      <span className="text-xs text-muted font-mono">#{user.discriminator}</span>
                    </div>
                    <span className="text-[11px] text-pos font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Connected &amp; Synced (Demo)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={disconnectDiscord}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neg/30 bg-neg/10 px-3.5 py-2 text-xs font-bold text-neg hover:bg-neg/20 transition cursor-pointer self-start sm:self-auto"
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
                    Test how Signal dynamically detects squad attendance, friend teams, and Discord server RSVP activity.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={connectDiscord}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-5 text-xs font-bold text-white shadow-lg shadow-[#5865F2]/25 hover:bg-[#4752C4] transition cursor-pointer active:scale-95 shrink-0"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Connect Discord (Demo)</span>
                </button>
              </div>
            )}
          </div>

          {/* Friends Attending List Preview */}
          <div className="mt-5 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-peri" />
                {isConnected ? "Active Campus Friends (Demo Roster)" : "Sample Friends Attendance Preview"}
              </span>
              <span className="text-[10px] font-mono text-peri">
                {DEMO_DISCORD_FRIENDS.length} Friends Tracked
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {DEMO_DISCORD_FRIENDS.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/6 bg-surface2/50 p-2.5 transition hover:bg-surface2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="h-8 w-8 rounded-full border border-white/10 object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-surface ${
                          friend.status === "online"
                            ? "bg-pos"
                            : friend.status === "idle"
                            ? "bg-amber-400"
                            : "bg-neg"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text truncate">{friend.name}</p>
                      <p className="text-[10px] text-muted truncate">
                        {friend.college} · <span className="text-peri font-mono">@{friend.username}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#5865F2]/15 border border-[#5865F2]/30 px-2 py-0.5 text-[10px] font-bold text-[#A5B4FC]">
                      {friend.attendingEventSlugs.length} Events RSVP&apos;d
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Disclaimer Footer */}
          <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] text-muted">
            <span className="flex items-center gap-1 text-amber-300 font-mono">
              <Sparkles className="h-3 w-3" /> DEMO FEATURE SIMULATOR
            </span>
            <span>Toggle anytime to preview social signal</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
