'use server';

import {
  generatePersonalizedTest as generatePersonalizedTestFlow,
  GeneratePersonalizedTestInput,
} from '@/ai/flows/generate-personalized-test';
import { GeneratedTest } from './types';
import { provideRealTimeTutoringAssistance, ProvideRealTimeTutoringAssistanceInput } from '@/ai/flows/provide-real-time-tutoring-assistance';

// This is a sample implementation. In a real app, you'd save the test to a database
// and return the ID. For this demo, we generate an ID and return the full test object.
export async function generatePersonalizedTest(
  input: GeneratePersonalizedTestInput
): Promise<GeneratedTest> {
  console.log('Generating test with input:', input);
  const result = await generatePersonalizedTestFlow(input);

  if (!result || !result.testQuestions) {
    throw new Error('Failed to generate test questions from AI.');
  }

  const test: GeneratedTest = {
    id: `test_${Date.now()}`,
    knowledgeLevel: input.knowledgeLevel,
    learningGoals: input.learningGoals,
    questions: result.testQuestions,
  };

  return test;
}

export async function getTutorResponse(input: ProvideRealTimeTutoringAssistanceInput) {
    return await provideRealTimeTutoringAssistance(input);
}
