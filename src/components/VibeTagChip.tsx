"use client";

import { VibeTag } from "@/lib/types";

interface VibeTagChipProps {
  tag: VibeTag;
  size?: "sm" | "md";
}

export function VibeTagChip({ tag, size = "sm" }: VibeTagChipProps) {
  const isPos = tag.sentiment === "pos";
  const isNeg = tag.sentiment === "neg";

  const colorStyles = isPos
    ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
    : isNeg
    ? "bg-rose-50 border-rose-200 text-rose-800 font-semibold"
    : "bg-slate-100 border-slate-200 text-slate-700 font-medium";

  const dotColor = isPos
    ? "bg-emerald-600"
    : isNeg
    ? "bg-rose-500"
    : "bg-slate-500";

  const sizeStyles =
    size === "sm"
      ? "text-[11px] px-2.5 py-0.5 gap-1.5"
      : "text-xs px-3 py-1 gap-2";

  return (
    <span
      className={`inline-flex items-center rounded-md border transition-colors select-none ${colorStyles} ${sizeStyles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="truncate max-w-[170px]">{tag.label}</span>
    </span>
  );
}
