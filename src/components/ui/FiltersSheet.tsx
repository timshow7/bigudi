import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface FiltersSheetProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** Сколько фильтров выбрано — показываем счётчиком на кнопке */
  activeCount: number;
  onReset: () => void;
  children: ReactNode;
}

/**
 * Фильтры в двух видах.
 *
 * На экране от 1024px — обычная колонка слева. Уже — кнопка «Фильтры»
 * и шторка снизу: на 375px фильтры занимали бы весь первый экран,
 * и до результатов пришлось бы долго листать.
 *
 * Разметка при этом одна: содержимое передаётся через children
 * и не дублируется для мобильной и десктопной версии.
 */
export function FiltersSheet({ isOpen, onOpen, onClose, activeCount, onReset, children }: FiltersSheetProps) {
  // Пока шторка открыта: Esc закрывает, фон не прокручивается
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Кнопка вызова — только на узких экранах */}
      <button
        type="button"
        onClick={onOpen}
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
        <span className="text-caption font-normal text-muted">выбрать</span>
      </button>

      {/* Десктоп: фильтры просто стоят в колонке */}
      <div className="hidden lg:sticky lg:top-[88px] lg:block">
        <div className="rounded-card border border-line bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
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
          {children}
        </div>
      </div>

      {/* Мобильный: шторка снизу */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Фильтры поиска"
            className="relative max-h-[85vh] overflow-y-auto rounded-t-[20px] border-t border-line bg-surface p-5 pb-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-h2 text-ink">Фильтры</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть фильтры"
                className="flex h-11 w-11 items-center justify-center rounded-ctl text-muted transition-colors hover:bg-paper hover:text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {children}

            <div className="mt-6 flex gap-3">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-12 flex-1 rounded-ctl border border-line text-caption font-semibold text-muted-strong"
                >
                  Сбросить
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="h-12 flex-1 rounded-ctl bg-accent-strong font-display font-semibold text-white"
              >
                Показать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
