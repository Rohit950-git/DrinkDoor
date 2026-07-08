"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-zinc-150/45 dark:border-zinc-900/60 bg-white/30 dark:bg-zinc-950/20 backdrop-blur-sm select-none py-6 mt-auto shrink-0 font-sans text-xs",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-zinc-400 dark:text-zinc-550 font-medium">
        <div className="flex flex-wrap items-center gap-2">
          <span>&copy; {currentYear}</span>
          <Link
            href="/"
            className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-semibold"
          >
            DrinkDoor
          </Link>
          <span className="text-zinc-200 dark:text-zinc-800 font-light">|</span>
          <span>All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="capitalize text-[10px]">Production Mode</span>
          </div>
          <span>v1.0.0</span>
          <Link
            href="/terms"
            className="hover:text-zinc-800 dark:hover:text-zinc-250 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="hover:text-zinc-800 dark:hover:text-zinc-250 transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
