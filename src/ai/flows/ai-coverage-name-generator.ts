'use server';

/**
 * @fileOverview An AI agent that suggests a coverage name based on the category and partner name.
 *
 * - suggestCoverageName - A function that handles the coverage name generation process.
 * - SuggestCoverageNameInput - The input type for the suggestCoverageName function.
 * - SuggestCoverageNameOutput - The return type for the suggestCoverageName function.
 */

import {z} from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk_a04ca9d8d9ff4daaa4f4dadff0e1468b95413d9be3bd47d58aed9bc293602081',
  baseURL: 'https://api.asi1.ai/v1',
});

const SuggestCoverageNameInputSchema = z.object({
  category: z.string().describe('The category of the coverage (e.g., Hospitality, Car Rental).'),
  partnerName: z.string().describe('The name of the partner (e.g., Airbnb).'),
});
export type SuggestCoverageNameInput = z.infer<typeof SuggestCoverageNameInputSchema>;

const SuggestCoverageNameOutputSchema = z.object({
  coverageName: z.string().describe('The suggested coverage name.'),
});
export type SuggestCoverageNameOutput = z.infer<typeof SuggestCoverageNameOutputSchema>;

export async function suggestCoverageName(input: SuggestCoverageNameInput): Promise<SuggestCoverageNameOutput> {
    const prompt = `You are a helpful assistant that suggests coverage names based on the category and partner name provided by the user.

  Suggest a creative and descriptive name for the coverage, incorporating both the category and partner name.

  Category: ${input.category}
  Partner Name: ${input.partnerName}
  `

  const response = await openai.chat.completions.create({
    model: 'asi1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const output = response.choices[0].message.content!;
  return SuggestCoverageNameOutputSchema.parse(output);
}
