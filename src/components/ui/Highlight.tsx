interface HighlightProps {
  text: string;
  /** Поисковый запрос: разбивается на слова, каждое подсвечивается отдельно */
  query: string;
}

/** Экранируем спецсимволы, иначе запрос вроде «что(» уронит RegExp */
function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Подсветка совпадений в результатах поиска.
 * Текст режется регуляркой на куски, совпадения оборачиваются в <mark>.
 * Цвет у <mark> свой, тёплый: жёлтый по умолчанию выбивается из палитры.
 */
export function Highlight({ text, query }: HighlightProps) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 1)
    .map(escapeForRegExp);

  if (words.length === 0) return <>{text}</>;

  const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
  const lowered = words.map((word) => word.toLowerCase());

  return (
    <>
      {parts.map((part, index) =>
        lowered.includes(part.toLowerCase()) ? (
          <mark key={index} className="rounded-[4px] bg-accent-soft px-0.5 text-accent-strong">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
