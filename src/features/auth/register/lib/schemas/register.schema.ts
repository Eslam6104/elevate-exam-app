import { z } from "zod";
import { passwordRule } from "@/shared/lib/schemas/password.schema";

export const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address (e.g. user@example.com)"),
});

export const otpSchema = z.object({
  code: z.string().min(1, "Verification code is required").length(6, "Verification code must be exactly 6 digits"),
});

export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, and underscores (no spaces)"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number (e.g. 01012345678 or +201012345678)"),
});

/* -------------------------------- */
/* Register Password Schema */
/* -------------------------------- */

export const passwordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match. Please re-enter the same password.",
    path: ["confirmPassword"],
  });