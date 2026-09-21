import { cn } from '../../lib/cn';

/**
 * Аватар участника. Фото пользователей в прототипе нет и не будет
 * (стоковые лица запрещены), поэтому рисуем инициал на цветной подложке.
 * Цвет детерминирован: один и тот же ник всегда получает один и тот же фон,
 * и по аватару можно узнавать человека в треде.
 */
const palettes = [
  'bg-accent-soft text-accent-strong',
  'bg-forum-soft text-forum-strong',
  'bg-med-soft text-med-strong',
  'bg-paper text-muted-strong',
];

export function Avatar({ nickname, size = 'md' }: { nickname: string; size?: 'sm' | 'md' | 'lg' }) {
  const seed = nickname.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const palette = palettes[seed % palettes.length];
  const initial = nickname.replace(/[^a-zA-Zа-яА-Я]/g, '').charAt(0).toUpperCase() || '?';

  const sizes = {
    sm: 'h-8 w-8 text-caption',
    md: 'h-10 w-10 text-body',
    lg: 'h-12 w-12 text-h3',
  } as const;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-display font-bold',
        palette,
        sizes[size],
      )}
    >
      {initial}
    </span>
  );
}
