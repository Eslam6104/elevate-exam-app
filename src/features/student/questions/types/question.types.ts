export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  text: string;
  examId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  answers: Answer[];
  exam: {
    id: string;
    title: string;
  };
}

export interface QuestionsResponse {
  status: boolean;
  code: number;
  payload: {
    questions: Question[];
  };
}

export interface SubmissionPayload {
  examId: string;
  answers: {
    questionId: string;
    answerId: string;
  }[];
  startedAt: string;
}

export interface SubmissionResponse {
  status: boolean;
  code: number;
  message?: string;
  payload?: any;
}
