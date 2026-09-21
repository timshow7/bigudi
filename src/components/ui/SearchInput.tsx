import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Компактный вариант для шапки */
  compact?: boolean;
}

/**
 * Поле поиска. Может работать и как управляемое (value + onChange),
 * и само по себе — тогда держит значение во внутреннем состоянии.
 * Enter вызывает onSubmit, крестик очищает поле и возвращает в него фокус.
 */
export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Найти совет, рецепт или обсуждение',
  className,
  compact = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  function update(next: string) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(currentValue);
      }}
      className={cn('relative flex items-center', className)}
    >
      <Search
        className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={currentValue}
        onChange={(event) => update(event.target.value)}
        placeholder={placeholder}
        aria-label="Поиск по сайту"
        className={cn(
          'w-full rounded-ctl border border-line bg-surface pl-11 pr-10 text-body text-ink placeholder:text-muted',
          'transition-colors hover:border-[#DCD3C6] focus:border-accent focus:outline-none',
          // у search-инпутов Chrome рисует свой крестик — убираем, он дублирует наш
          '[&::-webkit-search-cancel-button]:appearance-none',
          compact ? 'h-11' : 'h-12',
        )}
      />
      {currentValue && (
        <button
          type="button"
          onClick={() => update('')}
          aria-label="Очистить поиск"
          className="absolute right-1 flex h-11 w-11 items-center justify-center rounded-ctl text-muted transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
