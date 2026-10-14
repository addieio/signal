"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  LogOut,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Compass,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useDiscordStore } from "@/store/discordStore";
import { SupabaseAuthModal } from "./SupabaseAuthModal";
import { DiscordConnectModal } from "./DiscordConnectModal";

export function GoogleAuthButton() {
  const { user, initialize, setShowConfigModal } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const { isConnected, user: discordUser, friends } = useDiscordStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [discordModalOpen, setDiscordModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Escape key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <>
      {user ? (
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`inline-flex min-h-9 sm:min-h-10 items-center gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-2.5 py-1 text-xs font-semibold text-text transition-all duration-200 cursor-pointer shadow-xs shrink-0 active:scale-95 ${
              dropdownOpen
                ? "border-peri/60 bg-surface2 ring-2 ring-peri/20"
                : "border-white/10 dark:border-white/10 border-slate-200/80 bg-surface2/60 hover:border-peri/40 hover:bg-surface2"
            }`}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User account menu"
          >
            <div className="relative shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover ring-1 ring-peri/50 shrink-0"
                />
              ) : (
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-tr from-primary to-peri flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                  {user.name[0]?.toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-pos border border-surface ring-1 ring-bg" />
            </div>

            <span className="hidden sm:inline truncate max-w-[85px] font-medium text-text">
              {user.name.split(" ")[0]}
            </span>

            <ChevronDown
              className={`h-3 w-3 text-muted transition-transform duration-200 ${
                dropdownOpen ? "rotate-180 text-peri" : ""
              }`}
            />
          </button>

          {/* Luxury Account Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/12 dark:border-white/12 border-slate-200 bg-surface/95 dark:bg-surface/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/40 z-50 overflow-hidden"
              >
                {/* User Card */}
                <div className="p-3 rounded-xl bg-surface2/60 dark:bg-surface2/60 border border-white/6 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-peri/50 shrink-0"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold shrink-0">
                        {user.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-text truncate">{user.name}</p>
                      <p className="text-[10px] text-muted truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-lime/15 border border-lime/30 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-lime">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      {user.isDemo ? "Demo Builder" : "Verified"}
                    </span>
                    {isConnected && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#5865F2]/20 border border-[#5865F2]/30 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-[#A5B4FC]">
                        Squad Synced
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Navigations within Account */}
                <div className="space-y-0.5 py-1">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-text hover:bg-surface2 hover:text-peri transition"
                  >
                    <UserIcon className="h-4 w-4 text-peri shrink-0" />
                    <span>My Profile & Reviews</span>
                  </Link>

                  <Link
                    href="/onboarding"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-text hover:bg-surface2 hover:text-lime transition"
                  >
                    <Sparkles className="h-4 w-4 text-lime shrink-0" />
                    <span>Vibe Calibration & Preferences</span>
                  </Link>

                  {/* Discord Squad Presence in Dropdown */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setDiscordModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-text hover:bg-surface2 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Users className="h-4 w-4 text-[#5865F2] shrink-0" />
                      <span className="truncate">Campus Squad Presence</span>
                    </div>
                    <span className="text-[10px] font-mono text-peri font-bold shrink-0">
                      {isConnected ? `${friends.length} peers` : "Connect"}
                    </span>
                  </button>
                </div>

                <div className="my-1 border-t border-white/8 dark:border-white/8 border-slate-200" />

                {/* Sign Out */}
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neg hover:bg-neg/10 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          className="inline-flex min-h-9 sm:min-h-10 items-center gap-2 rounded-xl border border-white/10 dark:border-white/10 border-slate-200/80 bg-surface2/60 hover:bg-surface2 hover:border-peri/40 px-3 sm:px-3.5 text-xs font-bold text-text transition-all duration-200 shadow-xs active:scale-95 cursor-pointer shrink-0"
          title="Sign in to Signal"
        >
          <LogIn className="h-3.5 w-3.5 text-peri shrink-0" />
          <span>Sign In</span>
        </button>
      )}

      {/* Auth Modal for signing in */}
      <SupabaseAuthModal />

      {/* Discord Modal for squad management */}
      <DiscordConnectModal isOpen={discordModalOpen} onClose={() => setDiscordModalOpen(false)} />
    </>
  );
}
