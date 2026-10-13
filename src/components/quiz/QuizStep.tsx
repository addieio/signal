"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles, Zap, Radio } from "lucide-react";

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

interface QuizStepProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
  selectedIds: string[];
  maxSelect?: number;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  canProceed: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

export function QuizStep({
  stepIndex,
  totalSteps,
  title,
  subtitle,
  options,
  selectedIds,
  maxSelect = 1,
  onSelect,
  onNext,
  onBack,
  isFirstStep,
  canProceed,
}: QuizStepProps) {
  const isMulti = maxSelect > 1;
  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  // 3 options per row across mobile and desktop
  const gridClass = "grid-cols-3";

  return (
    <motion.div
      key={`step-${stepIndex}`}
      initial={{ opacity: 0, x: 22 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -22 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="w-full flex flex-col justify-between"
    >
      <div>
        {/* Top Radar & Frequency Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-muted uppercase">
              RADAR CALIBRATION · STEP {stepIndex + 1}/{totalSteps}
            </span>
          </div>

          {/* Equalizer Frequency Pulse Visualizer */}
          <div className="flex items-end gap-0.5 h-3.5 px-2 py-0.5 rounded-md bg-surface2 border border-white/8">
            {[40, 85, 60, 100, 50, 75].map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.5}%`] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-0.5 bg-lime rounded-full"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <span className="text-xs font-mono font-bold text-peri">
            {progressPercent}%
          </span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full h-1.5 bg-surface2 rounded-full overflow-hidden mb-6 border border-white/8 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-peri to-lime rounded-full shadow-sm shadow-lime/30"
            initial={{ width: `${Math.max(0, ((stepIndex) / totalSteps) * 100)}%` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Step Dots Tracker */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                width: idx === stepIndex ? 24 : 6,
                backgroundColor:
                  idx === stepIndex
                    ? "var(--color-lime)"
                    : idx < stepIndex
                    ? "var(--color-primary)"
                    : "rgba(255, 255, 255, 0.12)",
              }}
              transition={{ duration: 0.25 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>

        {/* Title & Subtitle */}
        <div className="mb-6 sm:mb-8 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              {title}
            </h1>
          </div>
          {isMulti && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-3 py-0.5 rounded-full bg-peri/15 text-peri border border-peri/30 font-mono font-bold">
                <Sparkles className="w-3 h-3 text-lime" />
                Pick up to {maxSelect} ({selectedIds.length}/{maxSelect} selected)
              </span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Symmetrical Options Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid ${gridClass} gap-1.5 sm:gap-3.5 mb-6 sm:mb-8`}
        >
          {options.map((opt) => {
            const isSelected = selectedIds.includes(opt.id);
            return (
              <motion.button
                key={opt.id}
                variants={cardVariants}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onSelect(opt.id)}
                aria-pressed={isSelected}
                className={`group relative text-left p-2 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none h-full min-h-[85px] sm:min-h-[110px] ${
                  isSelected
                    ? "bg-gradient-to-br from-primary/20 via-primary/10 to-peri/15 border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/40 text-text"
                    : "bg-surface2/70 hover:bg-surface2 hover:border-peri/40 border-white/8 text-text shadow-sm backdrop-blur-xs"
                }`}
              >
                <div>
                  {/* Top: Icon + Label + Checkbox */}
                  <div className="flex items-start justify-between gap-1 sm:gap-2.5 mb-1 sm:mb-2">
                    <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
                      {opt.icon && (
                        <div
                          className={`w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-lg shrink-0 border transition-transform duration-200 group-hover:scale-105 ${
                            isSelected
                              ? "bg-primary/30 border-primary text-white shadow-xs"
                              : "bg-surface border-white/10 text-text"
                          }`}
                        >
                          {opt.icon}
                        </div>
                      )}
                      <span
                        className={`font-display font-bold text-xs sm:text-sm leading-tight sm:leading-snug line-clamp-1 transition-colors ${
                          isSelected ? "text-peri" : "text-text"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </div>

                    {/* Circular Check Indicator */}
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border transition-all shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-primary border-primary text-white shadow-sm shadow-primary/40 scale-105"
                          : "border-white/20 bg-surface/80 group-hover:border-peri/50"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/20" />
                      )}
                    </div>
                  </div>

                  {/* Bottom: Description */}
                  {opt.description && (
                    <p className="text-[10px] sm:text-xs text-muted leading-tight sm:leading-relaxed line-clamp-2 mt-0.5 sm:mt-1">
                      {opt.description}
                    </p>
                  )}
                </div>

                {/* Subtle Bottom Glow Accent when selected */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedGlow"
                    className="absolute -bottom-px left-2 right-2 sm:left-4 sm:right-4 h-0.5 bg-gradient-to-r from-peri via-lime to-primary rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/8">
        {!isFirstStep ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-muted hover:text-text hover:bg-surface2 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold font-display transition-all duration-200 cursor-pointer shadow-lg ${
            canProceed
              ? "bg-primary hover:bg-primary-hover text-white shadow-primary/25 active:scale-95"
              : "bg-surface2 text-muted/40 cursor-not-allowed border border-white/5 opacity-40"
          }`}
        >
          <span>{stepIndex === totalSteps - 1 ? "Complete Calibration" : "Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
