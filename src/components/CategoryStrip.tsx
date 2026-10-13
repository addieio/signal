"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

const categories = [
  {
    id: "tech-platform",
    label: "Technology Platform",
    icon: "/brand/technology-platform-icon_1.png",
    href: "/home?type=hackathon",
    badge: "Active",
  },
  {
    id: "quizzes",
    label: "Online Quizzes",
    icon: "/brand/quizzing-assessments-icon_1.png",
    href: "/home?type=quiz",
    badge: "Trending",
  },
  {
    id: "hackathons",
    label: "Hackathons",
    icon: "/brand/coding-hackathons-icon.svg.png",
    href: "/home",
    badge: "Popular",
    featured: true,
  },
  {
    id: "hiring",
    label: "Recruitment & Sprints",
    icon: "/brand/hiring-challenges-icon.svg.png",
    href: "/home?type=hiring",
    badge: "Jobs",
  },
  {
    id: "simulations",
    label: "Business Simulation",
    icon: "/brand/simulation-games-icon_1.png",
    href: "/home?type=simulation",
    badge: "New",
  },
];

function CategoryItems() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {categories.map((cat) => {
        const typeParam = searchParams ? searchParams.get("type") : null;
        const isSelected =
          (cat.id === "hackathons" && pathname === "/home" && !typeParam) ||
          (typeParam && cat.href.includes(`type=${typeParam}`));

        return (
          <Link
            key={cat.id}
            href={cat.href}
            className={`
              group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200
              ${
                isSelected
                  ? "bg-blue-50 text-[#1C49C2] border border-blue-200/90 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }
            `}
          >
            <div className="w-5 h-5 relative shrink-0">
              <Image
                src={cat.icon}
                alt={cat.label}
                width={20}
                height={20}
                className="object-contain w-full h-full group-hover:scale-110 transition-transform"
              />
            </div>
            <span>{cat.label}</span>
            {cat.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  cat.featured
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {cat.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function CategoryStrip() {
  return (
    <div className="w-full bg-white/95 border-b border-slate-100 sticky top-16 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2.5 gap-2 sm:gap-4">
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400"
                  >
                    {cat.label}
                  </span>
                ))}
              </div>
            }
          >
            <CategoryItems />
          </Suspense>

          {/* Right Side Quick Action: Vibe Filter */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 pl-4 border-l border-slate-200">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C49C2] hover:text-blue-700 hover:underline"
            >
              <span>Personalize My Vibe</span>
              <span className="text-[10px] bg-blue-100 text-[#1C49C2] px-1.5 py-0.5 rounded-full font-mono">
                AI Match
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
