import * as z from "zod";

export const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  examId: z.string().min(1, "Exam selection is required"),
  answers: z.array(z.object({
    text: z.string().min(1, "Answer text is required"),
    isCorrect: z.boolean()
  })).min(2, "At least 2 answers are required")
    .refine(answers => answers.some(a => a.isCorrect), "At least one answer must be correct")
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
