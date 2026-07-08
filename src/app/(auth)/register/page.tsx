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
import { UserRole } from "@/src/modules/auth/types";
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
      role: UserRole.SHOPKEEPER,
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Join DrinkDoor and manage your sales
            </p>
          </div>

          {success ? (
            <div className="rounded-lg bg-green-950/20 border border-green-800/30 p-4 text-center text-sm font-semibold text-green-400">
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
                  <label className="text-xs font-semibold text-zinc-350">
                    Account Role
                  </label>
                  <select
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] cursor-pointer"
                    {...register("role")}
                  >
                    <option value="SHOPKEEPER" className="bg-zinc-950 text-zinc-100">Shopkeeper</option>
                    <option value="DISTRIBUTOR" className="bg-zinc-950 text-zinc-100">Distributor</option>
                    <option value="ADMIN" className="bg-zinc-950 text-zinc-100">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Create Account
                </Button>
                <div className="text-center text-sm">
                  <span className="text-zinc-400">Already have an account? </span>
                  <Link
                    href="/login"
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
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
