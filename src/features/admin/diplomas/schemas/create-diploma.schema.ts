import { z } from "zod";

export const createDiplomaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
});

export type CreateDiplomaValues = z.infer<typeof createDiplomaSchema>;
