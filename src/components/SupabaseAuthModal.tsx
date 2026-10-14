"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShieldCheck, ExternalLink, ShieldAlert, LogIn, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function SupabaseAuthModal() {
  const { showConfigModal, setShowConfigModal, isConfigured, signInWithGoogle, simulateGoogleLogin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showDevDetails, setShowDevDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key closing
  useEffect(() => {
    if (!showConfigModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowConfigModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfigModal, setShowConfigModal]);

  if (!showConfigModal || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowConfigModal(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/12 dark:border-white/12 border-slate-200 bg-surface/95 backdrop-blur-xl p-6 sm:p-7 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-peri/20 to-lime/20 border border-white/10 text-lime shadow-xs">
                <Sparkles className="h-5 w-5 text-lime" />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-text">Welcome to Signal</h3>
                <p className="text-xs text-muted">Hackathon radar & algorithmic rankings</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="rounded-xl border border-white/10 bg-surface2 p-2 text-muted hover:text-text transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Value Highlights */}
          <div className="mt-5 space-y-2 rounded-2xl bg-surface2/60 border border-white/6 p-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-lime shrink-0" />
              <span>Personalized hackathon multi-pillar rankings</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-peri shrink-0" />
              <span>Campus squad attendance sync & friend alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Persistent bookmarks & comparison matrix</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {/* Instant Demo Login Button */}
            <button
              type="button"
              onClick={simulateGoogleLogin}
              className="w-full inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:brightness-110 active:scale-98 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-lime" />
              <span>Instant Demo Access (1-Click)</span>
            </button>

            {/* Google OAuth Login */}
            <button
              type="button"
              onClick={() => {
                if (isConfigured) {
                  setShowConfigModal(false);
                  signInWithGoogle();
                } else {
                  setShowDevDetails(true);
                }
              }}
              className="w-full inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl border border-white/12 dark:border-white/12 border-slate-300 bg-surface hover:bg-surface2 px-4 text-xs font-bold text-text transition cursor-pointer shadow-xs active:scale-98"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Account</span>
            </button>
          </div>

          {/* Optional Supabase Dev Config Helper */}
          {!isConfigured && (
            <div className="mt-4 pt-4 border-t border-white/8 text-center">
              <button
                type="button"
                onClick={() => setShowDevDetails(!showDevDetails)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-muted hover:text-peri transition"
              >
                <span>Production Supabase OAuth setup</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showDevDetails ? "rotate-180" : ""}`} />
              </button>

              {showDevDetails && (
                <div className="mt-2.5 text-left rounded-xl bg-black/40 border border-white/8 p-3 text-[10px] font-mono text-slate-300 space-y-1">
                  <p className="text-amber-300 font-bold">Add to .env.local for production OAuth:</p>
                  <p className="text-slate-400">NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co</p>
                  <p className="text-slate-400">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...</p>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-peri hover:underline mt-1 font-sans text-xs"
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
