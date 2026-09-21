import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

/**
 * Переключатель вида («Схема» / «Списком»). Это группа радиокнопок по смыслу,
 * поэтому role="radiogroup" + aria-checked, а не набор независимых кнопок.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-ctl border border-line bg-surface p-1"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex h-10 items-center gap-2 rounded-[9px] px-4 text-caption font-semibold transition-colors',
              isActive ? 'bg-accent-soft text-accent-strong' : 'text-muted-strong hover:text-ink',
            )}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
