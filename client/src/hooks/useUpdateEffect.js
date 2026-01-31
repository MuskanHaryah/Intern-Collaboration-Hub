import { useEffect, useRef } from 'react';

/**
 * Custom hook that only runs effect on updates, not on mount
 * @param {Function} effect - Effect callback
 * @param {Array} deps - Dependency array
 */
export function useUpdateEffect(effect, deps) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    return effect();
  }, deps);
}

export default useUpdateEffect;
