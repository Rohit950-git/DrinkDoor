import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "./Loader";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function Button({
  className,
  children,
  isLoading,
  disabled,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50 select-none py-2 px-4 cursor-pointer";

  const variants = {
    primary:
      "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:ring-zinc-900/20 dark:bg-zinc-550 dark:text-zinc-950 dark:hover:bg-zinc-450 dark:focus:ring-zinc-500/20",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-150/20 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800/20",
    outline:
      "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900",
    ghost:
      "text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-900",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], className)}
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
    </button>
  );
}
