"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "@/src/components/common/Loader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshProfile } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshProfile();
      setIsInitializing(false);
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader size="lg" className="text-zinc-900 dark:text-zinc-50" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 animate-pulse">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
