import * as z from "zod";

export const bulkQuestionSchema = z.object({
  examId: z.string().min(1, "Exam selection is required"),
  questions: z.array(z.object({
    text: z.string().min(1, "Question text is required"),
    answers: z.array(z.object({
      text: z.string().min(1, "Answer text is required"),
      isCorrect: z.boolean()
    })).min(2, "At least 2 answers required")
      .refine(ans => ans.some(a => a.isCorrect), "One answer must be correct")
  })).min(1, "At least one question required")
});

export type BulkQuestionValues = z.infer<typeof bulkQuestionSchema>;
