"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "primary" | "accent" | "neutral";
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export function NavItem({
  label,
  href,
  icon: Icon,
  badge,
  badgeVariant = "primary",
  active = false,
  collapsed = false,
  onClick,
}: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const badgeStyles = {
    primary: "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-900/30",
    accent: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-650 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30",
    neutral: "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-800/60",
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3.5 w-full h-11 px-3.5 rounded-xl text-xs font-semibold select-none cursor-pointer outline-none relative transition-colors duration-200 group border border-transparent",
          active
            ? "text-indigo-650 dark:text-indigo-400 font-bold"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
        )}
      >
        {/* Shared Layout Active Indicator Background */}
        {active && (
          <motion.div
            layoutId="sidebarActiveBackground"
            className="absolute inset-0 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.03] border border-indigo-500/10 dark:border-indigo-500/5 rounded-xl z-0"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        {/* Icon */}
        <div
          className={cn(
            "relative z-10 flex items-center justify-center shrink-0 transition-transform duration-200 group-active:scale-95",
            collapsed ? "mx-auto" : ""
          )}
        >
          <Icon className={cn("h-4.5 w-4.5 transition-colors", active ? "text-indigo-500" : "text-zinc-450 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-350")} />
        </div>

        {/* Label (Hidden on Collapsed) */}
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 font-medium truncate flex-1 leading-none pt-0.5"
          >
            {label}
          </motion.span>
        )}

        {/* Badge (Hidden on Collapsed) */}
        {!collapsed && badge !== undefined && (
          <span
            className={cn(
              "relative z-10 text-[9px] px-1.5 py-0.2 rounded border select-none font-bold uppercase tracking-wider shrink-0 font-sans",
              badgeStyles[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}
      </Link>

      {/* Hover Tooltip (Shown ONLY on Collapsed Sidebar) */}
      <AnimatePresence>
        {collapsed && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 whitespace-nowrap bg-zinc-950/90 dark:bg-zinc-900 border border-zinc-800/80 text-zinc-100 px-3 py-1.5 rounded-lg text-[10px] font-semibold shadow-lg shadow-black/10 select-none pointer-events-none"
          >
            <div className="flex items-center gap-2">
              <span>{label}</span>
              {badge !== undefined && (
                <span className="text-[8px] bg-indigo-500/25 text-indigo-300 px-1 py-0.1 rounded font-extrabold font-sans">
                  {badge}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
