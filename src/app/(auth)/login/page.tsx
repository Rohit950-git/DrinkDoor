"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFields } from "@/src/modules/auth/validation";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { Input } from "@/src/components/common/Input";
import { PasswordInput } from "@/src/components/common/PasswordInput";
import { Button } from "@/src/components/common/Button";
import { ErrorMessage } from "@/src/components/common/ErrorMessage";
import { GuestGuard } from "@/src/modules/auth/components/GuestGuard";
import Link from "next/link";

export default function LoginPage() {
  const { login, loading, error: authError } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFields) => {
    setSubmitError(null);
    const result = await login(data);
    if (!result.success) {
      setSubmitError(result.error || "Failed to sign in. Please try again.");
    }
  };

  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <ErrorMessage message={submitError || authError || undefined} />

            <div className="space-y-4 rounded-md">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full" isLoading={loading}>
                Sign In
              </Button>

              <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                >
                  Create one
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </GuestGuard>
  );
}
