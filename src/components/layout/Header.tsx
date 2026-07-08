"use client";

import React from "react";
import { Breadcrumb } from "./Breadcrumb";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showBreadcrumb?: boolean;
  className?: string;
}

export function Header({
  title,
  description,
  actions,
  showBreadcrumb = true,
  className,
}: HeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 mb-8 select-none border-b border-zinc-150/20 dark:border-zinc-850/20 pb-6", className)}>
      {/* Optional Breadcrumb */}
      {showBreadcrumb && (
        <div className="flex lg:hidden">
          <Breadcrumb />
        </div>
      )}

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-450 font-sans max-w-2xl leading-normal">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {actions && (
          <div className="flex items-center gap-3 shrink-0 sm:self-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
