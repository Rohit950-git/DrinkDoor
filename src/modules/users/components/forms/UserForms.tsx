"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  updateUserSchema,
  assignDistributorSchema,
  resetUserPasswordSchema,
  CreateUserFields,
  UpdateUserFields,
  AssignDistributorFields,
  ResetUserPasswordFields,
} from "../../validation/userSchema";
import { UserRole } from "@/src/modules/auth/types";
import { Input } from "@/src/components/common/Input";
import { PasswordInput } from "@/src/components/common/PasswordInput";
import { Button } from "@/src/components/common/Button";

/**
 * 1. User Add/Edit Form Component
 */
interface UserFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function UserForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  isEdit = false,
}: UserFormProps) {
  const schema = isEdit ? updateUserSchema : createUserSchema;
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      role: UserRole.SHOPKEEPER,
      password: "",
      distributor: "",
    },
  });

  const selectedRole = watch("role");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Julius Caesar"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. julius@drinkdoor.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Phone Number (Optional)"
          placeholder="e.g. +1 (555) 123-4567"
          error={errors.phone?.message}
          {...register("phone")}
        />

        {!isEdit && (
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        )}

        {/* Role Select Input */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold text-zinc-300">
            User Authorization Role
          </label>
          <select
            {...register("role")}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500"
          >
            <option value={UserRole.SHOPKEEPER} className="bg-zinc-950">Shopkeeper</option>
            <option value={UserRole.DISTRIBUTOR} className="bg-zinc-950">Distributor</option>
            <option value={UserRole.ADMIN} className="bg-zinc-950">System Admin</option>
          </select>
          {errors.role?.message && (
            <span className="text-xs font-medium text-destructive">
              {errors.role?.message as string}
            </span>
          )}
        </div>

        {/* Dynamic Distributor Select: Show if role is SHOPKEEPER or DISTRIBUTOR */}
        {(selectedRole === UserRole.SHOPKEEPER || selectedRole === UserRole.DISTRIBUTOR) && (
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-zinc-300">
              Assign Distributor Hub
            </label>
            <select
              {...register("distributor")}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500"
            >
              <option value="" className="bg-zinc-950 text-zinc-500">Unassigned (None)</option>
              <option value="Apex Logistics" className="bg-zinc-950">Apex Logistics</option>
              <option value="Global Transit" className="bg-zinc-950">Global Transit</option>
            </select>
            {errors.distributor?.message && (
              <span className="text-xs font-medium text-destructive">
                {errors.distributor?.message as string}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
        <Button type="submit" className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" isLoading={isLoading}>
          {isEdit ? "Update Operator" : "Register Operator"}
        </Button>
      </div>
    </form>
  );
}

/**
 * 2. Assign Distributor Form Component
 */
interface AssignDistributorFormProps {
  onSubmit: (data: AssignDistributorFields) => void;
  defaultValues?: { distributor: string };
  isLoading?: boolean;
}

export function AssignDistributorForm({
  onSubmit,
  defaultValues,
  isLoading = false,
}: AssignDistributorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignDistributorFields>({
    resolver: zodResolver(assignDistributorSchema),
    defaultValues: defaultValues || {
      distributor: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-zinc-300">
          Select Distributor Hub
        </label>
        <select
          {...register("distributor")}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500"
        >
          <option value="" className="bg-zinc-950 text-zinc-500">Select hub...</option>
          <option value="Apex Logistics" className="bg-zinc-950">Apex Logistics</option>
          <option value="Global Transit" className="bg-zinc-950">Global Transit</option>
        </select>
        {errors.distributor?.message && (
          <span className="text-xs font-medium text-destructive">
            {errors.distributor?.message}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
        <Button type="submit" className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" isLoading={isLoading}>
          Assign Logistics
        </Button>
      </div>
    </form>
  );
}

/**
 * 3. Operator Password Reset Form Component
 */
interface ResetPasswordFormProps {
  onSubmit: (data: ResetUserPasswordFields) => void;
  isLoading?: boolean;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading = false,
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetUserPasswordFields>({
    resolver: zodResolver(resetUserPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
      <div className="space-y-4">
        <PasswordInput
          label="New Operator Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
        <Button type="submit" className="bg-[#D4AF37] hover:bg-[#B8932C] text-black font-bold" isLoading={isLoading}>
          Rotate Password
        </Button>
      </div>
    </form>
  );
}
