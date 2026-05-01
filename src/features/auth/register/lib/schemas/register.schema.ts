import { z } from "zod"
import { passwordRule } from "@/shared/lib/schemas/password.schema";


export const emailSchema = z.object({
  email: z.string().email("Invalid email"),
})

export const otpSchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits"),
})

export const profileSchema = z.object({
  username: z.string().min(3),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
})


/* -------------------------------- */
/* Register Password Schema */
/* -------------------------------- */

export const passwordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })