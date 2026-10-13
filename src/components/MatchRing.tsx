"use client";

import { motion } from "framer-motion";

interface MatchRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercent?: boolean;
}

export function MatchRing({
  score,
  size = 56,
  strokeWidth = 5,
  className = "",
  showPercent = false,
}: MatchRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Adaptive vibrant color based on score tier
  const strokeColor =
    normalizedScore >= 85
      ? "#22C55E" // Vibrant emerald / lime
      : normalizedScore >= 70
      ? "#6366F1" // Indigo
      : "#F59E0B"; // Amber

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={normalizedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Signal score: ${normalizedScore}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] overflow-visible"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-white/10 dark:text-white/10 light:text-slate-200"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      </svg>
      {/* Central Score Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-display font-extrabold text-xs sm:text-sm text-text tracking-tight">
          {normalizedScore}
          {showPercent && <span className="text-[10px] text-muted font-medium">%</span>}
        </span>
      </div>
    </div>
  );
}
