import { useState, useCallback } from 'react';
import type { QuizResult } from '@/types';

const STORAGE_KEY = 'world-explorer-progress';

interface Progress {
  results: QuizResult[];
}

function loadProgress(): Progress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { results: [] };
  } catch {
    return { results: [] };
  }
}

function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const addResult = useCallback((result: QuizResult) => {
    setProgress((prev) => {
      const updated = { results: [...prev.results, result] };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const bestScore = useCallback(
    (category: string): number => {
      const categoryResults = progress.results.filter((r) => r.config.category === category);
      if (!categoryResults.length) return 0;
      return Math.max(...categoryResults.map((r) => Math.round((r.score / r.total) * 100)));
    },
    [progress],
  );

  const clearProgress = useCallback(() => {
    const cleared = { results: [] };
    saveProgress(cleared);
    setProgress(cleared);
  }, []);

  return { results: progress.results, addResult, bestScore, clearProgress };
}
