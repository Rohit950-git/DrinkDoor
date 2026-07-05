"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFields } from "@/src/modules/auth/validation";
import { useRegisterMutation } from "@/src/services/authApi";
import { Input } from "@/src/components/common/Input";
import { PasswordInput } from "@/src/components/common/PasswordInput";
import { Button } from "@/src/components/common/Button";
import { ErrorMessage } from "@/src/components/common/ErrorMessage";
import { GuestGuard } from "@/src/modules/auth/components/GuestGuard";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "SHOPKEEPER",
    },
  });

  const onSubmit = async (data: RegisterFields) => {
    setSubmitError(null);
    try {
      const result = await registerUser(data).unwrap();
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setSubmitError(result.message || "Registration failed.");
      }
    } catch (err: any) {
      setSubmitError(err?.data?.message || err?.message || "An error occurred.");
    }
  };

  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Join DrinkDoor and manage your sales
            </p>
          </div>

          {success ? (
            <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-semibold text-green-800 dark:bg-green-950/30 dark:text-green-400">
              Account created successfully! Redirecting to sign in page...
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <ErrorMessage message={submitError || undefined} />

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  label="Phone Number (Optional)"
                  placeholder="+1 (555) 000-0000"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <PasswordInput
                  label="Password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Account Role
                  </label>
                  <select
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition-all focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15"
                    {...register("role")}
                  >
                    <option value="SHOPKEEPER">Shopkeeper</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Create Account
                </Button>
                <div className="text-center text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Already have an account? </span>
                  <Link
                    href="/login"
                    className="font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                  >
                    Sign In
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
