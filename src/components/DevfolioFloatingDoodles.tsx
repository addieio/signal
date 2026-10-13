"use client";

import { motion } from "framer-motion";

export function DevfolioFloatingDoodles() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* 1. Top-Left: Warm Cream Face with Hand-Drawn Features */}
      <motion.div
        className="absolute top-[8%] left-[18%] hidden sm:block"
        animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
          {/* Organic blob background */}
          <path
            d="M15 45 C15 15, 85 10, 85 45 C85 75, 25 80, 15 45 Z"
            fill="#FEF08A"
            opacity="0.85"
          />
          {/* Hand-drawn eye & nose strokes */}
          <path d="M42 28 C42 38, 48 42, 52 42" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M35 48 C42 54, 52 54, 58 48" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="58" cy="38" r="3" fill="#0F172A" />
        </svg>
      </motion.div>

      {/* 2. Top-Center: Warm Peach Face */}
      <motion.div
        className="absolute top-[6%] left-[48%] hidden md:block"
        animate={{ y: [0, 10, 0], rotate: [1, -2, 1] }}
        transition={{ duration: 6, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="110" height="95" viewBox="0 0 110 95" fill="none">
          <path
            d="M20 35 C20 10, 95 12, 95 40 C95 80, 30 75, 20 35 Z"
            fill="#FED7AA"
            opacity="0.9"
          />
          <path d="M48 24 C48 30, 52 35, 60 35" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 45 C48 58, 68 58, 74 45" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* 3. Top-Right: Smiling Mint & Yellow Double Characters */}
      <motion.div
        className="absolute top-[10%] right-[16%] hidden sm:block"
        animate={{ y: [0, -12, 0], rotate: [-1, 3, -1] }}
        transition={{ duration: 5.5, delay: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
          {/* Mint character behind */}
          <path
            d="M45 25 C45 8, 105 10, 105 40 C105 70, 55 65, 45 25 Z"
            fill="#6EE7B7"
            opacity="0.85"
          />
          <circle cx="92" cy="32" r="3" fill="#0F172A" />
          <path d="M82 22 C82 30, 86 33, 90 33" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

          {/* Yellow character in front */}
          <path
            d="M15 50 C15 25, 80 30, 80 65 C80 90, 25 85, 15 50 Z"
            fill="#FDE047"
            opacity="0.95"
          />
          <path d="M45 42 C45 50, 48 54, 52 54" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 62 C46 72, 60 70, 66 60" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* 4. Left Side: Bright Green Blob with Eye */}
      <motion.div
        className="absolute top-[36%] left-[14%] hidden sm:block"
        animate={{ y: [0, 8, 0], rotate: [3, -2, 3] }}
        transition={{ duration: 7, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
          <path
            d="M10 35 C10 12, 70 15, 70 42 C70 65, 20 62, 10 35 Z"
            fill="#10B981"
            opacity="0.9"
          />
          <circle cx="50" cy="34" r="3.5" fill="#0F172A" />
          <path d="M32 40 C38 46, 46 44, 50 38" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* 5. Right Side: Soft Cream Starburst */}
      <motion.div
        className="absolute top-[42%] right-[18%] hidden sm:block"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <svg width="85" height="85" viewBox="0 0 85 85" fill="none">
          <path
            d="M42.5 0 L51 18 L71 13 L68 33 L85 42.5 L68 52 L71 72 L51 67 L42.5 85 L34 67 L14 72 L17 52 L0 42.5 L17 33 L14 13 L34 18 Z"
            fill="#FEF3C7"
            opacity="0.9"
          />
        </svg>
      </motion.div>

      {/* 6. Center Floating Blue Geometric Dots & Arches */}
      <motion.div
        className="absolute top-[28%] right-[32%] w-7 h-7 rounded-full bg-blue-400 opacity-75"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[52%] left-[28%] w-8 h-8 bg-blue-500 opacity-60 rounded-tl-full"
        animate={{ y: [0, 8, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-14 h-14 border-8 border-blue-400 opacity-50 rounded-tl-full border-r-0 border-b-0"
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 7. Bottom Left: Cream Smiling Character */}
      <motion.div
        className="absolute bottom-[24%] left-[26%] hidden sm:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6.5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="80" height="75" viewBox="0 0 80 75" fill="none">
          <path
            d="M12 30 C12 8, 70 10, 70 38 C70 65, 20 62, 12 30 Z"
            fill="#FEF08A"
            opacity="0.8"
          />
          <path d="M42 20 C42 32, 48 36, 52 36" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M34 40 C40 48, 52 48, 58 40" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
