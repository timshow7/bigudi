import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, SearchX } from 'lucide-react';

type EmptyVariant = 'empty' | 'search' | 'error';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title: string;
  description: string;
  action?: ReactNode;
}

const icons = {
  empty: Inbox,
  search: SearchX,
  error: AlertTriangle,
} as const;

/**
 * Пустое состояние и состояние ошибки — один компонент, три варианта.
 * Текст всегда говорит, что произошло и что делать дальше:
 * «ничего не найдено» без подсказки — тупик для пользователя.
 */
export function EmptyState({ variant = 'empty', title, description, action }: EmptyStateProps) {
  const Icon = icons[variant];
  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : undefined}
      className="flex flex-col items-center rounded-card border border-dashed border-line bg-surface/60 px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
          isError ? 'bg-[#FBE9E4] text-accent-strong' : 'bg-paper text-muted'
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="text-h3 text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-caption text-muted-strong">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
