/** Вспомогательные функции форматирования текста для карточек и заголовков. */

/**
 * Склонение существительного после числа.
 * plural(1, ['статья','статьи','статей']) → 'статья'
 * plural(5, ['статья','статьи','статей']) → 'статей'
 */
export function plural(count: number, forms: [string, string, string]): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

/** «12 мин чтения», «1 мин чтения» */
export function readingTime(minutes: number): string {
  return `${minutes} мин чтения`;
}

/** ISO-дата → «14 сентября 2026» */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
