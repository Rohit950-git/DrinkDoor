import { z } from "zod";
import { UserRole } from "@/src/modules/auth/types";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must contain at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .optional(),
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: "Please select a valid user role" }),
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  distributor: z
    .string()
    .optional(),
});

export type CreateUserFields = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must contain at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  phone: z
    .string()
    .optional(),
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: "Please select a valid user role" }),
    }),
  distributor: z
    .string()
    .optional(),
});

export type UpdateUserFields = z.infer<typeof updateUserSchema>;

export const assignDistributorSchema = z.object({
  distributor: z
    .string()
    .min(1, "Please select a distributor to assign"),
});

export type AssignDistributorFields = z.infer<typeof assignDistributorSchema>;

export const resetUserPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetUserPasswordFields = z.infer<typeof resetUserPasswordSchema>;
