'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing real-time tutoring assistance to students.
 *
 * It takes a student's question as input and returns a streaming response that guides the student through the material.
 *
 * @exports provideRealTimeTutoringAssistance - The main function that initiates the tutoring assistance flow.
 * @exports ProvideRealTimeTutoringAssistanceInput - The input type for the provideRealTimeTutoringAssistance function.
 * @exports ProvideRealTimeTutoringAssistanceOutput - The output type for the provideRealTimeTutoringAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoleSchema = z.enum(['user', 'assistant']);
type Role = z.infer<typeof RoleSchema>;

const MessageSchema = z.object({
  role: RoleSchema,
  content: z.string(),
});
type Message = z.infer<typeof MessageSchema>;

const ProvideRealTimeTutoringAssistanceInputSchema = z.object({
  question: z.string().describe("The student's question."),
  context: z
    .string()
    .optional()
    .describe('The context of the question (e.g., the topic being studied).'),
  previousMessages: z
    .array(MessageSchema)
    .optional()
    .describe('Previous messages in the conversation.'),
});

export type ProvideRealTimeTutoringAssistanceInput = z.infer<
  typeof ProvideRealTimeTutoringAssistanceInputSchema
>;

const ProvideRealTimeTutoringAssistanceOutputSchema = z.object({
  response: z.string().describe("The AI tutor's response."),
  sentiment: z
    .enum(['calm', 'neutral', 'stressed'])
    .describe(
      "The student's sentiment detected from their most recent message."
    ),
});

export type ProvideRealTimeTutoringAssistanceOutput = z.infer<
  typeof ProvideRealTimeTutoringAssistanceOutputSchema
>;

export async function provideRealTimeTutoringAssistance(
  input: ProvideRealTimeTutoringAssistanceInput
): Promise<ProvideRealTimeTutoringAssistanceOutput> {
  return provideRealTimeTutoringAssistanceFlow(input);
}

const summarizePrompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {
    schema: z.object({
      history: z.array(MessageSchema),
    }),
  },
  prompt: `Summarize the following conversation between a user and an AI Tutor. Keep it concise, but capture the key topics discussed and any resolutions.

{{#each history}}
{{role}}: {{content}}
{{/each}}

Summary:`,
});

const prompt = ai.definePrompt({
  name: 'provideRealTimeTutoringAssistancePrompt',
  input: {
    schema: z.object({
      question: z.string(),
      context: z.string().optional(),
      historySummary: z.string().optional(),
      recentHistory: z.array(MessageSchema).optional(),
    }),
  },
  output: {
    schema: ProvideRealTimeTutoringAssistanceOutputSchema,
  },
  prompt: `You are MindMate, an AI tutor that understands your student. Your goal is to help them learn better and stress less.

First, analyze the student's most recent message to determine their sentiment. Classify it as 'calm', 'neutral', or 'stressed', and set the 'sentiment' field in your response object.

Your primary goal is to be a helpful and supportive companion. Provide clear, direct answers to the student's questions. Avoid asking unnecessary counter-questions and focus on solving their problem.

Your responses should be well-organized and easy to read. Use markdown for formatting, especially for code snippets, which should be enclosed in triple backticks (\`\`\`language\`).

Based on the detected sentiment, adapt your response style:
- If the sentiment is 'stressed' or the user mentions being tired, keep your explanations simple and use positive, encouraging language. You might say something like, "It's okay to feel stressed, let's break this down," and you can suggest a short break or a breathing exercise if it feels appropriate by suggesting they visit the 'Relaxation Corner'.
- If the sentiment is 'calm' or 'neutral', provide comprehensive and encouraging explanations to help them master the material.

Context: {{{context}}}

{{#if historySummary}}
Here is a summary of the conversation so far:
---
{{{historySummary}}}
---
{{/if}}

Here are the most recent messages:
{{#each recentHistory}}
  {{#if content}}
  {{role}}: {{content}}
  {{/if}}
{{/each}}

Student question: {{{question}}}

Tutor response:`,
});

const provideRealTimeTutoringAssistanceFlow = ai.defineFlow(
  {
    name: 'provideRealTimeTutoringAssistanceFlow',
    inputSchema: ProvideRealTimeTutoringAssistanceInputSchema,
    outputSchema: ProvideRealTimeTutoringAssistanceOutputSchema,
  },
  async input => {
    const {previousMessages = [], ...rest} = input;
    const SUMMARY_THRESHOLD = 6; // Summarize after 6 messages
    const RECENT_MESSAGES_TO_KEEP = 4;

    let historySummary: string | undefined;
    let recentHistory: Message[] | undefined = previousMessages;

    if (previousMessages.length > SUMMARY_THRESHOLD) {
      const toSummarize = previousMessages.slice(
        0,
        -RECENT_MESSAGES_TO_KEEP
      );
      const summaryResponse = await summarizePrompt({history: toSummarize});
      historySummary = summaryResponse.text;

      recentHistory = previousMessages.slice(-RECENT_MESSAGES_TO_KEEP);
    }

    const {output} = await prompt({
      ...rest,
      historySummary,
      recentHistory,
    });
    return output!;
  }
);
