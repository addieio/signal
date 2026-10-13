"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Sparkles, Zap } from "lucide-react";

export function SignalIntroLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("INITIALIZING SIGNAL RADAR...");

  useEffect(() => {
    const t0 = setTimeout(() => {
      const hasSeen = sessionStorage.getItem("signal.loader.seen");
      if (!hasSeen) {
        setVisible(true);
        sessionStorage.setItem("signal.loader.seen", "true");
      }
    }, 0);

    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText("INGESTING DEVFOLIO, UNSTOP, MLH & LUMA FEEDS...");
    }, 350);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText("CALIBRATING PERSONALIZED SIGNAL RANKINGS...");
    }, 750);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("GLOBAL SIGNAL ACQUIRED · WELCOME BUILDER");
    }, 1150);

    const t4 = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07090E] text-white p-6 select-none overflow-hidden"
        >
          {/* Background Grid & Radar Sweep */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* Glowing Animated Radar Rings */}
          <div className="relative flex items-center justify-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.8, 2.6], opacity: [0.6, 0.25, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
              className="absolute h-36 w-36 rounded-full border border-peri/40"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 2.0], opacity: [0.7, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.5, ease: "easeOut" }}
              className="absolute h-36 w-36 rounded-full border border-lime/30"
            />

            {/* Radar Center Glowing Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-surface2 via-[#151B28] to-[#1F293D] shadow-2xl shadow-peri/30"
            >
              <Radio className="h-10 w-10 text-lime animate-pulse" />
              <Zap className="absolute top-2 right-2 h-3.5 w-3.5 text-peri" />
            </motion.div>
          </div>

          {/* Brand & Mission */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-center max-w-md relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-peri/30 bg-peri/10 px-3 py-0.5 text-[11px] font-mono font-bold tracking-widest text-peri uppercase mb-2">
              <Sparkles className="h-3.5 w-3.5 text-lime" />
              <span>SIGNAL GLOBAL ENGINE</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              Calibrating Signal<span className="text-lime">.</span>
            </h2>

            <p className="mt-2 text-xs font-mono text-slate-400 tracking-wide uppercase">
              {statusText}
            </p>

            {/* Animated Progress Bar */}
            <div className="mt-6 w-64 mx-auto h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: "10%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-peri via-lime to-emerald-400 rounded-full"
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 mt-2 block">
              {progress}% SYSTEM LOCK
            </span>
          </motion.div>

          {/* Quick Skip button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute bottom-6 text-xs font-mono font-bold text-slate-400 hover:text-white transition tracking-wider uppercase border border-white/10 px-4 py-1.5 rounded-full bg-surface/50 backdrop-blur"
          >
            Skip Intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
