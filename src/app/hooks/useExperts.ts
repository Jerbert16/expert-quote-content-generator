import { useState, useCallback } from 'react';
import { Expert, ExpertForm, UseExpertsReturn } from '@/app/types';

export const useExperts = (): UseExpertsReturn => {
  const [experts, setExperts] = useState<Expert[]>([]);

  const addExpert = useCallback((expertData: ExpertForm): void => {
    if (expertData.name.trim() && expertData.quote.trim()) {
      const newExpert: Expert = {
        ...expertData,
        id: Date.now(),
      };
      setExperts(prev => [...prev, newExpert]);
    }
  }, []);

  const removeExpert = useCallback((id: number): void => {
    setExperts(prev => prev.filter(expert => expert.id !== id));
  }, []);

  const clearExperts = useCallback((): void => {
    setExperts([]);
  }, []);

  return {
    experts,
    addExpert,
    removeExpert,
    clearExperts,
  };
};