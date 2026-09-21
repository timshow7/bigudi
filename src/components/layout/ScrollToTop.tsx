import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router сохраняет позицию прокрутки при переходе.
 * Из-за этого переход со дна главной на страницу комнаты открывает её
 * сразу в середине. Этот компонент возвращает прокрутку наверх.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
