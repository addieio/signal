import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/lib/types";

interface ProfileStore {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  hasCompletedOnboarding: boolean;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      hasCompletedOnboarding: false,
      setProfile: (p) => set({ profile: p, hasCompletedOnboarding: true }),
      clearProfile: () =>
        set({ profile: null, hasCompletedOnboarding: false }),
    }),
    {
      name: "signal-profile",
    }
  )
);
