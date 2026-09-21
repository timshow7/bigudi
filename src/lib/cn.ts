/**
 * Мини-замена библиотеки clsx: склеивает классы и выбрасывает false/undefined.
 * Отдельная библиотека ради 5 строк кода в учебном проекте не нужна.
 *
 *   cn('btn', isActive && 'btn--active')  →  'btn btn--active'
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
