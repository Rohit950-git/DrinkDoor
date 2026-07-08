"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { SearchBar } from "../navigation/SearchBar";
import { NotificationDropdown } from "../navigation/NotificationDropdown";
import { ThemeToggle } from "../navigation/ThemeToggle";
import { UserMenu } from "../navigation/UserMenu";
import { Button } from "../common/Button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMobileMenuOpen: () => void;
}

export function Navbar({ onMobileMenuOpen }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 right-0 left-0 h-18 z-30 transition-all duration-200 border-b select-none shrink-0",
        isScrolled
          ? "bg-white/80 dark:bg-zinc-950/70 backdrop-blur-lg border-zinc-200/60 dark:border-zinc-850/60 shadow-[0_4px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.15)]"
          : "bg-white/50 dark:bg-zinc-950/40 backdrop-blur-md border-zinc-150/40 dark:border-zinc-900/40"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Hamburger (Mobile) & Breadcrumb / Search (Desktop) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuOpen}
            className="lg:hidden h-10 w-10 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:flex items-center gap-6">
            <Breadcrumb />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <SearchBar />
          </div>
        </div>

        {/* Center: Search (Mobile Only) */}
        <div className="flex lg:hidden flex-1 max-w-[200px] sm:max-w-xs mx-4">
          <SearchBar />
        </div>

        {/* Right Side: Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <NotificationDropdown />
          <ThemeToggle />
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
