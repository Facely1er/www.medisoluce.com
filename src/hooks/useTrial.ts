/**
 * React Hook for Trial Management
 * Provides easy access to trial functionality in components
 */

import { useState, useEffect } from 'react';
import { trialService, type TrialStatus, type TrialRequest } from '../services/trialService';

export function useTrial(userId: string, productId?: string) {
  const [trials, setTrials] = useState<TrialStatus[]>([]);
  const [activeTrial, setActiveTrial] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Load user trials
    const userTrials = trialService.getUserTrials(userId);
    setTrials(userTrials);

    // Set active trial if productId provided
    if (productId) {
      const trial = trialService.getActiveTrial(userId, productId);
      setActiveTrial(trial);
    }

    // Check for expired trials
    trialService.checkTrialExpiration();

    setLoading(false);

    // Set up interval to check expiration
    const interval = setInterval(() => {
      trialService.checkTrialExpiration();
      const updatedTrials = trialService.getUserTrials(userId);
      setTrials(updatedTrials);
      if (productId) {
        const updatedTrial = trialService.getActiveTrial(userId, productId);
        setActiveTrial(updatedTrial);
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [userId, productId]);

  const startTrial = async (request: Omit<TrialRequest, 'userId'>) => {
    try {
      const trial = trialService.startTrial({
        ...request,
        userId
      });
      setTrials([...trials, trial]);
      if (productId === request.productId) {
        setActiveTrial(trial);
      }
      return trial;
    } catch (error) {
      console.error('Failed to start trial:', error);
      throw error;
    }
  };

  const isEligible = (productId: string) => {
    return trialService.isEligibleForTrial(userId, productId);
  };

  const convertTrial = async (productId: string, subscriptionId?: string) => {
    try {
      const trial = trialService.convertTrialToPaid(userId, productId, subscriptionId);
      setTrials(trials.map(t => 
        t.userId === userId && t.productId === productId ? trial : t
      ));
      if (activeTrial?.productId === productId) {
        setActiveTrial(null);
      }
      return trial;
    } catch (error) {
      console.error('Failed to convert trial:', error);
      throw error;
    }
  };

  const cancelTrial = (productId: string) => {
    try {
      const trial = trialService.cancelTrial(userId, productId);
      setTrials(trials.map(t => 
        t.userId === userId && t.productId === productId ? trial : t
      ));
      if (activeTrial?.productId === productId) {
        setActiveTrial(null);
      }
      return trial;
    } catch (error) {
      console.error('Failed to cancel trial:', error);
      throw error;
    }
  };

  return {
    trials,
    activeTrial,
    loading,
    startTrial,
    isEligible,
    convertTrial,
    cancelTrial
  };
}

