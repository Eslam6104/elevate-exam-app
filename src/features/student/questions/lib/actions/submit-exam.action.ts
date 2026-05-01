"use server";

import { submitExamApi } from "../apis/submit-exam.api";
import { SubmissionPayload } from "../../types/question.types";

export const submitExamAction = async (payload: SubmissionPayload) => {
  try {
    const response = await submitExamApi(payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error submitting exam:", error);
    return { success: false, error: error.response?.data?.message || "Submission failed" };
  }
};
