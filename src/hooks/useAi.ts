'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { aiRiskEstimator, suggestCoverageName } from '@/ai/flows';
import type { AiRiskEstimatorInput, AiRiskEstimatorOutput } from '@/ai/flows/ai-risk-estimator';
import type {
  SuggestCoverageNameInput,
  SuggestCoverageNameOutput,
} from '@/ai/flows/ai-coverage-name-generator';

export const useAi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const estimateRisk = useCallback(async (input: AiRiskEstimatorInput): Promise<AiRiskEstimatorOutput | null> => {
    setIsLoading(true);
    try {
      const result = await aiRiskEstimator(input);
      return result;
    } catch (error) {
      console.error("AI Risk Estimation Error:", error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to get risk estimation from AI.',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const suggestName = useCallback(async (input: SuggestCoverageNameInput): Promise<SuggestCoverageNameOutput | null> => {
    setIsLoading(true);
    try {
      const result = await suggestCoverageName(input);
      return result;
    } catch (error) {
      console.error("AI Name Suggestion Error:", error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to get name suggestion from AI.',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    estimateRisk,
    suggestName,
  };
};
