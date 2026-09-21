import { Link } from 'react-router-dom';
import { CheckCircle2, Eye, MessageCircle } from 'lucide-react';
import type { ForumTopic } from '../../types';
import { Chip } from '../ui/Chip';
import { plural } from '../../lib/format';

/**
 * Карточка темы форума. Отличается от карточки статьи намеренно:
 * без обложки, компактнее, со счётчиком ответов слева — чтобы на вкладке
 * «Обсуждения» сразу было видно, что это другой тип контента.
 */
export function TopicCard({ topic, index = 0 }: { topic: ForumTopic; index?: number }) {
  return (
    <article
      className="animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}
    >
      <Link
        to={`/forum/${topic.id}`}
        className="flex gap-4 rounded-card border border-line bg-surface p-5 transition-all duration-200 hover:border-forum hover:shadow-soft"
      >
        <div className="hidden w-16 shrink-0 flex-col items-center justify-center rounded-ctl bg-forum-soft py-2 text-forum-strong sm:flex">
          <span className="font-display text-h3 font-bold leading-none">{topic.answers}</span>
          <span className="mt-1 text-[12px]">{plural(topic.answers, ['ответ', 'ответа', 'ответов'])}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="text-h3 text-ink">{topic.title}</h3>
            {topic.solved && (
              <span className="mt-1 flex shrink-0 items-center gap-1 text-caption text-forum-strong">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">есть решение</span>
                <span className="sr-only sm:hidden">есть решение</span>
              </span>
            )}
          </div>

          <p className="mt-1.5 line-clamp-2 text-caption text-muted">{topic.excerpt}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {topic.tags.map((tag) => (
              <Chip key={tag} tone="forum">
                {tag}
              </Chip>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-caption text-muted">
            <span>{topic.author}</span>
            <span className="flex items-center gap-1.5 sm:hidden">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {topic.answers}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {topic.views}
            </span>
            <span className="ml-auto">{topic.lastActivity}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
