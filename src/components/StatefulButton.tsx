"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Loader2, Check, AlertCircle } from "lucide-react";

type ButtonState = "idle" | "loading" | "success" | "error";

interface StatefulButtonProps {
  onClick: () => Promise<void>;
  idleText?: string;
}

export default function StatefulButton({ onClick, idleText = "+ Add to playlist" }: StatefulButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (state === "success" || state === "error") {
      const timer = setTimeout(() => setState("idle"), 2500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleClick = async () => {
    if (state !== "idle" && state !== "error") return; 
    
    setState("loading");
    try {
      await onClick();
      setState("success");
    } catch (err) {
      setState("error");
    }
  };

  const shakeAnimation = {
    x: shouldReduceMotion ? 0 : [0, -8, 8, -6, 6, 0],
    transition: { duration: 0.4 },
  };

  const stateStyles = {
    idle: "bg-white text-black hover:bg-neutral-200",
    loading: "bg-neutral-800 text-neutral-400 cursor-not-allowed",
    success: "bg-green-500 text-white",
    error: "bg-red-500/20 text-red-500 border border-red-500/50",
  };

  return (
    <motion.button
      layout 
      onClick={handleClick}
      disabled={state === "loading"}
      animate={state === "error" ? shakeAnimation : {}}
      whileHover={state === "idle" ? { scale: 1.02 } : {}}
      whileTap={state === "idle" ? { scale: 0.98 } : {}}
      className={`relative overflow-hidden flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 min-w-[140px] ${stateStyles[state]}`}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            <span>{idleText}</span>
          </motion.div>
        )}

        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Loader2 size={16} className="animate-spin" />
            <span>Processing...</span>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <Check size={16} strokeWidth={3} />
            <span>Success!</span>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <AlertCircle size={16} strokeWidth={2} />
            <span>Failed</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}