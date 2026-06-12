// Shared shapes for seed content. Kept framework-free so the seed script
// (and a future admin import) can consume them directly.

export interface SeedQuestion {
  type:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "FILL_BLANK"
    | "CODE_OUTPUT"
    | "DEBUG"
    | "SHORT_ANSWER";
  prompt: string;
  code?: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topic?: string;
}

export interface SeedQuiz {
  title: string;
  questions: SeedQuestion[];
}

export interface SeedTestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface SeedPractice {
  title: string;
  prompt: string;
  language?: string;
  starterCode?: string;
  solution?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topic?: string;
  testCases?: SeedTestCase[];
}

export interface SeedLesson {
  slug: string;
  title: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estMinutes?: number;
  content: string;
  codeExample?: string;
  summary?: string;
  prerequisites?: string[];
  quizzes?: SeedQuiz[];
  practice?: SeedPractice[];
}

export interface SeedExam {
  title: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationMinutes: number;
  passingScore: number;
  isBoss?: boolean;
  xpReward?: number;
  questions: SeedQuestion[];
}

export interface SeedCourse {
  slug: string;
  language: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  lessons: SeedLesson[];
  exams: SeedExam[];
}
