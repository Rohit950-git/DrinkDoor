"use client";

import React from "react";
import { NavItem, NavItemProps } from "./NavItem";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavGroupProps {
  title?: string;
  items: NavItemProps[];
  collapsed?: boolean;
  activeHref?: string;
  onItemClick?: () => void;
}

export function NavGroup({
  title,
  items,
  collapsed = false,
  activeHref,
  onItemClick,
}: NavGroupProps) {
  const hasActiveItem = items.some((item) => item.href === activeHref);

  return (
    <div className="w-full flex flex-col space-y-1">
      {/* Title */}
      <AnimatePresence mode="wait">
        {title && (
          <div className="h-5 px-3.5 flex items-center justify-between overflow-hidden">
            {!collapsed ? (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none font-sans"
              >
                {title}
              </motion.span>
            ) : (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                className="w-full border-t border-zinc-200/40 dark:border-zinc-800/40 my-2"
              />
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Items list */}
      <div className="flex flex-col space-y-0.5">
        {items.map((item, index) => (
          <NavItem
            key={index}
            label={item.label}
            href={item.href}
            icon={item.icon}
            badge={item.badge}
            badgeVariant={item.badgeVariant}
            active={activeHref === item.href}
            collapsed={collapsed}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}
