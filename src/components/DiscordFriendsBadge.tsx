"use client";

import { useState } from "react";
import { Users, Sparkles, CheckCircle2 } from "lucide-react";
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#5865F2]/30 bg-[#5865F2]/10 px-2.5 py-1 text-xs font-semibold text-[#A5B4FC] hover:bg-[#5865F2]/20 transition cursor-pointer"
          >
            <span className="font-mono text-[9px] bg-[#5865F2]/30 text-white px-1 rounded uppercase font-bold">
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
            <span className="font-mono text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 rounded uppercase font-bold">
              DEMO
            </span>
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              {friends.slice(0, 3).map((f) => (
                <img
                  key={f.id}
                  src={f.avatarUrl}
                  alt={f.name}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-surface object-cover"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-pos">
              {friends.length} {friends.length === 1 ? "friend" : "friends"} going
            </span>
          </div>
          <p className="text-[11px] text-slate-300 group-hover/friends:text-white transition">
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
          <div className="rounded-2xl border border-[#5865F2]/30 bg-[#5865F2]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-text">
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
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#5865F2] px-4 py-2 text-xs font-bold text-white hover:bg-[#4752C4] transition shadow-md shadow-[#5865F2]/25 cursor-pointer shrink-0"
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
        <div className="rounded-2xl border border-pos/30 bg-surface2 p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-pos" />
              <span className="font-display text-sm font-bold text-text">
                Discord Friends Attending
              </span>
              <span className="rounded bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[9px] font-mono px-1.5 py-0.2 font-bold uppercase">
                DEMO
              </span>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-[11px] font-mono text-[#A5B4FC] hover:underline"
            >
              Manage Discord Sync (Demo)
            </button>
          </div>

          {friends.length === 0 ? (
            <p className="text-xs text-muted">
              None of your Discord campus friends have RSVP&apos;d to this hackathon yet. Invite them or share the link!
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
                    <div className="flex items-center gap-1">
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

  // Card Variant (Inside EventCard)
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
          className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#5865F2]/10 border border-[#5865F2]/25 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-medium text-[#A5B4FC] hover:bg-[#5865F2]/20 transition cursor-pointer"
        >
          <span className="font-mono text-[7px] sm:text-[8px] bg-[#5865F2]/30 text-white px-1 rounded uppercase font-bold">
            DEMO
          </span>
          <span className="truncate">Connect Discord to see friends</span>
        </button>
        <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (friends.length === 0) {
    return null;
  }

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setModalOpen(true);
        }}
        className="mt-2 flex items-center gap-1.5 rounded-lg border border-pos/25 bg-pos/10 p-1 sm:p-1.5 cursor-pointer hover:border-pos/40 transition group/badge"
        title="Click to view attending friends (Demo)"
      >
        <span className="font-mono text-[7px] sm:text-[8px] bg-amber-400/25 border border-amber-400/40 text-amber-300 px-1 rounded uppercase font-bold shrink-0">
          DEMO
        </span>

        {/* Mini avatar stack */}
        <div className="flex -space-x-1.5 overflow-hidden shrink-0">
          {friends.slice(0, 3).map((f) => (
            <img
              key={f.id}
              src={f.avatarUrl}
              alt={f.name}
              className="inline-block h-4 w-4 sm:h-5 sm:w-5 rounded-full ring-1 ring-surface object-cover"
            />
          ))}
        </div>

        <div className="min-w-0 flex-1 truncate text-[8px] sm:text-[10px] text-text font-medium">
          <span className="font-bold text-pos">
            {friends.length} {friends.length === 1 ? "friend" : "friends"} going
          </span>
          <span className="hidden md:inline text-slate-300 ml-1">
            ({friends.map((f) => f.name.split(" ")[0]).join(", ")})
          </span>
        </div>
      </div>
      <DiscordConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
