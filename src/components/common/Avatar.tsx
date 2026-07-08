"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  statusColor?: string;
}

export function Avatar({
  src,
  name,
  className,
  size = "md",
  showStatus = false,
  statusColor = "bg-emerald-500",
}: AvatarProps) {
  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-14 w-14 text-lg",
  };

  const statusSizes = {
    sm: "h-2 w-2 bottom-0 right-0",
    md: "h-2.5 w-2.5 bottom-0 right-0 border-2",
    lg: "h-3.5 w-3.5 bottom-0.5 right-0.5 border-2",
    xl: "h-4 w-4 bottom-0.5 right-0.5 border-2.5",
  };

  return (
    <div className={cn("relative inline-flex shrink-0 select-none", className)}>
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full font-semibold overflow-hidden select-none border border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350 shadow-inner",
          sizes[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover select-none"
            onError={(e) => {
              // Hide image and show fallback
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {showStatus && (
        <span
          className={cn(
            "absolute rounded-full border-white dark:border-zinc-950",
            statusColor,
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
