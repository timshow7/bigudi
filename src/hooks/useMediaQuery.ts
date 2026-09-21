import { useEffect, useState } from 'react';

/**
 * Подписка на медиазапрос из JS.
 * Нужна там, где поведение, а не только внешний вид, зависит от ширины:
 * например, на мобильном главная сразу открывается списком, а не схемой.
 * Всё, что можно решить классами Tailwind, решаем классами.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
