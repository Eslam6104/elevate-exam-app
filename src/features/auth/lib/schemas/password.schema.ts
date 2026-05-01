import { z } from "zod";
import { passwordRule } from "@/shared/lib/schemas/password.schema";



export const passwordSchema = z
  .object({
    password: passwordRule,

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type PasswordSchema = z.infer<typeof passwordSchema>;