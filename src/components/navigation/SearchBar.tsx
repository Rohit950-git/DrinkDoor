"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, Command, CornerDownLeft, Sparkles, X, Shield, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  url: string;
  description?: string;
}

const mockResults: SearchResult[] = [
  { id: "overview", title: "Analytics Overview", category: "Dashboards", url: "/admin/dashboard", description: "View recent revenue statistics and trends" },
  { id: "products", title: "Manage Products", category: "Inventory", url: "/admin/dashboard?tab=products", description: "Create, edit, or delete items in the store" },
  { id: "orders", title: "Recent Orders", category: "Sales", url: "/admin/dashboard?tab=orders", description: "Track pending orders and fulfillment status" },
  { id: "users", title: "User Directory", category: "Management", url: "/admin/dashboard?tab=users", description: "View, edit, and adjust roles of users" },
  { id: "settings", title: "System Settings", category: "Configuration", url: "/admin/dashboard?tab=settings", description: "Manage application theme, API keys, and configurations" },
  { id: "profile", title: "My Profile", category: "Account", url: "/admin/dashboard?tab=profile", description: "Update email, credentials, and settings" }
];

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [isOpen]);

  const filteredResults = query.trim() === "" 
    ? mockResults 
    : mockResults.filter((item) => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    router.push(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 w-48 sm:w-64 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-400 dark:text-zinc-500 text-xs transition-all duration-200 outline-none select-none cursor-pointer group"
      >
        <Search className="h-3.5 w-3.5 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
        <span className="flex-1 text-left">Search...</span>
        <div className="flex items-center gap-0.5 border border-zinc-250 dark:border-zinc-850 px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900/80 font-mono text-[9px] font-bold text-zinc-500 select-none">
          <Command className="h-2 w-2" />
          <span>K</span>
        </div>
      </button>

      {/* Backdrop & Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-xl rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden focus:outline-none flex flex-col"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 border-b border-zinc-100 dark:border-zinc-900 h-14">
                <Search className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-650 outline-none w-full border-none focus:ring-0 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-900 rounded-md text-zinc-400 dark:text-zinc-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-900/60 font-mono text-[9px] text-zinc-400 select-none">
                  ESC
                </div>
              </div>

              {/* Search Results List */}
              <div className="max-h-[340px] overflow-y-auto p-2 scrollbar-none space-y-1">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer select-none border",
                          isSelected
                            ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/80 shadow-sm"
                            : "bg-transparent border-transparent"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-lg transition-colors border",
                            isSelected
                              ? "bg-white dark:bg-zinc-950 border-zinc-200/50 dark:border-zinc-800 text-indigo-500 dark:text-indigo-400"
                              : "bg-zinc-100 dark:bg-zinc-900/40 border-transparent text-zinc-500"
                          )}
                        >
                          <Shield className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-850 dark:text-zinc-100">
                              {result.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 text-zinc-400 rounded-md">
                              {result.category}
                            </span>
                          </div>
                          {result.description && (
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate leading-tight font-sans">
                              {result.description}
                            </p>
                          )}
                        </div>

                        {isSelected && (
                          <motion.div
                            layoutId="enter-badge"
                            className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 shrink-0 font-sans"
                          >
                            <span>Go to</span>
                            <CornerDownLeft className="h-3 w-3" />
                          </motion.div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <Sparkles className="h-8 w-8 text-zinc-300 dark:text-zinc-700 animate-pulse mb-3" />
                    <p className="text-xs font-semibold text-zinc-850 dark:text-zinc-200">No results found</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-[280px]">
                      We couldn&apos;t find anything matching &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Bar */}
              <div className="flex items-center justify-between px-4 h-11 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 text-[10px] text-zinc-400 dark:text-zinc-500 font-sans">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="border border-zinc-250 dark:border-zinc-850 px-1 py-0.2 rounded bg-white dark:bg-zinc-900 font-mono">↓↑</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="border border-zinc-250 dark:border-zinc-850 px-1 py-0.2 rounded bg-white dark:bg-zinc-900 font-mono">↵</kbd> Select
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Open shortcut documentation</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
