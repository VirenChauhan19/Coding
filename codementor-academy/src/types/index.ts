// Shared application types.

export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Role = "STUDENT" | "ADMIN";

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "CODE_OUTPUT"
  | "DEBUG"
  | "SHORT_ANSWER";

// Objective question types are auto-gradable by exact / normalized match.
export const OBJECTIVE_TYPES: QuestionType[] = [
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "FILL_BLANK",
  "CODE_OUTPUT",
];

export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface AnswerRecord {
  questionId: string;
  answer: string;
  correct: boolean;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface TutorMessage {
  role: "user" | "tutor";
  content: string;
}
