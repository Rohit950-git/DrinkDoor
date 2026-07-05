"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { Loader } from "@/src/components/common/Loader";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, loading, getDashboardRedirect } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        router.push(getDashboardRedirect(user.role));
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, user, loading, router, getDashboardRedirect]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <Loader size="lg" className="text-zinc-900 dark:text-zinc-50" />
    </div>
  );
}

