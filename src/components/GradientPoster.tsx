"use client";

import { useState } from "react";
import Image from "next/image";

interface GradientPosterProps {
  gradient?: string;
  title: string;
  imageUrl?: string;
  logoUrl?: string;
  platform?: string;
  type?: string;
  className?: string;
  heightClass?: string;
}

const PLATFORM_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  devfolio: { label: "Devfolio", bg: "bg-[#2853E3]/90 border-[#3d6bff]/40", text: "text-white" },
  unstop: { label: "Unstop", bg: "bg-[#0E5BFF]/90 border-[#3d82ff]/40", text: "text-white" },
  mlh: { label: "MLH Member", bg: "bg-[#E73427]/90 border-[#ff5a4e]/40", text: "text-white" },
  hackerearth: { label: "HackerEarth", bg: "bg-[#2C85C5]/90 border-[#4da9eb]/40", text: "text-white" },
  luma: { label: "Luma Meet", bg: "bg-[#E11D48]/90 border-[#fb7185]/40", text: "text-white" },
  devpost: { label: "Devpost", bg: "bg-[#003E54]/90 border-[#007399]/40", text: "text-white" },
};

export function GradientPoster({
  gradient = "linear-gradient(135deg, #11151C 0%, #1A2029 55%, #262f4a 100%)",
  title,
  imageUrl,
  platform = "hackathon",
  type,
  className = "",
  heightClass = "aspect-[16/9] w-full",
}: GradientPosterProps) {
  const [imageError, setImageError] = useState(false);

  const platformKey = platform.toLowerCase();
  const badgeInfo = PLATFORM_BADGES[platformKey] || {
    label: platform,
    bg: "bg-surface2/90 border-white/10",
    text: "text-white",
  };

  const hasValidImage = Boolean(imageUrl && !imageError);

  // Generate nice initials for banner fallback
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  return (
    <div
      className={`group/poster relative overflow-hidden rounded-2xl bg-surface2 ${heightClass} ${className}`}
      style={{ background: gradient }}
    >
      {hasValidImage ? (
        <>
          <Image
            src={imageUrl!}
            alt={`Official banner for ${title}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover/poster:scale-105"
            onError={() => setImageError(true)}
          />
          {/* Subtle gradient vignette at bottom so text/badges remain ultra readable */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/25 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-2 sm:p-5 bg-gradient-to-br from-[#121824] via-[#172033] to-[#202948] grid-bg">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs font-mono font-bold tracking-widest text-peri/70">
              BANNER
            </span>
            <div className="flex h-6 w-6 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 font-display font-black text-white text-[10px] sm:text-sm backdrop-blur">
              {initials}
            </div>
          </div>
          <div>
            <strong className="block font-display text-xs sm:text-lg font-bold leading-tight sm:leading-snug text-white line-clamp-1 sm:line-clamp-2">
              {title}
            </strong>
          </div>
        </div>
      )}

      {/* Top badges: Source Platform badge */}
      <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex items-center gap-1 z-10">
        <span
          className={`inline-flex items-center rounded-full border px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md shadow-black/20 ${badgeInfo.bg} ${badgeInfo.text}`}
        >
          {badgeInfo.label}
        </span>
      </div>

      {/* Bottom info strip: Type label */}
      <div className="absolute inset-x-1.5 bottom-1.5 sm:inset-x-3 sm:bottom-3 flex items-center justify-between gap-1 pointer-events-none z-10">
        {type && (
          <span className="rounded-md border border-white/15 bg-bg/80 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-200 backdrop-blur">
            {type.replace("-", " ")}
          </span>
        )}
      </div>
    </div>
  );
}
