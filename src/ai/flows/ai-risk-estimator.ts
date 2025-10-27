'use server';

/**
 * @fileOverview AI-powered risk estimator for coverage fees.
 *
 * - aiRiskEstimator - Estimates the risk and suggests a fee for a coverage.
 * - AiRiskEstimatorInput - The input type for the aiRiskEstimator function.
 * - AiRiskEstimatorOutput - The return type for the aiRiskEstimator function.
 */

import {z} from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk_a04ca9d8d9ff4daaa4f4dadff0e1468b95413d9be3bd47d58aed9bc293602081',
  baseURL: 'https://api.asi1.ai/v1',
});

const AiRiskEstimatorInputSchema = z.object({
  durationDays: z.number().describe('The duration of the coverage in days.'),
  valueToProtect: z.number().describe('The value to be protected by the coverage.'),
  activityScore: z.number().describe('The user activity score.'),
  category: z.string().describe('The category of the coverage (e.g., Hospitality, Car Rental).'),
});
export type AiRiskEstimatorInput = z.infer<typeof AiRiskEstimatorInputSchema>;

const AiRiskEstimatorOutputSchema = z.object({
  suggestedFeePercentage: z
    .number()
    .describe('The suggested fee percentage based on the risk assessment.'),
  totalCost: z.number().describe('The total cost of the coverage, including the fee.'),
  riskLevel: z.string().describe('The risk level associated with the coverage (Low, Medium, High).'),
  explanation: z.string().describe('Explanation of risk factors.'),
});
export type AiRiskEstimatorOutput = z.infer<typeof AiRiskEstimatorOutputSchema>;

export async function aiRiskEstimator(input: AiRiskEstimatorInput): Promise<AiRiskEstimatorOutput> {
    const prompt = `You are an AI risk estimator for a decentralized crypto insurance platform.

  Based on the coverage details and user activity score, estimate the risk and suggest a fee.

  Consider these factors:
  - Coverage duration: ${input.durationDays} days
  - Value to protect: ${input.valueToProtect} PYUSD
  - User activity score: ${input.activityScore}
  - Coverage category: ${input.category}

  Determine the risk level (Low, Medium, High) and provide a suggested fee percentage and total cost.

  Risk increases with higher duration, higher value, lower activity score, and riskier categories. Categories include Hospitality, Car Rental, Equipment, Logistics, Freelance, P2P, and Events. Events are riskiest, followed by Freelance and P2P.
  Low user scores also increment risk.

  Explain the risk factors that contribute to the estimation. Format the result as a JSON object with 'suggestedFeePercentage', 'totalCost', 'riskLevel', and 'explanation' keys.

  Make sure that the suggestedFeePercentage is a number between 0.1 and 15. The totalCost should be (valueToProtect * suggestedFeePercentage / 100).
  
  Return a JSON object that satisfies the following schema, do not return any other text or formatting:
  ${JSON.stringify(AiRiskEstimatorOutputSchema.describe('AiRiskEstimatorOutputSchema'))}`

  const response = await openai.chat.completions.create({
    model: 'asi1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const output = response.choices[0].message.content!;
  const parsed = JSON.parse(output);

  // Calculate totalCost on the server to ensure consistency
  parsed.totalCost = (input.valueToProtect * parsed.suggestedFeePercentage) / 100;

  return AiRiskEstimatorOutputSchema.parse(parsed);
}
