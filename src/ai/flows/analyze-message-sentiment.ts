'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of incoming messages.
 *
 * analyzeMessageSentiment - A function that analyzes the sentiment of a message.
 * AnalyzeMessageSentimentInput - The input type for the analyzeMessageSentiment function.
 * AnalyzeMessageSentimentOutput - The return type for the analyzeMessageSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMessageSentimentInputSchema = z.object({
  message: z.string().describe('The message to analyze.'),
});
export type AnalyzeMessageSentimentInput = z.infer<typeof AnalyzeMessageSentimentInputSchema>;

const AnalyzeMessageSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the message (e.g., positive, negative, neutral).'
    ),
  score: z.number().describe('A numerical score representing the sentiment.'),
});
export type AnalyzeMessageSentimentOutput = z.infer<typeof AnalyzeMessageSentimentOutputSchema>;

export async function analyzeMessageSentiment(
  input: AnalyzeMessageSentimentInput
): Promise<AnalyzeMessageSentimentOutput> {
  return analyzeMessageSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMessageSentimentPrompt',
  input: {schema: AnalyzeMessageSentimentInputSchema},
  output: {schema: AnalyzeMessageSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following message and provide a sentiment and score:

Message: {{{message}}}

Respond in JSON format with a "sentiment" (positive, negative, or neutral) and a numerical "score" between -1 and 1, where -1 is very negative and 1 is very positive.`,
});

const analyzeMessageSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeMessageSentimentFlow',
    inputSchema: AnalyzeMessageSentimentInputSchema,
    outputSchema: AnalyzeMessageSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
