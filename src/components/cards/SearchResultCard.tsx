import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle } from 'lucide-react';
import type { SearchResult } from '../../lib/search';
import { Highlight } from '../ui/Highlight';
import { Chip } from '../ui/Chip';

/**
 * Результат поиска. Статьи и темы показываются одной карточкой, но
 * различаются меткой и цветом: иначе в смешанном списке невозможно понять,
 * куда ведёт ссылка — в готовую инструкцию или в чужой вопрос.
 */
export function SearchResultCard({
  result,
  query,
  index = 0,
}: {
  result: SearchResult;
  query: string;
  index?: number;
}) {
  const isArticle = result.kind === 'article';
  const Icon = isArticle ? BookOpen : MessageCircle;

  return (
    <article className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}>
      <Link
        to={result.href}
        className="block rounded-card border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
        style={{ borderColor: undefined }}
      >
        <div className="flex flex-wrap items-center gap-2 text-caption">
          <span
            className={`flex items-center gap-1.5 rounded-ctl px-2 py-1 font-semibold ${
              isArticle ? 'bg-accent-soft text-accent-strong' : 'bg-forum-soft text-forum-strong'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {isArticle ? 'Статья' : 'Обсуждение'}
          </span>
          {result.roomTitle && (
            <span className="text-muted">
              {result.roomTitle}, {result.itemTitle}
            </span>
          )}
          <span className="ml-auto text-muted">{result.meta}</span>
        </div>

        <h3 className="mt-3 text-h3 text-ink">
          <Highlight text={result.title} query={query} />
        </h3>

        <p className="mt-1.5 line-clamp-2 text-caption text-muted">
          <Highlight text={result.excerpt} query={query} />
        </p>

        {result.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {result.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} tone={isArticle ? 'neutral' : 'forum'}>
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
