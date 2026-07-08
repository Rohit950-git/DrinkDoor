"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { resetPasswordSchema, ResetPasswordFields } from "@/src/modules/auth/validation";
import { useResetPasswordMutation } from "@/src/services/authApi";
import { PasswordInput } from "@/src/components/common/PasswordInput";
import { Button } from "@/src/components/common/Button";
import { ErrorMessage } from "@/src/components/common/ErrorMessage";
import { Loader } from "@/src/components/common/Loader";
import { GuestGuard } from "@/src/modules/auth/components/GuestGuard";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFields) => {
    setSubmitError(null);
    if (!token) {
      setSubmitError("Reset token is missing from the URL. Please request a new password reset link.");
      return;
    }

    try {
      const result = await resetPassword({
        token,
        password: data.password,
      }).unwrap();

      if (result.success) {
        setSuccess(true);
      } else {
        setSubmitError(result.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setSubmitError(err?.data?.message || err?.message || "An error occurred.");
    }
  };

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <ErrorMessage message="Invalid reset link: Token is missing from the URL. Please verify your link or request a new reset email." />
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-semibold text-zinc-950 hover:underline dark:text-zinc-50"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Set New Password
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Enter your new password below
        </p>
      </div>

      {success ? (
        <div className="space-y-6 text-center">
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-400 font-semibold">
            Password reset successful! You can now sign in with your new password.
          </div>
          <Link
            href="/login"
            className="inline-block w-full rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-semibold text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage message={submitError || undefined} />

          <div className="space-y-4">
            <PasswordInput
              label="New Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl relative z-10">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <Loader size="md" className="text-zinc-50" />
                <p className="text-sm text-zinc-400">Loading form...</p>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </GuestGuard>
  );
}
