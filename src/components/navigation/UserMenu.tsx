"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ShieldAlert, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { Avatar } from "../common/Avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const handleItemClick = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  if (!user) return null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1 px-2.5 rounded-xl border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/80 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/40 transition-all duration-200 outline-none select-none cursor-pointer group"
      >
        <Avatar name={user.name || "User"} showStatus={true} size="sm" />
        <div className="hidden md:flex flex-col items-start text-left">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-550 leading-tight">
            {user.name}
          </span>
          <span className="text-[10px] text-zinc-400 capitalize leading-none">
            {user.role}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-450 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
      </button>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-zinc-200/60 dark:border-zinc-850 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-xl z-50 overflow-hidden"
          >
            {/* Header / User Card */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/40 dark:bg-zinc-950/40 flex items-center gap-3">
              <Avatar name={user.name || "User"} size="md" />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-150 truncate leading-snug">
                  {user.name}
                </h4>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate font-sans">
                  {user.email}
                </p>
                <div className="mt-1 flex items-center">
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 uppercase tracking-wider">
                    <ShieldAlert className="h-2.5 w-2.5" />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => handleItemClick("/admin/dashboard?tab=profile")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-350 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-all text-xs font-medium outline-none text-left"
              >
                <User className="h-4 w-4 text-zinc-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => handleItemClick("/admin/dashboard?tab=settings")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-350 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-all text-xs font-medium outline-none text-left"
              >
                <Settings className="h-4 w-4 text-zinc-400" />
                <span>Account Settings</span>
              </button>

              <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-zinc-400 dark:text-zinc-550 border-t border-zinc-100 dark:border-zinc-900/50 mt-1 select-none font-sans">
                <Sparkles className="h-3 w-3" />
                <span>DrinkDoor Premium</span>
              </div>
            </div>

            {/* Logout Footer */}
            <div className="p-1.5 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/40 dark:bg-zinc-950/40">
              <button
                onClick={handleLogout}
                disabled={loading}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-650 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-350 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-all text-xs font-semibold outline-none text-left cursor-pointer",
                  loading && "pointer-events-none opacity-50"
                )}
              >
                <LogOut className="h-4 w-4" />
                <span>{loading ? "Logging out..." : "Log Out"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
