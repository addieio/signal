"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, KeyRound, ExternalLink, ShieldAlert, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function SupabaseAuthModal() {
  const { showConfigModal, setShowConfigModal, isConfigured, signInWithGoogle, simulateGoogleLogin } = useAuthStore();

  if (!showConfigModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowConfigModal(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/12 bg-surface p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-bg shadow-md">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-text">Login with Google</h3>
                <p className="text-xs text-muted">Powered by Supabase Auth</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="rounded-xl border border-white/10 bg-surface2 p-2 text-muted hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Config State Explanation */}
          {!isConfigured ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                  <ShieldAlert className="h-4 w-4" />
                  <span>SUPABASE CREDENTIALS NEEDED</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  To authenticate via real Google accounts, add your Supabase project keys to <code className="text-amber-200">.env.local</code>:
                </p>
                <div className="mt-2.5 rounded-xl bg-black/50 p-2.5 font-mono text-[11px] text-slate-200 overflow-x-auto space-y-1">
                  <p>NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co</p>
                  <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={simulateGoogleLogin}
                  className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-hover transition cursor-pointer shadow-md shadow-primary/20"
                >
                  <Sparkles className="h-4 w-4 text-lime" />
                  <span>Simulate Google Login (Instant Demo)</span>
                </button>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-surface2 px-4 text-xs font-bold text-slate-300 hover:text-white hover:bg-surface3 transition"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your Google account to sync your calibrated hackathon preferences, save shortlisted events, and track team RSVP status.
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  signInWithGoogle();
                }}
                className="w-full inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-5 text-sm font-bold text-gray-900 hover:bg-gray-100 transition shadow-lg cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
