import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface ChipProps {
  children: ReactNode;
  /** Если передан onToggle — чипс становится кнопкой-фильтром с состоянием */
  onToggle?: () => void;
  selected?: boolean;
  tone?: 'neutral' | 'forum';
  className?: string;
}

/**
 * Чипс-тег. Два режима в одном компоненте:
 *  • без onToggle — просто метка (тег статьи);
 *  • с onToggle — переключаемый фильтр, тогда это <button> с aria-pressed,
 *    чтобы скринридер объявлял «нажато / не нажато».
 */
export function Chip({ children, onToggle, selected = false, tone = 'neutral', className }: ChipProps) {
  const base =
    'inline-flex items-center rounded-ctl px-3 text-caption font-medium transition-colors duration-150';

  if (!onToggle) {
    return (
      <span
        className={cn(
          base,
          'h-8',
          tone === 'forum' ? 'bg-forum-soft text-forum-strong' : 'bg-paper text-muted-strong',
          className,
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        base,
        // 44px по высоте — фильтры часто жмут с телефона
        'h-11 border',
        selected
          ? 'border-accent-strong bg-accent-strong text-white'
          : 'border-line bg-surface text-muted-strong hover:border-accent hover:text-accent-strong',
        className,
      )}
    >
      {children}
    </button>
  );
}
