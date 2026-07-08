"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function PageContainer({
  children,
  className,
  animate = true,
}: PageContainerProps) {
  if (!animate) {
    return (
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1", className)}
    >
      {children}
    </motion.div>
  );
}
