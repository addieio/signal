"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";

export default function RootPage() {
  const router = useRouter();
  const hasCompletedOnboarding = useProfileStore((state) => state.hasCompletedOnboarding);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check both Zustand store and localStorage flags
    let completed = hasCompletedOnboarding;
    try {
      const stored = localStorage.getItem("signal-profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.hasCompletedOnboarding || parsed?.state?.profile) {
          completed = true;
        }
      }
    } catch {
      // fallback to store value
    }

    if (completed) {
      router.replace("/home");
    } else {
      router.replace("/onboarding");
    }
  }, [mounted, hasCompletedOnboarding, router]);

  // Brief clean loader while checking onboarding state
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center text-text">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-peri/20 to-lime/20 border border-white/10 text-lime animate-pulse">
          <span className="font-display font-black text-lg">S</span>
        </div>
        <p className="text-xs font-mono text-muted tracking-wider">CHECKING RADAR PROFILE...</p>
      </div>
    </div>
  );
}
