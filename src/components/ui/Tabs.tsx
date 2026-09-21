import type { KeyboardEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Badge } from './Badge';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Подпись для скринридера: «Разделы страницы» и т.п. */
  ariaLabel: string;
}

/**
 * Табы по паттерну WAI-ARIA: стрелки влево/вправо переключают вкладку,
 * неактивные вкладки убраны из Tab-обхода (tabIndex = -1).
 * Панель контента рисует родитель — ему нужно повесить
 * role="tabpanel" и id={`panel-${value}`}.
 */
export function Tabs({ items, value, onChange, ariaLabel }: TabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = items.findIndex((item) => item.id === value);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % items.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = items.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      onChange(items[nextIndex].id);
      // Переводим фокус на новую вкладку, иначе клавиатура «теряется»
      const nextTab = document.getElementById(`tab-${items[nextIndex].id}`);
      nextTab?.focus();
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="flex gap-1 overflow-x-auto border-b border-line"
    >
      {items.map((item) => {
        const isActive = item.id === value;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`panel-${item.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              'relative -mb-px flex h-12 shrink-0 items-center gap-2 rounded-t-ctl px-4 font-display text-body font-semibold transition-colors',
              isActive ? 'text-ink' : 'text-muted-strong hover:bg-paper hover:text-ink',
            )}
          >
            {Icon && <Icon className="h-[18px] w-[18px]" aria-hidden="true" />}
            {item.label}
            {typeof item.count === 'number' && (
              <Badge count={item.count} tone={isActive ? 'accent' : 'neutral'} />
            )}
            {/* Подчёркивание активной вкладки — единственное место, где
                используется чистый #E07856: это декор, а не текст */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-3 bottom-0 h-[3px] rounded-t-full transition-opacity duration-200',
                isActive ? 'bg-accent opacity-100' : 'opacity-0',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
