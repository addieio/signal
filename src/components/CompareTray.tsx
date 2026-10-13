"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Scale, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCompareStore } from "@/store/compareStore";

export function CompareTray() {
  const { selected, removeEvent, clearCompare } = useCompareStore();
  const router = useRouter();

  if (selected.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Comparison selection"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="fixed bottom-20 left-1/2 z-[60] w-full max-w-3xl -translate-x-1/2 px-4 md:bottom-6"
      >
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-peri/40 bg-surface/95 p-3.5 shadow-2xl shadow-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-peri/20 text-peri">
              <Scale className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <span className="hidden sm:inline font-mono text-[11px] font-bold text-peri uppercase tracking-wider">
              Matrix ({selected.length}/3)
            </span>
          </div>

          {/* Selected Event Badges */}
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {selected.map((event) => (
              <span
                key={event.id}
                className="inline-flex min-h-8 max-w-44 items-center gap-1.5 rounded-lg border border-white/10 bg-surface2 pl-2.5 pr-1 text-xs font-bold text-text shadow-sm"
              >
                <span className="truncate">{event.title}</span>
                <button
                  type="button"
                  onClick={() => removeEvent(event.id)}
                  aria-label={`Remove ${event.title}`}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-neg/15 hover:text-neg transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="min-h-10 rounded-xl px-2.5 text-xs font-bold text-muted hover:text-text hover:bg-surface2 transition cursor-pointer"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => router.push("/compare")}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-md shadow-primary/30 hover:bg-primary-hover active:scale-95 transition cursor-pointer"
            >
              <span>{selected.length === 1 ? "Open Matrix (1)" : `Compare (${selected.length})`}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
