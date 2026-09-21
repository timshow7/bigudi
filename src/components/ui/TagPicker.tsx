import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface TagPickerProps {
  id: string;
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  /** Существующие теги проекта — из них собирается автодополнение */
  suggestions: string[];
  max?: number;
  hint?: string;
}

/**
 * Поле тегов с автодополнением.
 *
 * Подсказки берутся из уже существующих тегов: так похожие вопросы попадают
 * в один тег, а не расходятся на «стиралка», «стиральная машина» и «стирка».
 * Свой тег ввести тоже можно — иначе новые темы некуда будет отнести.
 *
 * Клавиатура: стрелки листают подсказки, Enter добавляет выбранную или
 * введённую вручную, Esc закрывает список, Backspace в пустом поле снимает
 * последний тег.
 */
export function TagPicker({ id, label, value, onChange, suggestions, max = 5, hint }: TagPickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFull = value.length >= max;

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return suggestions
      .filter((tag) => !value.includes(tag))
      .filter((tag) => (normalized ? tag.toLowerCase().includes(normalized) : true))
      .slice(0, 6);
  }, [query, suggestions, value]);

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase();
    if (!clean || isFull || value.includes(clean)) return;
    onChange([...value, clean]);
    setQuery('');
    setActiveIndex(0);
  }

  function removeTag(tag: string) {
    onChange(value.filter((item) => item !== tag));
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault(); // иначе Enter отправит всю форму
      const suggestion = isOpen ? matches[activeIndex] : undefined;
      addTag(suggestion ?? query);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index + 1) % Math.max(matches.length, 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + matches.length) % Math.max(matches.length, 1));
      return;
    }
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'Backspace' && query === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-display text-caption font-semibold text-ink">
          {label}
        </label>
        <span className="shrink-0 text-[13px] text-muted">
          {value.length} / {max}
        </span>
      </div>

      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {value.map((tag) => (
            <li key={tag}>
              <span className="flex h-11 items-center gap-1 rounded-ctl border border-forum bg-forum-soft pl-3 pr-1 text-caption font-medium text-forum-strong">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Убрать тег ${tag}`}
                  className="flex h-9 w-9 items-center justify-center rounded-ctl transition-colors hover:bg-surface"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={query}
          disabled={isFull}
          placeholder={isFull ? `Добавлено ${max} тегов — достаточно` : 'Начните вводить: стирка, счётчики…'}
          aria-describedby={`${id}-hint`}
          aria-expanded={isOpen && matches.length > 0}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          // Закрываем список с задержкой: без неё click по подсказке
          // не успевает сработать — blur снимает её раньше
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
          className="h-12 w-full rounded-ctl border border-line bg-surface px-4 text-body text-ink placeholder:text-muted transition-colors hover:border-[#DCD3C6] focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:bg-paper"
        />

        {isOpen && matches.length > 0 && !isFull && (
          <ul className="absolute left-0 right-0 top-[52px] z-20 overflow-hidden rounded-card border border-line bg-surface py-1 shadow-lift">
            {matches.map((tag, index) => (
              <li key={tag}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => addTag(tag)}
                  className={cn(
                    'flex h-11 w-full items-center px-4 text-left text-caption transition-colors',
                    index === activeIndex ? 'bg-accent-soft text-accent-strong' : 'text-muted-strong',
                  )}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p id={`${id}-hint`} className="mt-1.5 text-caption text-muted">
        {hint ?? 'Выберите из подсказок или введите свой тег и нажмите Enter'}
      </p>
    </div>
  );
}
