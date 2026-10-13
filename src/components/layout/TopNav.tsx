"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Compass, Medal, Moon, Scale, Search, Sparkles, Sun } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { useTheme } from "@/components/ThemeProvider";
import { DiscordNavButton } from "@/components/DiscordNavButton";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export function TopNav() {
  const pathname = usePathname();
  const selectedCount = useCompareStore((state) => state.selected.length);
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: "/home", label: "Events", icon: Compass },
    { href: "/rankings", label: "Rankings", icon: Medal },
    { href: "/search", label: "Search", icon: Search },
    {
      href: "/compare",
      label: "Compare",
      icon: Scale,
      badge: selectedCount > 0 ? selectedCount : undefined,
    },
    { href: "/genie", label: "AI Genie", icon: Bot },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-bg/90 backdrop-blur-md transition-colors duration-250">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/home" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-black tracking-tight text-text">
            Signal<span className="text-lime">.</span>
          </span>
          <span className="hidden sm:inline-block rounded-md bg-lime/10 border border-lime/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-lime">
            Live Radar
          </span>
        </Link>

        {/* Primary Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative inline-flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-peri/15 text-peri border border-peri/30 shadow-sm"
                    : "text-muted hover:bg-surface2 hover:text-text border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{label}</span>
                {badge !== undefined && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-black text-white shadow-sm shadow-primary/40 animate-pulse">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle, Discord, Google Auth & Preferences */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Supabase Google Auth Button */}
          <GoogleAuthButton />

          {/* Discord Squad Presence (Demo) */}
          <DiscordNavButton />

          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/10 bg-surface2 text-text hover:border-peri/40 transition active:scale-95 cursor-pointer shadow-sm shrink-0"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-300" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </motion.div>
          </button>

          <Link
            href="/onboarding"
            className="hidden sm:inline-flex min-h-9 sm:min-h-10 items-center gap-1.5 rounded-xl bg-primary px-3 sm:px-4 text-xs font-bold text-white transition hover:bg-primary-hover shadow-md shadow-primary/20 active:scale-95 shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Preferences</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
