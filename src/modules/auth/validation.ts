import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name should contain at least 3 characters"),

  email: z
    .string()
    .email("Invalid email"),

  phone: z
    .string()
    .optional(),

  password: z
    .string()
    .min(6, "Password should be at least 6 characters"),

  role: z
    .enum(["ADMIN", "DISTRIBUTOR", "SHOPKEEPER"])
    .optional(),
});

export type RegisterFields = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password should be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFields = z.infer<typeof loginSchema>;
export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;