export interface Exam {
  id: string;
  title: string;
  description: string;
  image: string; // Used as the icon/logo
  duration: number; // in minutes
  questionsCount: number;
  diplomaId: string;
  diploma: {
    id: string;
    title: string;
  };
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamsResponse {
  status: boolean;
  code: number;
  payload: {
    data: Exam[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
