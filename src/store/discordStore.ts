"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DiscordFriend {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  status: "online" | "idle" | "dnd";
  attendingEventSlugs: string[];
  college?: string;
  tagline?: string;
}

export interface DiscordState {
  isConnected: boolean;
  user: {
    username: string;
    discriminator: string;
    avatarUrl: string;
    serverCount: number;
  } | null;
  friends: DiscordFriend[];
  connectDiscord: () => void;
  disconnectDiscord: () => void;
  toggleConnect: () => void;
  getFriendsForEvent: (eventSlugOrId: string) => DiscordFriend[];
}

// Curated realistic mock student friends dataset for Delhi/Pan-India hackathon community
export const DEMO_DISCORD_FRIENDS: DiscordFriend[] = [
  {
    id: "f-1",
    name: "Arjun Sharma",
    username: "arjun.dev",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    status: "online",
    attendingEventSlugs: [
      "devfolio-nexhack-2",
      "devfolio-hacknauts-20",
      "unstop-nexhack-3-0-build-what-s-next",
      "the-outpost",
    ],
    college: "IIT Delhi",
    tagline: "Fullstack & Rust builder",
  },
  {
    id: "f-2",
    name: "Priya Patel",
    username: "priya_codes",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    status: "online",
    attendingEventSlugs: [
      "devfolio-nexhack-2",
      "unstop-codewithchat-ai-dev-challenge-build-launch-monetize-with-vibe-coding",
      "devfolio-hacknauts-20",
    ],
    college: "IIIT Delhi",
    tagline: "AI / Agentic systems",
  },
  {
    id: "f-3",
    name: "Kabir Mehta",
    username: "kabir_m",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    status: "idle",
    attendingEventSlugs: [
      "devfolio-nexhack-2",
      "hackbios-2k26",
      "the-outpost",
    ],
    college: "DTU Delhi",
    tagline: "Competitive Programmer & Frontend",
  },
  {
    id: "f-4",
    name: "Ananya Sen",
    username: "ananya_s",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
    status: "dnd",
    attendingEventSlugs: [
      "devfolio-nexhack-2",
      "devfolio-hacknauts-20",
      "unstop-nexhack-3-0-build-what-s-next",
    ],
    college: "NSUT Delhi",
    tagline: "Figma wizard & UX Designer",
  },
  {
    id: "f-5",
    name: "Devansh Gupta",
    username: "dev_gupta",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    status: "online",
    attendingEventSlugs: [
      "devfolio-nexhack-2",
      "unstop-codewithchat-ai-dev-challenge-build-launch-monetize-with-vibe-coding",
      "the-outpost",
    ],
    college: "IIIT Delhi",
    tagline: "Distributed systems & Web3",
  },
];

export const useDiscordStore = create<DiscordState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      user: null,
      friends: DEMO_DISCORD_FRIENDS,

      connectDiscord: () => {
        set({
          isConnected: true,
          user: {
            username: "addie_builder",
            discriminator: "4096",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
            serverCount: 14,
          },
          friends: DEMO_DISCORD_FRIENDS,
        });
      },

      disconnectDiscord: () => {
        set({
          isConnected: false,
          user: null,
        });
      },

      toggleConnect: () => {
        const current = get().isConnected;
        if (current) {
          get().disconnectDiscord();
        } else {
          get().connectDiscord();
        }
      },

      getFriendsForEvent: (eventSlugOrId: string) => {
        if (!get().isConnected) return [];
        const cleanSlug = eventSlugOrId.toLowerCase();
        return get().friends.filter((f) =>
          f.attendingEventSlugs.some(
            (slug) =>
              cleanSlug.includes(slug) ||
              slug.includes(cleanSlug) ||
              cleanSlug.includes("nexhack") && slug.includes("nexhack")
          )
        );
      },
    }),
    {
      name: "signal-discord-demo-storage",
    }
  )
);
