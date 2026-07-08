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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
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
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full" isLoading={loading}>
                Sign In
              </Button>

              <div className="text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
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
