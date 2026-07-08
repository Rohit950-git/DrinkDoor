"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "../layout/Logo";
import { Button } from "../common/Button";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileSidebar({ isOpen, onClose, children }: MobileSidebarProps) {
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay / Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-zinc-950/45 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Box */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-zinc-950 border-r border-zinc-200/60 dark:border-zinc-850/80 shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-18 border-b border-zinc-100 dark:border-zinc-900/60 shrink-0">
              <Logo collapsed={false} />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl"
                aria-label="Close menu"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none space-y-6">
              {children}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/40 dark:bg-zinc-950/40 shrink-0 font-sans">
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>DrinkDoor App v1.0.0</span>
                <span>Production</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
