"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader } from "./Loader";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({
  className,
  children,
  isLoading,
  disabled,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-xl font-sans";

  const sizes = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-13 px-7 text-base gap-2.5",
    icon: "h-11 w-11 p-0 justify-center",
  };

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_4px_12px_0_rgba(99,102,241,0.15)] hover:bg-indigo-500 hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_8px_20px_0_rgba(99,102,241,0.25)] border border-indigo-500/20 active:bg-indigo-700",
    secondary:
      "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 border border-zinc-200/60 dark:border-zinc-800/80 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700/80 active:bg-zinc-300/30 dark:active:bg-zinc-900",
    outline:
      "border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 hover:border-zinc-300 dark:hover:border-zinc-750 active:bg-zinc-100 dark:active:bg-zinc-900/50",
    ghost:
      "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 active:bg-zinc-200/40 dark:active:bg-zinc-900",
    accent:
      "bg-emerald-600 text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_4px_12px_0_rgba(16,185,129,0.15)] hover:bg-emerald-500 hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_8px_20px_0_rgba(16,185,129,0.25)] border border-emerald-500/20 active:bg-emerald-700",
    glass:
      "backdrop-blur-md bg-white/5 dark:bg-black/20 text-zinc-900 dark:text-zinc-100 border border-white/10 dark:border-white/5 hover:bg-white/15 dark:hover:bg-white/10 active:bg-white/10 dark:active:bg-black/30 shadow-sm",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, sizes[size], variants[variant], className)}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader size="sm" className="text-current" />
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
