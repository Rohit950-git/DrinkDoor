"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  isPositive?: boolean;
  description?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  isPositive = true,
  description,
  iconColor = "text-indigo-500 bg-indigo-500/10",
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl",
        "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity duration-300",
        className
      )}
    >
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-450 tracking-wide font-sans select-none">
          {title}
        </span>
        <div className={cn("p-2.5 rounded-xl transition-all duration-300 shadow-inner", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
          {value}
        </span>
        {change !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border",
              isPositive
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-rose-400 bg-rose-500/10 border-rose-500/20"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            ) : (
              <ArrowDownRight className="h-3 w-3 shrink-0" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs text-zinc-500 font-sans tracking-wide leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
