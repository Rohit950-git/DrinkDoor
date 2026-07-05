import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15",
            error && "border-destructive focus:border-destructive focus:ring-destructive/10 dark:border-destructive/50 dark:focus:border-destructive/50 dark:focus:ring-destructive/15",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-destructive">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
