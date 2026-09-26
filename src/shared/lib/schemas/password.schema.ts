import { z } from "zod";

export const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
  .regex(/[0-9]/, "Password must contain at least one number (0-9)")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (!@#$%^&* etc.)");

