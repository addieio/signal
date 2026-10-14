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
    { href: "/genie", label: "AI Genie", icon: Bot, isGenie: true },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 dark:border-white/8 border-slate-200/80 bg-bg/85 backdrop-blur-xl transition-colors duration-250">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo with Live Radar Beacon */}
        <Link href="/home" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-peri/20 to-lime/20 border border-white/10 dark:border-white/10 border-slate-200 shadow-xs group-hover:border-peri/40 transition">
            <span className="font-display text-base font-black text-lime">S</span>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-black tracking-tight text-text leading-none">
              Signal<span className="text-lime">.</span>
            </span>
            <span className="hidden sm:inline-block rounded-md bg-lime/10 border border-lime/30 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-lime leading-none">
              Live
            </span>
          </div>
        </Link>

        {/* Primary Desktop Floating Pill Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-2xl border border-white/6 dark:border-white/6 border-slate-200/60 bg-surface/50 p-1 backdrop-blur-md md:flex"
        >
          {links.map(({ href, label, icon: Icon, badge, isGenie }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative inline-flex min-h-9 items-center gap-2 rounded-xl px-3.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-peri/15 text-peri border border-peri/30 font-bold shadow-xs"
                    : "text-muted hover:bg-surface2/70 hover:text-text border border-transparent"
                }`}
              >
                {isGenie ? (
                  <div className="relative">
                    <Icon className="h-4 w-4 text-lime" aria-hidden="true" />
                    <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime" />
                    </span>
                  </div>
                ) : (
                  <Icon className="h-4 w-4" aria-hidden="true" />
                )}

                <span>{label}</span>

                {badge !== undefined && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white shadow-xs animate-pulse">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Items: Squad (Discord), Theme Toggle, Unified Account/Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Campus Squad Attendance (Compact, taste-aligned Discord chip) */}
          <DiscordNavButton />

          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/10 dark:border-white/10 border-slate-200/80 bg-surface2/60 text-text hover:border-peri/40 hover:bg-surface2 transition active:scale-95 cursor-pointer shadow-xs shrink-0"
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

          {/* Unified User Account / Sign In component */}
          <GoogleAuthButton />
        </div>
      </div>
    </header>
  );
}
