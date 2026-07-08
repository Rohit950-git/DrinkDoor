"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFields } from "@/src/modules/auth/validation";
import { useForgotPasswordMutation } from "@/src/services/authApi";
import { Input } from "@/src/components/common/Input";
import { Button } from "@/src/components/common/Button";
import { ErrorMessage } from "@/src/components/common/ErrorMessage";
import { GuestGuard } from "@/src/modules/auth/components/GuestGuard";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; token: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    setSubmitError(null);
    setSuccessInfo(null);
    try {
      const result = await forgotPassword(data).unwrap();
      if (result.success) {
        setSuccessInfo({
          message: result.message || "Reset link generated successfully",
          token: (result as any).token || "",
        });
      } else {
        setSubmitError(result.message || "Something went wrong.");
      }
    } catch (err: any) {
      setSubmitError(err?.data?.message || err?.message || "An error occurred.");
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
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your email to get a reset link
            </p>
          </div>

          {successInfo ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-green-950/20 border border-green-800/30 p-4 text-sm text-green-400">
                <p className="font-semibold">{successInfo.message}</p>
                {successInfo.token && (
                  <div className="mt-4 border-t border-zinc-800 pt-3">
                    <p className="text-xs text-zinc-500 mb-2">Simulated link for local development:</p>
                    <Link
                      href={`/reset-password?token=${successInfo.token}`}
                      className="font-mono break-all text-xs underline text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Click here to reset your password
                    </Link>
                  </div>
                )}
              </div>
              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <ErrorMessage message={submitError || undefined} />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send Reset Link
                </Button>
                <div className="text-center text-sm">
                  <Link
                    href="/login"
                    className="font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </GuestGuard>
  );
}
