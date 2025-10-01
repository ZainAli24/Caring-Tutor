export type TestQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  subtopic: string;
};

export type GeneratedTest = {
  id: string;
  knowledgeLevel: string;
  learningGoals: string;
  questions: TestQuestion[];
};

export type UserAttempt = {
  testId: string;
  answers: number[];
  score: number;
  correctAnswers: number;
  totalQuestions: number;
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type TestResult = {
  id: string;
  userId: string;
  topic: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
};

export type Student = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    sentiment: 'calm' | 'neutral' | 'stressed';
    lastActivity: string;
    progress: number;
};
