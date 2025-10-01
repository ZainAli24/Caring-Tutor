// src/ai/flows/generate-personalized-test.ts
'use server';

/**
 * @fileOverview Generates a personalized test for a student based on their knowledge level and learning goals.
 *
 * - generatePersonalizedTest - A function that generates a personalized test.
 * - GeneratePersonalizedTestInput - The input type for the generatePersonalizedTest function.
 * - GeneratePersonalizedTestOutput - The return type for the generatePersonalizedTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedTestInputSchema = z.object({
  knowledgeLevel: z
    .string()
    .describe('The student\'s current knowledge level (e.g., beginner, intermediate, advanced).'),
  learningGoals: z
    .string()
    .describe('The student\'s specific learning goals or topics of interest.'),
  numQuestions: z.number().describe('The number of questions to generate for the test.'),
});
export type GeneratePersonalizedTestInput = z.infer<
  typeof GeneratePersonalizedTestInputSchema
>;

const GeneratePersonalizedTestOutputSchema = z.object({
  testQuestions: z.array(
    z.object({
      question: z.string().describe('The text of the question.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      answerIndex: z.number().describe('The index of the correct answer in the options array.'),
      subtopic: z.string().describe('The subtopic or category of the question.'),
    })
  ).describe('An array of test questions tailored to the student.'),
});
export type GeneratePersonalizedTestOutput = z.infer<
  typeof GeneratePersonalizedTestOutputSchema
>;

export async function generatePersonalizedTest(
  input: GeneratePersonalizedTestInput
): Promise<GeneratePersonalizedTestOutput> {
  return generatePersonalizedTestFlow(input);
}

const generateTestPrompt = ai.definePrompt({
  name: 'generateTestPrompt',
  input: {schema: GeneratePersonalizedTestInputSchema},
  output: {schema: GeneratePersonalizedTestOutputSchema},
  prompt: `You are an expert tutor specializing in creating personalized tests for students.

You will generate a test with {{numQuestions}} questions tailored to the student's knowledge level and learning goals. Return the test as a strict JSON array of question objects.

Each question object should have the following structure:
{
  "question": "The text of the question.",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answerIndex": The index of the correct answer in the options array (0-3),
  "subtopic": "The subtopic or category of the question."
}

Knowledge Level: {{{knowledgeLevel}}}
Learning Goals: {{{learningGoals}}}
Number of Questions: {{{numQuestions}}}

Ensure the test questions are relevant to the student's knowledge level and learning goals.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generatePersonalizedTestFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedTestFlow',
    inputSchema: GeneratePersonalizedTestInputSchema,
    outputSchema: GeneratePersonalizedTestOutputSchema,
  },
  async input => {
    const {output} = await generateTestPrompt(input);
    return output!;
  }
);
