import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  /** Последняя крошка без to — это текущая страница */
  to?: string;
}

/**
 * Хлебные крошки. Семантика важна: nav > ol > li, текущая страница помечена
 * aria-current="page". На мобильном строка прокручивается по горизонтали,
 * чтобы длинные названия не ломали вёрстку.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="overflow-x-auto">
      <ol className="flex items-center gap-1 whitespace-nowrap py-3 text-caption text-muted-strong">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="rounded px-1 py-2 transition-colors hover:text-accent-strong"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="px-1 py-2 font-medium text-ink" aria-current="page">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-line" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
