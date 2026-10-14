"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Compass, Medal, Scale, User } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

export function BottomNav() {
  const pathname = usePathname();
  const compareCount = useCompareStore((state) => state.selected.length);

  const links = [
    { href: "/home", label: "Events", icon: Compass },
    { href: "/rankings", label: "Rankings", icon: Medal },
    {
      href: "/compare",
      label: "Compare",
      icon: Scale,
      badge: compareCount > 0 ? compareCount : undefined,
    },
    { href: "/genie", label: "AI Genie", icon: Bot },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 dark:border-white/8 border-slate-200/80 bg-bg/95 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {links.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition-all duration-150 ${
                isActive ? "text-peri font-extrabold" : "text-muted hover:text-text"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 ${
                    isActive ? "text-peri scale-110" : "text-muted"
                  }`}
                  aria-hidden="true"
                />
                {badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white shadow-xs">
                    {badge}
                  </span>
                )}
              </div>
              <span className="truncate">{label}</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-peri" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
