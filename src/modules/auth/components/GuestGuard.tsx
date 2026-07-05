"use client";

import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader } from "@/src/components/common/Loader";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, getDashboardRedirect } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      router.push(getDashboardRedirect(user.role));
    }
  }, [isAuthenticated, user, loading, router, getDashboardRedirect]);

  if (loading || isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader size="lg" className="text-zinc-900 dark:text-zinc-50" />
      </div>
    );
  }

  return <>{children}</>;
}
