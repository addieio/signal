"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface SignalLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

/**
 * Signal Official Brand Logo
 * Loads the user's high-resolution official logo from /signal-logo.png
 */
export function SignalLogo({
  size = 36,
  className = "",
  showWordmark = false,
}: SignalLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-white shadow-xs border border-slate-100"
        style={{ width: size, height: size }}
      >
        <Image
          src="/signal-logo.png"
          alt="Signal"
          width={size}
          height={size}
          className="w-full h-full object-contain p-0.5"
          priority
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            className="font-display font-extrabold text-xl tracking-tight text-[#1C49C2] leading-none"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Signal
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 leading-none">
            Hackathon Radar
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Animated Pulse Signal Mark
 */
export function NoiseTrSignalMark({
  width = 320,
  height = 80,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="unstopSignalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1C49C2" />
        </linearGradient>
      </defs>

      <motion.polyline
        points="8,46 22,34 36,52 50,28 66,48 80,30 96,44 112,38"
        stroke="url(#unstopSignalGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      <motion.path
        d="M112 38 C144 38 170 36 204 30 S264 18 290 14"
        stroke="#1C49C2"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />

      <motion.circle
        cx="296"
        cy="13"
        r="5.5"
        fill="#1C49C2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.3, 1], opacity: 1 }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3, delay: 1.4 },
        }}
      />
    </svg>
  );
}

/**
 * Score Ring Mark (Used in loading states & HUD)
 */
export function ScoreRingMark({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="48" cy="48" r="34" stroke="#E2E8F0" strokeWidth="8" />
      <circle
        cx="48"
        cy="48"
        r="34"
        stroke="#1C49C2"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="196.5 213.6"
        transform="rotate(-90 48 48)"
      />
      <polyline
        points="30,52 40,52 45,40 52,60 57,48 66,48"
        stroke="#2563EB"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * BeaconMark (Genie avatar mark)
 */
export function BeaconMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-blue-50 border border-blue-100 shadow-xs"
      style={{ width: size, height: size }}
    >
      <Image
        src="/signal-logo.png"
        alt="Signal Genie"
        width={size}
        height={size}
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
}
