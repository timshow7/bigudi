import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '../ui/Checkbox';
import { Chip } from '../ui/Chip';
import { cn } from '../../lib/cn';

/** Флаги формата статьи — совпадают с полями Article */
export interface FormatFilters {
  forNovice: boolean;
  hasSteps: boolean;
  hasPhoto: boolean;
  short: boolean;
}

export const emptyFormatFilters: FormatFilters = {
  forNovice: false,
  hasSteps: false,
  hasPhoto: false,
  short: false,
};

interface FilterPanelProps {
  /** Темы внутри предмета: «Режимы стирки», «Самоочистка и уход»… */
  topics: string[];
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
  formats: FormatFilters;
  onToggleFormat: (key: keyof FormatFilters, value: boolean) => void;
  onReset: () => void;
  /** Сколько фильтров сейчас выбрано — показываем в заголовке */
  activeCount: number;
  /** Сколько статей подходит — считает родитель, панель только отображает */
  resultCount: number;
  disabled?: boolean;
}

const formatLabels: Array<{ key: keyof FormatFilters; label: string }> = [
  { key: 'forNovice', label: 'Для новичков' },
  { key: 'hasSteps', label: 'Пошагово' },
  { key: 'hasPhoto', label: 'С фото' },
  { key: 'short', label: 'Коротко, до 5 минут' },
];

/**
 * Фильтры. На десктопе — липкая колонка слева, на мобильном сворачиваются
 * в одну кнопку: иначе пользователь листает полэкрана чекбоксов,
 * прежде чем добраться до самих статей.
 */
export function FilterPanel({
  topics,
  selectedTopics,
  onToggleTopic,
  formats,
  onToggleFormat,
  onReset,
  activeCount,
  resultCount,
  disabled = false,
}: FilterPanelProps) {
  const [isOpenOnMobile, setOpenOnMobile] = useState(false);

  return (
    <div className="lg:sticky lg:top-[88px]">
      {/* Кнопка-переключатель только для мобильных */}
      <button
        type="button"
        onClick={() => setOpenOnMobile((open) => !open)}
        aria-expanded={isOpenOnMobile}
        aria-controls="filters-body"
        className="flex h-12 w-full items-center justify-between rounded-ctl border border-line bg-surface px-4 font-display font-semibold text-ink lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-[18px] w-[18px] text-muted" aria-hidden="true" />
          Фильтры
          {activeCount > 0 && (
            <span className="rounded-full bg-accent-strong px-2 py-0.5 text-[12px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-caption font-normal text-muted">{isOpenOnMobile ? 'скрыть' : 'показать'}</span>
      </button>

      <div
        id="filters-body"
        className={cn(
          'rounded-card border border-line bg-surface p-5',
          'mt-3 lg:mt-0 lg:block',
          isOpenOnMobile ? 'block' : 'hidden',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <div className="mb-4 hidden items-center justify-between lg:flex">
          <h2 className="text-h3 text-ink">Фильтры</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="rounded px-1 text-caption text-muted transition-colors hover:text-accent-strong"
            >
              Сбросить
            </button>
          )}
        </div>

        <fieldset className="border-0 p-0">
          <legend className="mb-2 font-display text-caption font-semibold text-muted-strong">
            Тема
          </legend>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Chip
                key={topic}
                selected={selectedTopics.includes(topic)}
                onToggle={() => onToggleTopic(topic)}
              >
                {topic}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6 border-0 p-0">
          <legend className="mb-1 font-display text-caption font-semibold text-muted-strong">
            Формат
          </legend>
          <div className="flex flex-col">
            {formatLabels.map(({ key, label }) => (
              <Checkbox
                key={key}
                label={label}
                checked={formats[key]}
                onChange={(checked) => onToggleFormat(key, checked)}
              />
            ))}
          </div>
        </fieldset>

        <p className="mt-5 border-t border-line pt-4 text-caption text-muted" aria-live="polite">
          Подходит статей: {resultCount}
        </p>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="mt-2 h-11 w-full rounded-ctl text-caption text-muted transition-colors hover:bg-paper hover:text-accent-strong lg:hidden"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
}
