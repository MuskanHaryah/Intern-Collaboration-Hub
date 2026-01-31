import { useState, useCallback } from 'react';

/**
 * Custom hook for managing async operations with loading/error states
 * @param {Function} asyncFunction - The async function to execute
 * @returns {Object} - { execute, isLoading, error, data, reset }
 */
export function useAsync(asyncFunction) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return { success: true, data: result };
      } catch (err) {
        setError(err.message || 'An error occurred');
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, isLoading, error, data, reset };
}

export default useAsync;
