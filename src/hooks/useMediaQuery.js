import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query (matches client-side only; SSR defaults to false).
 * @param {string} query e.g. '(max-width: 639px)'
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
