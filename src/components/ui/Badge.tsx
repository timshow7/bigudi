import { cn } from '../../lib/cn';

interface BadgeProps {
  count: number;
  tone?: 'neutral' | 'accent' | 'forum';
  className?: string;
}

/** Счётчик рядом с названием вкладки или раздела */
export function Badge({ count, tone = 'neutral', className }: BadgeProps) {
  const tones = {
    neutral: 'bg-paper text-muted-strong',
    accent: 'bg-accent-soft text-accent-strong',
    forum: 'bg-forum-soft text-forum-strong',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5 text-[12px] font-semibold leading-none',
        tones[tone],
        className,
      )}
    >
      {count}
    </span>
  );
}
