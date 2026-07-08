"use client";

import React, { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverGlow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, hoverGlow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[20px] border border-zinc-200/50 dark:border-zinc-800/80 transition-all duration-300",
          glass
            ? "bg-white/70 dark:bg-zinc-950/60 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02),0_12px_40px_-8px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_-6px_rgba(0,0,0,0.2),0_16px_48px_-12px_rgba(0,0,0,0.4)]"
            : "bg-white dark:bg-zinc-900 shadow-sm",
          hoverGlow &&
            "hover:border-indigo-500/20 dark:hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(99,102,241,0.04)] dark:hover:shadow-[0_8px_40px_rgb(99,102,241,0.08)]",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 md:p-8 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold text-lg md:text-xl leading-none tracking-tight text-zinc-900 dark:text-zinc-50",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-sans", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 md:p-8 pt-0", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 md:p-8 pt-0 border-t border-zinc-100 dark:border-zinc-800/40 mt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
