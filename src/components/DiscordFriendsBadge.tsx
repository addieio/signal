"use client";

import { useState } from "react";
import { Users, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useDiscordStore } from "@/store/discordStore";
import { DiscordConnectModal } from "./DiscordConnectModal";

interface DiscordFriendsBadgeProps {
  eventSlugOrId: string;
  variant?: "card" | "detail" | "compare";
}

export function DiscordFriendsBadge({
  eventSlugOrId,
  variant = "card",
}: DiscordFriendsBadgeProps) {
  const { isConnected, getFriendsForEvent } = useDiscordStore();
  const [modalOpen, setModalOpen] = useState(false);

  const friends = isConnected ? getFriendsForEvent(eventSlugOrId) : [];

  if (variant === "compare") {
    if (!isConnected) {
      return (
        <>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#5865F2]/30 bg-[#5865F2]/10 px-2.5 py-1.5 text-xs font-semibold text-[#A5B4FC] hover:bg-[#5865F2]/20 transition cursor-pointer"
          >
            <span className="font-mono text-[9px] bg-[#5865F2]/30 text-white px-1 py-0.2 rounded uppercase font-bold">
              DEMO
            </span>
            <span>Connect Discord to see friends</span>
          </button>
          <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
      );
    }

    if (friends.length === 0) {
      return (
        <span className="text-xs text-muted flex items-center gap-1">
          <span className="font-mono text-[9px] bg-white/10 px-1 rounded uppercase text-muted">
            DEMO
          </span>
          No friends attending yet
        </span>
      );
    }

    return (
      <>
        <div
          onClick={() => setModalOpen(true)}
          className="flex flex-col gap-1.5 cursor-pointer group/friends"
          title="Click to view Discord friends (Demo)"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 rounded uppercase font-bold shrink-0">
              DEMO
            </span>
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              {friends.slice(0, 3).map((f) => (
                <img
                  key={f.id}
                  src={f.avatarUrl}
                  alt={f.name}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-surface object-cover shrink-0"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-pos shrink-0">
              {friends.length} {friends.length === 1 ? "friend" : "friends"} going
            </span>
          </div>
          <p className="text-[11px] text-slate-300 group-hover/friends:text-white transition break-words">
            {friends.map((f) => f.name.split(" ")[0]).join(", ")}
          </p>
        </div>
        <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (variant === "detail") {
    if (!isConnected) {
      return (
        <>
          <div className="rounded-2xl border border-[#5865F2]/30 bg-[#5865F2]/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#5865F2]/25">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm sm:text-base font-bold text-text">
                    Friends Attending Radar
                  </span>
                  <span className="rounded bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[9px] font-mono px-1.5 py-0.2 font-bold uppercase">
                    DEMO
                  </span>
                </div>
                <p className="text-xs text-muted">
                  Connect your Discord (Demo) to see who from your college squad is going.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5865F2] px-4 py-2 text-xs font-bold text-white hover:bg-[#4752C4] transition shadow-md shadow-[#5865F2]/25 cursor-pointer shrink-0 active:scale-95"
            >
              <span>Connect Discord (Demo)</span>
            </button>
          </div>
          <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
      );
    }

    return (
      <>
        <div className="rounded-2xl border border-pos/30 bg-surface2 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-pos shrink-0" />
              <span className="font-display text-sm font-bold text-text">
                Discord Friends Attending
              </span>
              <span className="rounded bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[9px] font-mono px-1.5 py-0.2 font-bold uppercase shrink-0">
                DEMO
              </span>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-[11px] font-mono text-[#A5B4FC] hover:underline cursor-pointer"
            >
              Manage Squad Sync (Demo)
            </button>
          </div>

          {friends.length === 0 ? (
            <p className="text-xs text-muted">
              None of your Discord campus peers have RSVP&apos;d to this hackathon yet. Invite your squad or share the link!
            </p>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-surface p-2.5"
                >
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatarUrl}
                      alt={friend.name}
                      className="h-8 w-8 rounded-full object-cover border border-white/10"
                    />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-surface bg-pos" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-text truncate">{friend.name}</p>
                      <span className="text-[10px] font-mono text-peri">@{friend.username}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 truncate">{friend.college} · RSVP Confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Card Variant (Inside EventCard) - Responsive, clean, NEVER chopped
  if (!isConnected) {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="mt-2.5 w-full flex items-center justify-between gap-1.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/25 hover:border-[#5865F2]/45 px-2.5 py-1.5 text-xs font-semibold text-[#A5B4FC] hover:text-white transition cursor-pointer shadow-xs active:scale-98"
          title="Connect Discord to see which campus peers are going"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <svg className="h-3.5 w-3.5 fill-[#5865F2] shrink-0" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span className="font-bold text-white text-[11px] sm:text-xs">Discord Squad</span>
            <span className="font-mono text-[9px] bg-[#5865F2]/30 text-white px-1 rounded uppercase font-bold shrink-0">
              DEMO
            </span>
          </div>
          <span className="text-[10px] text-peri font-semibold shrink-0 flex items-center gap-0.5">
            <span>See peers</span>
            <span>→</span>
          </span>
        </button>
        <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Connected and friends attending this event
  if (friends.length > 0) {
    return (
      <>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="mt-2.5 w-full flex items-center justify-between gap-2 rounded-xl border border-pos/30 bg-pos/10 hover:bg-pos/15 p-2 transition cursor-pointer group/badge shadow-xs active:scale-98"
          title="Click to view attending friends (Demo)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex -space-x-1.5 overflow-hidden shrink-0">
              {friends.slice(0, 3).map((f) => (
                <img
                  key={f.id}
                  src={f.avatarUrl}
                  alt={f.name}
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-surface object-cover shrink-0"
                />
              ))}
            </div>
            <div className="min-w-0 text-xs font-semibold text-text truncate">
              <span className="text-pos font-bold">
                {friends.length} {friends.length === 1 ? "friend" : "friends"} going
              </span>
              <span className="text-muted ml-1 hidden md:inline">
                ({friends.map((f) => f.name.split(" ")[0]).join(", ")})
              </span>
            </div>
          </div>

          <span className="font-mono text-[9px] bg-pos/20 text-pos border border-pos/30 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">
            Squad
          </span>
        </div>
        <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Connected but 0 friends attending this specific event
  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setModalOpen(true);
        }}
        className="mt-2.5 w-full flex items-center justify-between gap-1.5 rounded-xl border border-white/6 bg-surface2/30 hover:bg-surface2/60 px-2.5 py-1.5 text-xs text-muted hover:text-text transition cursor-pointer"
        title="Check friends attending other hackathons"
      >
        <div className="flex items-center gap-1.5 text-[11px] truncate">
          <Users className="h-3.5 w-3.5 text-muted shrink-0" />
          <span className="truncate">No squad RSVP yet</span>
        </div>
        <span className="text-[10px] text-peri font-medium hover:underline shrink-0">
          Squad radar →
        </span>
      </div>
      <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
