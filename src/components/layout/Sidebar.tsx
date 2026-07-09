"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Truck,
  PlusCircle,
  FileText
} from "lucide-react";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { UserRole } from "@/src/modules/auth/types";
import { Logo } from "./Logo";
import { NavGroup } from "../navigation/NavGroup";
import { Button } from "../common/Button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onItemClick?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ collapsed, setCollapsed, onItemClick, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Determine active href by combining pathname + active query parameter (e.g. ?tab=products)
  const activeHref = useMemo(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      return `${pathname}?tab=${tab}`;
    }
    return pathname;
  }, [pathname, searchParams]);

  // Construct links based on user role
  const navigationGroups = useMemo(() => {
    const role = user?.role || UserRole.ADMIN;
    
    if (role === UserRole.ADMIN) {
      return [
        {
          title: "Core",
          items: [
            { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
            { label: "Products", href: "/admin/dashboard?tab=products", icon: ShoppingBag, badge: 12 },
          ],
        },
        {
          title: "Relations",
          items: [
            { label: "Distributors", href: "/admin/dashboard?tab=distributors", icon: Truck },
            { label: "Shopkeepers", href: "/admin/dashboard?tab=shopkeepers", icon: Users },
          ],
        },
        {
          title: "System",
          items: [
            { label: "User Directory", href: "/admin/dashboard?tab=users", icon: Users },
            { label: "Settings", href: "/admin/dashboard?tab=settings", icon: Settings },
          ],
        },
      ];
    }

    if (role === UserRole.DISTRIBUTOR) {
      return [
        {
          title: "Main",
          items: [
            { label: "Dashboard", href: "/distributor/dashboard", icon: LayoutDashboard },
            { label: "Inventory", href: "/distributor/dashboard?tab=inventory", icon: ShoppingBag, badge: 8 },
          ],
        },
        {
          title: "Operations",
          items: [
            { label: "Pending Orders", href: "/distributor/dashboard?tab=orders", icon: FileText, badge: "New" },
            { label: "Logistics", href: "/distributor/dashboard?tab=delivery", icon: Truck },
          ],
        },
        {
          title: "System",
          items: [
            { label: "Settings", href: "/distributor/dashboard?tab=settings", icon: Settings },
          ],
        },
      ];
    }

    // Default: Shopkeeper links
    return [
      {
        title: "Main",
        items: [
          { label: "Overview", href: "/shopkeeper/dashboard", icon: LayoutDashboard },
          { label: "Order Catalog", href: "/shopkeeper/dashboard?tab=order", icon: PlusCircle },
        ],
      },
      {
        title: "History",
        items: [
          { label: "Order History", href: "/shopkeeper/dashboard?tab=history", icon: FileText },
          { label: "Invoices", href: "/shopkeeper/dashboard?tab=invoices", icon: CreditCard, badge: 3, badgeVariant: "accent" as const },
        ],
      },
      {
        title: "System",
        items: [
          { label: "Settings", href: "/shopkeeper/dashboard?tab=settings", icon: Settings },
        ],
      },
    ];
  }, [user]);

  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full bg-transparent">
        <div className="flex-1 space-y-6">
          {navigationGroups.map((group, index) => (
            <NavGroup
              key={index}
              title={group.title}
              items={group.items}
              collapsed={false}
              activeHref={activeHref}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </div>
    );
  }

  return (

    <aside
      className={cn(
        "hidden lg:flex flex-col h-full border-r border-zinc-200/50 dark:border-zinc-850/80 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-md transition-all duration-200 shrink-0 select-none relative z-20",
        collapsed ? "w-[88px]" : "w-[280px]"
      )}
    >
      {/* Header / Logo */}
      <div
        className={cn(
          "flex items-center px-6 h-18 border-b border-zinc-100 dark:border-zinc-900/60 shrink-0",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none space-y-6">
        {navigationGroups.map((group, index) => (
          <NavGroup
            key={index}
            title={group.title}
            items={group.items}
            collapsed={collapsed}
            activeHref={activeHref}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {/* Collapse Toggle Button (Floats at bottom edge) */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900/60 shrink-0 flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800 rounded-lg absolute -right-4 bottom-8 shadow-md z-30"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {!collapsed && (
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-sans truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>DrinkDoor App v1.0.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}
