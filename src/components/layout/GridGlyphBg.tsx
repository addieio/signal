"use client";

import { motion } from "framer-motion";

const GLYPHS = [
  { text: "{}", top: "16%", left: "4%", size: "text-2xl text-slate-500/25", delay: 0 },
  { text: "</>", bottom: "20%", right: "5%", size: "text-2xl text-slate-500/25", delay: 0.5 },
  { text: "+", top: "18%", right: "22%", size: "text-lg text-lime/30", delay: 1 },
  { text: "+", bottom: "32%", left: "8%", size: "text-lg text-lime/30", delay: 0.3 },
  { text: "0101", bottom: "45%", right: "8%", size: "text-xs text-slate-600/30", delay: 1.5 },
  { text: "=>", top: "65%", left: "5%", size: "text-xl text-slate-500/20", delay: 0.8 },
];

export function GridGlyphBg() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Precision Technical Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Hero Ambient Green Spotlight on right side (matching inspiration image) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle 500px at 75% 30%, rgba(198, 255, 74, 0.12), transparent 70%),
            radial-gradient(circle 600px at 20% 25%, rgba(99, 102, 241, 0.06), transparent 70%),
            radial-gradient(ellipse 90% 70% at 50% 50%, transparent 20%, #0B0E14 90%)
          `,
        }}
      />

      {/* Floating code glyphs & technical crosshairs */}
      {GLYPHS.map((glyph, i) => (
        <motion.span
          key={i}
          className={`absolute font-mono font-bold ${glyph.size}`}
          style={{
            top: glyph.top,
            bottom: glyph.bottom,
            left: glyph.left,
            right: glyph.right,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0.15, 0.35, 0.2, 0.35],
            y: [8, 0, -5, 0],
          }}
          transition={{
            duration: 6,
            delay: glyph.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          {glyph.text}
        </motion.span>
      ))}
    </div>
  );
}
