"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileSidebar } from "../navigation/MobileSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
    setMounted(true);
  }, []);

  const handleSetCollapsed = (val: boolean) => {
    setCollapsed(val);
    localStorage.setItem("sidebar-collapsed", String(val));
  };

  // Prevent layout jump on hydration
  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Desktop Sidebar (Fixed Left) */}
      <Sidebar collapsed={collapsed} setCollapsed={handleSetCollapsed} />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Sidebar
          collapsed={false}
          setCollapsed={() => {}}
          isMobile={true}
          onItemClick={() => setMobileOpen(false)}
        />
      </MobileSidebar>

      {/* Right Area: Navbar + Scrollable Content + Footer */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden relative">
        {/* Sticky Top Navbar */}
        <Navbar onMobileMenuOpen={() => setMobileOpen(true)} />

        {/* Scrollable Page Container Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
