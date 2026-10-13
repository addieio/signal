"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Compass, Medal, Moon, Scale, Sun, User } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { useTheme } from "@/components/ThemeProvider";

export function BottomNav() {
  const pathname = usePathname();
  const compareCount = useCompareStore((state) => state.selected.length);
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: "/home", label: "Events", icon: Compass },
    { href: "/rankings", label: "Rankings", icon: Medal },
    {
      href: "/compare",
      label: "Compare",
      icon: Scale,
      badge: compareCount > 0 ? compareCount : undefined,
    },
    { href: "/genie", label: "Genie", icon: Bot },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-bg/95 backdrop-blur-md md:hidden"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {links.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative inline-flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-bold transition ${
                isActive ? "text-peri font-extrabold" : "text-muted hover:text-text"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white">
                    {badge}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Mobile Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="inline-flex min-h-12 min-w-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-bold text-muted hover:text-text"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-300" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600" />
          )}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </nav>
  );
}
