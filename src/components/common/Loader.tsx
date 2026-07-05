import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "size-4 border-2 border-t-transparent",
    md: "size-8 border-3 border-t-transparent",
    lg: "size-12 border-4 border-t-transparent",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-current",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
