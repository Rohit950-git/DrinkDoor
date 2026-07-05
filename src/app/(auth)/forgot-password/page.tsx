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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Enter your email to get a reset link
            </p>
          </div>

          {successInfo ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-400">
                <p className="font-semibold">{successInfo.message}</p>
                {successInfo.token && (
                  <div className="mt-4 border-t border-green-200 pt-3 dark:border-green-800">
                    <p className="text-xs text-zinc-500 mb-2">Simulated link for local development:</p>
                    <Link
                      href={`/reset-password?token=${successInfo.token}`}
                      className="font-mono break-all text-xs underline text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                      Click here to reset your password
                    </Link>
                  </div>
                )}
              </div>
              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
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
                    className="font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
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
