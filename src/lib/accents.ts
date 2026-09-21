import type { AccentKey } from '../types';

/**
 * Готовые наборы классов под каждую акцентную роль.
 * Tailwind собирает CSS по строкам, найденным в коде, поэтому классы
 * нельзя склеивать на лету (`bg-${color}-soft` не соберётся).
 * Отсюда — таблица с полными именами классов.
 */
export const accentStyles: Record<AccentKey, { softBg: string; text: string; border: string }> = {
  action: { softBg: 'bg-accent-soft', text: 'text-accent-strong', border: 'border-accent' },
  forum: { softBg: 'bg-forum-soft', text: 'text-forum-strong', border: 'border-forum' },
  med: { softBg: 'bg-med-soft', text: 'text-med-strong', border: 'border-med' },
  neutral: { softBg: 'bg-paper', text: 'text-muted-strong', border: 'border-line' },
};
