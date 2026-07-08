"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 py-1 outline-none group focus-visible:ring-2 focus-visible:ring-indigo-500/50 rounded-lg"
    >
      <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300">
        <Shield className="h-5 w-5 text-white" />
        <span className="absolute -inset-px rounded-xl border border-white/20 pointer-events-none" />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: -10 }}
            animate={{ opacity: 1, width: "auto", x: 0 }}
            exit={{ opacity: 0, width: 0, x: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              Drink<span className="text-indigo-500 font-extrabold">Door</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
