"use client";

import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { UserRole } from "../types";
import { Loader } from "@/src/components/common/Loader";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, loading, getDashboardRedirect } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their default role page
        router.push(getDashboardRedirect(user.role));
      }
    }
  }, [isAuthenticated, user, loading, allowedRoles, router, getDashboardRedirect]);

  if (loading || !isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader size="lg" className="text-zinc-900 dark:text-zinc-50" />
      </div>
    );
  }

  return <>{children}</>;
}
