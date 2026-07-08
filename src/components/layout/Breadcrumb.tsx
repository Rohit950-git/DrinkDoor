"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumbs automatically from pathname if not provided
  const generatedItems = React.useMemo(() => {
    if (items) return items;

    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: "Home",
        href: "/",
        active: paths.length === 0,
      },
    ];

    let currentHref = "";
    paths.forEach((path, index) => {
      currentHref += `/${path}`;
      const isLast = index === paths.length - 1;
      
      // Clean labels e.g. "distributor-dashboard" -> "Distributor Dashboard"
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentHref,
        active: isLast,
      });
    });

    return breadcrumbs;
  }, [items, pathname]);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none", className)}
    >
      {generatedItems.map((item, index) => {
        const isLast = index === generatedItems.length - 1;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 shrink-0" />
            )}
            
            <div className="flex items-center">
              {item.active || !item.href ? (
                <span
                  className={cn(
                    "font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px] sm:max-w-[200px]"
                  )}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label === "Home" ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Home</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 flex items-center gap-1 font-normal outline-none focus-visible:text-indigo-500"
                >
                  {item.label === "Home" ? (
                    <Home className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
