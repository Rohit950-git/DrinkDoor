"use client";

import React from "react";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { UserRole } from "@/src/modules/auth/types";
import { AuthGuard } from "@/src/modules/auth/components/AuthGuard";
import { Button } from "@/src/components/common/Button";
import { LogOut, Truck, Mail, Key, User as UserIcon } from "lucide-react";

export default function DistributorDashboardPage() {
  const { user, logout, loading } = useAuth();

  return (
    <AuthGuard allowedRoles={[UserRole.DISTRIBUTOR]}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Navigation bar */}
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Truck className="size-6 text-zinc-900 dark:text-zinc-50" />
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                DrinkDoor Distributor
              </span>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              isLoading={loading}
              className="flex items-center gap-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-850"
            >
              <LogOut className="size-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Welcome back, {user?.name || "Distributor"}!
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Here is your account overview and credentials.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <UserIcon className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Name
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {user?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <Mail className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <Key className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Role
                    </p>
                    <span className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <Truck className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      User ID
                    </p>
                    <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
                      {user?.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
