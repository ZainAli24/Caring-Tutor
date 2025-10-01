'use server';

/**
 * @fileOverview This file defines a Genkit flow to analyze student sentiment from their responses and interactions.
 *
 * - analyzeStudentSentiment - Analyzes student sentiment and returns a sentiment label.
 * - AnalyzeStudentSentimentInput - The input type for the analyzeStudentSentiment function.
 * - AnalyzeStudentSentimentOutput - The return type for the analyzeStudentSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentSentimentInputSchema = z.object({
  text: z
    .string()
    .describe('The text to analyze for student sentiment.'),
});

export type AnalyzeStudentSentimentInput = z.infer<typeof AnalyzeStudentSentimentInputSchema>;

const AnalyzeStudentSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['calm', 'neutral', 'stressed'])
    .describe('The sentiment of the student.'),
});

export type AnalyzeStudentSentimentOutput = z.infer<typeof AnalyzeStudentSentimentOutputSchema>;

export async function analyzeStudentSentiment(input: AnalyzeStudentSentimentInput): Promise<AnalyzeStudentSentimentOutput> {
  return analyzeStudentSentimentFlow(input);
}

const analyzeStudentSentimentPrompt = ai.definePrompt({
  name: 'analyzeStudentSentimentPrompt',
  input: {schema: AnalyzeStudentSentimentInputSchema},
  output: {schema: AnalyzeStudentSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following text and classify it as calm, neutral, or stressed. Return only one word: calm|neutral|stressed.

Text: {{{text}}}`, 
});

const analyzeStudentSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeStudentSentimentFlow',
    inputSchema: AnalyzeStudentSentimentInputSchema,
    outputSchema: AnalyzeStudentSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeStudentSentimentPrompt(input);
    return output!;
  }
);
