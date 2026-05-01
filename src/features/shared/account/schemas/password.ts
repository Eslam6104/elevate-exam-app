import { z } from "zod"
import { passwordRule } from "@/shared/lib/schemas/password.schema";


export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: passwordRule,

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>